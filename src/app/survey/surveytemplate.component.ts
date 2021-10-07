import { DragulaService } from 'ng2-dragula';
import { SurveyServices } from './../services/survey.services';
import { ShareService } from '@ngx-share/core';
import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { SurveyQuestions } from "../models/surveyquestions";
import { SurveyAnswers } from "../models/surveyanswers";
import { DomSanitizer } from '@angular/platform-browser';
import { SharedServices } from '../services/shared.services';
import { Options, ChangeContext, PointerType } from 'ng5-slider';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { isMobile } from '../app.component';

declare var jQuery: any;
declare var window: any;

@Component({
  selector: 'SurveyTemplateComponent',
  templateUrl: './surveytemplate.component.html',
  styleUrls: ['../../assets/css/disability.css']
})

export class SurveyTemplateComponent implements OnInit {
  @Input() surveyQuestions: Array<SurveyQuestions>;
  @Input() selectedIndex: number;
  @Input() isPreview: boolean;
  @Output() gotoNextQuestion = new EventEmitter();

  matrixContent = [];
  matrixKey = [];
  sliderOptions: Options = {
    showTicksValues: true,
    stepsArray: [],
    draggableRange: false
  }
  hasScrollbar = false;
  slider: any;
  countrycode: string = 'AU';

  addressName: string;
  addressStreet: string;
  isMobile = isMobile;

  @Input() isScreen: boolean = false;

  constructor(public sanitizer: DomSanitizer, private sharedservice: SharedServices, private surveyservice: SurveyServices,
    private dragularservice: DragulaService) {
    // const container = document.querySelector('.survey-template');
    // const dragula = window.dragula([container]);
    // container.addEventListener('touchmove', event => event.preventDefault());
    dragularservice.drag()
      .subscribe((res: any) => {
        console.log(res)
      })
  }

  ngOnInit() {
    console.log(this.surveyQuestions);
    console.log(this.selectedIndex);
    if (this.surveyQuestions != null && this.surveyQuestions.length > 0) {
      this.surveyQuestions.forEach(sq => {
        if (sq.clientJobSurveyQuestionOption != null && sq.clientJobSurveyQuestionOption.length > 0)
          sq.clientJobSurveyQuestionOption.sort((a, b) => {
            if (a.order > b.order) return 1;
            else if (a.order < b.order) return -1;
            return 0;
          })
      })
    }
  }

  ngOnChanges() {
    if (this.surveyQuestions[this.selectedIndex].answerType == 'Matrix' ||
      this.surveyQuestions[this.selectedIndex].answerType == 'RatingScale' ||
      this.surveyQuestions[this.selectedIndex].answerType == 'Multi SmileyRating')
      this.getMatrixHeader(this.surveyQuestions[this.selectedIndex]);
    if (this.surveyQuestions != null && this.selectedIndex != null &&
      this.surveyQuestions[this.selectedIndex].answerType == 'SliderRating') {
      if (this.surveyQuestions[this.selectedIndex].matrixHorizontalOptions) {
        this.surveyQuestions[this.selectedIndex].matrixChoiceArray = [];
        this.surveyQuestions[this.selectedIndex].matrixHorizontalOptions.split(',').forEach((mho) => {
          this.surveyQuestions[this.selectedIndex].matrixChoiceArray.push({ optionName: mho, questionId: this.surveyQuestions[this.selectedIndex].id })
        })
        this.getSliderOptions(this.surveyQuestions[this.selectedIndex].matrixChoiceArray);
        if (!this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers ||
          !this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers[0].hasOwnProperty('questionId') ||
          this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers.length == 0) {
          this.populateSliderAutoAnswer();
        }
      }
    }
    this.checkScrollbar();
    if (this.surveyQuestions != null && this.selectedIndex != null &&
      (this.surveyQuestions[this.selectedIndex].answerType == 'ReorderImage' ||
        this.surveyQuestions[this.selectedIndex].answerType == 'ReorderOptions')) {
      this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers.forEach((sa, i) => {
        var index = this.surveyQuestions[this.selectedIndex].clientJobSurveyQuestionOption.findIndex((so) => so.optionText == sa.answer);
        if (index >= 0)
          this.surveyQuestions[this.selectedIndex].clientJobSurveyQuestionOption[index].order = (i + 1);
      });
      this.surveyQuestions[this.selectedIndex].clientJobSurveyQuestionOption.sort((a, b) => {
        if (a.order > b.order) return 1;
        else if (a.order < b.order) return -1;
        return 0;
      });
    }
    if (this.surveyQuestions != null && this.selectedIndex != null &&
      (this.surveyQuestions[this.selectedIndex].answerType == 'AddressText')) {
      if (this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers.length > 0 &&
        this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers[0].answer) {
        var addArr = this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers[0].answer.split('|');
        if (addArr && addArr.length > 0)
          this.addressName = addArr[0];
        if (addArr && addArr.length > 1)
          this.addressStreet = addArr[1];
      }
    }
  }

