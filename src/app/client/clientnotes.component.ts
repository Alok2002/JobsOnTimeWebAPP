import { Component, Input, OnInit, ViewChild, ViewEncapsulation, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import { saveAs } from 'file-saver';
import * as JWT from 'jwt-decode';
import * as moment from 'moment';
import { CookieService } from 'ngx-cookie-service';
import swal from 'sweetalert2';

import { Client } from '../models/client';
import { Note } from '../models/note';
import { ClientServices } from '../services/client.services';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SharedServices } from '../services/shared.services';
import { SecurityRights, SecurityRightsExportError } from '../shared/enum';
import { PtableColumn } from '../models/ptablecolumn';
import { LazyLoadEvent } from 'primeng/api';

declare var jQuery: any;

@Component({
  selector: 'ClientNotesComponent',
  templateUrl: './clientnotes.component.html',
})

export class ClientNotesComponent implements OnInit {
  client: Client;
  @Input() id: number;
  @Input() isUpdateClient: boolean;
  @Input() isAccountContact: boolean;
  isLoading = true;
  isSubmitFormSpinner = false;
  isSubmitForm = false;
  notes: Array<Note>;
  note: Note;

  deleteItemIds = [];

  @ViewChild("closeAddNewModal") closeAddNewModal;
  @ViewChild("checkBox") checkBox;

  selected = [];

  noteTypes = [];

  dataTablesParameters: any;
  totalItems = 0;

  saveQueryName: string;
  maxrecords: any = null;
  filters: any;
  @ViewChild("saveQueryBtn") saveQueryBtn;

  @ViewChild("saveQueryCancelBtn") saveQueryCancelBtn;
  isUpdateFiler = true;

  loginusername: string;
  loginnameid: string;
  categories = [];
  notesActionList = [];
  isChangeActionStatus = false;

  noofrows = 50;
  selectedColumns: Array<PtableColumn> = [];
  cols: Array<PtableColumn> = [];
  selectedRowData = [];
  ptablesearch: string;
  isShowFilter = true;
  totalRecords = 0;
  colVisData = [];

  @ViewChild('container', { read: ViewContainerRef })
  public containerRef: ViewContainerRef;
  selectedFilterId = null;

  constructor(private router: Router, private securityInfoResolve: SecurityInfoResolve,
    private _clientService: ClientServices, private sharedService: SharedServices,
    private cookieService: CookieService) {
  }

  ngOnInit() {
    this.getNotes();
    this.addNew();
    this.getNotesTypeList();
    this.getCategories();
    this.getNotesActionList();
  }

  getNotes() {
    this.cols = [
      { field: 'date', header: 'Date', index: 0, width: '100', sort: true },
      { field: 'time', header: 'Time', index: 1, width: '75', sort: false },
      { field: 'type', header: 'Type', index: 2, width: '150', sort: false },
      { field: 'expiryDate', header: 'Expiry Date', index: 3, width: '100', sort: false },
      { field: 'userFullName', header: 'Username', index: 4, width: '150', sort: false },
      { field: 'summary', header: 'Summary', index: 5, width: 'auto', sort: false },
      { field: 'showInClientPortal', header: 'Show In Client Portal', index: 6, width: '150', sort: false, textAlign: 'center' },
      { field: 'category', header: 'Category', index: 7, width: '120', sort: false },
      { field: 'accessType', header: 'Access Type', index: 8, width: '120', sort: false },
      { field: 'actionStatus', header: 'Action Status', index: 8, width: '120', sort: false },
      { field: 'dateActioned', header: 'Date Actioned', index: 9, width: '125', sort: false, textAlign: 'center' },
      { field: 'actionedByFullName', header: 'Actioned By', index: 10, width: '150', sort: false }
    ];

    this.selectedColumns = this.cols;
  }

  loadData(event: LazyLoadEvent) {
    if (!event.sortField) { event.sortField = "id" }
    if (!event.sortOrder) { event.sortOrder = -1 }
    this.sharedService.getDataWithFilter(event, this.colVisData, this.maxrecords, this.filters, "client-notes", this.id)
      .subscribe((resp: any) => {
        // debugger;
        this.notes = resp.value;
        console.log(resp);
        this.totalRecords = resp.totalCount;
      });
  }

