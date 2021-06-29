import { CookieService } from 'ngx-cookie-service';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router, NavigationEnd, RoutesRecognized } from '@angular/router';
import { ClientContact } from '../models/clientcontact';
import { Client } from '../models/client';
import { Note } from '../models/note';
declare var jQuery: any;
import swal from 'sweetalert2';

import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as stream from 'stream';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import { SecurityRights, SecurityRightsExportError } from '../shared/enum';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import * as JWT from 'jwt-decode';
import { SharedServices } from '../services/shared.services';
import { ClientServices } from '../services/client.services';
import { PtableColumn } from '../models/ptablecolumn';

@Component({
  selector: 'ClientAccountComponent',
  templateUrl: './clientaccount.component.html'
})

export class ClientAccountComponent implements OnInit {
  client: Client;
  @Input() id: number;
  @Input() isUpdateClient: boolean;
  isLoading = true;
  isAccountContact = true;

  notes: Array<Note>;
  note: Note;

  saveQueryName: string;
  maxrecords: any = null;
  filters: any;
  @ViewChild("saveQueryBtn") saveQueryBtn;

  deleteItemIds = [];
  selected = [];
  noteTypes = [];
  isSubmitForm = false;
  isSubmitFormSpinner = false;
  @ViewChild("closeAddNewModal") closeAddNewModal;

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

  constructor(private clientSevice: ClientServices, private router: Router,
    private sharedService: SharedServices, private securityInfoResolve: SecurityInfoResolve,
    private cookieService: CookieService) { }

  ngOnInit() {
    this.cols = [
      { field: 'date', header: 'Date', index: 0, width: '100', sort: true },
      { field: 'time', header: 'Time', index: 1, width: '75', sort: false },
      { field: 'type', header: 'Type', index: 2, width: '150', sort: false },
      { field: 'username', header: 'Username', index: 3, width: '150', sort: false },
      { field: 'summary', header: 'Summary', index: 4, width: 'auto', sort: false },
      { field: 'showInClientPortal', header: 'Show In Client Portal', index: 5, width: '150', sort: false, textAlign: 'center' },
      { field: 'category', header: 'Category', index: 6, width: '120', sort: false },
      { field: 'accessType', header: 'Access Type', index: 7, width: '120', sort: false },
      { field: 'actionStatus', header: 'Action Status', index: 8, width: '120', sort: false },
      { field: 'dateActioned', header: 'Date Actioned', index: 9, width: '125', sort: false },
      { field: 'actionedByFullName', header: 'Actioned By', index: 10, width: '150', sort: true },
    ];

    this.selectedColumns = this.cols;

    this.addNew();
    this.getNotesTypeList();
    if (this.id != null && this.isUpdateClient) {
      this.getClient(this.id);
      this.getClientAccountNotes(this.id);
    }

    this.getLoginUserDetails();
    this.getCategories();
    this.getNotesActionList();
  }

  getClient(id) {
    this.clientSevice.getAllClientbyId(this.id)
      .subscribe((res: any) => {
        this.client = res.value;
        console.log(this.client);
        this.isLoading = false;
      });
  }

  updatePOrequired() {
    this.clientSevice.updateClient(this.client)
      .subscribe((res: any) => {
        this.getClient(this.id);
      });
  }


  /**CLIENT NOTES**/
  getClientAccountNotes(id) {
    this.clientSevice.getClientAccountNotes(id)
      .subscribe((res: any) => {
        this.notes = res.value;
        console.log(res)
        console.log(this.notes)
      })
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
      { header: 'User', key: 'username', width: 30 },
      { header: 'Summary', key: 'summary', width: 50 }
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
    // this.isLoading = true;
    this.filters = res.filters;
    this.maxrecords = res.maxrecords;
    this.sharedService.getDataWithFilter(null, null, res.maxrecords, this.filters, "client-note", this.id)
      .subscribe((resp: any) => {
        this.notes = resp.value;
        console.log(resp);

        // this.isLoading = false;
        // this.destroyDataTable();
        // this.dtTrigger.next();
      });
  }

  filtersEmit(res) {
    console.log(res);
    this.filters = res;
  }

  openSaveQueryModal() {
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

  saveQuery() {
    this.sharedService.saveQuery('client-note', null, '', this.saveQueryName, this.filters)
      .subscribe(res => {
        console.log(res);
      })
  }

  addNew() {
    this.note = new Note();
    if (this.isAccountContact) this.note.type = 'Accounts';
    this.initFocus();
  }

  initFocus() {
    if (typeof jQuery != 'undefined') {
      jQuery('#add-new-notes-modal').on('shown.bs.modal', function () {
        jQuery('#notes').focus();
      })
    }
  }

  deleteNotes() {
    //if(this.checkPermission()){
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

          this.clientSevice.deleteClientNotes(this.deleteItemIds)
            .subscribe((res: any) => {
              if (res.succeeded) {
                this.deleteItemIds = [];
                this.getClientAccountNotes(this.id);

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
    //}
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
      }
    });
    this.initFocus();
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

  getNotesTypeList() {
    this.sharedService.getReferenceDataProvider('clientnotestype')
      .subscribe((res: any) => {
        this.noteTypes = res.value;
      });
  }

  submitClientNotes(form) {
    this.isSubmitForm = true;
    this.isSubmitFormSpinner = true;
    if (form.invalid) {
      //this.isSubmitForm = false;
      this.isSubmitFormSpinner = false;
    }
    else {
      this.note.clientId = this.id;
      //this.note.username = "Ram";
      this.clientSevice.postClientNote(this.note)
        .subscribe((res: any) => {
          this.isSubmitFormSpinner = false;
          this.isSubmitForm = false;
          if (res.succeeded) {
            this.closeAddNewModal.nativeElement.click();
            //this.router.navigate(['/client']);
            this.getClientAccountNotes(this.id);
          }
        });
    }
  }

  checkPermission() {
    this.sharedService.checkPermission("ClientAdmin")
      .subscribe((res: any) => {
        console.log(res);
        if (!res.succeeded) {
          swal(
            'Permission Denied',
            res.errors[0],
            'info'
          )
          return false;
        }
        else {
          return true;
        }
      })
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
    this.clientSevice.updateClientNote(nt)
      .subscribe((res: any) => {
        console.log(res);
        if (res.succeeded) {
          this.getClientAccountNotes(this.id);
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

  getLoginUserDetails() {
    var token = JWT(this.cookieService.get('auth_token'));
    console.log(token);
    // this.loginuserrole = token["actort"];
    this.loginusername = token["unique_name"];
    this.loginnameid = token["nameid"];
    // if(this.loginuserrole) this.loginuserrole = this.loginuserrole.toLowerCase();
  }

  updateSelectedColumnsIndex() {
    this.selectedColumns.sort((a, b) => {
      if (a.index > b.index) return 1;
      if (a.index < b.index) return -1;
      return 0;
    })
  }
}
