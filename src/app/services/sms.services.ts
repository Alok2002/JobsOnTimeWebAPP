import 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiHost } from '../app.component';
import { AuthService } from './auth.services';

@Injectable()
export class SmsServices {
  constructor(private _http: HttpClient, private authService: AuthService) { }

  postSMS(sms) {
    let input = new FormData();
    var json = JSON.stringify(sms);
    input.append("json", json);

    return this._http.post(apiHost + '/api/sms/send', input);
  }

  getSmsReply() {
    return this._http.get(apiHost + '/api/sms/replies');
  }

  getSmsData(entity, id) {
    return this._http.get(apiHost + '/api/sms/' + entity + '/' + id);
  }

  getResIdsSmsData(resids: Array<string>, sessionid) {
    let input = new FormData();
    var json = JSON.stringify(resids);
    input.append("json", json);

    return this._http.post(apiHost + '/api/sms/CreateSessionConfirmationResIdsSms/' + sessionid, input);
  }

  deleteReplies(deleteItemIds) {
    let input = new FormData();
    var json = JSON.stringify(deleteItemIds);
    input.append("json", json);

    return this._http.post(apiHost + '/api/sms/replies/delete', input);
  }

  getSurveyInviteSmsData(ids, jobid, sessionid) {
    console.log(ids);
    console.log(jobid);
    console.log(sessionid);
    let input = new FormData();
    var json = JSON.stringify(ids);
    input.append("json", json);
    input.append("jobId", jobid);
    if (sessionid == null) sessionid = 0;
    input.append("sessionId", sessionid);

    return this._http.post(apiHost + '/api/sms/CreateRespondentSurveyInviteSms', input);
  }
}
