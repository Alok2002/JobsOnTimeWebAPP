import { MetaService } from '@ngx-meta/core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiHost } from '../app.component';
import { AuthService } from './auth.services';
import 'rxjs';

@Injectable()
export class SharedServices {
    constructor(private _http: HttpClient, private authService: AuthService,
        private metaService: MetaService) {
    }

    getStateList() {
        return this._http.get(apiHost + '/api/data-provider/GetStatesList');
    }

    getClientCategoryList() {
        return this._http.get(apiHost + '/api/data-provider/GetClientCategoryList');
    }

    getDocumentFields() {
        return this._http.get(apiHost + '/api/data-provider/GetDocumentFields');
    }

    getJobStatusList() {
        return this._http.get(apiHost + '/api/data-provider/GetJobStatusList');
    }

    getdifficultyStatusList() {
        return this._http.get(apiHost + '/api/data-provider/GetJobDifficultyStatusList');
    }

    getJobGroupTypeList() {
        return this._http.get(apiHost + '/api/data-provider/GetJobGroupTypeList');
    }

    getIncentiveTypeList() {
        return this._http.get(apiHost + '/api/data-provider/GetIncentiveTypeList');
    }

    getLocationPostCodes(search) {
        return this._http.get(apiHost + '/api/data-provider/location/' + search);
    }

    getInvoiceStatusList() {
        return this._http.get(apiHost + '/api/data-provider/GetInvoiceStatusList/');
    }

    getQuoteStatusList() {
        return this._http.get(apiHost + '/api/data-provider/GetQuoteStatusList/');
    }

    getClientContactTypeList() {
        return this._http.get(apiHost + '/api/data-provider/GetClientContactTypeList');
    }

    getClientJobContactTypeList() {
        return this._http.get(apiHost + '/api/data-provider/GetClientJobContactTypeList');
    }

    getClientJobGroupContactTypeList() {
        return this._http.get(apiHost + '/api/data-provider/GetClientJobGroupContactTypeList');
    }

    getNotesTypeList() {
        return this._http.get(apiHost + '/api/data-provider/GetNotesTypeList');
    }

    getDocumentActionList() {
        return this._http.get(apiHost + '/api/data-provider/GetDocumentActionList');
    }

    getFeedbackTypeList() {
        return this._http.get(apiHost + '/api/data-provider/GetFeedbackTypeList');
    }

    getFeedbackActionList() {
        return this._http.get(apiHost + '/api/data-provider/GetFeedbackActionList');
    }

    getEmployeePositionList() {
        return this._http.get(apiHost + '/api/data-provider/GetEmployeePositionList');
    }

    getCurrentlyTrackingJob(username) {
        return this._http.get(apiHost + '/api/job/currently-tracking/' + username);
    }

    startTrackingJob(jobid, username) {
        console.log(username);
        console.log(jobid);
        let input = new FormData();
        var json = JSON.stringify({ 'username': username, 'jobid': jobid });
        input.append('json', json);

        return this._http.post(apiHost + '/api/job/start-tracking', input);
    }

    stopTrackingJob(jobid, username) {
        let input = new FormData();
        var json = JSON.stringify({ 'username': username, 'jobid': jobid });
        input.append('json', json);

        return this._http.post(apiHost + '/api/job/stop-tracking', input);
    }

    searchJob(jobnumber) {
        return this._http.get(apiHost + '/api/job-search/' + jobnumber);
    }

    uploadFile(files) {
        let input = new FormData();

        for (var i = 0; i < files.length; i++) {
            input.append('files' + i, files[i]);
        }

        return this._http.post(apiHost + '/api/files/upload', input);
    }

    getFilterCriteria(filter, surveyid?) {
        if (filter == 'clientDocument' || filter == 'jobDocument' || filter == 'clientQuote') filter = 'document';
        if (surveyid != null)
            return this._http.get(apiHost + '/api/' + filter + '/GetFilterItems/' + surveyid);

        else
            return this._http.get(apiHost + '/api/' + filter + '/GetFilterItems');
    }

    getFilterCompareMethods() {
        return this._http.get(apiHost + '/api/query/GetComparisonMethods');
    }

    getFilterItemList(entity, caption, id?) {
        let input = new FormData();
        //input.append("entity", entity);
        input.append('filter', caption);
        if (id != null)
            input.append('extraId', id);
        else
            input.append('extraId', '0');

        if (entity == 'clientDocument') {
            input.append('parentId', id);
            input.append('parentTableName', 'Client');
            input.append('entity', 'document');
            entity = 'document';
        }

        if (entity == 'jobDocument') {
            input.append('entity', 'document');
            input.append('parentTableName', 'ClientJob');
            input.append('parentId', id);
            entity = 'document';
        }

        return this._http.post(apiHost + '/api/' + entity + '/GetFilterItemOptions', input);
    }

    /*ilterSubmit(filters) {
      let input = new FormData();
  
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
  
      var headers = new Headers();
      
  
      return this._http.post('http://localhost:56477/api/query/get-result', input);
        
    }*/

