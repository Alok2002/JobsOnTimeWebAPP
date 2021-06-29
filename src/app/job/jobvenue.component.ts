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
import { SecurityRights, SecurityRightsExportError } from '../shared/enum';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { JobServices } from '../services/job.services';
import { SharedServices } from '../services/shared.services';
import { ClientServices } from '../services/client.services';
import { PtableColumn } from '../models/ptablecolumn';
import { ObjectUtils } from 'primeng/components/utils/objectutils';

@Component({
  selector: 'JobVenueComponent',
  templateUrl: './jobvenue.component.html'
})

export class JobVenueComponent implements OnInit {
  @Input() id: number;
  @Input() isUpdateJob: boolean;
  venue: Venue;
  jobVenues: Array<JobVenue>;
  isLoading = true;
  states: Array<State>;

  deleteItemIds = [];
  isSubmitForm = false;
  isSubmitFormSpinner = false;

  @ViewChild("closeAddNewModal") closeAddNewModal;
  @ViewChild("checkBox") checkBox;

  selected = [];
  postcodes = [];
  isPostSuggShow = false;

  selectedClientVenue: Venue;
  isNewVenue = true;

  jobvenue = new JobVenue();
  clientvenues: Array<Venue> = [];
  job: Job;

  noofrows = 50;
  selectedColumns: Array<PtableColumn> = [];
  cols: Array<PtableColumn> = [];
  selectedRowData = [];
  ptablesearch: string;

  constructor(private router: Router, private securityInfoResolve: SecurityInfoResolve,
    private jobservice: JobServices, private sharedservice: SharedServices,
    private clientSevice: ClientServices) { }

  ngOnInit() {
    this.cols = [
      { field: 'clientVenue.venueName', header: 'Venue Name', width: '300', sort: false, index: 0 },
      { field: 'clientVenue.contactName', header: 'Venue Contact Name', width: '200', sort: false, index: 2 },
      { field: 'clientVenue.address', header: 'Address', width: 'auto', sort: false, index: 3 },
      { field: 'clientVenue.suburb', header: 'Suburb', width: '100', sort: false, index: 4 },
      { field: 'clientVenue.postcode', header: 'Postcode', width: '100', sort: false, index: 5 },
      { field: 'clientVenue.state', header: 'State', width: '75', sort: false, index: 6 },
      { field: 'clientVenue.formattedPhone', header: 'Phone', width: '100', sort: false, index: 7 },
      { field: 'clientVenue.formattedMobile', header: 'Mobile', width: '100', sort: false, index: 8 },
      { field: 'clientVenue.location', header: 'Location Url', width: '100', sort: false, index: 9 },
    ];
    this.selectedColumns = this.cols;

    this.getJobById(this.id);    
    this.getStateList();
  }

  addNewJobVenue() {
    this.jobvenue = new JobVenue();
  }

  getJobById(id) {
    this.jobservice.getJobsByJob(id)
      .subscribe((res: any) => {
        this.job = res.value;
        this.getClientVenueByClientId(this.job.clientId);
        this.getVenuebyJob(this.id);
      });
  }

  getClientVenueByClientId(id) {
    this.clientSevice.getVenueAndGlobalbyClient(id)
      .subscribe((res: any) => {
        this.clientvenues = res.value;
        console.log(this.clientvenues);
      });
  }

  getVenuebyJob(id) {
    this.jobservice.getVenuebyJob(id)
      .subscribe((res: any) => {
        console.log(res);
        this.jobVenues = res.value;

        this.getClientVenueByClientId(this.job.clientId);
      });
  }

  getStateList() {
    this.sharedservice.getStateList()
      .subscribe((res: any) => {
        this.states = res.value;
      });
  }

  getLocation(e) {
    //if(this.client.suburb.length > 4)
    this.sharedservice.getLocationPostCodes(this.venue.suburb)
      .subscribe((res: any) => {
        this.postcodes = res.value;
        this.isPostSuggShow = true;
        console.log(this.postcodes);
      });
  }

