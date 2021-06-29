import { Component, OnInit } from '@angular/core';
import * as JWT from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';

import { RespondentServices } from '../services/respondent.services';
import { SharedServices } from '../services/shared.services';
import { Respondent } from './../models/respondent';

declare var jQuery: any;

@Component({
  templateUrl: './resprofile.component.html',
  styleUrls: ['../../assets/css/disability.css']
})

export class ResProfileComponent implements OnInit {
  resId: number;
  respondent: Respondent;
  isLoading = true;
  selectedAcc: string;
  recentClosed: string;

  constructor(private cookieservice: CookieService, public respondentservice: RespondentServices,
    private sharedservice: SharedServices) { }

  ngOnInit() {        
    this.getLoginUserData();
  }

  getLoginUserData() {
    var token = JWT(this.cookieservice.get('auth_token'));
    console.log(token);
    this.resId = token["primarysid"];
    //this.loginusername = token["unique_name"];
    this.getRespondentById();
  }

  getRespondentById() {
    this.respondentservice.getRespondentById(this.resId)
      .subscribe((res: any) => {
        this.respondent = res.value;
        this.isLoading = false;
      });
  }

  changeTab(data) {
    this.recentClosed = this.selectedAcc;
    console.log(this.recentClosed);
    //this.selectedAcc = data;
  }
}
