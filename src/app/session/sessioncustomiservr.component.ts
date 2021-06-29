import { Component, Input, OnInit, ViewChild } from '@angular/core';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import { saveAs } from 'file-saver';
import { Subject } from 'rxjs/Subject';
import swal from 'sweetalert2';

import { SessionCustomRVR } from '../models/sessioncustomRVR';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SessionServices } from '../services/session.services';
import { SecurityRights, SecurityRightsExportError } from '../shared/enum';
import { SharedServices } from '../services/shared.services';
import { PtableColumn } from '../models/ptablecolumn';
import { ObjectUtils } from 'primeng/components/utils/objectutils';

declare var jQuery: any;

@Component({
  selector: 'SessionCustomiseRVR',
  templateUrl: './sessioncustomiservr.component.html'
})

export class SessionCustomiseRVR implements OnInit {
  @Input() id: number;
  @Input() isUpdateSession: boolean;

  customRVR: SessionCustomRVR;
  customRVRs: Array<SessionCustomRVR>;

  deleteItemIds = [];

  @ViewChild('closeAddNewModal') closeAddNewModal;
  @ViewChild('checkBox') checkBox;

  selected = [];
  isSubmitForm = false;
  isSubmitFormSpinner = false;
  isLoading = true;
  docFields = [];

  noofrows = 50;
  selectedColumns: Array<PtableColumn> = [];
  cols: Array<PtableColumn> = [];
  selectedRowData = [];
  ptablesearch: string;

  constructor(private sessionservice: SessionServices, private sharedService: SharedServices, private securityInfoResolve: SecurityInfoResolve) {
  }

  ngOnInit() {
    this.cols = [
      { field: 'fieldOrder', header: 'Field Order', index: 0, width: '150', sort: false },
      { field: 'width', header: 'Width in Pixels', index: 1, width: '150', sort: false },
      { field: 'fieldName', header: 'Field Name', index: 2, width: 'auto', sort: false }
    ];
    this.selectedColumns = this.cols;

    this.getSessionCustomRVR();
    this.getDocumentFields();
    this.addNew();
  }

  getSessionCustomRVR() {
    this.sessionservice.getSessionCustomRVRbySession(this.id)
      .subscribe((res: any) => {
        this.customRVRs = res.value;
        console.log(this.customRVRs);

        this.isLoading = false;
      });
  }

  getDocumentFields() {
    this.sharedService.getDocumentFields()
      .subscribe((res: any) => {
        console.log(res);
        this.docFields = res.value;
      });
  }

  addNew() {
    this.customRVR = new SessionCustomRVR();
    this.customRVR.fieldOrder = 1;
    this.customRVR.width = 80;
  }

  deleteAddress() {
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

          this.sessionservice.deleteSessionCustomRVR(this.deleteItemIds)
            .subscribe(res => {
              this.deleteItemIds = [];
              this.getSessionCustomRVR();

              for (var i = 0; i < this.customRVRs.length; i++) {
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

  editCustomRVR(id) {
    this.customRVRs.forEach((item) => {
      if (item.id == id) {
        this.customRVR = item;
      }
    });
  }

  submitCustomRVR(form) {
    this.isSubmitForm = true;
    this.isSubmitFormSpinner = true;
    if (form.invalid) {
      //this.isSubmitForm = false;
      this.isSubmitFormSpinner = false;
    }
    else {
      this.customRVR.jobGroupId = this.id;
      this.sessionservice.updateSessionCustomRVR(this.customRVR)
        .subscribe((res: any) => {
          this.isSubmitFormSpinner = false;
          this.isSubmitForm = false;
          if (res.succeeded) {
            this.closeAddNewModal.nativeElement.click();
            //this.router.navigate(['/client']);
            this.getSessionCustomRVR();
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
      { header: 'Field Order', key: 'fieldOrder', width: 20 },
      { header: 'Width', key: 'width', width: 30 },
      { header: 'Filed Name', key: 'fieldName', width: 30 }
    ];

    this.customRVRs.forEach((am) => {
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

    var filename = 'Session Custom RVR.xlsx';
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

  resolveFieldData(data, field) {
    return ObjectUtils.resolveFieldData(data, field);
  }
}
