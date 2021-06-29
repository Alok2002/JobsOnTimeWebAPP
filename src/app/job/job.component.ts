import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import { saveAs } from 'file-saver';
import * as JWT from 'jwt-decode';
import * as moment from 'moment';
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs/Subject';
import swal from 'sweetalert2';

import { apiHost, isMobile } from '../app.component';
import { Email } from '../models/email';
import { Incentive } from '../models/incentive';
import { Job } from '../models/job';
import { JobContact } from '../models/jobcontact';
import { JobVenue } from '../models/jobvenue';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SharedServices } from '../services/shared.services';
import { SecurityRights, SecurityRightsExportError } from '../shared/enum';
import { JobTrackerComponent } from '../shared/jobtracker.component';
import { JobServices } from '../services/job.services';
import { EmailServices } from '../services/email.services';
import { PtableColumn } from '../models/ptablecolumn';
import { LazyLoadEvent } from 'primeng/api';
import { ObjectUtils } from 'primeng/components/utils/objectutils';
import { TrackingJob } from '../models/trackingjob';

declare var jQuery: any;
declare var $: any;
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'JobComponent',
  templateUrl: './job.component.html',
  providers: [JobTrackerComponent]
})

export class JobComponent implements OnInit {
  @Input() isChildView = false;
  @Input() clientId = 0;
  job: Job;
  jobs: Array<Job>;
  isLoading = true;

  deleteItemIds = [];
  isSubmitForm = false;
  isSubmitFormSpinner = false;

  @ViewChild("closeAddNewModal") closeAddNewModal;
  @ViewChild("checkBox") checkBox;

  selected = [];

  viewContacts: Array<JobContact>;
  viewContactJobNumber: string;
  viewContactJobName: string;

  totalItems: number;

  dataTablesParameters: any;
  saveQueryName: string;
  saveForCurrentJob = false;

  maxrecords: any = null;
  filters: any = null;
  @ViewChild("saveQueryBtn") saveQueryBtn;
  @ViewChild("documentBtn") documentBtn;

  viewIncentives: Array<Incentive>;
  viewVenues: Array<JobVenue>;

  apihost = apiHost;
  emailData = new Email();
  @ViewChild("emailModlaBtn") emailModlaBtn;

  emailModalTitle: string;
  @ViewChild("emailBtn") emailBtn;

  @ViewChild("saveQueryCancelBtn") saveQueryCancelBtn;
  isUpdateFiler = false;

  token: string;

  noofrows = 50;
  selectedColumns: Array<PtableColumn> = [];
  cols: Array<PtableColumn> = [];
  selectedRowData: any;
  ptablesearch: string;
  isShowFilter = true;
  totalRecords = 0;
  colVisData = [];
  selectedFilterId = null;
  isMobile = isMobile;

  constructor(private jobService: JobServices, private emailservice: EmailServices,
    private http: HttpClient, private sharedService: SharedServices,
    private jtc: JobTrackerComponent, private cookieservice: CookieService,
    private securityInfoResolve: SecurityInfoResolve) {
  }

  ngOnInit() {
    if (this.cookieservice.check('auth_token')) {
      this.token = this.cookieservice.get('auth_token');
    }
    this.getAllJobs();
  }

