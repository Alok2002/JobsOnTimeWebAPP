import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import 'rxjs';
import { apiHost } from "../app.component";
import { AuthService } from "./auth.services";

@Injectable()
export class JobServices {  
  constructor(private _http: HttpClient, private authService: AuthService) { }

  getAllJobs() {
    return this._http.get(apiHost + '/api/jobs');
  }

  /*getAllJobsNew(params, dbmodel) {
    let input = new FormData();
    var json = JSON.stringify(params);
    var dbmodeljson = JSON.stringify(dbmodel);
    input.append("json", json);
    input.append("dbmodel", dbmodeljson);

    
    

    return this._http.post(apiHost + '/api/jobsnew', input);
      
  }*/

  /*getAllJobsNew(params, dbmodel, maxrecords, filters) {
    let input = new FormData();
    var json = JSON.stringify(params);
    var dbmodeljson = JSON.stringify({"dbmodel": dbmodel});
    input.append("dtparams", json);
    input.append("dbmodel", dbmodeljson);
    input.append("entity", "ClientJob");
    input.append("maxrecords", maxrecords);

    if(filters)
    //FILTERS
    filters.forEach((ele, i) => {
      switch (ele.type) {
        case 'Text':
          var key = ele.caption + "|" + i + "|comparisonDropDown";
          var key1 = ele.caption + "|" + i + "|groupDropDown";
          var key2 = ele.caption + "|" + i + "|text1";

          input.append(key, ele.comparison);
          input.append(key1, ele.color);
          input.append(key2, ele.value1);
          break;
        case 'Password':
          var key = ele.caption + "|" + i + "|comparisonDropDown";
          var key1 = ele.caption + "|" + i + "|groupDropDown";
          var key2 = ele.caption + "|" + i + "|text1";

          input.append(key, ele.comparison);
          input.append(key1, ele.color);
          input.append(key2, ele.value1);
          break;
        case 'DropDown':
          var key = ele.caption + "|" + i + "|comparisonDropDown";
          var key1 = ele.caption + "|" + i + "|groupDropDown";
          var key2 = ele.caption + "|" + i + "|dropDown";

          input.append(key, ele.comparison);
          input.append(key1, ele.color);
          input.append(key2, ele.value1);
          break;
        case 'Option':
          var key = ele.caption + "|" + i + "|comparisonDropDown";
          var key1 = ele.caption + "|" + i + "|groupDropDown";
          var key2 = ele.caption + "|" + i + "|checked";

          input.append(key, ele.comparison);
          input.append(key1, ele.color);
          input.append(key2, ele.value1);
          break;

        case 'DoubleText':
        case 'Date':
          var key = ele.caption + "|" + i + "|comparisonDropDown";
          var key1 = ele.caption + "|" + i + "|groupDropDown";
          var key2 = ele.caption + "|" + i + "|date1";
          var key3 = ele.caption + "|" + i + "|date2";

          input.append(key, ele.comparison);
          input.append(key1, ele.color);
          input.append(key2, ele.value1);
          input.append(key3, ele.value2);
          break;

        default:
          break;
      }
    });

    
    

    return this._http.post(apiHost + '/api/query/result', input);
      
  }*/

  getJobsByJob(jid) {
    return this._http.get(apiHost + '/api/job/' + jid);
  }

  getClientRecentJob(cid) {
    return this._http.get(apiHost + '/api/clientrecentjob/' + cid);
  }

  getJobsByClient(cid) {
    return this._http.get(apiHost + '/api/client-jobs/' + cid);
  }

  deleteJobs(jobId: Array<string>) {
    let input = new FormData();
    var json = JSON.stringify(jobId);
    input.append("json", json);

    return this._http.post(apiHost + '/api/job/delete', input);
  }

  allocateJobs(jobId: Array<string>) {
    let input = new FormData();
    var json = JSON.stringify(jobId);
    input.append("json", json);

    return this._http.post(apiHost + '/api/job/allocate', input);
  }

  updateJob(job) {
    let input = new FormData();
    var json = JSON.stringify(job);
    input.append("json", json);

    return this._http.post(apiHost + '/api/job/update', input);
  }

  getJobIncentivesByJob(jid) {
    return this._http.get(apiHost + '/api/job/incentives/' + jid);
  }

  deleteIncentive(incentives: Array<string>) {
    let input = new FormData();
    var json = JSON.stringify(incentives);
    input.append("json", json);

    return this._http.post(apiHost + '/api/job/incentive/delete', input);
  }

  updateJobIncentive(incentive) {
    let input = new FormData();
    var json = JSON.stringify(incentive);
    input.append("json", json);

    return this._http.post(apiHost + '/api/job/incentive/update', input);
  }

  getJobTimeAllocationByClient(cid) {
    return this._http.get(apiHost + '/api/job/time-allocation/' + cid);
  }

  getJobTimeAllocationSummaryByClient(cid) {
    return this._http.get(apiHost + '/api/job/time-allocation-summary/' + cid);
  }

  getSessionByJob(jid) {
    return this._http.get(apiHost + '/api/jobgroups/' + jid);
  }

  deleteSession(sessions: Array<string>) {
    let input = new FormData();
    var json = JSON.stringify(sessions);
    input.append("json", json);

    return this._http.post(apiHost + '/api/jobgroup/delete', input);
  }

