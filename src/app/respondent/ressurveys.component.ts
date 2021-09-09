import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import { Subject } from 'rxjs/Subject';
import swal from 'sweetalert2';

import { Respondent } from '../models/respondent';
import { RespondentServices } from '../services/respondent.services';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SecurityRights, SecurityRightsExportError } from '../shared/enum';
import { SharedServices } from './../services/shared.services';
import { PtableColumn } from '../models/ptablecolumn';
import { ObjectUtils } from 'primeng/components/utils/objectutils';

declare var jQuery: any;

@Component({
  selector: 'ResSurveysComponent',
  templateUrl: './ressurveys.component.html'
})

export class ResSurveysComponent implements OnInit {
  @Input() resId: number;
  respondent: Respondent;
  isLoading = true;
  ressurvey = [];

  noofrows = 50;
  selectedColumns: Array<PtableColumn> = [];
  cols: Array<PtableColumn> = [];
  selectedRowData = [];
  ptablesearch: string;

  constructor(private respondentservice: RespondentServices, private securityInfoResolve: SecurityInfoResolve,
    private activateroute: ActivatedRoute, private sharedService: SharedServices) { }

  ngOnInit() {
    this.cols = [
      { field: 'jobNumber', header: 'Job No', index: 0, width: '100', sort: true },
      { field: 'clientJob.jobNumberAndName', header: 'Job Name', index: 1, width: '350', sort: false },
      { field: 'description', header: 'Description', index: 2, width: 'auto', sort: false },
      { field: 'expiryDate', header: 'Expiry', index: 3, width: '150', sort: false },
      { field: 'closed', header: 'Closed', index: 4, width: '100', sort: false, textAlign: 'center' }
    ];
    this.selectedColumns = this.cols;

    this.getRespondentSurvey();
  }

  getRespondentSurvey() {
    this.respondentservice.getRespondentSurveyForStaff(this.resId)
      .subscribe((res: any) => {
        this.ressurvey = res.value;
        console.log(this.ressurvey);
      })
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
      { header: 'Job No', key: 'clientJobId', width: 30 },
      { header: 'Name', key: '', width: 30 },
      { header: 'Expiry', key: 'expiryDate', width: 20 },
      { header: 'Closed', key: 'closed', width: 15 },
    ];

    this.ressurvey.forEach((am) => {
      var dataobj = {};
      //sheet
      sheet.columns.forEach(cl => {
        if (cl.key == 'expiryDate') {
          var cdate = moment(am[cl.key]).format('DD/MM/YYYY');
          dataobj[cl.key] = cdate;
        }
        else if (cl.key == 'closed') {
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

    var filename = "Respondent Survey.xlsx";
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
