import 'rxjs/add/observable/of';

import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import { saveAs } from 'file-saver';
import * as JWT from 'jwt-decode';
import * as moment from 'moment';
import { CookieService } from 'ngx-cookie-service';
import swal from 'sweetalert2';

import { apiHost, pageTile } from '../app.component';
import { DashboardUserSession } from '../models/dashboardusersession';
import { PtableColumn } from '../models/ptablecolumn';
import { DashboardServices } from '../services/dashboard.services';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SharedServices } from '../services/shared.services';
import { UserServices } from '../services/user.services';
import { SecurityRights, SecurityRightsExportError } from './enum';

//import {AutoCompleteDirective} from "./index";
@Component({
  selector: 'DashboardComponent',
  templateUrl: './dashboard.component.html'
})

export class DashboardComponent implements OnInit, OnDestroy {
  username: string;
  dailykpireport = [];
  weeklykpireport = [];
  currentjobs = [];
  confirmationreport = [];
  toggleSuggName: string;

  resemail: string;
  resmobile: string;
  resid: string;
  jobno: string;
  jobname: string;
  jobinvoice: string;

  resfirstname: string;
  // reslastname: string;
  poNumber: string;
  isLoading = true;
  resfullname: string;

  public jobNoAPI: string;
  public jobNameAPI: string;
  public jobInvoiceNoAPI: string;
  public respIdAPI: string;
  public respMobileAPI: string;
  public respEmailAPI: string;
  public respFullNameAPI: string;

  public respFirstNameAPI: string;
  // public respLastNameAPI: string = apiHost + "/api/search/resp-email/:keyword";
  public poNumberAPI: string;

  userSessions: Array<DashboardUserSession>;

  //public googleGeoCode: string = "http://logajob.com.au/api/job-search/:keyword";

  loginuserrole: string;
  loginusername: string;
  userSessionInterval: any;

  noofrows = 50;
  selectedColumns: Array<PtableColumn> = [];
  cols: Array<PtableColumn> = [];
  selectedRowData = [];
  ptablesearch: string;
  stats: any;
  pageTile = pageTile;

  constructor(private userservice: UserServices, public zone: NgZone, private dashboardservice: DashboardServices, private router: Router, private _sanitizer: DomSanitizer,
    public sharedService: SharedServices, private cookieService: CookieService, private securityInfoResolve: SecurityInfoResolve) {

    if (this.cookieService.check('auth_token')) {
      var token = this.cookieService.get('auth_token');
      this.jobNoAPI = apiHost + "/api/search/job-number/:keyword/?token=" + token;
      this.jobNameAPI = apiHost + "/api/search/job-name/:keyword/?token=" + token;
      this.jobInvoiceNoAPI = apiHost + "/api/search/job-invnumber/:keyword/?token=" + token;
      this.respIdAPI = apiHost + "/api/search/resp-id/:keyword/?token=" + token;
      this.respMobileAPI = apiHost + "/api/search/resp-mobile/:keyword/?token=" + token;
      this.respEmailAPI = apiHost + "/api/search/resp-email/:keyword/?token=" + token;
      this.respFullNameAPI = apiHost + "/api/search/resp-fullname/:keyword/?token=" + token;
      this.respFirstNameAPI = apiHost + "/api/search/resp-firstname/:keyword/?token=" + token;
      this.poNumberAPI = apiHost + "/api/search/job-ponumber/:keyword/?token=" + token;
    }
  }

