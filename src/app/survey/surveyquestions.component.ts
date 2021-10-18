import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewChildren, SimpleChanges, KeyValueChanges, KeyValueDiffers, KeyValueDiffer, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

import { Job } from '../models/job';
import { JobQuota } from '../models/jobquota';
import { Survey } from '../models/survey';
import { SurveyAnswers } from '../models/surveyanswers';
import { SurveyQuestionOption } from '../models/surveyquestionoption';
import { SurveyQuestions } from '../models/surveyquestions';
import { JobServices } from '../services/job.services';
import { SharedServices } from '../services/shared.services';
import { SurveyServices } from '../services/survey.services';
import { apiHost, ckEditorConfig } from '../app.component';
import { DragulaService } from 'ng2-dragula/dist';
import { Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { SurveyQuestionType } from '../models/surveyquestiontype';
// import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import * as Editor from './../../assets/ckeditor/build/ckeditor';
import { isPlatformBrowser } from '@angular/common';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SecurityRights } from '../shared/enum';

declare var Clipboard: any;
declare var jQuery: any;

@Component({
  selector: "SurveyQuestionsComponent",
  templateUrl: "./surveyquestions.component.html",
  styleUrls: ["./surveyquestions.component.css"]
})

export class SurveyQuestionsComponent implements OnInit {
  editor;
  @Input() surveyId: number;
  @Input() isUpdateSurvey: boolean;
  @Input() jobId: number;

  newquestionText: string;

  // openIndex: number;
  surveyquestions: Array<SurveyQuestions> = [];
  surveyquestionssource: Array<SurveyQuestions> = [];
  libQuestions: Array<SurveyQuestions> = [];

  /*surveys = [
    { label: "Information Text", iconclass: "statement", type: "Information", option: false, media: false },
    { label: "Free Text", iconclass: "textfield", type: "Text", option: false, media: true },
    { label: "Rating", iconclass: "opinion-scale", type: "OneToTen", option: true, media: true },
    { label: "Star Rating", iconclass: "rating", type: "starrating", option: true, media: true },
    { label: "Yes No Type", iconclass: "yes-no", type: "YesNo", option: true, media: true },
    { label: "Single Choice", iconclass: "list", type: "OptionList", option: true, media: true },
    { label: "Multiple Choice", iconclass: "multiple-choice", type: "OptionListMultipleAnswer", option: true, media: true },
    { label: "Matrix Choice", iconclass: "matrix", type: "Matrix", option: true, media: true },
    // {"label": "Picture Choice", "iconclass": "list-image", "type": "Picturechoice", "option": true, "media": true},
    { label: "Thumbs Up Down", iconclass: "thumps-up-down", type: "thumbsupdown", option: true, media: true },
    // {"label": "Reorder Option", "iconclass": "group", "type": "reorderoption", "option": true, "media": true},
    { label: "Date Format", iconclass: "date", type: "dateformat", option: false, media: true },
    //    { "label": "Video Question", "iconclass": "video", "type": "Videoquestion", "option": true },
    { label: "Staff Text", iconclass: "textfield", type: "StaffText", option: false, media: false }
  ];*/
  //surveys = [];

  selectedQuestion = {
    label: "",
    iconclass: "",
    type: "",
    option: true,
    media: true,
    disability: false
  };

  //jobId: number;
  jobQuotas: Array<JobQuota>;

  survey: Survey;

  viewQuestion = [];

  jobs: Array<Job>;
  copysurveyjobid: any;

  viewImageUrl: string;
  isDisableDelete = false;

  quotaDescSource = ["Female", "Male", "0-9", "10-19", "20-29", "30-39", "40-49", "50-59", "60-69", "70-79", "80-89", "90-99", "Sydney", "Melbourne",
    "Brisbane", "North", "East", "West", "South"];

  jobQuota = new JobQuota();
  isSubmitForm = false;
  isSubmitFormSpinner = false;
  @ViewChild("closeAddNewModal") closeAddNewModal;

  lqSearchInput: string;
  sqSearchInput: string;

  selectedmediaurl: string;

  @Output() surveyQuestionUpdate = new EventEmitter();
  public jobNoAPI: string;
  public jobNoNameAPI: string;

  subs = new Subscription();

  openIndexs = [];
  surveysaveinterval: any;

  surveyQuestionTypes: Array<SurveyQuestionType> = [];
  surveyQuestionCategories: Array<string> = [];
  selectedSurveyQuestionType: SurveyQuestionType = new SurveyQuestionType();
  searchquestiontype: string;
  @ViewChildren('addquestioncollapse') addquestioncollapse;
  @ViewChildren('addquestioncollapseIcon') addquestioncollapseIcon;
  surveyDiffer: KeyValueDiffer<string, any>;
  @ViewChild('sqform') sqform;
  hasFormChanges = false;
  isupdatesurveyquestionsource = true;

  questionLibMultiselectIds = [];
  ckEditorConfig = JSON.parse(JSON.stringify(ckEditorConfig));

  insertQuesIndex: number;
  isBrowser = false;
  mappingEntityList: Array<any>;

  @Output() isDestorySurveyQuestion = new EventEmitter();
  hasSurveyMapReference = false;

  @Input() isQuestionLibPage = false;

