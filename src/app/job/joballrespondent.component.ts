import { RespondentServices } from './../services/respondent.services';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { JobServices } from "../services/job.services";
import { JobRespondent } from "../models/jobrespondent";

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
  selector: 'JobAllRespondentComponent',
  templateUrl: './joballrespondent.component.html'
})

export class JobAllRespondentComponent {
  @Input() id: number;
  @Input() isUpdateJob: boolean;

  respondents: Array<JobRespondent>;

  isLoading = true;

  saveQueryName: string;
  maxrecords: any = null;
  filters: any;
  @ViewChild("saveQueryBtn") saveQueryBtn;
  @ViewChild("saveQueryCancelBtn") saveQueryCancelBtn;
  isUpdateFiler = true;

  totalItems = 0;

  dataTablesParameters: any;
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
  deleteItemIds = [];

  constructor(private jobservice: JobServices, private securityInfoResolve: SecurityInfoResolve,
    private sharedService: SharedServices, private respondentservice: RespondentServices) { }

  ngOnInit() {
    this.getAllbyRes();
  }

  getAllbyRes() {
    this.cols = [
      { field: 'resId', header: 'ID', index: 0, width: '75', sort: false },
      { field: 'respondentFullName', header: 'Name', index: 1, width: '200', sort: false },
      { field: 'userFullName', header: 'User', index: 2, width: '150', sort: false },
      { field: 'eventDate', header: 'Event Date', index: 3, width: '150', sort: false },
      { field: 'eventDescription', header: 'Event', index: 4, width: '200', sort: false },
      { field: 'inDepthTime', header: 'In Depth Time', index: 5, width: '100', sort: false },
      { field: 'eventNotes', header: 'Notes', index: 6, width: 'auto', sort: false },
      { field: 'respondentConfirmed', header: 'Confirmed', index: 6, width: '150', sort: false }
    ];

    this.selectedColumns = this.cols;
  }

  loadData(event: LazyLoadEvent) {
    if (!event.sortField) { event.sortField = "eventDate" }
    if (!event.sortOrder) { event.sortOrder = -1 }

    this.sharedService.getDataWithFilter(event, this.colVisData, this.maxrecords, this.filters, "jobAllRespondents", this.id)
      .subscribe((resp: any) => {
        debugger;
        console.log(resp);
        this.respondents = resp.value;
        this.totalRecords = resp.totalCount;
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
      { header: 'ID', key: 'resId', width: 10 },
      { header: 'Name', key: 'respondentFullName', width: 25 },
      { header: 'User', key: 'userName', width: 15 },
      { header: 'Event Date', key: 'eventDate', width: 15 },
      { header: 'Event', key: 'eventDescription', width: 50 },
      { header: 'In Depth Time', key: 'inDepthTime', width: 15 },
      { header: 'Notes', key: 'eventNotes', width: 50 }
    ];

    this.respondents.forEach((am) => {
      var dataobj = {};
      //sheet
      sheet.columns.forEach(cl => {
        /*if (cl.key == 'resId' || cl.key == 'respondentFullName')
          dataobj[cl.key] = am['res']['contactType'];
        else*/ if (cl.key == 'eventDate' || cl.key == 'inDepthTime') {
          if (am[cl.key] && am[cl.key] != '0001-01-01T00:00:00') {
            var cdate = moment(am[cl.key]).format('DD/MM/YYYY hh:mm a');
            dataobj[cl.key] = cdate;
          }
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

    var filename = "Job all respondent.xlsx";
    /* save to file */
    workbook.xlsx.writeBuffer().then(function (data) {
      saveAs(new Blob([data], { type: 'application/octet-stream' }), filename);
    });
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
    this.isSubmitForm = false;
    if (!form.invalid) {
      this.sharedService.saveQuery('auditlog', null, '', this.saveQueryName, this.filters)
        .subscribe((res: any) => {
          console.log(res);
          if (res.succeeded) {
            this.selectedFilterId = res.value;
            this.isUpdateFiler = true;
            this.isSubmitForm = true;
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

  updateSelectedColumnsIndex() {
    this.selectedColumns.sort((a, b) => {
      if (a.index > b.index) return 1;
      if (a.index < b.index) return -1;
      return 0;
    })
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
    /*}*/
  }
}
