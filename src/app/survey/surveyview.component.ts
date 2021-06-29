import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MetaService } from '@ngx-meta/core';
import { CookieService } from 'ngx-cookie-service';
import swal from 'sweetalert2';

import { mobileMask, mobilePattern, pageTile, postcodeMask, postcodePattern } from '../app.component';
import { Survey } from '../models/survey';
import { SurveyAnswers } from '../models/surveyanswers';
import { SurveyQuestions } from '../models/surveyquestions';
import { SurveyServices } from '../services/survey.services';
import { SharedServices } from './../services/shared.services';

declare var Clipboard: any;
declare var jQuery: any;

@Component({
  selector: 'SurveyViewComponent',
  templateUrl: './surveyview.component.html',
  styleUrls: ['../../assets/css/disability.css']
})

export class SurveyViewComponent implements OnInit {
  surveyQuestions: Array<SurveyQuestions> = [];

  surveys = [
    { "label": "Information Text", "iconclass": "statement", "type": "informationtext", "answer": "" },
    { "label": "Short Text", "iconclass": "textfield", "type": "shorttext", "answer": "" },
    { "label": "Long Text", "iconclass": "textarea", "type": "longtext", "answer": "" },
    { "label": "Ranking", "iconclass": "opinion-scale", "type": "opinionscale", "answer": "" },
    { "label": "Star Rating", "iconclass": "rating", "type": "starrating", "answer": "" },
    { "label": "Yes No Type", "iconclass": "yes-no", "type": "yesnotype", "answer": "true" },
    { "label": "Single Choice", "iconclass": "list", "type": "singlechoice", "answer": "" },
    { "label": "Multiple Choice", "iconclass": "multiple-choice", "type": "multiplechoice", "answer": "" },
    { "label": "Matrix Choice", "iconclass": "matrix", "type": "matrixchoice", "answer": "" },
    { "label": "Picture Option", "iconclass": "list-image", "type": "pictureoption", "answer": "" },
    { "label": "Thumbs Up Down", "iconclass": "thumps-up-down", "type": "thumbsupdown", "answer": "" },
    { "label": "Reorder Option", "iconclass": "group", "type": "reorderoption", "answer": "" },
    { "label": "Date Format", "iconclass": "date", "type": "dateformat", "answer": "" },
    { "label": "Video Question", "iconclass": "video", "type": "videoquestion", "answer": "" },
    { "label": "Select Question", "iconclass": "select", "type": "selectquestion", "answer": "" }
  ];

  startSurvey = false;
  selectedIndex = 0;

  surveyid: number;
  survey: Survey;
  errorList = [];

  jobId: number;
  respondentId: number;
  isLoading = true;
  isLoggedIn = false;
  finishSurvey = false;

  isPreview = true;
  responseMessage: string;
  responseSurveySuccess: boolean = null;
  isFarronResearch = false;

  surveyPreQualRes: { heading: string, isPreQualSurvey: boolean, respondentId: number, statement1: string, statement2: string, url: string, buttonText: string };

  fbValue: string;
  fbSucceeded: boolean;
  welcomePageData: any;
  isSubmitForm = false;

  mobileMask = mobileMask;
  mobilePattern = mobilePattern;
  postcodeMask = postcodeMask;
  encodedData: string;
  postcodePattern = postcodePattern;

