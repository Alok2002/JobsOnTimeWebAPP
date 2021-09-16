import 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiHost } from '../app.component';
import { AuthService } from './auth.services';

@Injectable()
export class RespondentServices {
  constructor(private authService: AuthService, private _http: HttpClient) { }

  getRespondentData(type, respId) {
    let input = new FormData();
    input.append("type", type);
    input.append("respId", respId);
    return this._http.post(apiHost + '/api/reference-data-provider', input);
  }

  updateRespondentData(type, data) {
    let input = new FormData();
    input.append("type", type);
    var json = JSON.stringify(data);
    input.append("json", json);
    console.log(type, data);
    return this._http.post(apiHost + '/api/update-reference-item', input);
  }

  deleteRespondentData(type, deleteids) {
    let input = new FormData();
    input.append("type", type);
    var json = JSON.stringify(deleteids);
    input.append("json", json);
    console.log(type, deleteids);
    return this._http.post(apiHost + '/api/delete-reference-items', input);
  }

  getAllRespondents(params) {
    let input = new FormData();
    var json = JSON.stringify(params);
    input.append("json", json);
    let headers = new Headers();
    return this._http.post(apiHost + '/api/respondents', input);
  }

  getRespondentById(resid) {
    let headers = new Headers();
    return this._http.get(apiHost + '/api/respondent/' + resid);
  }

  getBusinessRoleList() {
    let headers = new Headers();
    return this._http.get(apiHost + '/api/data-provider/GetBusinessRoleList');
  }

  getGenderList() {
    let headers = new Headers();
    return this._http.get(apiHost + '/api/data-provider/GetGenderList');
  }
  
  GetRespTitleList() {
    let headers = new Headers();
    return this._http.get(apiHost + '/api/data-provider/GetRespTitleList');
  }

  getMobileTypeList() {
    let headers = new Headers();
    return this._http.get(apiHost + '/api/data-provider/GetMobilePhoneTypesList');
  }

  getContactMethodList() {
    let headers = new Headers();
    return this._http.get(apiHost + '/api/data-provider/GetPreferredContactMethodList');
  }

  getContactTimeList() {
    let headers = new Headers();
    return this._http.get(apiHost + '/api/data-provider/GetPreferredContactTimeList');
  }

  getSessionTypeList() {
    let headers = new Headers();
    return this._http.get(apiHost + '/api/data-provider/GetPreferredGroupTypeList');
  }

  getResidencyStatusList() {
    let headers = new Headers();
    return this._http.get(apiHost + '/api/data-provider/GetResidencyStatusList');
  }

  getImpairmentCompetencyList() {
    let headers = new Headers();
    return this._http.get(apiHost + '/api/data-provider/GetImpairmentCompetencyList');
  }

  getImpairmentSeverityList() {
    let headers = new Headers();
    return this._http.get(apiHost + '/api/data-provider/GetImpairmentSeverityList');
  }
  getVehicleTypeList() {
    let headers = new Headers();
    return this._http.get(apiHost + '/api/data-provider/GetVehicleTypeList');
  }

  getMonthList() {
    let headers = new Headers();
    return this._http.get(apiHost + '/api/data-provider/GetMonthList');
  }

  getYearList() {
    let headers = new Headers();
    return this._http.get(apiHost + '/api/data-provider/GetYearList');
  }

  getHouseholdIncomeLevelList() {
    let headers = new Headers();
    return this._http.get(apiHost + '/api/data-provider/GetHouseholdIncomeList');
  }

  getHighestEducationLevelList() {
    let headers = new Headers();
    return this._http.get(apiHost + '/api/data-provider/GetHighestEducationLevelList');
  }

  getMobilePhoneTypesList() {
    let headers = new Headers();
    return this._http.get(apiHost + '/api/data-provider/GetMobilePhoneTypesList ');
  }

  getEmployerTurnOverList() {
    let headers = new Headers();
    return this._http.get(apiHost + '/api/data-provider/GetEmployerTurnoverList');
  }

  getInternetTypeList() {
    let headers = new Headers();
    return this._http.get(apiHost + '/api/data-provider/GetInternetTypeList');
  }

  getTravelFrequencyList() {
    let headers = new Headers();
    return this._http.get(apiHost + '/api/data-provider/GetTravelFrequencyList');
  }

  getBusinessSizeList() {
    let headers = new Headers();
    return this._http.get(apiHost + '/api/data-provider/GetEmployeeNumbersList');
  }

  getEducationTypeList() {
    let headers = new Headers();
    return this._http.get(apiHost + '/api/data-provider/GetInstituteTypeList');
  }

  getOccupationLevelList() {
    let headers = new Headers();
    return this._http.get(apiHost + '/api/data-provider/GetEmploymentTypes');
  }

