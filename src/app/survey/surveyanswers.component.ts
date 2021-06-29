import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';

import { Incentive } from '../models/incentive';
import { Job } from '../models/job';
import { JobQuota } from '../models/jobquota';
import { ResEvent } from '../models/resevent';
import { Session } from '../models/session';
import { SessionTime } from '../models/sessiontime';
import { Survey } from '../models/survey';
import { SurveyAnswers } from '../models/surveyanswers';
import { SurveyQuestions } from '../models/surveyquestions';
import { RespondentServices } from '../services/respondent.services';
import { SessionServices } from '../services/session.services';
import { SurveyServices } from '../services/survey.services';
import { JobServices } from '../services/job.services';
import * as moment from 'moment';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'SurveyAnswers',
  templateUrl: './surveyanswers.component.html'
})

export class SurveyAnswersComponent implements OnInit {
  surveyid: number;
  resid: number;
  isLoading = true;
  surveyQuestions: Array<SurveyQuestions>;
  selectedIndex = 0;

  matrixContent = [];
  matrixKey = [];

  survey: Survey;

  screenerId: number;
  isScreen: boolean;
  finishSurvey = false;
  jobid: number;
  jobsessions: Array<Session> = [];
  incentives: Array<Incentive> = [];
  sessiontimes: Array<SessionTime> = [];
  jobQuotas: Array<JobQuota> = [];
  job: Job;

  resevent = new ResEvent();
  isEditInDepthTime = false;

  responseMessage: string;
  responseSurveySuccess: boolean = null;

  constructor(private router: Router, private activateroute: ActivatedRoute, private resservice: RespondentServices,
    private surveyservice: SurveyServices, private jobservice: JobServices, private sessionservice: SessionServices,
    @Inject(PLATFORM_ID) public platformId: Object) {
  }

  ngOnInit() {
    this.activateroute.params.subscribe(params => {
      if (params['jobid']) this.jobid = params['jobid'];
      if (params['surveyid']) this.surveyid = params['surveyid'];
      if (params['resid']) this.resid = params['resid'];
      if (params['screenerid']) this.screenerId = params['screenerid'];

      if (this.screenerId != null) {
        this.isScreen = true;
        this.getSurveyQuestionAnswersForScreen();
        this.getSurveyById(this.screenerId);
      }
      else {
        this.getSurveyQuestionAnswers();
        this.getSurveyById(this.surveyid);
      }

      this.getJobById(this.jobid);
      this.getBookingScreener();
    });
  }

  getJobById(id) {
    this.jobservice.getJobsByJob(id)
      .subscribe((res: any) => {
        this.job = res.value;
        console.log(this.job);
      });
  }

  getSurveyById(id) {
    this.surveyservice.getSurveyById(id)
      .subscribe((res: any) => {
        this.survey = res.value;
        console.log(this.survey);
      });
  }

  getSurveyQuestionAnswers() {
    this.surveyservice.getSurveyQuestionAnswers(this.surveyid, this.resid)
      .subscribe((res: any) => {
        console.log(res);
        this.surveyQuestions = res.value;
        this.isLoading = false;

        this.surveyQuestions.forEach(sq => {
          if (!sq.clientJobSurveyAnswers || sq.clientJobSurveyAnswers.length == 0) {
            sq.clientJobSurveyAnswers = [];
            sq.clientJobSurveyAnswers.push(new SurveyAnswers());
          }
        });
      });
  }

  getSurveyQuestionAnswersForScreen() {
    this.surveyservice.getScreenerQuestionsAnswers(this.surveyid, this.screenerId, this.resid)
      .subscribe((res: any) => {
        console.log(res);
        this.surveyQuestions = res.value;
        this.isLoading = false;

        this.surveyQuestions.forEach(sq => {
          if (!sq.clientJobSurveyAnswers || sq.clientJobSurveyAnswers.length == 0) {
            sq.clientJobSurveyAnswers = [];
            sq.clientJobSurveyAnswers.push(new SurveyAnswers());
          }
        });
      });
  }

  checkMultiSelect(surveyQuestion, option) {
    //console.log("check multiselect");
    var found = false;

    if (surveyQuestion.clientJobSurveyAnswers && surveyQuestion.clientJobSurveyAnswers.length > 0)
      surveyQuestion.clientJobSurveyAnswers.forEach((ans) => {
        if (ans.answer == option)
          found = true;
      });

    return found;
  }

