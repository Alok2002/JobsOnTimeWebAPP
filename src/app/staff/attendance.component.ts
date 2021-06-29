import { AttendanceReport } from './../models/attendancereport';
import { Component, EventEmitter, Inject, Output, PLATFORM_ID, ViewChild, ViewContainerRef } from '@angular/core';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import { saveAs } from 'file-saver';
import * as JWT from 'jwt-decode';
import * as moment from 'moment';
import { CookieService } from 'ngx-cookie-service';
import { LazyLoadEvent } from 'primeng/api';
import swal from 'sweetalert2';

import { ckEditorConfig, isMobile } from '../app.component';
import { Client } from '../models/client';
import { ClientContact } from '../models/clientcontact';
import { Email } from '../models/email';
import { EmailTemplate } from '../models/emailtemplate';
import { ManageEmail } from '../models/manageemail';
import { PtableColumn } from '../models/ptablecolumn';
import { User } from '../models/user';
import { ClientServices } from '../services/client.services';
import { EmailServices } from '../services/email.services';
import { SharedServices } from '../services/shared.services';
import { SecurityRights, SecurityRightsExportError } from '../shared/enum';
import { SecurityInfoResolve } from './../services/securityinfo.reslove';
import { UserServices } from './../services/user.services';
import { ObjectUtils } from 'primeng/components/utils/objectutils';
import { StaffServices } from '../services/staff.services';

declare var jQuery: any;
declare var tinymce: any;
declare var $: any;

// import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import * as Editor from './../../assets/ckeditor/build/ckeditor';
@Component({
    selector: 'AttendanceComponent',
    templateUrl: './attendance.component.html',
})

export class AttendanceComponent {
    attendanceReport: AttendanceReport;
    attendanceReportList: Array<AttendanceReport> = [];
    cols: Array<PtableColumn> = [];

    noofrows = 50;
    dataTablesParameters = {
        start: 0,
        length: this.noofrows,
        draw: 1,
        order: [],
        columns: [],
        search: { regex: false, value: "" }
    }

    colVisData = [];
    maxrecords: any = null;
    filters: any;
    loading = true;
    totalRecords = 0;

    selectedRowData = [];
    deleteItemIds = [];

    isSelectAllItem = false;
    selected: Array<Client> = [];
    selectedColumns: Array<PtableColumn> = [];

    isShowFilter = true;
    isSubmitForm = false;
    isUpdateFiler = false;
    saveQueryName: string;
    selectedFilterId = null;
    @ViewChild("saveQueryCancelBtn") saveQueryCancelBtn;
    @ViewChild("saveQueryBtn") saveQueryBtn;

    @ViewChild("attendanceReportCancelBtn") attendanceReportCancelBtn;
    staffs: Array<User>;

    @ViewChild('container', { read: ViewContainerRef })
    public containerRef: ViewContainerRef;
    @ViewChild('dateModel') dateModel;

    constructor(private sharedService: SharedServices, private _clientservice: ClientServices,
        private securityInfoResolve: SecurityInfoResolve, private _userService: UserServices,
        private emailService: EmailServices, private cookieservice: CookieService,
        private sharedservice: SharedServices, @Inject(PLATFORM_ID) platformId: Object,
        private staffService: StaffServices) {
    }

    ngOnInit() {
        console.log(isMobile)
        this.getAllAttendanceReports();
        this.addNew();
        this.getStaffs();
    }

    addNew() {
        this.attendanceReport = new AttendanceReport();
        this.dateModel.reset();
        this.isSubmitForm = false;
    }

    unCheckAllItems() {
        this.deleteItemIds = [];
        this.selectedRowData = [];
    }

    deleteAttendanceReport() {
        this.deleteItemIds = [];
        this.selectedRowData.forEach(rd => {
            this.deleteItemIds.push(rd.id);
        })

        //if(this.checkPermission()){
        if (this.deleteItemIds.length > 0) {
            swal({
                title: 'Are you sure?',
                text: 'You will not be able to recover this item!',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                confirmButtonColor: '#ffaa00',
                cancelButtonText: 'No, keep it'
            }).then((result) => {
                if (result.value) {
                    this.staffService.deleteAttendanceReport(this.deleteItemIds)
                        .subscribe((res: any) => {
                            console.log(res);

                            if (res.succeeded) {
                                this.deleteItemIds = [];
                                this.loadData({ first: 0, rows: this.noofrows });
                                this.unCheckAllItems();
                                swal('Deleted!', 'Selected item has been deleted.', 'success');
                            } else {
                                var err = "";
                                res.errors.forEach((er) => {
                                    err = err + " " + er;
                                });
                                swal('Error!', err, 'error');
                            }
                        });
                    // result.dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
                } else if (result.dismiss === swal.DismissReason.cancel) {
                    swal('Cancelled', 'Selected item is safe :)', 'error');
                }
            });
        }
        else {
            swal('Oops...', 'Please select an item to delete.', 'info');
        }
    }

