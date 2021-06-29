import { Component, Input, OnInit } from '@angular/core';
import swal from 'sweetalert2';

import { financeBSBMask, financeBSBPattern } from '../app.component';
import { Respondent } from '../models/respondent';
import { RespondentServices } from '../services/respondent.services';

declare var jQuery: any;

@Component({
  selector: 'ResCustomFieldsComponent',
  templateUrl: './rescustomfields.component.html'
})

export class ResCustomFieldsComponent implements OnInit {  
  @Input() resId: number;
  @Input() isMyProfile = false;
  respondent: Respondent;
  isLoading = true;
  fieldLabels: any;  

  constructor(private respondentservice: RespondentServices) {
  }

  ngOnInit() {
    if (this.resId) {      
      this.respondentservice.getRespondentById(this.resId)
        .subscribe((res: any) => {
          this.respondent = res.value;
          console.log(this.respondent)
          this.getRepondentList();
          this.isLoading = false;
        });
    }
    else {
      this.respondent = new Respondent();
      this.isLoading = false;
    }
  }
  
  getRepondentList() {
    this.respondentservice.getRespondentlist(this.respondent.respondentListId) //6
      .subscribe((res: any) => {
        console.log(res)
        this.fieldLabels = res.value;
      })
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
}
