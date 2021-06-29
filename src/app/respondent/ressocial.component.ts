import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import swal from 'sweetalert2';

import { Respondent } from '../models/respondent';
import { RespondentServices } from '../services/respondent.services';
import { SharedServices } from '../services/shared.services';

declare var jQuery: any;

@Component({
    selector: 'ResSocialComponent',
    templateUrl: './ressocial.component.html'
})

export class ResSocialComponent implements OnInit {
    @Input() resId: number;
    @Input() isMyProfile = false;

    isLoading = true;
    respondent: Respondent;

    generalProductList = [];
    alcoholRetailersList = [];
    drinkTypeList = [];
    nonAlcoholicDrinksList = [];
    alcoholHabitsList = [];
    smokeBrandList = [];
    cigaretteFrequencyList = [];
    foodChoicesList = [];
    gamingChoicesList = [];
    gamingWebsitesList = [];
    shoppingRetailersList = [];
    watchedSportsList = [];
    hobbiesList = [];
    petsList = [];
    smokeQuitMethodList = [];
    smokeNRTTypeList = [];
    sportsList = [];
    today = new Date();

    constructor(private respondentservice: RespondentServices, private sharedService: SharedServices,
        @Inject(PLATFORM_ID) public platformId: Object) {
    }

    ngOnInit() {
        if (this.resId) {
            this.respondentservice.getRespondentById(this.resId)
                .subscribe((res: any) => {
                    this.respondent = res.value;
                    console.log(this.respondent);
                });
        }
        else {
            this.respondent = new Respondent();
        }

        this.getData();
    }

    getData() {
        this.respondentservice.getRespondentData('AlcoholRetailers', this.resId)
            .subscribe((res: any) => {
                this.alcoholRetailersList = res.value;
                console.log(res);
            });
        this.respondentservice.getRespondentData('DrinkType', this.resId)
            .subscribe((res: any) => {
                this.drinkTypeList = res.value;
                console.log(res);
            });
        this.respondentservice.getRespondentData('NonAlcoholicDrinks', this.resId)
            .subscribe((res: any) => {
                this.nonAlcoholicDrinksList = res.value;
                console.log(res);
            });
        this.respondentservice.getRespondentData('AlcoholHabits', this.resId)
            .subscribe((res: any) => {
                this.alcoholHabitsList = res.value;
                console.log(res);
                this.alcoholHabitsList.sort((a, b) => {
                    if (a.id > b.id) return 1
                    else if (a.id < b.id) return -1;
                    return 0;
                })
            });
        this.respondentservice.getRespondentData('SmokeBrand', this.resId)
            .subscribe((res: any) => {
                this.smokeBrandList = res.value;
                console.log(res);
            });
        this.respondentservice.getRespondentData('CigaretteFrequency', this.resId)
            .subscribe((res: any) => {
                this.cigaretteFrequencyList = res.value;
                console.log(res);
            });
        this.respondentservice.getRespondentData('FoodChoices', this.resId)
            .subscribe((res: any) => {
                this.foodChoicesList = res.value;
                console.log(res);
            });
        this.respondentservice.getRespondentData('GamingChoices', this.resId)
            .subscribe((res: any) => {
                this.gamingChoicesList = res.value;
                console.log(res);
            });
        this.respondentservice.getRespondentData('GamingWebsites', this.resId)
            .subscribe((res: any) => {
                this.gamingWebsitesList = res.value;
                console.log(res);
            });
        this.respondentservice.getRespondentData('ShoppingRetailers', this.resId)
            .subscribe((res: any) => {
                this.shoppingRetailersList = res.value;
                console.log(res);
            });
        this.respondentservice.getRespondentData('WatchedSports', this.resId)
            .subscribe((res: any) => {
                this.watchedSportsList = res.value;
                console.log(res);
            });
        this.respondentservice.getRespondentData('Hobbies', this.resId)
            .subscribe((res: any) => {
                this.hobbiesList = res.value;
                console.log(res);
            });
        this.respondentservice.getRespondentData('Pets', this.resId)
            .subscribe((res: any) => {
                this.petsList = res.value;
                console.log(res);
            });
        this.respondentservice.getRespondentData('SmokeQuitMethod', this.resId)
            .subscribe((res: any) => {
                this.smokeQuitMethodList = res.value;
                console.log(res);
            });
        this.respondentservice.getRespondentData('SmokeNRTType', this.resId)
            .subscribe((res: any) => {
                this.smokeNRTTypeList = res.value;
                console.log(res);
            });
        this.respondentservice.getRespondentData('GeneralProduct', this.resId)
            .subscribe((res: any) => {
                this.generalProductList = res.value;
                console.log(res);
            });
        this.respondentservice.getRespondentData('Sports', this.resId)
            .subscribe((res: any) => {
                console.log(res);
                this.sportsList = res.value;

                this.isLoading = false;
            });
    }

