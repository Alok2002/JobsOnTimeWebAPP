import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import swal from 'sweetalert2';

import { Respondent } from '../models/respondent';
import { RespondentServices } from '../services/respondent.services';

declare var jQuery: any;

@Component({
    selector: 'ResHealthComponent',
    templateUrl: './reshealth.component.html'
})

export class ResHealthComponent implements OnInit {
    @Input() resId: number;
    @Input() isMyProfile = false;

    allergyList = [];
    dietaryRequirementList = [];
    disabiltyAssistancesList = [];
    opticalIssueList = [];
    fitnessActivityList = [];
    fitnessDevicesList = [];
    healthCoverTypesList = [];
    healthProblemsList = [];
    mentalHealthConditionsList = [];
    healthFundsList = [];
    today = new Date();
    respondent: Respondent;
    isLoading = true;

    constructor(private resService: RespondentServices, @Inject(PLATFORM_ID) public platformId: Object) {
    }

    ngOnInit() {
        this.getRespondentById();
        this.getData();
    }

    getRespondentById() {
        this.resService.getRespondentById(this.resId)
            .subscribe((res: any) => {
                this.respondent = res.value;
            })
    }

    getData() {
        this.resService.getRespondentData('Allergy', this.resId)
            .subscribe((res: any) => {
                console.log(res);
                this.allergyList = res.value;
            });
        this.resService.getRespondentData('DietaryRequirement', this.resId)
            .subscribe((res: any) => {
                console.log(res);
                this.dietaryRequirementList = res.value;
            });
        this.resService.getRespondentData('DisabiltyAssistances', this.resId)
            .subscribe((res: any) => {
                console.log(res);
                this.disabiltyAssistancesList = res.value;
            });
        this.resService.getRespondentData('OpticalIssue', this.resId)
            .subscribe((res: any) => {
                console.log(res);
                this.opticalIssueList = res.value;
            });
        this.resService.getRespondentData('FitnessActivity', this.resId)
            .subscribe((res: any) => {
                console.log(res);
                this.fitnessActivityList = res.value;
            });
        this.resService.getRespondentData('FitnessDevices', this.resId)
            .subscribe((res: any) => {
                console.log(res);
                this.fitnessDevicesList = res.value;
            });
        this.resService.getRespondentData('HealthCoverTypes', this.resId)
            .subscribe((res: any) => {
                console.log(res);
                this.healthCoverTypesList = res.value;
            });
        this.resService.getRespondentData('HealthFunds', this.resId)
            .subscribe((res: any) => {
                console.log(res);
                this.healthFundsList = res.value;
            });
        this.resService.getRespondentData('HealthProblems', this.resId)
            .subscribe((res: any) => {
                console.log(res);
                this.healthProblemsList = res.value;
            });
        this.resService.getRespondentData('MentalHealthConditions', this.resId)
            .subscribe((res: any) => {
                console.log(res);
                this.mentalHealthConditionsList = res.value;

                setTimeout(() => {
                    this.isLoading = false;
                }, 500);
            });
    }

    /*updateChekBoxValues(index: number, e) {
        if (e.target.checked) {
            this.optical[index].selected = true;
        }
        else {
            this.optical[index].selected = false;
        }
        console.log(this.optical);
    }*/

    updateSubmit() {
        /*var resRefDataList = [];
        resRefDataList.push({'type':'Allergy', 'value': this.allergyList});
        //resRefDataList.push({'type':'DietaryRequirement', 'value': this.dietaryRequirementList});

        this.resService.updateReferenceDataList(resRefDataList, this.resId)
            .subscribe(res => {
                console.log(res);
            });*/

        this.resService.updateReferenceData('Allergy', this.allergyList, this.resId)
            .subscribe(res => {
                console.log(res);
            });

        this.resService.updateReferenceData('DietaryRequirement', this.dietaryRequirementList, this.resId)
            .subscribe(res => {
                console.log(res);
            });

        this.resService.updateReferenceData('DisabiltyAssistances', this.disabiltyAssistancesList, this.resId)
            .subscribe(res => {
                console.log(res);
            });

        this.resService.updateReferenceData('FitnessActivity', this.fitnessActivityList, this.resId)
            .subscribe(res => {
                console.log(res);
            });
        this.resService.updateReferenceData('FitnessDevices', this.fitnessDevicesList, this.resId)
            .subscribe(res => {
                console.log(res);
            });
        this.resService.updateReferenceData('HealthFunds', this.healthFundsList, this.resId)
            .subscribe(res => {
                console.log(res);
            });
        this.resService.updateReferenceData('HealthCoverTypes', this.healthCoverTypesList, this.resId)
            .subscribe(res => {
                console.log(res);
            });
        this.resService.updateReferenceData('HealthProblems', this.healthProblemsList, this.resId)
            .subscribe(res => {
                console.log(res);
            });
        this.resService.updateReferenceData('MentalHealthConditions', this.mentalHealthConditionsList, this.resId)
            .subscribe(res => {
                console.log(res);
            });
        this.resService.updateReferenceData('OpticalIssue', this.opticalIssueList, this.resId)
            .subscribe(res => {
                console.log(res);
            });
        this.resService.updateRespondent(this.respondent)
            .subscribe((res: any) => {
                console.log(res);

                if (res.succeeded) {
                    swal(
                        'Successfully Saved!',
                        '',
                        'success'
                    );
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
                this.respondent = res.value;
            });
    }

    gotoTop() {
        if (isPlatformBrowser(this.platformId)) {
            window.scrollTo(0, 0)
        }
    }
}