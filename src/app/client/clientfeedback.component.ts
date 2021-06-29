import { Component, OnInit, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd, RoutesRecognized } from '@angular/router';
import { ClientServices } from '../services/client.services';
import { Feedback } from "../models/feedback";

declare var jQuery: any;
import swal from 'sweetalert2';
import { JobServices } from "../services/job.services";
import { Job } from "../models/job";
import { SharedServices } from "../services/shared.services";
import { JobTrackerComponent } from "../shared/jobtracker.component";

import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as stream from 'stream';
import { saveAs } from 'file-saver';
import * as moment from 'moment';

import * as JWT from 'jwt-decode';
import { CookieService } from '../../../node_modules/ngx-cookie-service';
import { SecurityRights, SecurityRightsExportError } from '../shared/enum';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { PtableColumn } from '../models/ptablecolumn';
import { LazyLoadEvent } from 'primeng/api';

@Component({
  selector: 'ClientFeedbackComponent',
  templateUrl: './clientfeedback.component.html',
  providers: [JobTrackerComponent],
})

export class ClientFeedbackComponent implements OnInit {
  feedback: Feedback;
  selectedFeedbackActionNotes: Feedback;
  feedbacks: Array<Feedback> = [];
  @Input() id: number;
  @Input() isUpdateClient: boolean;
  isLoading = true;
  isSubmitFormSpinner = false;
  isSubmitForm = false;
  isType = true;

  deleteItemIds = [];

  @ViewChild("closeAddNewModal") closeAddNewModal;
  @ViewChild("checkBox") checkBox;

  selected = [];
  jobs: Array<Job>;

  feedbackTypeList = [];

  dataTablesParameters: any;
  totalItems = 0;

  saveQueryName: string;
  maxrecords: any = null;
  filters: any;
  @ViewChild("saveQueryBtn") saveQueryBtn;
  feedbackActionList = [];

  loginusername: string;
  loginnameid: string;

  @ViewChild("saveQueryCancelBtn") saveQueryCancelBtn;
  isUpdateFiler = true;
  @ViewChild("actionNotesCancelBtn") actionNotesCancelBtn;

  noofrows = 50;
  selectedColumns: Array<PtableColumn> = [];
  cols: Array<PtableColumn> = [];
  selectedRowData = [];
  ptablesearch: string;
  isShowFilter = true;
  totalRecords = 0;
  colVisData = [];
  selectedFilterId = null;

  constructor(private router: Router, private _clientService: ClientServices,
    private jobService: JobServices, private sharedservice: SharedServices, private jtc: JobTrackerComponent,
    private sharedService: SharedServices, private cookieService: CookieService, private securityInfoResolve: SecurityInfoResolve) { }

  ngOnInit() {
    this.getFeedback(this.id);
    this.addNew();
    this.getJobsByClient(this.id);
    this.getFeedbackTypeList();
    this.getFeedbackActionList();
    this.getLoginUserDetails();
  }

  getFeedback(id) {
    this.cols = [
      { field: 'date', header: 'Created Date', index: 0, width: '125', sort: false },
      { field: 'time', header: 'Time', index: 1, width: '100', sort: false },
      { field: 'jobNumber', header: 'Job Number', index: 2, width: '200', sort: false },
      { field: 'jobName', header: 'Job Name', index: 3, width: '200', sort: false },
      { field: 'feedbackType', header: 'Feedback Type', index: 4, width: '125', sort: false, textAlign: 'center' },
      { field: 'userFullName', header: 'Username', index: 5, width: '150', sort: false },
      { field: 'feedbackText', header: 'Feedback Text', index: 6, width: 'auto', sort: false },
      { field: 'actionStatus', header: 'Action', index: 7, width: '120', sort: false },
      { field: 'dateActioned', header: 'Date Actioned', index: 8, width: '125', sort: false, textAlign: 'center' },
      { field: 'actionedByFullName', header: 'Actioned By', index: 9, width: '150', sort: false },
      { field: 'actionNotes', header: 'Action Notes', index: 10, width: '120', sort: false, textAlign: 'center' }
    ];

    this.selectedColumns = this.cols;
  }

  loadData(event: LazyLoadEvent) {
    if (!event.sortField) { event.sortField = "id" }
    if (!event.sortOrder) { event.sortOrder = -1 }
    console.log(event);
    this.sharedService.getDataWithFilter(event, this.colVisData, this.maxrecords, this.filters, "feedback", this.id)
      .subscribe((resp: any) => {
        // debugger;
        this.feedbacks = resp.value;
        this.totalRecords = resp.totalCount;
        console.log(this.feedbacks);
      });
  }

