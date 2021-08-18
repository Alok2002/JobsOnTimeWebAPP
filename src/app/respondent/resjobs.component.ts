import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import { Subject } from 'rxjs/Subject';
import swal from 'sweetalert2';

import { ResEvent } from '../models/resevent';
import { Respondent } from '../models/respondent';
import { RespondentServices } from '../services/respondent.services';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SecurityRights, SecurityRightsExportError } from '../shared/enum';
import { SharedServices } from '../services/shared.services';
import { JobServices } from '../services/job.services';
import { JobSessionServices } from '../services/jobsession.services';
import { ClientServices } from '../services/client.services';
import { ObjectUtils } from 'primeng/components/utils/objectutils';
import { PtableColumn } from '../models/ptablecolumn';
import { LazyLoadEvent } from 'primeng/api';

declare var jQuery: any;

@Component({
  selector: 'ResJobsComponent',
  templateUrl: './resjobs.component.html'
})

export class ResJobsComponent implements OnInit {
  @Input() resId: number;
  respondent: Respondent
  isLoading = true;
  resjobsevents = [];

  dataTablesParameters: any;
  totalItems = 0;

  @ViewChild("saveQueryCancelBtn") saveQueryCancelBtn;
  isUpdateFiler = true;

  saveQueryName: string;
  maxrecords: any = null;
  filters: any;
  @ViewChild("saveQueryBtn") saveQueryBtn;

  resevent = new ResEvent();
  postEventMsg: string;
  eventtypelist = [];
  jobs = [];
  sessions = [];
  clients = [];
  incentivelist = [];

  selectedJob: number;
  selectedClient: number;
  deleteItemIds = [];
  selectAllCheckBox = false;
  @ViewChild("openEventModel") openEventModel;
  selected = [];
  isSelectAllItem = false;

  postEventErrors = [];
  postEventSucceeded = true;
  isSubmitForm = false;

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
  selectedFilterId = null;

  constructor(private respondentservice: RespondentServices, private sharedService: SharedServices,
    private resservice: RespondentServices, private jobService: JobServices,
    private jobSessionService: JobSessionServices, private clientService: ClientServices,
    private securityInfoResolve: SecurityInfoResolve, private router: Router) {

    router.events.subscribe((val) => {
      // see also 
      console.log(val)
      console.log(val instanceof NavigationEnd)

      if (val instanceof NavigationEnd)
        this.loadData({ first: 0, rows: this.noofrows });
    });
  }

  ngOnInit() {
    this.getEventTypeListWithBlank();
    this.deleteResIds.push(this.resId);

    if (this.resId) {
      this.respondentservice.getRespondentById(this.resId)
        .subscribe((res: any) => {
          this.respondent = res.value;
          this.isLoading = false;
        })
    }
    else {
      this.respondent = new Respondent();
      this.isLoading = false;
    }

    this.getResJobsEvents();
    this.getClients();
  }

  getResJobsEvents() {
    this.cols = [
      { field: 'eventDate', header: 'Date', index: 0, width: '125', sort: false },
      { field: 'eventDescription', header: 'Event', index: 1, width: '150', sort: false },
      { field: 'userFullName', header: 'User', index: 2, width: '150', sort: false },
      { field: 'eventNotes', header: 'Notes', index: 3, width: '350', sort: false },
      { field: 'numberOfPoints', header: 'Total Points', index: 4, width: '100', sort: false },
      { field: 'clientName', header: 'Client', index: 5, width: '250', sort: false },
      { field: 'jobNumber', header: 'Job No', index: 6, width: '75', sort: false },
      { field: 'jobNumberAndName', header: 'Job Name', index: 7, width: '200', sort: false },
      { field: 'jobSubject', header: 'Subject', index: 8, width: '250', sort: false },
      { field: 'sessionName', header: 'Session', index: 9, width: '200', sort: false },
      { field: 'inDepthTime', header: 'In Depth Time', index: 10, width: '100', sort: false },
      { field: 'incentive', header: 'Incentive', index: 11, width: '150', sort: false },
      { field: 'attendeeDocumentComment', header: 'Attendee Doc Comment', index: 12, width: '200', sort: false },
      { field: 'respondentConfirmed', header: 'Confirmed', index: 13, width: '150', sort: false }
    ];

    this.selectedColumns = this.cols;
  }

