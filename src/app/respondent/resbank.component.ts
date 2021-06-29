import { Component, Input, OnInit } from '@angular/core';
import swal from 'sweetalert2';

import { financeBSBMask, financeBSBPattern } from '../app.component';
import { Respondent } from '../models/respondent';
import { RespondentServices } from '../services/respondent.services';

declare var jQuery: any;

@Component({
  selector: 'ResBankComponent',
  templateUrl: './resbank.component.html'
})

export class ResBankComponent implements OnInit {
  financeBSBPattern = financeBSBPattern;
  @Input() resId: number;
  @Input() isMyProfile = false;

  respondent: Respondent;
  isLoading = true;

  bsbMask = financeBSBMask;

  constructor(private respondentservice: RespondentServices) {
  }

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
      this.isLoading = false;
    }
  }

  updateRespondent() {
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

  unmask(value){
    var ret = value.replace(/\D+/g, '');
    return ret;
  }
}
