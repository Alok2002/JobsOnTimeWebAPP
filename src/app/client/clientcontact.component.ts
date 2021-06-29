import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router, NavigationEnd, RoutesRecognized } from '@angular/router';
import { ClientContact } from '../models/clientcontact';

declare var jQuery: any;
import swal from 'sweetalert2';
import { SharedServices } from "../services/shared.services";

import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as stream from 'stream';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import { SecurityRights, SecurityRightsExportError } from '../shared/enum';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { ClientServices } from '../services/client.services';
import { PtableColumn } from '../models/ptablecolumn';

@Component({
  selector: 'ClientContactComponent',
  templateUrl: './clientcontact.component.html'
})

export class ClientContactComponent implements OnInit {
  clientcontact: ClientContact;
  clientcontacts: Array<ClientContact>;
  @Input() id: number;
  @Input() isUpdateClient: boolean;
  @Input() isAccountContact: boolean;
  isLoading = true;
  isSubmitFormSpinner = false;
  isSubmitForm = false;

  deleteItemIds = [];

  @ViewChild("closeAddNewModal") closeAddNewModal;
  @ViewChild("checkBox") checkBox;

  selected = [];
  contactTypes = [];

  selectedClientContact: ClientContact;
  isContactModel = true;
  states = [];
  isNewContact = false;

  noofrows = 50;
  selectedColumns: Array<PtableColumn> = [];
  cols: Array<PtableColumn> = [];
  selectedRowData = [];
  ptablesearch: string;

  constructor(private clientSevice: ClientServices, private sharedService: SharedServices,
    private router: Router, private securityInfoResolve: SecurityInfoResolve) { }

  ngOnInit() {
    this.cols = [
      { field: 'fullName', header: 'Name', index: 0, width: '250', sort: true },
      { field: 'contactType', header: 'Contact Position', index: 1, width: '200', sort: true },
      { field: 'formattedPhone', header: 'Phone', index: 2, width: '100', sort: false },
      { field: 'formattedMobile', header: 'Mobile', index: 3, width: '100', sort: false },
      { field: 'formattedAfterhours', header: 'After Hours', index: 4, width: '100', sort: false },
      { field: 'emailAddress', header: 'Email Address', index: 5, width: '300', sort: false },
      { field: 'onlineAccess', header: 'Online Access', index: 6, width: '125', sort: false, textAlign: 'center' },
      { field: 'stakeholder', header: 'Stakeholder', index: 7, width: '125', sort: false, textAlign: 'center' },
      { field: 'comment', header: 'Comment', index: 8, width: 'auto', sort: false },
    ];

    this.selectedColumns = this.cols;

    if (this.id != null && this.isUpdateClient) {
      this.getClientContactsByClientId(this.id);
    }
  }

  getClientContactsByClientId(id) {
    if (this.isAccountContact) {
      this.clientSevice.getAccountContactByClient(id)
        .subscribe((res: any) => {
          this.clientcontacts = res.value;          
          this.isLoading = false;
        })
    }
    else {
      this.clientSevice.getContactbyClient(id)
        .subscribe((res: any) => {
          this.clientcontacts = res.value;
          this.isLoading = false;
          console.log(this.clientcontacts)
        });
    }
  }

  deleteContact() {
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
          this.clientSevice.deleteContact(this.deleteItemIds)
            .subscribe((res: any) => {
              if (res.succeeded) {
                this.deleteItemIds = [];
                this.getClientContactsByClientId(this.id);

                for (var i = 0; i < this.clientcontacts.length; i++) {
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

  editContact(id) {
    this.isContactModel = true;
    this.clientcontacts.forEach((item) => {
      if (item.id == id) {
        this.selectedClientContact = item;
      }
    });
  }

  response(res) {
    if (res.succeeded)
      this.getClientContactsByClientId(this.id);
    this.isContactModel = false;
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
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Contact Position', key: 'contactType', width: 20 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Mobile', key: 'mobile', width: 15 },
      { header: 'After Hours', key: 'afterhours', width: 15 },
      { header: 'Email Address', key: 'emailAddress', width: 30 },
      { header: 'Online Access', key: 'onlineAccess', width: 30 },
      { header: 'Comment', key: 'comment', width: 50 }
    ];

    this.clientcontacts.forEach((am) => {
      var dataobj = {};
      //sheet
      sheet.columns.forEach(cl => {
        if (cl.key == 'name')
          dataobj[cl.key] = am['firstname'] + " " + am['lastname'];
        else
          dataobj[cl.key] = am[cl.key];
      });

      sheet.addRow(dataobj);
    });

    sheet.getRow('1').font = {
      size: 14,
      bold: true
    };

    var filename = "Client Contact.xlsx";
    /* save to file */
    workbook.xlsx.writeBuffer().then(function (data) {
      saveAs(new Blob([data], { type: 'application/octet-stream' }), filename);
    });
  }

  checkPermission() {
    this.sharedService.checkPermission("ClientAdmin")
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

  addNew() {
    this.isContactModel = true;
    this.selectedClientContact = null;

    this.isNewContact = false;
    setTimeout(() => {
      this.isNewContact = true;
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