  getAllJobs() {
    this.cols = [
      { field: 'jobApprovedNo', header: 'Job Approved No', index: 0, width: '110', sort: false },
      { field: 'jobNumber', header: 'Job No', index: 1, width: '70', sort: false },
      { field: 'jobName', header: 'Job Name', index: 2, width: '250', sort: false },
      { field: 'clientName', header: 'Client Name', index: 3, width: '200', sort: false },
      { field: 'jobMainContactName', header: 'Main Contact', index: 4, width: '130', sort: false },
      { field: 'contactCount', header: 'Contact', index: 5, width: '65', sort: false, textAlign: 'center' },
      { field: 'venueCount', header: 'Venue', index: 6, width: '65', sort: false, textAlign: 'center' },
      { field: 'incentiveCount', header: 'Incentive', index: 7, width: '65', sort: false, textAlign: 'center' },    
      { field: 'jobTopic', header: 'Topic', index: 8, width: '150', sort: false },
      { field: 'jobSubject', header: 'Subject', index: 9, width: '150', sort: false },
      { field: 'validationReportReceivedCalculated', header: 'RVR Rcvd', index: 10, width: '75', sort: false, textAlign: 'center' },      
      { field: 'jobStatus', header: 'Job Status', index: 11, width: '175', sort: false },
      { field: 'projectManagerUser.fullName', header: 'Project Manager', index: 12, width: '110', sort: false },
      { field: 'sessionType', header: 'Session Type', index: 13, width: '125', sort: false },
      { field: 'dateReceived', header: 'Date Received', index: 14, width: '125', sort: false },
      { field: 'expectedFirstSessionDate', header: 'Exp. First Session', index: 15, width: '125', sort: false },
      { field: 'expectedLastSessionDate', header: 'Exp. Last Session', index: 16, width: '125', sort: false },
      { field: 'sessionCount', header: 'Session', index: 17, width: '60', sort: false },
      { field: 'jobNumber', header: 'Job No', index: 18, width: '70', sort: false },
      { field: 'quotedAmountExGstString', header: 'Quoted Ex GST', index: 19, width: '100', sort: false, textAlign: 'right' },
      { field: 'actualAmountExGstString', header: 'Actual Ex GST', index: 20, width: '100', sort: false, textAlign: 'right' },
      { field: 'signedOffByUser.fullName', header: 'Signed Off By', index: 21, width: '100', sort: false },
      { field: 'invoiceStatus', header: 'Invoice Status', index: 22, width: '100', sort: false },
      { field: 'invoiceNumber', header: 'Invoice Number', index: 23, width: '100', sort: false },
      { field: 'quotedByUser.fullName', header: 'Quote By', index: 24, width: '100', sort: false },
      { field: 'dateQuoted', header: 'Quote Date', index: 25, width: '125', sort: false },
      { field: 'dateJobApproved', header: 'Approved Date', index: 26, width: '125', sort: false },
      { field: 'dateAllocatedToRecruitment', header: 'Allocated for Recruitment', index: 27, width: '160', sort: false },
      { field: 'dateLastModified', header: 'Last Modified', index: 28, width: '125', sort: false },
    ];

    this.selectedColumns = this.cols;
  }

  loadData(event: LazyLoadEvent) {
    if (!event.sortField) { event.sortField = "id" }
    if (!event.sortOrder) { event.sortOrder = -1 }
    console.log(event);
    this.sharedService.getDataWithFilter(event, this.colVisData, this.maxrecords, this.filters, "job", this.clientId)
      .subscribe((resp: any) => {
        // debugger;
        this.jobs = resp.value;
        this.totalRecords = resp.totalCount;
        console.log(this.jobs);
      });
  }

  /*updateDeleteList(id: number, e) {
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
      this.jobs.forEach((item) => {
        this.deleteItemIds.push(item.id);
      });
    }
    else {
      this.deleteItemIds = [];
    }

    for (var i = 0; i < this.jobs.length; i++) {
      this.selected[i] = e.target.checked;
    }
  }*/


