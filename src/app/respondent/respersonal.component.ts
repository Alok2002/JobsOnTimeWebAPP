import { SharedServices } from './../services/shared.services';
import { ShareService } from '@ngx-share/core';
import { Component, Inject, Input, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import swal from 'sweetalert2';

import { yearMask } from '../app.component';
import { Respondent } from '../models/respondent';
import { InputServices } from '../services/input.services';
import { RespondentServices } from '../services/respondent.services';
import { isPlatformBrowser } from '@angular/common';

declare var jQuery: any;

@Component({
  selector: 'ResPersonalComponent',
  templateUrl: './respersonal.component.html'
})

export class ResPersonalComponent implements OnInit {
  @Input() resId: number;
  @Input() isMyProfile = false;

  respondent: Respondent;
  isLoading = true;
  residencystatuslist = [];
  languagelist = [];
  countrylist = [];
  currentyear = (new Date()).getFullYear();
  comunicationLevelList = [];
  today = new Date();
  isSubmitForm = false;

  yearMask = yearMask;
  @ViewChild('resPersonalForm') resPersonalForm;
  invalidYearErrMsg = false;
  countrycode: string;

  constructor(private respondentservice: RespondentServices, private inpService: InputServices,
    private sharedservice: SharedServices, @Inject(PLATFORM_ID) public platformId: Object) {
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
          // this.respondent.indigenous = false;
        });
    }
    else {
      this.respondent = new Respondent();
      this.isLoading = false;
      // this.respondent.indigenous = true;
    }

    this.getResidencyStatusList();
    this.getlanguagelist();
    this.getcountrylist();
    this.getCommunicationLevel();
    this.getCountryCode();
  }

  getCountryCode() {
    this.sharedservice.getCountryCode()
      .subscribe((res: any) => {
        console.log(res)
        this.countrycode = res.value.value;
      })
  }

  getResidencyStatusList() {
    this.respondentservice.getResidencyStatusList()
      .subscribe((res: any) => {
        this.residencystatuslist = res.value;
        console.log(res);
        console.log(this.residencystatuslist);
      });
  }

  getlanguagelist() {
    this.respondentservice.getLanguageList()
      .subscribe((res: any) => {
        console.log(res);
        this.languagelist = res.value;
      });
  }

  getcountrylist() {
    this.respondentservice.getCountryList()
      .subscribe((res: any) => {
        console.log(res);
        this.countrylist = res.value;
      });
  }

  getCommunicationLevel() {
    this.respondentservice.getRespondentData('CommunicationLevel', this.resId)
      .subscribe((res: any) => {
        console.log(res);
        this.comunicationLevelList = res.value;
      });
  }

  updateYearMovedToCountry() {
    console.log("inside updateYearMovedToCountry");
    if (((this.currentyear - this.respondent.yearMovedToCountry) < 0 ||
      (this.currentyear - this.respondent.yearMovedToCountry) > 100) && this.respondent.yearMovedToCountry)
      this.invalidYearErrMsg = true;
    else
      this.invalidYearErrMsg = false;
  }

  updateRespondent(form) {
    this.isSubmitForm = true;
    this.invalidYearErrMsg = false;
    if (form.invalid) {
      console.log(form);
      //this.isSubmitForm = false;
    }
    else if (((this.currentyear - this.respondent.yearMovedToCountry) < 0 ||
      (this.currentyear - this.respondent.yearMovedToCountry) > 100) && this.respondent.yearMovedToCountry)
      this.invalidYearErrMsg = true;
    else {
      this.respondentservice.updateReferenceData('CommunicationLevel', this.comunicationLevelList, this.resId)
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
          this.respondent = res.value;
        });
    }
  }

  unmask(value) {
    var ret = value.replace(/\D+/g, '');
    return ret;
  }

  gotoTop() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0)
    }
  }
}
