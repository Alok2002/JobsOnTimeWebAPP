import { Component, OnInit, ViewContainerRef, ViewChild, ComponentFactoryResolver, ViewEncapsulation } from '@angular/core';
import { process, GroupDescriptor, State, aggregateBy } from '@progress/kendo-data-query/dist/es/main';
import { GridComponent, GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';

import { Daterangepicker, DaterangepickerConfig, DaterangePickerComponent } from 'ng2-daterangepicker';
import * as moment from "moment";
import { User } from "../models/user";
import { UserServices } from "../services/user.services";
import { Router } from '@angular/router';
import { SecurityRights, SecurityRightsExportError } from '../shared/enum';
import swal from 'sweetalert2';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { Reports } from "../models/reports";
import { ClientServices } from '../services/client.services';
import { ReportServices } from '../services/report.services';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';

@Component({
  selector: 'SessionRecruitReportComponent',
  templateUrl: './sessionrecruitment.component.html',
  encapsulation: ViewEncapsulation.None
})

export class SessionRecruitReportComponent implements OnInit {
  @ViewChild(DaterangePickerComponent)
  private picker: DaterangePickerComponent;

  public dateInput: any = {
    start: moment().subtract(12, 'month'),
    end: moment().subtract(6, 'month')
  };

  public eventLog = '';
  isLoading = false;
  selectedStaff: string;
  selectedJobName: string;
  selectedJobNumber: string;

  public aggregates: any[] = [
    { field: 'requiredforJob', aggregate: 'sum' },
    { field: 'requiredforSession', aggregate: 'sum' },
    { field: 'qualified', aggregate: 'sum' },
    { field: 'totaltoRecruit', aggregate: 'sum' }
  ];

  public state: State = {
    skip: 0,
    take: 999999,
    group: [{ field: 'sessionDate', aggregates: this.aggregates, sort: {}}
      // { field: 'projectManager', aggregates: this.aggregates }
    ],
    sort: {}
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

  constructor(private _clientservice: ClientServices, private router: Router,
    private daterangepickerOptions: DaterangepickerConfig, private _reportservie: ReportServices,
    private componentFactory: ComponentFactoryResolver, private _userService: UserServices, private securityInfoResolve: SecurityInfoResolve) {

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
    // this.getSessionRecruitment();
    this.getStaffs();
    this.dateInput.start = moment();
    this.dateInput.end = moment().add(14, 'day');

    this.reports.projectManager = null;
  }

  /*getSessionRecruitment() {
    console.log("session");
    this._reportservie.getSessionRecruitment()
      .subscribe(res => {
        console.log(res);
        this.data = res.value;

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
    console.log(dateInput);
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
      "staff": this.selectedStaff,
      "jobName": this.selectedJobName,
      "jobNo": this.selectedJobNumber
    };*/

    this.reports.startDate = startdatestr;
    this.reports.endDate = enddatestr;

    this._reportservie.postSessionRecruitment(this.reports)
      .subscribe((res: any) => {
        console.log(res);
        this.data = res.value;

        this.data.sort((a, b) => {
          if(a.projectManager > b.projectManager) return 1;
          if(a.projectManager < b.projectManager) return -1;
          return 0;
        })
        
        this.data.forEach((dt) => {
          // if (dt.sessionDate) dt.sessionDate = moment(dt.sessionDate).format('DD-MM-YYYY');
          if (dt.sessionDate) dt.sessionDate = moment(dt.sessionDate).toDate();;
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
    this.isLoading = true;
    grid.saveAsPDF();
    this.isLoading = false;
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
    this.dateInput.end = moment().add(14, 'day');
    this.isSubmitForm = false;
    // this.dateInput.start = moment();
    // this.dateInput.end = moment();

    // this.picker.datePicker.setStartDate(moment());
    // this.picker.datePicker.setEndDate(moment().add(14, 'day'));
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
