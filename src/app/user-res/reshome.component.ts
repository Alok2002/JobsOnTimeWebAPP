import { Component, OnInit } from '@angular/core';
import * as JWT from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';

import { RespondentServices } from '../services/respondent.services';
import { SharedServices } from './../services/shared.services';

declare var jQuery: any;

@Component({
  templateUrl: './reshome.component.html',
  styleUrls: ['../../assets/css/disability.css']
})

export class ResHomeComponent implements OnInit {
  resid = 0;
  reshomesummary = { 'sessionsToday': 0, 'surveyToComplete': 0, 'surveysCompleted': 0, 'totalSessions': 0 };
  unique_name = "";

  constructor(private respondentservice: RespondentServices, private cookieservice: CookieService,
    private sharedservice: SharedServices) { }

  ngOnInit() {
    var token = JWT(this.cookieservice.get('auth_token'));
    console.log(token);
    this.resid = token["primarysid"];
    this.unique_name = token["unique_name"];

    this.getResSummary();
  }

  getResSummary() {
    this.respondentservice.getrespondentsummary(this.resid)
      .subscribe((res: any) => {
        console.log(res);
        this.reshomesummary = res.value;
      })
  }
}
