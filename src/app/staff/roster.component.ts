import { Component, OnInit, ViewChild, ComponentFactoryResolver } from '@angular/core';
import * as moment from "moment";
import swal from 'sweetalert2';
import { DaterangePickerComponent, DaterangepickerConfig } from 'ng2-daterangepicker';
import { DataStateChangeEvent, GridComponent } from '@progress/kendo-angular-grid';
import { User } from '../models/user';
import { Reports } from '../models/reports';
import { Router } from '@angular/router';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SecurityRights, SecurityRightsExportError } from '../shared/enum';
import { process, GroupDescriptor, State, aggregateBy } from '@progress/kendo-data-query/dist/es/main';
import { JobServices } from '../services/job.services';
import { ReportServices } from '../services/report.services';
import { UserServices } from '../services/user.services';
import * as JWT from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'StaffRosterComponent',
    templateUrl: './roster.component.html',
    styleUrls: ['./roster.component.css']
})

export class StaffRosterComponent implements OnInit {
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
        take: 99999,
        group: [
            { field: 'recruiter1', aggregates: this.aggregates },
            { field: 'sessionDate', aggregates: this.aggregates }
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

    usnStaff: string = null;
    usnNotes: string;

    arRecruiters: string = null;
    arRecruitersList = [];


    ajrecruiter: string = null;
    ajjobid: number = null;
    jobsTobeAllocated = [];
    filterSessionInterval: any;

    hasPermission = false;

    constructor(private _jobservice: JobServices, private router: Router,
        private daterangepickerOptions: DaterangepickerConfig, private _reportservie: ReportServices,
        private componentFactory: ComponentFactoryResolver, private _userService: UserServices,
        private securityInfoResolve: SecurityInfoResolve, private cookieservice: CookieService) {

        this.daterangepickerOptions.settings = {
            locale: { format: 'DD-MM-YYYY' },
            alwaysShowCalendars: false,
            ranges: {
                'Next Fortnight': [moment(), moment().add(14, 'day')],
                'Next Month': [moment(), moment().add(1, 'month')],
                'Next 3 Months': [moment(), moment().add(4, 'month')],
                'Next 6 Months': [moment(), moment().add(6, 'month')],
                'Next 12 Months': [moment(), moment().add(12, 'month')],
                'Today': [moment(), moment()],
                'Last Fortnight': [moment().subtract(14, 'day'), moment()],
                'Last Month': [moment().subtract(1, 'month'), moment()],
                'Last 3 Months': [moment().subtract(4, 'month'), moment()],
                'Last 6 Months': [moment().subtract(6, 'month'), moment()],
                'Last 12 Months': [moment().subtract(12, 'month'), moment()],
            }
        };
    }

    populateData() {
        var token = JWT(this.cookieservice.get('auth_token'));
        if (token.role == "Assistant Project Manager" || token.role == "Recruiter") {
            this.reports.recruiter = token["primarysid"];
        }
        else
            this.reports.recruiter = null;

        this.reports.projectManager = null;
        /*else {
            this.reports.projectManager = null;
            this.reports.recruiter = token["primarysid"];
        }*/
    }

    ngOnInit() {
        this.securityInfoResolve.checkPermission(SecurityRights.RosterJobAllocation)
            .subscribe((res: any) => {
                if (res.succeeded) {
                    this.hasPermission = true;
                }
            })
        // this.getSessionRecruitment();
        this.getStaffs();
        this.dateInput.start = moment();
        this.dateInput.end = moment().add(14, 'day');
        this.getAllocatedJobList();

        this.populateData();
        this.submitFilter();
        this.filterSessionInterval = setInterval(() => {
            this.refreshData();
        }, 150000);
    }

    refreshData() {
        this.populateData();
        this.dateInput.start = moment();
        this.dateInput.end = moment().add(14, 'day');
        this.submitFilter();
    }

    ngOnDestroy() {
        window.clearInterval(this.filterSessionInterval);
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
        //this.isSubmitForm = true;
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

        this._reportservie.postStaffRoster(this.reports)
            .subscribe((res: any) => {
                console.log(res);
                this.data = res.value;

                this.data.forEach((dt) => {
                    // if (dt.sessionDate) dt.sessionDate = moment(dt.sessionDate).format('DD-MM-YYYY');
                    if (dt.sessionDate) dt.sessionDate = moment(dt.sessionDate).toDate();
                });

                this.gridData = process(this.data, this.state);
                this.total = aggregateBy(this.data, this.aggregates);
                this.isLoading = false;
            });
    }

    exportToPDF(grid: GridComponent) {
        this.exportToPDFHelper(grid);
    }

    public exportToPDFHelper(grid: GridComponent): void {
        this.isLoading = true;
        grid.saveAsPDF();
        this.isLoading = false;
    }

    exportToExcel(grid: GridComponent) {
        this.exportToExcelHelper(grid);
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

    updateNotes() {
        this._userService.updateNotes(this.usnStaff, this.usnNotes)
            .subscribe((res: any) => {
                console.log(res);
                this.usnNotes = null;
                this.usnStaff = null;
                if (res.succeeded) {
                    swal(
                        'Success!',
                        'Staff notes has been updated successfully.',
                        'success'
                    )
                } else {
                    var err = "";
                    res.errors.forEach((er) => {
                        err = err + " " + er;
                    });
                    swal(
                        'Error!',
                        err,
                        'error'
                    )
                }
            })
    }

    addRecuriterToList() {
        if (this.arRecruiters == null) {
            this.arRecruitersList = [];
            this.staffs.forEach(sl => {
                this.arRecruitersList.push(sl.fullName);
            })
        }
        else
            this.arRecruitersList.push(this.arRecruiters);
    }

    getAllocatedJobList() {
        this._jobservice.getJobsTobeAllocated()
            .subscribe((res: any) => {
                console.log(res);
                this.jobsTobeAllocated = res.value;
            })
    }

    rosterAllocate(form) {
        this.isSubmitForm = true;
        if (!form.invalid) {
            this._jobservice.rosterAllocate(this.ajjobid, this.ajrecruiter)
                .subscribe((res: any) => {
                    this.getAllocatedJobList();
                    this.ajjobid = null;
                    this.ajrecruiter = null;
                    this.isSubmitForm = false;
                    console.log(res);
                    if (res.succeeded) {
                        swal(
                            'Success!',
                            'Job has been allocated successfully.',
                            'success'
                        )
                    } else {
                        var err = "";
                        res.errors.forEach((er) => {
                            err = err + " " + er;
                        });
                        swal(
                            'Error!',
                            err,
                            'error'
                        )
                    }
                })
        }
    }

    openJobError() {
        swal('Oops...',
            'Please select a job.',
            'info')
    }

    getRecruiterWithNotes(recr) {
        var ret = "";
        if (this.data) {
            var index = this.data.findIndex((dt) => dt.recruiter1 == recr);
            if (index >= 0)
                ret = ret + " - <span style='font-size:11px;font-weight:400 !important;'>" + this.data[index].notes + "</span>";
        }
        return ret;
    }

    changeStaffNotesUser(usnStaff) {
        this._jobservice.getUserNotesByUserName(usnStaff)
            .subscribe((res: any) => {
                console.log(res);
                if (res.succeeded) this.usnNotes = res.value;
            })
    }

    checkIsReqName(val) {
        var ret = false;
        var index = this.data.findIndex(dt => dt.recruiter1 == val);
        if (index >= 0) ret = true;
        return ret;
    }

    getTotalLabel(val) {
        return this.checkIsReqName(val) ? 'Overall Total: ' : 'Day Total: ';
    }
}