  multiSelectClick(surveyQuestion, op) {
    var optionText = op.optionText;
    var surveyAns = new SurveyAnswers();
    surveyAns.questionId = this.surveyQuestions[this.selectedIndex].id;
    surveyAns.respondentId = 114518;
    surveyAns.answer = optionText;
    surveyAns.order = op.order;

    var found = false;
    if (surveyQuestion.clientJobSurveyAnswers && surveyQuestion.clientJobSurveyAnswers.length > 0) {
      surveyQuestion.clientJobSurveyAnswers.forEach((ans, i) => {
        if (ans.answer == optionText) {
          if (surveyQuestion.clientJobSurveyAnswers[i] && surveyQuestion.clientJobSurveyAnswers[i].id) {
            this.deleteSurveyAnswerById(surveyQuestion.clientJobSurveyAnswers[i].id);
          }
          surveyQuestion.clientJobSurveyAnswers.splice(i, 1);
          found = true;
        }
      });
      if (!found) surveyQuestion.clientJobSurveyAnswers.push(surveyAns);
    } else {
      surveyQuestion.clientJobSurveyAnswers = [];
      surveyQuestion.clientJobSurveyAnswers.push(surveyAns);
    }
    surveyQuestion.clientJobSurveyAnswers.sort((a, b) => {
      if (a.order > b.order) return 1;
      else if (a.order < b.order) return -1;
      return 0;
    });

    console.log(surveyQuestion);
  }

  checkMultiSelect(surveyQuestion, option) {
    // console.log("check multiselect");
    var found = false;

    if (surveyQuestion.clientJobSurveyAnswers && surveyQuestion.clientJobSurveyAnswers.length > 0)
      surveyQuestion.clientJobSurveyAnswers.forEach((ans) => {
        if (ans.answer == option)
          found = true;
      });

    return found;
  }

  /**MATRIX************/
  getMatrixHeader(sq) {
    console.log("inside getmat");
    /*var obj1 = [];
    sq.matrixHorizontalOptions.split(',').forEach((th) => {
      var obj = [];
      sq.clientJobSurveyQuestionOption.forEach((qo) => {
        var key = th + "-" + qo.id;
        this.matrixContent[key] = qo;

        obj.push(key);
      });

      obj1.push(obj);

console.log(obj);
    });*/

    var obj1 = [];
    sq.clientJobSurveyQuestionOption.forEach((qo) => {
      var obj = [];
      sq.matrixHorizontalOptions.split(',').forEach((th) => {
        var key = th + "," + qo.id;
        this.matrixContent[key] = qo;

        obj.push(key);
      });

      obj1.push(obj);
      console.log(obj);
    });


    this.matrixKey = obj1;
    this.matrixKey.forEach((mk) => {
      mk.push(mk[0]);
    });
    console.log(this.matrixContent);
    console.log(obj1);
  }

