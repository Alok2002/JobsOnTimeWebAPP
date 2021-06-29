import { MetaService } from '@ngx-meta/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import { ObjectUtils } from 'primeng/components/utils/objectutils';
import swal from 'sweetalert2';

import { PtableColumn } from '../models/ptablecolumn';
import { Respondent } from '../models/respondent';
import { RespondentServices } from '../services/respondent.services';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SharedServices } from '../services/shared.services';
import { SecurityRights, SecurityRightsExportError } from '../shared/enum';
import { pageTile } from '../app.component';

declare var jQuery: any;

@Component({
  templateUrl: './respondentopportunities.component.html'
})

export class RespondentOpportunitiesComponent implements OnInit {
  resId: number;
  respondent: Respondent;
  isLoading = true;
  ressurvey = [];

  noofrows = 50;
  selectedColumns: Array<PtableColumn> = [];
  cols: Array<PtableColumn> = [];
  selectedRowData = [];
  ptablesearch: string;

  constructor(private respondentservice: RespondentServices, private sharedService: SharedServices, private metaservice: MetaService,
    private activateroute: ActivatedRoute, private securityInfoResolve: SecurityInfoResolve, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.cols = [
      { field: 'clientJob.jobNumber', header: 'Job No', index: 0, width: '100', sort: true },
      { field: 'clientJob.jobNumberAndName', header: 'Job Name', index: 1, width: '350', sort: true },
      { field: 'description', header: 'Description', index: 2, width: 'auto', sort: true },
      { field: 'expiryDate', header: 'Expiry', index: 3, width: '150', sort: false },
      { field: 'closed', header: 'Closed', index: 4, width: '100', sort: false }
    ];

    this.selectedColumns = this.cols;

    console.log("inside onint");
    this.activateroute.params.subscribe(params => {
      if (params['id']) {
        this.resId = params['id'];
        this.respondentservice.getRespondentById(this.resId)
          .subscribe((res: any) => {
            this.respondent = res.value;
            this.isLoading = false;
          })

        this.getRespondentSurvey();
      }
    });
  }

  getRespondentSurvey() {
    this.isLoading = true;
    this.respondentservice.getRespondentOpportunities(this.resId)
      .subscribe((res: any) => {
        this.ressurvey = res.value;
        this.isLoading = false;
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
