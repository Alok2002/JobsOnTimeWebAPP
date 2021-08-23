import { ObjectUtils } from 'primeng/components/utils/objectutils';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { JobServices } from '../services/job.services';
import { JobQuota } from '../models/jobquota';

declare var jQuery: any;
import swal from 'sweetalert2';

import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as stream from 'stream';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import { SecurityRights, SecurityRightsExportError } from '../shared/enum';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { PtableColumn } from '../models/ptablecolumn';

@Component({
  selector: 'JobQuotaComponent',
  templateUrl: './jobquota.component.html'
})

export class JobQuotaComponent implements OnInit {
  @Input() id: number;
  @Input() isUpdateJob: boolean;

  jobQuota: JobQuota;
  jobQuotas: Array<JobQuota>;

  deleteItemIds = [];

  @ViewChild('closeAddNewModal') closeAddNewModal;
  @ViewChild('checkBox') checkBox;

  selected = [];

  isSubmitForm = false;
  isSubmitFormSpinner = false;
  isLoading = true;

  /*quotaDescSource = [{id: 'Female', value: 'Female'},
    {id: 'Male', value: 'Male'},
    {id: '0-9', value: '0-9'},
    {id: '10-19', value: '10-19'},
    {id: '20-29', value: '20-29'},
    {id: '30-39', value: '30-39'},
    {id: '40-49', value: '40-49'},
    {id: '50-59', value: '50-59'},
    {id: '60-69', value: '60-69'},
    {id: '70-79', value: '70-79'},
    {id: '80-89', value: '80-89'},
    {id: '90-99', value: '90-99'},
    {id: 'Sydney', value: 'Sydney'},
    {id: 'Melbourne', value: 'Melbourne'},
    {id: 'Brisbane', value: 'Brisbane'},
    {id: 'North', value: 'North'},
    {id: 'East', value: 'East'},
    {id: 'West', value: 'West'},
    {id: 'South', value: 'South'}];*/

  quotaDescSource = ['Female', 'Male', '0-9', '10-19', '20-29', '30-39', '40-49', '50-59', '60-69', '70-79', '80-89', '90-99',
    'Sydney', 'Melbourne', 'Brisbane', 'North', 'East', 'West', 'South'];

  math = Math;

  noofrows = 50;
  selectedColumns: Array<PtableColumn> = [];
  cols: Array<PtableColumn> = [];
  selectedRowData = [];
  ptablesearch: string;

  constructor(private jobservice: JobServices, private securityInfoResolve: SecurityInfoResolve) {
  }

  ngOnInit() {
    this.cols = [
      { field: 'description', header: 'Description', width: 'auto', index: 0, sort: true },
      { field: 'surveyQuotaRequired', header: 'Survey Quota Required', width: 'auto', index: 1, sort: false },
      { field: 'surveyQuotaQualified', header: 'Survey Quota Qualified', width: 'auto', index: 2, sort: true },
      { field: 'surveyQuotaNeeded', header: 'Survey Quota Needed', width: 'auto', index: 3, sort: false },
      { field: 'screenerQuotaRequired', header: 'Screener Quota Required', width: 'auto', index: 4, sort: true },
      { field: 'screenerQuotaQualified', header: 'Screener Quota Qualified', width: 'auto', index: 5, sort: true },
      { field: 'screenerQuotaNeeded', header: 'Screener Quota Needed', width: 'auto', index: 6, sort: false },
    ];
    this.selectedColumns = this.cols;
    this.getJobQuota();
    this.addNew();
  }

  getJobQuota() {
    this.jobservice.getQuotaByJob(this.id)
      .subscribe((res: any) => {
        this.jobQuotas = res.value;

        console.log(this.jobQuotas);
      });
  }

  addNew() {
    this.jobQuota = new JobQuota();
    this.jobQuota.isScreener = false;
    this.jobQuota.isSurvey = false;
  }

  ngAfterViewInit() {
  }

  deleteAddress() {
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


          this.jobservice.deleteQuota(this.deleteItemIds)
            .subscribe((res: any) => {
              if (res.succeeded) {
                this.deleteItemIds = [];
                this.getJobQuota();

                for (var i = 0; i < this.jobQuotas.length; i++) {
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
    }
    else {
      swal(
        'Oops...',
        'Please select an item to delete.',
        'info'
      );
    }
  }

  deleteClearQualifiedQuota() {
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
        confirmButtonText: 'Yes, clear it!',
        confirmButtonColor: '#ffaa00',
        cancelButtonText: 'No, keep it'
      }).then((result) => {
        if (result.value) {
          this.jobservice.deleteQuotaClear(this.deleteItemIds)
            .subscribe((res: any) => {
              if (res.succeeded) {
                this.deleteItemIds = [];
                this.getJobQuota();

                for (var i = 0; i < this.jobQuotas.length; i++) {
                  this.selected[i] = false;
                }
                swal(
                  'Cleared!',
                  'Selected item has been cleared.',
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
    }
    else {
      swal(
        'Oops...',
        'Please select an item to delete.',
        'info'
      );
    }
  }

  submitQuota(form) {
    this.isSubmitForm = true;
    this.isSubmitFormSpinner = true;
    if (form.invalid) {
      //this.isSubmitForm = false;
      this.isSubmitFormSpinner = false;
    }
    else {
      this.jobQuota.jobId = this.id;

      /*if (this.jobQuota.descriptionObj && this.jobQuota.descriptionObj.value)
        this.jobQuota.description = this.jobQuota.descriptionObj.value;*/

      if (this.jobQuota.remainingPositions == null || this.jobQuota.remainingPositions.toString() == '') this.jobQuota.remainingPositions = 0;

      if (this.jobQuota.surveyQuotaRequired == null || this.jobQuota.surveyQuotaRequired.toString() == '') this.jobQuota.surveyQuotaRequired = 0;
      if (this.jobQuota.screenerQuotaRequired == null || this.jobQuota.screenerQuotaRequired.toString() == '') this.jobQuota.screenerQuotaRequired = 0;

      console.log(this.jobQuota);

      this.jobservice.updateJobQuota(this.jobQuota)
        .subscribe((res: any) => {
          this.isSubmitFormSpinner = false;
          this.isSubmitForm = false;
          if (res.succeeded) {
            this.closeAddNewModal.nativeElement.click();
            //this.router.navigate(['/client']);
            this.getJobQuota();
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

  editQuota(id) {
    this.jobQuotas.forEach((item) => {
      if (item.id == id) {
        this.jobQuota = item;
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
      { header: 'Job Id', key: 'jobId', width: 20 },
      { header: 'Description', key: 'description', width: 50 },
      { header: 'Total Number Required', key: 'positions', width: 30 }
    ];

    this.jobQuotas.forEach((am) => {
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

    var filename = 'Job Quota.xlsx';
    /* save to file */
    workbook.xlsx.writeBuffer().then(function (data) {
      saveAs(new Blob([data], { type: 'application/octet-stream' }), filename);
    });
  }

  listFormatter(data: any): string {
    return data['value'];
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
