import { SecurityRightsExportError } from './../shared/enum';
import { RespondentServices } from './../services/respondent.services';
import { PrivateList } from './../models/privatelist';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedServices } from '../services/shared.services';
import { UserServices } from '../services/user.services';
import { PtableColumn } from '../models/ptablecolumn';
import swal from 'sweetalert2';
import { LazyLoadEvent } from 'primeng/api';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SecurityRights } from '../shared/enum';
import { ResEvent } from '../models/resevent';

declare var jQuery: any;
// declare var tinymce: any;

@Component({
  selector: 'SeachEventsComponent',
  templateUrl: './searchevents.component.html'
})

export class SearchEventsComponent implements OnInit {
  selectedColumns: Array<PtableColumn> = [];
  cols: Array<PtableColumn> = [];
  privateListList: Array<PrivateList> = [];
  privateList = new PrivateList();
  noofrows = 50;
  selectedRowData = [];
  ptablesearch: string;
  selected = [];
  isSubmitForm = false;
  colVisData = [];

  @ViewChild("saveQueryCancelBtn") saveQueryCancelBtn;
  isUpdateFiler = true;

  saveQueryName: string;
  maxrecords: any = null;
  filters: any;
  @ViewChild("saveQueryBtn") saveQueryBtn;
  resjobsevents = [];
  totalRecords = 0;
  isShowFilter = true;

  isOpenEventModal = false;
  resevent = new ResEvent();
  postEventMsg: string;
  @ViewChild("openEventModel") openEventModel;
  isLoading = false;
  selectedFilterId = null;

  constructor(private router: Router, private sharedservice: SharedServices, private securityInfoResolve: SecurityInfoResolve,
    private _userService: UserServices, private activateroute: ActivatedRoute) {
    // tinymce.remove();
  }

  ngOnInit() {
    this.getResJobsEvents();
  }

  getResJobsEvents() {
    this.cols = [
      { field: 'eventDate', header: 'Date', index: 0, width: '125', sort: false },
      { field: 'resId', header: 'Respondent Id', index: 1, width: '100', sort: false },      
      { field: 'respondentFullName', header: 'Name', index: 2, width: '150', sort: false },
      { field: 'userName', header: 'User Name', index: 3, width: '75', sort: false },
      { field: 'eventDescription', header: 'Event', index: 4, width: '150', sort: false },
      { field: 'jobNumber', header: 'Job No', index: 5, width: '75', sort: false },
      { field: 'jobNumberAndName', header: 'Job Name', index: 6, width: '280', sort: false },      
      { field: 'sessionName', header: 'Session', index: 7, width: '200', sort: false },      
      { field: 'eventNotes', header: 'Notes', index: 8, width: 'auto', sort: false },
      // { field: 'inDepthTime', header: 'In Depth Time', index: 9, width: '100', sort: false },
      // { field: 'respondentConfirmed', header: 'Confirmed', index: 10, width: '150', sort: false }
    ];

    this.selectedColumns = this.cols;
  }

  loadData(event: LazyLoadEvent) {
    if (!event.sortField) { event.sortField = "eventDate" }
    if (!event.sortOrder) { event.sortOrder = -1 }

    console.log(event);
    this.sharedservice.getDataWithFilter(event, this.colVisData, this.maxrecords, this.filters, "searchEvents", 0)
      .subscribe((resp: any) => {
        // debugger;
        this.resjobsevents = resp.value;
        this.totalRecords = resp.totalCount;
        console.log(this.resjobsevents);
      });
  }

  updateSelectedColumnsIndex() {
    this.selectedColumns.sort((a, b) => {
      if (a.index > b.index) return 1;
      if (a.index < b.index) return -1;
      return 0;
    })
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

    sheet.columns = [
      { header: 'Date', key: 'eventDate', width: 15 },
      { header: 'Event', key: 'eventDescription', width: 50 },
      { header: 'User', key: 'fullName', width: 25 },
      { header: 'Notes', key: 'eventNotes', width: 50 },
      { header: 'Total Points', key: 'numberOfPoints', width: 15 },
      { header: 'Client', key: '', width: 30 },
      { header: 'Job', key: 'jobId', width: 10 },
      { header: 'Job Name', key: 'jobNumberAndName', width: 30 },
      { header: 'Subject', key: '', width: 30 }
    ];

    this.resjobsevents.forEach((am) => {
      var dataobj = {};
      //sheet
      sheet.columns.forEach(cl => {
        if (cl.key == 'eventDate') {
          var cdate = moment(am[cl.key]).format('DD/MM/YYYY');
          dataobj[cl.key] = cdate;
        }
        else if (cl.key == 'fullName')
          dataobj[cl.key] = am['userNameNavigation'][cl.key];
        else
          dataobj[cl.key] = am[cl.key];
      });

      sheet.addRow(dataobj);
    });

    sheet.getRow('1').font = {
      size: 14,
      bold: true
    };

    var filename = "search events.xlsx";
    /* save to file */
    workbook.xlsx.writeBuffer().then(function (data) {
      saveAs(new Blob([data], { type: 'application/octet-stream' }), filename);
    });
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
      this.sharedservice.saveQuery('event', null, '', this.saveQueryName, this.filters)
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
}
