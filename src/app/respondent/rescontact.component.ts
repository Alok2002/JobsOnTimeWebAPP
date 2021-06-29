import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

import { apiHost, mobileMask, phoneMask, postcodeMask, yearMask, postcodePattern, phonePattern, mobilePattern } from '../app.component';
import { Respondent } from '../models/respondent';
import { AuthService } from '../services/auth.services';
import { InputServices } from '../services/input.services';
import { RespondentServices } from '../services/respondent.services';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SharedServices } from '../services/shared.services';
import { SecurityRights } from '../shared/enum';

declare var jQuery: any;

@Component({
  selector: 'ResContactComponent',
  templateUrl: './rescontact.component.html'
})

export class ResContactComponent implements OnInit {
  postcodePattern = postcodePattern;
  phonePattern = phonePattern;
  mobilePattern = mobilePattern;
  @Input() resId: number;
  @Input() isMyProfile = false;

  respondent: Respondent;
  isLoading = true;
  genderList = [];
  currentyear: number;
  isSubmitForm = false;

  postcodes = [];
  postcodesdetails = [];
  isPostSuggShow = false;

  stateslist = [];

  locationAPI: string = apiHost + '/api/data-provider/location/:keyword';
  today = new Date();

  confirmEmailErrMsg: boolean;
  confirmEmail: string;

  postcodeHome: object;
  monthList = [];

  public phoneMask = phoneMask;
  public mobileMask = mobileMask;
  public postcodeMask = postcodeMask;
  public yearMask = yearMask;

  hasPasswordPermission = false;
  invalidYearErrMsg = false;

  @ViewChild('resContactForm') resContactForm;
  countrycode: string;
  respTitleList = [];

  constructor(private respondentservice: RespondentServices, private sharedservice: SharedServices,
    private authService: AuthService, public router: Router, private securityInfoResolve: SecurityInfoResolve,
    private inpService: InputServices, @Inject(PLATFORM_ID) public platformId: Object) {
  }

  numberOnly(event) {
    this.inpService.numberOnly(event);
  };

  stringOnly(event) {
    this.inpService.stringOnly(event);
  };

  ngOnInit() {

    if (this.resId) {
      this.getRespondentById();
    }
    else {
      this.respondent = new Respondent();
      this.respondent.id = 0;
      this.isLoading = false;
      this.confirmEmail = this.respondent.email;
    }

    this.getGenderList();
    this.getStates();
    this.currentyear = (new Date()).getFullYear();
    this.getMonthList();

    this.getPermissionDetails();
    this.getCountryCode();
    this.getRespTitleList();
  }

  ngAfterViewInit() {
    if (typeof jQuery != 'undefined') {
      setTimeout(() => {
        jQuery('#firstname').focus();
      }, 1000)
    }
  }

  getRespondentById() {
    this.respondentservice.getRespondentById(this.resId)
      .subscribe((res: any) => {
        this.respondent = res.value;
        console.log(this.respondent);
        this.isLoading = false;
        this.confirmEmail = this.respondent.email;
      });
  }

  // locationAPI(){
  //     let headers = new Headers();
  //     this.authService.createAuthorizationHeader(headers);

  //     return apiHost + "/api/data-provider/location/:keyword";
  // }

  getGenderList() {
    this.respondentservice.getGenderList()
      .subscribe((re: any) => {
        console.log(re);
        this.genderList = re.value;
      });
  } 
  
  getRespTitleList() {
    this.respondentservice.GetRespTitleList()
      .subscribe((re: any) => {
        console.log(re);
        this.respTitleList = re.value;
      });
  }

  checkConfirmationEmail() {
    if (this.confirmEmail != this.respondent.email && this.respondent.email != '') this.confirmEmailErrMsg = true;
    else this.confirmEmailErrMsg = false;
  }

  checkYearOnchange() {
    // this.invalidYearErrMsg = false;
    // if (!(this.getAge(this.respondent.birthMonth, this.respondent.birthYear) > 10 &&
    //   this.getAge(this.respondent.birthMonth, this.respondent.birthYear) < 100)) this.invalidYearErrMsg = true;
  }

  updateRespondent(form) {
    console.log(form);
    this.invalidYearErrMsg = false;
    this.checkConfirmationEmail();
    this.isSubmitForm = true;

    if (form.invalid) {
      console.log(form);
      //this.isSubmitForm = false;
    } else {
      if (this.isMyProfile && this.confirmEmail != this.respondent.email && this.respondent.email != '') this.confirmEmailErrMsg = true;
      // else if (!(this.getAge(this.respondent.birthMonth, this.respondent.birthYear) > 15 &&
      //   this.getAge(this.respondent.birthMonth, this.respondent.birthYear) < 100)) this.invalidYearErrMsg = true;
      else {
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

            if (res.succeeded && !this.respondent.id) {
              this.router.navigate(['/respondent', res.value.id]);
            }

            if (res.succeeded)
              this.respondent = res.value;
          });
      }
    }
  }

  getLocation(e) {
    //if(this.client.suburb.length > 4)
    this.sharedservice.getLocationPostCodes(this.respondent.suburbHome)
      .subscribe((res: any) => {
        this.postcodes = res.value;
        this.isPostSuggShow = true;
        console.log(this.postcodes);
      });
  }

  setLocation(e) {
    console.log(e);
    if (e.hasOwnProperty('state')) this.respondent.state = e.state;
    if (e.hasOwnProperty('suburb')) this.respondent.suburbHome = e.suburb;
    if (e.hasOwnProperty('postcode')) this.respondent.postcodeHome = e.postcode;
  }

  setBusinessLocation(e) {
    console.log(e);
    if (e) {
      if (e.hasOwnProperty('state')) this.respondent.stateWork = e.state;
      if (e.hasOwnProperty('suburb')) this.respondent.suburbBusiness = e.suburb;
      if (e.hasOwnProperty('postcode')) this.respondent.postcodeBusiness = e.postcode;
    }
  }

  /*selectedCode(pc) {
      this.isPostSuggShow = false;
      this.respondent.suburbHome = pc.suburb;
      this.respondent.state = pc.state;
      this.respondent.postcodeHome = pc.postcode;
  }*/

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

  getStates() {
    this.sharedservice.getStates()
      .subscribe((re: any) => {
        console.log(re);
        this.stateslist = re.value;
      });
  }

  getAge(month, year) {
    //var years = moment().diff(year + '-' + month + '-01', 'years');

    var currentYear = (new Date()).getFullYear();
    var currentMonth = (new Date()).getMonth() + 1;

    //currentYear--;
    var ageYear = currentYear - year;
    if (month < currentMonth)
      ageYear = ageYear + 1;
    return (ageYear - 1);
  }

  getMonthList() {
    this.sharedservice.GetMonthList()
      .subscribe((res: any) => {
        console.log(res);
        this.monthList = res.value;
      });
  }

  ngOnDestroy() {
    var form = { invalid: false, showMsg: false };
    //this.updateRespondent(form);
  }

  unmask(value) {
    var ret = value.replace(/\D+/g, '');
    return ret;
  }

  getPermissionDetails() {
    this.hasPasswordPermission = true;
    /*this.securityInfoResolve.checkPermission(SecurityRights.RespondentPassword)
      .subscribe((res: any) => {
        if (res.succeeded) {
          this.hasPasswordPermission = true;
        }
      });*/
  }

  preventDefault(e) {
    e.preventDefault();
  }

  getCountryCode() {
    this.sharedservice.getCountryCode()
      .subscribe((res: any) => {
        console.log(res)
        this.countrycode = res.value.value;
      })
  }

  gotoTop() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0)
    }
  }
}
