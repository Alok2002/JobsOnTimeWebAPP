import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import { saveAs } from 'file-saver';
import { Subject } from 'rxjs/Subject';
import swal from 'sweetalert2';

import { JobVenue } from '../models/jobvenue';
import { SessionVenue } from '../models/sessionvenue';
import { State } from '../models/state';
import { Venue } from '../models/venue';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SessionServices } from '../services/session.services';
import { SecurityRights, SecurityRightsExportError } from '../shared/enum';
import { SharedServices } from '../services/shared.services';
import { JobServices } from '../services/job.services';
import { PtableColumn } from '../models/ptablecolumn';
import { ObjectUtils } from 'primeng/components/utils/objectutils';

declare var jQuery: any;

@Component({
  selector: 'SessionVenue',
  templateUrl: './sessionvenue.component.html'
})

export class SessionVenueComponent implements OnInit {
  @Input() id: number;
  @Input() isUpdateSession: boolean;
  @Input() jobId: number;

  venue: Venue;
  venues: Array<Venue>;
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

  selectedVenue: Venue;
  isNewVenue = true;

  jobvenues: Array<JobVenue> = [];
  sessionvenues: Array<SessionVenue> = [];

  noofrows = 50;
  selectedColumns: Array<PtableColumn> = [];
  cols: Array<PtableColumn> = [];
  selectedRowData = [];
  ptablesearch: string;

  constructor(private router: Router, private sessionservice: SessionServices, private sharedservice: SharedServices,
    private jobservice: JobServices, private securityInfoResolve: SecurityInfoResolve) { }

  ngOnInit() {
    this.cols = [
      { field: 'id', header: '', index: -1, width: '30', sort: false },
      { field: 'venueName', header: 'Venue Name', index: 0, width: '200', sort: true },
      { field: 'clientVenue.contactName', header: 'Venue Contact Name', index: 1, width: '200', sort: true },
      { field: 'clientVenue.address', header: 'Address', index: 2, width: '200', sort: true },
      { field: 'clientVenue.suburb', header: 'Suburb', index: 3, width: '100', sort: false },
      { field: 'clientVenue.postcode', header: 'Postcode', index: 4, width: '100', sort: false },
      { field: 'clientVenue.state', header: 'State', index: 5, width: '150', sort: false },
      { field: 'clientVenue.formattedPhone', header: 'Phone', index: 6, width: '250', sort: false },
      { field: 'clientVenue.formattedMobile', header: 'Mobile', index: 7, width: '125', sort: false, textAlign: 'center' },
      { field: 'location', header: 'Location Url', index: 8, width: 'auto', sort: false },
    ];
    this.selectedColumns = this.cols;

    this.getVenuebySession(this.id);
    this.getStateList();
    this.getVenueByJobId();
  }

  getVenuebySession(id) {
    this.sessionservice.getVenuebySession(id)
      .subscribe((res: any) => {
        console.log(res);
        this.sessionvenues = res.value;
        console.log(this.sessionvenues);
      });
  }

  getVenueByJobId() {
    this.jobservice.getVenuebyJob(this.jobId)
      .subscribe((res: any) => {
        this.jobvenues = res.value;
        console.log(this.jobvenues);
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
            this.getVenuebySession(this.id);
          }
        });
    }
  }

  deleteVenue() {
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
                this.getVenuebySession(this.id);

                for (var i = 0; i < this.venues.length; i++) {
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

  editVenue(id) {
    this.jobvenues.forEach((item) => {
      if (item.id == id) {
        this.selectedVenue = item.clientVenue;
      }
    });

    console.log(this.venue);
  }

  response(res) {
    if (res.succeeded)
      this.getVenuebySession(this.id);
    this.getVenueByJobId();
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

    this.venues.forEach((am) => {
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

  toggleCheckBox(venueid, $event) {
    console.log($event);

    if ($event.target.checked) {
      var sessionVenue = new SessionVenue();
      sessionVenue.clientVenueId = venueid;
      sessionVenue.clientJobGroupId = this.id;

      this.sessionservice.updateSessionVenue(sessionVenue)
        .subscribe((res: any) => {
          if (res.succeeded) {
            this.getVenuebySession(this.id);
            this.getVenueByJobId();
          }
        });
    } else {
      var id = null;
      this.sessionvenues.forEach((sc) => {
        if (sc.clientVenueId == venueid)
          id = sc.id;
      });

      if (id != null) {
        console.log(id);
        this.sessionservice.delinkSessionVenue(id)
          .subscribe((res: any) => {
            if (res.succeeded) {
              this.getVenuebySession(this.id);
              this.getVenueByJobId();
            }
          });
      }
    }
  }

  compareToSession(venueId) {
    var found = false;
    this.sessionvenues.forEach((sc) => {
      if (sc.clientVenueId == venueId)
        found = true;
    });

    return found;
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