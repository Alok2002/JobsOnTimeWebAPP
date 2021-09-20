import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import 'rxjs';
import { apiHost } from "../app.component";
import { AuthService } from "./auth.services";

@Injectable()
export class SurveyServices {
    constructor(private _http: HttpClient, private authService: AuthService) { }

    getSurveyByJobId(jid) {
        return this._http.get(apiHost + '/api/survey/' + jid);
    }

    updateSurvey(survey) {
        let input = new FormData();
        var json = JSON.stringify(survey);
        input.append("json", json);

        return this._http.post(apiHost + '/api/clientaddress/update', input);
    }

    /*deleteSurvey(ids) {
      let input = new FormData();
      var json = JSON.stringify(ids);
      input.append("json", json);
  
      var headers = new Headers();
      //headers.append('Content-Type', 'application/x-www-form-urlencoded');
      this.authService.createAuthorizationHeader(headers);
  
      return this._http.post(apiHost + '/api/clientaddress/delete', input)
        .map(res => res.json());
    }*/

    deleteSurveyById(id) {
        return this._http.get(apiHost + '/api/survey/delete/' + id);
    }

    getSurveyEventsById(sid) {
        return this._http.get(apiHost + '/api/survey-events/' + sid);
    }

    submitSuerveyQuestions(surveyquestions) {
        var que = { questions: surveyquestions };

        let input = new FormData();
        var json = JSON.stringify(que);
        input.append("json", json);

        return this._http.post(apiHost + '/api/survey-questions/update', input);
    }

    submitSurvey(survey) {
        let input = new FormData();
        var json = JSON.stringify(survey);
        input.append("json", json);

        return this._http.post(apiHost + '/api/survey-detail/update', input);
    }

    getSurveyQuestionsbySurveyId(surveyId) {
        return this._http.get(apiHost + '/api/survey-questions/' + surveyId);
    }

    deletesurveyquestions(id) {
        let input = new FormData();
        input.append("questionId", id);

        return this._http.post(apiHost + '/api/survey-question/delete', input);
    }

    deletesurveyquestionoptions(id) {
        let input = new FormData();
        input.append("optionId", id);

        return this._http.post(apiHost + '/api/survey-option/delete', input);
    }

    getsurveylibraryquestions() {
        return this._http.get(apiHost + '/api/survey-template-questions');
    }

    submitSuerveyAnswers(surveyQuestions, surveyId, respondentId, questionId, isPrevious?) {
        let input = new FormData();
        var json = JSON.stringify({ 'answers': surveyQuestions });
        input.append("json", json);
        input.append("respondentId", respondentId);
        input.append("surveyId", surveyId);
        input.append("questionId", questionId);
        if (!isPrevious) isPrevious = false;
        input.append("isPrevious", isPrevious);

        return this._http.post(apiHost + '/api/survey-answers/update', input);
    }

    getStatsbySurveyId(sid) {
        return this._http.get(apiHost + '/api/survey-stats/' + sid);
    }

    getJobWithSurveyQuestions(jobid) {
        return this._http.get(apiHost + '/api/jobs-with-survey-questions/' + jobid);
    }

    getSurveyQuestionsbyJobId(jobid) {
        return this._http.get(apiHost + '/api/job-survey-questions/' + jobid);
    }

    getSurveysByJobId(jobId: number) {
        return this._http.get(apiHost + '/api/surveys/' + jobId);
    }

    copysurveytoscreener(surveyid: number) {
        return this._http.get(apiHost + '/api/copy-survey-to-screener/' + surveyid);
    }

    getSurveyById(surveyId: number) {
        return this._http.get(apiHost + '/api/survey-detail/' + surveyId);
    }

    getSurveyQuestionAnswers(surveyId, resId) {
        let input = new FormData();
        input.append("surveyId", surveyId);
        input.append("respondentId", resId);

        return this._http.post(apiHost + '/api/survey-questions-answers', input);
    }

    getSurveyQuestionAndAnswers(surveyId, resId) {
        let input = new FormData();
        input.append("surveyId", surveyId);
        input.append("respondentId", resId);

        return this._http.post(apiHost + '/api/survey-questions-and-answers', input);
    }

    getAnswerGrid(surveyid) {
        return this._http.get(apiHost + '/api/survey-questions-all-answers/' + surveyid);
    }

    copysurveytosessionscreener(surveyId, sessionId) {
        let input = new FormData();
        input.append("surveyId", surveyId);
        input.append("sessionId", sessionId);

        return this._http.post(apiHost + '/api/copy-survey-to-session-screener/', input);
    }

    getPublicSurveyDecodedValues(encodeddata) {
        return this._http.get(apiHost + '/api/survey/GetPublicSurveyDecodedValues?encodedData=' + encodeddata);
    }

