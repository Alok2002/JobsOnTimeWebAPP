import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import swal from 'sweetalert2';

import { Respondent } from '../models/respondent';
import { RespondentServices } from '../services/respondent.services';

declare var jQuery: any;

@Component({
    selector: 'ResInsuranceComponent',
    templateUrl: './resinsurance.component.html'
})

export class ResInsuranceComponent implements OnInit {
    @Input() resId: number;
    @Input() isMyProfile = false;
    govtSubsidyPaymentsList = [];
    insuranceTypeList = [];
    insuranceList = [];
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
        this.resService.getRespondentData('GovtSubsidyPayments', this.resId)
            .subscribe((res: any) => {
                console.log(res);
                this.govtSubsidyPaymentsList = res.value;
            });
        this.resService.getRespondentData('InsuranceType', this.resId)
            .subscribe((res: any) => {
                console.log(res);
                this.insuranceTypeList = res.value;
            });
        this.resService.getRespondentData('Insurance', this.resId)
            .subscribe((res: any) => {
                console.log(res);
                this.insuranceList = res.value;

                this.isLoading = false;
            });
    }

    updateSubmit() {
        this.resService.updateReferenceData('GovtSubsidyPayments', this.govtSubsidyPaymentsList, this.resId)
            .subscribe(res => {
                console.log(res);
            });

        this.resService.updateReferenceData('InsuranceType', this.insuranceTypeList, this.resId)
            .subscribe(res => {
                console.log(res);
            });

        this.resService.updateReferenceData('Insurance', this.insuranceList, this.resId)
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
