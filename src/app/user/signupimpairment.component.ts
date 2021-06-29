import { MetaService } from '@ngx-meta/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as JWT from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import swal from 'sweetalert2';

import { apiHost, mobileMask, phoneMask, postcodeMask, pageTile, postcodePattern, mobilePattern, phonePattern, passwordPattern } from '../app.component';
import { LoginUser } from '../models/loginuser';
import { Respondent } from '../models/respondent';
import { InputServices } from '../services/input.services';
import { RespondentServices } from '../services/respondent.services';
import { SharedServices } from '../services/shared.services';
import { UserServices } from '../services/user.services';
import { HttpClient, HttpHeaders } from '@angular/common/http';

declare var jQuery: any;

@Component({
  selector: 'SignUpImpairmentComponent',
  templateUrl: './signupimpairment.component.html',
  styles: ['.btn:focus {outline: 5px auto red !important;} .label-error-msg {font-size:13px;}'],
  styleUrls: ['../../assets/css/disability.css']
})

export class SignUpImpairmentComponent implements OnInit {
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
  imparirmenttypeslist = [];
  impairmentdeviceslist = [];
  assistivetechnologylist = [];

  yearList = [];

  phoneMask = phoneMask;
  mobileMask = mobileMask;
  postcodeMask = postcodeMask;

  termandcondition = false;
  welcomeCopies: any;
  isFarronResearch = false;
  pattern = passwordPattern;
  termsUrl: string;