  updateInvoice(invoice) {
    let input = new FormData();
    var invoiceObj = { "invoices": invoice }

    var json = JSON.stringify(invoiceObj);
    input.append("json", json);

    return this._http.post(apiHost + '/api/job/invoice/update', input);
  }

  //job contact
  getContactsByJob(jid) {
    return this._http.get(apiHost + '/api/job/contacts/' + jid);
  }

  updateJobContact(jobcontact) {
    let input = new FormData();
    console.log(jobcontact);
    var json = JSON.stringify(jobcontact);
    input.append("json", json);

    return this._http.post(apiHost + '/api/job/contact/update', input);
  }

  deleteContact(contact: Array<string>) {
    let input = new FormData();
    var json = JSON.stringify(contact);
    input.append("json", json);

    return this._http.post(apiHost + '/api/job/contact/delete', input);
  }

  //job quota
  getQuotaByJob(jid) {
    return this._http.get(apiHost + '/api/job/quotas/' + jid);
  }

  updateJobQuota(jobquota) {
    let input = new FormData();
    var json = JSON.stringify(jobquota);
    input.append("json", json);

    return this._http.post(apiHost + '/api/job/quota/update', input);
  }

  deleteQuota(quota: Array<string>) {
    let input = new FormData();
    var json = JSON.stringify(quota);
    input.append("json", json);

    return this._http.post(apiHost + '/api/job/quota/delete', input);
  }
  
  deleteQuotaClear(quota: Array<string>) {
    let input = new FormData();
    var json = JSON.stringify(quota);
    input.append("json", json);

    return this._http.post(apiHost + '/api/job/quota/clear/', input);
  }

  //job standby-respondents
  getStandbyResByJob(jid) {
    return this._http.get(apiHost + '/api/job/standby-respondents/' + jid);
  }

  //job all-respondents
  getAllResByJob(jid) {
    return this._http.get(apiHost + '/api/job/all-respondents/' + jid);
  }

  getInvoicesByJobId(jid: number) {
    return this._http.get(apiHost + '/api/job/invoices/' + jid);
  }

  //job-durations
  getDurationsByJobId(jobid: number) {
    return this._http.get(apiHost + '/api/job/durations/' + jobid);
  }

  updateDurations(duration, jobid) {
    let input = new FormData();
    var json = JSON.stringify(duration);
    input.append("json", json);
    input.append("jobId", jobid);

    return this._http.post(apiHost + '/api/job/duration/update', input);
  }

  deleteDurations(ids) {
    let input = new FormData();
    var json = JSON.stringify(ids);
    input.append("json", json);

    return this._http.post(apiHost + '/api/job/delete', input);
  }

  deleteJobVenue(ids) {
    let input = new FormData();
    var json = JSON.stringify(ids);
    input.append("json", json);

    return this._http.post(apiHost + '/api/job/venue/delete', input);
  }

  getVenuebyJob(vid) {
    return this._http.get(apiHost + '/api/job/venues/' + vid);
  }

  updateJobVenue(jobvenue) {
    let input = new FormData();
    console.log(jobvenue);
    var json = JSON.stringify(jobvenue);
    input.append("json", json);

    return this._http.post(apiHost + '/api/job/venue/update', input);
  }

  getTotalTrackedTime(jobid) {
    return this._http.get(apiHost + '/api/job/total-time/' + jobid);
  }

  getInvoiceWarningByClient(cid) {
    return this._http.get(apiHost + '/api/quote-invoice-notes/' + cid);
  }

  getInvoicePush(jobid) {
    return this._http.get(apiHost + '/api/job/invoice/push/' + jobid);
  }

  getQueriesByJobId(id: number) {
    return this._http.get(apiHost + '/api/job/queries/' + id);
  }

  deleteInvoice(id: number) {
    console.log(id);
    return this._http.get(apiHost + '/api/job/invoice/delete/' + id);
  }

  deleteQueries(deleteItemIds) {
    let input = new FormData();
    var json = JSON.stringify(deleteItemIds);
    input.append("json", json);

    return this._http.post(apiHost + '/api/job/queries/delete', input);
  }

  getJobsTobeAllocated() {
    return this._http.get(apiHost + '/api/GetJobsTobeAllocated');
  }

  rosterAllocate(ajjobid, ajrecruiter) {
    let input = new FormData();
    input.append("username", ajrecruiter);
    input.append("jobId", ajjobid);

    return this._http.post(apiHost + '/api/job/RosterAllocate', input);
  }

  getUserNotesByUserName(usnStaff: any) {
    return this._http.get(apiHost + '/api/user-notes/' + usnStaff);
  }

  callMyOBAuthentication(jobid) {
    return this._http.get(apiHost + '/api/myob/CallOAuthAuthentication/' + jobid);
  }

  myObPostInvoice(code, state) {
    var input = new FormData();
    input.append("code", code);
    input.append("state", state);
    return this._http.post(apiHost + '/api/myob/post-invoice', input);
  }

  getClientContactJobs(id: any) {
    return this._http.get(apiHost + '/api/client-contact-jobs/' + id);
  }

  getJobPrivateList(id: number) {
    return this._http.get(apiHost + '/api/document/job-private-list/' + id);
  }

  generateLink(provider: string, link: string) {
    var input = new FormData();
    input.append("provider", provider);
    input.append("link", link);
    return this._http.post(apiHost + '/api/job/generatelink', input);
  }

  getAccountingSystemName() {
    return this._http.get(apiHost + '/api/config/getaccountingsystemname');
  }
}