  clickMatrixOption(header, optiondata, answertype) {
    console.log(header);
    console.log(option);
    console.log(optiondata);
    var option = optiondata.optionText;

    var headerArr = header.split(',');
    headerArr.splice(-1, 1);

    header = headerArr.toString();
    console.log(header);

    var answer = option + ":" + header;
    if (!this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers)
      this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers = [];
    else {
      var found = false;
      this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers.forEach((ans, i) => {
        if (ans.answer == answer) {
          if (this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers[i] && this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers[i].id) {
            this.deleteSurveyAnswerById(this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers[i].id);
          }
          this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers.splice(i, 1);
          found = true;
        }
      });
      if (!found) {
        var surveyAns = new SurveyAnswers();
        surveyAns.questionId = this.surveyQuestions[this.selectedIndex].id;
        surveyAns.respondentId = 114518;
        surveyAns.answer = answer;
        surveyAns.order = optiondata.order;

        if (answertype == 'SliderRating') {
          this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers.forEach((sqa, i) => {
            if (sqa.answer) {
              var opt = sqa.answer.split(':')[0];
              if (opt == option) {
                if (this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers[i] && this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers[i].id) {
                  this.deleteSurveyAnswerById(this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers[i].id);
                }
                this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers.splice(i, 1);
              }
            }
          })
        }

        if (this.surveyQuestions[this.selectedIndex].answerType == 'Multi SmileyRating') {
          this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers.forEach((sqa, i) => {
            console.log(sqa.answer)
            console.log(opt)
            if (sqa.answer) {
              var opt = sqa.answer.split(':')[0];
              if (opt == option) {
                if (this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers[i] && this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers[i].id) {
                  this.deleteSurveyAnswerById(this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers[i].id);
                }
                this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers.splice(i, 1);
              }
            }
          })
        }

        this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers.push(surveyAns);

        this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers.sort((a, b) => {
          if (a.order > b.order) return 1;
          else if (a.order < b.order) return -1;
          return 0;
        });

        console.log(this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers);
      }
    }
  }

  isCheckCheckBox(header, option) {
    var ret = false;
    var headerArr = header.split(',');
    headerArr.splice(-1, 1);

    header = headerArr.toString();
    var answer = option + ":" + header;

    this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers.forEach(ans => {
      if (answer == ans.answer) {
        ret = true;
      }
    });

    return ret;
  }

  checkIfOtherSpecify(answer) {
    var ret = false;
    if (answer && answer.toLowerCase().includes('please specify'))
      ret = true;
    return ret;
  }

  checkIfOtherSpecifyAnswerSelected(clientJobSurveyAnswers) {
    var ret = false;
    clientJobSurveyAnswers.forEach(an => {
      if (an.answer && an.answer.toLowerCase().includes('please specify'))
        ret = true;
    })
    return ret;
  }

  getMultiselectOptherSpecifyIndex() {
    var ret = 0;
    if (this.surveyQuestions[this.selectedIndex] && this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers) {
      this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers.forEach((sa, i) => {
        if (sa.answer && sa.answer.toLowerCase() == 'other (please specify)')
          ret = i;
      });
    }

    return ret;
  }