  changeQuestion(action) {
    if (action == 'prev') this.navigationHelper(action);
    else {
      if (this.surveyQuestions[this.selectedIndex].answerType == 'Matrix')
        this.getMatrixHeader(this.surveyQuestions[this.selectedIndex]);

      /*if (this.isScreen) this.submitQuestion(action);
      else {
        this.navigationHelper(action);
      }*/

      this.submitQuestion(action);
    }
  }

  navigationHelper(action) {
    if (action == 'next') {
      if (this.surveyQuestions.length != (this.selectedIndex + 1))
        this.selectedIndex = (this.selectedIndex + 1);
    }
    else if (action == 'prev')
      this.selectedIndex = (this.selectedIndex - 1);

    console.log(this.selectedIndex);
    console.log(this.surveyQuestions[this.selectedIndex]);
  }

  /**MATRIX************/
  getMatrixHeader(sq) {
    var obj1 = [];
    sq.clientJobSurveyQuestionOption.forEach((qo) => {
      var obj = [];
      sq.matrixHorizontalOptions.split(',').forEach((th) => {
        var key = th + "," + qo.id;

        //console.log(qo);
        //console.log(th);

        var answer = qo.optionText + ":" + th;

        qo["checked"] = false;
        var found = false
        sq.clientJobSurveyAnswers.forEach((ans) => {
          if (ans.answer == answer) {
            found = true;
          }
        });

        /*if(found){
          qo["checked"] = true;

          console.log(qo["checked"]);
          console.log(qo.checked);
          qo.checked = true;
        }
        else qo["checked"] = false;*/

        if (found) {
          var str = JSON.stringify(qo);
          var strjs = JSON.parse(str);
          strjs['checked'] = true;

          this.matrixContent[key] = strjs;
        } else {
          var str = JSON.stringify(qo);
          var strjs = JSON.parse(str);
          strjs['checked'] = false;

          this.matrixContent[key] = strjs;
        }

        obj.push(key);
      });

      obj1.push(obj);
      //console.log(obj);
    });


    this.matrixKey = obj1;
    this.matrixKey.forEach((mk) => {
      mk.push(mk[0]);
    });
    console.log(this.matrixContent);
    /*console.log(obj1);*/

    this.matrixContent.forEach((mk) => {
      //console.log(mk);
    });

    //console.log(sq);
  }

  getMatrixValue(header, option, answers) {
    console.log(header);
    console.log(option);
    console.log(answers);

    var headerArr = header.split(',');
    headerArr.splice(-1, 1);

    header = headerArr.toString();
    console.log(header);

    var answer = option + ":" + header;

    var found = false;
    answers.forEach(an => {
      if (an == answer)
        found = true;
    });
    return found;
  }

