import { ObjectUtils } from 'primeng/components/utils/objectutils';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import swal from 'sweetalert2';

import { LoginAudits } from '../models/loginaudits';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SecurityRights, SecurityRightsExportError } from '../shared/enum';
import { SharedServices } from '../services/shared.services';
import { PtableColumn } from '../models/ptablecolumn';
import { LazyLoadEvent } from 'primeng/api';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'LoginAuditsComponent',
  templateUrl: './loginaudits.component.html'
})

export class LoginAuditsComponent implements OnInit {
  loginaudits: Array<LoginAudits>;

  deleteItemIds = [];
  isSubmitForm = false;
  isSubmitFormSpinner = false;
  isLoading = true;

  @ViewChild("closeAddNewModal") closeAddNewModal;
  @ViewChild("checkBox") checkBox;

  selected = [];
  totalItems: number;

  dataTablesParameters: any;

  saveQueryName: string;
  maxrecords: any = null;
  filters: any;
  @ViewChild("saveQueryBtn") saveQueryBtn;

  @ViewChild("saveQueryCancelBtn") saveQueryCancelBtn;
  isUpdateFiler = true;

  noofrows = 50;
  selectedColumns: Array<PtableColumn> = [];
  cols: Array<PtableColumn> = [];
  selectedRowData = [];
  ptablesearch: string;
  isShowFilter = true;
  totalRecords = 0;
  colVisData = [];
  selectedFilterId = null;

  constructor(private sharedService: SharedServices, private securityInfoResolve: SecurityInfoResolve) {
  }

  ngOnInit() {
    this.getLoginAudits();
  }

  getLoginAudits() {
    this.cols = [
      { field: 'formattedActionTime', header: 'Time', index: 0, width: '120', sort: false },
      { field: 'actionType', header: 'Audit Event', index: 1, width: '200', sort: false },
      { field: 'userType', header: 'User Type', index: 2, width: '200', sort: false },
      { field: 'userName', header: 'Username', index: 3, width: '200', sort: false },
      { field: 'sourceIp', header: 'Source Name', index: 4, width: 'auto', sort: false }
    ];

    this.selectedColumns = this.cols;
  }

  loadData(event: LazyLoadEvent) {
    console.log(event);
    if (!event.sortField) { event.sortField = "actionTime" }
    if (!event.sortOrder) { event.sortOrder = -1 }

    this.sharedService.getDataWithFilter(event, this.colVisData, this.maxrecords, this.filters, "auditlog", null)
      .subscribe((resp: any) => {
        // debugger;
        this.loginaudits = resp.value;
        this.totalRecords = resp.totalCount;
        console.log(this.loginaudits);
      });
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
      { header: 'Time', key: 'actionTime', width: 20 },
      { header: 'Audit Event', key: 'actionType', width: 30 },
      { header: 'User Type', key: 'userType', width: 30 },
      { header: 'Username', key: 'userName', width: 20 },
      { header: 'Source Name', key: 'sourceIp', width: 30 }
    ];

    this.loginaudits.forEach((am) => {
      var dataobj = {};
      //sheet
      sheet.columns.forEach(cl => {
        if (cl.key == 'actionTime') {
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

    var filename = "Login Audits.xlsx";
    /* save to file */
    workbook.xlsx.writeBuffer().then(function (data) {
      saveAs(new Blob([data], { type: 'application/octet-stream' }), filename);
    });
  }

  filterSubmit(res) {
    console.log(res);
    this.isLoading = true;
    this.filters = res.filters;
    this.maxrecords = res.maxrecords;
    this.loadData({ first: 0, rows: this.noofrows });
    /*this.sharedService.getDataWithFilter(this.dataTablesParameters, this.colVisData, this.maxrecords, this.filters, "auditlog", null)
      .subscribe((resp: any) => {
        this.loginaudits = resp.value;
        this.getLoginAudits();
        this.isLoading = false;
      });*/
  }

  filtersEmit(res) {
    console.log(res);
    this.filters = res;
  }

  saveQuery(form) {
    this.isUpdateFiler = false;
    this.isSubmitForm = true;
    if (!form.invalid) {
      this.sharedService.saveQuery('auditlog', null, '', this.saveQueryName, this.filters)
        .subscribe((res: any) => {
          console.log(res);
          this.isSubmitForm = false;
          if (res.succeeded) {
            this.selectedFilterId = res.value;   
            this.isUpdateFiler = true;
            this.saveQueryCancelBtn.nativeElement.click();
            /*swal('Successfully Saved!',
              '',
              'success');*/
          }
          else {
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
        })
    }
  }

  openSaveQueryModal() {
    this.saveQueryName = "";
    if (this.filters && this.filters.length > 0) {
      this.saveQueryBtn.nativeElement.click()
    }
    else {
      swal(
        'Oops...',
        'Select at least one filter to save query.',
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