    updateSubmit() {
        // this.respondentservice.updateRespondent(this.respondent)
        //     .subscribe(res => {
        //         console.log(res);
        //
        //         if (res.succeeded)
        //             swal(
        //                 'Successfully Saved!',
        //                 '',
        //                 'success'
        //             );
        //     });
        this.respondentservice.updateReferenceData('AlcoholRetailers', this.alcoholRetailersList, this.resId)
            .subscribe(res => {
                console.log(res);
            });

        this.respondentservice.updateReferenceData('DrinkType', this.drinkTypeList, this.resId)
            .subscribe(res => {
                console.log(res);
            });

        this.respondentservice.updateReferenceData('NonAlcoholicDrinks', this.nonAlcoholicDrinksList, this.resId)
            .subscribe(res => {
                console.log(res);
            });

        this.respondentservice.updateReferenceData('AlcoholHabits', this.alcoholHabitsList, this.resId)
            .subscribe(res => {
                console.log(res);
            });

        this.respondentservice.updateReferenceData('SmokeBrand', this.smokeBrandList, this.resId)
            .subscribe(res => {
                console.log(res);
            });

        this.respondentservice.updateReferenceData('CigaretteFrequency', this.cigaretteFrequencyList, this.resId)
            .subscribe(res => {
                console.log(res);
            });

        this.respondentservice.updateReferenceData('FoodChoices', this.foodChoicesList, this.resId)
            .subscribe(res => {
                console.log(res);
            });

        this.respondentservice.updateReferenceData('GamingChoices', this.gamingChoicesList, this.resId)
            .subscribe(res => {
                console.log(res);
            });

        this.respondentservice.updateReferenceData('GamingWebsites', this.gamingWebsitesList, this.resId)
            .subscribe(res => {
                console.log(res);
            });

        this.respondentservice.updateReferenceData('ShoppingRetailers', this.shoppingRetailersList, this.resId)
            .subscribe(res => {
                console.log(res);
            });

        this.respondentservice.updateReferenceData('WatchedSports', this.watchedSportsList, this.resId)
            .subscribe(res => {
                console.log(res);
            });

        this.respondentservice.updateReferenceData('Hobbies', this.hobbiesList, this.resId)
            .subscribe(res => {
                console.log(res);
            });

        this.respondentservice.updateReferenceData('Pets', this.petsList, this.resId)
            .subscribe(res => {
                console.log(res);
            });

        this.respondentservice.updateReferenceData('SmokeQuitMethod', this.smokeQuitMethodList, this.resId)
            .subscribe(res => {
                console.log(res);
            });

        this.respondentservice.updateReferenceData('SmokeNRTType', this.smokeNRTTypeList, this.resId)
            .subscribe(res => {
                console.log(res);
            });
        this.respondentservice.updateReferenceData('Sports', this.sportsList, this.resId)
            .subscribe(res => {
                console.log(res);
            });

        this.respondentservice.updateReferenceData('GeneralProduct', this.generalProductList, this.resId)
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

    updateCigaretteFrequencyList(ba) {
        this.cigaretteFrequencyList.forEach(cf => {
            if (cf.id == ba.id) cf.selected = true;
            else cf.selected = false;
        })
    }

    checkIDontSmoke() {
        var ret = true;
        if (this.cigaretteFrequencyList.findIndex(cf => cf.description == 'I do not smoke') > -1) {
            if (this.cigaretteFrequencyList[this.cigaretteFrequencyList.findIndex(cf => cf.description == 'I do not smoke')].selected)
                ret = false;
        }
        return ret;
    }

    gotoTop() {
        if (isPlatformBrowser(this.platformId)) {
            window.scrollTo(0, 0)
        }
    }
}