    updateDeleteList(id: number, e) {
        if (e.target.checked) {
            this.deleteItemIds.push(id);
        }
        else {
            this.deleteItemIds.forEach((di, i) => {
                if (di == id) {
                    this.deleteItemIds.splice(i, 1);
                }
            });
        }
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
            { header: 'Name', key: 'name', width: 30 },
            { header: 'Date', key: 'date', width: 15 },
            { header: 'Weekday', key: 'weekday', width: 15 },
            { header: 'In 1', key: 'in1', width: 15 },
            { header: 'Out 1', key: 'out1', width: 15 },
            { header: 'In 2', key: 'in2', width: 15 },
            { header: 'Out 2', key: 'out2', width: 15 },
            { header: 'In 3', key: 'in3', width: 15 },
            { header: 'Out 3', key: 'out3', width: 15 },
            { header: 'In 4', key: 'in4', width: 15 },
            { header: 'Out 4', key: 'out4', width: 15 },
            { header: 'In 5', key: 'in5', width: 15 },
            { header: 'Out 5', key: 'out5', width: 15 },
            { header: 'In 6', key: 'in6', width: 15 },
            { header: 'Out 6', key: 'out6', width: 15 },
            { header: 'Total Hours', key: 'totalHours', width: 25 },
            { header: 'Paid Hours', key: 'paidHours', width: 25 },
        ];

        this.attendanceReportList.forEach((am) => {
            var dataobj = {};
            //sheet
            sheet.columns.forEach(cl => {
                if (cl.key == 'date')
                    dataobj[cl.key] = moment(am.date).format('DD/MM/YYYY');
                else
                    dataobj[cl.key] = am[cl.key];
            });
            sheet.addRow(dataobj);
        });

        sheet.getRow('1').font = {
            size: 14,
            bold: true
        };

