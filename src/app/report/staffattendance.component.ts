import { Component, OnInit, ViewContainerRef, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { process, GroupDescriptor, State, aggregateBy } from '@progress/kendo-data-query/dist/es/main';
import { GridComponent, GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { Daterangepicker, DaterangepickerConfig } from 'ng2-daterangepicker';
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
  selector: 'StaffAttendanceReportComponent',
  templateUrl: './staffattendance.component.html'
})

export class StaffAttendanceReportComponent implements OnInit {
  public dateInput: any = {
    start: moment().subtract(12, 'month'),
    end: moment().subtract(6, 'month')
  };

  public eventLog = '';
  isLoading = false;
  selectedStaff: string;

  public aggregates: any[] = [
    { field: 'totalWorkingHours', aggregate: 'sum' },
    { field: 'finalHours', aggregate: 'sum' },
    { field: 'qualified', aggregate: 'sum' },
    { field: 'totaltoRecruit', aggregate: 'sum' }
  ];

  public state: State = {
    skip: 0,
    take: 100000,
    group: [{ field: 'fullName', aggregates: this.aggregates }]
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
    private _clientservice: ClientServices, private daterangepickerOptions: DaterangepickerConfig,
    private _reportservie: ReportServices, private componentFactory: ComponentFactoryResolver) {
    this.daterangepickerOptions.settings = {
      locale: { format: 'DD-MM-YYYY' },
      alwaysShowCalendars: false,
      ranges: {
        'Next Fortnight': [moment(), moment().add(14, 'day')],
        'Next Month': [moment(), moment().add(1, 'month')],
        'Next 3 Months': [moment(), moment().add(3, 'month')],
        'Next 6 Months': [moment(), moment().add(6, 'month')],
        'Next 12 Months': [moment(), moment().add(12, 'month')],
        'Today': [moment(), moment()],
        'Last Fortnight': [moment().subtract(14, 'day'), moment()],
        'Last Month': [moment().subtract(1, 'month'), moment()],
        'Last 3 Months': [moment().subtract(3, 'month'), moment()],
        'Last 6 Months': [moment().subtract(6, 'month'), moment()],
        'Last 12 Months': [moment().subtract(12, 'month'), moment()],
      }
    };
    this.allData = this.allData.bind(this);
  }

  ngOnInit() {
    //this.getStaffAttendanceReport();
    this.getStaffs();
    this.dateInput.start = moment();
    this.dateInput.end = moment();

    this.reports.projectManager = null;
  }

  /*getStaffAttendanceReport() {
    this._reportservie.getStaffAttendanceReport()
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

  public selectedDate(value: any, dateInput: any) {
    dateInput.start = value.start;
    dateInput.end = value.end;
  }


  private applyDate(value: any, dateInput: any) {
    dateInput.start = value.start;
    dateInput.end = value.end;
  }

  public calendarEventsHandler(e: any) {
    console.log(e);
    this.eventLog += '\nEvent Fired: ' + e.event.type;
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
    var startdate = moment(this.dateInput.start, "YYYY-MM-DD HH:mm:ss");
    var startdatestr = startdate.format();

    var enddate = moment(this.dateInput.end, "YYYY-MM-DD HH:mm:ss");
    var enddatestr = enddate.format();

    /*var filter = {
      "dateStart": startdatestr,
      "dateEnd": enddatestr,
      "staff": this.selectedStaff
    };*/

    this.reports.startDate = startdatestr;
    this.reports.endDate = enddatestr;

    this._reportservie.postStaffAttendance(this.reports)
      .subscribe((res: any) => {
        this.data = res.value;
        console.log(this.data);
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
    this.data = [];
    this.dateInput.start = moment();
    this.dateInput.end = moment();
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

  getClassNameByItem(dataItem) {    
    var ret = false;
    if(dataItem.error == 1) ret = true;
    return ret;
  }
}
