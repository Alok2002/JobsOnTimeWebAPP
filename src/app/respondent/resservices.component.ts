import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import swal from 'sweetalert2';

import { Respondent } from '../models/respondent';
import { RespondentServices } from '../services/respondent.services';

declare var jQuery: any;

@Component({
    selector: 'ResServicesComponent',
    templateUrl: './resservices.component.html'
})

export class ResServicesComponent implements OnInit {
    @Input() resId: number;
    @Input() isMyProfile = false;

    isLoading = true;
    respondent: Respondent;
    solarQuestionsList = [];
    servicesTypeList = [];
    energyProvidersList = [];
    today = new Date();

    constructor(private respondentservice: RespondentServices, @Inject(PLATFORM_ID) public platformId: Object) {
    }

    ngOnInit() {
        if (this.resId) {
            this.respondentservice.getRespondentById(this.resId)
                .subscribe((res: any) => {
                    this.respondent = res.value;
                });
        }
        else {
            this.respondent = new Respondent();
        }

        this.getData();
    }

    getData() {
        this.respondentservice.getRespondentData('EnergyProvider', this.resId)
            .subscribe((res: any) => {
                console.log(res);
                this.energyProvidersList = res.value;
            });
        this.respondentservice.getRespondentData('ServicesType', this.resId)
            .subscribe((res: any) => {
                console.log(res);
                this.servicesTypeList = res.value;
            });
        this.respondentservice.getRespondentData('SolarQuestions', this.resId)
            .subscribe((res: any) => {
                console.log(res);
                this.solarQuestionsList = res.value;

                this.isLoading = false;
            });
    }

    updateSubmit() {
        // this.respondentservice.updateReferenceData('energyprovider', this.energyproviderlist, this.resId)
        //     .subscribe(res => {
        //         console.log(res);
        //         if(res.succeeded)
        //         swal(
        //           'Successfully Saved!',
        //           '',
        //           'success'
        //         )
        //     })

        this.respondentservice.updateReferenceData('EnergyProvider', this.energyProvidersList, this.resId)
            .subscribe(res => {
                console.log(res);
            });

        this.respondentservice.updateReferenceData('ServicesType', this.servicesTypeList, this.resId)
            .subscribe(res => {
                console.log(res);
            });

        this.respondentservice.updateReferenceData('SolarQuestions', this.solarQuestionsList, this.resId)
            .subscribe(res => {
                console.log(res);
            });

        this.respondentservice.updateRespondent(this.respondent)
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
            });
    }

    gotoTop() {
        if (isPlatformBrowser(this.platformId)) {
            window.scrollTo(0, 0)
        }
    }
}
