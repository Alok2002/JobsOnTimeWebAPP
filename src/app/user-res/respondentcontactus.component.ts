import { MetaService } from '@ngx-meta/core';
import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import * as JWT from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import swal from 'sweetalert2';

import { RespondentServices } from '../services/respondent.services';
import { SharedServices } from './../services/shared.services';
import { pageTile } from '../app.component';

@Component({
  selector: 'Respondent-Contact-Us',
  templateUrl: './respondentcontactus.component.html',
  styleUrls: ['../../assets/css/disability.css']
})

export class RespondentContactUs {
  message: string;
  subject: string;
  isSubmitForm = false;
  resId: number;
  successMsg = null;
  role: string;

  constructor(private respondentservice: RespondentServices, private cookieservice: CookieService, private metaservice: MetaService,
    private sharedService: SharedServices, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.getLoginUserData();
  }

  getLoginUserData() {
    var token = JWT(this.cookieservice.get('auth_token'));
    console.log(token);
    this.resId = token["primarysid"];
    this.role = token["actort"];
  }

  submitContact(form) {
    this.successMsg = null;
    if (form.valid) {
      this.respondentservice.createContactUs(this.resId, this.subject, this.message, this.role)
        .subscribe((res: any) => {
          console.log(res)
          // if (res.successMsg) this.successMsg = res.successMsg;
          this.clearContactForm();
          if (res.succeeded) {
            swal(
              res.successMsg,
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
        })
    }
  }

  clearContactForm() {
    this.subject = null;
    this.message = null;
    this.successMsg = null;
  }
}