import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import swal from 'sweetalert2';
import { Respondent } from '../models/respondent';
import { RespondentServices } from '../services/respondent.services';

declare var jQuery: any;

@Component({
    selector: 'ResTeleCommunicationsComponent',
    templateUrl: './restelecommunications.component.html'
})

export class ResTeleCommunicationsComponent implements OnInit {
    @Input() resId: number;
    @Input() isMyProfile = false;

    isLoading = true;
    respondent: Respondent;

    internetProviderList = [];
    tvproviderList = [];
    nbnprovidersList = [];
    mobileProvidersList = [];
    phoneCompanyList = [];
    smartPhoneBrandsList = [];
    streamingServicesList = [];
    internetConnectionTypesList = [];
    NbnConnectionTypesList = [];
    today = new Date();

    mobilePhoneTypesList = [];

    constructor(private respondentservice: RespondentServices, @Inject(PLATFORM_ID) public platformId: Object) {
    }

    ngOnInit() {
        if (this.resId) {
            this.respondentservice.getRespondentById(this.resId)
                .subscribe((res: any) => {
                    this.respondent = res.value;
                    console.log(this.respondent);
                    this.isLoading = false;
                });
        }
        else {
            this.respondent = new Respondent();
            this.isLoading = false;
        }

        this.getData();

        this.respondentservice.getMobilePhoneTypesList()
            .subscribe((res: any) => {
                console.log(res);
                this.mobilePhoneTypesList = res.value;
            });
    }

    getData() {
        console.log("inside getdata");
        this.respondentservice.getRespondentData('InternetProvider', this.resId)
            .subscribe((res: any) => {
                this.internetProviderList = res.value;
                console.log(res);
            });
        this.respondentservice.getRespondentData('Nbnproviders', this.resId)
            .subscribe((res: any) => {
                this.nbnprovidersList = res.value;
                console.log(res);
            });
        this.respondentservice.getRespondentData('MobileProviders', this.resId)
            .subscribe((res: any) => {
                this.mobileProvidersList = res.value;
                console.log(res);
            });
        this.respondentservice.getRespondentData('PhoneCompany', this.resId)
            .subscribe((res: any) => {
                this.phoneCompanyList = res.value;
                console.log(res);
            });
        this.respondentservice.getRespondentData('SmartPhoneBrands', this.resId)
            .subscribe((res: any) => {
                this.smartPhoneBrandsList = res.value;
                console.log(res);
            });
        this.respondentservice.getRespondentData('StreamingServices', this.resId)
            .subscribe((res: any) => {
                this.streamingServicesList = res.value;
                console.log(res);
            });

        this.respondentservice.getRespondentData('InternetConnectionTypes', this.resId)
            .subscribe((res: any) => {
                this.internetConnectionTypesList = res.value;
                console.log(res);
            });

        this.respondentservice.getRespondentData('NbnConnectionTypes', this.resId)
            .subscribe((res: any) => {
                this.NbnConnectionTypesList = res.value;
                console.log(res);

                setTimeout(() => {
                    this.isLoading = false;
                }, 500);
            });
        // this.respondentservice.getRespondentData('Tvprovider', this.resId)
        //     .subscribe(res => {
        //         this.tvproviderList = res.value;
        //         console.log(res);
        //     });

    }

    updateSubmit() {
        // this.respondentservice.updateRespondent(this.respondent)
        //     .subscribe(res => {
        //         console.log(res);

        //         if (res.succeeded)
        //             swal(
        //                 'Successfully Saved!',
        //                 '',
        //                 'success'
        //             );
        //     });

        this.respondentservice.updateReferenceData('InternetProvider', this.internetProviderList, this.resId)
            .subscribe(res => {
                console.log(res);
            });

        this.respondentservice.updateReferenceData('Nbnproviders', this.nbnprovidersList, this.resId)
            .subscribe(res => {
                console.log(res);
            });

        this.respondentservice.updateReferenceData('MobileProviders', this.mobileProvidersList, this.resId)
            .subscribe(res => {
                console.log(res);
            });

        this.respondentservice.updateReferenceData('PhoneCompany', this.phoneCompanyList, this.resId)
            .subscribe(res => {
                console.log(res);
            });

        this.respondentservice.updateReferenceData('SmartPhoneBrands', this.smartPhoneBrandsList, this.resId)
            .subscribe(res => {
                console.log(res);
            });

        this.respondentservice.updateReferenceData('StreamingServices', this.streamingServicesList, this.resId)
            .subscribe(res => {
                console.log(res);
            });

        this.respondentservice.updateReferenceData('InternetConnectionTypes', this.internetConnectionTypesList, this.resId)
            .subscribe(res => {
                console.log(res);
            });

        this.respondentservice.updateReferenceData('NbnConnectionTypes', this.NbnConnectionTypesList, this.resId)
            .subscribe(res => {
                console.log(res);
            });


        // this.respondentservice.updateReferenceData('Tvprovider', this.tvproviderList, this.resId)
        //     .subscribe(res => {
        //         console.log(res);
        //     });

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
                this.respondent = res.value;
            });
    }

    gotoTop() {
        if (isPlatformBrowser(this.platformId)) {
            window.scrollTo(0, 0)
        }
    }
}
