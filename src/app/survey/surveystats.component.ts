import { Component, OnInit, Input } from '@angular/core';
import {SurveyServices} from "../services/survey.services";
import {ActivatedRoute} from "@angular/router";
import {Survey} from "../models/survey";

@Component({
  selector: 'SurveyStatsComponent',
  templateUrl: './surveystats.component.html'
})

export class SurveyStatsComponent implements OnInit {
  @Input() surveyId: number;
  @Input() isUpdateSurvey: boolean;
  survey: Survey;
  isLoading = true;

  surveyStats = {numberOfInvitees: "", numberOfCompleteAnswers: "",
                numberOfNotQualifiedAnswers: "", numberOfStartedAnswers:"",     
                numberStartedDidNotFinish: "", numberOfSMSInvites: ""};

  constructor(private surveyservice: SurveyServices, private activateroute: ActivatedRoute) { }

  ngOnInit() {
      console.log("inside stats");
      console.log(this.surveyId);
    this.activateroute.params.subscribe(params => {
      if (params['surveyid']) {
        this.surveyId = params['surveyid'];

        this.getStats(this.surveyId);
      }
    });
  }

  /*getSurveyById() {
    this.surveyservice.getSurveyById(this.surveyId)
      .subscribe((res) => {
        console.log(res);
        this.survey = res.value;
        this.getStats(this.survey.id);
      });
  }*/

  getStats(sid) {
    this.surveyservice.getStatsbySurveyId(sid)
      .subscribe((res: any) => {
        console.log(res);
        this.surveyStats = res.value;
        this.isLoading = false;
      });
  }
}