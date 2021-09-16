import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SharedServices } from '../services/shared.services';
import { SurveyServices } from '../services/survey.services';

declare var Clipboard: any;
declare var jQuery: any;

@Component({
  selector: "SurveyLibraryQuestionsComponent",
  templateUrl: "./surveylibraryquestions.component.html",
  styleUrls: ["./surveyquestions.component.css"]
})

export class SurveyLibraryQuestionsComponent implements OnInit {
  @Input() surveyId: number;
  @Input() isUpdateSurvey: boolean;
  @Input() jobId: number;
  @Output() surveyQuestionUpdate = new EventEmitter();
  @Output() isDestorySurveyQuestion = new EventEmitter();

  constructor(private surveyservice: SurveyServices, private sharedservice: SharedServices, private securityInfoResolve: SecurityInfoResolve) {
  }

  ngOnInit() {
  }
}
