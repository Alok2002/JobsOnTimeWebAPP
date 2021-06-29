import { Component, OnInit } from '@angular/core';
import { process, GroupDescriptor, State, aggregateBy } from '@progress/kendo-data-query/dist/es/main';
import { GridComponent, GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';

import * as moment from "moment";
import { User } from "../models/user";
import { UserServices } from "../services/user.services";
import { SecurityRights, SecurityRightsExportError } from '../shared/enum';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import swal from 'sweetalert2';
import { Reports } from "../models/reports";
import { restrictToView } from '@progress/kendo-popup-common';
import { ClientServices } from '../services/client.services';
import { ReportServices } from '../services/report.services';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';

@Component({
  selector: 'JobSummaryDetailReportComponent',
  templateUrl: './jobsummarydetail.component.html'
})

export class JobSummaryDetailReportComponent implements OnInit {
  isLoading = false;
  selectedStaff: string;

  public aggregates: any[] = [
    { field: 'count', aggregate: 'sum' }
  ];

  public state: State = {
    skip: 0,
    take: 999999,
    group: [{ field: 'projectManagerFullName', aggregates: this.aggregates }]
  };

  public data = [];
  public grouppedData = [];


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
  finalArr = [];

  constructor(private _clientservice: ClientServices, private securityInfoResolve: SecurityInfoResolve,
    private _reportservie: ReportServices, private _userService: UserServices) {
    this.allData = this.allData.bind(this);
  }

  ngOnInit() {
    // this.getSessionRecruitment();
    this.getStaffs();

    this.reports.projectManager = null;
  }

  /*getSessionRecruitment() {
    this._reportservie.getSessionRecruitment()
      .subscribe(res => {
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
    this._reportservie.postJobSummaryDetails(this.reports)
      .subscribe((res: any) => {
        console.log(res);
        debugger;
        var data = res.value;
        this.data = data;

        this.data.forEach((dt) => {
          if (dt.dateFirstSession) dt.dateFirstSession = moment(dt.dateFirstSession).format('DD-MM-YYYY');
          if (dt.dateLastSession) dt.dateLastSession = moment(dt.dateLastSession).format('DD-MM-YYYY');
        });

        var result = this.groupBy(data, function (item) {
          return [item.projectManagerFullName, item.jobStatus];
        });

        this.finalArr = [];
        result.forEach(res => {
          this.finalArr.push({ projectManagerFullName: res[0].projectManagerFullName, jobStatus: res[0].jobStatus, count: res.length })
        })

        console.log(this.finalArr);

        this.grouppedData = this.finalArr;
        this.data.forEach((dt) => {
          if (dt.sessionDate) dt.sessionDate = moment(dt.sessionDate).format('DD-MM-YYYY');
        });

        /*this.data.sort((a, b) => {
          if (a.jobStatus < b.jobStatus) return -1;
          if (a.jobStatus > b.jobStatus) return 1;
          return 0
        })*/
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

  getJobSummary(projectManager) {
    var ret = [];

    this.finalArr.forEach(fa => {
      if (fa.projectManagerFullName == projectManager)
        ret.push(fa);
    });

    return ret;
  }

  getJobSummaryTotal(projectManager) {
    var ret = [];
    var retvalue = 0;

    this.finalArr.forEach(fa => {
      if (fa.projectManagerFullName == projectManager)
        ret.push(fa);
    });

    ret.forEach(re => {
      retvalue = retvalue + re.count;
    })

    return retvalue;
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
