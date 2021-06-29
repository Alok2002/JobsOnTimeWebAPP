import { SurveyServices } from './../services/survey.services';
import { Component, OnInit } from '@angular/core';
import * as JWT from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import swal from 'sweetalert2';
import { apiHost, mobileMask, phoneMask, postcodeMask, postcodePattern, mobilePattern, phonePattern, passwordPattern } from '../app.component';
import { LoginUser } from '../models/loginuser';
import { Respondent } from '../models/respondent';
import { InputServices } from '../services/input.services';
import { RespondentServices } from '../services/respondent.services';
import { UserServices } from '../services/user.services';
import { SharedServices } from '../services/shared.services';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ReferFriend } from '../models/user';
declare var jQuery: any;

@Component({
    selector: 'ReferFriendComponent',
    templateUrl: './referfriend.component.html'
})

export class ReferFriendComponent implements OnInit {
    termsUrl: string;
    isFarronResearch = false;
    referFriend = new ReferFriend();
    isSubmitForm = false;
    surveyRedirecJobId: number;
    welcomeCopies: any;
    errmsg: string;

    constructor(private userservice: UserServices, public sharedservice: SharedServices, public respondentservice: RespondentServices, private inpService: InputServices,
        private cookieService: CookieService, private activateroute: ActivatedRoute, private surveyservice: SurveyServices, public httpClient: HttpClient) { }

    ngOnInit() {
        this.getTermsUrl();
        this.getIsFarronResearch();
        this.getWebsiteCopies();

        this.activateroute.queryParams.subscribe(params => {
            if (params['ref'])
                this.referFriend.referrer = params['ref'];
        });
    }

    getTermsUrl() {
        this.sharedservice.getTermsUrl()
            .subscribe((res: any) => {
                console.log(res);
                this.termsUrl = res.value;
            })
    }

    unmask(value) {
        var ret = value.replace(/\D+/g, '');
        return ret;
    }

    getIsFarronResearch() {
        this.sharedservice.getIsFarronResearch()
            .subscribe((res: any) => {
                this.isFarronResearch = res.value;
            })
    }

    referFriendFormSubmit(form) {
        this.isSubmitForm = true;
        if (form.valid) {
            this.userservice.referaFriend(this.referFriend)
                .subscribe((res: any) => {
                    console.log(res)
                    this.isSubmitForm = false;
                    if (res.succeeded) {
                        swal('Email Sent Successfully!', res.message, 'success');
                           /* .then((result) => {
                                if(result)
                                    window.location.href = "https://www.farronresearch.net.au/";
                            });*/
                        this.referFriend = new ReferFriend();
                    } else {
                        var err = "";
                        res.errors.forEach((er) => {
                            err = err + " " + er;
                        });

                        swal('Error!', err, 'error');
                    }
                })
        }
    }

    getWebsiteCopies() {
        this.sharedservice.getWebsiteCopies()
            .subscribe((res: any) => {
                console.log(res)
                this.welcomeCopies = res.value;
                this.referFriend.message = this.welcomeCopies.referPageText3;
            })
    }
}
