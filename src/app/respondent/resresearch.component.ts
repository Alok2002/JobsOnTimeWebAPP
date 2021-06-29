import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import swal from 'sweetalert2';

import { Respondent } from '../models/respondent';
import { InputServices } from '../services/input.services';
import { RespondentServices } from '../services/respondent.services';

declare var jQuery: any;

@Component({
  selector: 'ResResearchComponent',
  templateUrl: './resresearch.component.html'
})

export class ResResearchComponent implements OnInit {
  @Input() resId: number;
  @Input() isMyProfile: number;

  respondent: Respondent;
  isLoading = true;

  researchtopic = [];
  contactMethods = [];
  contactTime = [];
  sessionType = [];
  today = new Date();
  researchLocationList = [];
  mainCityLocationList = [];

  constructor(private resService: RespondentServices, private inpService: InputServices,
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
      this.resService.getRespondentById(this.resId)
        .subscribe((res: any) => {
          this.respondent = res.value;
          this.isLoading = false;

          this.getresearchtopic();
          this.getpreferredcontactmethodlist();
          this.getpreferredcontacttimelist();
          this.getsessiontypelist();
          this.getData();
        })
    }
    else {
      this.respondent = new Respondent();
      this.isLoading = false;

      this.getresearchtopic();
      this.getpreferredcontactmethodlist();
      this.getpreferredcontacttimelist();
      this.getsessiontypelist();
      this.getData();
    }
  }

  getData() {
    this.resService.getRespondentData('Region', this.resId)
      .subscribe((res: any) => {
        console.log(res);
        this.researchLocationList = res.value;
      });

    this.resService.getRespondentData('MainCityLocation', this.resId)
      .subscribe((res: any) => {
        console.log(res);
        this.mainCityLocationList = res.value;
      });
  }

  getresearchtopic() {
    this.resService.getRespondentData('researchtopic', this.resId)
      .subscribe((res: any) => {
        console.log(res);
        this.researchtopic = res.value;
      });
  }

  updateresearchtopic(index: number, e) {
    if (e.target.checked) {
      this.researchtopic[index].selected = true;
    }
    else {
      this.researchtopic[index].selected = false;
    }
    console.log(this.researchtopic);
  }

  getpreferredcontactmethodlist() {
    this.resService.getContactMethodList()
      .subscribe((res: any) => {

        res.value.forEach((ele, i) => {
          if (this.respondent.preferredContactMethod) {
            ele["selected"] = false;
            this.respondent.preferredContactMethod.split('|').forEach(cm => {
              if (cm == ele.code)
                ele["selected"] = true;
            });
          } else {
            ele["selected"] = false;
          }
        });

        this.contactMethods = res.value;
        this.contactMethods.forEach((cm, i) => {
          if (cm.code == "") this.contactMethods.splice(i, 1);
        })

        console.log(this.contactMethods);
      })
  }

  getpreferredcontacttimelist() {
    this.resService.getContactTimeList()
      .subscribe((res: any) => {
        res.value.forEach((ele, i) => {
          if (this.respondent.preferredContactTime) {
            ele["selected"] = false;
            this.respondent.preferredContactTime.split('|').forEach(cm => {
              if (cm == ele.code)
                ele["selected"] = true;
            });
          } else {
            ele["selected"] = false;
          }
        });

        this.contactTime = res.value;
        this.contactTime.forEach((cm, i) => {
          if (cm.code == "") this.contactTime.splice(i, 1);
        })
        console.log(this.contactTime);
      })
  }

  getsessiontypelist() {
    this.resService.getSessionTypeList()
      .subscribe((res: any) => {
        res.value.forEach((ele, i) => {
          if (this.respondent.preferredGroupType) {
            ele["selected"] = false;
            this.respondent.preferredGroupType.split('|').forEach(cm => {
              if (cm == ele.code)
                ele["selected"] = true;
            });
          } else {
            ele["selected"] = false;
          }
        });

        this.sessionType = res.value;
        this.sessionType.forEach((cm, i) => {
          if (cm.code == "") this.sessionType.splice(i, 1);
        })
        console.log(this.sessionType);
      })
  }

  updateRespondent() {    
    this.resService.updateReferenceData('Region', this.researchLocationList, this.resId)
    .subscribe(res => {
        console.log(res);
    });

    var contactmethod = [];
    this.contactMethods.forEach((cm) => {
      if (cm.selected) contactmethod.push(cm.code);
    });

    this.respondent.preferredContactMethod = contactmethod.join('|');
    this.respondent.preferredContactMethod = this.respondent.preferredContactMethod + '|';
    console.log(this.respondent.preferredContactMethod);

    var contacttime = [];
    this.contactTime.forEach((cm) => {
      if (cm.selected) contacttime.push(cm.code);
    });

    this.respondent.preferredContactTime = contacttime.join('|');
    this.respondent.preferredContactTime = this.respondent.preferredContactTime + '|';
    console.log(this.respondent.preferredContactTime);

    var sessiontype = [];
    this.sessionType.forEach((cm) => {
      if (cm.selected) sessiontype.push(cm.code);
    });
    this.respondent.preferredGroupType = sessiontype.join('|');
    this.respondent.preferredGroupType = this.respondent.preferredGroupType + '|';
    
    this.resService.updateRespondent(this.respondent)
      .subscribe((res: any) => {
        console.log(res);

        if (res.succeeded) {
          swal(
            'Successfully Saved!',
            '',
            'success'
          )
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
      })
  }

  gotoTop() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0)
    }
  }
}
