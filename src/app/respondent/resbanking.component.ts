import { Component, Input, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { Respondent } from '../models/respondent';
import { RespondentServices } from '../services/respondent.services';

declare var jQuery: any;

@Component({
  selector: 'ResBankingComponent',
  templateUrl: './resbanking.component.html'
})

export class ResBankingComponent implements OnInit {
  @Input() resId: number;
  @Input() isMyProfile = false;
  
  otherBanks = [];
  superannuation = [];
  investment = [];
  respondent: Respondent;
  isLoading = true;

  constructor(private resService: RespondentServices) {
  }

  ngOnInit() {
    this.getRespBank();
    this.getSuperannuation();
    this.getinvestment();

    if (this.resId) {
      this.resService.getRespondentById(this.resId)
        .subscribe((res: any) => {
          this.respondent = res.value;
          this.isLoading = false;
        })
    }
    else {
      this.respondent = new Respondent();
      this.isLoading = false;
    }
  }

  getRespBank() {
    this.resService.getRespondentData('banks', this.resId)
      .subscribe((res: any) => {
        console.log(res);
        this.otherBanks = res.value;
      });
  }

  updateOtherBankDetails(index: number, e) {
    if (e.target.checked) {
      this.otherBanks[index].selected = true;
    }
    else {
      this.otherBanks[index].selected = false;
    }
    console.log(this.otherBanks);
  }

  getSuperannuation() {
    this.resService.getRespondentData('superannuation', this.resId)
      .subscribe((res: any) => {
        console.log(res);
        this.superannuation = res.value;
      });
  }

  updateSuperannuation(index: number, e) {
    if (e.target.checked) {
      this.superannuation[index].selected = true;
    }
    else {
      this.superannuation[index].selected = false;
    }
    console.log(this.superannuation);
  }

  getinvestment() {
    this.resService.getRespondentData('investment', this.resId)
      .subscribe((res: any) => {
        console.log(res);
        this.investment = res.value;
      });
  }

  updateinvestment(index: number, e) {
    if (e.target.checked) {
      this.investment[index].selected = true;
    }
    else {
      this.investment[index].selected = false;
    }
    console.log(this.investment);
  }

  updateSubmit() {   
    this.resService.updateReferenceData('superannuation', this.superannuation, this.resId)
      .subscribe(res => {
        console.log(res);
      })

    this.resService.updateReferenceData('investment', this.investment, this.resId)
      .subscribe(res => {
        console.log(res);
      })

    this.resService.updateRespondent(this.respondent)
      .subscribe((res: any) => {
        console.log(res);

        if(res.succeeded)
        swal(
          'Successfully Saved!',
          '',
          'success'
        )
      })
  }
}
