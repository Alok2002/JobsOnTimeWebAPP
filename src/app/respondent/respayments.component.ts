import { Component, Input, OnInit, ViewChild } from '@angular/core';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import swal from 'sweetalert2';

import { financeAccountMask, financeBSBMask, financeBSBPattern, financeAccountPattern } from '../app.component';
import { ResEvent } from '../models/resevent';
import { Respondent } from '../models/respondent';
import { RespondentServices } from '../services/respondent.services';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SecurityRights, SecurityRightsExportError } from '../shared/enum';
import { SharedServices } from './../services/shared.services';
import { JobServices } from '../services/job.services';
import { JobSessionServices } from '../services/jobsession.services';
import { ClientServices } from '../services/client.services';
import { LazyLoadEvent } from 'primeng/api';
import { PtableColumn } from '../models/ptablecolumn';

declare var jQuery: any;

@Component({
  selector: 'ResPaymentsComponent',
  templateUrl: './respayments.component.html'
})

export class ResPaymentsComponent implements OnInit {
  financeBSBPattern = financeBSBPattern;
  financeAccountPattern = financeAccountPattern;
  @Input() resId: number;
  @Input() isMyProfile: number;
  respondent = new Respondent();
  isLoading = true;
  respayments = [];
  isSubmitForm = false;

  dataTablesParameters: any;
  totalItems = 0;

  @ViewChild("saveQueryCancelBtn") saveQueryCancelBtn;
  isUpdateFiler = true;

  saveQueryName: string;
  maxrecords: any = null;
  filters: any;
  @ViewChild("saveQueryBtn") saveQueryBtn;

  today = new Date();

  resevent = new ResEvent();
  postEventMsg: string;
  eventtypelist = [];
  jobs = [];
  sessions = [];
  clients = [];
  incentivelist = [];

  selectedJob: number;
  selectedClient: number;
  @ViewChild("openEventModel") openEventModel;

  financeBSBMask = financeBSBMask;
  financeAccountMask = financeAccountMask;

  hasPermission = false;

  isOpenEventModal = false;
  deleteResIds = [];

  noofrows = 50;
  selectedColumns: Array<PtableColumn> = [];
  cols: Array<PtableColumn> = [];
  selectedRowData = [];
  ptablesearch: string;
  isShowFilter = true;
  totalRecords = 0;
  colVisData = [];
  countrycode: string;

  constructor(private respondentservice: RespondentServices,
    public sharedService: SharedServices, private jobService: JobServices,
    private jobSessionService: JobSessionServices, private clientService: ClientServices,
    private securityInfoResolve: SecurityInfoResolve) { }

  ngOnInit() {
    console.log("inside onint");
    this.getPermissionDetails();
    if (this.resId) {
      this.respondentservice.getRespondentById(this.resId)
        .subscribe((res: any) => {
          this.respondent = res.value;
          this.isLoading = false;          
        })

      this.getRespondentPaymentPoint();
    }

    this.getClients();
    this.getEventTypeListWithBlank();

    this.deleteResIds.push(this.resId);
    this.getCountryCode();
  }

  getCountryCode() {
    this.sharedService.getCountryCode()
      .subscribe((res: any) => {
        console.log(res)
        this.countrycode = res.value.value;
        console.log(this.countrycode)
      })
  }

  getRespondentPaymentPoint() {
    this.cols = [
      { field: 'eventDate', header: 'Date', index: 0, width: '125', sort: false },
      { field: 'eventDescription', header: 'Details', index: 1, width: '300', sort: false },
      { field: 'jobNumberAndName', header: 'Job Name', index: 2, width: '300', sort: false },
      { field: 'sessionName', header: 'Session', index: 3, width: '300', sort: false },
      { field: 'location', header: 'Location', index: 4, width: '300', sort: false },
      { field: 'inDepthTime', header: 'In Depth Time', index: 5, width: '150', sort: false },
      { field: 'incentive', header: 'Incentive', index: 6, width: '100', sort: false }
    ];

    this.selectedColumns = this.cols;
  }

  loadData(event: LazyLoadEvent) {
    if (!event.sortField) { event.sortField = "eventDate" }
    if (!event.sortOrder) { event.sortOrder = -1 }

    console.log(event);
    this.sharedService.getDataWithFilter(event, this.colVisData, this.maxrecords, this.filters, "respondentPayments", this.resId)
      .subscribe((resp: any) => {
        // debugger;
        this.respayments = resp.value;
        this.totalRecords = resp.totalCount;
        console.log(this.jobs);
      });
  }

