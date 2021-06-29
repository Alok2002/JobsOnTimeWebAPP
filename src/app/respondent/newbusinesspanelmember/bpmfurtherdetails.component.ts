import { Component, Input, OnInit } from '@angular/core';
import { Respondent } from '../../models/respondent';
import { RespondentServices } from '../../services/respondent.services';

declare var jQuery: any;

@Component({
  selector: 'BPMFurtherdetails',
  templateUrl: './bpmfurtherdetails.component.html'
})

export class BPMFurtherdetails implements OnInit {
  @Input() resId: number;
  @Input() isMyProfile = false;

  respondent: Respondent;
  isLoading = true;

  energyproviderlist = [];
  today = new Date();
  
  constructor(private respondentservice: RespondentServices) { }

  ngOnInit() {
    if(this.resId){
      this.respondentservice.getRespondentById(this.resId)
        .subscribe((res: any) => {
          this.respondent = res.value;
          this.isLoading = false;
        })
    }
    else{
      this.respondent = new Respondent();
      this.isLoading = false;
    }

    this.getenergyproviderlist();
  }

  getenergyproviderlist() {
    this.respondentservice.getRespondentData('energyprovider', this.resId)
        .subscribe((res: any) => {
            console.log(res);
            this.energyproviderlist = res.value;
        })
}
/*
  getGenderList(){
    this.respondentservice.getGenderList()
      .subscribe(re => {
        console.log(re);
        this.genderList = re.value;
      })
  }

   getoccupationlist(){
    this.respondentservice.getRespondentData('occupation', this.resId)
      .subscribe(res => {
        console.log(res);
        this.occupationlist = res.value;
      })
  }

  updateBpmContact(){
    this.respondentservice.updateRespondent(this.respondent)
      .subscribe(res => {
        console.log(res);

        if(res.succeeded)
        swal(
          'Successfully Saved!',
          '',
          'success'
        )
      })
  }*/
}
