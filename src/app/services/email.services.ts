import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { ConfigItem } from '../models/configitem';
import { apiHost } from "../app.component";
import { AuthService } from "./auth.services";
@Injectable()
export class EmailServices {
  constructor(private _http: HttpClient, private authService: AuthService) {
  }

  getEmailTemplates() {
    return this._http.get(apiHost + '/api/emailtemplate');
  }

  getGeneralEmailTemplates() {
    return this._http.get(apiHost + '/api/GetGeneralEmailTemplate');
  }

  updateEmailTemplate(emailtemplate) {
    let input = new FormData();
    var json = JSON.stringify(emailtemplate);
    input.append("json", json);

    return this._http.post(apiHost + '/api/emailtemplate/update', input);
  }

  getSurveyInviteEmailData(ids, jobid, sessionid) {
    console.log(ids);
    console.log(jobid);
    console.log(sessionid);
    let input = new FormData();
    var json = JSON.stringify(ids);
    input.append("json", json);
    input.append("jobId", jobid);
    if (sessionid == null) sessionid = 0;
    input.append("sessionId", sessionid);

    return this._http.post(apiHost + '/api/email/CreateResSurveyInviteEmail', input);
  }

  getNoShowEmail(ids, jobid, sessionid) {
    console.log(ids);
    console.log(jobid);
    console.log(sessionid);
    let input = new FormData();
    var json = JSON.stringify(ids);
    input.append("json", json);
    input.append("jobId", jobid);
    if (sessionid == null) sessionid = 0;
    input.append("sessionId", sessionid);

    return this._http.post(apiHost + '/api/email/NoShowEmail', input);
  }

  getCreateRespondentEmail(ids, jobid, sessionid) {
    let input = new FormData();
    var json = JSON.stringify(ids);
    input.append("json", json);
    if (jobid == null) jobid = 0;
    input.append("jobId", jobid);
    if (sessionid == null) sessionid = 0;
    input.append("sessionId", sessionid);

    return this._http.post(apiHost + '/api/email/CreateRespondentEmail', input);
  }

  getEmailData(entity, id) {
    return this._http.get(apiHost + '/api/email/' + entity + '/' + id);
  }

  postEmail(email, attachment?) {
    let input = new FormData();
    var json = JSON.stringify(email);
    input.append("json", json);
    if (attachment) {
      for (var i = 0; i < attachment.length; i++) {
        input.append("attachment" + (i + 1), attachment[i]);
      }
    }

    return this._http.post(apiHost + '/api/email/send', input);
  }

  getCreateOnlineSurveywithThirdpartyURL(ids, jobid, sessionid) {
    console.log(ids);
    console.log(jobid);
    console.log(sessionid);
    let input = new FormData();
    var json = JSON.stringify(ids);
    input.append("json", json);
    input.append("jobId", jobid);
    if (sessionid == null) sessionid = 0;
    input.append("sessionId", sessionid);

    return this._http.post(apiHost + '/api/email/CreateOnlineSurveywithThirdpartyURL', input);
  }

  getCreateOnlineSurveywithUniqueRespondentID(ids, jobid, sessionid) {
    console.log(ids);
    console.log(jobid);
    console.log(sessionid);
    let input = new FormData();
    var json = JSON.stringify(ids);
    input.append("json", json);
    input.append("jobId", jobid);
    if (sessionid == null) sessionid = 0;
    input.append("sessionId", sessionid);

    return this._http.post(apiHost + '/api/email/CreateOnlineSurveywithUniqueRespondentID', input);
  }

  createSessionConfirmationResIdsEmail(resids: Array<string>, sessionid) {
    let input = new FormData();
    var json = JSON.stringify(resids);
    input.append("json", json);

    return this._http.post(apiHost + '/api/email/CreateSessionConfirmationResIdsEmail/' + sessionid, input);
  }
}