  constructor(private activatedroute: ActivatedRoute, private jobservice: JobServices, private surveyservice: SurveyServices,
    private sharedservice: SharedServices, private dragulaService: DragulaService, private cookieService: CookieService,
    private differs: KeyValueDiffers, @Inject(PLATFORM_ID) platformId: Object, private securityInfoResolve: SecurityInfoResolve,) {
    /*this.isBrowser = isPlatformBrowser(platformId);
    if(this.isBrowser) {
      const ClassicEditor = require('./../../assets/ckeditor/build/ckeditor');
      this.editor = ClassicEditor;
    }*/
    if (this.cookieService.check('auth_token')) {
      var token = this.cookieService.get('auth_token');
      this.jobNoAPI = apiHost + "/api/search/job-number/:keyword/?token=" + token;
      this.jobNoNameAPI = apiHost + "/api/search/job-number-name/:keyword/?token=" + token;
    }

    this.subs.add(dragulaService.dropModel('DRAGULA_CONTAINER')
      .subscribe(({ el, target, source, sourceModel, targetModel, item }) => {
        console.log(sourceModel)
        this.surveyquestions = sourceModel;
      }));

    this.subs.add(dragulaService.dropModel('DRAGULA_CONTAINER_QO')
      .subscribe(({ el, target, source, sourceModel, targetModel, item }) => {
        console.log(sourceModel)
        // this.surveyquestions = sourceModel;        
        if (sourceModel && sourceModel.length > 0) {
          var qindex = this.surveyquestions.findIndex(sq => sq.id == sourceModel[0].questionId);
          sourceModel.forEach((sm, i) => {
            sm.order = i + 1;
          })
          this.surveyquestions[qindex].clientJobSurveyQuestionOption = [];
          setTimeout(() => {
            this.surveyquestions[qindex].clientJobSurveyQuestionOption = sourceModel;
          }, 0);
        }
      }));

    this.subs.add(dragulaService.dropModel('DRAGULA_CONTAINER_QOH')
      .subscribe(({ el, target, source, sourceModel, targetModel, item }) => {
        console.log(sourceModel)
        // this.surveyquestions = sourceModel;        
        if (sourceModel && sourceModel.length > 0) {
          var qindex = this.surveyquestions.findIndex(sq => sq.id == sourceModel[0].questionId);
          console.log(qindex);
          console.log(this.surveyquestions[qindex]);

          sourceModel.forEach((sm, i) => {
            sm.order = i + 1;
          })
          this.surveyquestions[qindex].matrixChoiceArray = [];
          setTimeout(() => {
            this.surveyquestions[qindex].matrixChoiceArray = sourceModel;
          }, 0);
        }
        console.log(this.surveyquestions[qindex].matrixChoiceArray)
      }));

    this.dragulaService.createGroup('DRAGULA_CONTAINER', {
      moves: function (el, container, handle) {
        return handle.className.includes('sq-move');
      }
    });

    this.dragulaService.createGroup('DRAGULA_CONTAINER_QO', {
      moves: function (el, container, handle) {
        return handle.className.includes('sqo-move');
      }
    });

    this.dragulaService.createGroup('DRAGULA_CONTAINER_QOH', {
      moves: function (el, container, handle) {
        return handle.className.includes('sqo-move');
      }
    });
  }

  ngOnInit() {
    this.ckEditorConfig.height = 50;
    this.getSurveyQuestionCategories();
    this.activatedroute.params.subscribe(params => {
      if (params["surveyId"]) {
        this.surveyId = params["surveyId"];
      }
    });
    this.getLibQuestions();
    this.getSystemReferences();
    this.getSecurityRightsSurveyMapReference();

    if (!this.isQuestionLibPage) {
      this.getSurvey();
      this.getJobWithSurveyQuestions();
      this.getJobQuota(this.jobId);
    }
  }

  ngOnDestroy() {
    clearInterval(this.surveysaveinterval);
    this.dragulaService.destroy("DRAGULA_CONTAINER");
    this.dragulaService.destroy("DRAGULA_CONTAINER_QO");
    this.dragulaService.destroy("DRAGULA_CONTAINER_QOH");
    this.isDestorySurveyQuestion.emit(true);
    console.log("inside ngondestroy");
  }

