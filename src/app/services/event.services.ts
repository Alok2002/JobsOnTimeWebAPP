import { HttpClient } from '@angular/common/http';
import 'rxjs';
import { Injectable } from '@angular/core';
import { apiHost } from '../app.component';
import { AuthService } from './auth.services';
@Injectable()
export class EventServices {

  constructor(private _http: HttpClient, private authService: AuthService) { }

  getClients() {
    return this._http.get(apiHost + '/api/event/GetClients');
  }

  getClientJobs(clientId) {
    return this._http.get(apiHost + '/api/event/GetClientJobs/' + clientId);
  }

  getClientJobGroups(jobId) {
    return this._http.get(apiHost + '/api/event/GetClientJobGroups/' + jobId);
  }

  getIncentiveListForJob(jobId) {
    return this._http.get(apiHost + '/api/event/GetIncentiveListForJob/' + jobId);
  }

  getIncentiveListForGroup(jobId) {
    return this._http.get(apiHost + '/api/event/GetIncentiveListForGroup/' + jobId);
  }

  getJobListIncludingPast(clientId) {
    return this._http.get(apiHost + '/api/event/GetJobListIncludingPast/' + clientId);
  }

  getGroupListIncludingPast(jobId) {
    return this._http.get(apiHost + '/api/event/GetGroupListIncludingPast/' + jobId);
  }

  getEventTypes() {
    return this._http.get(apiHost + '/api/event/GetEventTypes');
  }
}
