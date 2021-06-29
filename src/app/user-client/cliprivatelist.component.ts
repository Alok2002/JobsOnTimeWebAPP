import { JobServices } from './../services/job.services';
import { CookieService } from 'ngx-cookie-service';
import { ClientServices } from './../services/client.services';
import { SharedServices } from './../services/shared.services';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { DocumentServices } from '../services/document.services';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { PtableColumn } from '../models/ptablecolumn';
import { Job } from '../models/job';
import { Documents } from '../models/documents';
import { LazyLoadEvent } from 'primeng/api';
import { apiHost } from '../app.component';
import swal from 'sweetalert2';
import * as JWT from 'jwt-decode';
import { ObjectUtils } from 'primeng/components/utils/objectutils';

declare var jQuery: any;

@Component({
  selector: 'CliPrivateListComponent',
  templateUrl: 'cliprivatelist.component.html'
})

export class CliPrivateListComponent implements OnInit {
  apiHost = apiHost;
  id: number;
  //@Input() isUpdateJob: boolean;
  noofrows = 50;
  selectedColumns: Array<PtableColumn> = [];
  cols: Array<PtableColumn> = [];
  selectedRowData: any = [];
  ptablesearch: string;
  isShowFilter = true;
  totalRecords = 0;
  colVisData = [];
  selectedFilterId = null;
  docs: Array<Documents>;
  doc: Documents;
  maxrecords: any = null;
  filters: any = null;

  allowedTypes: any;
  isUploadingDoc = false;
  categories = [];
  submitResults = [];

  entity = 'jobDocument';
  isChangeActionStatus = false;
  loginusername: string;
  loginnameid: string;
  documentActionList = [];
  downloadId: number;
  otp: string;
  isSubmitForm = false;
  clientContactId: number;
  deleteItemIds = [];
  selected = [];
  otperr: string;

  jobs: Array<Job> = [];
  selectedJobId: string = null;
  @ViewChild("downloadModalclosebtn") downloadModalclosebtn: any;

  constructor(private router: Router, private securityInfoResolve: SecurityInfoResolve, private cookieservice: CookieService,
    private _docService: DocumentServices, private sharedService: SharedServices, private clientservice: ClientServices, private jobService: JobServices) {
  }

  ngOnInit() {
    this.getLoginUserData();
  }

  getLoginUserData() {
    var token = JWT(this.cookieservice.get('auth_token'));
    console.log(token);
    this.getClientContactById(token['primarysid']);
  }

  getClientContactById(id) {
    this.clientContactId = id;
    this.clientservice.getClientContactById(id)
      .subscribe((res: any) => {
        console.log(res)
        this.id = res.value.clientId;
        this.getDocuments(id);
        this.getCategories();
        this.getJobsByClient();
      })
  }

  getJobsByClient() {
    var token = JWT(this.cookieservice.get('auth_token'));
    this.jobService.getClientContactJobs(token['primarysid'])
      .subscribe((res: any) => {
        console.log(res)
        this.jobs = res.value;
      })
  }

  getDocuments(id) {
    this.cols = [
      { field: 'datetime', header: 'Date Time', index: 0, width: '125', sort: false },
      // { field: 'time', header: 'Time', index: 1, width: '75', sort: false },
      // { field: 'isPreviousVersion', header: 'Old', index: 2, width: '50', sort: false, textAlign: 'center' },
      { field: 'userFullName', header: 'Staff', index: 3, width: '150', sort: false },
      { field: 'clientContact.fullName', header: 'Client Contact', index: 3, width: '150', sort: false },
      { field: 'jobNameandNumber', header: 'Job', index: 3, width: '300', sort: false },
      { field: 'documentName', header: 'Document Name', index: 4, width: 'auto', sort: false },
      // { field: 'category', header: 'Category', index: 5, width: '120', sort: false },
      // { field: 'accessType', header: 'Access Type', index: 6, width: '120', sort: false },
      // { field: 'actionStatus', header: 'Action Status', index: 7, width: '120', sort: false },
      // { field: 'dateActioned', header: 'Date Actioned', index: 8, width: '125', sort: false, textAlign: 'center' },
      // { field: 'actionedByFullName', header: 'Actioned By', index: 9, width: '150', sort: false }
    ];

    this.selectedColumns = this.cols;
    this.loadData();
  }

  loadData() {
    /*if (!event.sortField) { event.sortField = "dateCreated" }
    if (!event.sortOrder) { event.sortOrder = -1 }

    console.log(event);
    this.sharedService.getDataWithFilter(event, this.colVisData, this.maxrecords, this.filters, "jobDocument", this.id)
      .subscribe((resp: any) => {
        // debugger;
        this.docs = resp.value;
        this.totalRecords = resp.totalCount;
        console.log(this.docs);
      });*/
    this.clientservice.getClientJobPrivateList(this.clientContactId)
      .subscribe((res: any) => {
        console.log(res)
        this.docs = res.value;
        this.totalRecords = this.docs.length;
      })
  }

  getCategories() {
    this.sharedService.getReferenceDataProvider('ElectronicDocumentCategory')
      .subscribe((res: any) => {
        this.categories = res.value;
        console.log(res);
      })
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
    var docData = { 'parentId': this.selectedJobId, 'parentTableName': 'ClientJob', 'clientContactId':this.clientContactId, 'username': 'Admin' };
    if (this.selectedJobId == 'other')
      docData = { 'parentId': this.id.toString(), 'parentTableName': 'Client', 'clientContactId':this.clientContactId, 'username': 'Admin' };
    console.log(docData);

    this.clientservice.uploadPrivateList(docData, files)
      .subscribe((res: any) => {
        this.isUploadingDoc = false;
        this.loadData();

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

  updateSelectedColumnsIndex() {
    this.selectedColumns.sort((a, b) => {
      if (a.index > b.index) return 1;
      if (a.index < b.index) return -1;
      return 0;
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
          this.loadData();
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

  createClientFileDownloadOTP() {
    this.isSubmitForm = false;
    this.otperr = null;
    this.otp = null;

    this.clientservice.createClientFileDownloadOTP(this.clientContactId)
      .subscribe((res: any) => {
        console.log(res)
      })
  }

  validateClientFileDownloadOTP(otpform) {
    this.isSubmitForm = true;
    this.otperr = null;
    if (otpform.valid) {
      this.clientservice.validateClientFileDownloadOTP(this.otp, this.clientContactId.toString())
        .subscribe((res: any) => {
          console.log(res)
          this.isSubmitForm = false;
          if (res.value) {
            var url = this.apiHost + '/api/download-private-list/' + this.downloadId;
            window.open(
              url,
              '_blank' // <- This is what makes it open in a new window.
            );
            this.downloadModalclosebtn.nativeElement.click();
          } else {
            this.otperr = res.errors.join(',');
          }
        })
    }
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
          this._docService.deleteClientPrivateList(this.deleteItemIds)
            .subscribe((res: any) => {
              if (res.succeeded) {
                this.deleteItemIds = [];
                this.loadData();
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

  resolveFieldData(data, field) {
    return ObjectUtils.resolveFieldData(data, field);
  }
}

