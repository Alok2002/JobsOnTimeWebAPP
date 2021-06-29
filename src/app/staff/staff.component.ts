import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../models/user';

declare var jQuery: any;
import swal from 'sweetalert2';

import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as stream from 'stream';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import { SecurityRights, SecurityRightsExportError } from '../shared/enum';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { UserServices } from '../services/user.services';
import { PtableColumn } from '../models/ptablecolumn';

@Component({
  selector: 'StaffComponent',
  templateUrl: './staff.component.html'
})

export class StaffComponent implements OnInit {
  staffs: Array<User>;
  isLoading = true;

  noofrows = 50;
  selectedColumns: Array<PtableColumn> = [];
  cols: Array<PtableColumn> = [];
  selectedRowData = [];
  ptablesearch: string;

  constructor(private _userService: UserServices,
    private router: Router, private securityInfoResolve: SecurityInfoResolve) { }

  ngOnInit() {
    this.cols = [
      { field: 'username', header: 'Username', index: 0, width: '150', sort: true },
      { field: 'clockedIn', header: 'Clocked In', index: 0, width: '80', sort: false, textAlign: 'center' },
      { field: 'firstName', header: 'First Name', index: 1, width: '150', sort: false },
      { field: 'lastName', header: 'Last Name', index: 2, width: '150', sort: false },
      { field: 'dateofBirth', header: 'DOB', index: 3, width: '75', sort: false },
      { field: 'emailAddress', header: 'Office Email', index: 4, width: '250', sort: false },
      { field: 'formattedPhone', header: 'Direct Line', index: 5, width: '100', sort: false },
      { field: 'extension', header: 'Ext', index: 6, width: '75', sort: true },
      { field: 'formattedMobile', header: 'Mobile', index: 7, width: '100', sort: false },
      { field: 'personalEmail', header: 'Personal Email', index: 8, width: 'auto', sort: false }
    ];
    this.cols.forEach((cl, i) => {
      cl.index = i
    });
    this.selectedColumns = this.cols;
    this.getStaffs();
  }

  getStaffs() {
    this._userService.getStaffs()
      .subscribe((res: any) => {
        this.staffs = res.value;
        console.log(this.staffs);
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
      { header: 'Ext', key: 'extension', width: 10 },
      { header: 'Name', key: 'fullName', width: 30 },
      { header: 'DOB', key: 'dateofBirth', width: 15 },
      { header: 'Direct Line', key: 'directLine', width: 15 },
      { header: 'Mobile', key: 'mobile', width: 15 },
      { header: 'Office Email', key: 'emailAddress', width: 30 },
      { header: 'Personal Email', key: 'personalEmail', width: 30 }
    ];

    this.staffs.forEach((am) => {
      var dataobj = {};
      //sheet
      sheet.columns.forEach(cl => {
        if (cl.key == 'dateofBirth') {
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

    var filename = "Staff.xlsx";
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
