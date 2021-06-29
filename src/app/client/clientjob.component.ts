import { CookieService } from 'ngx-cookie-service';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Job } from '../models/job';
declare var jQuery: any;
import swal from 'sweetalert2';
import { JobTrackerComponent } from "../shared/jobtracker.component";
import { SharedServices } from "../services/shared.services";
import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as stream from 'stream';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SecurityRights, SecurityRightsExportError } from '../shared/enum';
import { JobServices } from '../services/job.services';
import { TrackingJob } from '../models/trackingjob';

@Component({
  selector: 'ClientJobComponent',
  templateUrl: './clientjob.component.html',
  providers: [JobTrackerComponent]
})

export class ClientJobComponent implements OnInit {
  job: Job;
  jobs: Array<Job>;
  isLoading = true;

  @Input() id: number;
  @Input() isUpdateClient: boolean;

  deleteItemIds = [];
  isSubmitForm = false;
  isSubmitFormSpinner = false;

  @ViewChild("closeAddNewModal") closeAddNewModal;
  @ViewChild("checkBox") checkBox;

  selected = [];

  constructor(private jobService: JobServices, private sharedService: SharedServices,
    private jtc: JobTrackerComponent, private securityInfoResolve: SecurityInfoResolve,
    private cookieservice: CookieService) { }

  ngOnInit() {
    //this.getJobsByClient(this.id);
    this.addNew();
  }

  getJobsByClient(clientid) {
    this.jobService.getJobsByClient(clientid)
      .subscribe((res: any) => {
        this.jobs = res.value;
      });
  }

  addNew() {
    this.job = new Job();
  }

  ngAfterViewInit() {
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

  selectAll(e) {
    if (e.target.checked) {
      this.jobs.forEach((item) => {
        this.deleteItemIds.push(item.id);
      });
    }
    else {
      this.deleteItemIds = [];
    }

    for (var i = 0; i < this.jobs.length; i++) {
      this.selected[i] = e.target.checked;
    }
  }

  deleteJobs() {
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

          this.jobService.deleteJobs(this.deleteItemIds)
            .subscribe(res => {
              this.deleteItemIds = [];
              this.getJobsByClient(this.id);

              for (var i = 0; i < this.jobs.length; i++) {
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

  startTracking() {
    if (this.deleteItemIds.length > 0) {
      if (this.deleteItemIds.length == 1) {
        this.sharedService.startTrackingJob(this.deleteItemIds[0], 'ram')
          .subscribe((res: any) => {
            console.log(res);
            if (res.succeeded) {
              swal(
                'Tracked!',
                this.job.jobNumberAndName + ' job has been tracked.',
                'success'
              );
              var jsonstr = JSON.stringify(new TrackingJob(res.value));
              this.cookieservice.set('currentlytracking', jsonstr, null, '/');
              this.refreshData();
            } else {
              swal(
                'Oops...',
                'Something went wrong while tracking.',
                'info'
              );
            }

          });
      } else {
        swal(
          'Oops...',
          'Please select only one job to start tracking.',
          'info'
        );
      }
    } else {
      swal(
        'Oops...',
        'Please select a job to start tracking.',
        'info'
      );
    }
  }

  public refreshData(): void {
    this.jtc.refreshData();
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
      { header: 'Job No', key: 'jobNumber', width: 15 },
      { header: 'Job Name', key: 'jobName', width: 30 },
      { header: 'Job Status', key: 'jobStatus', width: 15 },
      { header: 'Manager', key: 'projectManagerUsername', width: 30 },
      { header: 'Type', key: 'jobType', width: 15 },
      { header: 'Received Date', key: '', width: 15 },
      { header: 'First Session', key: 'firstSessionDate', width: 15 },
      { header: 'Last Session', key: 'lastSessionDate', width: 15 },
      { header: 'Invoice Status', key: 'invoiceStatus', width: 15 }
    ];

    this.jobs.forEach((am) => {
      var dataobj = {};
      //sheet
      sheet.columns.forEach(cl => {
        if (cl.key == 'firstSessionDate' || cl.key == 'lastSessionDate') {
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

    var filename = "Client Job.xlsx";
    /* save to file */
    workbook.xlsx.writeBuffer().then(function (data) {
      saveAs(new Blob([data], { type: 'application/octet-stream' }), filename);
    });
  }
}