  deleteJobs() {
    this.deleteItemIds = [];
    /*this.selectedRowData.forEach(rd => {
      this.deleteItemIds.push(rd.id);
    })*/
    if (this.selectedRowData)
      this.deleteItemIds.push(this.selectedRowData.id);

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

          this.jobService.deleteJobs(this.deleteItemIds)
            .subscribe((res: any) => {
              if (res.succeeded) {
                this.deleteItemIds = [];
                this.loadData({ first: 0, rows: this.noofrows });

                for (var i = 0; i < this.jobs.length; i++) {
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
    }
    else {
      swal(
        'Oops...',
        'Please select an item to delete.',
        'info'
      );
    }
  }

  /*getContactsByJobId(job: Job) {
    this.isLoading = false;
    this.viewContactJobNumber = job.jobNumber;
    this.viewContactJobName = job.jobName;

    this.jobService.getContactsByJob(job.id)
      .subscribe((res) => {
        this.isLoading = false;
        this.viewContacts = res.value;
      });
  }*/

  allocateJobs() {
    this.deleteItemIds = [];
    /*this.selectedRowData.forEach(rd => {
      this.deleteItemIds.push(rd.id);
    })*/
    if (this.selectedRowData)
      this.deleteItemIds.push(this.selectedRowData.id);

    if (this.deleteItemIds.length > 0) {
      this.jobService.allocateJobs(this.deleteItemIds)
        .subscribe(res => {
          swal(
            'Allocated!',
            'Selected item has been allocated.',
            'success'
          );

          this.deleteItemIds = [];

          for (var i = 0; i < this.jobs.length; i++) {
            this.selected[i] = false;
          }
        });
      // result.dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
    }
    else {
      swal(
        'Oops...',
        'Please select an item to allocate.',
        'info'
      );
    }
  }

  startTracking() {
    var token = JWT(this.cookieservice.get('auth_token'));
    var username = token["primarysid"];

    this.deleteItemIds = [];
    console.log(this.selectedRowData)
    /*this.selectedRowData.forEach(rd => {
      this.deleteItemIds.push(rd.id);
    })*/
    if (this.selectedRowData)
      this.deleteItemIds.push(this.selectedRowData.id);

    if (this.deleteItemIds.length > 0) {
      if (this.deleteItemIds.length == 1) {
        this.sharedService.startTrackingJob(this.deleteItemIds[0], username)
          .subscribe((res: any) => {
            console.log(res);

            if (res.succeeded) {
              swal(
                'Tracked!',
                res.value.jobNumberAndName + ' job has been tracked.',
                'success'
              );
              var jsonstr = JSON.stringify(new TrackingJob(res.value));
              this.cookieservice.set('currentlytracking', jsonstr, null, '/');
              this.refreshData();
              this.unCheckAllItems();
            } else {
              swal(
                'Oops...',
                'Something went wrong while tracking.',
                'info'
              );
            }

          });
      } else {
        swal(
          'Oops...',
          'Please select only one job to start tracking.',
          'info'
        );
      }
    } else {
      swal(
        'Oops...',
        'Please select a job to start tracking.',
        'info'
      );
    }
  }

  public refreshData(): void {
    this.jtc.refreshData();
  }

  exporttoExcel(method) {
    this.securityInfoResolve.checkPermission(SecurityRights.ExportAllResults)
      .subscribe((res: any) => {
        if (res.succeeded) {
          if (method == 'raw') {
            this.sharedService.getQueryResultsExport(event, this.colVisData, this.maxrecords, this.filters, "job", this.clientId)
              .subscribe((res: any) => {
                //console.log(res);
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(res);
                link.download = "Job.csv";
                link.click();
              })
          }
          if(method == 'excel')
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

    /*sheet.columns = [
      { header: 'Job Approved No', key: 'jobApprovedNo', width: 20 },
      { header: 'Job No', key: 'jobNumber', width: 15 },
      { header: 'Job Name', key: 'jobName', width: 30 },
      { header: 'Client Name', key: 'clientName', width: 30 },
      { header: 'Topic', key: 'jobTopic', width: 30 },
      { header: 'Subject', key: 'jobSubject', width: 30 },
      { header: 'RVR Rcvd', key: 'validationReportReceivedCalculated', width: 30 },
      { header: 'Date Received', key: 'dateReceived', width: 30 },
      { header: 'Job Status', key: 'jobStatus', width: 30 },
      { header: 'Project Manager', key: 'projectManagerUsername', width: 30 },
      { header: 'Session Type', key: 'sessionType', width: 30 },
      { header: 'Exp. First Session', key: 'expectedFirstSessionDate', width: 25 },
      { header: 'Exp. Last Session', key: 'expectedLastSessionDate', width: 25 },
      { header: 'Session', key: 'sessionCount', width: 25 },
      { header: 'Quote By', key: 'quotedBy', width: 25 },
      { header: 'Signed Off By', key: 'signedOffByUsername', width: 25 },
      { header: 'Invoice Status', key: 'invoiceStatus', width: 25 },
      { header: 'Invoice Number', key: 'invoiceNumber', width: 25 },
      { header: 'Quote Date', key: 'dateQuoted', width: 25 },
      { header: 'Approved Date', key: 'dateJobApproved', width: 25 },
      { header: 'Allocated for Recruitment', key: 'dateAllocatedToRecruitment', width: 25 },
      { header: 'Last Modified Date', key: 'dateLastModified', width: 25 },
    ];*/

    var headerArr = []    
    this.selectedColumns.forEach((sc) => {
      headerArr.push({ header: sc.header, key: sc.field, width: 30 });
    })
    sheet.columns = headerArr;

    console.log(sheet.columns)

    this.jobs.forEach((am) => {
      var dataobj = {};
      //sheet
      sheet.columns.forEach(cl => {        
        if (cl.key == 'expectedFirstSessionDate' || cl.key == 'expectedLastSessionDate' || cl.key == 'dateReceived' || cl.key == 'dateJobApproved'
          || cl.key == 'dateQuoted' || cl.key == 'dateJobApproved' || cl.key == 'dateAllocatedToRecruitment' || cl.key == 'dateLastModified') {
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

    var filename = "Job.xlsx";
    /* save to file */
    workbook.xlsx.writeBuffer().then(function (data) {
      saveAs(new Blob([data], { type: 'application/octet-stream' }), filename);
    });
  }

  /*filterSubmit(res) {
    console.log(res);
    this.sharedService.getDataWithFilter(this.dataTablesParameters, this.colVisData, res.maxrecords, res.filters, "ClientJob")
      .subscribe(resp => {
        this.jobs = resp.value;
        console.log(resp);

        this.isLoading = false;
        this.totalItems = resp.totalCount;

        // setTimeout(() => {
        //   //this.destroyDataTable();
        //   this.dtTrigger.next();
        //   this.updateDataTable();
        // }, 3000);
        //this.rerender();
       // this.destroyDataTable();
       // this.dtTrigger.next();
        this.updateDataTable();
      });
  }*/

  filterSubmit(res) {
    this.maxrecords = res.maxrecords;
    this.filters = res.filters;
    this.loadData({ first: 0, rows: this.noofrows });
  }

  saveQuery(form) {
    this.isUpdateFiler = false;
    this.isSubmitForm = true;
    if (!form.invalid) {
      this.sharedService.saveQuery('job', this.saveForCurrentJob, '', this.saveQueryName, this.filters)
        .subscribe((res: any) => {
          console.log(res);
          this.selectedFilterId = res.value;   
          this.isUpdateFiler = true;
          if (res.succeeded) {
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

  openModel(btn) {
    this.deleteItemIds = [];
    /*this.selectedRowData.forEach(rd => {
      this.deleteItemIds.push(rd.id);
    })*/
    console.log(this.selectedRowData);
    if (this.selectedRowData)
      this.deleteItemIds.push(this.selectedRowData.id);

    if (this.deleteItemIds.length > 0) {
      if (this.deleteItemIds.length == 1) {
        if (btn == 'docbtn') this.documentBtn.nativeElement.click();
        if (btn == 'emailbtn') this.emailBtn.nativeElement.click();
      } else {
        swal(
          'Oops...',
          'Please select only one job.',
          'info'
        );
      }
    } else {
      swal(
        'Oops...',
        'Please select a job.',
        'info'
      );
    }
  }

  unCheckAllItems() {
    this.deleteItemIds = [];
    this.selectedRowData = [];
  }

  generateEmailData(entity, title) {
    this.deleteItemIds = [];
    /*this.selectedRowData.forEach(rd => {
      this.deleteItemIds.push(rd.id);
    })*/
    if (this.selectedRowData)
      this.deleteItemIds.push(this.selectedRowData.id);

    this.emailModalTitle = title;
    this.emailservice.getEmailData(entity, this.deleteItemIds[0])
      .subscribe((res: any) => {
        console.log(res);
        if (res.succeeded) {
          this.emailData = res.value;
          setTimeout(() => {
            this.emailModlaBtn.nativeElement.click();
          }, 1000)

          if (res.value.recipients)
            this.emailData.recipientsList = res.value.recipients.split(',');
          if (res.value.bccRecipients)
            this.emailData.bccRecipientsList = res.value.bccRecipients.split(',');

          if (this.emailData.fromId == 0) this.emailData.fromId = null;
          if (this.emailData.recipientsList == null) this.emailData.recipientsList = [];
          if (this.emailData.bccRecipientsList == null) this.emailData.bccRecipientsList = [];
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

  closeModal(e) {
    if (e) {
      this.unCheckAllItems();
    }
  }

  updateSelectedColumnsIndex() {
    this.selectedColumns.sort((a, b) => {
      if (a.index > b.index) return 1;
      if (a.index < b.index) return -1;
      return 0;
    })
  }

  resolveFieldData(data, field) {
    return ObjectUtils.resolveFieldData(data, field);
  }
}
