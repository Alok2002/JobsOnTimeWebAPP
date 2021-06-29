import { CookieService } from 'ngx-cookie-service';
import { ObjectUtils } from 'primeng/components/utils/objectutils';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import swal from 'sweetalert2';
import { Job } from '../models/job';
import { JobServices } from '../services/job.services';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SharedServices } from '../services/shared.services';
import { SecurityRights, SecurityRightsExportError } from '../shared/enum';
import { PtableColumn } from '../models/ptablecolumn';
import { LazyLoadEvent } from 'primeng/api';
import * as JWT from 'jwt-decode';
import { JobContact } from '../models/jobcontact';
import { Incentive } from '../models/incentive';
import { JobVenue } from '../models/jobvenue';
import { apiHost } from '../app.component';

declare var jQuery: any;

@Component({
  selector: 'CliJobsComponent',
  templateUrl: './clijobs.component.html'
})

export class CliJobsComponent implements OnInit {
  @Input() clientId = 0;
  noofrows = 99999;
  selectedColumns: Array<PtableColumn> = [];
  cols: Array<PtableColumn> = [];
  selectedRowData: any;
  ptablesearch: string;
  isShowFilter = true;
  // totalRecords = 0;
  colVisData = [];
  selectedFilterId = null;
  job: Job;
  jobs: Array<Job>;
  maxrecords: any = null;
  filters: any = null;

  viewContactJobNumber: string;
  viewContactJobName: string;
  viewContacts: Array<JobContact>;
  viewIncentives: Array<Incentive>;
  viewVenues: Array<JobVenue>;
  deleteItemIds = [];
  token: string;
  apihost = apiHost;
  @ViewChild("documentBtn") documentBtn;

  constructor(private jobService: JobServices, private sharedService: SharedServices,
    private securityInfoResolve: SecurityInfoResolve, private cookieservice: CookieService) { }

  ngOnInit() {
    if (this.cookieservice.check('auth_token')) {
      this.token = this.cookieservice.get('auth_token');
    }

    this.getAllJobs();
  }

  getAllJobs() {
    this.cols = [
      // { field: 'jobApprovedNo', header: 'Job Approved No', index: 0, width: '110', sort: false },
      { field: 'jobNumber', header: 'Job No', index: 1, width: '60', sort: false },
      { field: 'jobName', header: 'Job Name', index: 2, width: '250', sort: false },
      { field: 'clientName', header: 'Client Name', index: 3, width: '200', sort: false },
      { field: 'jobMainContactName', header: 'Main Contact', index: 4, width: '130', sort: false },
      // { field: 'contactCount', header: 'Contact', index: 5, width: '65', sort: false, textAlign: 'center' },
      { field: 'projectManagerUser.fullName', header: 'Project Manager', index: 5, width: '110', sort: false },
      { field: 'venueCount', header: 'Venue', index: 6, width: '65', sort: false, textAlign: 'center' },
      { field: 'incentiveCount', header: 'Incentive', index: 7, width: '65', sort: false, textAlign: 'center' },
      // { field: 'jobTopic', header: 'Topic', index: 8, width: '150', sort: false },
      // { field: 'jobSubject', header: 'Subject', index: 9, width: '150', sort: false },
      { field: 'sessionType', header: 'Session Type', index: 10, width: '125', sort: false },
      { field: 'validationReportReceivedCalculated', header: 'RVR Rcvd', index: 13, width: '75', sort: false, textAlign: 'center' },
      // { field: 'jobStatus', header: 'Job Status', index: 11, width: '175', sort: false },      
      // { field: 'dateReceived', header: 'Date Received', index: 14, width: '125', sort: false },
      // { field: 'expectedFirstSessionDate', header: 'Exp. First Session', index: 15, width: '125', sort: false },
      // { field: 'expectedLastSessionDate', header: 'Exp. Last Session', index: 16, width: '125', sort: false },
      // { field: 'sessionCount', header: 'Session', index: 17, width: '60', sort: false },
      // { field: 'jobNumber', header: 'Job No', index: 18, width: '60', sort: false },
      // { field: 'quotedAmountExGstString', header: 'Quoted Ex GST', index: 19, width: '100', sort: false, textAlign: 'right' },
      // { field: 'actualAmountExGstString', header: 'Actual Ex GST', index: 20, width: '100', sort: false, textAlign: 'right' },
      // { field: 'signedOffByUser.fullName', header: 'Signed Off By', index: 21, width: '100', sort: false },
      // { field: 'invoiceStatus', header: 'Invoice Status', index: 22, width: '100', sort: false },
      // { field: 'invoiceNumber', header: 'Invoice Number', index: 23, width: '100', sort: false },
      // { field: 'quotedByUser.fullName', header: 'Quote By', index: 24, width: '100', sort: false },
      // { field: 'dateQuoted', header: 'Quote Date', index: 25, width: '125', sort: false },
      // { field: 'dateJobApproved', header: 'Approved Date', index: 26, width: '125', sort: false },
      // { field: 'dateAllocatedToRecruitment', header: 'Allocated for Recruitment', index: 27, width: '160', sort: false },
      // { field: 'dateLastModified', header: 'Last Modified', index: 28, width: '125', sort: false },
    ];

    this.selectedColumns = this.cols;
    this.loadData(null);
  }

  loadData(event: LazyLoadEvent) {
    // if (!event.sortField) { event.sortField = "id" }
    // if (!event.sortOrder) { event.sortOrder = -1 }
    // console.log(event);
    /*this.sharedService.getDataWithFilter(event, this.colVisData, this.maxrecords, this.filters, "job", this.clientId)
      .subscribe((resp: any) => {
        // debugger;
        this.jobs = resp.value;
        this.totalRecords = resp.totalCount;
        console.log(this.jobs);
      });*/
    var token = JWT(this.cookieservice.get('auth_token'));
    this.jobService.getClientContactJobs(token['primarysid'])
      .subscribe((res: any) => {
        console.log(res)
        this.jobs = res.value;
      })
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

  unCheckAllItems() {
    this.deleteItemIds = [];
    this.selectedRowData = [];
  }

  openModel(btn) {
    this.deleteItemIds = [];
    /*this.selectedRowData.forEach(rd => {
      this.deleteItemIds.push(rd.id);
    })*/
    console.log(this.selectedRowData);
    if (this.selectedRowData && this.selectedRowData.length > 0)
      this.deleteItemIds.push(this.selectedRowData[0].id);

    if (this.deleteItemIds.length > 0) {
      if (this.deleteItemIds.length == 1) {
        if (btn == 'docbtn') this.documentBtn.nativeElement.click();
        // if (btn == 'emailbtn') this.emailBtn.nativeElement.click();
        console.log(this.deleteItemIds)
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
}
