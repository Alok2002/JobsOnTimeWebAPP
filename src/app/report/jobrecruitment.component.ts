import { Component, OnInit, ViewContainerRef, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { process, GroupDescriptor, State, aggregateBy } from '@progress/kendo-data-query/dist/es/main';
import { GridComponent, GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';

import * as moment from "moment";

import { Daterangepicker, DaterangepickerConfig } from 'ng2-daterangepicker';
import { User } from "../models/user";
import { UserServices } from "../services/user.services";
import { SecurityRights, SecurityRightsExportError } from '../shared/enum';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import swal from 'sweetalert2';
import { Reports } from '../models/reports';
import { ClientServices } from '../services/client.services';
import { ReportServices } from '../services/report.services';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';

@Component({
  selector: 'JobRecruitmentReportComponent',
  templateUrl: './jobrecruitment.component.html'
})

export class JobRecruitmentReportComponent implements OnInit {
  isLoading = false;
  selectedStaff: string;

  public aggregates: any[] = [
    { field: 'requiredforJob', aggregate: 'sum' },
    { field: 'requiredforSession', aggregate: 'sum' },
    { field: 'qualified', aggregate: 'sum' },
    { field: 'totaltoRecruit', aggregate: 'sum' }
  ];

  public state: State = {
    skip: 0,
    take: 25,
    /*group: [{ field: 'sessionDate', aggregates: this.aggregates },
      { field: 'projectManager', aggregates: this.aggregates }]*/
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
  public singleDate: any;

  staffs: Array<User>;

  reports = new Reports();
  isSubmitForm = false;

  constructor(private _clientservice: ClientServices, private securityInfoResolve: SecurityInfoResolve,
    private _userService: UserServices, private daterangepickerOptions: DaterangepickerConfig,
    private _reportservie: ReportServices, private componentFactory: ComponentFactoryResolver) {
    this.allData = this.allData.bind(this);
  }

  ngOnInit() {
    //this.getPendingRecruitment();
    this.getStaffs();

    this.reports.projectManager = null;
    this.reports.recruiter = null;
  }

  /*getPendingRecruitment() {
    this.isLoading = true;
    this._reportservie.getPendingRecruitment()
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
    this._userService.getAllUser()
      .subscribe((res: any) => {
        this.staffs = res.value;
      });
  }

  submitFilter() {
    this.isSubmitForm = true;
    this.isLoading = true;
    console.log(this.reports);
    this._reportservie.postJobRecruitment(this.reports)
      .subscribe((res: any) => {
        console.log(res.value);
        this.data = res.value;
        this.data.forEach((dt) => {
          if (dt.sessionDate) dt.sessionDate = moment(dt.sessionDate).format('DD-MM-YYYY');
        });

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
    this.reports = new Reports();
    this.reports.projectManager = null;
    this.reports.recruiter = null;
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
      //group: state.group
    };

    return result;
  }
}