  getCountryList() {
    let headers = new Headers();
    return this._http.get(apiHost + '/api/data-provider/GetCountryList');
  }

  getLanguageList() {
    let headers = new Headers();
    return this._http.get(apiHost + '/api/data-provider/GetLanguageList');
  }

  getEventTypeListWithBlank() {
    let headers = new Headers();
    return this._http.get(apiHost + '/api/data-provider/GetEventTypeListWithBlank');
  }

  updateRespondent(respondent) {
    delete respondent.eventsSummary;
    delete respondent.jobs;
    delete respondent.jobsSummary;
    console.log(respondent);
    let input = new FormData();
    input.append("json", JSON.stringify(respondent));

    return this._http.post(apiHost + '/api/respondent/update', input);
  }

  updateReferenceData(type, data, resid) {
    let input = new FormData();
    input.append("type", type);
    input.append("respId", resid);
    input.append("json", JSON.stringify({ 'value': data }));
    return this._http.post(apiHost + '/api/update-reference-data-provider', input);
  }

  updateReferenceDataList(data, resid) {
    let input = new FormData();
    input.append("respId", resid);
    input.append("json", JSON.stringify({ 'referenceList': data }));
    return this._http.post(apiHost + '/api/update-reference-data-provider', input);
  }

  getRespondentPaymentPointById(resid) {
    let headers = new Headers();
    return this._http.get(apiHost + '/api/respondent-payments/' + resid);
  }

  getRespondentJobsEventsById(resid) {
    let headers = new Headers();
    return this._http.get(apiHost + '/api/respondent-events/' + resid);
  }

  getrespondentsummary(resid) {
    let headers = new Headers();
    return this._http.get(apiHost + '/api/respondent-summary/' + resid);
  }

  getRespondentSurvey(resid) {
    let headers = new Headers();
    console.log(resid);
    return this._http.get(apiHost + '/api/respondent-surveys/' + resid);
  }

  getRespondentSurveyForStaff(resid) {
    let headers = new Headers();
    console.log(resid);
    return this._http.get(apiHost + '/api/respondent-surveys-staff-View/' + resid);
  }

  getRespondentOpportunities(resid) {
    let headers = new Headers();
    console.log(resid);
    return this._http.get(apiHost + '/api/respondent-opportunities/' + resid);
  }

  getChilderByResId(resid) {
    let headers = new Headers();
    return this._http.get(apiHost + '/api/respondent-children/' + resid);
  }

  updateChildren(children) {
    let input = new FormData();
    input.append("json", JSON.stringify({ 'value': children }));
    return this._http.post(apiHost + '/api/respondent-children/update', input);
  }

  createResEvent(resevent) {
    let input = new FormData();
    input.append("json", JSON.stringify(resevent));
    return this._http.post(apiHost + '/api/event/create', input);
  }

  // resservice
  voiceMailleft(resevnt) {
    let input = new FormData();
    input.append("json", JSON.stringify(resevnt));
    return this._http.post(apiHost + '/api/event/create-voice-call-left', input);
  }

  deleteRespondent(clientnotesids) {
    let input = new FormData();
    var json = JSON.stringify(clientnotesids);
    input.append("json", json);
    return this._http.post(apiHost + '/api/respondent/delete', input);
  }

  mergeRespondent(clientnotesids) {
    let input = new FormData();
    var json = JSON.stringify(clientnotesids);
    input.append("json", json);
    return this._http.post(apiHost + '/api/respondent/merge', input);
  }

  removeChild(ids) {
    let input = new FormData();
    var json = JSON.stringify(ids);
    input.append("json", json);
    return this._http.post(apiHost + '/api/respondent-children/delete', input);
  }

  deleteResJobs(ids) {
    let input = new FormData();
    var json = JSON.stringify(ids);
    input.append("json", json);
    return this._http.post(apiHost + '/api/event/delete', input);
  }

  createContactUs(respondentId, subject: string, message: string, role) {
    let input = new FormData();
    input.append("respondentId", respondentId);
    input.append("subject", subject);
    input.append("message", message);
    input.append("role", role);

    return this._http.post(apiHost + '/api/contact-us', input);
  }

  getRespondentPayments(resid) {
    return this._http.get(apiHost + '/api/respondent-payments/' + resid);
  }

  unsubscribe(encrypt: string) {
    return this._http.get(apiHost + '/api/respondent-unsubscribe?encodedData=' + encrypt);
  }

  respConfirmAttendance(ids) {
    let input = new FormData();
    var json = JSON.stringify(ids);
    input.append("json", json);
    return this._http.post(apiHost + '/api/event/RespConfirmAttendance', input);
  }

  getRespondentlist(id) {
    return this._http.get(apiHost + '/api/respondentlist/' + id);
  }
}
