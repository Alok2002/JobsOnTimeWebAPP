import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router, NavigationEnd, RoutesRecognized } from '@angular/router';
import { Venue } from '../models/venue';
import { State } from '../models/state';
declare var jQuery: any;
import swal from 'sweetalert2';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as stream from 'stream';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import { JobVenue } from '../models/jobvenue';
import { Job } from '../models/job';
import { JobQueries } from "../models/jobqueries";
import { SecurityRights, SecurityRightsExportError } from '../shared/enum';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { JobServices } from '../services/job.services';
import { SharedServices } from '../services/shared.services';
import { ClientServices } from '../services/client.services';
import { PtableColumn } from '../models/ptablecolumn';
import { ObjectUtils } from 'primeng/components/utils/objectutils';

@Component({
  selector: 'GlobalQueriesComponent',
  templateUrl: './globalqueries.component.html'
})

export class GlobalQueriesComponent implements OnInit {
  id: number = 0;
  isLoading = true;
  deleteItemIds = [];
  isSubmitForm = false;
  isSubmitFormSpinner = false;

  @ViewChild("closeAddNewModal") closeAddNewModal;
  @ViewChild("checkBox") checkBox;

  selected = [];
  jobQueries: Array<JobQueries> = [];
  job: Job;
  isSelectAllItem = false;

  noofrows = 50;
  selectedColumns: Array<PtableColumn> = [];
  cols: Array<PtableColumn> = [];
  selectedRowData = [];
  ptablesearch: string;

  constructor(private router: Router, private jobservice: JobServices,
    private sharedservice: SharedServices, private securityInfoResolve: SecurityInfoResolve,
    private clientSevice: ClientServices) { }

  ngOnInit() {
    this.cols = [
      { field: 'name', header: 'Name', width: '600', index: 0, sort: true },
      { field: 'creatingUser', header: 'User', width: '250', index: 1, sort: true },
      { field: 'module', header: 'Module', width: 'auto', index: 2, sort: true },
    ];

    this.selectedColumns = this.cols;

    this.getJobById(this.id);
    this.getJobQueriesByJobId();
  }

  addNewJobQuery() {
    //this.jobvenue = new JobVenue();
  }

  getJobById(id) {
    this.jobservice.getJobsByJob(id)
      .subscribe((res: any) => {
        this.job = res.value;
      });
  }

  getJobQueriesByJobId() {
    this.jobservice.getQueriesByJobId(this.id)
      .subscribe((res: any) => {
        this.jobQueries = res.value;
        console.log(this.jobQueries);
        this.isLoading = false;
      })
  }

  ngAfterViewInit() {
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
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Contact Name', key: 'contactName', width: 20 },
      { header: 'Address', key: 'address', width: 50 },
      { header: 'Suburb', key: 'suburb', width: 20 },
      { header: 'Postcode', key: 'postcode', width: 15 },
      { header: 'State', key: 'state', width: 20 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Mobile', key: 'mobile', width: 15 }
    ];

    this.jobQueries.forEach((am) => {
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

    var filename = "Client Venue.xlsx";
    /* save to file */
    workbook.xlsx.writeBuffer().then(function (data) {
      saveAs(new Blob([data], { type: 'application/octet-stream' }), filename);
    });
  }

  deleteQueries() {
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
          this.jobservice.deleteQueries(this.deleteItemIds)
            .subscribe((res: any) => {
              console.log(res);

              if (res.succeeded) {
                this.deleteItemIds = [];
                this.getJobQueriesByJobId();
                this.unCheckAllItems();

                for (var i = 0; i < this.jobQueries.length; i++) {
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
    /*}*/
  }

  unCheckAllItems() {
    this.deleteItemIds = [];
    this.selectedRowData = [];
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