  /********VERSION2.0 Question */
  /********VERSION2.0 Question */
  /********VERSION2.0 Question */
  buttonSingleSelectClick(surveyQuestion, op) {
    surveyQuestion.clientJobSurveyAnswers = [];
    var optionText = op.optionText;
    var surveyAns = new SurveyAnswers();
    surveyAns.questionId = this.surveyQuestions[this.selectedIndex].id;
    surveyAns.respondentId = 114518;
    surveyAns.answer = optionText;
    surveyAns.order = op.order;

    var found = false;
    if (surveyQuestion.clientJobSurveyAnswers && surveyQuestion.clientJobSurveyAnswers.length > 0) {
      surveyQuestion.clientJobSurveyAnswers.forEach((ans, i) => {
        if (ans.answer == optionText) {
          if (surveyQuestion.clientJobSurveyAnswers[i] && surveyQuestion.clientJobSurveyAnswers[i].id) {
            this.deleteSurveyAnswerById(surveyQuestion.clientJobSurveyAnswers[i].id);
          }
          surveyQuestion.clientJobSurveyAnswers.splice(i, 1);
          found = true;
        }
      });
      if (!found) surveyQuestion.clientJobSurveyAnswers.push(surveyAns);
    } else {
      surveyQuestion.clientJobSurveyAnswers = [];
      surveyQuestion.clientJobSurveyAnswers.push(surveyAns);
    }
    surveyQuestion.clientJobSurveyAnswers.sort((a, b) => {
      if (a.order > b.order) return 1;
      else if (a.order < b.order) return -1;
      return 0;
    });

    console.log(surveyQuestion);
  }

  uploadFile(e) {
    var file = e.target.files[0]; //this.attachment.nativeElement.files[0]; //        
    var files = [];
    files.push(file);

    console.log(files)
    this.surveyservice.uploadSurveyFiles(files)
      .subscribe((res: any) => {
        console.log(res);
        if (res && res.length > 0) {
          this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers = [];
          var optionText = res[0];
          var surveyAns = new SurveyAnswers();
          surveyAns.questionId = this.surveyQuestions[this.selectedIndex].id;
          surveyAns.respondentId = 114518;
          surveyAns.answer = optionText;

          this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers.push(surveyAns);
        }
      });
  }

  reorderChangeEvent(event) {
    this.surveyQuestions[this.selectedIndex].clientJobSurveyQuestionOption = [];
    this.surveyQuestions[this.selectedIndex].clientJobSurveyQuestionOption = JSON.parse(JSON.stringify(event));
    this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers = [];
    event.forEach((ev) => {
      var surveyAns = new SurveyAnswers();
      surveyAns.questionId = this.surveyQuestions[this.selectedIndex].id;
      surveyAns.respondentId = 114518;
      surveyAns.answer = ev.optionText;

      this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers.push(surveyAns);
    })
    console.log(this.surveyQuestions[this.selectedIndex].clientJobSurveyQuestionOption)
  }

  trackByIdx(index: number, obj: any): any {
    return index;
  }

  getReorderIndex(optionText) {
    var ret = 0;
    if (this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers)
      ret = this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers.findIndex(qo => qo.answer == optionText) + 1;
    return ret;
  }

  selectButtonRating(op, rt) {
    if (!this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers ||
      !this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers[0].hasOwnProperty('questionId'))
      this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers = [];
    var surveyAns = new SurveyAnswers();
    surveyAns.questionId = this.surveyQuestions[this.selectedIndex].id;
    surveyAns.respondentId = 114518;
    surveyAns.answer = op.optionText + ":" + rt;
    surveyAns.order = op.order;

    this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers.forEach((ca, i) => {
      var ansArr = ca.answer.split(':')[0];
      if (ansArr == op.optionText) {
        if (this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers[i] && this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers[i].id) {
          this.deleteSurveyAnswerById(this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers[i].id);
        }
        this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers.splice(i, 1);
      }
    })

    this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers.push(surveyAns);
    this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers.sort((a, b) => {
      if (a.order > b.order) return 1;
      if (a.order < b.order) return -1;
      return 0;
    })

    console.log(this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers)
  }

  checkButtonRatingSelection(optionText, rt) {
    var ret = false;
    if (this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers &&
      this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers.length > 0) {
      this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers.forEach((ca) => {
        if (ca.answer == (optionText + ":" + rt)) ret = true;
      })
    }
    return ret;
  }

  getSliderOptions(arr) {
    this.sliderOptions.stepsArray = [];
    arr.forEach((ar, i) => {
      var op = { value: i, legend: ar.optionName };
      this.sliderOptions.stepsArray.push(op);
    })
  }