    getDataWithFilter(params, dbmodel, maxrecords, filters, entity, id) {
        let input = new FormData();
        var json = JSON.stringify(params);
        var dbmodeljson = JSON.stringify({ 'dbmodel': dbmodel });
        input.append('dtparams', json);
        input.append('dbmodel', dbmodeljson);
        input.append('entity', entity);
        input.append('maxrecords', maxrecords);

        if (entity == 'client-notes' || entity == 'feedback')
            input.append('clientId', id);
        if (entity == 'clientJobTimeAllocation' || entity == 'jobgroup')
            input.append('jobId', id);

        if (entity == 'clientDocument') {
            input.append('parentId', id);
            input.append('parentTableName', 'Client');
            input.append('entity', 'document');
            entity = 'document';
        }

        if (entity == 'clientQuote') {
            input.append('parentId', id);
            input.append('parentTableName', 'ClientQuotes');
            input.append('entity', 'document');
            entity = 'document';
        }

        if (entity == 'jobDocument') {
            input.append('entity', 'document');
            input.append('parentTableName', 'ClientJob');
            input.append('parentId', id);
            entity = 'document';
        }

        if (entity == 'respondentEvent' || entity == 'jobAllRespondents' || entity == 'jobStandbyRespondents' || entity == 'jobPotentialRespondents'
            || entity == 'sessionQualifiedRespondents' || entity == 'sessionStandbyRespondents' || entity == 'sessionPotentialRespondents' || entity == 'sessionAllRespondents' ||
            entity == 'respondentPayments' || entity == 'surveyEvents' || entity == 'screenerEvents' || entity == 'searchEvents') {

            if (entity == 'respondentEvent')
                input.append('module', 'RespondentEvent');
            if (entity == 'jobAllRespondents')
                input.append('module', 'Job All Respondents');
            if (entity == 'jobStandbyRespondents')
                input.append('module', 'Job Standby Respondents');
            if (entity == 'jobPotentialRespondents')
                input.append('module', 'Job Potential Respondents');
            if (entity == 'sessionQualifiedRespondents')
                input.append('module', 'Session Qualified Respondents');
            if (entity == 'sessionStandbyRespondents')
                input.append('module', 'Session Standby Respondents');
            if (entity == 'sessionPotentialRespondents')
                input.append('module', 'Session Potential Respondents');
            if (entity == 'sessionAllRespondents')
                input.append('module', 'Session All Respondents');
            if (entity == 'respondentPayments')
                input.append('module', 'Respondent Payments');
            if (entity == 'surveyEvents')
                input.append('module', 'Survey Events');
            if (entity == 'screenerEvents')
                input.append('module', 'Screener Events');
            if (entity == 'searchEvents')
                input.append('module', 'Search Events');

            input.append('id', id);
            entity = 'event';
        }

        if (entity == 'ClientJobSurvey' || entity == 'job') input.append('id', id);
        if (entity == 'searchArchivedEvents') {
            input.append('id', id);
            input.append('module', 'Search Archived Events');
            entity = 'event-archive';
        }

        if (filters)
            //FILTERS
            filters.forEach((ele, i) => {
                switch (ele.type) {
                    case 'Text':
                        var key = ele.caption + '|' + i + '|comparisonDropDown';
                        var key1 = ele.caption + '|' + i + '|groupDropDown';
                        var key2 = ele.caption + '|' + i + '|text1';

                        input.append(key, ele.comparison);
                        input.append(key1, ele.color);
                        input.append(key2, ele.value1);
                        break;
                    case 'Password':
                        var key = ele.caption + '|' + i + '|comparisonDropDown';
                        var key1 = ele.caption + '|' + i + '|groupDropDown';
                        var key2 = ele.caption + '|' + i + '|text1';

                        input.append(key, ele.comparison);
                        input.append(key1, ele.color);
                        input.append(key2, ele.value1);
                        break;
                    case 'DropDown':
                        var key = ele.caption + '|' + i + '|comparisonDropDown';
                        var key1 = ele.caption + '|' + i + '|groupDropDown';
                        var key2 = ele.caption + '|' + i + '|dropDown';

                        input.append(key, ele.comparison);
                        input.append(key1, ele.color);
                        input.append(key2, ele.value1);
                        break;
                    case 'Option':
                        var key = ele.caption + '|' + i + '|comparisonDropDown';
                        var key1 = ele.caption + '|' + i + '|groupDropDown';
                        var key2 = ele.caption + '|' + i + '|checked';

                        input.append(key, ele.comparison);
                        input.append(key1, ele.color);
                        input.append(key2, ele.value1);
                        break;

                    case 'DoubleText':
                        console.log(ele);
                        var key = ele.caption + '|' + i + '|comparisonDropDown';
                        var key1 = ele.caption + '|' + i + '|groupDropDown';
                        var key2 = ele.caption + '|' + i + '|text1';
                        var key3 = ele.caption + '|' + i + '|text2';

                        input.append(key, ele.comparison);
                        input.append(key1, ele.color);
                        input.append(key2, ele.value1);
                        input.append(key3, ele.value2);
                        break;

                    case 'Date':
                        var key = ele.caption + '|' + i + '|comparisonDropDown';
                        var key1 = ele.caption + '|' + i + '|groupDropDown';
                        var key2 = ele.caption + '|' + i + '|date1';
                        var key3 = ele.caption + '|' + i + '|date2';

                        input.append(key, ele.comparison);
                        input.append(key1, ele.color);
                        input.append(key2, ele.value1);
                        input.append(key3, ele.value2);
                        break;

                    case 'ClientJobGroupEvent':
                        var key = ele.caption + '|' + i + '|comparisonDropDown';
                        var key1 = ele.caption + '|' + i + '|groupDropDown';
                        var key2 = ele.caption + '|' + i + '|client';
                        var key3 = ele.caption + '|' + i + '|job';
                        var key4 = ele.caption + '|' + i + '|group';
                        var key5 = ele.caption + '|' + i + '|event';
                        var key6 = ele.caption + '|' + i + '|date1';
                        var key7 = ele.caption + '|' + i + '|date2';
                        var key8 = ele.caption + '|' + i + '|userName';

                        input.append(key, ele.comparison);
                        input.append(key1, ele.color);
                        input.append(key2, ele.value1);
                        input.append(key3, ele.value2);
                        input.append(key4, ele.value3);
                        input.append(key5, ele.value4);
                        input.append(key6, ele.value5);
                        input.append(key7, ele.value6);
                        input.append(key8, ele.value7);
                        break;

                    default:
                        break;
                }
            });

        return this._http.post(apiHost + '/api/' + entity + '/GetQueryResults', input);
    }

