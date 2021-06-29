import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import swal from 'sweetalert2';

import { yearMask } from '../app.component';
import { Children } from '../models/children';
import { Respondent } from '../models/respondent';
import { InputServices } from '../services/input.services';
import { RespondentServices } from '../services/respondent.services';
import { SharedServices } from './../services/shared.services';

declare var jQuery: any;

@Component({
  selector: 'ResFamilyComponent',
  templateUrl: './resfamily.component.html'
})

export class ResFamilyComponent implements OnInit {
  @Input() resId: number;
  @Input() isMyProfile = false;

  isLoading = true;
  respondent: Respondent;
  householdincomelist = [];
  residencytypelist = [];
  householdtypelist = [];
  maritialstatuslist = [];

  howmanychildren: number;
  howmanychildrenlist: Array<Children> = [];
  currentyear: number;

  genderList = [];
  hasChild = false;

  residenceOwnershipList = [];
  today = new Date();
  isSubmitForm = false;

  yearMask = yearMask;
  @ViewChild('resFamilyForm') resFamilyForm;
  monthList = [];

  constructor(private respondentservice: RespondentServices, @Inject(PLATFORM_ID) public platformId: Object,
    private inpService: InputServices, private sharedservice: SharedServices) { }

  numberOnly(event) {
    this.inpService.numberOnly(event);
  };

  stringOnly(event) {
    this.inpService.stringOnly(event);
  };

  ngOnInit() {
    console.log(this.resId);
    if (this.resId) {
      this.respondentservice.getRespondentById(this.resId)
        .subscribe((res: any) => {
          this.respondent = res.value;
          console.log(this.respondent);
          this.isLoading = false;
          this.getChilderByResId();
        })
    }
    else {
      this.respondent = new Respondent();
      this.isLoading = false;
    }

    this.gethouseholdincomelevellist();
    this.getresidencetypelist();
    this.gethouseholdtypelist();
    this.getmaritialstatuslist();
    this.currentyear = (new Date()).getFullYear();

    this.getGenderList();
    this.getData();
    this.getMonthList();
  }

  getMonthList() {
    this.sharedservice.GetMonthList()
      .subscribe((res: any) => {
        console.log(res);
        this.monthList = res.value;
      });
  }

  gethouseholdincomelevellist() {
    this.respondentservice.getHouseholdIncomeLevelList()
      .subscribe((res: any) => {
        console.log(res);
        this.householdincomelist = res.value;
      })
  }

  getresidencetypelist() {
    this.respondentservice.getRespondentData('ResidenceType', this.resId)
      .subscribe((res: any) => {
        console.log(res)
        this.residencytypelist = res.value;
      })
  }

  gethouseholdtypelist() {
    this.respondentservice.getRespondentData('HouseholdType', this.resId)
      .subscribe((res: any) => {
        console.log(res)
        this.householdtypelist = res.value;
      })
  }

  getmaritialstatuslist() {
    this.respondentservice.getRespondentData('MaritalStatus', this.resId)
      .subscribe((res: any) => {
        console.log(res)
        this.maritialstatuslist = res.value;
      })
  }

  getChilderByResId() {
    this.isLoading = true;
    this.respondentservice.getChilderByResId(this.resId)
      .subscribe((res: any) => {
        console.log(res);
        this.isLoading = false;
        if (res.value && res.value.length > 0) {
          this.hasChild = true;
          this.howmanychildrenlist = res.value;
        }

        this.generateChildrenHasChild();
      })
  }

  generateChildren() {
    //if(this.howmanychildrenlist && this.howmanychildrenlist.length < 1)
    this.howmanychildrenlist = [];
    for (var i = 0; i < this.howmanychildren; i++) {
      var children = new Children();
      children.resId = this.resId;      
      children.childYear = null;
      children.childBirthMonth = null;

      this.howmanychildrenlist.push(children);
    }
  }

  generateChildrenHasChild() {
    if (this.howmanychildrenlist.length < 1 && this.respondent.hasChildren) {
      var children = new Children();
      children.resId = this.resId;
      children.childYear = null;
      children.childBirthMonth = null;

      this.howmanychildrenlist.push(children);
    }
    console.log(this.howmanychildrenlist);
    console.log(this.respondent.hasChildren);
  }

  getGenderList() {
    this.respondentservice.getGenderList()
      .subscribe((re: any) => {
        console.log(re);
        this.genderList = re.value;
      })
  }

  updateRespondent(form) {
    this.isSubmitForm = true;
    if (form.invalid) {
      console.log(form);
      //this.isSubmitForm = false;
    } else {
      console.log(this.residenceOwnershipList, this.resId);
      this.respondentservice.updateReferenceData('ResidenceOwnership', this.residenceOwnershipList, this.resId)
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
        });

      this.respondentservice.updateChildren(this.howmanychildrenlist)
        .subscribe((res: any) => {
          console.log(res);
          if (res.succeeded) this.getChilderByResId();
        });
    }

  }
  addChild() {
    var children = new Children();
    children.resId = this.resId;    
    children.childYear = null;
    children.childBirthMonth = null;

    this.howmanychildrenlist.push(children);
  }

  removeChild(i, ch: Children) {
    this.howmanychildrenlist.splice(i, 1);

    if (ch.id) {
      var id = [];
      id.push(ch.id);
      this.respondentservice.removeChild(id)
        .subscribe(res => {
          console.log(res);
        })
    }
  }

  //180825
  getData() {
    this.respondentservice.getRespondentData('ResidenceOwnership', this.resId)
      .subscribe((res: any) => {
        console.log(res);
        this.residenceOwnershipList = res.value;
      });
  }

  unmask(value){
    var ret = value.replace(/\D+/g, '');
    return ret;
  }

  gotoTop() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0)
    }
  }
}
