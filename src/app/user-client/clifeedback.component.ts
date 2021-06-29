import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import swal from 'sweetalert2';

import { Feedback } from '../models/feedback';
import { Job } from '../models/job';
import { ClientServices } from '../services/client.services';
import { JobServices } from '../services/job.services';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SharedServices } from '../services/shared.services';
import { SecurityRights, SecurityRightsExportError } from '../shared/enum';

declare var jQuery: any;

@Component({
  selector: 'CliFeedbackComponent',
  templateUrl: './clifeedback.component.html'
})

export class CliFeedbackComponent implements OnInit {
  feedback: Feedback;
  feedbacks: Array<Feedback> = [];
  id = 1;
  isLoading = true;
  isSubmitFormSpinner = false;
  isSubmitForm = false;
  isType = true;

  deleteItemIds = [];

  @ViewChild("closeAddNewModal") closeAddNewModal;
  @ViewChild("checkBox") checkBox;

  selected = [];
  jobs: Array<Job>;

  feedbackTypeList = [];

  constructor(private router: Router, private _clientService: ClientServices,
    private securityInfoResolve: SecurityInfoResolve, private jobService: JobServices,
    private sharedservice: SharedServices) { }

  ngOnInit() {
    this.getFeedback(this.id);
    this.addNew();
    this.getJobsByClient(this.id);
    this.getFeedbackTypeList();
  }

  getFeedback(id) {
    this._clientService.getFeedbackbyClient(this.id)
      .subscribe((res: any) => {
        if (res.value) {
          this.feedbacks = res.value;
          console.log(this.feedbacks);
        }

        console.log(this.id);
      });
  }

  getFeedbackTypeList() {
    this.sharedservice.getFeedbackTypeList()
      .subscribe((res: any) => { this.feedbackTypeList = res.value });
  }

  addNew() {
    this.feedback = new Feedback();
  }

  deleteFeedback() {
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

          this._clientService.deleteFeedback(this.deleteItemIds)
            .subscribe(res => {
              this.deleteItemIds = [];
              this.getFeedback(this.id);

              for (var i = 0; i < this.feedbacks.length; i++) {
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


  submitClientFeedback(form) {
    this.isSubmitForm = true;
    this.isSubmitFormSpinner = true;
    if (form.invalid) {
      //this.isSubmitForm = false;
      this.isSubmitFormSpinner = false;
    }
    else {
      //      this = this.id;
      this.feedback.clientId = this.id;
      this._clientService.updateClientFeedback(this.feedback)
        .subscribe((res: any) => {
          this.isSubmitFormSpinner = false;
          this.isSubmitForm = false;
          if (res.succeeded) {
            this.closeAddNewModal.nativeElement.click();
            //this.router.navigate(['/client']);
            this.getFeedback(this.id);

            console.log(res);
            /*this.storageservice.write("currentlytracking", (this.feedbacks.length + 1));
            this.refreshData();*/
          }
        });
    }
  }

  /*public refreshData(): void {
    this.jtc.refreshData();
  }*/

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

  editFeedback(id) {
    this.feedbacks.forEach((item) => {
      if (item.id == id) {
        this.feedback = item;
      }
    });
  }

  getJobsByClient(clientid) {
    this.jobService.getJobsByClient(clientid)
      .subscribe((res: any) => {
        this.jobs = res.value;
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
      { header: 'Date', key: 'createdDate', width: 15 },
      { header: 'Job No', key: 'jobId', width: 15 },
      { header: 'Type', key: 'type', width: 15 },
      { header: 'User', key: 'username', width: 30 },
      { header: 'Feedback', key: 'feedbackText', width: 50 }
    ];

    this.feedbacks.forEach((am) => {
      var dataobj = {};
      //sheet
      sheet.columns.forEach(cl => {
        if (cl.key == 'createdDate') {
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

    var filename = "Client Feedback.xlsx";
    /* save to file */
    workbook.xlsx.writeBuffer().then(function (data) {
      saveAs(new Blob([data], { type: 'application/octet-stream' }), filename);
    });
  }
}
