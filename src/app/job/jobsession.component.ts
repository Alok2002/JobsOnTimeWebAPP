import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import { saveAs } from 'file-saver';
import { CookieService } from 'ngx-cookie-service';
import swal from 'sweetalert2';

import { apiHost } from '../app.component';
import { Email } from '../models/email';
import { Incentive } from '../models/incentive';
import { Session } from '../models/session';
import { SessionContact } from '../models/sessioncontact';
import { SessionVenue } from '../models/sessionvenue';
import { JobServices } from '../services/job.services';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SecurityRights, SecurityRightsExportError } from '../shared/enum';
import { SharedServices } from '../services/shared.services';
import { EmailServices } from '../services/email.services';
import { PtableColumn } from '../models/ptablecolumn';
import { LazyLoadEvent } from 'primeng/api';
import * as moment from 'moment';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'JobSessionComponent',
  templateUrl: './jobsession.component.html'
})

export class JobSessionComponent implements OnInit {
  @Input() id: number;
  @Input() isUpdateJob: boolean;
  @Input() isSessionCalendar: boolean;

  sessions: Array<Session>;

  deleteItemIds = [];
  isSubmitForm = false;
  isSubmitFormSpinner = false;
  isLoading = true;

  @ViewChild('closeAddNewModal')
  closeAddNewModal;
  @ViewChild('checkBox')
  checkBox;

  selected = [];

  dataTablesParameters: any;
  totalItems = 0;

  saveQueryName: string;
  maxrecords: any = null;
  filters: any;
  @ViewChild('saveQueryBtn') saveQueryBtn;

  isSelectAllItem = false;
  isUpdateFiler = false;
  @ViewChild("saveQueryCancelBtn") saveQueryCancelBtn;

  apihost = apiHost;
  @ViewChild("documentBtn") documentBtn;

  viewSessionName: string;
  viewContacts: Array<SessionContact>;
  viewVenues: Array<SessionVenue>;
  viewIncentives: Array<{ clientJobGroupId: number, clientJobIncentiveId: number, clientJobIncentives: Incentive }>;
  viewClientJobGroupTime: Array<{ id: number, clientJobGroupId: number, groupTime: string, formattedGroupTime: string, interviewTime: string }>;


  @ViewChild('downloadBtn') downloadBtn;

  emailData = new Email();
  @ViewChild("emailModlaBtn") emailModlaBtn;

  emailModalTitle: string;
  @ViewChild("emailBtn") emailBtn;

  token: string;

  noofrows = 50;
  selectedColumns: Array<PtableColumn> = [];
  cols: Array<PtableColumn> = [];
  selectedRowData = [];
  ptablesearch: string;
  isShowFilter = true;
  totalRecords = 0;
  colVisData = [];
  selectedFilterId = null;
  nextSessionNo: number;

  sortField: string = 'loading';
  sortOrder: number = 1;

  constructor(private jobservice: JobServices, private cookieservice: CookieService,
    private sharedService: SharedServices, private emailservice: EmailServices,
    private securityInfoResolve: SecurityInfoResolve) {
  }

  ngOnInit() {
    if (this.cookieservice.check('auth_token')) {
      this.token = this.cookieservice.get('auth_token');
    }

    this.getSessions();
    this.getSessionSort();
  }

