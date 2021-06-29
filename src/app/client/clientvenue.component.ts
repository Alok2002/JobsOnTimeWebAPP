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
import { SecurityRights, SecurityRightsExportError } from '../shared/enum';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { ClientServices } from '../services/client.services';
import { SharedServices } from '../services/shared.services';
import { PtableColumn } from '../models/ptablecolumn';

@Component({
  selector: 'ClientVenueComponent',
  templateUrl: './clientvenue.component.html'
})

export class ClientVenueComponent implements OnInit {
  @Input() id: number;
  @Input() isUpdateClient: boolean;
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

  noofrows = 50;
  selectedColumns: Array<PtableColumn> = [];
  cols: Array<PtableColumn> = [];
  selectedRowData = [];
  ptablesearch: string;

  constructor(private router: Router, private securityInfoResolve: SecurityInfoResolve,
    private _clientService: ClientServices, private sharedservice: SharedServices) { }

  ngOnInit() {
    this.cols = [
      { field: 'venueName', header: 'Venue Name', width: '250', sort: false, index: 0 },
      { field: 'global', header: 'Global', width: '75', sort: false, index: 1 },
      { field: 'contactName', header: 'Venue Contact Name', width: '200', sort: false, index: 2 },
      { field: 'address', header: 'Address', width: 'auto', sort: false, index: 3 },
      { field: 'suburb', header: 'Suburb', width: '100', sort: false, index: 4 },
      { field: 'postcode', header: 'Postcode', width: '100', sort: false, index: 5 },
      { field: 'state', header: 'State', width: '75', sort: false, index: 6 },
      { field: 'formattedPhone', header: 'Phone', width: '100', sort: false, index: 7 },
      { field: 'formattedMobile', header: 'Mobile', width: '100', sort: false, index: 8 },
      { field: 'location', header: 'Location Url', width: '250', sort: false, index: 9 },
    ];
    this.selectedColumns = this.cols;

    this.getVenuebyClient(this.id);
    console.log(this.venues);
    this.getStateList();
  }

  getVenuebyClient(id) {
    this._clientService.getVenuebyClient(id)
      .subscribe((res: any) => {
        console.log(res);
        this.venues = res.value;
        console.log(this.venues);
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
      this._clientService.updateClientVenue(this.venue)
        .subscribe((res: any) => {
          this.isSubmitFormSpinner = false;
          this.isSubmitForm = false;
          if (res.succeeded) {
            this.closeAddNewModal.nativeElement.click();
            //this.router.navigate(['/client']);
            this.getVenuebyClient(this.id);
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
    }
  }

  ngAfterViewInit() {
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
          this._clientService.deleteVenue(this.deleteItemIds)
            .subscribe((res: any) => {
              if (res.succeeded) {
                this.deleteItemIds = [];
                this.getVenuebyClient(this.id);

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

  selectAll(e) {
    console.log("enter selectall");
    if (e.target.checked) {
      this.venues.forEach((item) => {
        this.deleteItemIds.push(item.id);
      });
    }
    else {
      this.deleteItemIds = [];
    }

    for (var i = 0; i < this.venues.length; i++) {
      this.selected[i] = e.target.checked;
    }
  }

  editVenue(id) {
    this.venues.forEach((item) => {
      if (item.id == id) {
        this.selectedVenue = item;
      }
    });

    console.log(this.venue);
  }

  response(res) {
    if (res.succeeded)
      this.getVenuebyClient(this.id);
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
      { header: 'Venue Name', key: 'venueName', width: 20 },
      { header: 'Global', key: 'global', width: 20 },
      { header: 'Venue Contact Name', key: 'contactName', width: 20 },
      { header: 'Address', key: 'fullAddress', width: 50 },
      { header: 'Suburb', key: 'suburb', width: 20 },
      { header: 'Postcode', key: 'postcode', width: 15 },
      { header: 'State', key: 'state', width: 20 },
      { header: 'Phone', key: 'formattedPhone', width: 15 },
      { header: 'Mobile', key: 'formattedMobile', width: 15 },
      { header: 'Location Url', key: 'location', width: 15 }
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

  updateSelectedColumnsIndex() {
    this.selectedColumns.sort((a, b) => {
      if (a.index > b.index) return 1;
      if (a.index < b.index) return -1;
      return 0;
    })
  }
}

