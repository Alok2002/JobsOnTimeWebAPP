import { Component, Inject, Input, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import swal from 'sweetalert2';

import { apiHost, yearMask } from '../app.component';
import { Respondent } from '../models/respondent';
import { InputServices } from '../services/input.services';
import { RespondentServices } from '../services/respondent.services';
import * as moment from 'moment';
import { isPlatformBrowser } from '@angular/common';

declare var jQuery: any;

@Component({
  selector: 'ResOccupationComponent',
  templateUrl: './resoccupation.component.html'
})

export class ResOccupationComponent implements OnInit {
  @Input() resId: number;
  @Input() isMyProfile = false;

  isLoading = true;
  respondent: Respondent;
  highereducationlevellist = [];
  employerturnoverlist = [];
  businesssizelist = [];
  educationtypelist = [];
  occupationlevellist = [];
  industrylist = [];
  occupationlist = [];
  hoursPerWeekList = [];

  settings = { singleSelection: true, text: 'Select Occupation', enableSearchFilter: true };
  today = new Date();
  locationAPI: string = apiHost + '/api/data-provider/location/:keyword';
  occupationAPI: string = apiHost + '/api/data-provider/occupation/:keyword';
  isSubmitForm = false;

  yearMask = yearMask;
  @ViewChild('resOccupationForm') resOccupationForm;

  constructor(private respondentservice: RespondentServices, @Inject(PLATFORM_ID) public platformId: Object,
    private _sanitizer: DomSanitizer, private inpService: InputServices) {
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

          if (this.respondent.maternityFromDate)
            this.respondent.maternityFromDate = moment(this.respondent.maternityFromDate).toDate();
          if (this.respondent.maternityToDate)
            this.respondent.maternityToDate = moment(this.respondent.maternityToDate).toDate();

          //this.isLoading = false;
          this.getAllDataForInit();
          if (this.respondent.occupationHoursPerWeek == 0) this.respondent.occupationHoursPerWeek = null;
        });
    }
    else {
      this.respondent = new Respondent();
      //this.isLoading = false;
      this.getAllDataForInit();
    }
  }

  ngAfterViewInit() {
    if (typeof jQuery != 'undefined') {
      setTimeout(() => {
        jQuery('#bussiness').focus();
      }, 1000)
    }
  }

  getAllDataForInit() {
    this.gethighesteducationlevellist();
    this.getemployerturnoverlist();
    this.getbusinesssizelist();
    this.geteducationtypelist();
    this.getoccupationlevellist();

    this.getData();
  }

  gethighesteducationlevellist() {
    this.respondentservice.getHighestEducationLevelList()
      .subscribe((res: any) => {
        console.log(res);
        this.highereducationlevellist = res.value;
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

  geteducationtypelist() {
    this.respondentservice.getEducationTypeList()
      .subscribe((res: any) => {
        console.log(res);
        this.educationtypelist = res.value;
      });
  }

  getoccupationlevellist() {
    this.respondentservice.getOccupationLevelList()
      .subscribe((res: any) => {
        console.log(res);
        this.occupationlevellist = res.value;
      });
  }

  gethoursPerWeekList() {
    this.respondentservice.getOccupationLevelList()
      .subscribe((res: any) => {
        console.log(res);
        this.hoursPerWeekList = res.value;
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
        /*res.value.forEach((va) => {
            this.occupationlist.push({id: va.id, value: va.description});
        });*/
        this.occupationlist = res.value;
        this.updateOccupationObject();

        this.ngAfterViewInit();
        this.isLoading = false;
      });
  }

  autocompleListFormatter = (data: any) => {
    let html = `<span>${data.value}</span>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
  };

  updateRespondent(form) {
    this.isSubmitForm = true;
    if (form.invalid) {
      console.log(form);
      //this.isSubmitForm = false;
    } else {
      console.log(this.respondent);
      console.log(this.respondent.occupationObj);
      debugger

      if (this.respondent.maternityFromDate) {
        var maternityFromDate = moment(this.respondent.maternityFromDate, 'YYYY-MM-DD');
        this.respondent.maternityFromDate = maternityFromDate.utcOffset(0, true).format();
      }

      if (this.respondent.maternityToDate) {
        var maternityToDate = moment(this.respondent.maternityToDate, 'YYYY-MM-DD');
        this.respondent.maternityToDate = maternityToDate.utcOffset(0, true).format();
      }

      if (this.respondent.occupationObj && this.respondent.occupationObj['id'])
        this.respondent.occupationId = this.respondent.occupationObj['id'];
      if (this.respondent.partnerOccupationObj && this.respondent.partnerOccupationObj['id'])
        this.respondent.partnerOccupationId = this.respondent.partnerOccupationObj['id'];
      console.log(this.respondent.occupationId);

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
          this.updateOccupationObject();
        });
    }
  }

  setEduSub(e) {
    this.respondent.studentSuburb = e.suburb;
  }

  updateOccupationObject() {
    this.occupationlist.forEach(va => {
      if (va.id == this.respondent.occupationId)
        this.respondent.occupationObj = va.description;
      if (va.id == this.respondent.partnerOccupationId)
        this.respondent.partnerOccupationObj = va.description;
    });
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