    getDefaultFilter(entity, isMobile?) {
        if (entity == 'clientDocument' || entity == 'jobDocument' || entity == 'clientQuote') entity = 'document';
        if (isMobile)
            return this._http.get(apiHost + '/api/' + entity + '/GetDefaultMobileFilterItems');
        else
            return this._http.get(apiHost + '/api/' + entity + '/GetDefaultFilterItems');
    }

    getExistingFilter(entity, fid) {
        if (entity == 'clientDocument' || entity == 'jobDocument' || entity == 'clientQuote') {
            entity = 'document';
        }
        return this._http.get(apiHost + '/api/' + entity + '/GetExistingQueryFilterItems/' + fid);
    }

    getExistingQueryList(entity, jobid) {
        console.log(jobid);
        /*let input = new FormData();
        input.append('entity', entity);
        input.append('jobId', jobid);*/
        if (!jobid) jobid = null;

        if (entity == 'clientDocument' || entity == 'jobDocument' || entity == 'clientQuote') entity = 'document';
        var url = apiHost + '/api/' + entity + '/GetExistingQuerys/' + jobid;

        /*return this._http.post(apiHost + '/api/query/GetExistingQuerys', input);
          */
        return this._http.get(url);
    }

    saveQuery(entity, saveForCurrentJob, lastUrlSegment, filterSaveName, filters, surveyid?) {
        console.log(entity);
        let input = new FormData();
        //input.append("entity", entity);
        input.append('saveForCurrentJob', saveForCurrentJob);
        input.append('lastUrlSegment', lastUrlSegment);
        input.append('filterSaveName', filterSaveName);
        input.append('surveyid', surveyid);

        if (entity == 'clientDocument') {
            input.append('parentTableName', 'Client');
            input.append('entity', 'document');
            entity = 'document';
        }

        if (entity == 'jobDocument') {
            input.append('entity', 'document');
            input.append('parentTableName', 'ClientJob');
            entity = 'document';
        }

        console.log(filters);
        debugger
        if (filters) {
            filters.forEach((ele, i) => {
                switch (ele.type) {
                    case 'Text':
                        var key = ele.caption + '|' + i + '|comparisonDropDown';
                        var key1 = ele.caption + '|' + i + '|groupDropDown';
                        var key2 = ele.caption + '|' + i + '|text1';

                        input.append(key, ele.comparison);
                        input.append(key1, ele.color);
                        input.append(key2, ele.value1);
                        break;
                    case 'Password':
                        var key = ele.caption + '|' + i + '|comparisonDropDown';
                        var key1 = ele.caption + '|' + i + '|groupDropDown';
                        var key2 = ele.caption + '|' + i + '|text1';

                        input.append(key, ele.comparison);
                        input.append(key1, ele.color);
                        input.append(key2, ele.value1);
                        break;
                    case 'DropDown':
                        var key = ele.caption + '|' + i + '|comparisonDropDown';
                        var key1 = ele.caption + '|' + i + '|groupDropDown';
                        var key2 = ele.caption + '|' + i + '|dropDown';

                        input.append(key, ele.comparison);
                        input.append(key1, ele.color);
                        input.append(key2, ele.value1);
                        break;
                    case 'Option':
                        var key = ele.caption + '|' + i + '|comparisonDropDown';
                        var key1 = ele.caption + '|' + i + '|groupDropDown';
                        var key2 = ele.caption + '|' + i + '|checked';

                        input.append(key, ele.comparison);
                        input.append(key1, ele.color);
                        input.append(key2, ele.value1);
                        break;

                    case 'DoubleText':
                        console.log(ele);
                        var key = ele.caption + '|' + i + '|comparisonDropDown';
                        var key1 = ele.caption + '|' + i + '|groupDropDown';
                        var key2 = ele.caption + '|' + i + '|text1';
                        var key3 = ele.caption + '|' + i + '|text2';

                        input.append(key, ele.comparison);
                        input.append(key1, ele.color);
                        input.append(key2, ele.value1);
                        input.append(key3, ele.value2);
                        break;

                    case 'Date':
                        var key = ele.caption + '|' + i + '|comparisonDropDown';
                        var key1 = ele.caption + '|' + i + '|groupDropDown';
                        var key2 = ele.caption + '|' + i + '|date1';
                        var key3 = ele.caption + '|' + i + '|date2';

                        input.append(key, ele.comparison);
                        input.append(key1, ele.color);
                        input.append(key2, ele.value1);
                        input.append(key3, ele.value2);
                        break;

                    case 'ClientJobGroupEvent':
                        var key = ele.caption + '|' + i + '|comparisonDropDown';
                        var key1 = ele.caption + '|' + i + '|groupDropDown';
                        var key2 = ele.caption + '|' + i + '|client';
                        var key3 = ele.caption + '|' + i + '|job';
                        var key4 = ele.caption + '|' + i + '|group';
                        var key5 = ele.caption + '|' + i + '|event';
                        var key6 = ele.caption + '|' + i + '|date1';
                        var key7 = ele.caption + '|' + i + '|date2';
                        var key8 = ele.caption + '|' + i + '|userName';

                        input.append(key, ele.comparison);
                        input.append(key1, ele.color);
                        input.append(key2, ele.value1);
                        input.append(key3, ele.value2);
                        input.append(key4, ele.value3);
                        input.append(key5, ele.value4);
                        input.append(key6, ele.value5);
                        input.append(key7, ele.value6);
                        input.append(key8, ele.value7);
                        break;

                    default:
                        break;
                }
            });
        }

        return this._http.post(apiHost + '/api/' + entity + '/SaveQuery', input);
    }

