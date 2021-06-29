import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { mobileMask, mobilePattern, postcodeMask } from '../app.component';

import { SharedServices } from './../services/shared.services';
import { SurveyServices } from './../services/survey.services';

@Component({
    selector: 'survey-welcome-component',
    templateUrl: './surveywelcome.component.html',
    styleUrls: ['./surveywelcome.component.css']
})

export class SurveyWelcomeComponent {
    isFarronResearch = false;
    encodeddata: string;
    welcomePageData: any;
    isSubmitForm = false;
    mobileMask = mobileMask;
    mobilePattern = mobilePattern;
    editFields = [];
    errors = [];
    jobId: number;
    postcodeMask = postcodeMask;

    constructor(private surveyservices: SurveyServices, private activatedroute: ActivatedRoute,
        private sharedService: SharedServices, private router: Router) { }

    ngOnInit() {
        this.activatedroute.params.subscribe((pr) => {
            if (pr['encodeddata']) {
                this.encodeddata = pr['encodeddata'];
                this.getSurveyWelcomeValues();
            }
        })
    }

    getSurveyWelcomeValues() {
        this.sharedService.getSurveyWelcomeValues(this.encodeddata)
            .subscribe((res: any) => {
                console.log(res)
                this.welcomePageData = res.value;
                if (res.errors && res.errors.length > 0)
                    this.errors = res.errors;
                this.getPublicSurveyDecodedValues();
            })
    }

    unmask(value) {
        var ret = value.replace(/\D+/g, '');
        return ret;
    }

    isEnableEdit(field) {
        var ret = false;
        var index = this.editFields.indexOf(field);
        if (index >= 0)
            ret = true;
        return ret;
    }

    addToEditFields(field) {
        var index = this.editFields.indexOf(field);
        if (index < 0)
            this.editFields.push(field);
    }

    saveAndContinue(form) {
        this.isSubmitForm = true;
        if (form.valid) {
            this.router.navigate(['/survey/survey-start', this.welcomePageData.startSurveyToken]);
        }
    }

    getPublicSurveyDecodedValues() {
        this.surveyservices.getPublicSurveyDecodedValues(this.encodeddata)
            .subscribe((res: any) => {
                console.log(res)
                if (res.errors && res.errors.length > 0) {
                    res.errors.forEach((err) => {
                        this.errors.push(err);
                    })
                } else {
                    if (res.value && res.value.split('|').length > 0)
                        this.jobId = res.value.split('|')[1];
                }
            })
    }
}