  constructor(private userservice: UserServices, public sharedservice: SharedServices, private metaservice: MetaService,
    public respondentservice: RespondentServices, private _sanitizer: DomSanitizer, private activatedRoute: ActivatedRoute,
    private inpService: InputServices, private cookieService: CookieService, private router: Router,
    private el: ElementRef, public httpClient: HttpClient) {
    this.activatedRoute.data.subscribe(data => {
      this.metaservice.setTitle(data.pagetitle + " - " + pageTile, true);
    });
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
    this.respondent.disabilityRego = true;
    /*this.getStates();
    this.getoccupationlist();
    this.getoccupationlevellist();
    this.getbusinesssizelist();
    this.getemployerturnoverlist();
    this.getData();
    this.getGenderList();

    this.getimpairmenttypes();
    this.getimpairmentdevices();
    this.getassistivetechnology();*/
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

  /*getimpairmenttypes() {
      this.respondentservice.getRespondentData('ImpairmentTypes', this.resId)
          .subscribe(res => {
              console.log(res);
              this.imparirmenttypeslist = res.value;
          })
  }

  getimpairmentdevices() {
      this.respondentservice.getRespondentData('ImpairmentDevices', this.resId)
          .subscribe(res => {
              console.log(res);
              this.impairmentdeviceslist = res.value;
              console.log(this.impairmentdeviceslist);
          })
  }

  updateimpairmentdevices(index: number, e) {
      if (e.target.checked) {
          this.impairmentdeviceslist[index].selected = true;
      }
      else {
          this.impairmentdeviceslist[index].selected = false;
      }
      console.log(this.impairmentdeviceslist);
  }

  getassistivetechnology() {
      this.respondentservice.getRespondentData('AssistiveTechnology', this.resId)
          .subscribe(res => {
              console.log(res);
              this.assistivetechnologylist = res.value;
          })
  }

  getGenderList() {
      this.respondentservice.getGenderList()
          .subscribe(re => {
              console.log(re);
              this.genderList = re.value;
          })
  }

  getemployerturnoverlist() {
      this.respondentservice.getEmployerTurnOverList()
          .subscribe(res => {
              console.log(res);
              this.employerturnoverlist = res.value;
          });
  }

  getbusinesssizelist() {
      this.respondentservice.getBusinessSizeList()
          .subscribe(res => {
              console.log(res);
              this.businesssizelist = res.value;
          });
  }

  getData() {
      this.respondentservice.getRespondentData('Industry', this.resId)
          .subscribe(res => {
              console.log(res);
              this.industrylist = res.value;
          });

      this.respondentservice.getRespondentData('Occupation', this.resId)
          .subscribe(res => {
              console.log(res);
              this.occupationlist = [];
              res.value.forEach((va) => {
                  this.occupationlist.push({ id: va.id, value: va.description });

                  if (va.id == this.respondent.occupationId)
                      this.respondent.occupationObj = { id: va.id, value: va.description }
                  if (va.id == this.respondent.partnerOccupationId)
                      this.respondent.partnerOccupationObj = { id: va.id, value: va.description }
              });

              this.isLoading = false;
          });
  }

  getoccupationlist() {
      this.respondentservice.getRespondentData('occupation', this.resId)
          .subscribe(res => {
              console.log(res);
              this.occupationlist = res.value;
          })
  }

  getoccupationlevellist() {
      this.respondentservice.getOccupationLevelList()
          .subscribe(res => {
              console.log(res);
              this.occupationlevellist = res.value;
          });
  }

  autocompleListFormatter = (data: any) => {
      let html = `<span>${data.value}</span>`;
      return this._sanitizer.bypassSecurityTrustHtml(html);
  }

  setLocation(e) {
      console.log(e);
      this.respondent.state = e.state;
      this.respondent.suburbHome = e.suburb;
      this.respondent.postcodeHome = e.postcode;
  }

  getStates() {
      this.sharedservice.getStates()
          .subscribe(re => {
              console.log(re);
              this.stateslist = re.value;
          })
  }*/

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

  updateassistivetechnology(index: number, e) {
    if (e.target.checked) {
      this.assistivetechnologylist[index].selected = true;
    }
    else {
      this.assistivetechnologylist[index].selected = false;
    }
    console.log(this.assistivetechnologylist);
  }

  updateRespondent(form) {
    this.isSubmitForm = true;
    this.isSubmitFormSpinner = true;
    if (form.invalid) {
      console.log(form);
      //this.isSubmitForm = false;
      this.isSubmitFormSpinner = false;
      const formGroupInvalid = this.el.nativeElement.querySelectorAll('.ng-invalid');
      if (formGroupInvalid && formGroupInvalid.length > 1)
        (<HTMLInputElement>formGroupInvalid[1]).focus();
    } else if (this.respondent.isTermsAgreed) {
      this.respondentservice.updateRespondent(this.respondent)
        .subscribe((res: any) => {
          this.isSubmitFormSpinner = false;
          console.log(res);

          if (res.succeeded) {
            this.resId = res.value.id;
            this.respondentservice.updateReferenceData('AssistiveTechnology', this.assistivetechnologylist, this.resId)
              .subscribe(res => {
                console.log(res);
              });

            this.respondentservice.updateReferenceData('ImpairmentDevices', this.impairmentdeviceslist, this.resId)
              .subscribe(res => {
                console.log(res);
              });

            this.respondentservice.updateReferenceData('ImpairmentTypes', this.imparirmenttypeslist, this.resId)
              .subscribe(res => {
                console.log(res);
              });

            this.respondentservice.updateReferenceData('assistivetechnology', this.assistivetechnologylist, this.resId)
              .subscribe(res => {
                console.log(res);
              });

            this.respondentservice.updateReferenceData('impairmentdevices', this.impairmentdeviceslist, this.resId)
              .subscribe(res => {
                console.log(res);
              });

            this.respondentservice.updateReferenceData('occupation', this.occupationlist, this.resId)
              .subscribe(res => {
                console.log(res);
              });

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
      loginuser.emailAddress = this.respondent.phoneHome;

    loginuser.mobileNo = this.respondent.phoneMobile;
    loginuser.role = 'Respondent';
    loginuser.userName = this.respondent.email;
    loginuser.password = this.respondent.passwordRaw;
    loginuser.regoType = 'impairment';
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
    this.respondent.stateWork = e.state;
    this.respondent.suburbBusiness = e.suburb;
    this.respondent.postcodeBusiness = e.postcode;
  }

  setLocation(e) {
    console.log(e);
    this.respondent.state = e.state;
    this.respondent.suburbHome = e.suburb;
    this.respondent.postcodeHome = e.postcode;
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
}