  constructor(private activateroute: ActivatedRoute, private router: Router, private metaservice: MetaService,
    private surveyservice: SurveyServices, private cookieservice: CookieService,
    private sharedService: SharedServices, @Inject(PLATFORM_ID) public platformId: Object) {
    this.metaservice.setTitle("Survey - " + pageTile, true);
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.getIsFarronResearch();
      this.getLoginUserRoles();
      this.activateroute.params.subscribe(params => {
        if (params['action'] && params['encodeddata']) {
          this.encodedData = params['encodeddata'];
          if (params['action'] == 'survey-start') {
            this.surveyservice.getPublicSurveyDecodedValues(params['encodeddata'])
              .subscribe((res: any) => {
                console.log(res)
                if (res.value && res.errors.length < 1) {
                  var resvalue = res.value.split('|');
                  this.respondentId = resvalue[0];
                  this.jobId = resvalue[1];
                  this.surveyid = resvalue[2];
                } else {
                  this.errorList = res.errors;
                }

                if(this.errorList.length == 0) {
                  this.getSurvey();
                  this.getSurveyQuestionAnswers();
                  this.getPrequalSurveyDetails();
                }                
              })
            this.isPreview = false;
            this.getSurveyWelcomeValues(params['encodeddata']);
          }
          else if (params['action'] == 'client-preview') {
            this.surveyservice.getClientSurveyDecodedValues(params['encodeddata'])
              .subscribe((res: any) => {
                console.log(res)
                if (res.value && res.errors.length < 1) {
                  var resvalue = res.value.split('|');
                  /*this.respondentId = resvalue[0];
                  this.jobId = resvalue[1];*/
                  this.respondentId = 0;
                  this.surveyid = resvalue[0];
                } else {
                  this.errorList = res.errors;
                }

                if(this.errorList.length == 0) {
                  this.getSurvey();
                  this.getSurveyQuestionAnswers();
                }                
              })
            this.isPreview = true;            
          }
          else {
            this.router.navigate(['/']);
          }
        }
        else {
          this.router.navigate(['/']);
        }
      });

      /*this.activateroute.params.subscribe(params => {
        if (params['surveyid']) {
          this.surveyid = params['surveyid'];
  
          this.getSurveyQuestionsbySurveyId();
        }
  
        if (params['jobid']) {
          this.jobid = params['jobid'];
  
          this.getSurvey();
          this.getSurveyQuestionsbySurveyId();
        }
      });*/

      /*this.surveys.forEach((sr, i) => {
        this.surveyQuestions.push({
          questionName: "What beachwear brands, if any, can you think of?",
          questionType: sr.type,
          questionLabel: sr.type,
          questionOptions: [],
          questionOrder: (i + 1),
          iconclass: '',
          answer: sr.answer,
          option: true,
          staffNotes: ""
        });
      });*/
      this.getFacebookURL();
    }
  }

  getFacebookURL() {
    this.surveyservice.getFacebookURL()
      .subscribe((res: any) => {
        console.log(res)
        this.fbValue = res.value;
        this.fbSucceeded = res.succeeded;
      })
  }

  getPrequalSurveyDetails() {
    this.surveyservice.getPrequalSurveyDetails(this.surveyid, this.respondentId)
      .subscribe((res: any) => {
        console.log(res);
        this.surveyPreQualRes = res.value;
      })
  }

  getLoginUserRoles() {
    if (this.cookieservice.get('auth_token') == null || this.cookieservice.get('auth_token') == '') this.isLoggedIn = false;
    else this.isLoggedIn = true;
  }

  /*getSurveyQuestionsbySurveyId() {
    console.log(this.surveyid);
    this.surveyservice.getSurveyQuestionsbySurveyId(this.surveyid)
      .subscribe((res: any) => {
        this.isLoading = false;
        this.surveyQuestions = res.value;

        this.surveyQuestions.forEach(sq => {
          if (!sq.clientJobSurveyAnswers || sq.clientJobSurveyAnswers.length == 0 &&
            sq.answerType != 'OptionListMultipleAnswer' && sq.answerType != 'matrixchoice' && sq.answerType != 'Picturechoice') {
            sq.clientJobSurveyAnswers = [];
            sq.clientJobSurveyAnswers.push(new SurveyAnswers());
          }
        });

        console.log(this.surveyQuestions);
        this.surveyQuestions.forEach((sq, i) => {
          if (sq.inactive) this.surveyQuestions.splice(i, 1);
        });

        this.surveyQuestions.forEach((sq, i) => {
          if (sq.answerType == 'StaffText') this.surveyQuestions.splice(i, 1);
        })
      });
  }*/

  getSurveyQuestionAnswers() {
    this.surveyservice.getSurveyQuestionAnswers(this.surveyid, this.respondentId)
      .subscribe((res: any) => {
        this.isLoading = false;
        this.surveyQuestions = res.value;

        this.surveyQuestions.forEach(sq => {
          if (!sq.clientJobSurveyAnswers || sq.clientJobSurveyAnswers.length == 0 &&
            sq.answerType != 'OptionListMultipleAnswer' && sq.answerType != 'matrixchoice' && sq.answerType != 'Picturechoice') {
            sq.clientJobSurveyAnswers = [];
            sq.clientJobSurveyAnswers.push(new SurveyAnswers());
          }
        });

        console.log(this.surveyQuestions);
        this.surveyQuestions.forEach((sq, i) => {
          if (sq.inactive) this.surveyQuestions.splice(i, 1);
        });

        this.surveyQuestions.forEach((sq, i) => {
          if (sq.answerType == 'StaffText') this.surveyQuestions.splice(i, 1);
        })

        if(this.isPreview) this.startSurvey = true;
      });
  }

  getSurvey() {
    console.log(this.surveyid);
    this.surveyservice.getSurveyById(this.surveyid)
      .subscribe((res: any) => {
        console.log(res);
        if (res.value)
          this.survey = res.value;
      });
  }

  submitQuestion() {
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

    if (this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers &&
      this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers.length > 0 &&
      this.surveyQuestions[this.selectedIndex].answerType == 'Matrix') {
      this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers.forEach((sq, i) => {
        if (!sq.hasOwnProperty('answer')) {
          this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers.splice(i, 1);
        }
      })
    }

    /*if (this.surveyQuestions[this.selectedIndex].isMandatory &&
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
        if (this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers.length >
          this.surveyQuestions[this.selectedIndex].minNumAnswers &&
          this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers.length <
          this.surveyQuestions[this.selectedIndex].maxNumAnswers) {
          this.submitQuestionHelper();
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
        if (!this.isPreview)
          this.submitQuestionHelper();
        else if (this.surveyQuestions.length != (this.selectedIndex + 1))
          this.selectedIndex = (this.selectedIndex + 1);
      }
    }*/
    this.submitQuestionHelper();
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
  }

  submitQuestionHelper() {
    var surveyAnswers: Array<SurveyAnswers> = [];

    this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers.forEach((ans) => {
      if (ans.hasOwnProperty('answer')) {
        var surveyAns = new SurveyAnswers();
        surveyAns.questionId = this.surveyQuestions[this.selectedIndex].id;
        surveyAns.respondentId = this.respondentId;
        surveyAns.surveyId = this.surveyid;
        surveyAns.otherSpecify = ans.otherSpecify;

        if (ans.answer == null) surveyAns.answer = "";
        else surveyAns.answer = ans.answer;

        surveyAnswers.push(surveyAns);
      }
    });


    /*if (this.surveyQuestions.length != (this.selectedIndex + 1))
      this.selectedIndex = (this.selectedIndex + 1);*/

    this.responseMessage = null;
    this.responseSurveySuccess = null;
    this.surveyservice.submitSuerveyAnswers(surveyAnswers, this.surveyid, this.respondentId, this.surveyQuestions[this.selectedIndex].id)
      .subscribe((res: any) => {
        console.log(res);
        // debugger;
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
        setTimeout(() => {
          jQuery(".breadcrumb").focus();
          jQuery(".breadcrumb").blur();
        }, 500)
      });
  }

  getIsFarronResearch() {
    this.sharedService.getIsFarronResearch()
      .subscribe((res: any) => {
        this.isFarronResearch = res.value;
      })
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

  recordThirdPartySurveyClick() {
    this.surveyservice.recordThirdPartySurveyClick(this.jobId, this.respondentId)
      .subscribe((res: any) => {
        console.log(res);
        if (res.succeeded)
          window.location.href = this.surveyPreQualRes.url;
      })
  }

  gotoNextQuestion(event) {
    if (event)
      this.submitQuestion();
  }

  getSurveyWelcomeValues(encodeddata) {
    this.sharedService.getSurveyWelcomeValues(encodeddata)
      .subscribe((res: any) => {
        console.log(res)
        this.welcomePageData = res.value;
        if(res.errors && res.errors.length > 0) {
          res.errors.forEach((er) => {
            this.errorList.push(er)
          })
        }        
      })
  }

  unmask(value) {
    var ret = value.replace(/\D+/g, '');
    return ret;
  }

  startSurveyHelper(form) {
    this.isSubmitForm = true;
    if (form.valid) {
      this.surveyservice.postSurveyUpdateProfile(this.encodedData, this.welcomePageData.respondentEmail, this.welcomePageData.respondentMobil, this.welcomePageData.respondentPostcode)
        .subscribe((res: any) => {
          console.log(res)
          this.isSubmitForm = false;
          if (res.errors && res.errors.length > 0) {
            var err = "";
            res.errors.forEach((er) => {
              err = err + " " + er;
            });
            swal('Error!', err, 'error');
          } else {
            this.startSurvey = true;
            this.selectedIndex = 0;
          }
        })
    }
  }

  notMyProfile() {
    // [routerLink]="['/signin', this.jobId]"
    swal({
      title: 'Have you registered with us already?',
      // text: 'You will not be able to recover this item!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: '#ffaa00',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.router.navigate(['/signin', this.jobId])
      } else {
        this.router.navigate(['/signup', this.jobId])
      }
    });
  }
}