    getStates() {
        return this._http.get(apiHost + '/api/states');
    }

    getReferenceDataProvider(data) {
        let input = new FormData();
        input.append('type', data);
        input.append('respId', '0');

        return this._http.post(apiHost + '/api/reference-data-provider/', input);
    }

    checkPermission(data) {
        return this._http.get(apiHost + '/api/delete-allowed/' + data);
    }

    downloadDocument(id) {
        this._http.get(apiHost + '/api/download-document/' + id)
            .subscribe((data: any) => this.downloadFile(data)),//console.log(data),
            error => console.log('Error downloading the file.'),
            () => console.info('OK');
    }

    downloadFile(data) {
        console.log(data);
        data = data['_body'];
        var blob = new Blob([data], { type: '*/*' });
        var url = window.URL.createObjectURL(blob);
        window.open(url);
    }

    sendEmail(email) {
        let input = new FormData();
        input.append('json', email);
        return this._http.post(apiHost + '/api/send-email', input);
    }

    sendSms(sms) {
        let input = new FormData();
        input.append('json', sms);

        return this._http.post(apiHost + '/api/send-sms', input);
    }

    GetProfileUpdateEmailTemplate() {
        return this._http.get(apiHost + '/api/emailtemplate/GetProfileUpdateEmailTemplate');
    }

    GetProfileUpdateSmsTemplate() {
        return this._http.get(apiHost + '/api/smstemplate/GetProfileUpdateSmsTemplate');
    }

    GetGenderList() {
        return this._http.get(apiHost + '/api/public-data-provider/GetGenderList');
    }

    GetYearList() {
        return this._http.get(apiHost + '/api/public-data-provider/GetYearList');
    }

    GetMonthList() {
        return this._http.get(apiHost + '/api/data-provider/GetMonthList');
    }

    // downloadSessionDocumnet(cat: any, deleteItemIds: any[]) {
    //   let input = new FormData();
    //   var json = JSON.stringify(deleteItemIds);
    //   input.append("json", json);
    //
    //   var headers = new Headers();
    //   //headers.append('Content-Type', 'application/x-www-form-urlencoded');
    //   
    //
    //   return this._http.post(apiHost + '/api/' + cat, input, {headers: headers})
    //     //
    //     .subscribe(data => this.downloadFile(data)),//console.log(data),
    //     error => console.log('Error downloading the file.'),
    //     () => console.info('OK');
    // }

    /*checkFileExists(url) {
        this._http.get(url)
            .subscribe((response: any) => response.status)
            .catch((error) => Observable.of(error.status || 404))
            .subscribe((status) => console.log(`status = ${status}`));
    }*/

    getAllMangeEmails() {
        return this._http.get(apiHost + '/api/emailsenders');
    }

    postMangeEmail(manageemails) {
        let input = new FormData();
        var json = JSON.stringify(manageemails);
        input.append("json", json);

        return this._http.post(apiHost + '/api/emailsender/update', input);
    }

    deleteMangeEmails(ids) {
        let input = new FormData();
        var json = JSON.stringify(ids);
        input.append("json", json);

        return this._http.post(apiHost + '/api/emailsender/delete', input);
    }

