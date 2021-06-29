import { isPlatformBrowser } from '@angular/common';
import { Component, Input, OnInit, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

import { apiHost, mobileMask, phoneMask, yearMask, postcodeMask, postcodePattern, phonePattern, mobilePattern } from '../../app.component';
import { Respondent } from '../../models/respondent';
import { InputServices } from '../../services/input.services';
import { RespondentServices } from '../../services/respondent.services';
import { SecurityInfoResolve } from '../../services/securityinfo.reslove';
import { SharedServices } from '../../services/shared.services';
import { SecurityRights } from '../../shared/enum';

declare var jQuery: any;

@Component({
  selector: 'IPMContactComponent',
  templateUrl: './ipmcontact.component.html'
})

export class IPMContactComponent implements OnInit {
  postcodePattern = postcodePattern;
  phonePattern = phonePattern;
  mobilePattern = mobilePattern;
  @Input() resId: number;
  @Input() isMyProfile = false;

  respondent: Respondent;
  isLoading = true;
  genderList = [];
  currentyear: number;

  occupationlist = [];
  imparirmenttypeslist = [];
  impairmentdeviceslist = [];
  assistivetechnologylist = [];

  postcodes = [];
  postcodesdetails = [];
  isPostSuggShow = false;
  today = new Date();
  locationAPI: string = apiHost + '/api/data-provider/location/:keyword';

  stateslist = [];
  isSubmitForm = false;

  confirmEmailErrMsg: boolean;
  confirmEmail: string;
  monthList = [];

  phoneMask = phoneMask;
  mobileMask = mobileMask;
  yearMask = yearMask;

  hasPasswordPermission = false;
  @ViewChild('ipmContactForm') ipmContactForm;

  postcodeMask = postcodeMask;
  countrycode: string;

  constructor(private respondentservice: RespondentServices, private inpService: InputServices,
    private sharedservice: SharedServices, private router: Router,
    private securityInfoResolve: SecurityInfoResolve, private el: ElementRef,
    @Inject(PLATFORM_ID) public platformId: Object) {
  }

  numberOnly(event) {
    this.inpService.numberOnly(event);
  };

  stringOnly(event) {
    this.inpService.stringOnly(event);
  };

  ngOnInit() {
    if (this.resId) {
      this.respondentservice.getRespondentById(this.resId)
        .subscribe((res: any) => {
          this.respondent = res.value;
          this.isLoading = false;
          this.confirmEmail = this.respondent.email;
        });
    }
    else {
      this.respondent = new Respondent();
      this.respondent.id = 0;
      this.confirmEmail = this.respondent.email;
      this.isLoading = false;
    }

    this.getGenderList();
    this.currentyear = (new Date()).getFullYear();
    this.getoccupationlist();

    this.getimpairmenttypes();
    this.getimpairmentdevices();
    this.getassistivetechnology();

    this.getStates();
    this.getMonthList();
    this.getPermissionDetails();
    this.getCountryCode();
  }

  getStates() {
    this.sharedservice.getStates()
      .subscribe((re: any) => {
        console.log(re);
        this.stateslist = re.value;
      });
  }

  setLocation(e) {
    console.log(e);
    if (e.hasOwnProperty('state')) this.respondent.state = e.state;
    if (e.hasOwnProperty('suburb')) this.respondent.suburbHome = e.suburb;
    if (e.hasOwnProperty('postcode')) this.respondent.postcodeHome = e.postcode;

  }

  getGenderList() {
    this.respondentservice.getGenderList()
      .subscribe((re: any) => {
        console.log(re);
        this.genderList = re.value;
      });
  }

  getoccupationlist() {
    this.respondentservice.getRespondentData('occupation', this.resId)
      .subscribe((res: any) => {
        console.log(res);
        this.occupationlist = res.value;
      });
  }

  getimpairmenttypes() {
    this.respondentservice.getRespondentData('impairmenttypes', this.resId)
      .subscribe((res: any) => {
        console.log(res);
        this.imparirmenttypeslist = res.value;
      });
  }

  updateimpairmenttypes(index: number, e) {
    if (e.target.checked) {
      this.imparirmenttypeslist[index].selected = true;
    }
    else {
      this.imparirmenttypeslist[index].selected = false;
    }
    console.log(this.imparirmenttypeslist);
  }

  getimpairmentdevices() {
    this.respondentservice.getRespondentData('impairmentdevices', this.resId)
      .subscribe((res: any) => {
        console.log(res);
        this.impairmentdeviceslist = res.value;
      });
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
    this.respondentservice.getRespondentData('assistivetechnology', this.resId)
      .subscribe((res: any) => {
        console.log(res);
        this.assistivetechnologylist = res.value;
      });
  }

  updateassistivetechnology(index: number, e) {
    if (e.target.checked) {
      this.assistivetechnologylist[index].selected = true;
    }
    else {
      this.assistivetechnologylist[index].selected = false;
    }
    console.log(this.assistivetechnologylist);
  }


  updateBpmContact(form) {
    this.checkConfirmationEmail();
    this.isSubmitForm = true;
    this.confirmEmailErrMsg = false;

    if (form.invalid) {
      console.log(form);
      //this.isSubmitForm = false;
      const formGroupInvalid = this.el.nativeElement.querySelectorAll('.ng-invalid');
      if (formGroupInvalid && formGroupInvalid.length > 1)
        (<HTMLInputElement>formGroupInvalid[1]).focus();
    } else {
      if (this.isMyProfile && this.confirmEmail != this.respondent.email) this.confirmEmailErrMsg = true;
      else {
        this.respondent.disabilityRego = true;
        //if (!this.respondent.birthMonth) this.respondent.birthMonth = 1;
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
              this.router.navigate(['/impairmentpanelmember', res.value.id]);
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

  selectedCode(pc) {
    this.isPostSuggShow = false;
    this.respondent.suburbHome = pc.suburb;
    this.respondent.state = pc.state;
    this.respondent.postcodeHome = pc.postcode;
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
    if (e.hasOwnProperty('state')) this.respondent.stateWork = e.state;
    if (e.hasOwnProperty('suburb')) this.respondent.suburbBusiness = e.suburb;
    if (e.hasOwnProperty('postcode')) this.respondent.postcodeBusiness = e.postcode;
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

  checkConfirmationEmail() {
    if (this.confirmEmail != this.respondent.email) this.confirmEmailErrMsg = true;
    else this.confirmEmailErrMsg = false;
  }

  getMonthList() {
    this.sharedservice.GetMonthList()
      .subscribe((res: any) => {
        console.log(res);
        this.monthList = res.value;
      });
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

  ngDoCheck() {
    if (typeof jQuery != 'undefined') {
      jQuery('[data-toggle="tooltip"]').tooltip({ container: 'body' });
    }
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