  generateQuestion() {
    var newQues = new SurveyQuestions();
    newQues.questionText = this.newquestionText;
    newQues.iconclass = this.selectedQuestion.iconclass;
    newQues.answerType = this.selectedQuestion.type;
    newQues.questionLabel = this.selectedQuestion.label;
    newQues.option = this.selectedQuestion.option;
    newQues.clientJobSurveyQuestionOption = [];
    newQues.matrixChoiceArray = [{ optionName: "", questionId: 0 }];
    newQues.isMandatory = true;
    newQues.isMedia = this.selectedQuestion.media;
    newQues.inactive = false;

    var qoptions;
    console.log(this.selectedQuestion.type)
    switch (this.selectedQuestion.type) {
      case "YesNo":
        qoptions = new SurveyQuestionOption();
        qoptions.optionText = "Yes";
        qoptions.action = "Go to next question";
        qoptions.fillQuotaId = null;
        newQues.clientJobSurveyQuestionOption.push(qoptions);

        qoptions = new SurveyQuestionOption();
        qoptions.optionText = "No";
        qoptions.action = "Go to next question";
        qoptions.fillQuotaId = null;
        newQues.clientJobSurveyQuestionOption.push(qoptions);
        break;

      case "thumbsupdown":
        qoptions = new SurveyQuestionOption();
        qoptions.optionText = "Thumbs Up";
        qoptions.action = "Go to next question";
        qoptions.fillQuotaId = null;
        newQues.clientJobSurveyQuestionOption.push(qoptions);

        qoptions = new SurveyQuestionOption();
        qoptions.optionText = "Thumbs Down";
        qoptions.action = "Go to next question";
        qoptions.fillQuotaId = null;
        newQues.clientJobSurveyQuestionOption.push(qoptions);
        break;

      case "starrating":
        for (var i = 1; i < 6; i++) {
          qoptions = new SurveyQuestionOption();
          qoptions.optionText = i + " Star";
          qoptions.action = "Go to next question";
          qoptions.fillQuotaId = null;
          newQues.clientJobSurveyQuestionOption.push(qoptions);
        }
        break;

      case "OneToTen":
        for (var i = 1; i < 11; i++) {
          qoptions = new SurveyQuestionOption();
          qoptions.optionText = i;
          qoptions.action = "Go to next question";
          qoptions.fillQuotaId = null;
          newQues.clientJobSurveyQuestionOption.push(qoptions);
        }
        break;

      case "ImageSingleSelect":
      case "ImageMultiSelect":
      case "ReorderImage":
        console.log("ReorderImage")
        newQues.clientJobSurveyQuestionOption = [];
        break;

      case "StaffText":
        newQues.isMandatory = false;
        break;

      case "Information":
        newQues.isMandatory = false;
        break;

      case "SmileyRating":
        for (var i = 1; i < 6; i++) {
          qoptions = new SurveyQuestionOption();
          qoptions.optionText = this.getSimlyRatingTextByNo(i);
          qoptions.action = "Go to next question";
          qoptions.fillQuotaId = null;
          newQues.clientJobSurveyQuestionOption.push(qoptions);
        }
        break;

      case "Multi SmileyRating":
        newQues.matrixChoiceArray = [];
        for (var i = 1; i < 6; i++) {
          qoptions = new SurveyQuestionOption();
          qoptions.optionName = this.getSimlyRatingTextByNo(i);
          qoptions.action = "Go to next question";
          qoptions.fillQuotaId = null;
          newQues.matrixChoiceArray.push(qoptions);
        }
        qoptions = new SurveyQuestionOption();
        qoptions.optionText = "";
        qoptions.action = "Go to next question";
        qoptions.fillQuotaId = null;
        newQues.clientJobSurveyQuestionOption.push(qoptions);

        break;

      default:
        qoptions = new SurveyQuestionOption();
        qoptions.action = "Go to next question";
        qoptions.fillQuotaId = null;
        newQues.clientJobSurveyQuestionOption.push(qoptions);
    }

    if (this.insertQuesIndex != null) {
      this.surveyquestions.splice(this.insertQuesIndex, 0, newQues);
      this.openIndexs.push(this.insertQuesIndex);
      if (typeof jQuery != 'undefined')
        jQuery("html, body").animate({ scrollTop: (jQuery('.js-insert-index').offset().top - 135) }, 1000);
      this.insertQuesIndex = null;
    }
    else {
      this.surveyquestions.push(newQues);
      this.updateSelectedQuestionIndex();
    }
  }

  getSimlyRatingTextByNo(rno) {
    var ret = "";
    if (rno == 1) ret = "Extremely Unsatisfied";
    else if (rno == 2) ret = "Unsatisfied";
    else if (rno == 3) ret = "Neutral";
    else if (rno == 4) ret = "Satisfied";
    else if (rno == 5) ret = "Extremely Satisfied";
    return ret;
  }

  submitQuestions(isAutoSave?) {
    this.updatematrixHorizontalOptions();

    this.surveyquestions.forEach((sq, i) => {
      if (this.isQuestionLibPage) {
        sq.isTemplate = true;
      } else {
        sq.clientJobGroupSurveyId = this.survey.id;
      }
      sq.questionNumber = i + 1;

      //sq.clientJobSurveyQuestionOption = sq.clientJobSurveyQuestionOption;
      if (sq.clientJobSurveyQuestionOption != null && sq.clientJobSurveyQuestionOption.length > 0) {
        sq.clientJobSurveyQuestionOption.forEach((sqop, j) => {
          sqop.order = j + 1;
        });
      }
    });

    this.surveyquestions.forEach((sq) => {
      if (sq.matrixChoiceArray && sq.matrixChoiceArray.length > 0) {
        sq.matrixChoiceArray = sq.matrixChoiceArray.filter(mc => (mc.optionName != ""))
      }
    })

    console.log(this.surveyquestions);

    if (this.validateSurveyQuestions(isAutoSave)) {
      this.surveyservice.submitSuerveyQuestions(this.surveyquestions)
        .subscribe(res => {
          console.log(res);
          if (!this.isQuestionLibPage) {
            this.isupdatesurveyquestionsource = true;
            this.getSurvey();
            this.surveyQuestionUpdate.emit(true);
          }
          else
            this.getLibQuestions();
          // this.getSurveyQuestionsbySurveyId();

          if (!isAutoSave) {
            swal(
              "Success!",
              this.isQuestionLibPage ? "Survey library questions has been saved successfully." : "Survey questions has been saved successfully.",
              "success"
            );
          }
        });
    }
    console.log(this.surveyquestions);
  }

  /*selectAccordian(index) {
    if (index == this.openIndex) {
      this.openIndex = null;
    } else {
      this.openIndex = index;
    }
  }*/