  populateSliderAutoAnswer() {
    var valuedata = { value: 0 };
    this.surveyQuestions[this.selectedIndex].clientJobSurveyQuestionOption.forEach((so) => {
      this.sliderRatingChange(valuedata, so);
    })
  }

  checkScrollbar() {
    this.hasScrollbar = false;
    if (typeof jQuery != 'undefined') {
      setTimeout(() => {
        if (jQuery("#scroll-content")[0] && jQuery("#scroll-content")[0].scrollWidth > jQuery("#scroll-content").innerWidth())
          this.hasScrollbar = true;
      }, 100);
    }
  }

  sliderRatingChange(valuedata, op) {
    var value = this.sliderOptions.stepsArray[valuedata.value].legend;
    if (!this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers ||
      !this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers[0].hasOwnProperty('questionId'))
      this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers = [];
    var surveyAns = new SurveyAnswers();
    surveyAns.questionId = this.surveyQuestions[this.selectedIndex].id;
    surveyAns.respondentId = 114518;
    surveyAns.answer = op.optionText + ":" + value;
    surveyAns.order = op.order;

    this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers.forEach((ca, i) => {
      var ansArr = ca.answer.split(':')[0];
      console.log(ansArr);
      console.log(op);
      console.log(ca);
      if (ansArr == op.optionText) {
        if (this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers[i] && this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers[i].id) {
          this.deleteSurveyAnswerById(this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers[i].id);
        }
        this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers.splice(i, 1);
      }
    })

    this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers.push(surveyAns);
    this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers.sort((a, b) => {
      if (a.order > b.order) return 1;
      if (a.order < b.order) return -1;
      return 0;
    })
    console.log(this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers)
  }

  getSliderValue(optext) {
    var ret = -1;
    var soption = null;
    if (this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers &&
      this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers[0].hasOwnProperty('questionId')) {
      this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers.forEach((ca, i) => {
        var ansArr = ca.answer.split(':')[0];
        if (ansArr == optext)
          soption = ca.answer.split(':')[1];
      })
    }
    if (soption) {
      ret = this.sliderOptions.stepsArray.findIndex((sr) => sr.legend == soption);
    }
    return ret;
  }

  getMultiStarRatingValue(optionText) {
    var ret = -1;
    if (this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers &&
      this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers.length > 0) {
      this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers.forEach((ca) => {
        if (ca.answer == (optionText + ":" + 1)) ret = 1;
        if (ca.answer == (optionText + ":" + 2)) ret = 2;
        if (ca.answer == (optionText + ":" + 3)) ret = 3;
        if (ca.answer == (optionText + ":" + 4)) ret = 4;
        if (ca.answer == (optionText + ":" + 5)) ret = 5;
      })
    }
    return ret;
  }

  getCountryCode() {
    if (typeof window != 'undefined') {
      if (window.location.hostname.toLowerCase().indexOf('prime') > -1) {
        this.countrycode = 'NZ';
      }
    }
  }

  getPlainTextFromHtml(html) {
    var temp = document.createElement("div");
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || "";
  }

  handleAddressChange(event: Address) {
    // this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers[0].answer = event.formatted_address;
    this.addressStreet = event.formatted_address;
  }

  getMultiTextValue(optext) {
    var ret = "";
    this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers.forEach((ca, i) => {
      if (ca.answer) {
        var ansArr = ca.answer.split(':')[0];
        if (ansArr == optext)
          ret = ca.answer.split(':')[1];
      }
    })
    return ret;
  }

  updateAddressTypeAnswer() {
    this.surveyQuestions[this.selectedIndex].clientJobSurveyAnswers[0].answer = this.addressName + "|" + this.addressStreet;
  }

  deleteSurveyAnswerById(said) {
    this.surveyservice.deleteSurveyAnswerById(said, this.isScreen)
      .subscribe((res: any) => {
        console.log(res)
      })
  }
}