    logOut(token, ipAddress) {
        let input = new FormData();
        input.append("token", token);
        input.append("ipaddress", ipAddress);

        return this._http.post(apiHost + '/api/logout', input);
    }

    bulkEmailSMSUpdate(newBulkEmailSms) {
        let input = new FormData();
        var json = JSON.stringify(newBulkEmailSms);
        input.append("json", json);

        return this._http.post(apiHost + '/api/BulkEmailSMSUpdate', input);
    }

    getQueryResultsIds(params, dbmodel, maxrecords, filters, entity, id) {
        var input = new FormData();
        var json = JSON.stringify(params);
        var dbmodeljson = JSON.stringify({ 'dbmodel': dbmodel });
        input.append('dtparams', json);
        input.append('dbmodel', dbmodeljson);
        input.append('entity', entity);
        input.append('maxrecords', maxrecords);
        input.append('allresults', "true");

        if (filters)
            //FILTERS
            filters.forEach((ele, i) => {
                switch (ele.type) {
                    case 'Text':
                        var key = ele.caption + '|' + i + '|comparisonDropDown';
                        var key1 = ele.caption + '|' + i + '|groupDropDown';
                        var key2 = ele.caption + '|' + i + '|text1';

                        input.append(key, ele.comparison);
                        input.append(key1, ele.color);
                        input.append(key2, ele.value1);
                        break;
                    case 'Password':
                        var key = ele.caption + '|' + i + '|comparisonDropDown';
                        var key1 = ele.caption + '|' + i + '|groupDropDown';
                        var key2 = ele.caption + '|' + i + '|text1';

                        input.append(key, ele.comparison);
                        input.append(key1, ele.color);
                        input.append(key2, ele.value1);
                        break;
                    case 'DropDown':
                        var key = ele.caption + '|' + i + '|comparisonDropDown';
                        var key1 = ele.caption + '|' + i + '|groupDropDown';
                        var key2 = ele.caption + '|' + i + '|dropDown';

                        input.append(key, ele.comparison);
                        input.append(key1, ele.color);
                        input.append(key2, ele.value1);
                        break;
                    case 'Option':
                        var key = ele.caption + '|' + i + '|comparisonDropDown';
                        var key1 = ele.caption + '|' + i + '|groupDropDown';
                        var key2 = ele.caption + '|' + i + '|checked';

                        input.append(key, ele.comparison);
                        input.append(key1, ele.color);
                        input.append(key2, ele.value1);
                        break;

                    case 'DoubleText':
                        console.log(ele);
                        var key = ele.caption + '|' + i + '|comparisonDropDown';
                        var key1 = ele.caption + '|' + i + '|groupDropDown';
                        var key2 = ele.caption + '|' + i + '|text1';
                        var key3 = ele.caption + '|' + i + '|text2';

                        input.append(key, ele.comparison);
                        input.append(key1, ele.color);
                        input.append(key2, ele.value1);
                        input.append(key3, ele.value2);
                        break;

                    case 'Date':
                        var key = ele.caption + '|' + i + '|comparisonDropDown';
                        var key1 = ele.caption + '|' + i + '|groupDropDown';
                        var key2 = ele.caption + '|' + i + '|date1';
                        var key3 = ele.caption + '|' + i + '|date2';

                        input.append(key, ele.comparison);
                        input.append(key1, ele.color);
                        input.append(key2, ele.value1);
                        input.append(key3, ele.value2);
                        break;

                    case 'ClientJobGroupEvent':
                        var key = ele.caption + '|' + i + '|comparisonDropDown';
                        var key1 = ele.caption + '|' + i + '|groupDropDown';
                        var key2 = ele.caption + '|' + i + '|client';
                        var key3 = ele.caption + '|' + i + '|job';
                        var key4 = ele.caption + '|' + i + '|group';
                        var key5 = ele.caption + '|' + i + '|event';
                        var key6 = ele.caption + '|' + i + '|date1';
                        var key7 = ele.caption + '|' + i + '|date2';
                        var key8 = ele.caption + '|' + i + '|userName';

                        input.append(key, ele.comparison);
                        input.append(key1, ele.color);
                        input.append(key2, ele.value1);
                        input.append(key3, ele.value2);
                        input.append(key4, ele.value3);
                        input.append(key5, ele.value4);
                        input.append(key6, ele.value5);
                        input.append(key7, ele.value6);
                        input.append(key8, ele.value7);
                        break;

                    default:
                        break;
                }
            });

        return this._http.post(apiHost + '/api/' + entity + '/GetQueryResultsIds', input);
    }

