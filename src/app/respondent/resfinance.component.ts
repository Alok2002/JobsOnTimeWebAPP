import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import swal from 'sweetalert2';

import { Respondent } from '../models/respondent';
import { RespondentServices } from '../services/respondent.services';

declare var jQuery: any;

@Component({
    selector: 'ResFinanceComponent',
    templateUrl: './resfinance.component.html'
})

export class ResFinanceComponent implements OnInit {
    @Input() resId: number;
    @Input() isMyProfile = false;

    isLoading = true;
    respondent: Respondent;

    bankProductsList = [];
    banksList = [];
    creditUnionsList = [];
    investmentList = [];
    paymentMethodsList = [];
    secondIncomePlatformsList = [];
    superannuationList = [];
    today = new Date();

    constructor(private respondentservice: RespondentServices,
        @Inject(PLATFORM_ID) public platformId: Object) { }

    ngOnInit() {
        if (this.resId) {
            this.respondentservice.getRespondentById(this.resId)
                .subscribe((res: any) => {
                    this.respondent = res.value;
                    console.log(this.respondent);
                })
        }
        else {
            this.respondent = new Respondent();
        }

        this.getData();
    }

    getData() {
        this.isLoading = true;
        this.respondentservice.getRespondentData('BankProducts', this.resId)
            .subscribe((res: any) => {
                this.bankProductsList = res.value;
                console.log(res);
            })

        this.respondentservice.getRespondentData('Banks', this.resId)
            .subscribe((res: any) => {
                this.banksList = res.value;
                console.log(res);
            })

        this.respondentservice.getRespondentData('CreditUnions', this.resId)
            .subscribe((res: any) => {
                this.creditUnionsList = res.value;
                console.log(res);
            })

        this.respondentservice.getRespondentData('Investment', this.resId)
            .subscribe((res: any) => {
                this.investmentList = res.value;
                console.log(res);
            })

        this.respondentservice.getRespondentData('PaymentMethods', this.resId)
            .subscribe((res: any) => {
                this.paymentMethodsList = res.value;
                console.log(res);
            })

        this.respondentservice.getRespondentData('SecondIncomePlatforms', this.resId)
            .subscribe((res: any) => {
                this.secondIncomePlatformsList = res.value;
                console.log(res);
            })

        this.respondentservice.getRespondentData('Superannuation', this.resId)
            .subscribe((res: any) => {
                this.superannuationList = res.value;
                console.log(res);

                setTimeout(() => {
                    this.isLoading = false;
                }, 500);
            })
    }

    updateSubmit() {
        this.respondentservice.updateRespondent(this.respondent)
            .subscribe((res: any) => {
                console.log(res);
            })

        this.respondentservice.updateReferenceData('BankProducts', this.bankProductsList, this.resId)
            .subscribe((res: any) => {
                console.log(res);
            });

        this.respondentservice.updateReferenceData('Banks', this.banksList, this.resId)
            .subscribe((res: any) => {
                console.log(res);
            });

        this.respondentservice.updateReferenceData('CreditUnions', this.creditUnionsList, this.resId)
            .subscribe((res: any) => {
                console.log(res);
            });

        this.respondentservice.updateReferenceData('Investment', this.investmentList, this.resId)
            .subscribe((res: any) => {
                console.log(res);
            });

        this.respondentservice.updateReferenceData('PaymentMethods', this.paymentMethodsList, this.resId)
            .subscribe((res: any) => {
                console.log(res);
            });

        this.respondentservice.updateReferenceData('SecondIncomePlatforms', this.secondIncomePlatformsList, this.resId)
            .subscribe((res: any) => {
                console.log(res);
            });

        this.respondentservice.updateReferenceData('Superannuation', this.superannuationList, this.resId)
            .subscribe((res: any) => {
                console.log(res);
                if (res.succeeded) {
                    swal(
                        'Successfully Saved!',
                        '',
                        'success'
                    )
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
