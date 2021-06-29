import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import swal from 'sweetalert2';

import { Respondent } from '../models/respondent';
import { RespondentServices } from '../services/respondent.services';

declare var jQuery: any;

@Component({
  selector: 'ResOtherComponent',
  templateUrl: './resother.component.html'
})

export class ResOtherComponent implements OnInit {
  @Input() resId: number;
  @Input() isMyProfile = false;

  respondent: Respondent;
  isLoading = true;
  hobbies = [];
  pets = [];
  generalproduct = [];
  sourcetype = [];
  today = new Date();
  secureList = [];

  initRespondentInactive: boolean;

  constructor(private resService: RespondentServices, @Inject(PLATFORM_ID) public platformId: Object) {
  }

  ngOnInit() {
    this.getRespHobbies();
    this.getPets();
    this.getgeneralproduct();
    this.getsourcetype();
    this.getRespondentList();

    if (this.resId) {
      this.resService.getRespondentById(this.resId)
        .subscribe((res: any) => {
          this.respondent = res.value;
          this.initRespondentInactive = this.respondent.inactive;
          this.isLoading = false;
        })
    }
    else {
      this.respondent = new Respondent();
      this.isLoading = false;
    }
  }

  getRespHobbies() {
    this.resService.getRespondentData('Hobbies', this.resId)
      .subscribe((res: any) => {
        console.log(res);
        this.hobbies = res.value;
      });
  }

  updateHobbyDetails(index: number, e) {
    if (e.target.checked) {
      this.hobbies[index].selected = true;
    }
    else {
      this.hobbies[index].selected = false;
    }
    console.log(this.hobbies);
  }

  getPets() {
    this.resService.getRespondentData('Pets', this.resId)
      .subscribe((res: any) => {
        console.log(res);
        this.pets = res.value;
      });
  }

  updatePets(index: number, e) {
    if (e.target.checked) {
      this.pets[index].selected = true;
    }
    else {
      this.pets[index].selected = false;
    }
    console.log(this.pets);
  }

  getgeneralproduct() {
    this.resService.getRespondentData('GeneralProduct', this.resId)
      .subscribe((res: any) => {
        console.log(res);
        this.generalproduct = res.value;
      });
  }

  updategeneralproduct(index: number, e) {
    if (e.target.checked) {
      this.generalproduct[index].selected = true;
    }
    else {
      this.generalproduct[index].selected = false;
    }
    console.log(this.generalproduct);
  }

  getsourcetype() {
    this.resService.getRespondentData('SourceType', this.resId)
      .subscribe((res: any) => {
        console.log(res);
        this.sourcetype = res.value;
      });
  }

  getRespondentList() {
    this.resService.getRespondentData('RespondentList', this.resId)
      .subscribe((res: any) => {
        console.log(res);
        this.secureList = res.value;
      });
  }

  updateSubmit() {
    this.resService.updateReferenceData('Pets', this.pets, this.resId)
      .subscribe((res: any) => {
        console.log(res);
      })

    this.resService.updateReferenceData('GeneralProduct', this.generalproduct, this.resId)
      .subscribe(res => {
        console.log(res);
      })

    this.resService.updateRespondent(this.respondent)
      .subscribe((res: any) => {
        console.log(res);

        if (res.succeeded) {
          this.initRespondentInactive = this.respondent.inactive;
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
      })
  }

  gotoTop() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0)
    }
  }
}