  ngOnInit() {
    this.cols = [
      { field: 'sessionDate', header: 'Date', index: 0, width: '75', sort: false },
      { field: 'jobNumber', header: 'Job No', index: 1, width: '65', sort: false },
      { field: 'jobName', header: 'Job Name', index: 2, width: '250', sort: false },
      { field: 'projectManager', header: 'Project Manager', index: 3, width: '140', sort: false },
      { field: 'recruiter1', header: 'Recruiter', index: 4, width: '120', sort: false },
      { field: 'jobStatus', header: 'Job Status', index: 5, width: '170', sort: false },
      { field: 'clientName', header: 'Client', index: 6, width: '210', sort: false },
      { field: 'sessionName', header: 'Session Name', index: 7, width: '280', sort: false },
      { field: 'requiredforSession', header: 'Req', index: 8, width: '50', sort: false, textAlign: 'right' },
      { field: 'qualifiedforSession', header: 'Qual', index: 9, width: '50', sort: false, textAlign: 'right' },
      { field: 'needForSession', header: 'Need', index: 10, width: '50', sort: false, textAlign: 'right' },
      { field: 'confirmationEmailSent', header: 'Conf Email Sent', index: 11, width: '100', sort: false, textAlign: 'right' },
      { field: 'confirmationSmsSent', header: 'Conf SMS Sent', index: 12, width: '100', sort: false, textAlign: 'right' },
      { field: 'confirmed', header: 'Confirmed', index: 13, width: '75', sort: false, textAlign: 'right' },
      { field: 'validationReportSent', header: 'RVR Sent', index: 14, width: '75', sort: false, textAlign: 'center' },
      { field: 'requiredforJob', header: 'Job Req', index: 15, width: '75', sort: false, textAlign: 'right' },
      { field: 'qualifiedforJob', header: 'Job Qual', index: 16, width: '75', sort: false, textAlign: 'right' },
      { field: 'needForJob', header: 'Job Need', index: 17, width: '75', sort: false, textAlign: 'right' },
    ];
    this.selectedColumns = this.cols;

    this.getLoginUserRoles();
    this.getUserName();
    //this.getCurrentJobs();
    //this.getConfirmationReport();
    this.getUserCurrentSessions();
    this.userSessionInterval = setInterval(() => {
      this.getUserCurrentSessions();
    }, 50000);
    this.getDashStats();
  }

  getUserName() {
    this.userservice.getUserName()
      .subscribe((res: any) => {
        this.username = res.value;
      });
  }

  /*quickJobSearch(field, value) {
    this.dashboardservice.quickJobSearch(field, value)
      .subscribe(res => {
        console.log(res);
        this.jobSearchResult = res.value;
        this.toggleSuggName = field;
      });
  }*/

  /*quickResSearch() {
    //this.googleGeoCode = "https://maps.googleapis.com/maps/api/geocode/json?address=:keyword";
    //console.log("quickResSearch");
    //console.log(value);
    this.dashboardservice.quickResSearch("respondentemail", this.resemail)
      .map(res => {
        console.log(res);
        this.resSearchResult = [];
        res.value.forEach(re => {
          this.resSearchResult.push({ id: re.id, value: re.email, name: re.fullName });
        });
        console.log(this.resSearchResult);
        this.toggleSuggName = "respondentemail";
        return this.resSearchResult;
      });
  }

  autocompleListFormatter = (data: any) => {
    let html = `<span>${data.name} - ${data.value}</span>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }*/

  getWeeklyKPIReport() {
    this.dashboardservice.weeklyKpiReport()
      .subscribe((res: any) => {
        console.log(res);
        this.weeklykpireport = res.value;
      });
  }

  getDailyKPIReport() {
    this.dashboardservice.dailyKpiReport()
      .subscribe((res: any) => {
        console.log(res);
        this.dailykpireport = res.value;
      });
  }

  getCurrentJobs() {
    this.dashboardservice.currentJobs()
      .subscribe((res: any) => {
        console.log(res);
        this.currentjobs = res.value;
      });
  }

  getConfirmationReport() {
    this.dashboardservice.jobConfirmationReport()
      .subscribe((res: any) => {
        this.confirmationreport = res.value;
      });
  }

  onClickedOutside(e: Event, togglename) {
    //console.log(togglename);
    this.toggleSuggName = null;
  }