  submitQuestion(action) {
    var surveyAnswers: Array<SurveyAnswers> = [];

    /*this.surveyQuestions.forEach((sq) => {
      var surveyAns = new SurveyAnswers();
      surveyAns.questionId = sq.id;
      surveyAns.respondentId = 114518;

      sq.clientJobSurveyAnswers.forEach((ans) => {
        surveyAns.answer = ans.answer;
        surveyAnswers.push(surveyAns);
      });
    });*/

    console.log(this.surveyQuestions[this.selectedIndex]);
    /*if (this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers && 
      this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers.length > 2) {
      this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers = 
        this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers.filter(value => Object.keys(value).length !== 0);
    }

    if (this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers &&
      this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers.length > 0 &&
      this.surveyQuestions[this.selectedIndex].answerType == 'Matrix') {
      this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers.forEach((sq, i) => {
        if (!sq.hasOwnProperty('answer')) {
          this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers.splice(i, 1);
        }
      })
    }

    if (this.surveyQuestions[this.selectedIndex].isMandatory &&
      (this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers.length < 1 ||
        !this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers[0].answer) &&
      this.surveyQuestions[this.selectedIndex].answerType != 'StaffText') {
      swal(
        'Oops...',
        'Please answer this question to proceed further.',
        'info'
      );
    } else {

      if (this.surveyQuestions[this.selectedIndex].minNumAnswers != null &&
        this.surveyQuestions[this.selectedIndex].maxNumAnswers != null) {
        console.log(this.surveyQuestions[this.selectedIndex]);
        console.log(this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers.length);
        console.log(this.surveyQuestions[this.selectedIndex].minNumAnswers);
        console.log(this.surveyQuestions[this.selectedIndex].maxNumAnswers);
        if (this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers.length >=
          this.surveyQuestions[this.selectedIndex].minNumAnswers &&
          this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers.length <=
          this.surveyQuestions[this.selectedIndex].maxNumAnswers) {
          this.submitQuestionHelper(action);
        }
        else {
          swal(
            'Oops...',
            'Please select more than ' + this.surveyQuestions[this.selectedIndex].minNumAnswers +
            ' and less than ' + this.surveyQuestions[this.selectedIndex].maxNumAnswers + ' option(s) to this question to proceed further.',
            'info'
          );
        }
      } else {
        this.submitQuestionHelper(action);
      }
    }*/
    this.submitQuestionHelper(action);
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0)
    }
  }

  submitQuestionHelper(action) {
    var surveyAnswers: Array<SurveyAnswers> = [];

    this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers.forEach((ans) => {
      if (ans.hasOwnProperty('answer')) {
        var surveyAns = new SurveyAnswers();
        surveyAns.questionId = this.surveyQuestions[this.selectedIndex].id;
        surveyAns.respondentId = this.resid;
        surveyAns.otherSpecify = ans.otherSpecify;

        if (ans.answer == null) surveyAns.answer = "";
        else surveyAns.answer = ans.answer;

        surveyAnswers.push(surveyAns);
      }
    });

    this.responseMessage = null;
    this.responseSurveySuccess = null;

    var surveyId = this.surveyid;
    if (this.isScreen) surveyId = this.screenerId;

    this.surveyservice.submitSuerveyAnswers(surveyAnswers, surveyId, this.resid, this.surveyQuestions[this.selectedIndex].id)
      .subscribe((res: any) => {
        console.log(res);
        this.responseMessage = res.message;
        this.responseSurveySuccess = res.surveySuccess;
        if (res.succeeded) {
          var nxtQNo = res.nextQuestionNumber;
          if (nxtQNo == 0) {
            this.finishSurvey = true;
            this.selectedIndex = (this.surveyQuestions.length - 1);
          }
          else {
            var sqindex = this.surveyQuestions.findIndex(sq => sq.questionNumber == nxtQNo);
            if (sqindex >= 0)
              this.selectedIndex = sqindex;
          }
          console.log(this.surveyQuestions);
          console.log(this.selectedIndex);
        }
        else {
          var err = "";
          res.errors.forEach((er) => {
            err = err + " " + er;
          });
          swal(
            'Error!',
            err,
            'error'
          )
        }

        if (this.finishSurvey) this.getBookingScreener();
      });
  }

  getBookingScreener() {
    console.log("getBookingScreener");
    this.jobservice.getSessionByJob(this.jobid)
      .subscribe((res: any) => {
        this.jobsessions = res.value;
      })

    /*this.jobservice.getQuotaByJob(this.jobid)
      .subscribe(res => {
        this.jobQuotas = res.value;
      })*/
    this.surveyservice.getSurveyQuotas(this.screenerId, this.resid)
      .subscribe((res: any) => {
        console.log(res);
        this.jobQuotas = res.value;
      })
  }

  changeOfSession() {
    this.sessionservice.getSessionIncentiveBySessionId(this.resevent.groupId)
      .subscribe((res: any) => {
        this.incentives = res.value;
      });

    this.sessionservice.getSessionTimesBySessionId(this.resevent.groupId)
      .subscribe((res: any) => {
        console.log(res);
        this.sessiontimes = res.value;
      })
  }

  recordEvent() {
    this.resevent.respondentIdsString = this.resid.toString();
    this.resevent.jobId = this.jobid;
    //this.resevent.clientId = this.job.clientId;

    if (this.isEditInDepthTime)
      this.resevent.inDepthTime = moment(this.resevent.inDepthTime, "hh:mm").format("hh:mm A");

    this.resservice.createResEvent(this.resevent)
      .subscribe((res: any) => {
        console.log(res);
        if (res.succeeded) {
          swal(
            "Successfully Recorded!",
            'Selected event has been successfully recorded.',
            'success'
          );

          this.surveyservice.updateSurveyQuotas(this.screenerId, this.resid, this.jobQuotas)
            .subscribe(res => {
              console.log(res);
              this.router.navigate(['/managescreener', this.jobid, this.screenerId]);
            });

          /*if (!this.survey.isScreener)
            this.router.navigate(['/managesurvey', this.jobid, this.surveyid]);
          if (this.survey.isScreener)*/
        }
        else {
          var err = "";
          res.errors.forEach((er) => {
            err = err + " " + er;
          });
          swal(
            'Error!',
            err,
            'error'
          )
        }
      })
  }

  updateIncentiveId() {
    this.incentives.forEach((ince) => {
      if ((ince.incentiveAmount + " - " + ince.incentiveType) == this.resevent.incentive)
        this.resevent.incentiveId = ince.id;
    })
  }
}