  getFeedbackTypeList() {
    this.sharedservice.getFeedbackTypeList()
      .subscribe((res: any) => { this.feedbackTypeList = res.value });
  }

  addNew() {
    this.feedback = new Feedback();
    this.initFocus();
  }

  ngAfterViewInit() {
    this.initFocus();
  }

  deleteFeedback() {
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
          this._clientService.deleteFeedback(this.deleteItemIds)
            .subscribe((res: any) => {
              if (res.succeeded) {
                this.deleteItemIds = [];
                this.loadData({ first: 0, rows: this.noofrows });

                for (var i = 0; i < this.feedbacks.length; i++) {
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


  submitClientFeedback(form) {
    this.isSubmitForm = true;
    this.isSubmitFormSpinner = true;
    if (form.invalid) {
      //this.isSubmitForm = false;
      this.isSubmitFormSpinner = false;
    }
    else {
      //      this = this.id;
      this.feedback.clientId = this.id;
      this._clientService.updateClientFeedback(this.feedback)
        .subscribe((res: any) => {
          this.isSubmitFormSpinner = false;
          this.isSubmitForm = false;
          if (res.succeeded) {
            this.closeAddNewModal.nativeElement.click();
            this.loadData({ first: 0, rows: this.noofrows });
          }
        });
    }
  }

  editFeedback(id) {
    this.feedbacks.forEach((item) => {
      if (item.id == id) {
        this.feedback = item;
      }
    });
    this.initFocus();
  }

  getJobsByClient(clientid) {
    this.jobService.getClientRecentJob(clientid)
      .subscribe((res: any) => {
        this.jobs = res.value;
        //this.loadData({ first: 0, rows: this.noofrows });
      });
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
      { header: 'Date', key: 'createdDate', width: 15 },
      { header: 'Time', key: 'createdDate', width: 15 },
      { header: 'Job Number', key: 'jobNumber', width: 15 },
      { header: 'Job Name', key: 'jobName', width: 15 },
      { header: 'Type', key: 'feedbackType', width: 15 },
      { header: 'Username', key: 'username', width: 30 },
      { header: 'Feedback', key: 'feedbackText', width: 30 },
      { header: 'Date Actioned', key: 'dateActioned', width: 50 },
      { header: 'Actioned By', key: 'actionedBy', width: 50 }
    ];

    this.feedbacks.forEach((am) => {
      var dataobj = {};
      //sheet
      sheet.columns.forEach(cl => {
        if (cl.key == 'createdDate') {
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

    var filename = "Client Feedback.xlsx";
    /* save to file */
    workbook.xlsx.writeBuffer().then(function (data) {
      saveAs(new Blob([data], { type: 'application/octet-stream' }), filename);
    });
  }

  initFocus() {
    if (typeof jQuery != 'undefined') {
      jQuery('#add-new-feedback-modal').on('shown.bs.modal', function () {
        jQuery('#job').focus();
      });
      jQuery('#save-job-query-modal').on('shown.bs.modal', function () {
        jQuery('#queryname').focus();
      })
    }
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
      this.saveQueryBtn.nativeElement.click();
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
      this.sharedService.saveQuery('feedback', null, '', this.saveQueryName, this.filters)
        .subscribe((res: any) => {
          console.log(res);
          this.isSubmitForm = false;
          if (res.succeeded) {
            this.selectedFilterId = res.value;
            this.isUpdateFiler = true;
            this.saveQueryCancelBtn.nativeElement.click();
            /*swal('Successfully Saved!',
              '',
              'success');*/
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
        })
    }
  }

  getFeedbackActionList() {
    this.sharedservice.getFeedbackActionList()
      .subscribe((res: any) => {
        this.feedbackActionList = res.value;
      })
  }

  updateClientFeedback(fb) {
    fb.actionedBy = this.loginnameid;
    fb.dateActioned = new Date();

    console.log(fb);
    this._clientService.updateClientFeedback(fb)
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

  getLoginUserDetails() {
    var token = JWT(this.cookieService.get('auth_token'));
    this.loginusername = token["unique_name"];
    this.loginnameid = token["nameid"];
  }

  saveActionNotes() {
    this.selectedFeedbackActionNotes.clientId = this.id;
    this._clientService.updateClientFeedback(this.selectedFeedbackActionNotes)
      .subscribe((res: any) => {
        this.isSubmitFormSpinner = false;
        this.isSubmitForm = false;
        if (res.succeeded) {
          this.actionNotesCancelBtn.nativeElement.click();
          this.loadData({ first: 0, rows: this.noofrows });
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
}
