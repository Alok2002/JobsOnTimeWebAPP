import { InputServices } from './../../services/input.services';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { apiHost, mobileMask, phoneMask, postcodeMask, postcodePattern, phonePattern, mobilePattern } from '../../app.component';
import { Respondent } from '../../models/respondent';
import { RespondentServices } from '../../services/respondent.services';
import { SecurityInfoResolve } from '../../services/securityinfo.reslove';
import { SharedServices } from '../../services/shared.services';
import { SecurityRights } from '../../shared/enum';

declare var jQuery: any;
@Component({
  selector: 'BPMContactComponent',
  templateUrl: './bpmcontact.component.html'
})

export class BPMContactComponent implements OnInit {
  postcodePattern = postcodePattern;
  phonePattern = phonePattern;
  mobilePattern = mobilePattern;
  @Input() resId: number;
  @Input() isMyProfile = false;

  respondent: Respondent;
  isLoading = true;
  genderList = [];
  currentyear: number;

  businesssizelist = [];
  occupationlevellist = [];
  industrylist = [];
  stateslist = [];

  occupationlist = [];

  postcodes = [];
  postcodesdetails = [];
  isPostSuggShow = false;
  today = new Date();
  isSubmitForm = false;
  employerturnoverlist = [];
  locationAPI: string = apiHost + '/api/data-provider/location/:keyword';
  occupationAPI: string = apiHost + '/api/data-provider/occupation/:keyword';
  monthList = [];

  phoneMask = phoneMask;
  mobileMask = mobileMask;

  hasPasswordPermission = false;
  businessrolelist = [];

  @ViewChild('bpmContactForm') bpmContactForm;
  public postcodeMask = postcodeMask;
  countrycode: string;

  constructor(private respondentservice: RespondentServices, private securityInfoResolve: SecurityInfoResolve,
    private sharedservice: SharedServices, private _sanitizer: DomSanitizer, private router: Router,
    private inpService: InputServices) {
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
        });
    }
    else {
      this.respondent = new Respondent();
      this.respondent.id = 0;
      this.isLoading = false;
    }

    // this.getGenderList();
    this.currentyear = (new Date()).getFullYear();
    this.getoccupationlist();
    this.getbusinesssizelist();
    this.getoccupationlevellist();
    this.getData();
    this.getStates();
    this.getemployerturnoverlist();
    this.getMonthList();
    this.getPermissionDetails();
    this.getBusinessRoleList();
    this.getCountryCode();
  }

  getGenderList() {
    this.respondentservice.getGenderList()
      .subscribe((re: any) => {
        console.log(re);
        this.genderList = re.value;
      });
  }

  getBusinessRoleList() {
    this.respondentservice.getBusinessRoleList()
      .subscribe((res: any) => {
        console.log(res);
        this.businessrolelist = res.value;
      });
  }

  getoccupationlist() {
    this.respondentservice.getRespondentData('Occupation', this.resId)
      .subscribe((res: any) => {
        console.log(res);
        this.occupationlist = res.value;
        this.updateOccupationObject();

        this.isLoading = false;
      });
  }

  updateBpmContact(form) {
    this.isSubmitForm = true;
    if (form.invalid) {
      console.log(form);
      //this.isSubmitForm = false;
    } else {
      this.respondent.businessRego = true;

      if (this.respondent.occupationObj)
        this.respondent.occupationId = this.respondent.occupationObj['id'];
      /*if (this.respondent.partnerOccupationObj)
          this.respondent.partnerOccupationId = this.respondent.partnerOccupationObj['id'];*/

      //if (!this.respondent.birthMonth) this.respondent.birthMonth = 1;
      console.log(this.respondent.occupationObj);
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
            this.router.navigate(['/bussinesspanelmember', res.value.id]);
          }
          if (res.succeeded)
            this.respondent = res.value;

          this.updateOccupationObject();
        });
    }
  }

  /*getLocation(e) {
    //if(this.client.suburb.length > 4)
    this.sharedservice.getLocationPostCodes(this.respondent.suburbHome)
      .subscribe((res) => {
        this.postcodes = res.value;
        this.isPostSuggShow = true;
        console.log(this.postcodes);
      });
  }*/

  getbusinesssizelist() {
    this.respondentservice.getBusinessSizeList()
      .subscribe((res: any) => {
        console.log(res);
        this.businesssizelist = res.value;
      });
  }

  getoccupationlevellist() {
    this.respondentservice.getOccupationLevelList()
      .subscribe((res: any) => {
        console.log(res);
        this.occupationlevellist = res.value;
      });
  }

  getemployerturnoverlist() {
    this.respondentservice.getEmployerTurnOverList()
      .subscribe((res: any) => {
        console.log(res);
        this.employerturnoverlist = res.value;
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
        this.occupationlist = res.value;
        this.updateOccupationObject();
      });
  }

  getStates() {
    this.sharedservice.getStates()
      .subscribe((re: any) => {
        console.log(re);
        this.stateslist = re.value;
      });
  }

  autocompleListFormatter = (data: any) => {
    let html = `<span>${data.value}</span>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
  };

  setBusinessLocation(e) {
    console.log(e);
    if (e.hasOwnProperty('state')) this.respondent.state = e.state;
    if (e.hasOwnProperty('suburb')) this.respondent.suburbWork = e.suburb;
    if (e.hasOwnProperty('postcode')) this.respondent.postcodeWork = e.postcode;
  }

  selectedCode(pc) {
    this.isPostSuggShow = false;
    this.respondent.suburbHome = pc.suburb;
    this.respondent.state = pc.state;
    this.respondent.postcodeHome = pc.postcode;
  }

  getMonthList() {
    this.sharedservice.GetMonthList()
      .subscribe((res: any) => {
        console.log(res);
        this.monthList = res.value;
      });
  }

  updateOccupationObject() {
    this.occupationlist.forEach(va => {
      if (va.id == this.respondent.occupationId)
        this.respondent.occupationObj = va.description;
      /*if (va.id == this.respondent.partnerOccupationId)
          this.respondent.partnerOccupationObj = va.description;*/
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

  getCountryCode() {
    this.sharedservice.getCountryCode()
      .subscribe((res: any) => {
        console.log(res)
        this.countrycode = res.value.value;
      })
  }
}
