import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import { saveAs } from 'file-saver';
import * as JWT from 'jwt-decode';
import * as moment from 'moment';
import { CookieService } from 'ngx-cookie-service';
import swal from 'sweetalert2';

import { apiHost } from '../app.component';
import { Documents } from '../models/documents';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SecurityRights, SecurityRightsExportError } from '../shared/enum';
import { DocumentServices } from '../services/document.services';
import { SharedServices } from '../services/shared.services';
import { PtableColumn } from '../models/ptablecolumn';
import { LazyLoadEvent } from 'primeng/api';

declare var jQuery: any;
//import { UploadEvent, UploadFile } from 'ngx-file-drop';

@Component({
  selector: 'ClientQuoteComponent',
  templateUrl: './clientquote.component.html',
})

export class ClientQuoteComponent implements OnInit {
  apiHost = apiHost;
  @Input() id: number;
  @Input() isUpdateClient: boolean;
  isLoading = true;
  isSubmitFormSpinner = false;
  isSubmitForm = false;
  docs: Array<Documents>;
  doc: Documents;

  deleteItemIds = [];

  @ViewChild("closeAddNewModal")
  closeAddNewModal;
  @ViewChild("checkBox")
  checkBox;

  selected = [];

  submitResults = [];
  allowedTypes: any;
  isUploadingDoc = false;

  saveQueryName: string;
  maxrecords: any = null;
  filters: any;
  @ViewChild("saveQueryBtn") saveQueryBtn;

  dataTablesParameters: any;
  totalItems = 0;

  categories = [];
  loginusername: string;
  loginnameid: string;

  documentActionList = [];

  @ViewChild("saveQueryCancelBtn") saveQueryCancelBtn;
  isUpdateFiler = true;

  entity = 'clientQuote';
  isChangeActionStatus = false;

  noofrows = 50;
  selectedColumns: Array<PtableColumn> = [];
  cols: Array<PtableColumn> = [];
  selectedRowData = [];
  ptablesearch: string;
  isShowFilter = true;
  totalRecords = 0;
  colVisData = [];
  selectedFilterId = null;

  constructor(private router: Router, private _docService: DocumentServices,
    private sharedService: SharedServices, private cookieService: CookieService, private securityInfoResolve: SecurityInfoResolve) {
  }

  ngOnInit() {
    this.getDocuments(this.id);
    this.getCategories();
    this.getLoginUserDetails();
    this.getDocumentActionList();
  }

  getDocuments(id) {
    this.cols = [
      { field: 'date', header: 'Date', index: 0, width: '100', sort: true },
      { field: 'time', header: 'Time', index: 1, width: '75', sort: false },
      { field: 'isPreviousVersion', header: 'Old', index: 2, width: '50', sort: false, textAlign: 'center' },
      { field: 'userFullName', header: 'Username', index: 3, width: '150', sort: false },
      { field: 'documentName', header: 'Document Name', index: 4, width: 'auto', sort: false },
      { field: 'category', header: 'Category', index: 5, width: '120', sort: false },
      { field: 'accessType', header: 'Access Type', index: 6, width: '120', sort: false },
      { field: 'actionStatus', header: 'Action Status', index: 7, width: '120', sort: false },
      { field: 'dateActioned', header: 'Date Actioned', index: 8, width: '125', sort: false, textAlign: 'center' },
      { field: 'actionedByFullName', header: 'Actioned By', index: 9, width: '150', sort: false }
    ];

    this.selectedColumns = this.cols;
  }

  loadData(event: LazyLoadEvent) {
    if (!event.sortField) { event.sortField = "name" }
    if (!event.sortOrder) { event.sortOrder = 1 }
    console.log(event);
    this.sharedService.getDataWithFilter(event, this.colVisData, this.maxrecords, this.filters, this.entity, this.id)
      .subscribe((resp: any) => {
        // debugger;
        this.docs = resp.value;
        this.totalRecords = resp.totalCount;
        console.log(this.docs);
      });
  }

  addNew() {
    this.doc = new Documents();
  }

  ngAfterViewInit() {
    if (typeof jQuery != 'undefined') {
      jQuery('#save-job-query-modal').on('shown.bs.modal', function () {
        jQuery('#queryname').focus();
      })
    }
  }

  editDocument(id) {
    this.docs.forEach((item) => {
      if (item.id == id) {
        this.doc = item;
      }
    });
  }