  getSessions() {
    this.cols = [
      { field: 'sessionNumber', header: 'Session Number', index: 3, width: '125', sort: true },
      { field: 'name', header: 'Session Name', index: 4, width: '300', sort: true },
      { field: 'dateTime', header: 'Session Date', index: 5, width: '150', sort: false },
      { field: 'groupType', header: 'Type', index: 6, width: '150', sort: false },
      { field: 'projectManagerName', header: 'Project Manager', index: 7, width: '110', sort: false },
      { field: 'contact', header: 'Contact', index: 8, width: '75', sort: false, textAlign: 'center' },
      { field: 'venue', header: 'Venue', index: 9, width: '75', sort: false, textAlign: 'center' },
      { field: 'incentive', header: 'Incentive', index: 10, width: '75', sort: false, textAlign: 'center' },
      { field: 'times', header: 'Times', index: 11, width: '75', sort: false, textAlign: 'center' },
      { field: 'respondentsRequired', header: 'Req', index: 12, width: '50', sort: false },
      { field: 'numberOfQualifiedRespondents', header: 'Qual', index: 13, width: '50', sort: false },
      { field: 'numberNeeded', header: 'Need', index: 14, width: '50', sort: false },
      { field: 'numberOfEmailConfirmedRespondents', header: 'Conf Email Sent', index: 15, width: '100', sort: false },
      { field: 'numberOfSmsConfirmedRespondents', header: 'Conf SMS Sent', index: 16, width: '100', sort: false },
      { field: 'numberOfFinalConfirmedRespondents', header: 'Confirmed', index: 17, width: '75', sort: false },
      { field: 'validationReportReceived', header: 'RVR Rcvd', index: 18, width: '100', sort: false, textAlign: 'center' },
      { field: 'validationReportSent', header: 'RVR Sent', index: 19, width: '100', sort: false, textAlign: 'center' },
      { field: 'afterHourSession', header: 'After Hours', index: 20, width: '100', sort: false, textAlign: 'center' },
      { field: 'other', header: 'Other', index: 21, width: '350', sort: false }
    ];

    if (this.isSessionCalendar) {
      this.cols.push(
        { field: 'jobNumber', header: 'Job No', index: 0, width: '65', sort: false },
        { field: 'jobName', header: 'Job Name', index: 1, width: '250', sort: false },
        { field: 'clientName', header: 'Client', index: 2, width: '200', sort: false },
      )
    }

    this.cols.sort((a, b) => {
      if (a.index > b.index) return 1;
      if (a.index < b.index) return -1;
      return 0;
    })

    console.log(this.cols);

    this.selectedColumns = this.cols;
  }

  loadData(event: LazyLoadEvent) {
    if (!event.sortField) { event.sortField = this.sortField }
    if (!event.sortOrder) { event.sortOrder = this.sortOrder }

    console.log(event);
    this.sharedService.getDataWithFilter(event, this.colVisData, this.maxrecords, this.filters, 'jobgroup', this.id)
      .subscribe((resp: any) => {
        // debugger;
        this.sessions = resp.value;
        this.totalRecords = resp.totalCount;
        console.log(this.sessions);

        var sessionList: Array<Session> = [];
        sessionList = JSON.parse(JSON.stringify(this.sessions));
        sessionList.sort((a, b) => {
          if (a.sessionNumber < b.sessionNumber)
            return -1;
          if (a.sessionNumber > b.sessionNumber)
            return 1;
          return 0;
        });
        this.nextSessionNo = sessionList.length > 0 ? sessionList[sessionList.length - 1].sessionNumber + 1 : 1;
      });
  }

  ngAfterViewInit() {
  }

