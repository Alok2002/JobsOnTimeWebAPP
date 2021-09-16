import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import 'rxjs';
import { Observable } from "rxjs/Observable";
import { ConfigItem } from '../models/configitem';
import { apiHost } from "../app.component";
import { AuthService } from "./auth.services";
import { Session } from '../models/session';

@Injectable()
export class SessionServices {
  constructor(private _http: HttpClient, private authService: AuthService) { }

  getAllSessions() {
    return this._http.get(apiHost + '/api/jobgroup');
  }

  getSessionsbyId(sid) {
    return this._http.get(apiHost + '/api/jobgroup/' + sid);
  }

  postSession(session) {
    let input = new FormData();
    var json = JSON.stringify(session);
    input.append("json", json);

    return this._http.post(apiHost + '/api/jobgroup/update', input);
  }

  postEvent(event) {
    let input = new FormData();
    var json = JSON.stringify(event);
    input.append("json", json);

    return this._http.post(apiHost + '/api/event/update', input);
  }

  deleteSession(configitemid) {
    let input = new FormData();
    var json = JSON.stringify(configitemid);
    input.append("json", json);

    return this._http.post(apiHost + '/api/jobgroup/delete', input);
  }

  //job standby-respondents
  getQualbyResByJob(jgid) {
    return this._http.get(apiHost + '/api/job/qual-respondents/' + jgid);
  }

  //job all-respondents
  getStandbyResByJob(jgid) {
    return this._http.get(apiHost + '/api/job/standby-respondents/' + jgid);
  }

  //session researcher/contact
  getSessionContactByJob(jgid) {
    return this._http.get(apiHost + '/api/jobgroup/contacts/' + jgid);
  }

  updateSessionContact(sessioncontact) {
    let input = new FormData();
    var json = JSON.stringify(sessioncontact);
    input.append("json", json);

    return this._http.post(apiHost + '/api/jobgroup/contact/update', input);
  }

  delinkSessionContact(sessioncontactids) {
    let input = new FormData();
    /*var json = JSON.stringify(sessioncontactids);
    input.append("json", json);*/
    input.append("deleteId", sessioncontactids);

    return this._http.post(apiHost + '/api/jobgroup/contact/delete', input);
  }

  delinkSessionVenue(sessionid) {
    let input = new FormData();
    /*var json = JSON.stringify(sessioncontactids);
    input.append("json", json);*/
    input.append("deleteId", sessionid);

    return this._http.post(apiHost + '/api/jobgroup/venue/delete', input);
  }

  //session customRVR
  getSessionCustomRVRbySession(jgid) {
    return this._http.get(apiHost + '/api/jobgroups/customfield/' + jgid);
  }

  getSessionCustomRVRbyId(id) {
    return this._http.get(apiHost + '/api/jobgroup/customfield/' + id);
  }

  updateSessionCustomRVR(customrvr) {
    let input = new FormData();
    var json = JSON.stringify(customrvr);
    input.append("json", json);

    return this._http.post(apiHost + '/api/jobgroup/customfield/update', input);
  }

  deleteSessionCustomRVR(sessioncontactids) {
    let input = new FormData();
    var json = JSON.stringify(sessioncontactids);
    input.append("json", json);

    return this._http.post(apiHost + '/api/jobgroup/customfield/delete', input);
  }

  //session quota
  getSessionQuotabySession(jgid) {
    return this._http.get(apiHost + '/api/jobgroup/quotas/' + jgid);
  }

  //session time
  getSessionTimesBySessionId(sessionid: number) {
    return this._http.get(apiHost + '/api/jobgroup-times/' + sessionid);
  }

  getGetIncentiveListForGroup(sessionid: number) {
    return this._http.get(apiHost + '/api/event/GetIncentiveListForGroup/' + sessionid);
  }

  getSessionTimesBySessionIdForEventModal(sessionid: number) {
    return this._http.get(apiHost + '/api/event/GetSessionTimesListForGroup/' + sessionid);
  }

  updateSessionTime(sessiontime) {
    let input = new FormData();
    var json = JSON.stringify(sessiontime);
    input.append("json", json);

    return this._http.post(apiHost + '/api/jobgroup-time/update', input);
  }

