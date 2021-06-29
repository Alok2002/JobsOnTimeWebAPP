import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router, NavigationEnd, RoutesRecognized } from '@angular/router';
import { Client } from '../models/client';
import { Note } from '../models/note';

declare var jQuery: any;
import swal from 'sweetalert2';

import { ClientAddress } from '../models/clientaddress';
import { State } from '../models/state';

import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as stream from 'stream';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { mobileMask, phoneMask, postcodeMask } from '../app.component';
import { SecurityRights, SecurityRightsExportError } from '../shared/enum';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { ClientServices } from '../services/client.services';
import { SharedServices } from '../services/shared.services';
import { PtableColumn } from '../models/ptablecolumn';

@Component({
  selector: 'CliAddressComponent',
  templateUrl: './cliaddress.component.html',
})

export class CliAddressComponent implements OnInit {
  client: Client;
  @Input() id: number;
  @Input() isUpdateClient: boolean;
  isLoading = true;
  isSubmitFormSpinner = false;
  isSubmitForm = false;
  addresss: Array<ClientAddress>;
  address: ClientAddress;
  states: Array<State>;

  deleteItemIds = [];

  @ViewChild('closeAddNewModal') closeAddNewModal;

  selected = [];

  postcodes = [];
  isPostSuggShow = false;
  contactTypeList = [];

  stateslist = [];

  phoneMask = phoneMask;
  postcodeMask = postcodeMask;
  mobileMask = mobileMask;

  noofrows = 99999;
  selectedColumns: Array<PtableColumn> = [];
  cols: Array<PtableColumn> = [];
  selectedRowData = [];
  ptablesearch: string;

  constructor(private router: Router, private _clientService: ClientServices,
    private sharedservice: SharedServices, private securityInfoResolve: SecurityInfoResolve) {
  }

  ngOnInit() {
    this.cols = [
      { field: 'type', header: 'Address Type', index: 0, width: '150', sort: true },
      { field: 'address', header: 'Address', index: 1, width: 'auto', sort: false },
      { field: 'suburb', header: 'Suburb', index: 2, width: '125', sort: false },
      { field: 'postcode', header: 'Postcode', index: 3, width: '100', sort: false },
      { field: 'state', header: 'State', index: 4, width: '100', sort: false },
      { field: 'formattedPhone', header: 'Phone', index: 5, width: '100', sort: false },
      { field: 'formattedMobile', header: 'Mobile', index: 6, width: '100', sort: false },
      { field: 'email', header: 'Email', index: 7, width: '250', sort: true },
      // { field: 'notes', header: 'Notes', index: 8, width: '350', sort: true },
    ];
    this.selectedColumns = this.cols;

    this.getStates();
    this.getClientContactType();
    this.getStateList();
    this.getClientAddress(this.id);
    this.addNew();
  }

  getStates() {
    this.sharedservice.getStates()
      .subscribe((re: any) => {
        console.log(re);
        this.stateslist = re.value;
      });
  }

  getClientAddress(id) {
    this._clientService.getClientAddressbyClient(id)
      .subscribe((res: any) => {
        this.addresss = res.value;
        this.isLoading = false;
        console.log(this.addresss);
      });
  }

  getStateList() {
    this.sharedservice.getStateList()
      .subscribe((res: any) => {
        this.states = res.value;
      });
  }

  addNew() {
    this.address = new ClientAddress();
  }

  getLocation(e) {
    //if(this.client.suburb.length > 4)
    this.sharedservice.getLocationPostCodes(this.address.suburb)
      .subscribe((res: any) => {
        this.postcodes = res.value;
        this.isPostSuggShow = true;
        console.log(this.postcodes);
      });
  }

  selectedCode(pc) {
    this.isPostSuggShow = false;
    this.address.suburb = pc.suburb;
    this.address.state = pc.state;
    this.address.postcode = pc.postcode;
  }

  ngAfterViewInit() {
    if (typeof jQuery != 'undefined') {
      jQuery('#add-new-address-modal').on('shown.bs.modal', function () {
        //jQuery('#phone').focus();
      });
    }
  }

