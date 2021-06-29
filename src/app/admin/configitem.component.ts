import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import { saveAs } from 'file-saver';
import { Subject } from 'rxjs/Subject';
import swal from 'sweetalert2';

import { ConfigItem } from '../models/configitem';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SecurityRights, SecurityRightsExportError } from '../shared/enum';
import { ConfigItemServices } from '../services/configitem.services';
import { PtableColumn } from '../models/ptablecolumn';

declare var jQuery: any;

@Component({
  selector: 'ConfigItemComponent',
  templateUrl: './configitem.component.html'
})

export class ConfigItemComponent implements OnInit {
  configItem: ConfigItem;
  configItems: Array<ConfigItem>;

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

  constructor(private _configItemservice: ConfigItemServices, private securityInfoResolve: SecurityInfoResolve) { }

  ngOnInit() {
    this.cols = [
      { field: 'configKey', header: 'Configuration Key', width: '350', index: 0, sort: true },
      { field: 'value', header: 'Value', width: 'auto', index: 1, sort: false },
    ];
    this.selectedColumns = this.cols;

    this.getAllConfigItems();
    this.addNew();
  }

  addNew() {
    this.configItem = new ConfigItem();
  }

  getAllConfigItems() {
    this._configItemservice.getAllConfigItems()
      .subscribe((res: any) => {
        this.configItems = res.value;
      });
  }

  submitConfigItem(form, id) {
    this.isSubmitForm = true;
    this.isSubmitFormSpinner = true;
    if (form.invalid) {
      //this.isSubmitForm = false;
      this.isSubmitFormSpinner = false;
    }
    else {
      //console.log(this.configItem);
      this._configItemservice.postConfigItem(this.configItem)
        .subscribe(res => {
          this._configItemservice.getAllConfigItems()
            .subscribe((res: any) => {
              if (res) {
                this.configItems = res.value;

                this.isSubmitForm = false;
                this.isSubmitFormSpinner = false;
                setTimeout(() => {
                  this.closeAddNewModal.nativeElement.click();
                }, 500);
              }
            });
        });
    }
  }

  newConfigItem() {
    console.log("inside new");
  }

  deleteConfigItem() {
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

          this._configItemservice.deleteConfigItem(this.deleteItemIds)
            .subscribe(res => {
              this.deleteItemIds = [];
              this.getAllConfigItems();

              for (var i = 0; i < this.configItems.length; i++) {
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

  editConfigItem(id) {
    this.configItems.forEach((item) => {
      if (item.id == id) {
        this.configItem = item;
      }
    });

    console.log(this.configItem);
  }

  refreshDataTable() {
    this.getAllConfigItems();
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
            'Access Denied!!',
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
      { header: 'Configuration Key', key: 'configKey', width: 50 },
      { header: 'Value', key: 'value', width: 70 }

    ];

    this.configItems.forEach((am) => {
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

    var filename = "Config Item.xlsx";
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
