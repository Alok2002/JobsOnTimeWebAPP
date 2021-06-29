import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import swal from 'sweetalert2';

import { phoneMask, phonePattern } from '../app.component';
import { Licence } from '../models/licence';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SecurityRights, SecurityRightsExportError } from '../shared/enum';
import { LicenceServices } from '../services/licence.services';
import { PtableColumn } from '../models/ptablecolumn';

declare var jQuery: any;

@Component({
  selector: 'LicenceComponent',
  templateUrl: './licence.component.html'
})

export class LicenceComponent implements OnInit {
  phonePattern = phonePattern;
  licence: Licence;
  licences: Array<Licence>;
  isLoading = true;

  isSubmitForm = false;
  isSubmitFormSpinner = false;

  @ViewChild("closeAddNewModal") closeAddNewModal;

  licenceUsage = [];
  phoneMask = phoneMask;

  noofrows = 50;
  selectedColumns: Array<PtableColumn> = [];
  cols: Array<PtableColumn> = [];
  selectedRowData = [];
  ptablesearch: string;

  @ViewChild('container', { read: ViewContainerRef })
  public containerRef: ViewContainerRef;

  constructor(private _licenceservice: LicenceServices, private securityInfoResolve: SecurityInfoResolve) { }

  ngOnInit() {
    this.cols = [
      { field: 'licenceCode', header: 'Licence Code', width: '150', index: 0, sort: true },
      { field: 'clientName', header: 'Licence', width: 'auto', index: 1, sort: true },
      { field: 'contactName', header: 'Contact Name', width: '200', index: 2, sort: true },
      { field: 'contactPhone', header: 'Contact Phone', width: '150', index: 3, sort: true },
      { field: 'licenceExpiry', header: 'Expiry Date', width: '150', index: 4, sort: true },
      { field: 'isStopped', header: 'Stopped', width: '100', index: 5, sort: false },
      { field: 'isSurveysAllowed', header: 'Survey', width: '100', index: 6, sort: false },
      { field: 'isPaymentsAllowed', header: 'Invoicing', width: '100', index: 7, sort: false },
      { field: 'usage', header: 'Usage Statistics', width: '120', index: 8, sort: false, textAlign: 'center' }
    ];
    this.selectedColumns = this.cols;
    this.getAllLicences();
    this.addNew();
  }

  getAllLicences() {
    this._licenceservice.getAllLicences()
      .subscribe((res: any) => {
        this.licences = res.value;
        console.log(this.licences);
      });
  }

  addNew() {
    this.licence = new Licence();
  }

  submitLicense(form) {
    this.isSubmitForm = true;
    this.isSubmitFormSpinner = true;
    console.log(form);

    if (form.invalid) {
      //this.isSubmitForm = false;
      this.isSubmitFormSpinner = false;
    }
    else {
      console.log(this.licence);
      this._licenceservice.postNewLicence(this.licence)
        .subscribe(res => {
          this._licenceservice.getAllLicences()
            .subscribe(res => {
              if (res) {
                this.getAllLicences();

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

  updateLicece(licence) {
    this.licence = licence;
    if (this.licence.licenceExpiry)
      this.licence.licenceExpiry = moment(this.licence.licenceExpiry).toDate();
  }

  viewLiceceUsage(licenceid) {
    this._licenceservice.getLiceceUsage(licenceid)
      .subscribe((res: any) => {
        console.log(res);
        this.licenceUsage = res.value;
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
      { header: 'Licence Code', key: 'licenceCode', width: 20 },
      { header: 'Licensee', key: 'clientName', width: 50 },
      { header: 'Contact Name', key: 'contactName', width: 30 },
      { header: 'Contact Phone', key: 'contactPhone', width: 20 },
      { header: 'Expiry Date', key: 'licenceExpiry', width: 15 },
      { header: 'Stopped', key: 'isStopped', width: 15 },
      { header: 'Survey', key: 'isSurveysAllowed', width: 15 },
      { header: 'Invoicing', key: 'isPaymentsAllowed', width: 15 }
    ];

    this.licences.forEach((am) => {
      var dataobj = {};
      //sheet
      sheet.columns.forEach(cl => {
        if (cl.key == 'licenceExpiry') {
          var cdate = moment(am[cl.key]).format('DD/MM/YYYY');
          dataobj[cl.key] = cdate;
        }
        else if (cl.key == 'isStopped' || cl.key == 'isSurveysAllowed' || cl.key == 'isPaymentsAllowed') {
          if (am[cl.key])
            dataobj[cl.key] = 'Yes';
          else
            dataobj[cl.key] = 'No';
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

    var filename = "Licence.xlsx";
    /* save to file */
    workbook.xlsx.writeBuffer().then(function (data) {
      saveAs(new Blob([data], { type: 'application/octet-stream' }), filename);
    });
  }

  unmask(value) {
    var ret = value.replace(/\D+/g, '');
    return ret;
  }

  updateSelectedColumnsIndex() {
    this.selectedColumns.sort((a, b) => {
      if (a.index > b.index) return 1;
      if (a.index < b.index) return -1;
      return 0;
    })
  }
}
