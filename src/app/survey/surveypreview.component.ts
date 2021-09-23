import { Component, OnInit, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

import { Job } from '../models/job';
import { Survey } from '../models/survey';
import { SurveyAnswers } from '../models/surveyanswers';
import { SurveyQuestions } from '../models/surveyquestions';
import { SurveyServices } from '../services/survey.services';
import { JobServices } from '../services/job.services';
import { isPlatformBrowser } from '@angular/common';

declare var Clipboard: any;
declare var jQuery: any;

@Component({
  selector: 'SurveyPreviewComponent',
  templateUrl: './surveypreview.component.html'
})

export class SurveyPreviewComponent implements OnInit {
  surveyid: number;
  jobid: number;
  surveyQuestions: Array<SurveyQuestions>;
  selectedIndex = 0;
  survey: Survey;
  job: Job;
  startSurvey = false;
  finishSurvey = false;

  responseMessage: string;
  responseSurveySuccess: string;

  surveyPreQualRes: { heading: string, isPreQualSurvey: boolean, respondentId: number, statement1: string, statement2: string, url: string };
  gotoqno: number;
  isSubmitForm = false;
  @ViewChild('gotoquestionmodal') gotoquestionmodal: any;

  constructor(private surveyservice: SurveyServices, private activateroute: ActivatedRoute,
    private surveyService: SurveyServices, private jobsevice: JobServices, @Inject(PLATFORM_ID) public platformId: Object) {
  }

  ngOnInit() {
    this.activateroute.params.subscribe(params => {
      if (params['surveyid']) {
        this.surveyid = params['surveyid'];

        this.getSurveyQuestionsbySurveyId();
        this.getPrequalSurveyDetails();
      }

      if (params['jobid']) {
        this.jobid = params['jobid'];

        this.getSurvey();
        this.getJobById(this.jobid);
      }
    });
  }

  getJobById(id) {
    this.jobsevice.getJobsByJob(id)
      .subscribe((res: any) => {
        this.job = res.value;
        console.log(this.job);
      });
  }

  getPrequalSurveyDetails() {
    this.surveyService.getPrequalSurveyDetails(this.surveyid, 0)
      .subscribe((res: any) => {
        console.log(res);
        this.surveyPreQualRes = res.value;
      })
  }

  getSurveyQuestionsbySurveyId() {
    this.surveyService.getSurveyQuestionsbySurveyId(this.surveyid)
      .subscribe((res: any) => {
        console.log(this.surveyQuestions);
        this.surveyQuestions = res.value;

        this.surveyQuestions.forEach(sq => {
          if (!sq.clientJobSurveyAnswers || sq.clientJobSurveyAnswers.length == 0) {
            sq.clientJobSurveyAnswers = [];
            sq.clientJobSurveyAnswers.push(new SurveyAnswers());
          }
        });

        this.surveyQuestions.forEach((sq, i) => {
          if (sq.inactive) this.surveyQuestions.splice(i, 1);
        });
      });
  }

  getSurvey() {
    this.surveyservice.getSurveyById(this.surveyid)
      .subscribe((res: any) => {
        console.log(res);
        if (res.value)
          this.survey = res.value;
      });
  }

  submitQuestion(action) {
    /*if (this.surveyQuestions[this.selectedIndex].isMandatory &&
      !this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers &&
      this.surveyQuestions[this.selectedIndex].answerType != 'StaffText') {
      swal(
        'Oops...',
        'Please answer this question to proceed further.',
        'info'
      );
    } else {
      this.selectedIndex = (this.selectedIndex + 1);
    }*/

    /*console.log(this.surveyQuestions[this.selectedIndex]);

    if(this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers &&
      this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers.length > 0 &&
      this.surveyQuestions[this.selectedIndex].answerType == 'Matrix'){
      this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers.forEach((sq, i) => {
        if(!sq.hasOwnProperty('answer')){
          this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers.splice(i, 1);
        }
      })
    }

    if(this.surveyQuestions[this.selectedIndex].isMandatory && this.surveyQuestions[this.selectedIndex].answerType != 'reorderoption' &&
      (this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers.length < 1 ||
      !this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers.find(a => a.hasOwnProperty('answer')))){
      swal(
        'Oops...',
        'Please answer this question to proceed further.',
        'info'
      );
    } else {
      //this.selectedIndex = (this.selectedIndex + 1);
      this.submitQuestionHelper();
    }*/

    this.submitQuestionHelper(action);
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0)
    }
  }

  submitQuestionHelper(action) {
    var surveyAnswers: Array<SurveyAnswers> = [];

    this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers.forEach((ans) => {
      console.log(ans);
      if (ans.hasOwnProperty('answer')) {
        var surveyAns = new SurveyAnswers();
        surveyAns.questionId = this.surveyQuestions[this.selectedIndex].id;
        surveyAns.respondentId = 0;
        surveyAns.otherSpecify = ans.otherSpecify;

        if (ans.answer == null) surveyAns.answer = "";
        else surveyAns.answer = ans.answer;

        surveyAnswers.push(surveyAns);
      }
    });

    this.responseMessage = null;
    this.responseSurveySuccess = null;
    var prev = false;
    if (action == 'prev') prev = true;
    this.surveyservice.submitSuerveyAnswers(surveyAnswers, this.surveyid, 0, this.surveyQuestions[this.selectedIndex].id, prev)
      .subscribe((res: any) => {
        console.log(res);
        this.responseMessage = res.message;
        this.responseSurveySuccess = res.surveySuccess;
        if (res.succeeded) {
          if (action == 'next') {
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
            console.log(this.selectedIndex);
          }
          if (action == 'prev') {
            var prevQNo = res.prevQuestionNumber;
            if (prevQNo == 0) this.finishSurvey = true;
            else {
              var sqindex = this.surveyQuestions.findIndex(sq => sq.questionNumber == prevQNo);
              if (sqindex >= 0)
                this.selectedIndex = sqindex;
            }
          }
          console.log(this.surveyQuestions);
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
      });
  }

  clipboardCopy() {
    function showTooltip(elem: any, msg: string) {
      var classNames = elem.className;
      elem.setAttribute('class', classNames + ' hint--bottom');
      elem.setAttribute('aria-label', msg);
      setTimeout(() => {
        elem.setAttribute('class', classNames);
      },
        2000);
    }

    var clipboard = new Clipboard('.ccopy');

    clipboard.on('success',
      (e: any) => {
        showTooltip(e.trigger, 'Copied!');

        clipboard.destroy();
        clipboard = new Clipboard('.ccopy');
        clipboard.destroy();
      });

    clipboard.on('error',
      (e: string) => {
        //  // console.log(e);
      });
  }

  gotoNextQuestion(event) {
    if (event)
      this.submitQuestion('next');
  }

  gotoSpecificQuestion(form) {
    if (form.valid) {
      if (this.gotoqno < 1 || this.gotoqno > this.surveyQuestions.length) {
        swal(
          'Oops...',
          'Invalid question number. Please check and try again',
          'error'
        );
      } else {
        this.selectedIndex = this.gotoqno - 1;
        this.gotoquestionmodal.close();
      }
    }
  }
}
