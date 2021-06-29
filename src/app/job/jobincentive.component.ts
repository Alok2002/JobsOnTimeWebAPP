import { timeMask } from './../app.component';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { JobServices } from '../services/job.services';
import { Incentive } from '../models/incentive';

declare var jQuery: any;
import swal from 'sweetalert2';
import { SharedServices } from '../services/shared.services';

import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as stream from 'stream';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import { RespondentServices } from '../services/respondent.services';
import { SecurityRights, SecurityRightsExportError } from '../shared/enum';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { PtableColumn } from '../models/ptablecolumn';
import { ObjectUtils } from 'primeng/components/utils/objectutils';
import { JobInvoice } from '../models/jobinvoice';

@Component({
  selector: 'JobIncentiveComponent',
  templateUrl: './jobincentive.component.html'
})

export class JobIncentiveComponent implements OnInit {
  @Input() id: number;
  @Input() isUpdateJob: boolean;

  incentive: Incentive;
  incentives: Array<Incentive>;

  incentivesTypes = [];

  deleteItemIds = [];

  @ViewChild('closeAddNewModal') closeAddNewModal;
  @ViewChild('checkBox') checkBox;

  selected = [];
  isLoading = true;
  isSubmitForm = false;
  isSubmitFormSpinner = false;

  timeMask = timeMask;
  incentivesAmoutPoints = [];

  noofrows = 50;
  selectedColumns: Array<PtableColumn> = [];
  cols: Array<PtableColumn> = [];
  selectedRowData = [];
  ptablesearch: string;

  invoices: Array<JobInvoice> = [];

  constructor(private jobService: JobServices, private securityInfoResolve: SecurityInfoResolve,
    private sharedService: SharedServices, private resService: RespondentServices) {
  }

  ngOnInit() {
    this.cols = [
      { field: 'incentiveType', header: 'Incentive Type', width: '300', index: 0, sort: true },
      { field: 'incentiveAmount', header: 'Incentives', width: '200', index: 1, sort: false },      
      { field: 'formattedDuration', header: 'Duration', width: '150', index: 2, sort: false },
      { field: 'description', header: 'Description', width: '300', index: 3, sort: false },
      { field: 'notes', header: 'Notes', width: 'auto', index: 4, sort: false },
      { field: 'invoiceItemId', header: 'Invoice Item', width: '250', index: 5, sort: false },
    ];

    this.selectedColumns = this.cols;

    if (this.id != null && this.isUpdateJob) {
      this.getJobIncentives();
    }
    this.getIncentiveTypes();
    this.addNew();
    this.getIncentives();
    this.getInvoicesByJobId();
  }

  getInvoicesByJobId() {
    this.jobService.getInvoicesByJobId(this.id)
      .subscribe((res: any) => {
        console.log(res)
        this.invoices = res.value;
      })
  }

  addNew() {
    this.incentive = new Incentive();
  }

  getJobIncentives() {
    this.jobService.getJobIncentivesByJob(this.id)
      .subscribe((res: any) => {
        this.incentives = res.value;
        console.log(this.incentives)
      });
  }

  ngAfterViewInit() {
  }

  delete() {
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

          this.jobService.deleteIncentive(this.deleteItemIds)
            .subscribe((res: any) => {
              if (res.succeeded) {
                this.deleteItemIds = [];
                this.getJobIncentives();

                for (var i = 0; i < this.incentives.length; i++) {
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
  }*/

  editIncentive(id) {
    this.incentives.forEach((item) => {
      if (item.id == id) {
        this.incentive = item;
      }
    });
  }

  getIncentiveTypes() {
    this.sharedService.getIncentiveTypeList()
      .subscribe((res: any) => {
        this.incentivesTypes = res.value;
      });
  }

  updateorCreateClientContact(form) {
    this.isSubmitForm = true;
    this.isSubmitFormSpinner = true;
    if (form.invalid) {
      //this.isSubmitForm = false;
      this.isSubmitFormSpinner = false;
    } else {
      this.incentive.clientJobId = this.id;
      this.incentive.selected = false;
      this.jobService.updateJobIncentive(this.incentive)
        .subscribe((res: any) => {
          this.isSubmitFormSpinner = false;
          this.isSubmitForm = false;

          if (res.succeeded) {
            this.closeAddNewModal.nativeElement.click();
            //this.router.navigate(['/client']);
            this.getJobIncentives();
          }
        });
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
      { header: 'Incentive Type', key: 'incentiveType', width: 20 },
      { header: 'Incentive Amount', key: 'incentiveAmount', width: 25 },
      { header: 'Incentive Criteria', key: 'incentiveCriteria', width: 30 }
    ];

    this.incentives.forEach((am) => {
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

    var filename = 'Job Incentive.xlsx';
    /* save to file */
    workbook.xlsx.writeBuffer().then(function (data) {
      saveAs(new Blob([data], { type: 'application/octet-stream' }), filename);
    });
  }

  unmask(value) {
    var ret = value.replace(/\D+/g, '');
    return ret;
  }

  getIncentives() {
    this.resService.getRespondentData('Incentive', 0)
      .subscribe((res: any) => {
        console.log(res);
        this.incentivesAmoutPoints = res.value;
      });
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

  getInvoiceItemNameById(invoiceItemId) {
    var ret = '';
    if (invoiceItemId) {
      var index = this.invoices.findIndex(inv => inv.id == invoiceItemId);
      if (index >= 0)
        ret = this.invoices[index].itemDescription;
    }
    return ret;
  }
}
