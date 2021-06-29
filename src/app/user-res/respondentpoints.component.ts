import { MetaService } from '@ngx-meta/core';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as JWT from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import swal from 'sweetalert2';

import { financeAccountMask, financeBSBMask, pageTile } from '../app.component';
import { RespondentServices } from '../services/respondent.services';
import { SharedServices } from '../services/shared.services';
import { Respondent } from './../models/respondent';

declare var jQuery: any;

@Component({
  templateUrl: './respondentpoints.component.html',
  styleUrls: ['../../assets/css/disability.css']
})

export class RespondentPointsComponent implements OnInit {
  resId = 0;
  respondent: Respondent;
  financeBSBMask = financeBSBMask;
  financeAccountMask = financeAccountMask;

  constructor(private respondentservice: RespondentServices, private cookieservice: CookieService, private metaservice: MetaService,
    private sharedService: SharedServices, private router: Router, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.getIsPointsAllowed();
    this.getLoginUserData();
  }

  getIsPointsAllowed() {
    this.sharedService.getIsPointsAllowed()
      .subscribe((res: any) => {
        console.log(res)
        if (!res.value)
          this.router.navigate(['/accessdenied']);
      })
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
    if (form.invalid) {
      console.log(form);
      //this.isSubmitForm = false;
    } else {
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
  }

  unmask(value) {
    var ret = value.replace(/\D+/g, '');
    return ret;
  }
}