    getQueryResultsExport(params, dbmodel, maxrecords, filters, entity, id) {
        var input = new FormData();
        var json = JSON.stringify(params);
        var dbmodeljson = JSON.stringify({ 'dbmodel': dbmodel });
        input.append('dtparams', json);
        input.append('dbmodel', dbmodeljson);
        input.append('entity', entity);
        input.append('maxrecords', maxrecords);
        input.append('allresults', "true");

        if (filters) {
            //FILTERS
            filters.forEach((ele, i) => {
                switch (ele.type) {
                    case 'Text':
                        var key = ele.caption + '|' + i + '|comparisonDropDown';
                        var key1 = ele.caption + '|' + i + '|groupDropDown';
                        var key2 = ele.caption + '|' + i + '|text1';

                        input.append(key, ele.comparison);
                        input.append(key1, ele.color);
                        input.append(key2, ele.value1);
                        break;
                    case 'Password':
                        var key = ele.caption + '|' + i + '|comparisonDropDown';
                        var key1 = ele.caption + '|' + i + '|groupDropDown';
                        var key2 = ele.caption + '|' + i + '|text1';

                        input.append(key, ele.comparison);
                        input.append(key1, ele.color);
                        input.append(key2, ele.value1);
                        break;
                    case 'DropDown':
                        var key = ele.caption + '|' + i + '|comparisonDropDown';
                        var key1 = ele.caption + '|' + i + '|groupDropDown';
                        var key2 = ele.caption + '|' + i + '|dropDown';

                        input.append(key, ele.comparison);
                        input.append(key1, ele.color);
                        input.append(key2, ele.value1);
                        break;
                    case 'Option':
                        var key = ele.caption + '|' + i + '|comparisonDropDown';
                        var key1 = ele.caption + '|' + i + '|groupDropDown';
                        var key2 = ele.caption + '|' + i + '|checked';

                        input.append(key, ele.comparison);
                        input.append(key1, ele.color);
                        input.append(key2, ele.value1);
                        break;

                    case 'DoubleText':
                        console.log(ele);
                        var key = ele.caption + '|' + i + '|comparisonDropDown';
                        var key1 = ele.caption + '|' + i + '|groupDropDown';
                        var key2 = ele.caption + '|' + i + '|text1';
                        var key3 = ele.caption + '|' + i + '|text2';

                        input.append(key, ele.comparison);
                        input.append(key1, ele.color);
                        input.append(key2, ele.value1);
                        input.append(key3, ele.value2);
                        break;

                    case 'Date':
                        var key = ele.caption + '|' + i + '|comparisonDropDown';
                        var key1 = ele.caption + '|' + i + '|groupDropDown';
                        var key2 = ele.caption + '|' + i + '|date1';
                        var key3 = ele.caption + '|' + i + '|date2';

                        input.append(key, ele.comparison);
                        input.append(key1, ele.color);
                        input.append(key2, ele.value1);
                        input.append(key3, ele.value2);
                        break;

                    case 'ClientJobGroupEvent':
                        var key = ele.caption + '|' + i + '|comparisonDropDown';
                        var key1 = ele.caption + '|' + i + '|groupDropDown';
                        var key2 = ele.caption + '|' + i + '|client';
                        var key3 = ele.caption + '|' + i + '|job';
                        var key4 = ele.caption + '|' + i + '|group';
                        var key5 = ele.caption + '|' + i + '|event';
                        var key6 = ele.caption + '|' + i + '|date1';
                        var key7 = ele.caption + '|' + i + '|date2';
                        var key8 = ele.caption + '|' + i + '|userName';

                        input.append(key, ele.comparison);
                        input.append(key1, ele.color);
                        input.append(key2, ele.value1);
                        input.append(key3, ele.value2);
                        input.append(key4, ele.value3);
                        input.append(key5, ele.value4);
                        input.append(key6, ele.value5);
                        input.append(key7, ele.value6);
                        input.append(key8, ele.value7);
                        break;

                    default:
                        break;
                }
            });
        }

        if (entity == 'ClientJobSurvey' || entity == 'job') input.append('id', id);

        return this._http.post(apiHost + '/api/' + entity + '/GetQueryResultsExport', input, { responseType: 'blob' });
    }

    getWebsiteCopies() {
        return this._http.get(apiHost + '/api/GetWebsiteCopies');
    }

    getCompanyShortName() {
        return this._http.get(apiHost + '/api/config/getcompanyshortname');
    }

    getIsPointsAllowed() {
        return this._http.get(apiHost + '/api/config/IsPointsAllowed');
    }

    getIsFarronResearch() {
        return this._http.get(apiHost + '/api/config/IsFarronResearch');
    }

    getAllPrivateList() {
        return this._http.get(apiHost + '/api/respondentlists');
    }

    getPrivateListById(id) {
        return this._http.get(apiHost + '/api/respondentlist/' + id);
    }

    updatePrivateList(pl) {
        let input = new FormData();
        var json = JSON.stringify(pl);
        input.append("json", json);

        return this._http.post(apiHost + '/api/respondentlist/update', input);
    }

    deleteprivatelist(deleteItemIds) {
        let input = new FormData();
        var json = JSON.stringify(deleteItemIds);
        input.append("json", json);

        return this._http.post(apiHost + '/api/respondentlist/delete', input);
    }

    getCountryCode() {
        return this._http.get(apiHost + '/api/config/getcountrycode');
    }

    getIsBusinessPanelAllowed() {
        return this._http.get(apiHost + '/api/config/IsBusinessPanelAllowed');
    }

    getIsDisabilityPanelAllowed() {
        return this._http.get(apiHost + '/api/config/IsDisabilityPanelAllowed');
    }