  getNotesTypeList() {
    this.sharedService.getReferenceDataProvider('ClientNotesType')
      .subscribe((res: any) => {
        this.noteTypes = res.value;
      });
  }

  addNew() {
    this.note = new Note();
    if (this.isAccountContact) this.note.type = 'Accounts';
    this.initFocus();
  }

  ngAfterViewInit() {
    this.initFocus();
  }

  initFocus() {
    if (typeof jQuery != 'undefined') {
      jQuery('#add-new-notes-modal').on('shown.bs.modal', function () {
        jQuery('#notes').focus();
      });

      jQuery('#save-job-query-modal').on('shown.bs.modal', function () {
        jQuery('#queryname').focus();
      });
    }
  }

  deleteNotes() {
    this.deleteItemIds = [];
    this.selectedRowData.forEach(rd => {
      this.deleteItemIds.push(rd.id);
    })
    if (this.deleteItemIds.length > 0) {
      swal({
        title: 'Are you sure?',
        text: 'You will not be able to recover this item!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        confirmButtonColor: '#ffaa00',
        cancelButtonText: 'No, keep it'
      }).then((result) => {
        if (result.value) {

          this._clientService.deleteClientNotes(this.deleteItemIds)
            .subscribe((res: any) => {
              if (res.succeeded) {
                this.deleteItemIds = [];
                this.loadData({ first: 0, rows: this.noofrows });

                for (var i = 0; i < this.notes.length; i++) {
                  this.selected[i] = false;
                }
                swal(
                  'Deleted!',
                  'Selected item has been deleted.',
                  'success'
                )
              } else {
                var err = "";
                res.errors.forEach((er) => {
                  err = err + " " + er;
                });
                swal(
                  'Error!',
                  err,
                  'error'
                )
              }
            });
          // result.dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
        } else if (result.dismiss === swal.DismissReason.cancel) {
          swal(
            'Cancelled',
            'Selected item is safe :)',
            'error'
          )
        }
      });
    }
    else {
      swal(
        'Oops...',
        'Please select an item to delete.',
        'info'
      )
    }
  }


  submitClientNotes(form) {
    console.log(form);
    this.isSubmitForm = true;
    this.isSubmitFormSpinner = true;
    if (form.invalid) {
      //this.isSubmitForm = false;
      this.isSubmitFormSpinner = false;
    }
    else {
      this.note.clientId = this.id;
      //this.note.username = "Ram";
      this._clientService.postClientNote(this.note)
        .subscribe((res: any) => {
          console.log(res);
          this.isSubmitFormSpinner = false;
          this.isSubmitForm = false;
          if (res.succeeded) {
            this.closeAddNewModal.nativeElement.click();
            this.loadData({ first: 0, rows: this.noofrows });
          }
          else {
            var err = "";
            res.errors.forEach((er) => {
              err = err + " " + er;
            });
            swal(
              'Error!',
              err,
              'error'
            )
          }
        });
    }
  }

  updateDeleteList(id: number, e) {
    if (e.target.checked) {
      this.deleteItemIds.push(id);
    }
    else {
      this.deleteItemIds.forEach((di, i) => {
        if (di == id) {
          this.deleteItemIds.splice(i, 1);
        }
      });
    }
  }

  selectAll(e) {
    if (e.target.checked) {
      this.notes.forEach((item) => {
        this.deleteItemIds.push(item.id);
      });
    }
    else {
      this.deleteItemIds = [];
    }

    for (var i = 0; i < this.notes.length; i++) {
      this.selected[i] = e.target.checked;
    }
  }

  editNotes(id) {
    this.notes.forEach((item) => {
      if (item.id == id) {
        this.note = item;
        if (this.note.expiryDate)
          this.note.expiryDate = moment(this.note.expiryDate).toDate();
      }
    });
    this.initFocus();
  }

  exporttoExcel() {
    this.securityInfoResolve.checkPermission(SecurityRights.ExportAllResults)
      .subscribe((res: any) => {
        if (res.succeeded) {
          this.exporttoExcelHelper();
        } else {
          /*var err = "";
          res.errors.forEach((er) => {
            err = err + " " + er;
          });*/
          swal(
            'Access Denied!',
            SecurityRightsExportError,
            'error'
          )
        }
      })
  }