  deleteSession() {
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


          this.jobservice.deleteSession(this.deleteItemIds)
            .subscribe((res: any) => {
              if (res.succeeded) {
                this.deleteItemIds = [];
                this.loadData({ first: 0, rows: this.noofrows });

                for (var i = 0; i < this.sessions.length; i++) {
                  this.selected[i] = false;
                }
                swal(
                  'Deleted!',
                  'Selected item has been deleted.',
                  'success'
                );
              } else {
                var err = '';
                res.errors.forEach((er) => {
                  err = err + ' ' + er;
                });
                swal(
                  'Error!',
                  err,
                  'error'
                );
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
      { header: 'Job No', key: 'jobNumber', width: 20 },
      { header: 'Job Name', key: 'jobName', width: 50 },
      { header: 'Client', key: 'clientName', width: 50 },
      { header: 'Session Name', key: 'name', width: 50 },
      { header: 'Session Date', key: 'dateTime', width: 20 },
      { header: 'Type', key: 'groupType', width: 20 },
      { header: 'Project Manager', key: 'projectManagerUsername', width: 20 },
      { header: 'Req', key: 'respondentsRequired', width: 30 },
      { header: 'Qual', key: 'numberOfQualifiedRespondents', width: 15 },
      { header: 'Confirmed', key: 'numberOfConfirmedRespondents', width: 30 },
      { header: 'RVR Rcvd', key: 'validationReportReceived', width: 15 },
      { header: 'RVR Sent', key: 'validationReportSent', width: 10 },
      { header: 'Other', key: 'other', width: 10 },
    ];

    this.sessions.forEach((am) => {
      var dataobj = {};
      //sheet
      sheet.columns.forEach(cl => {
        dataobj[cl.key] = am[cl.key];
      });

      sheet.addRow(dataobj);
    });

    sheet.getRow('1').font = {
      size: 14,
      bold: true
    };

    var filename = 'Job Session.xlsx';
    /* save to file */
    workbook.xlsx.writeBuffer().then(function (data) {
      saveAs(new Blob([data], { type: 'application/octet-stream' }), filename);
    });
  }

  unCheckAllItems() {
    this.selectedRowData = []
    this.deleteItemIds = [];
  }

  filterSubmit(res) {
    console.log(res);
    this.isLoading = true;
    this.filters = res.filters;
    this.maxrecords = res.maxrecords;

    this.loadData({ first: 0, rows: this.noofrows });
  }

  saveQuery(form) {
    this.isUpdateFiler = false;
    this.isSubmitForm = true;
    if (!form.invalid) {
      this.sharedService.saveQuery('jobgroup', null, '', this.saveQueryName, this.filters)
        .subscribe((res: any) => {
          console.log(res);
          if (res.succeeded) {
            this.selectedFilterId = res.value;
            this.isUpdateFiler = true;
            this.isSubmitForm = false;
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
        });
    }
  }

  filtersEmit(res) {
    console.log(res);
    this.filters = res;
  }

  openSaveQueryModal() {
    this.saveQueryName = '';
    if (this.filters && this.filters.length > 0) {
      this.saveQueryBtn.nativeElement.click();
    }
    else {
      swal(
        'Oops...',
        'Select at least one filter to save query.',
        'info'
      );
    }
  }

  openDocument(btn) {
    this.deleteItemIds = [];
    this.selectedRowData.forEach(rd => {
      this.deleteItemIds.push(rd.id);
    })


    if (this.deleteItemIds.length > 0) {
      if (btn == 'docbtn')
        this.documentBtn.nativeElement.click();
      if (btn == 'emailbtn')
        this.emailBtn.nativeElement.click();
      /*if (this.deleteItemIds.length == 1) {
        this.documentBtn.nativeElement.click();
      } else {
        swal(
          'Oops...',
          'Please select only one job.',
          'info'
        );
      }*/
    } else {
      swal(
        'Oops...',
        'Please select a job session.',
        'info'
      );
    }
  }

  downloadSessionDoc(cat) {
    console.log(this.downloadBtn);
    this.deleteItemIds.forEach((di, i) => {
      var url = this.apihost + '/api/' + cat + '/' + di + '/?token=' + this.token;
      console.log(url);
      //var newWindow = window.open(url, '_blank');

      /*$.ajax({
        url: url,
        data: {},
        // remember, this request is just returning the URL we need.
        success: function (data) {
          var w = window.open(url, 'document' + i, 'height=520,width=720');
        }
      });*/

      setTimeout(() => {
        var w = window.open(url, 'document' + i, 'height=520,width=720');
      }, 500)

      /*this.downloadBtn.nativeElement.href = url;
      this.downloadBtn.nativeElement.click();*/

      //this.downloadBtn.nativeElement.insertAdjacentHTML('beforeend', '<a style="visibility: hidden" href=' + url + ' id="download-' + i + '"></a>');
    });

    /*setTimeout(() => {
      this.deleteItemIds.forEach((di, i) => {
        $('#download-' + i)[0].click();
      });
    }, 1000);*/
  }

  generateEmailData(entity, title) {
    this.emailModalTitle = title;
    this.deleteItemIds = [];
    this.selectedRowData.forEach(rd => {
      this.deleteItemIds.push(rd.id);
    })

    var ids = "?";
    this.deleteItemIds.forEach(di => {
      ids += 'sessionids=' + di + '&';
    });
    this.emailservice.getEmailData(entity, ids)
      .subscribe((res: any) => {
        console.log(res);
        if (res.succeeded) {
          this.emailData = res.value;
          console.log(this.emailData);
          setTimeout(() => {
            this.emailModlaBtn.nativeElement.click();
          }, 1000)
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

  getSessionSort() {
    this.sharedService.getSessionSort()
      .subscribe((res: any) => {
        console.log(res);
        if (res.value) {
          var valArr = res.value.value.split(':');
          this.sortField = valArr[0];
          this.sortOrder = valArr[1];
        }
      })
  }

  getFormattedTime(interviewTime) {
    var ret = "";
    if (interviewTime) {
      var mm = moment(interviewTime, 'hh:mm:ss');
      ret = mm.format('hh:mm A');
    }
    return ret;
  }
}