  loadData(event: LazyLoadEvent) {
    if (!event.sortField) { event.sortField = "eventDate" }
    if (!event.sortOrder) { event.sortOrder = -1 }

    console.log(event);
    this.sharedService.getDataWithFilter(event, this.colVisData, this.maxrecords, this.filters, "respondentEvent", this.resId)
      .subscribe((resp: any) => {
        // debugger;
        this.resjobsevents = resp.value;
        this.totalRecords = resp.totalCount;
        console.log(this.resjobsevents);
      });
  }

  exporttoExcel() {
    this.securityInfoResolve.checkPermission(SecurityRights.ExportAllResults)
      .subscribe((res: any) => {
        if (res.succeeded) {
          this.exporttoExcelHelper();
        } else {
          var err = "";
          res.errors.forEach((er) => {
            err = err + " " + er;
          });
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
      { header: 'Date', key: 'eventDate', width: 15 },
      { header: 'Event', key: 'eventDescription', width: 50 },
      { header: 'User', key: 'fullName', width: 25 },
      { header: 'Notes', key: 'eventNotes', width: 50 },
      { header: 'Total Points', key: 'numberOfPoints', width: 15 },
      { header: 'Client', key: '', width: 30 },
      { header: 'Job', key: 'jobId', width: 10 },
      { header: 'Job Name', key: 'jobNumberAndName', width: 30 },
      { header: 'Subject', key: '', width: 30 }
    ];*/
    var columns = [];    
    this.cols.forEach((cl) => {
      var clobj = { header: cl.header, key: cl.field, width: 25 }
      columns.push(clobj);
    });
    sheet.columns = columns;

    this.resjobsevents.forEach((am) => {
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

    var filename = "respondent jobs.xlsx";
    /* save to file */
    workbook.xlsx.writeBuffer().then(function (data) {
      saveAs(new Blob([data], { type: 'application/octet-stream' }), filename);
    });
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
      this.sharedService.saveQuery('event', null, '', this.saveQueryName, this.filters)
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

  filtersEmit(res) {
    console.log(res);
    this.filters = res;
  }

  filterSubmit(res) {
    console.log(res);
    this.isLoading = true;
    this.filters = res.filters;
    this.maxrecords = res.maxrecords;

    this.loadData({ first: 0, rows: this.noofrows });
  }

  getEventTypeListWithBlank() {
    this.resservice.getEventTypeListWithBlank()
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
    this.postEventSucceeded = true;
    this.postEventErrors = [];

    //if (this.deleteItemIds.length > 0) {
    if (this.selectedRowData.length == 0) this.deleteItemIds = [];

    this.resevent.respondentIdsString = this.resId.toString();
    this.resservice.createResEvent(this.resevent)
      .subscribe((res: any) => {
        console.log(res);
        if (res.succeeded) {
          /*swal(
            res.successMsg,
            '',
            'success'
          );*/
          this.postEventMsg = res.successMsg;
          this.loadData({ first: 0, rows: this.noofrows });
        }
        else {
          /*var err = "";
          res.errors.forEach((er) => {
            err = err + " " + er;
          });
          swal(
            'Error!',
            err,
            'error'
          )*/
          this.postEventMsg = null;
          this.postEventSucceeded = false;
          this.postEventErrors = res.errors;
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
    /*this.postEventMsg = null;
    if (this.deleteItemIds.length > 0) {
      this.openEventModel.nativeElement.click();
      this.resevent = new ResEvent();
    }
    else {
      swal(
        'Oops...',
        'Please select an item to create event.',
        'info'
      )
    }*/

    this.isOpenEventModal = true;
    this.resevent = new ResEvent();
    setTimeout(() => {
      this.openEventModel.nativeElement.click();
    }, 1000)

    this.postEventMsg = null;
    this.postEventSucceeded = null;
    this.postEventErrors = [];
  }

  deleteJobs() {
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
          this.respondentservice.deleteResJobs(this.deleteItemIds)
            .subscribe((res: any) => {
              console.log(res);

              if (res.succeeded) {
                this.deleteItemIds = [];
                //this.getAllClients();
                this.loadData({ first: 0, rows: this.noofrows });

                for (var i = 0; i < this.clients.length; i++) {
                  this.selected[i] = false;
                }

                swal(
                  'Deleted!',
                  res.successMsg,
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
    /*}*/
  }

  unCheckAllItems() {
    this.deleteItemIds = [];
    this.selectedRowData = [];
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

  resetEventForm(event) {
    if (event) {
      this.resevent = new ResEvent();
      this.selectedClient = null;
      this.deleteItemIds = [];
      this.unCheckAllItems();
      this.isOpenEventModal = false;
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