  deleteSessionTime(ids) {
    let input = new FormData();
    var json = JSON.stringify(ids);
    input.append("json", json);

    return this._http.post(apiHost + '/api/jobgroup-times/delete', input);
  }

  //INCENTIVES
  getIncentiveListForGroup(sessionid: number) {
    return this._http.get(apiHost + '/api/event/GetIncentiveListForGroup/' + sessionid);
  }

  getSessionIncentiveBySessionId(sessionid: number) {
    return this._http.get(apiHost + '/api/jobgroup/incentives/' + sessionid);
  }

  updateSessionIncentive(incentive, sessionid) {
    let input = new FormData();
    var json = JSON.stringify(incentive);
    input.append("json", json);
    input.append("jobGroupId", sessionid);

    return this._http.post(apiHost + '/api/jobgroup/incentives/update', input);
  }

  //DURATIONS
  getSessionDurationBySessionId(sessionid: number) {
    return this._http.get(apiHost + '/api/jobgroup/durations/' + sessionid);
  }

  updateSessionDuration(incentive, sessionid) {
    let input = new FormData();
    var json = JSON.stringify(incentive);
    input.append("json", json);
    input.append("jobGroupId", sessionid);

    return this._http.post(apiHost + '/api/jobgroup/durations/update', input);
  }

  //Venue
  deleteJobVenue(ids) {
    let input = new FormData();
    var json = JSON.stringify(ids);
    input.append("json", json);

    return this._http.post(apiHost + '/api/job-venue/delete', input);
  }

  updateJobVenue(venue) {
    console.log(venue);
    let input = new FormData();
    var json = JSON.stringify(venue);
    input.append("json", json);

    return this._http.post(apiHost + '/api/job-venue/update', input);
  }

  getVenuebySession(vid) {
    return this._http.get(apiHost + '/api/jobgroup/venues/' + vid);
  }

  updateSessionVenue(sessioncontact) {
    let input = new FormData();
    var json = JSON.stringify(sessioncontact);
    input.append("json", json);

    return this._http.post(apiHost + '/api/jobgroup/venue/update', input);
  }

  confirmAttendance(ids) {
    let input = new FormData();
    var json = JSON.stringify(ids);
    input.append("json", json);

    return this._http.post(apiHost + '/api/event/ConfirmAttendance', input);
  }

  unConfirmAttendance(ids) {
    let input = new FormData();
    var json = JSON.stringify(ids);
    input.append("json", json);

    return this._http.post(apiHost + '/api/event/UnConfirmAttendance', input);
  }

  recordPayment(ids, jobid, sessionid) {
    let input = new FormData();
    var json = JSON.stringify(ids);
    input.append("json", json);
    //input.append("JobId", jobid);
    //input.append("SessionId", sessionid);    

    return this._http.post(apiHost + '/api/event/RecordPaymentForQualifiedResp', input);
  }

  cancelPayment(ids, jobid, sessionid) {
    let input = new FormData();
    var json = JSON.stringify(ids);
    input.append("json", json);
    //input.append("JobId", jobid);
    //input.append("SessionId", sessionid);    

    return this._http.post(apiHost + '/api/event/CancelPayment', input);
  }

  saveInDepthTime(ids, indepthtime) {
    let input = new FormData();
    var json = JSON.stringify(ids);
    input.append("json", json);
    input.append("inDepthTime", indepthtime);

    return this._http.post(apiHost + '/api/event/PostInDepthTime', input);
  }

  saveIncentive(ids, incentive) {
    let input = new FormData();
    var json = JSON.stringify(ids);
    input.append("json", json);
    input.append("incentive", incentive);

    return this._http.post(apiHost + '/api/event/PostIncentive', input);
  }

  saveAttendeeDocComment(ids, comment) {
    let input = new FormData();
    var json = JSON.stringify(ids);
    input.append("json", json);
    input.append("comment", comment);

    return this._http.post(apiHost + '/api/event/PostAttendeeDocumentComment', input);
  }

  saveNote(ids, note) {
    let input = new FormData();
    var json = JSON.stringify(ids);
    input.append("json", json);
    input.append("notes", note);

    return this._http.post(apiHost + '/api/event/PostNotes', input);
  }
}
