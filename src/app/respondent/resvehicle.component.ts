import { Component, Input, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { yearMask } from '../app.component';
import { Respondent } from '../models/respondent';
import { RespondentServices } from '../services/respondent.services';

declare var jQuery: any;

@Component({
  selector: 'ResVehicleComponent',
  templateUrl: './resvehicle.component.html'
})

export class ResVehicleComponent implements OnInit {
  @Input() resId: number;
  @Input() isMyProfile = false;

  isLoading = true;
  respondent: Respondent;
  vehicletypelist = [];
  vehiclemakelist = [];
  today = new Date();

  yearMask = yearMask;

  constructor(private respondentservice: RespondentServices) {
  }

  ngOnInit() {
    if (this.resId) {
      this.respondentservice.getRespondentById(this.resId)
        .subscribe((res: any) => {
          this.respondent = res.value;
          console.log(this.respondent);
          this.isLoading = false;
        });
    }
    else {
      this.respondent = new Respondent();
      this.isLoading = false;
    }

    this.getvehicletypelist();
    this.getvehiclemakelist();
  }

  getvehicletypelist() {
    this.respondentservice.getVehicleTypeList()
      .subscribe((res: any) => {
        this.vehicletypelist = res.value;
        console.log(this.vehicletypelist);
      });
  }

  getvehiclemakelist() {
    this.respondentservice.getRespondentData('vehiclemake', this.resId)
      .subscribe((res: any) => {
        this.vehiclemakelist = res.value;
        console.log(res);
      });
  }

  updateSubmit() {
    this.respondentservice.updateRespondent(this.respondent)
      .subscribe((res: any) => {
        console.log(res);

        if (res.succeeded)
          swal(
            'Successfully Saved!',
            '',
            'success'
          );
      });
  }

  unmask(value) {
    var ret = value.replace(/\D+/g, '');
    return ret;
  }
}