  deleteDocuments() {
    this.deleteItemIds = [];
    this.selectedRowData.forEach(rd => {
      this.deleteItemIds.push(rd.id);
    })

    //if(this.checkPermission()){
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
          this._docService.deleteClientDocument(this.deleteItemIds)
            .subscribe((res: any) => {
              if (res.succeeded) {
                this.deleteItemIds = [];
                this.loadData({ first: 0, rows: this.noofrows });

                for (var i = 0; i < this.docs.length; i++) {
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
          );
        }
      });
    } else {
      swal(
        'Oops...',
        'Please select an item to delete.',
        'info'
      );
    }
    //}
  }

  onUploadFiles(evt: any) {
    this.isUploadingDoc = true;

    if (evt.error) {
      throw evt.error;
    }

    const files = evt.files;
    this.submitClientNotes(files);
    // You can run upload script here
  }

  submitClientNotes(files) {
    var docData = { 'parentId': this.id, 'parentTableName': 'Client' };
    console.log(this.submitResults);
    this._docService.postClientDocument(docData, files)
      .subscribe((res: any) => {
        this.isUploadingDoc = false;
        this.loadData({ first: 0, rows: this.noofrows });

        if (res.succeeded) {
          this.submitResults.forEach((sr) => {
            sr.status = "Success";
          });
        } else {
          this.submitResults.forEach((sr) => {
            sr.status = "Failed";
          });
        }
      });
  }

  checkFileType(file) {
    if (file != null) {
      file = file.toLowerCase();
      var filetype = file.split(".")[1];
      if (filetype != null)
        filetype = filetype.toLowerCase();

      if (filetype == 'png' || filetype == 'jpeg' || filetype == 'jpg' || filetype == 'gif') {
        return '<i class="fa fa-file-image-o"></i>';
      }
      else if (filetype == 'xls' || filetype == 'xlsx') {
        return '<i class="fa fa-file-excel-o text-success"></i>';
      }
      else if (filetype == 'doc' || filetype == 'docx') {
        return '<i class="fa fa-file-word-o text-info"></i>';
      }
      else if (filetype == 'pdf') {
        return '<i class="fa fa-file-pdf-o text-danger"></i>';
      }
      else {
        return '<i class="fa fa-file text-success"></i>';
      }
    }
    return null;
  }

  exportCheckFileType(file) {
    if (file != null) {
      file = file.toLowerCase();
      var filetype = file.split(".")[1];
      filetype = filetype.toLowerCase();

      if (filetype == 'png' || filetype == 'jpeg' || filetype == 'jpg' || filetype == 'gif') {
        return 'Image';
      }
      else if (filetype == 'xls' || filetype == 'xlsx') {
        return 'Excel';
      }
      else if (filetype == 'doc' || filetype == 'docx') {
        return 'Document';
      }
      else if (filetype == 'pdf') {
        return 'Pdf';
      }
      else {
        return 'Other';
      }
    }
  }

  exporttoExcel() {
    this.securityInfoResolve.checkPermission(SecurityRights.ExportAllResults)
      .subscribe((res: any) => {
        if (res.succeeded) {
          this.exporttoExcelHelper();
        } else {
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
      { header: 'Date', key: 'dateCreated', width: 15 },
      { header: 'Old', key: 'isPreviousVersion', width: 15 },
      { header: 'Type', key: 'type', width: 15 },
      { header: 'Document Name', key: 'name', width: 30 }
    ];

    this.docs.forEach((am) => {
      var dataobj = {};
      //sheet
      sheet.columns.forEach(cl => {
        if (cl.key == 'type')
          dataobj[cl.key] = this.exportCheckFileType(am['name']);
        else if (cl.key == 'isPreviousVersion') {
          if (am[cl.key])
            dataobj[cl.key] = 'Yes';
          else
            dataobj[cl.key] = 'No';
        }
        else if (cl.key == 'dateCreated') {
          var date = moment(am[cl.key]).format('DD/MM/YYYY');
          dataobj[cl.key] = date;
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

    var filename = "Client Documents.xlsx";
    /* save to file */
    workbook.xlsx.writeBuffer().then(function (data) {
      saveAs(new Blob([data], { type: 'application/octet-stream' }), filename);
    });
  }

  getCategories() {
    this.sharedService.getReferenceDataProvider('ElectronicDocumentCategory')
      .subscribe((res: any) => {
        this.categories = res.value;
        console.log(res);
      })
  }

  updateDocument(doc) {
    if (this.isChangeActionStatus) {
      doc.actionedBy = this.loginnameid;
      doc.actionedByFullName = this.loginusername;
      doc.dateActioned = new Date();
      this.isChangeActionStatus = false;
    }

    this._docService.updateDocument(doc)
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

  filterSubmit(res) {
    console.log(res);
    this.filters = res.filters;
    this.maxrecords = res.maxrecords;
    this.loadData({ first: 0, rows: this.noofrows });
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
      this.sharedService.saveQuery(this.entity, null, '', this.saveQueryName, this.filters)
        .subscribe((res: any) => {
          console.log(res);
          if (res.succeeded) {
            this.selectedFilterId = res.value;
            this.isUpdateFiler = true;
            this.saveQueryCancelBtn.nativeElement.click();
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

  getLoginUserDetails() {
    var token = JWT(this.cookieService.get('auth_token'));
    console.log(token);
    // this.loginuserrole = token["actort"];
    this.loginusername = token["unique_name"];
    this.loginnameid = token["nameid"];
    // if(this.loginuserrole) this.loginuserrole = this.loginuserrole.toLowerCase();
  }

  downloadDocument(id) {
    this.sharedService.downloadDocument(id);
  }

  getDocumentActionList() {
    this.sharedService.getDocumentActionList()
      .subscribe((res: any) => {
        console.log(res);
        this.documentActionList = res.value;
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