    getUnsubscribeDecodedValues(encodeddata) {
        return this._http.get(apiHost + '/api/survey/GetUnsubscribeDecodedValues?encodedData=' + encodeddata);
    }

    getClientSurveyDecodedValues(encodeddata) {
        return this._http.get(apiHost + '/api/survey/GetClientSurveyDecodedValues?encodedData=' + encodeddata);
    }

    getScreenerId(jobId, jobgroupid) {
        let input = new FormData();
        input.append("jobId", jobId);
        input.append("jobGroupId", jobgroupid);

        return this._http.post(apiHost + '/api/GetScreenerId', input);
    }

    getSurveyIdScreenerId(jobId, jobgroupid) {
        let input = new FormData();
        input.append("jobId", jobId);
        input.append("jobGroupId", jobgroupid);

        return this._http.post(apiHost + '/api/GetSurveyIdScreenerId', input);
    }

    getScreenerQuestionsAnswers(surveyId, screenerId, resId) {
        console.log(surveyId);
        console.log(screenerId);
        console.log(resId);
        let input = new FormData();
        input.append("surveyId", surveyId);
        input.append("screenerId", screenerId);
        input.append("respondentId", resId);

        return this._http.post(apiHost + '/api/Screener-questions-answers', input);
    }

    getPublicSurveyEncodedValues(resid, jobId) {
        let input = new FormData();
        input.append("jobId", jobId);
        input.append("respondentId", resid);

        console.log(jobId);
        console.log(resid);

        return this._http.post(apiHost + '/api/GetPublicSurveyEncodedValues', input);
    }

    getSurveyQuotas(surveyId, respondentId) {
        let input = new FormData();
        input.append("surveyId", surveyId);
        input.append("respondentId", respondentId);

        return this._http.post(apiHost + '/api/survey/GetSurveyQuotas', input);
    }

    updateSurveyQuotas(surveyId, respondentId, quotas) {
        let input = new FormData();
        input.append("surveyId", surveyId);
        input.append("respondentId", respondentId);

        console.log(quotas);
        input.append("json", JSON.stringify({ quotas: quotas }));

        return this._http.post(apiHost + '/api/survey/UpdateSurveyQuotas', input);
    }

    postsurveythankyou(jid: any, eid: any, sid: any, rid: any) {
        let input = new FormData();
        input.append("jid", jid);
        input.append("eid", eid);
        input.append("sid", sid);
        input.append("rid", rid);

        return this._http.post(apiHost + '/api/surveythankyou', input);
    }

    getSurveyQuestionCategories() {
        return this._http.get(apiHost + '/api/survey-question-categories');
    }

    uploadSurveyFiles(files) {
        let input = new FormData();

        for (var i = 0; i < files.length; i++) {
            input.append('files' + i, files[i]);
        }

        return this._http.post(apiHost + '/api/files/survey-files-upload', input);
    }

    getPrequalSurveyDetails(surveyid, resid) {
        let input = new FormData();
        input.append("surveyId", surveyid);
        input.append("respondentId", resid);

        return this._http.post(apiHost + '/api/prequal-survey-details', input);
    }

    recordThirdPartySurveyClick(jobId, respondentId) {
        let input = new FormData();
        input.append("respid", respondentId);
        input.append("JobId", jobId);

        return this._http.post(apiHost + '/api/event/recordthirdpartysurveyclick', input);
    }

    getFacebookURL() {
        return this._http.get(apiHost + '/api/config/FacebookURL');
    }

    getSystemReferences() {
        return this._http.get(apiHost + '/api/GetSystemReferences');
    }

    declineSurvey(resid, jobid, comment) {
        let input = new FormData();
        input.append("respid", resid);
        input.append("JobId", jobid);
        input.append("comment", comment);

        return this._http.post(apiHost + '/api/event/DeclineSurvey', input);
    }

    postSurveyUpdateProfile(encodedData, email, mobile, postcode) {
        let input = new FormData();
        input.append("encodedData", encodedData);
        input.append("email", email);
        input.append("mobile", mobile);
        input.append("postcode", postcode);

        return this._http.post(apiHost + '/api/respondent/survey-update-profile', input);
    }

    revertChange(encodeddata) {
        return this._http.get(apiHost + '/api/respondent-revert-change?encodedData=' + encodeddata);
    }

    getThankYouPageSign() {
        return this._http.get(apiHost + '/api/config/getthankyoupagesign');
    }

    deleteSurveyAnswerById(said) {
        let input = new FormData();
        input.append("said", said);
        return this._http.post(apiHost + '/api/survey/deleteSurveyAnswerById', input);
    }
}