        var filename = "Attendance Report.xlsx";
        /* save to file */
        workbook.xlsx.writeBuffer().then(function (data) {
            saveAs(new Blob([data], { type: 'application/octet-stream' }), filename);
        });
    }

    filterSubmit(res) {
        console.log(res);
        this.filters = res.filters;
        this.maxrecords = res.maxrecords;
        this.loadData({ first: 0, rows: this.noofrows });
    }

    saveQuery(form) {
        this.isUpdateFiler = false;
        this.isSubmitForm = true;
        if (!form.invalid) {
            this.sharedService.saveQuery('client', null, '', this.saveQueryName, this.filters)
                .subscribe((res: any) => {
                    console.log(res);
                    this.isSubmitForm = false;
                    if (res.succeeded) {
                        this.selectedFilterId = res.value;
                        this.isUpdateFiler = true;
                        this.saveQueryCancelBtn.nativeElement.click();
                        /*swal('Successfully Saved!',
                          '',
                          'success');*/
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

    filtersEmit(res) {
        console.log(res);
        this.filters = res;
    }

    openSaveQueryModal() {
        this.saveQueryName = "";
        if (this.filters && this.filters.length > 0) {
            this.saveQueryBtn.nativeElement.click()
        }
        else {
            swal(
                'Oops...',
                'Select at least one filter to save query.',
                'info'
            )
        }
    }

    getAllAttendanceReports() {
        this.loading = true;

        this.cols = [
            { field: 'name', header: 'Name', index: 0, width: 'auto', sort: true },
            { field: 'date', header: 'Date', index: 1, width: '125', sort: true },
            { field: 'weekday', header: 'Weekday', index: 2, width: '125', sort: true },
            { field: 'in1', header: 'In 1', index: 3, width: '75', sort: false },
            { field: 'out1', header: 'Out 1', index: 4, width: '75', sort: false },
            { field: 'in2', header: 'In 2', index: 5, width: '75', sort: false },
            { field: 'out2', header: 'Out 2', index: 6, width: '75', sort: false },
            { field: 'in3', header: 'In 3', index: 7, width: '75', sort: false },
            { field: 'out3', header: 'Out 3', index: 8, width: '75', sort: false },
            { field: 'in4', header: 'In 4', index: 9, width: '75', sort: false },
            { field: 'out4', header: 'Out 4', index: 10, width: '75', sort: false },
            { field: 'in5', header: 'In 5', index: 11, width: '75', sort: false },
            { field: 'out5', header: 'Out 5', index: 10, width: '75', sort: false },
            { field: 'in6', header: 'In 6', index: 11, width: '75', sort: false },
            { field: 'out6', header: 'Out 6', index: 12, width: '75', sort: false },
            { field: 'totalHours', header: 'Total Hours', index: 12, width: '100', sort: false },
            // { field: 'paidHours', header: 'Paid Hours', index: 12, width: '100', sort: false },
        ];
        this.cols.forEach((cl, i) => {
            cl.index = i
        })

        this.selectedColumns = this.cols;
    }

    loadData(event: LazyLoadEvent) {
        this.loading = true;

        if (!event.sortField) { event.sortField = "name" }
        if (!event.sortOrder) { event.sortOrder = 1 }

        console.log(event);
        /*this.dataTablesParameters.start = event.first;
        this.dataTablesParameters.length = event.rows;*/

        this.sharedService.getDataWithFilter(event, this.colVisData, this.maxrecords, this.filters, "AttendanceReport", null)
            .subscribe((resp: any) => {
                // debugger;
                this.attendanceReportList = resp.value;
                console.log(resp);

                this.loading = false;
                this.totalRecords = resp.totalCount;
                this.attendanceReportList.forEach((at) => {
                    if (at.date)
                        at.date = moment(at.date).toDate();
                })
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

    submitAttendanceReport(form) {
        this.isSubmitForm = true;
        var err = [];
        if ((this.attendanceReport.out1 && (this.attendanceReport.in1 > this.attendanceReport.out1)) ||
            (this.attendanceReport.out1 && !this.attendanceReport.in1))
            err.push("<p>Invalid entries in line 1</p>");
        if ((this.attendanceReport.out2 && (this.attendanceReport.in2 > this.attendanceReport.out2)) ||
            (this.attendanceReport.out2 && !this.attendanceReport.in2))
            err.push("<p>Invalid entries in line 2</p>");
        if ((this.attendanceReport.out3 && (this.attendanceReport.in3 > this.attendanceReport.out3)) ||
            (this.attendanceReport.out3 && !this.attendanceReport.in3))
            err.push("<p>Invalid entries in line 3</p>");
        if ((this.attendanceReport.out4 && (this.attendanceReport.in4 > this.attendanceReport.out4)) ||
            (this.attendanceReport.out4 && !this.attendanceReport.in4))
            err.push("<p>Invalid entries in line 4</p>");
        if ((this.attendanceReport.out5 && (this.attendanceReport.in5 > this.attendanceReport.out5)) ||
            (this.attendanceReport.out5 && !this.attendanceReport.in5))
            err.push("<p>Invalid entries in line 5</p>");
        if ((this.attendanceReport.out6 && (this.attendanceReport.in6 > this.attendanceReport.out6)) ||
            (this.attendanceReport.out6 && !this.attendanceReport.in6))
            err.push("<p>Invalid entries in line 6</p>");
        if (form.valid && err.length == 0) {
            var index = this.staffs.findIndex((st) => st.username == this.attendanceReport.username);
            if (index >= 0)
                this.attendanceReport.name = this.staffs[index].fullName;
            this.staffService.updateAttendanceReport(this.attendanceReport)
                .subscribe((res: any) => {
                    this.isSubmitForm = false;
                    console.log(res)
                    if (res.succeeded) {
                        this.attendanceReportCancelBtn.nativeElement.click();
                        this.loadData({ first: 0, rows: this.noofrows });
                    } else {
                        var err = "";
                        res.errors.forEach((er) => {
                            err = err + " " + er;
                        });

                        swal('Error!', err, 'error');
                    }
                });
        }

        if (err.length > 0) {
            var errstr = "";
            err.forEach((er) => {
                errstr = errstr + " " + er;
            });

            swal('Error!', errstr, 'error');
        }
    }

    getStaffs() {
        this._userService.getStaffs()
            .subscribe((res: any) => {
                this.staffs = res.value;
                console.log(this.staffs);
            });
    }
}