import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { apiHost } from "../app.component";
import { AuthService } from "./auth.services";
@Injectable()
export class JobSessionServices {
  constructor(private _http: HttpClient, private authService: AuthService) { }

  getAllJobSessions() {
    return this._http.get(apiHost + '/api/job/sessions');
  }

  getSessionByJob(jid) {
    return this._http.get(apiHost + '/api/jobgroups/' + jid);
  }

  getSessionCalendar() {
    return this._http.get(apiHost + '/api/session-calendar');
  }

  getSessionContacts(jid) {
    return this._http.get(apiHost + '/api/job/session/contacts' + jid);
  }
}
