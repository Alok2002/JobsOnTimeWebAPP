import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { mobileMask, mobilePattern, postcodeMask } from '../app.component';

import { SharedServices } from './../services/shared.services';
import { SurveyServices } from './../services/survey.services';

@Component({
    selector: 'survey-revert-changes',
    templateUrl: './surveyrevertchanges.component.html',
    styleUrls: ['./surveyrevertchanges.component.css']
})

export class SurveyRevertChangesComponent {
    encodeddata: string;
    revertChanges: any;
    errors: Array<string> = [];
    isFarronResearch = false;

    constructor(private surveyservices: SurveyServices, private activatedroute: ActivatedRoute,
        private sharedService: SharedServices, private router: Router) { }

    ngOnInit() {
        this.activatedroute.params.subscribe((pr) => {
            if (pr['encodeddata']) {
                this.encodeddata = pr['encodeddata'];
                this.getRevertChange();
            }
        })
    }

    getRevertChange() {
        this.surveyservices.revertChange(this.encodeddata)
            .subscribe((res: any) => {
                console.log(res)
                this.errors = res.errors
                this.revertChanges = res;
            })
    }
}