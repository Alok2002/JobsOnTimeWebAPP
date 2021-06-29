import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import swal from 'sweetalert2';

import { Respondent } from '../models/respondent';
import { RespondentServices } from '../services/respondent.services';

declare var jQuery: any;
@Component({
    selector: 'ResTravelComponent',
    templateUrl: './restravel.component.html'
})

export class ResTravelComponent implements OnInit {
    @Input() resId: number;
    @Input() isMyProfile = false;

    isLoading = true;
    respondent: Respondent;
    frequentFlyerProgramList = [];
    loyaltyProgrammesList = [];
    travelAppsList = [];
    travelWebsitesList = [];
    travelPackagesList = [];
    tourOperatorsList = [];
    travelAgentsList = [];
    travelBookingMethodsList = [];
    travelFrequencyList = [];
    travelLocationList = [];
    travelReasonList = [];
    travelCompanionsList = [];
    travelTypesList = [];
    travelDestinationsList = [];
    today = new Date();

    vehicletypelist = [];
    vehiclemakelist = [];

    constructor(private respondentservice: RespondentServices, @Inject(PLATFORM_ID) public platformId: Object) {
    }

    ngOnInit() {
        if (this.resId) {
            this.respondentservice.getRespondentById(this.resId)
                .subscribe((res: any) => {
                    this.respondent = res.value;
                    this.getData();
                });
        }
        else {
            this.respondent = new Respondent();
            this.getData();
        }
    }

    getData() {
        this.respondentservice.getRespondentData('FrequentFlyerProgram', this.resId)
            .subscribe((res: any) => {
                console.log(res);
                this.frequentFlyerProgramList = res.value;
            });
        this.respondentservice.getRespondentData('LoyaltyProgram', this.resId)
            .subscribe((res: any) => {
                console.log(res);
                this.loyaltyProgrammesList = res.value;
            });
        this.respondentservice.getRespondentData('TravelApps', this.resId)
            .subscribe((res: any) => {
                console.log(res);
                this.travelAppsList = res.value;
            });
        this.respondentservice.getRespondentData('TravelWebsites', this.resId)
            .subscribe((res: any) => {
                console.log(res);
                this.travelWebsitesList = res.value;
            });
        this.respondentservice.getRespondentData('TravelPackages', this.resId)
            .subscribe((res: any) => {
                console.log(res);
                this.travelPackagesList = res.value;
            });
        this.respondentservice.getRespondentData('TourOperators', this.resId)
            .subscribe((res: any) => {
                console.log(res);
                this.tourOperatorsList = res.value;
            });
        this.respondentservice.getRespondentData('TravelAgent', this.resId)
            .subscribe((res: any) => {
                console.log(res);
                this.travelAgentsList = res.value;
            });
        this.respondentservice.getRespondentData('TravelBookingMethods', this.resId)
            .subscribe((res: any) => {
                console.log(res);
                this.travelBookingMethodsList = res.value;
            });
        this.respondentservice.getRespondentData('TravelDestinations', this.resId)
            .subscribe((res: any) => {
                console.log(res);
                this.travelDestinationsList = res.value;
            });
        this.respondentservice.getRespondentData('TravelFrequency', this.resId)
            .subscribe((res: any) => {
                console.log(res);
                this.travelFrequencyList = res.value;

                this.travelFrequencyList.sort((a, b) => {
                    if (a.id > b.id) return 1
                    else if (a.id < b.id) return -1;
                    return 0;
                })
            });
        this.respondentservice.getRespondentData('TravelLocation', this.resId)
            .subscribe((res: any) => {
                console.log(res);
                this.travelLocationList = res.value;
            });
        this.respondentservice.getRespondentData('TravelReason', this.resId)
            .subscribe((res: any) => {
                console.log(res);
                this.travelReasonList = res.value;
            });
        this.respondentservice.getRespondentData('TravelCompanions', this.resId)
            .subscribe((res: any) => {
                console.log(res);
                this.travelCompanionsList = res.value;
            });
        this.respondentservice.getRespondentData('TravelTypes', this.resId)
            .subscribe((res: any) => {
                console.log(res);
                this.travelTypesList = res.value;

                this.isLoading = false;
            });
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

        this.respondentservice.updateReferenceData('FrequentFlyerProgram', this.frequentFlyerProgramList, this.resId)
            .subscribe(res => {
                console.log(res);
            });

        this.respondentservice.updateReferenceData('LoyaltyProgrammes', this.loyaltyProgrammesList, this.resId)
            .subscribe(res => {
                console.log(res);
            });

        this.respondentservice.updateReferenceData('TravelApps', this.travelAppsList, this.resId)
            .subscribe(res => {
                console.log(res);
            });

        this.respondentservice.updateReferenceData('TravelWebsites', this.travelWebsitesList, this.resId)
            .subscribe(res => {
                console.log(res);
            });

        this.respondentservice.updateReferenceData('TravelPackages', this.travelPackagesList, this.resId)
            .subscribe(res => {
                console.log(res);
            });

        this.respondentservice.updateReferenceData('TourOperators', this.tourOperatorsList, this.resId)
            .subscribe(res => {
                console.log(res);
            });

        this.respondentservice.updateReferenceData('TravelAgents', this.travelAgentsList, this.resId)
            .subscribe(res => {
                console.log(res);
            });

        this.respondentservice.updateReferenceData('TravelBookingMethods', this.travelBookingMethodsList, this.resId)
            .subscribe(res => {
                console.log(res);
            });

        this.respondentservice.updateReferenceData('TravelDestinations', this.travelDestinationsList, this.resId)
            .subscribe(res => {
                console.log(res);
            });

        this.respondentservice.updateReferenceData('TravelFrequency', this.travelFrequencyList, this.resId)
            .subscribe(res => {
                console.log(res);
            });

        this.respondentservice.updateReferenceData('TravelLocation', this.travelLocationList, this.resId)
            .subscribe(res => {
                console.log(res);
            });

        this.respondentservice.updateReferenceData('TravelReason', this.travelReasonList, this.resId)
            .subscribe(res => {
                console.log(res);
            });

        this.respondentservice.updateReferenceData('TravelCompanions', this.travelCompanionsList, this.resId)
            .subscribe(res => {
                console.log(res);
            });

        this.respondentservice.updateReferenceData('TravelTypes', this.travelTypesList, this.resId)
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
                this.respondent = res.value;
            });
    }

    gotoTop() {
        if (isPlatformBrowser(this.platformId)) {
            window.scrollTo(0, 0)
        }
    }
}