  exporttoExcelHelper() {
    const workbook = new Excel.Workbook();
    var sheet = workbook.addWorksheet('My Sheet');

    sheet.columns = [
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Time', key: 'date', width: 15 },
      { header: 'Type', key: 'type', width: 30 },
      { header: 'Expiry Date', key: 'expiryDate', width: 30 },
      { header: 'User', key: 'username', width: 30 },
      { header: 'Summary', key: 'summary', width: 50 },
      { header: 'Show In Client Portal', key: 'showInClientPortal', width: 50 },
    ];

    this.notes.forEach((am) => {
      var dataobj = {};
      //sheet
      sheet.columns.forEach(cl => {
        if (cl.key == 'date') {
          var cdate = moment(am[cl.key]).format('DD/MM/YYYY');
          dataobj[cl.key] = cdate;
        }
        else
          dataobj[cl.key] = am[cl.key];
      });

      sheet.addRow(dataobj);
    });

    sheet.getRow('1').font = {
      size: 14,
      bold: true
    };

    var filename = "Client Notes.xlsx";
    /* save to file */
    workbook.xlsx.writeBuffer().then(function (data) {
      saveAs(new Blob([data], { type: 'application/octet-stream' }), filename);
    });
  }

  filterSubmit(res) {
    console.log(res);
    this.isLoading = true;
    this.filters = res.filters;
    this.maxrecords = res.maxrecords;
    this.sharedService.getDataWithFilter(null, null, res.maxrecords, this.filters, "client-notes", this.id)
      .subscribe((resp: any) => {
        this.notes = resp.value;
        console.log(resp);

        this.isLoading = false;
        this.loadData({ first: 0, rows: this.noofrows });
      });
  }

  filtersEmit(res) {
    console.log(res);
    this.filters = res;
  }

  openSaveQueryModal() {
    this.saveQueryName = "";
    if (this.filters && this.filters.length > 0) {
      this.saveQueryBtn.nativeElement.click()
    }
    else {
      swal(
        'Oops...',
        'Select at least one filter to save query.',
        'info'
      )
    }
  }

  saveQuery(form) {
    this.isUpdateFiler = false;
    this.isSubmitForm = true;
    if (!form.invalid) {
      this.sharedService.saveQuery('client-note', null, '', this.saveQueryName, this.filters)
        .subscribe((res: any) => {
          if (res.succeeded) {
            this.selectedFilterId = res.value;
            this.isUpdateFiler = true;
            this.saveQueryCancelBtn.nativeElement.click();
            /*swal('Successfully Saved!',
              '',
              'success');*/
          }
          else {
            var err = "";
            res.errors.forEach((er) => {
              err = err + " " + er;
            });
            swal(
              'Error!',
              err,
              'error'
            )
          }
        })
    }
  }

  getLoginUserDetails() {
    var token = JWT(this.cookieService.get('auth_token'));
    console.log(token);
    // this.loginuserrole = token["actort"];
    this.loginusername = token["unique_name"];
    this.loginnameid = token["nameid"];
    // if(this.loginuserrole) this.loginuserrole = this.loginuserrole.toLowerCase();
  }

  updateClientNotes(nt: Note) {
    if (this.isChangeActionStatus) {
      nt.actionedBy = this.loginnameid;
      nt.actionedByFullName = this.loginusername;
      //nt.dateActioned = new Date().toString();
      nt.dateActioned = moment().format().toString();
      this.isChangeActionStatus = false;
    }

    console.log(nt);
    this._clientService.updateClientNote(nt)
      .subscribe((res: any) => {
        console.log(res);
        if (res.succeeded) {
          this.loadData({ first: 0, rows: this.noofrows });
        }
        else {
          var err = "";
          res.errors.forEach((er) => {
            err = err + " " + er;
          });
          swal(
            'Error!',
            err,
            'error'
          )
        }
      })
  }

  getCategories() {
    this.sharedService.getReferenceDataProvider('ElectronicDocumentCategory')
      .subscribe((res: any) => {
        this.categories = res.value;
        console.log(res);
      })
  }

  getNotesActionList() {
    this.sharedService.getDocumentActionList()
      .subscribe((res: any) => {
        console.log(res);
        this.notesActionList = res.value;
      });
  }

  updateSelectedColumnsIndex() {
    this.selectedColumns.sort((a, b) => {
      if (a.index > b.index) return 1;
      if (a.index < b.index) return -1;
      return 0;
    })
  }
}
