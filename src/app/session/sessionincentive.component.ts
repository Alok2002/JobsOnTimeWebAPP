import { Component, Input, OnInit, ViewChild } from '@angular/core';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import { saveAs } from 'file-saver';
import { Subject } from 'rxjs/Subject';
import swal from 'sweetalert2';

import { Incentive } from '../models/incentive';
import { JobServices } from '../services/job.services';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SharedServices } from '../services/shared.services';
import { SecurityRights, SecurityRightsExportError } from '../shared/enum';

declare var jQuery: any;

@Component({
  selector: 'SessionIncentiveComponent',
  templateUrl: './sessionincentive.component.html'
})

export class SessionIncentiveComponent implements OnInit {
  @Input() id: number;
  @Input() isUpdateSession: boolean;
  @Input() jobId: number;

  incentive: Incentive;
  incentives: Array<Incentive>;

  incentivesTypes = [];

  deleteItemIds = [];

  @ViewChild("closeAddNewModal") closeAddNewModal;
  @ViewChild("checkBox") checkBox;

  selected = [];
  isLoading = true;
  isSubmitForm = false;
  isSubmitFormSpinner = false;

  constructor(private jobService: JobServices, private sharedService: SharedServices, 
    private securityInfoResolve: SecurityInfoResolve) { }

  ngOnInit() {
    if (this.id != null && this.isUpdateSession) {
      this.getJobIncentives();
    }
    this.getIncentiveTypes();
    this.addNew();
  }

  addNew() {
    this.incentive = new Incentive();
  }

  getJobIncentives() {
    this.jobService.getJobIncentivesByJob(this.id)
      .subscribe((res: any) => {
        this.incentives = res.value;
      });
  }

  delete() {
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

          this.jobService.deleteIncentive(this.deleteItemIds)
            .subscribe(res => {
              this.deleteItemIds = [];
              this.getJobIncentives();

              for (var i = 0; i < this.incentives.length; i++) {
                this.selected[i] = false;
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
      this.incentive.clientJobId = this.jobId;
      //this.incentive.clientJobGroupId = this.id;
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
      { header: 'Incentive Type', key: 'incentiveType', width: 10 },
      { header: 'Incentive Amount', key: 'incentiveAmount', width: 25 },
      { header: 'Incentive Criteria', key: 'incentiveCriteria', width: 15 }
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

    var filename = "Session Incentive.xlsx";
    /* save to file */
    workbook.xlsx.writeBuffer().then(function (data) {
      saveAs(new Blob([data], { type: 'application/octet-stream' }), filename);
    });
  }
}
