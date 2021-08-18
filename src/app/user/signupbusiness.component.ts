import { postcodePattern, mobilePattern, phonePattern, passwordPattern, reCaptchaSiteKey } from './../app.component';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as JWT from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import swal from 'sweetalert2';

import { apiHost, mobileMask, phoneMask, postcodeMask } from '../app.component';
import { LoginUser } from '../models/loginuser';
import { Respondent } from '../models/respondent';
import { InputServices } from '../services/input.services';
import { RespondentServices } from '../services/respondent.services';
import { UserServices } from '../services/user.services';
import { SharedServices } from './../services/shared.services';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { InvisibleReCaptchaComponent } from 'ngx-captcha';
declare var jQuery: any;

@Component({
  selector: 'SignUpBusinessComponent',
  templateUrl: './signupbusiness.component.html'
})

export class SignUpBusinessComponent implements OnInit {
  postcodePattern = postcodePattern;
  mobilePattern = mobilePattern;
  phonePattern = phonePattern;
  @Input() resId: number = 0;
  //ressignup: ResSignUp;
  respondent: Respondent;

  locationAPI: string = apiHost + '/api/data-provider/location/:keyword';
  stateslist = [];
  isSubmitForm = false;
  loginerrmsg: string;
  isSubmitFormSpinner = false;

  occupationlist = [];
  occupationlevellist = [];
  industrylist = [];
  businesssizelist = [];
  employerturnoverlist = [];
  isLoading = true;

  genderList = [];
  yearList = [];

  phoneMask = phoneMask;
  mobileMask = mobileMask;
  postcodeMask = postcodeMask;

  termandcondition = false;
  welcomeCopies: any;
  isFarronResearch = false;

  pattern = passwordPattern;
  termsUrl: string;

  reCaptchaSiteKey = reCaptchaSiteKey;
  @ViewChild("captchaElem") captchaElem: InvisibleReCaptchaComponent;
  recaptcha: any;

  constructor(private userservice: UserServices, public sharedservice: SharedServices,
    public respondentservice: RespondentServices, private _sanitizer: DomSanitizer, private inpService: InputServices,
    private cookieService: CookieService, public httpClient: HttpClient) {
  }

  numberOnly(event) {
    this.inpService.numberOnly(event);
  };

  stringOnly(event) {
    this.inpService.stringOnly(event);
  };

  ngOnInit() {
    this.getIsFarronResearch();
    this.getWebsiteCopies();
    //this.ressignup = new ResSignUp();
    this.respondent = new Respondent();
    this.respondent.businessRego = true;
    /*this.getStates();
    this.getoccupationlist();
    this.getoccupationlevellist();
    this.getbusinesssizelist();
    this.getemployerturnoverlist();
    this.getData();*/

    this.getGenderList();
    this.GetYearList();
    this.getTermsUrl();
  }

  getTermsUrl() {
    this.sharedservice.getTermsUrl()
      .subscribe((res: any) => {
        console.log(res);
        this.termsUrl = res.value;
      })
  }

  getWebsiteCopies() {
    this.sharedservice.getWebsiteCopies()
      .subscribe((res: any) => {
        console.log(res)
        this.welcomeCopies = res.value;
      })
  }

  getGenderList() {
    this.sharedservice.GetGenderList()
      .subscribe((re: any) => {
        console.log(re);
        this.genderList = re.value;
      });
  }

  GetYearList() {
    this.sharedservice.GetYearList()
      .subscribe((re: any) => {
        console.log(re);
        this.yearList = re.value;
      });
  }


  getemployerturnoverlist() {
    this.respondentservice.getEmployerTurnOverList()
      .subscribe((res: any) => {
        console.log(res);
        this.employerturnoverlist = res.value;
      });
  }

  getbusinesssizelist() {
    this.respondentservice.getBusinessSizeList()
      .subscribe((res: any) => {
        console.log(res);
        this.businesssizelist = res.value;
      });
  }

  getData() {
    this.respondentservice.getRespondentData('Industry', this.resId)
      .subscribe((res: any) => {
        console.log(res);
        this.industrylist = res.value;
      });

    this.respondentservice.getRespondentData('Occupation', this.resId)
      .subscribe((res: any) => {
        console.log(res);
        this.occupationlist = [];
        res.value.forEach((va) => {
          this.occupationlist.push({ id: va.id, value: va.description });

          if (va.id == this.respondent.occupationId)
            this.respondent.occupationObj = { id: va.id, value: va.description };
          if (va.id == this.respondent.partnerOccupationId)
            this.respondent.partnerOccupationObj = { id: va.id, value: va.description };
        });

        this.isLoading = false;
      });
  }

  getoccupationlist() {
    this.respondentservice.getRespondentData('occupation', this.resId)
      .subscribe((res: any) => {
        console.log(res);
        this.occupationlist = res.value;
      });
  }

