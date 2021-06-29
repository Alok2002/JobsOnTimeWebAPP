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
import { ClientServices } from '../services/client.services';
import { ReportServices } from '../services/report.services';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';

@Component({
  selector: 'MemberProfilePointComponent',
  templateUrl: './memberprofilepoint.component.html'
})

export class MemberProfilePointComponent implements OnInit {
  isLoading = false;
  selectedStaff: string;

  public aggregates: any[] = [
    /*{ field: 'accumulatedPoints', aggregate: 'sum' },
    { field: 'paidPoints', aggregate: 'sum' },
    { field: 'totalPoints', aggregate: 'sum' },
    { field: 'numberOfPoints', aggregate: 'sum' }*/
  ];

  public state: State = {
    skip: 0,
    take: 25,
    group: [
      // { field: 'respId', aggregates: this.aggregates }
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

  tpointstart: number;
  tpointend: number;
  cpointstart: number;
  cpointend: number;
  ppointstart: number;
  ppointend: number;

  constructor(private _userService: UserServices, private securityInfoResolve: SecurityInfoResolve,
    private _clientservice: ClientServices, private _reportservie: ReportServices) {
    this.allData = this.allData.bind(this);
  }
  ngOnInit() {
    this.reports.memberStatus = 'Active';
    //this.getJobReportSummary();
    this.getStaffs();
  }

  getStaffs() {
    this._userService.getActiveUsers()
      .subscribe((res: any) => {
        this.staffs = res.value;
      });
  }

  submitFilter() {
    this.isLoading = true;
    this.isSubmitForm = true;

    this.reports.points = this.cpointstart + "," + this.cpointend + "|" + this.ppointstart + "," + this.ppointend + "|" + this.tpointstart + "," + this.tpointend;

    console.log(this.reports);
    this._reportservie.postMemberProfilePointRespondent(this.reports)
      .subscribe((res: any) => {
        console.log(res);
        this.data = res.value;
        this.gridData = process(this.data, this.state);
        this.total = aggregateBy(this.data, this.aggregates);
        this.isLoading = false;
      });
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
    this.data = [];
    this.reports = new Reports();
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






