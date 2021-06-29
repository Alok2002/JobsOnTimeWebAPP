import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Job } from '../models/job';
import { Survey } from '../models/survey';
import { SurveyQuestions } from '../models/surveyquestions';
import { SurveyServices } from '../services/survey.services';
import { JobServices } from '../services/job.services';

@Component({
  selector: 'SurveyAnswersSummaryComponent',
  templateUrl: './surveyanswerssummary.component.html'
})

export class SurveyAnswersSummaryComponent implements OnInit {
  surveyid: number;
  resid: number;
  isLoading = true;
  surveyQuestions: Array<SurveyQuestions>;
  selectedIndex = 0;

  survey: Survey;
  job: Job;

  constructor(private activateroute: ActivatedRoute, private surveyservice: SurveyServices, 
    private jobservice: JobServices) {

  }

  ngOnInit() {
    this.activateroute.params.subscribe(params => {
      if (params['surveyid']) {
        this.surveyid = params['surveyid'];
        this.resid = params['resid'];

        this.getSurveyQuestionAndAnswers();
        this.getSurveyById();
      }
    });
  }

  getSurveyById() {
    this.surveyservice.getSurveyById(this.surveyid)
      .subscribe((res: any) => {
        this.survey = res.value;
        console.log(this.survey);
        this.getJobById(this.survey.clientJobId);
      });
  }

  getSurveyQuestionAndAnswers() {
    this.surveyservice.getSurveyQuestionAndAnswers(this.surveyid, this.resid)
      .subscribe((res: any) => {
        console.log(res);
        this.surveyQuestions = res.value;
        this.isLoading = false;
      });
  }

  getJobById(id) {
    this.jobservice.getJobsByJob(id)
      .subscribe((res: any) => {
        this.job = res.value;
        console.log(res);
      });
  }
}