    getJobSurveyDetails(id: any) {
        return this._http.get(apiHost + '/api/job-survey-stats/' + id);
    }

    getSurveyProvidersList() {
        return this._http.get(apiHost + '/api/data-provider/GetSurveyProvidersList');
    }

    uploadPrivateListFiles(files, listid) {
        let input = new FormData();

        for (var i = 0; i < files.length; i++) {
            input.append('files' + i, files[i]);
        }
        input.append("listId", listid);

        return this._http.post(apiHost + '/api/respondentlist/upload', input);
    }

    downloadPrivateList(id) {
        return this._http.get(apiHost + '/api/respondentlist-export/' + id, { responseType: 'blob' });
    }

    getPrivateListSampleFile() {
        return this._http.get(apiHost + '/api/config/GetSampleListFile');
    }

    getSurveyLandingValues(encodeddata: string) {
        return this._http.get(apiHost + '/api/survey/GetSurveyLandingValues?encodedData=' + encodeddata);
    }

    getSurveyWelcomeValues(encodeddata: string) {
        return this._http.get(apiHost + '/api/survey/GetSurveyWelcomeValues?encodedData=' + encodeddata);
    }

    getWorkingHours(username: string) {
        return this._http.get(apiHost + '/api/GetWorkingHours/' + username);
    }

    updateClockOn(username: string) {
        return this._http.get(apiHost + '/api/ClockOn/' + username);
    }

    updateClockOff(username: string) {
        return this._http.get(apiHost + '/api/ClockOff/' + username);
    }

    getTermsUrl() {
        return this._http.get(apiHost + '/api/config/TermsUrl');
    }

    getQueryResultsRawDataExport(params, dbmodel, maxrecords, filters, entity, id) {
        var input = new FormData();
        var json = JSON.stringify(params);
        var dbmodeljson = JSON.stringify({ 'dbmodel': dbmodel });
        input.append('dtparams', json);
        input.append('dbmodel', dbmodeljson);
        input.append('entity', entity);
        input.append('maxrecords', maxrecords);
        input.append('allresults', "true");

        if (filters) {
            //FILTERS
            filters.forEach((ele, i) => {
                switch (ele.type) {
                    case 'Text':
                        var key = ele.caption + '|' + i + '|comparisonDropDown';
                        var key1 = ele.caption + '|' + i + '|groupDropDown';
                        var key2 = ele.caption + '|' + i + '|text1';

                        input.append(key, ele.comparison);
                        input.append(key1, ele.color);
                        input.append(key2, ele.value1);
                        break;
                    case 'Password':
                        var key = ele.caption + '|' + i + '|comparisonDropDown';
                        var key1 = ele.caption + '|' + i + '|groupDropDown';
                        var key2 = ele.caption + '|' + i + '|text1';

                        input.append(key, ele.comparison);
                        input.append(key1, ele.color);
                        input.append(key2, ele.value1);
                        break;
                    case 'DropDown':
                        var key = ele.caption + '|' + i + '|comparisonDropDown';
                        var key1 = ele.caption + '|' + i + '|groupDropDown';
                        var key2 = ele.caption + '|' + i + '|dropDown';

                        input.append(key, ele.comparison);
                        input.append(key1, ele.color);
                        input.append(key2, ele.value1);
                        break;
                    case 'Option':
                        var key = ele.caption + '|' + i + '|comparisonDropDown';
                        var key1 = ele.caption + '|' + i + '|groupDropDown';
                        var key2 = ele.caption + '|' + i + '|checked';

                        input.append(key, ele.comparison);
                        input.append(key1, ele.color);
                        input.append(key2, ele.value1);
                        break;

                    case 'DoubleText':
                        console.log(ele);
                        var key = ele.caption + '|' + i + '|comparisonDropDown';
                        var key1 = ele.caption + '|' + i + '|groupDropDown';
                        var key2 = ele.caption + '|' + i + '|text1';
                        var key3 = ele.caption + '|' + i + '|text2';

                        input.append(key, ele.comparison);
                        input.append(key1, ele.color);
                        input.append(key2, ele.value1);
                        input.append(key3, ele.value2);
                        break;

                    case 'Date':
                        var key = ele.caption + '|' + i + '|comparisonDropDown';
                        var key1 = ele.caption + '|' + i + '|groupDropDown';
                        var key2 = ele.caption + '|' + i + '|date1';
                        var key3 = ele.caption + '|' + i + '|date2';

                        input.append(key, ele.comparison);
                        input.append(key1, ele.color);
                        input.append(key2, ele.value1);
                        input.append(key3, ele.value2);
                        break;

                    case 'ClientJobGroupEvent':
                        var key = ele.caption + '|' + i + '|comparisonDropDown';
                        var key1 = ele.caption + '|' + i + '|groupDropDown';
                        var key2 = ele.caption + '|' + i + '|client';
                        var key3 = ele.caption + '|' + i + '|job';
                        var key4 = ele.caption + '|' + i + '|group';
                        var key5 = ele.caption + '|' + i + '|event';
                        var key6 = ele.caption + '|' + i + '|date1';
                        var key7 = ele.caption + '|' + i + '|date2';
                        var key8 = ele.caption + '|' + i + '|userName';

                        input.append(key, ele.comparison);
                        input.append(key1, ele.color);
                        input.append(key2, ele.value1);
                        input.append(key3, ele.value2);
                        input.append(key4, ele.value3);
                        input.append(key5, ele.value4);
                        input.append(key6, ele.value5);
                        input.append(key7, ele.value6);
                        input.append(key8, ele.value7);
                        break;

                    default:
                        break;
                }
            });
        }

        if (entity == 'ClientJobSurvey' || entity == 'job') input.append('id', id);

        return this._http.post(apiHost + '/api/' + entity + '/GetQueryResultsRawDataExport', input, { responseType: 'blob' });
    }

