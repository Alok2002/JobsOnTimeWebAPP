import { Component, Input, OnInit, ViewChild } from '@angular/core';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import { saveAs } from 'file-saver';
import { Subject } from 'rxjs/Subject';
import swal from 'sweetalert2';

import { JobQuota } from '../models/jobquota';
import { JobServices } from '../services/job.services';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SessionServices } from '../services/session.services';
import { SecurityRights, SecurityRightsExportError } from '../shared/enum';

declare var jQuery: any;

@Component({
  selector: 'SessionQuota',
  templateUrl: './sessionquota.component.html'
})

export class SessionQuota implements OnInit {
  @Input() id: number;
  @Input() isUpdateSession: boolean;
  @Input() jobId: number;

  jobQuota: JobQuota;
  jobQuotas: Array<JobQuota>;

  deleteItemIds = [];

  @ViewChild('closeAddNewModal') closeAddNewModal;
  @ViewChild('checkBox') checkBox;

  selected = [];

  isSubmitForm = false;
  isSubmitFormSpinner = false;
  isLoading = true;

  quotaDescSource = ['Female', 'Male', '0-9', '10-19', '20-29', '30-39', '40-49', '50-59', '60-69', '70-79', '80-89', '90-99',
    'Sydney', 'Melbourne', 'Brisbane', 'North', 'East', 'West', 'South'];

  constructor(private jobservice: JobServices, 
    private sessionsevice: SessionServices, private securityInfoResolve: SecurityInfoResolve) {
  }

  ngOnInit() {
    this.getJobQuota();
    this.addNew();
  }

  getJobQuota() {
    this.sessionsevice.getSessionQuotabySession(this.id)
      .subscribe((res: any) => {
        this.jobQuotas = res.value;
      });
  }

  addNew() {
    this.jobQuota = new JobQuota();
  }

  deleteAddress() {
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
          swal(
            'Deleted!',
            'Selected item has been deleted.',
            'success'
          );

          this.jobservice.deleteQuota(this.deleteItemIds)
            .subscribe(res => {
              this.deleteItemIds = [];
              this.getJobQuota();

              for (var i = 0; i < this.jobQuotas.length; i++) {
                this.selected[i] = false;
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
      this.jobQuota.jobGroupId = this.id;
      this.jobQuota.jobId = this.jobId;
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
          else{
            var err = "";
            res.errors.forEach((er) => {
              err = err +" "+ er;
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
      {header: 'Session', key: 'jobGroupId', width: 20},
      {header: 'Description', key: 'description', width: 30},
      {header: 'Total Number Required', key: 'positions', width: 30}
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

    var filename = 'Session Quota.xlsx';
    /* save to file */
    workbook.xlsx.writeBuffer().then(function (data) {
      saveAs(new Blob([data], {type: 'application/octet-stream'}), filename);
    });
  }

  listFormatter(data: any): string {
    return data['value'];
  }
}
