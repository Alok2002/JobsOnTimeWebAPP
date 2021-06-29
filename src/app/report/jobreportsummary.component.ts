import { Component, OnInit } from '@angular/core';
//import { State } from "../models/state";
import { Client } from "../models/client";
import { process, GroupDescriptor, State, aggregateBy } from '@progress/kendo-data-query/dist/es/main';
import { GridComponent, GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';

import * as moment from "moment";
import { User } from "../models/user";
import { UserServices } from "../services/user.services";
import { SecurityRights, SecurityRightsExportError } from '../shared/enum';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import swal from 'sweetalert2';
import { Reports } from "../models/reports";
import { ClientServices } from '../services/client.services';
import { ReportServices } from '../services/report.services';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';

@Component({
  selector: 'JobSummaryReportComponent',
  templateUrl: './jobreportsummary.component.html'
})

export class JobSummaryReportComponent implements OnInit {
  isLoading = false;
  selectedStaff: string;

  public aggregates: any[] = [
    { field: 'count', aggregate: 'sum' }
  ];

  public state: State = {
    skip: 0,
    take: 999999,
    group: [
      { field: 'projectManagerFullName', aggregates: this.aggregates }
    ]
  };

  public data = [];


  public gridData: any;// = process(this.data, this.state);
  public total: any;// = aggregateBy(this.data, this.aggregates);

  public dataStateChange(state: DataStateChangeEvent): void {
    if (state && state.group) {
      state.group.map(group => group.aggregates = this.aggregates);
    }

    this.state = state;

    this.gridData = process(this.data, this.state);
  }

  staffs: Array<User>;
  reports = new Reports();
  isSubmitForm = false;

  constructor(private _userService: UserServices, private securityInfoResolve: SecurityInfoResolve,
    private _clientservice: ClientServices, private _reportservie: ReportServices) {
    this.allData = this.allData.bind(this);
  }
  ngOnInit() {
    //this.getJobReportSummary();
    this.getStaffs();

    this.reports.projectManager = null;
  }

  /*getJobReportSummary() {
    this._reportservie.getJobReportSummary()
      .subscribe(res => {
        console.log(res);;
        this.data = res.value;
        console.log(this.data);
        this.data.forEach((dt) => {
          if (dt.sessionDate) dt.sessionDate = moment(dt.sessionDate).format('DD-MM-YYYY');
        });

        this.gridData = process(this.data, this.state);
        this.total = aggregateBy(this.data, this.aggregates);
        this.isLoading = false;
      });
  }*/

  getStaffs() {
    this._userService.getActiveUsers()
      .subscribe((res: any) => {
        this.staffs = res.value;
      });
  }

  submitFilter() {
    this.isLoading = true;
    this.isSubmitForm = true;
    this._reportservie.postJobSummary(this.reports)
      .subscribe((res: any) => {
        console.log(res);
        var data = res.value;

        var result = this.groupBy(data, function (item) {
          return [item.projectManagerFullName, item.jobStatus];
        });

        var finalArr = [];
        result.forEach(res => {
          finalArr.push({ projectManagerFullName: res[0].projectManagerFullName, jobStatus: res[0].jobStatus, count: res.length })
        })

        this.data = finalArr;
        this.data.forEach((dt) => {
          if (dt.sessionDate) dt.sessionDate = moment(dt.sessionDate).format('DD-MM-YYYY');
        });

        this.gridData = process(this.data, this.state);
        this.total = aggregateBy(this.data, this.aggregates);
        this.isLoading = false;
      });
  }

  groupBy(array, f) {
    var groups = {};
    array.forEach(function (o) {
      var group = JSON.stringify(f(o));
      groups[group] = groups[group] || [];
      groups[group].push(o);
    });
    return Object.keys(groups).map(function (group) {
      return groups[group];
    })
  }


  exportToPDF(grid: GridComponent) {
    this.securityInfoResolve.checkPermission(SecurityRights.ExportAllResults)
      .subscribe((res: any) => {
        if (res.succeeded) {
          this.exportToPDFHelper(grid);
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

  public exportToPDFHelper(grid: GridComponent): void {
    grid.saveAsPDF();
  }

  exportToExcel(grid: GridComponent) {
    this.securityInfoResolve.checkPermission(SecurityRights.ExportAllResults)
      .subscribe((res: any) => {
        if (res.succeeded) {
          this.exportToExcelHelper(grid);
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

  public exportToExcelHelper(grid: GridComponent): void {
    grid.saveAsExcel();
  }

  resetFilter() {
    this.reports = new Reports();
    this.reports.projectManager = null;
    this.data = [];
    this.isSubmitForm = false;
  }

  public allData(): ExcelExportData {
    var state = JSON.parse(JSON.stringify(this.state));
    state.skip = 0;
    state.take = 100000;
    console.log(state);
    const result: ExcelExportData = {
      data: process(this.data, state).data,
      group: state.group
    };

    return result;
  }
}