  selectedCode(pc) {
    this.isPostSuggShow = false;
    this.venue.suburb = pc.suburb;
    this.venue.state = pc.state;
    this.venue.postcode = pc.postcode;
  }

  submitVenue(form) {
    this.isSubmitForm = true;
    this.isSubmitFormSpinner = true;
    if (form.invalid) {
      //this.isSubmitForm = false;
      this.isSubmitFormSpinner = false;
    }
    else {
      this.venue.clientId = this.id;
      this.jobservice.updateJobVenue(this.venue)
        .subscribe((res: any) => {
          this.isSubmitFormSpinner = false;
          this.isSubmitForm = false;
          if (res.succeeded) {
            this.closeAddNewModal.nativeElement.click();
            this.getVenuebyJob(this.id);
          }
        });
    }
  }

  deleteVenue() {
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
          this.jobservice.deleteJobVenue(this.deleteItemIds)
            .subscribe((res: any) => {
              if (res.succeeded) {
                this.deleteItemIds = [];
                this.getVenuebyJob(this.id);

                for (var i = 0; i < this.jobVenues.length; i++) {
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
    //}
  }

  editVenue(id) {
    this.jobVenues.forEach((item) => {
      if (item.id == id) {
        this.selectedClientVenue = item.clientVenue;
      }
    });

    console.log(this.venue);
  }

  response(res) {
    if (res.succeeded) {
      this.getVenuebyJob(this.id);
      this.getClientVenueByClientId(this.job.clientId);
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
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Contact Name', key: 'contactName', width: 20 },
      { header: 'Address', key: 'address', width: 50 },
      { header: 'Suburb', key: 'suburb', width: 20 },
      { header: 'Postcode', key: 'postcode', width: 15 },
      { header: 'State', key: 'state', width: 20 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Mobile', key: 'mobile', width: 15 }
    ];

    this.jobVenues.forEach((am) => {
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

  checkPermission() {
    this.sharedservice.checkPermission("ClientAdmin")
      .subscribe((res: any) => {
        console.log(res);
        if (!res.succeeded) {
          swal(
            'Permission Denied',
            res.errors[0],
            'info'
          )
          return false;
        }
        else {
          return true;
        }
      })
  }

  addNewVenue() {
    this.isNewVenue = false;
    setTimeout(() => {
      this.isNewVenue = true;
    }, 100);
  }

  updateJobVenue(form) {
    this.isSubmitForm = true;
    this.isSubmitFormSpinner = true;
    if (form.invalid) {
      //this.isSubmitForm = false;
      this.isSubmitFormSpinner = false;
    } else {
      this.jobvenue.clientJobId = this.id;
      this.jobservice.updateJobVenue(this.jobvenue)
        .subscribe((res: any) => {
          this.isSubmitFormSpinner = false;
          this.isSubmitForm = false;

          if (res.succeeded) {
            this.closeAddNewModal.nativeElement.click();
            //this.router.navigate(['/client']);
            this.getVenuebyJob(this.id);
          }
        });
    }
  }

  delinkVenue() {
    this.deleteItemIds = [];
    this.selectedRowData.forEach(rd => {
        this.deleteItemIds.push(rd.id);
    })
    console.log(this.deleteItemIds);

    if (this.deleteItemIds.length > 0) {
      swal({
        title: 'Are you sure?',
        text: 'You will not be able to recover this item!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delink it!',
        confirmButtonColor: '#ffaa00',
        cancelButtonText: 'No, keep it'
      }).then((result) => {
        if (result.value) {
          this.jobservice.deleteJobVenue(this.deleteItemIds)
            .subscribe((res: any) => {
              if (res.succeeded) {
                this.deleteItemIds = [];
                this.getVenuebyJob(this.id);

                for (var i = 0; i < this.jobVenues.length; i++) {
                  this.selected[i] = false;
                }

                swal(
                  'Deleted!',
                  'Selected item has been delinked.',
                  'success'
                );
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
        'Please select an item to delink.',
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

  resolveFieldData(data, field) {
    return ObjectUtils.resolveFieldData(data, field);
  }
}