  deleteAddress() {
    this.deleteItemIds = [];
    this.selectedRowData.forEach(rd => {
      this.deleteItemIds.push(rd.id);
    })
    //if (this.checkPermission()) {
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
          this._clientService.deleteClientAddress(this.deleteItemIds)
            .subscribe((res: any) => {
              if (res.succeeded) {
                this.deleteItemIds = [];
                this.getClientAddress(this.id);

                for (var i = 0; i < this.addresss.length; i++) {
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
    //}
  }

  submitClientAddress(form) {
    this.isSubmitForm = true;
    this.isSubmitFormSpinner = true;
    if (form.invalid) {
      //this.isSubmitForm = false;
      this.isSubmitFormSpinner = false;
    }
    else {
      this.address.clientId = this.id;
      //this.address.address = this.address.unit + '*' + this.address.cleanAddress;
      console.log(this.address);

      this._clientService.updateClientAddress(this.address)
        .subscribe((res: any) => {
          this.isSubmitFormSpinner = false;
          this.isSubmitForm = false;
          if (res.succeeded) {
            this.closeAddNewModal.nativeElement.click();
            //this.router.navigate(['/client']);
            this.getClientAddress(this.id);
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

  editAddress(id) {
    this.addresss.forEach((item) => {
      if (item.id == id) {
        this.address = item;
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
      { header: 'Address Type', key: 'type', width: 50 },
      { header: 'Address', key: 'fullAddress', width: 50 },
      { header: 'Suburb', key: 'suburb', width: 20 },
      { header: 'Postcode', key: 'postcode', width: 15 },
      { header: 'State', key: 'state', width: 15 },
      { header: 'Phone', key: 'formattedPhone', width: 15 },
      { header: 'Mobile', key: 'formattedMobile', width: 15 },
      { header: 'Email', key: 'email', width: 20 },
      { header: 'Notes', key: 'notes', width: 50 }
    ];

    this.addresss.forEach((am) => {
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

    var filename = 'Client Address.xlsx';
    /* save to file */
    workbook.xlsx.writeBuffer().then(function (data) {
      saveAs(new Blob([data], { type: 'application/octet-stream' }), filename);
    });
  }

  getClientContactType() {
    this._clientService.getClientContactType()
      .subscribe((res: any) => {
        console.log(res);
        this.contactTypeList = res.value;
      });
  }

  @ViewChild('placesRef') placesRef: GooglePlaceDirective;

  public handleAddressChange(address) {
    // Do some stuff
    console.log(address);
    address.address_components.forEach(ad => {
      ad.types.forEach(ty => {
        if (ty == 'postal_code')
          this.address.postcode = ad.short_name;
        if (ty == 'administrative_area_level_1')
          this.address.state = ad.short_name;
        if (ty == 'locality')
          this.address.suburb = ad.short_name;
      });
    });

    if (address.formatted_address)
      this.address.address = address.formatted_address.split(',')[0];
  }

  checkPermission() {
    this.sharedservice.checkPermission('ClientAdmin')
      .subscribe((res: any) => {
        console.log(res);
        if (!res.succeeded) {
          swal(
            'Permission Denied',
            res.errors[0],
            'info'
          );
          return false;
        }
        else {
          return true;
        }
      });
  }

  unmask(value) {
    var ret = value.replace(/\D+/g, '');
    //ret = ret.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
    return ret;
  }

  autoUpperFirstLetter(modal) {
    if (this.address[modal]) {
      var arr = this.address[modal].split('');
      arr.forEach((cl, i) => {
        if (i == 0) arr[i] = cl.toUpperCase();
      });
      this.address[modal] = arr.join('');
    }
    //this.clientcontact[modal] = this.clientcontact[modal].charAt(0).toUpperCase();
  }

  updateSelectedColumnsIndex() {
    this.selectedColumns.sort((a, b) => {
      if (a.index > b.index) return 1;
      if (a.index < b.index) return -1;
      return 0;
    })
  }
}