  removeQuestion(index, id) {
    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this item!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#ffaa00",
      cancelButtonText: "No, keep it"
    }).then(result => {
      if (result.value) {
        this.isDisableDelete = true;
        if (id) {
          this.surveyservice.deletesurveyquestions(id)
            .subscribe((res: any) => {
              if (res.succeeded) this.surveyquestions.splice(index, 1);
              this.updateSurveyQuestionSource();
              this.isDisableDelete = false;
            });
        } else {
          this.surveyquestions.splice(index, 1);
          this.updateSurveyQuestionSource();
          this.isDisableDelete = false;
        }
      } else if (result.dismiss === swal.DismissReason.cancel) {
        swal("Cancelled", "Survey Question is safe :)", "error");
      }
    });
  }

  duplicateQuestion(index) {
    //this.surveyquestions[index + 1].push(this.surveyquestions[index]);
    //this.surveyquestions.insert(index + 1, this.surveyquestions[index]);
    var quesstr = JSON.stringify(this.surveyquestions[index]);
    var quesjson = JSON.parse(quesstr);
    quesjson.id = 0;
    quesjson.clientJobSurveyQuestionOption.forEach((qo) => {
      qo.id = 0;
      qo.questionId = 0;
    })
    this.surveyquestions.splice(index, 0, quesjson);

    console.log(this.surveyquestions);
  }

  addOneMoreOption(i, j) {
    var newSurveyQuestionOption = new SurveyQuestionOption();
    newSurveyQuestionOption.action = "Go to next question";
    newSurveyQuestionOption.fillQuotaId = null;
    newSurveyQuestionOption.order = j + 2;

    /*this.surveyquestions[i].clientJobSurveyQuestionOption.forEach((sqo) => {
      sqo.order = 0;
    });

    this.surveyquestions[i].clientJobSurveyQuestionOption.push(
      newSurveyQuestionOption
    );

    var index = 1;
    this.surveyquestions[i].clientJobSurveyQuestionOption.forEach((sqo, i) => {
      if (sqo.order == 0 && (j + 2) != index)
        sqo.order = index;
      if ((j + 2) == index) {
        index++;
        sqo.order = index;
      }
      index++;
    });*/

    this.surveyquestions[i].clientJobSurveyQuestionOption.splice((j + 1), 0, newSurveyQuestionOption);
    this.surveyquestions[i].clientJobSurveyQuestionOption.forEach((sqo, oindex) => {
      sqo.order = oindex + 1;
    })
    console.log(this.surveyquestions[i].clientJobSurveyQuestionOption)
  }

  removeOption(i, j) {
    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this item!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#ffaa00",
      cancelButtonText: "No, keep it"
    }).then(result => {
      if (result.value) {
        if (this.surveyquestions[i].clientJobSurveyQuestionOption[j].id) {
          console.log(this.surveyquestions[i].clientJobSurveyQuestionOption[j].id);
          this.surveyservice.deletesurveyquestionoptions(this.surveyquestions[i].clientJobSurveyQuestionOption[j].id)
            .subscribe(res => {
              /*this.surveyservice.submitSuerveyQuestions(this.surveyquestions)
                .subscribe(res1 => {
                  console.log(res1);
                  this.getSurvey();
                  this.getSurveyQuestionsbySurveyId();
                  this.surveyQuestionUpdate.emit(true);
                });*/
              this.surveyquestions[i].clientJobSurveyQuestionOption.splice(j, 1);
              if (this.surveyquestions[i].clientJobSurveyQuestionOption.length == 0)
                this.addOneMoreOption(i, j);
            })
        }
        else {
          this.surveyquestions[i].clientJobSurveyQuestionOption.splice(j, 1);
          if (this.surveyquestions[i].clientJobSurveyQuestionOption.length == 0)
            this.addOneMoreOption(i, j);
        }
      } else if (result.dismiss === swal.DismissReason.cancel) {
        swal("Cancelled", "Survey is safe :)", "error");
      }
    });
  }

  getJobQuota(jobid) {
    console.log(jobid);
    this.jobservice.getQuotaByJob(jobid)
      .subscribe((res: any) => {
        this.jobQuotas = res.value;
        console.log(res);
      });
  }

  response(res) {
    if (res.succeeded) this.getJobQuota(this.jobId);
  }

  addOneMoreMatrixChoice(i, sqid, j) {
    //this.surveyquestions[i].matrixChoiceArray.push({ optionName: "", questionId: sqid });

    this.surveyquestions[i].matrixChoiceArray.splice((j + 1), 0, { optionName: "", questionId: sqid });
    /*this.surveyquestions[i].matrixChoiceArray.forEach((sqo, oindex) => {
      sqo.order = oindex + 1;
    })*/

    this.updatematrixHorizontalOptions();
  }

  removeMatrixChoice(i, mi) {
    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this item!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#ffaa00",
      cancelButtonText: "No, keep it"
    }).then(result => {
      if (result.value) {
        this.surveyquestions[i].matrixChoiceArray.splice(mi, 1);
        this.updatematrixHorizontalOptions();
      } else if (result.dismiss === swal.DismissReason.cancel) {
        swal("Cancelled", "Survey is safe :)", "error");
      }
    });
  }

  updatematrixHorizontalOptions(optionname?, sq?) {
    console.log("updatematx");
    console.log(optionname);
    console.log(sq);
    if (optionname) {
      var split = optionname.split("\n");
      console.log(split);
      if (split.length > 1) {
        console.log(sq);
        //if (sq.matrixHorizontalOptions) {
        /*var mArrHoOp = [];
        mArrHoOp = sq.matrixHorizontalOptions.split(",");
        console.log(mArrHoOp);*/
        if (sq.matrixChoiceArray && sq.matrixChoiceArray.length > 0)
          sq.matrixChoiceArray.splice(-1, 1);

        split.forEach(sp => {
          sq.matrixChoiceArray.push({ optionName: sp });
        })
        console.log(sq.matrixChoiceArray);
        sq.matrixHorizontalOptions = sq.matrixChoiceArray.join(",");
        //}
      }
    }
    else {
      this.surveyquestions.forEach(sq => {
        if (sq.matrixChoiceArray && sq.matrixChoiceArray.length > 0)
          sq.matrixHorizontalOptions = sq.matrixChoiceArray
            .map(val => val.optionName)
            .join(",");
      });
    }
  }

  getSurvey() {
    console.log("inside getsurvey");
    this.surveyservice.getSurveyById(this.surveyId)
      .subscribe((res: any) => {
        this.survey = res.value;
        console.log(res);

        this.getSurveyQuestionsbySurveyId();
      });
  }

  getSurveyQuestionsbySurveyId() {
    this.surveyservice
      .getSurveyQuestionsbySurveyId(this.survey.id)
      .subscribe((res: any) => {
        console.log(res);
        this.surveyquestions = res.value;
        this.populateSurveyQuestions();
      });
  }

  populateSurveyQuestions() {
    this.surveyquestions.forEach(sq => {
      this.surveyQuestionTypes.forEach(sr => {
        if (sr.answerType == sq.answerType) {
          sq["iconclass"] = sr.iconclass;
          sq["option"] = sr.option;
          sq["isMedia"] = sr.media;
        }
        if (
          sr.option &&
          sq.clientJobSurveyQuestionOption &&
          sq.clientJobSurveyQuestionOption.length < 1 &&
          sq.answerType != "ImageSingleSelect" &&
          sq.answerType != "ImageMultiSelect" &&
          sq.answerType != "ReorderImage"
        ) {
          var qoptions = new SurveyQuestionOption();
          qoptions.action = "Go to next question";
          qoptions.fillQuotaId = null;
          sq.clientJobSurveyQuestionOption.push(qoptions);
        }
      });

      sq.clientJobSurveyQuestionOption.sort((a, b) => {
        if (a.order > b.order) return 1;
        else if (a.order < b.order) return -1;
        return 0;
      });
    });
    this.populateMatrixChoiceArray();
  }

  populateMatrixChoiceArray() {
    this.surveyquestions.forEach(sq => {
      if (sq.answerType == "Matrix" || sq.answerType == "SliderRating" || sq.answerType == "RatingScale" || sq.answerType == "Multi SmileyRating") {
        if (sq.matrixHorizontalOptions != null)
          sq.matrixHorizontalOptions.split(",").forEach(ho => {
            if (sq.matrixChoiceArray == null) sq.matrixChoiceArray = [];
            sq.matrixChoiceArray.push({ optionName: ho, questionId: sq.id });
          });
      }
    });

    // this.surveyDiffer = this.differs.find(this.surveyquestions).create();
    // this.hasFormChanges = false;
    if (this.isupdatesurveyquestionsource) {
      this.updateSurveyQuestionSource();
    }
  }

  updateSurveyQuestionSource() {
    setTimeout(() => {
      this.autoSaveSurveyQuestions();
      this.surveyquestionssource = JSON.parse(JSON.stringify(this.surveyquestions));
      this.isupdatesurveyquestionsource = false;
    }, 1000)
  }

  previewSingleQuestion(sqo) {
    var sq = JSON.parse(JSON.stringify(sqo));
    this.viewQuestion = [];

    if (!sq.clientJobSurveyAnswers || sq.clientJobSurveyAnswers.length == 0) {
      sq.clientJobSurveyAnswers = [];
      sq.clientJobSurveyAnswers.push(new SurveyAnswers());
    }

    this.viewQuestion.push(sq);
  }

  getLibQuestions() {
    this.surveyservice.getsurveylibraryquestions()
      .subscribe((res: any) => {
        this.libQuestions = res.value;
        console.log(this.libQuestions);
        if (this.isQuestionLibPage) {
          this.surveyquestions = res.value;
          this.populateSurveyQuestions();
          console.log(this.surveyquestions);
        } else {
          this.libQuestions.forEach(lq => {
            this.surveyQuestionTypes.forEach(sr => {
              if (sr.type == lq.answerType) {
                lq["iconclass"] = sr.iconclass;
                lq["option"] = sr.option;
                lq["isMedia"] = sr.media;
              }
            });
          });
        }
      });
  }

  addQuestionFromLib(lqo) {
    var lq = JSON.parse(JSON.stringify(lqo));
    lq.id = 0;
    lq.clientJobSurveyQuestionOption.forEach(sqo => {
      sqo.id = 0;
    });

    lq.clientJobSurveyQuestionOption.sort((a, b) => {
      if (a.order > b.order) return 1;
      else if (a.order < b.order) return -1;
      return 0;
    })

    console.log(lq);
    this.surveyquestions.push(lq);
    swal("Success!", "Question has been added successfully.", "success");
  }

  previewQuestionNext(viewQuestion) {
    viewQuestion = viewQuestion[0];
    if (
      viewQuestion.isMandatory &&
      !viewQuestion.clientJobSurveyAnswers[0].answer &&
      viewQuestion.answerType != "StaffText"
    ) {
      swal(
        "Oops...",
        "Please answer this question to proceed further.",
        "info"
      );
    }
  }

  /*getAllJobs() {
    this.jobservice.getAllJobs()
      .subscribe(res => {
        this.jobs = res.value;
      });
  }*/

  getJobWithSurveyQuestions() {
    this.surveyservice.getJobWithSurveyQuestions(this.jobId)
      .subscribe((res: any) => {
        console.log(res);
        console.log(this.jobId);
        this.jobs = res.value;
        console.log(this.jobs);
      });
  }

  copySurveyFromJob() {
    console.log(this.copysurveyjobid);
    if (this.copysurveyjobid) {
      this.surveyservice.getSurveyQuestionsbyJobId(this.copysurveyjobid.id)
        .subscribe((res: any) => {
          console.log(res);
          if (res.succeeded) {
            if (res.value && res.value.length > 0)
              swal("Success!", res.value.length + " Question(s) copied successfully", "success");
            else
              swal("Failed!", " Question(s) not found", "success");

            res.value.forEach(re => {
              re.id = 0;
              re.clientJobSurveyQuestionOption.forEach((qo) => {
                qo.id = 0;
              })

              this.surveyquestions.push(re);
            });

            this.surveyquestions.forEach(sq => {
              this.surveyQuestionTypes.forEach(sr => {
                if (sr.type == sq.answerType) {
                  sq["iconclass"] = sr.iconclass;
                  sq["option"] = sr.option;
                }
                if (sr.option && sq.clientJobSurveyQuestionOption && sq.clientJobSurveyQuestionOption.length < 1) {
                  var qoptions = new SurveyQuestionOption();
                  qoptions.action = "Go to next question";
                  qoptions.fillQuotaId = null;
                  sq.clientJobSurveyQuestionOption.push(qoptions);
                }
              });
            });
          } else {
            var err = "";
            res.errors.forEach(er => {
              err = err + " " + er;
            });
            swal("Error!", err, "error");
          }

          this.populateMatrixChoiceArray();
        });
    }
  }

  uploadPictureFile(e, sq) {
    var files = e.files;
    this.sharedservice.uploadFile(files)
      .subscribe((res: any) => {
        res.forEach(url => {
          var sqOptions = new SurveyQuestionOption();
          sqOptions.optionText = url;
          sqOptions.action = "Go to next question";
          sqOptions.fillQuotaId = null;

          if (!sq.SurveyQuestionOption || sq.SurveyQuestionOption.length < 1)
            sq.SurveyQuestionOption = [];

          sq.clientJobSurveyQuestionOption.push(sqOptions);
        });

        console.log(sq);
      });
  }

  uploadFile(e, sq) {
    var files = e.target.files;
    this.sharedservice.uploadFile(files)
      .subscribe((res: any) => {
        console.log(res);
        res.forEach(url => {
          sq.mediaUrl = url;
        });
      });
  }

  getPlaceHolder(answerType) {
    if (answerType == "Videoquestion") return "Video Link";
    else return "Option";
  }

  listFormatter(data: any): string {
    return data["value"];
  }

  addNewQuota() {
    this.jobQuota = new JobQuota();
    this.jobQuota.isSurvey = true;
    this.jobQuota.isScreener = false;
  }

  submitQuota(form) {
    this.isSubmitForm = true;
    this.isSubmitFormSpinner = true;
    if (form.invalid) {
      //this.isSubmitForm = false;
      this.isSubmitFormSpinner = false;
    } else {
      this.jobQuota.jobId = this.jobId;

      if (
        this.jobQuota.remainingPositions == null ||
        this.jobQuota.remainingPositions.toString() == ""
      )
        this.jobQuota.remainingPositions = 0;

      if (
        this.jobQuota.surveyQuotaRequired == null ||
        this.jobQuota.surveyQuotaRequired.toString() == ""
      )
        this.jobQuota.surveyQuotaRequired = 0;
      if (
        this.jobQuota.screenerQuotaRequired == null ||
        this.jobQuota.screenerQuotaRequired.toString() == ""
      )
        this.jobQuota.screenerQuotaRequired = 0;

      console.log(this.jobQuota);
      this.jobservice.updateJobQuota(this.jobQuota)
        .subscribe((res: any) => {
          this.isSubmitFormSpinner = false;
          this.isSubmitForm = false;
          if (res.succeeded) {
            this.closeAddNewModal.nativeElement.click();
            this.getJobQuota(this.jobId);
            //this.router.navigate(['/client']);
            //this.getJobQuota();
          } else {
            var err = "";
            res.errors.forEach(er => {
              err = err + " " + er;
            });
            swal("Error!", err, "error");
          }
        });
    }
  }

  // checkQuotaExist(quotaid){
  //   var found = false;
  //   this.surveyquestions.forEach(sq => {
  //     sq.clientJobSurveyQuestionOption.forEach(qop => {
  //       if(qop.fillQuotaId == quotaid) {found = true; console.log(qop.fillQuotaId); console.log(quotaid);}
  //     })
  //   })
  //
  //   return found;
  // }

  searchLibraryQuestion(quesetionlabel) {
    var ret = false;
    if (this.lqSearchInput == null || this.lqSearchInput == "") ret = true;
    else if (
      quesetionlabel.toLowerCase().search(this.lqSearchInput.toLowerCase()) > -1
    )
      ret = true;
    else ret = false;
    return ret;
  }

  searchSearchQuestion(quesetionlabel) {
    var ret = false;
    if (this.sqSearchInput == null || this.sqSearchInput == "") ret = true;
    else if (
      quesetionlabel.toLowerCase().search(this.sqSearchInput.toLowerCase()) > -1
    )
      ret = true;
    else ret = false;
    return ret;
  }

  generateOptionsFromInput(optiontext, sq, optionindex) {
    console.log(optiontext);
    var split = optiontext.split("\n");
    if (split.length > 1) {
      split.forEach(sp => {
        if (sp != "") {
          var newQuestionOption = new SurveyQuestionOption();
          newQuestionOption.questionId = sq.id;
          newQuestionOption.optionText = sp;
          newQuestionOption.action = "Go to next question";
          newQuestionOption.fillQuotaId = null;

          sq.clientJobSurveyQuestionOption.push(newQuestionOption);
        }
      });
      sq.clientJobSurveyQuestionOption.splice(optionindex, 1);
    }
  }

  alertChangeDetect() {
    var ret = false;
    // console.log(this.surveyquestions);
    /*if (this.surveyquestions && this.surveyquestions.length > 0) {
      this.surveyquestions.forEach(sq => {
        if (sq.id == null || sq.id == 0) ret = true;
      });
    }*/
    if (JSON.stringify(this.surveyquestionssource) != JSON.stringify(this.surveyquestions) || this.isQuestionLibPage) ret = true;
    return ret;
  }

  /*generateVerticalOptionsFromInput(optiontext, sq, mindex) {
    console.log(sq);
    var split = optiontext.split("\n");
    if (split.length > 1) {
      if (sq.matrixHorizontalOptions) {
        var mArrHoOp = [];
        mArrHoOp = sq.matrixHorizontalOptions.split(",");
        split.forEach(sp => {
          mArrHoOp.unshift(sp);
        })

        sq.matrixHorizontalOptions = mArrHoOp.join(",");
      }
    }
  }*/

  changeQuestionAction(qop) {
    console.log(qop);
    if (qop.action != 'Go to specific question' && qop.action != 'Fill Quota (and specific question)') {
      qop.goToQuestionNum = 0;
      qop.fillQuotaId = null;
    }

    if (qop.action != 'Fill Quota (and specific question)') qop.fillQuotaId = null;
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

  checkHasOpenIndex(index) {
    var ret = false;
    var oind = this.openIndexs.indexOf(index);
    if (oind >= 0) ret = true;
    return ret;
  }

  updateOpenIndex(index, action?) {
    if (index == -1) {
      this.openIndexs = [];
      this.surveyquestions.forEach((sq, i) => {
        this.openIndexs.push(i);
      })
    } else if (index == -2) {
      this.openIndexs = [];
    } else {
      if (action == 'add') this.openIndexs.push(index);
      if (action == 'remove') {
        var oind = this.openIndexs.indexOf(index);
        this.openIndexs.splice(oind, 1);
      }
    }
  }

  sqoTrackBy(index, item) {
    return item.order;
  }

  getSurveyQuestionCategories() {
    this.surveyQuestionCategories = [];
    this.surveyservice.getSurveyQuestionCategories()
      .subscribe((res: any) => {
        console.log(res)
        this.surveyQuestionTypes = res.value;
        this.surveyQuestionTypes.forEach((sqt) => {
          var index = this.surveyQuestionCategories.indexOf(sqt.questionCategory);
          if (index < 0) {
            this.surveyQuestionCategories.push(sqt.questionCategory);
          }
        })
      })
  }

  checkHasQuestionType(category) {
    var ret = 0;
    if (category && this.searchquestiontype) {
      this.surveyQuestionTypes.forEach((sqt) => {
        if (sqt.questionType.toLowerCase().includes(this.searchquestiontype.toLowerCase()) && sqt.questionCategory == category)
          ret++;
      })
    }
    return ret;
  }

  clearSearchQuestionType() {
    this.searchquestiontype = null;
    this.addquestioncollapse._results.forEach((aq) => {
      // aq.nativeElement.classList.remove("in");
    })
  }

  addNewQuestion() {
    this.newquestionText = null;
    this.selectedSurveyQuestionType = null;
    this.selectedQuestion = null;
    this.searchquestiontype = null;
    this.addquestioncollapse._results.forEach((aq) => {
      aq.nativeElement.classList.remove("in");
    })
    this.addquestioncollapseIcon._results.forEach((aq) => {
      aq.nativeElement.classList.add("collapsed");
    })
  }

  changeSearchQuestionType() {
    this.addquestioncollapse._results.forEach((aq) => {
      // aq.nativeElement.classList.remove("in");
    })

    setTimeout(() => {
      if (this.addquestioncollapse._results && this.addquestioncollapse._results.length > 0)
        // this.addquestioncollapse._results[0].nativeElement.classList.add("in");
        console.log("in");
    }, 100)
  }

  checkHasSearchQuestionType() {
    var ret = true;
    if (this.searchquestiontype) {
      ret = false;
      this.surveyQuestionTypes.forEach((sqt) => {
        if (sqt.questionType.toLowerCase().includes(this.searchquestiontype.toLowerCase()))
          ret = true;
      })
    }
    return ret;
  }

  autoSaveSurveyQuestions() {
    clearInterval(this.surveysaveinterval);
    this.surveysaveinterval = setInterval(() => {
      /*const changes = this.surveyDiffer.diff(this.surveyquestions);
      if (changes) {
        changes.forEachChangedItem((change) => {
          if (change.currentValue != change.previousValue) {
            console.log(change)
            this.hasFormChanges = true
          }
        });
      }

      if (this.sqform) {
        this.sqform.valueChanges
          .subscribe(data => {
            console.log(data)
            this.hasFormChanges = true
          });
      }

      if (this.hasFormChanges) this.submitQuestions(true);*/
      if (JSON.stringify(this.surveyquestionssource) != JSON.stringify(this.surveyquestions)) {
        console.log("chcnages")
        this.submitQuestions(true);
      }
      // }, 3000)    
    }, 180000)
  }

  updateSelectedQuestionIndex() {
    this.openIndexs.push(this.surveyquestions.length - 1);
    if (typeof jQuery != 'undefined')
      jQuery("html, body").animate({ scrollTop: jQuery(document).height() }, 1000);
  }

  gotoTop() {
    if (typeof jQuery != 'undefined')
      jQuery("html, body").animate({ scrollTop: 0 }, 1000);
  }

  changeQuestionLibMultiselect(event) {
    console.log(event)
    if (event.target.checked) {
      this.questionLibMultiselectIds.push(event.target.value);
    }
    else {
      var index = this.questionLibMultiselectIds.indexOf(event.target.value);
      if (index >= 0)
        this.questionLibMultiselectIds.splice(index, 1);
    }
  }

  checkQuestionLibMultiselect(id) {
    var ret = false;
    var index = this.questionLibMultiselectIds.indexOf(id);
    if (index >= 0)
      ret = true;
    return ret;
  }

  addQuestionFromLibMultiple() {
    this.questionLibMultiselectIds.forEach((libid) => {
      var index = this.libQuestions.findIndex((lq) => lq.id == libid);
      if (index >= 0) {
        var lqo = this.libQuestions[index];
        var lq = JSON.parse(JSON.stringify(lqo));
        lq.id = 0;
        lq.clientJobSurveyQuestionOption.forEach(sqo => {
          sqo.id = 0;
        });

        lq.clientJobSurveyQuestionOption.sort((a, b) => {
          if (a.order > b.order) return 1;
          else if (a.order < b.order) return -1;
          return 0;
        })

        console.log(lq);
        this.surveyquestions.push(lq);
      }
    })
    this.questionLibMultiselectIds = [];
    this.libQuestions.forEach((lq) => {
      jQuery('#checkbox' + lq.id).prop('checked', false);
    })
    console.log(this.questionLibMultiselectIds)
    swal("Success!", "Question has been added successfully.", "success");
  }

  getPlainTextFromHtml(html) {
    var temp = document.createElement("div");
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || "";
  }

  getSystemReferences() {
    this.surveyservice.getSystemReferences()
      .subscribe((res: any) => {
        console.log(res)
        this.mappingEntityList = res.value;
      })
  }

  checkIsMappingEntity(answerType) {
    var ret = false;
    var index = this.surveyQuestionTypes.findIndex((sqt) => sqt.answerType == answerType)
    if (index > 0)
      ret = this.surveyQuestionTypes[index].dataMapping;
    return ret;
  }

  getSecurityRightsSurveyMapReference() {
    this.securityInfoResolve.checkPermission(SecurityRights.SurveyMapReference)
      .subscribe((res: any) => {
        console.log(res)
        this.hasSurveyMapReference = res.succeeded;
      })
  }

  /**QUESTION LIBRARY CHANGES**/
  removeQuestionLibrary(index, id) {
    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this item!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#ffaa00",
      cancelButtonText: "No, keep it"
    }).then(result => {
      if (result.value) {
        this.isDisableDelete = true;
        if (id) {
          this.surveyservice.deletesurveyquestions(id)
            .subscribe((res: any) => {
              if (res.succeeded) this.surveyquestions.splice(index, 1);
              this.updateSurveyQuestionSource();
              this.isDisableDelete = false;
            });
        } else {
          this.surveyquestions.splice(index, 1);
          this.updateSurveyQuestionSource();
          this.isDisableDelete = false;
        }
      } else if (result.dismiss === swal.DismissReason.cancel) {
        swal("Cancelled", "Survey Question is safe :)", "error");
      }
    });
  }

  duplicateQuestionLibrary(index) {
    //this.surveyquestions[index + 1].push(this.surveyquestions[index]);
    //this.surveyquestions.insert(index + 1, this.surveyquestions[index]);
    var quesstr = JSON.stringify(this.surveyquestions[index]);
    var quesjson = JSON.parse(quesstr);
    quesjson.id = 0;
    quesjson.clientJobSurveyQuestionOption.forEach((qo) => {
      qo.id = 0;
      qo.questionId = 0;
    })
    this.surveyquestions.splice(index, 0, quesjson);

    console.log(this.surveyquestions);
  }

  validateSurveyQuestions(isAutoSave) {
    var ret = false;
    var err = [];

    this.surveyquestions.forEach((sq, i) => {
      if (sq.minNumAnswers != null && sq.maxNumAnswers != null) {
        if (sq.minNumAnswers > sq.maxNumAnswers) {
          if (sq.answerType == 'Matrix')
            err.push("Question " + (i + 1) + " Minimum number of answers per row must be less than Maximum number of answers per row");
          else if (sq.answerType == 'Essay')
            err.push("Question " + (i + 1) + " Minimum number of characters must be less than Maximum number of characters");
          else
            err.push("Question " + (i + 1) + " Minimum number of answers must be less than Maximum number of answers");
        }
      }

      if (sq.minNumMatrixColAnswers != null && sq.maxNumMatrixColAnswers != null) {
        if (sq.minNumMatrixColAnswers > sq.maxNumMatrixColAnswers) {
          err.push("Question " + (i + 1) + " Minimum number of answers per column must be less than Maximum number of answers per column");
        }
      }
    });

    if (err.length > 0) {
      if (!isAutoSave)
        swal("Oops!", err.join('. '), "error");
      ret = false;
    } else {
      ret = true;
    }

    return ret;
  }
}