    getQueryResultsDataExport(params, dbmodel, maxrecords, filters, entity, id) {
        var input = new FormData();
        var json = JSON.stringify(params);
        var dbmodeljson = JSON.stringify({ 'dbmodel': dbmodel });
        input.append('dtparams', json);
        input.append('dbmodel', dbmodeljson);
        input.append('entity', entity);
        input.append('maxrecords', maxrecords);
        input.append('allresults', "true");

        if (filters) {
            //FILTERS
            filters.forEach((ele, i) => {
                switch (ele.type) {
                    case 'Text':
                        var key = ele.caption + '|' + i + '|comparisonDropDown';
                        var key1 = ele.caption + '|' + i + '|groupDropDown';
                        var key2 = ele.caption + '|' + i + '|text1';

                        input.append(key, ele.comparison);
                        input.append(key1, ele.color);
                        input.append(key2, ele.value1);
                        break;
                    case 'Password':
                        var key = ele.caption + '|' + i + '|comparisonDropDown';
                        var key1 = ele.caption + '|' + i + '|groupDropDown';
                        var key2 = ele.caption + '|' + i + '|text1';

                        input.append(key, ele.comparison);
                        input.append(key1, ele.color);
                        input.append(key2, ele.value1);
                        break;
                    case 'DropDown':
                        var key = ele.caption + '|' + i + '|comparisonDropDown';
                        var key1 = ele.caption + '|' + i + '|groupDropDown';
                        var key2 = ele.caption + '|' + i + '|dropDown';

                        input.append(key, ele.comparison);
                        input.append(key1, ele.color);
                        input.append(key2, ele.value1);
                        break;
                    case 'Option':
                        var key = ele.caption + '|' + i + '|comparisonDropDown';
                        var key1 = ele.caption + '|' + i + '|groupDropDown';
                        var key2 = ele.caption + '|' + i + '|checked';

                        input.append(key, ele.comparison);
                        input.append(key1, ele.color);
                        input.append(key2, ele.value1);
                        break;

                    case 'DoubleText':
                        console.log(ele);
                        var key = ele.caption + '|' + i + '|comparisonDropDown';
                        var key1 = ele.caption + '|' + i + '|groupDropDown';
                        var key2 = ele.caption + '|' + i + '|text1';
                        var key3 = ele.caption + '|' + i + '|text2';

                        input.append(key, ele.comparison);
                        input.append(key1, ele.color);
                        input.append(key2, ele.value1);
                        input.append(key3, ele.value2);
                        break;

                    case 'Date':
                        var key = ele.caption + '|' + i + '|comparisonDropDown';
                        var key1 = ele.caption + '|' + i + '|groupDropDown';
                        var key2 = ele.caption + '|' + i + '|date1';
                        var key3 = ele.caption + '|' + i + '|date2';

                        input.append(key, ele.comparison);
                        input.append(key1, ele.color);
                        input.append(key2, ele.value1);
                        input.append(key3, ele.value2);
                        break;

                    case 'ClientJobGroupEvent':
                        var key = ele.caption + '|' + i + '|comparisonDropDown';
                        var key1 = ele.caption + '|' + i + '|groupDropDown';
                        var key2 = ele.caption + '|' + i + '|client';
                        var key3 = ele.caption + '|' + i + '|job';
                        var key4 = ele.caption + '|' + i + '|group';
                        var key5 = ele.caption + '|' + i + '|event';
                        var key6 = ele.caption + '|' + i + '|date1';
                        var key7 = ele.caption + '|' + i + '|date2';
                        var key8 = ele.caption + '|' + i + '|userName';

                        input.append(key, ele.comparison);
                        input.append(key1, ele.color);
                        input.append(key2, ele.value1);
                        input.append(key3, ele.value2);
                        input.append(key4, ele.value3);
                        input.append(key5, ele.value4);
                        input.append(key6, ele.value5);
                        input.append(key7, ele.value6);
                        input.append(key8, ele.value7);
                        break;

                    default:
                        break;
                }
            });
        }

        if (entity == 'ClientJobSurvey' || entity == 'job') input.append('id', id);

        return this._http.post(apiHost + '/api/' + entity + '/GetQueryResultsDataExport', input, { responseType: 'blob' });
    }

    isAttendanceAlertEnabled() {
        return this._http.get(apiHost + '/api/config/IsAttendanceAlertEnabled');
    }
}