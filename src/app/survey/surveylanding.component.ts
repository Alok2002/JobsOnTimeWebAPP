import { formatCurrency } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SharedServices } from './../services/shared.services';
import { SurveyServices } from './../services/survey.services';
import swal from 'sweetalert2';
import { environment } from './../../environments/environment';

@Component({
    selector: 'survey-landing-component',
    templateUrl: './surveylanding.component.html',
    styleUrls: ['./surveylanding.component.css', '../../assets/css/disability.css']
})

export class SurveyLandingComponent {
    isFarronResearch = false;
    encodeddata: string;
    landingPageData: any;
    isDecline = false;
    declineOption: string = null;
    errors: Array<string> = [];
    declineSurveyFormError = [];
    declineReason: string;
    respondentId: number;
    jobId: number;
    surveyid: number;
    isSubmitForm = false;
    surveyTheme = environment.surveyTheme;

    constructor(private surveyservices: SurveyServices, private activatedroute: ActivatedRoute,
        private sharedService: SharedServices) { }

    ngOnInit() {
        this.activatedroute.params.subscribe((pr) => {
            if (pr['encodeddata']) {
                this.encodeddata = pr['encodeddata']; //'vbYLxBAIzhm5zMx/b8E27w==' //vbYLxBAIzhm5zMx%2Fb8E27w%3D%3D
                this.getPublicSurveyDecodedValues();
            }
        })
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
                    var resvalue = res.value.split('|');
                    this.respondentId = resvalue[0];
                    this.jobId = resvalue[1];
                    this.surveyid = resvalue[2];
                    this.getSurveyLandingValues();
                }
            })
    }

    getSurveyLandingValues() {
        this.sharedService.getSurveyLandingValues(this.encodeddata)
            .subscribe((res: any) => {
                console.log(res)
                if (res.errors && res.errors.length > 0) {
                    res.errors.forEach((err) => {
                        this.errors.push(err);
                    })
                } else {
                    this.landingPageData = res.value;
                }
            })
    }

    declineSurvey() {
        this.declineSurveyFormError = [];
        if (!this.declineOption)
            this.declineSurveyFormError.push('Select a valid reason')
        else if (this.declineOption == 'Other' && !this.declineReason)
            this.declineSurveyFormError.push('Please specify other reason for decline')
        else if (this.declineOption == 'Other' && this.checkStringLength(this.declineReason) > 50)
            this.declineSurveyFormError.push('Decline reason max character 50')
        else {
            var comment = this.declineOption;
            if (this.declineReason)
                comment = this.declineOption + " - " + this.declineReason;
            this.surveyservices.declineSurvey(this.respondentId, this.jobId, comment)
                .subscribe((res: any) => {
                    console.log(res)
                    if (res.succeeded)
                        window.location.href = "/";
                })
        }

        if (this.declineSurveyFormError.length > 0) {
            swal('Error!', this.declineSurveyFormError[0], 'error')
        }
    }

    checkStringLength(inputstring) {
        if (inputstring != null) {
            var mapstring = new String(inputstring);
            return mapstring.length;
        }
        return 0;
    }
}