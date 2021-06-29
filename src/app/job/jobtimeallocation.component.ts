import { Component, OnInit, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { JobServices } from "../services/job.services";
import { TimeAllocation } from "../models/timeallocation";

declare var jQuery: any;
import swal from 'sweetalert2';

import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as stream from 'stream';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import { SecurityRights, SecurityRightsExportError } from '../shared/enum';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SharedServices } from '../services/shared.services';
import { PtableColumn } from '../models/ptablecolumn';
import { LazyLoadEvent } from 'primeng/api';

@Component({
  selector: 'JobTimeAllocationComponent',
  templateUrl: './jobtimeallocation.component.html',
})

export class JobTimeAllocationComponent implements OnInit {
  @Input() id: number;
  @Input() isUpdateJob: boolean;
  timeallocation: TimeAllocation;
  timeallocations: Array<TimeAllocation> = [];
  isLoading = true;

  deleteItemIds = [];
  timeallocationssummary = [];

  @ViewChild("closeAddNewModal") closeAddNewModal;
  @ViewChild("checkBox") checkBox;

  totalItems = 0;

  saveQueryName: string;
  maxrecords: any = null;
  filters: any;
  @ViewChild("saveQueryBtn") saveQueryBtn;
  isUpdateFiler = true;
  @ViewChild("saveQueryCancelBtn") saveQueryCancelBtn;

  totalTime: string;
  isSubmitForm = false;

  noofrows = 50;
  selectedColumns: Array<PtableColumn> = [];
  cols: Array<PtableColumn> = [];
  selectedRowData = [];
  ptablesearch: string;
  isShowFilter = true;
  totalRecords = 0;
  colVisData = [];
  selectedFilterId = null;

  constructor(private jobSerive: JobServices, private securityInfoResolve: SecurityInfoResolve,
    public sharedService: SharedServices) {
  }

  ngOnInit() {
    this.getTotalTrackedTime();
    this.getTimeAllocation();
    this.getJobTimeAllocationSummary();
  }

  getTimeAllocation() {
    this.cols = [
      { field: 'username', header: 'User', index: 0, width: '200', sort: false },
      { field: 'formattedStartTime', header: 'Start', index: 1, width: '150', sort: true },
      { field: 'formattedEndTime', header: 'End', index: 2, width: '150', sort: false },
      { field: 'hoursMinutesString', header: 'Duration', index: 3, width: 'auto', sort: false }
    ];

    this.selectedColumns = this.cols;
  }

  loadData(event: LazyLoadEvent) {
    if (!event.sortField) { event.sortField = "startTime" }
    if (!event.sortOrder) { event.sortOrder = -1 }

    console.log(event);
    this.sharedService.getDataWithFilter(event, this.colVisData, this.maxrecords, this.filters, "clientJobTimeAllocation", this.id)
      .subscribe((resp: any) => {
        // debugger;
        this.timeallocations = resp.value;
        this.totalRecords = resp.totalCount;
        console.log(this.timeallocations);
      });
  }

  getTotalTrackedTime() {
    this.jobSerive.getTotalTrackedTime(this.id)
      .subscribe((res: any) => {
        console.log(res);
        this.totalTime = res.value;
      });
  }

  getJobTimeAllocationSummary() {
    this.jobSerive.getJobTimeAllocationSummaryByClient(this.id)
      .subscribe((res: any) => {
        this.timeallocationssummary = res.value;
      });
  }

  exporttoExcelSummary() {
    this.securityInfoResolve.checkPermission(SecurityRights.ExportAllResults)
      .subscribe((res: any) => {
        if (res.succeeded) {
          this.exporttoExcelSummaryHelper();
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

  exporttoExcelSummaryHelper() {
    const workbook = new Excel.Workbook();
    var sheet = workbook.addWorksheet('My Sheet');

    sheet.columns = [
      { header: 'User', key: 'username', width: 15 },
      { header: 'Duration', key: 'hoursMinutesString', width: 15 }
    ];

    this.timeallocationssummary.forEach((am) => {
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

    var filename = "Time Allocation Summary.xlsx";
    /* save to file */
    workbook.xlsx.writeBuffer().then(function (data) {
      saveAs(new Blob([data], { type: 'application/octet-stream' }), filename);
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
      { header: 'User', key: 'username', width: 15 },
      { header: 'Start', key: 'startTime', width: 20 },
      { header: 'End', key: 'endTime', width: 20 },
      { header: 'Duraion', key: 'hoursMinutesString', width: 25 },
    ];

    this.timeallocations.forEach((am) => {
      var dataobj = {};
      //sheet
      sheet.columns.forEach(cl => {
        if (cl.key == 'startTime' || cl.key == 'endTime') {
          var cdate = moment(am[cl.key]).format('DD/MM/YYYY hh:mm');
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

    var filename = "Time Allocation Details.xlsx";
    /* save to file */
    workbook.xlsx.writeBuffer().then(function (data) {
      saveAs(new Blob([data], { type: 'application/octet-stream' }), filename);
    });
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
      this.sharedService.saveQuery('clientJobTimeAllocation', null, '', this.saveQueryName, this.filters)
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

  updateSelectedColumnsIndex() {
    this.selectedColumns.sort((a, b) => {
      if (a.index > b.index) return 1;
      if (a.index < b.index) return -1;
      return 0;
    })
  }
}
