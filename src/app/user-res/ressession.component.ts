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
import { SecurityRights, SecurityRightsExportError } from '../shared/enum';
import { SharedServices } from './../services/shared.services';

declare var jQuery: any;

@Component({
  templateUrl: './ressession.component.html',
  styles: ['.btn-grey{background: #e6e7e8;}'],
  styleUrls: ['../../assets/css/disability.css']
})

export class ResSessionComponent implements OnInit {
  resId: number;
  respondent: Respondent;
  isLoading = true;
  ressession: Array<any>;

  noofrows = 50;
  selectedColumns: Array<PtableColumn> = [];
  cols: Array<PtableColumn> = [];
  selectedRowData = [];
  ptablesearch: string;
  calendarUrlPrefix = window.location.protocol + "//" + window.location.host;

  constructor(private respondentservice: RespondentServices, private sharedService: SharedServices,
    private activateroute: ActivatedRoute, private securityInfoResolve: SecurityInfoResolve) { }

  ngOnInit() {
    this.cols = [
      { field: 'jobNumberAndName', header: 'Job Name', index: 0, width: 'auto', sort: true },
      { field: 'eventDate', header: 'Date', index: 1, width: '150', sort: true },
      { field: 'inDepthTime', header: 'Time', index: 2, width: '150', sort: true },
      { field: 'duration', header: 'Duration', index: 3, width: '150', sort: true },
      { field: 'incentive', header: 'Incentive', index: 4, width: '200', sort: false },
      { field: 'respondentConfirmed', header: 'Confirm', index: 5, width: '150', sort: false }
    ];
    this.selectedColumns = this.cols;

    console.log("inside onint");
    this.activateroute.params.subscribe(params => {
      console.log(params);
      if (params['id']) {
        this.resId = params['id'];
        this.respondentservice.getRespondentById(this.resId)
          .subscribe((res: any) => {
            this.respondent = res.value;
            this.isLoading = false;
          })

        this.getRespondentJobsEventsById();
      }
    });
  }

  getRespondentJobsEventsById() {
    this.respondentservice.getRespondentJobsEventsById(this.resId)
      .subscribe((res: any) => {
        this.ressession = res.value;
        console.log(this.ressession);
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
      { header: 'Job No', key: 'jobNumberAndName', width: 30 },
      { header: 'Location', key: '', width: 30 },
      { header: 'Date / Time', key: 'eventDate', width: 20 },
      { header: 'Time', key: 'inDepthTime', width: 15 },
      { header: 'Duration', key: '', width: 15 },
      { header: 'Confirm', key: 'respondentConfirmed', width: 15 }
    ];

    this.ressession.forEach((am) => {
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

    var filename = "Respondent Session.xlsx";
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

  confimAttendance(id) {
    var ids = [];
    ids.push(id);
    this.respondentservice.respConfirmAttendance(ids)
      .subscribe((res: any) => {
        console.log(res);
        this.getRespondentJobsEventsById();
        if (res.succeeded) {
          swal(
            'Success!',
            res.successMsg,
            'success'
          )
        } else {
          var err = "";
          res.errors.forEach((er) => {
            err = err + " " + er;
          });

          swal('Error!', err, 'error')
        }
      })
  }
}