  getPermissionDetails() {
    this.securityInfoResolve.checkPermission(SecurityRights.BankingAdmin)
      .subscribe((res: any) => {
        if (res.succeeded) {
          this.hasPermission = true;
        }
      });
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
      { header: 'Type', key: 'id', width: 20 },
      { header: 'Date', key: 'eventDate', width: 20 },
      { header: 'Job Name', key: 'eventDescription', width: 30 },
      { header: 'Session', key: 'jobGroupId', width: 30 },
      { header: 'Location', key: '', width: 15 },
      { header: 'In Depth Time', key: 'inDepthTime', width: 30 },
      { header: 'Incentive', key: 'incentive', width: 30 }
    ];

    this.respayments.forEach((am) => {
      var dataobj = {};
      //sheet
      sheet.columns.forEach(cl => {
        if (cl.key == 'eventDate') {
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

    var filename = "Respondent Payments.xlsx";
    /* save to file */
    workbook.xlsx.writeBuffer().then(function (data) {
      saveAs(new Blob([data], { type: 'application/octet-stream' }), filename);
    });
  }

  updateSubmit(form) {
    this.isSubmitForm = true;
    if (form.invalid) {
      console.log(form);
      //this.isSubmitForm = false;
    } else {
      this.respondentservice.updateRespondent(this.respondent)
        .subscribe((res: any) => {
          console.log(res);

          if (res.succeeded) {
            swal(
              'Successfully Saved!',
              '',
              'success'
            );
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
          this.respondent = res.value;
        });
    }
  }

  filterSubmit(res) {
    console.log(res);
    this.isLoading = true;
    this.filters = res.filters;
    this.maxrecords = res.maxrecords;

    this.sharedService.getDataWithFilter(this.dataTablesParameters, this.colVisData, this.maxrecords, this.filters, "respondentPayments", null)
      .subscribe((resp: any) => {
        this.respayments = resp.value;
        console.log(resp);
        this.getRespondentPaymentPoint();

        this.isLoading = false;
      });
  }

  saveQuery() {
    this.isUpdateFiler = false;
    this.sharedService.saveQuery('client', null, '', this.saveQueryName, this.filters)
      .subscribe((res: any) => {
        console.log(res);
        if (res.succeeded) {
          this.isUpdateFiler = true;
          this.saveQueryCancelBtn.nativeElement.click();
          /*swal('Successfully Saved!',
            '',
            'success');*/
        }
      })
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


  getEventTypeListWithBlank() {
    this.respondentservice.getEventTypeListWithBlank()
      .subscribe((res: any) => {
        this.eventtypelist = res.value;
        console.log(this.eventtypelist);
      })
  }

  getJobsbyClientId(clientId) {
    this.jobService.getJobsByClient(clientId)
      .subscribe((res: any) => {
        this.jobs = res.value;
      });
  }

  getSessionbyJobId(jobId) {
    this.jobSessionService.getSessionByJob(jobId)
      .subscribe((res: any) => {
        this.sessions = res.value;
      });
  }

  getIncentiveById(selectedJob) {
    this.jobService.getJobIncentivesByJob(selectedJob)
      .subscribe((res: any) => {
        console.log(res);
        this.incentivelist = res.value;
      })
  }

  createResEvent() {
    this.postEventMsg = "";
    //if (this.deleteItemIds.length > 0) {
    //if (this.selectAllCheckBox) this.deleteItemIds = [];

    this.resevent.respondentIdsString = this.resId.toString();
    this.respondentservice.createResEvent(this.resevent)
      .subscribe((res: any) => {
        console.log(res);
        if (res.succeeded) {
          /*swal(
            res.successMsg,
            '',
            'success'
          );*/
          this.postEventMsg = res.successMsg;
          this.getRespondentPaymentPoint();
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
    /*}
    else {
      swal(
        'Oops...',
        'Please select an item to create event.',
        'info'
      )
    }*/
  }

  getClients() {
    this.clientService.getAllClients()
      .subscribe((res: any) => {
        console.log(res);
        this.clients = res.value;
        console.log(this.clients);
        this.isLoading = false;
      });
  }

  newResEvent() {
    this.isOpenEventModal = true;
    this.resevent = new ResEvent();
    this.resevent.event = "Job - Payment Sent";
    setTimeout(() => {
      this.openEventModel.nativeElement.click();
    }, 1000)
  }

  unmask(value) {
    var ret = value.replace(/\D+/g, '');
    return ret;
  }

  resetEventForm(event) {
    if (event) {
      this.resevent = new ResEvent();
      this.selectedClient = null;
      this.isOpenEventModal = false;
    }
    this.loadData({ first: 0, rows: this.noofrows });
  }

  updateSelectedColumnsIndex() {
    this.selectedColumns.sort((a, b) => {
      if (a.index > b.index) return 1;
      if (a.index < b.index) return -1;
      return 0;
    })
  }
}
