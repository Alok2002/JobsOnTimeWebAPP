import { financeAccountPattern, financeBSBPattern } from './../app.component';
import { MetaService } from '@ngx-meta/core';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import * as JWT from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import swal from 'sweetalert2';

import { financeAccountMask, financeBSBMask, pageTile } from '../app.component';
import { RespondentServices } from '../services/respondent.services';
import { SharedServices } from '../services/shared.services';
import { Respondent } from './../models/respondent';

declare var jQuery: any;

@Component({
  templateUrl: './respondentbanking.component.html',
  styleUrls: ['../../assets/css/disability.css']
})

export class RespondentBankingComponent implements OnInit {
  resId = 0;
  respondent: Respondent;
  financeBSBMask = financeBSBMask;
  financeAccountMask = financeAccountMask;
  financeAccountPattern = financeAccountPattern;
  financeBSBPattern = financeBSBPattern;
  isSubmitForm = false;
  countrycode: string;

  constructor(private respondentservice: RespondentServices, private cookieservice: CookieService,
    private sharedService: SharedServices, private activatedRoute: ActivatedRoute, private metaservice: MetaService) {
  }

  ngOnInit() {
    this.getLoginUserData();
    this.getCountryCode();
  }

  getLoginUserData() {
    var token = JWT(this.cookieservice.get('auth_token'));
    console.log(token);
    this.resId = token["primarysid"];

    this.respondentservice.getRespondentById(this.resId)
      .subscribe((res: any) => {
        this.respondent = res.value;
      })
  }

  updateSubmit(form) {
    //this.isSubmitForm = true;
    if (form.invalid) {
      console.log(form);
      //this.isSubmitForm = false;
    } else {
      if (this.respondent.financeBsb == null || this.respondent.financeBsb == undefined)
        this.respondent.financeBsb = "";
      this.respondentservice.updateRespondent(this.respondent)
        .subscribe((res: any) => {
          console.log(res);
          this.isSubmitForm = false;
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
  }

  unmask(value) {
    var ret = value.replace(/\D+/g, '');
    return ret;
  }

  clearResPayment() {
    //this.getLoginUserData();
    this.respondent.financeAccountName = "";
    this.respondent.financeBsb = "";
    this.respondent.financeAccountNumber = "";
    this.updateSubmit({ invalid: false })
  }

  getCountryCode() {
    this.sharedService.getCountryCode()
      .subscribe((res: any) => {
        console.log(res)
        this.countrycode = res.value.value;
        console.log(this.countrycode)
      })
  }
}
