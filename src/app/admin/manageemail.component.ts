import { Component, OnInit, ViewChild } from '@angular/core';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import { saveAs } from 'file-saver';
import swal from 'sweetalert2';

import { ManageEmail } from '../models/manageemail';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SharedServices } from '../services/shared.services';
import { SecurityRights, SecurityRightsExportError } from '../shared/enum';
import { PtableColumn } from '../models/ptablecolumn';

declare var jQuery: any;

@Component({
  selector: 'ManageEmailComponent',
  templateUrl: './manageemail.component.html'
})

export class ManageEmailComponent implements OnInit {
  manageEmail: ManageEmail;
  manageEmails: Array<ManageEmail>;

  deleteItemIds = [];
  isSubmitForm = false;
  isSubmitFormSpinner = false;

  @ViewChild("closeAddNewModal") closeAddNewModal;
  @ViewChild("checkBox") checkBox;

  selected = [];

  noofrows = 50;
  selectedColumns: Array<PtableColumn> = [];
  cols: Array<PtableColumn> = [];
  selectedRowData = [];
  ptablesearch: string;

  constructor(private sharedservice: SharedServices, private securityInfoResolve: SecurityInfoResolve) { }

  ngOnInit() {
    this.cols = [
      { field: 'name', header: 'Name', width: '250', index: 0, sort: true },
      { field: 'emailAddress', header: 'Email Address', width: 'auto', index: 1, sort: false },
    ];
    this.selectedColumns = this.cols;

    this.getAllMangeEmails();
    this.addNew();
  }

  addNew() {
    this.manageEmail = new ManageEmail();
  }

  getAllMangeEmails() {
    this.sharedservice.getAllMangeEmails()
      .subscribe((res: any) => {
        this.manageEmails = res.value;
        console.log(this.manageEmails);
      });
  }

  submitManageEmail(form) {
    this.isSubmitForm = true;
    this.isSubmitFormSpinner = true;
    if (form.invalid) {
      //this.isSubmitForm = false;
      this.isSubmitFormSpinner = false;
    }
    else {
      //console.log(this.configItem);
      this.sharedservice.postMangeEmail(this.manageEmail)
        .subscribe(res => {
          this.isSubmitForm = false;
          this.closeAddNewModal.nativeElement.click();
          this.getAllMangeEmails();
        });
    }
  }

  deleteManageEmail() {
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
          swal(
            'Deleted!',
            'Selected item has been deleted.',
            'success'
          );

          this.sharedservice.deleteMangeEmails(this.deleteItemIds)
            .subscribe(res => {
              this.deleteItemIds = [];
              this.getAllMangeEmails();

              for (var i = 0; i < this.manageEmails.length; i++) {
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
      )
    }
  }

  editEmailAddress(id) {
    this.manageEmails.forEach((item) => {
      if (item.id == id) {
        this.manageEmail = item;
      }
    });

    console.log(this.manageEmail);
  }

  refreshDataTable() {
    this.getAllMangeEmails();
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
      { header: 'Name', key: 'name', width: 50 },
      { header: 'Email Address', key: 'emailAddress', width: 70 }

    ];

    this.manageEmails.forEach((am) => {
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

    var filename = "Manage Emails.xlsx";
    /* save to file */
    workbook.xlsx.writeBuffer().then(function (data) {
      saveAs(new Blob([data], { type: 'application/octet-stream' }), filename);
    });
  }

  updateSelectedColumnsIndex() {
    this.selectedColumns.sort((a, b) => {
      if (a.index > b.index) return 1;
      if (a.index < b.index) return -1;
      return 0;
    })
  }
}
