import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import 'rxjs';
import { Observable } from "rxjs/Observable";
import { apiHost } from "../app.component";
import { AuthService } from "./auth.services";
@Injectable()
export class ReportServices {
  constructor(private _http: HttpClient, private authService: AuthService) { }

  getPendingRecruitment() {
    // return this._http.get(apiHost+'/api/report/pendingrecruitment')
    return this._http.get(apiHost + '/api/report/session-recruitment-report');
  }

  getSessionRecruitment() {
    return this._http.get(apiHost + '/api/report/session-recruitment-report');
  }

  postSessionRecruitment(filter) {
    console.log(filter);
    let input = new FormData();
    var json = JSON.stringify(filter);
    input.append("json", json);

    return this._http.post(apiHost + '/api/report/session-recruitment-report', input);
  }

  postStaffRoster(filter) {
    console.log(filter);
    let input = new FormData();
    var json = JSON.stringify(filter);
    input.append("json", json);

    return this._http.post(apiHost + '/api/report/staff-Roster', input, { headers: { ignoreLoadingBar: '' } });
  }

  getJobReportSummary() {
    return this._http.get(apiHost + '/api/report/job-report-summary');
  }

  postJobRecruitment(reports) {
    let input = new FormData();
    var json = JSON.stringify(reports);
    input.append("json", json);

    return this._http.post(apiHost + '/api/report/job-recruitment-report', input);
  }

  getJobOrderReport() {
    return this._http.get(apiHost + '/api/report/job-order-report');
  }

  getStaffKpiReport() {
    return this._http.get(apiHost + '/api/report/staff-kpi-report ');
  }

  getStaffAttendanceReport() {
    return this._http.get(apiHost + '/api/report/staff-attendance-report ');
  }

  getStaffPayrollReport() {
    return this._http.get(apiHost + '/api/report/staff-payroll-report');
  }

  postJobSummary(reports) {
    let input = new FormData();
    var json = JSON.stringify(reports);
    input.append("json", json);

    return this._http.post(apiHost + '/api/report/job-report-summary', input);
  }

  postMemberPoint(reports) {
    let input = new FormData();
    var json = JSON.stringify(reports);
    input.append("json", json);

    return this._http.post(apiHost + '/api/report/member-points-report', input);
  }

  postMemberProfilePointRespondent(reports) {
    let input = new FormData();
    var json = JSON.stringify(reports);
    input.append("json", json);

    return this._http.post(apiHost + '/api/report/respondent-points-report', input);
  }

  postMemberPointsDetailRespondent(reports) {
    let input = new FormData();
    var json = JSON.stringify(reports);
    input.append("json", json);

    return this._http.post(apiHost + '/api/report/respondent-points-detail-report', input);
  }

  postJobSummaryDetails(reports) {
    let input = new FormData();
    var json = JSON.stringify(reports);
    console.log(json)
    input.append("json", json);

    return this._http.post(apiHost + '/api/report/job-report-detail', input);
  }

  postJobOrder(reports) {
    let input = new FormData();
    var json = JSON.stringify(reports);
    input.append("json", json);

    return this._http.post(apiHost + '/api/report/job-order-report', input);
  }

  postSales(reports) {
    let input = new FormData();
    var json = JSON.stringify(reports);
    input.append("json", json);

    return this._http.post(apiHost + '/api/report/sales-report', input);
  }

  postStaffKpi(reports) {
    let input = new FormData();
    var json = JSON.stringify(reports);
    input.append("json", json);

    return this._http.post(apiHost + '/api/report/staff-kpi-report', input);
  }

  postStaffAttendance(reports) {
    let input = new FormData();
    var json = JSON.stringify(reports);
    input.append("json", json);

    return this._http.post(apiHost + '/api/report/staff-attendance-report', input);
  }

  postStaffPayroll(filter) {
    console.log(filter);
    let input = new FormData();
    var json = JSON.stringify(filter);
    input.append("json", json);

    return this._http.post(apiHost + '/api/report/staff-payroll-report', input);
  }

  postStaffPayrollExportExcel(filter) {
    console.log(filter);
    let input = new FormData();
    var json = JSON.stringify(filter);
    input.append("json", json);

    return this._http.post(apiHost + '/api/report/staff-payroll-report-export', input, { responseType: 'blob' });
  }

  getPointReportJobs() {
    return this._http.get(apiHost + '/api/point-report-jobs');
  }

  getPointEventTypes() {
    return this._http.get(apiHost + '/api/event/GetPointEventTypes');
  }

  postIncentiveReport(filter) {
    console.log(filter);
    let input = new FormData();
    var json = JSON.stringify(filter);
    input.append("json", json);

    return this._http.post(apiHost + '/api/report/incentive-report', input);
  }
}
