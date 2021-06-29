import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as JWT from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';

import { financeAccountMask, financeBSBMask } from '../app.component';
import { Respondent } from '../models/respondent';
import { RespondentServices } from '../services/respondent.services';
import { SharedServices } from './../services/shared.services';

declare var jQuery: any;

@Component({
  templateUrl: './respayment.component.html',
  styleUrls: ['../../assets/css/disability.css']
})

export class ResPaymentComponent implements OnInit {
  resId: number;
  respondent: Respondent;
  isLoading = true;

  financeBSBMask = financeBSBMask;
  financeAccountMask = financeAccountMask;
  ressurvey: Array<any>;
  toggleViewList = [];

  constructor(private respondentservice: RespondentServices,
    private sharedService: SharedServices, private activateroute: ActivatedRoute,
    private cookieservice: CookieService) { }

  ngOnInit() {
    this.getLoginUserData();
  }

  getLoginUserData() {
    var token = JWT(this.cookieservice.get('auth_token'));
    console.log(token);
    this.resId = token["primarysid"];
    //this.loginusername = token["unique_name"];
    // this.getRespondentById();
    this.getRespondentPayments();
  }

  getRespondentPayments() {
    this.respondentservice.getRespondentPayments(this.resId)
      .subscribe((res: any) => {
        console.log(res)
        this.ressurvey = res.value;
      })
  }

  /*getRespondentById() {
    this.respondentservice.getRespondentById(this.resId)
      .subscribe((res: any) => {
        this.respondent = res.value;
        this.isLoading = false;        
      });
  }*/

  unmask(value) {
    var ret = value.replace(/\D+/g, '');
    return ret;
  }

  toggleView(id) {
    var index = this.toggleViewList.indexOf(id);
    if (index >= 0) this.toggleViewList.splice(index, 1);
    else this.toggleViewList.push(id);
  }
}