  gotoRespondent(res) {
    this.resetSearchBoxs();
    if (res && res != "" && res != undefined && res != 0 && res.hasOwnProperty('id')) {
      this.resetSearchBoxs();
      //this.router.navigate(['/searchrespondents']);
      // this.router.navigate(['/searchrespondents/', res.id]);
      this.router.navigate(['/respondent/', res.id]);
    }
  }

  gotoRespondentById(resid) {
    // this.router.navigate(['/searchrespondents/', resid]);
    this.router.navigate(['/respondent/', resid]);
  }

  gotoJob(job) {
    if (job && job != "" && job != undefined && job != 0 && job.hasOwnProperty('id')) {
      this.resetSearchBoxs();
      this.router.navigate(['/job/edit/', job.id]);
    }
  }

  resetSearchBoxs() {
    this.resemail = "";
    this.resmobile = "";
    this.resid = "";
    this.jobno = "";
    this.jobname = "";
    this.jobinvoice = "";
  }

  getUserCurrentSessions() {
    this.dashboardservice.getUserCurrentSessions()
      .subscribe((res: any) => {
        console.log(res);
        this.userSessions = res.value;
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
      { header: 'Date', key: 'sessionDate', width: 30 },
      { header: 'Job No', key: 'jobNumber', width: 20 },
      { header: 'Job Name', key: 'jobName', width: 50 },
      { header: 'Project Manager', key: 'projectManager', width: 15 },
      { header: 'Recruiter', key: 'recruiter1', width: 15 },
      { header: 'Job Status', key: 'jobStatus', width: 15 },
      { header: 'Client', key: 'clientName', width: 30 },
      { header: 'Session Name', key: 'sessionName', width: 50 },
      { header: 'Req', key: 'requiredforSession', width: 15 },
      { header: 'Qual', key: 'qualifiedforSession', width: 15 },
      { header: 'Need', key: 'needForSession', width: 15 },
      { header: 'Conf Email Sent', key: 'confirmationEmailSent', width: 15 },
      { header: 'Conf SMS Sent', key: 'confirmationSMSSent', width: 15 },
      { header: 'Confirmed', key: 'confirmed', width: 15 },
      { header: 'RVR Sent', key: 'validationReportSent', width: 15 },
      { header: 'Job Req', key: 'requiredforJob', width: 50 },
      { header: 'Job Qual', key: 'qualifiedforJob', width: 15 },
      { header: 'Job Need', key: 'needForJob', width: 15 }
    ];

    this.userSessions.forEach((am) => {
      var dataobj = {};
      //sheet
      sheet.columns.forEach(cl => {
        if (cl.key == 'sessionDate') {
          var cdate = moment(am[cl.key]).format('DD/MM/YYYY');
          dataobj[cl.key] = cdate;
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

    var filename = "Current Sessions.xlsx";
    /* save to file */
    workbook.xlsx.writeBuffer().then(function (data) {
      saveAs(new Blob([data], { type: 'application/octet-stream' }), filename);
    });
  }

  getLoginUserRoles() {
    var token = JWT(this.cookieService.get('auth_token'));
    console.log(token);
    this.loginuserrole = token["role"];
    this.loginusername = token["unique_name"];
    if (this.loginuserrole) this.loginuserrole = this.loginuserrole.toLowerCase();
    if (this.loginuserrole == 'assistant project manager' || this.loginuserrole == 'recruiter') {
      this.getWeeklyKPIReport();
    }
    if (this.loginuserrole == 'director' || this.loginuserrole == 'office manager' || this.loginuserrole == 'assistant office manager' ||
      this.loginuserrole == 'project manager') {
      this.getDailyKPIReport();
    }
  }

  ngOnDestroy() {
    window.clearInterval(this.userSessionInterval);
  }

  updateSelectedColumnsIndex() {
    this.selectedColumns.sort((a, b) => {
      if (a.index > b.index) return 1;
      if (a.index < b.index) return -1;
      return 0;
    })
  }

  getDashStats() {
    this.dashboardservice.getDashStats()
      .subscribe((res: any) => {
        console.log(res);
        this.stats = res.value;
      });
  }
}
