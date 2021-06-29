import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import 'rxjs';
import { apiHost } from "../app.component";
import { AuthService } from "./auth.services";

@Injectable()
export class DashboardServices {
  constructor(private _http: HttpClient, private authService: AuthService) { }

  quickJobSearch(field, text) {
    console.log(field, text);
    let input = new FormData();
    input.append("field", field);
    input.append("searchtext", text);

    return this._http.post(apiHost + '/api/job-quick-search', input);
  }

  quickResSearch(field, text) {
    console.log(field, text);
    let input = new FormData();
    input.append("field", field);
    input.append("searchtext", text);

    return this._http.post(apiHost + '/api/job-respondent-search', input);
  }

  weeklyKpiReport() {
    return this._http.get(apiHost + '/api/report/weekly-staff-kpi-report');
  }

  dailyKpiReport() {
    return this._http.get(apiHost + '/api/report/daily-staff-kpi-report');
  }

  jobConfirmationReport() {
    return this._http.get(apiHost + '/api/confirmation-report');
  }

  currentJobs() {
    return this._http.get(apiHost + '/api/current-jobs');
  }

  getUserCurrentSessions() {
    return this._http.get(apiHost + '/api/report/GetUserCurrentSessions', { headers: { ignoreLoadingBar: '' } });
  }

  getDashboardSalesReport() {
    return this._http.get(apiHost + '/api/report/dashboard-sales-report');
  }

  getDashStats() {
    return this._http.get(apiHost + '/api/dash-stats/');
  }
}
