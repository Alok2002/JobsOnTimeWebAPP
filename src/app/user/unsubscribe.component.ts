import { SharedServices } from './../services/shared.services';
import { SurveyServices } from './../services/survey.services';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Respondent } from '../models/respondent';
import { RespondentServices } from '../services/respondent.services';

@Component({
    selector: 'UnsubscribeComponent',
    templateUrl: './unsubscribe.component.html'
})

export class UnsubscribeComponent implements OnInit {
    encrypt: string;
    respondent: Respondent;
    successMsg = null;
    respondentId: number;
    isFarronResearch = false;

    constructor(private activateroute: ActivatedRoute, private surveyservice: SurveyServices, 
        private respondentservice: RespondentServices, private sharedService: SharedServices) { }

    ngOnInit() {
        this.getIsFarronResearch();
        this.activateroute.params.subscribe(params => {
            if (params['encrypt']) {
                this.encrypt = params['encrypt'];
            }
        })
    }

    unsubscribe() {
        this.successMsg = null;
        this.respondentservice.unsubscribe(this.encrypt)
            .subscribe((res: any) => {
                console.log(res)
                if (res.successMsg) this.successMsg = res.successMsg;
            })
    }

    getIsFarronResearch() {
        this.sharedService.getIsFarronResearch()
          .subscribe((res: any) => {
            this.isFarronResearch = res.value;
          })
      }
}