  getoccupationlevellist() {
    this.respondentservice.getOccupationLevelList()
      .subscribe((res: any) => {
        console.log(res);
        this.occupationlevellist = res.value;
      });
  }

  autocompleListFormatter = (data: any) => {
    let html = `<span>${data.value}</span>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
  };

  setLocation(e) {
    console.log(e);
    this.respondent.state = e.state;
    this.respondent.suburbHome = e.suburb;
    this.respondent.postcodeHome = e.postcode;
  }

  getStates() {
    this.sharedservice.getStates()
      .subscribe((re: any) => {
        console.log(re);
        this.stateslist = re.value;
      });
  }

  /*signUp() {
      this.respondent.role = 'member';
      this.respondent.username = 'usr123';

      this.userservice.signUp(this.respondent)
          .subscribe(res => {
              console.log(res);

              this.storageservice.write('isLogin', true);

              var t = JWT(res.token);
              const date = new Date(0);
              date.setUTCSeconds(t['exp']);

              console.log(t);

              this.cookieService.set('auth_token', res.token, date, null, null, false);

              //if (this.ressignup.role == 'member')
              window.location.href = '/resprofile';
          })
  }*/

  updateRespondent(form) {
    this.isSubmitForm = true;
    this.isSubmitFormSpinner = true;
    if (form.invalid) {
      console.log(form);
      //this.isSubmitForm = false;
      this.isSubmitFormSpinner = false;
    } else if (!this.recaptcha) {
      swal(
        'Error!',
        'Invalid Captcha',
        'error'
      )
    } else if (this.respondent.isTermsAgreed) {
      this.respondentservice.updateRespondent(this.respondent)
        .subscribe((res: any) => {
          this.isSubmitFormSpinner = false;
          console.log(res);

          if (res.succeeded) {
            this.login();
            //window.location.href = '/resprofile';
          } else {
            var err = '';
            res.errors.forEach((er) => {
              err = err + ' ' + er;
            });
            swal(
              'Error!',
              err,
              'error'
            );
          }
        });
    }
  }

  login() {
    this.loginerrmsg = '';
    var loginuser = new LoginUser();
    if (this.respondent.email != null)
      loginuser.emailAddress = this.respondent.email;
    else if (this.respondent.phoneMobile != null)
      loginuser.emailAddress = this.respondent.phoneMobile;
    else
      loginuser.emailAddress = this.respondent.phoneBusiness;

    loginuser.mobileNo = this.respondent.phoneMobile;
    loginuser.role = 'Respondent';
    loginuser.userName = this.respondent.email;
    loginuser.password = this.respondent.passwordRaw;
    loginuser.regoType = 'business';
    loginuser.firstName = this.respondent.givenNames;
    loginuser.lastName = this.respondent.lastName;

    this.httpClient.get('https://jsonip.com', { headers: new HttpHeaders() })
      .subscribe((ipOfNetwork) => {
        this.loginFormSubmitHelper(ipOfNetwork['ip'], loginuser)
      }, error => {
        this.loginFormSubmitHelper("", loginuser);
      })
  }

  loginFormSubmitHelper(ip, loginuser) {
    loginuser.ipAddress = ip;
    this.userservice.login(loginuser)
      .subscribe((res: any) => {
        console.log(res);
        if (!res) this.loginerrmsg = 'Login failed. Invalid user credentials.';
        else {
          //this.storageservice.write('auth_token', 'Bearer '+res.token);
          this.cookieService.set('isLogin', 'true', null, '/');

          var t = JWT(res.value);
          const date = new Date(0);
          date.setUTCSeconds(t['exp']);

          console.log(t);
          this.cookieService.set('auth_token', res.value, date, '/', null, false);

          window.location.href = '/resprofile';
        }
      });
  }

  autoUpperFirstLetter(modal) {
    if (this.respondent[modal]) {
      var arr = this.respondent[modal].split('');
      arr.forEach((cl, i) => {
        if (i == 0) arr[i] = cl.toUpperCase();
      });
      this.respondent[modal] = arr.join('');
    }
    //this.clientcontact[modal] = this.clientcontact[modal].charAt(0).toUpperCase();
  }

  setBusinessLocation(e) {
    console.log(e);
    this.respondent.state = e.state;
    this.respondent.suburbWork = e.suburb;
    this.respondent.postcodeWork = e.postcode;
  }

  unmask(value) {
    var ret = value.replace(/\D+/g, '');
    return ret;
  }

  ngDoCheck() {
    if (typeof jQuery != 'undefined') {
      jQuery('[data-toggle="tooltip"]').tooltip({ container: 'body' });
    }
  }

  getIsFarronResearch() {
    this.sharedservice.getIsFarronResearch()
      .subscribe((res: any) => {
        this.isFarronResearch = res.value;
      })
  }

  reloadCaptcha(): void {
    this.captchaElem.reloadCaptcha();
  }

  handleSuccess(e) {
  }
}
