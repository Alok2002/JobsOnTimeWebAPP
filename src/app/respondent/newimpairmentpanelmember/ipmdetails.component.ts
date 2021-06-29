import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import swal from 'sweetalert2';
import { Respondent } from '../../models/respondent';
import { RespondentServices } from '../../services/respondent.services';
import { SharedServices } from '../../services/shared.services';

declare var jQuery: any;

@Component({
  selector: 'IPMDetailsComponent',
  templateUrl: './ipmdetails.component.html'
})

export class IPMDetailsComponent implements OnInit {
  @Input() resId: number;
  @Input() isMyProfile = false;

  respondent: Respondent;
  isLoading = true;
  genderList = [];
  currentyear: number;

  occupationlist = [];
  imparirmenttypeslist = [];
  impairmentdeviceslist = [];
  assistivetechnologylist = [];

  postcodes = [];
  postcodesdetails = [];
  isPostSuggShow = false;
  today = new Date();

  competencyList = [];

  constructor(private respondentservice: RespondentServices, private sharedservice: SharedServices,
    @Inject(PLATFORM_ID) public platformId: Object) { }

  ngOnInit() {
    if (this.resId) {
      this.respondentservice.getRespondentById(this.resId)
        .subscribe((res: any) => {
          this.respondent = res.value;
          this.isLoading = false;
        })
    }
    else {
      this.respondent = new Respondent();
      this.isLoading = false;
    }

    // this.getGenderList();
    this.currentyear = (new Date()).getFullYear();
    // this.getoccupationlist();

    this.getimpairmenttypes();
    this.getimpairmentdevices();
    this.getassistivetechnology();
  }

  /*getGenderList() {
    this.respondentservice.getGenderList()
      .subscribe(re => {
        console.log(re);
        this.genderList = re.value;
      })
  }*/

  /*getoccupationlist() {
    this.respondentservice.getRespondentData('occupation', this.resId)
      .subscribe(res => {
        console.log(res);
        this.occupationlist = res.value;
      })
  }*/

  getimpairmenttypes() {
    this.respondentservice.getRespondentData('ImpairmentTypes', this.resId)
      .subscribe((res: any) => {
        console.log(res);
        this.imparirmenttypeslist = res.value;
      })
  }

  /*updateimpairmenttypes(index: number, e) {
    if (e.target.checked) {
      this.imparirmenttypeslist[index].selected = true;
    }
    else {
      this.imparirmenttypeslist[index].selected = false;
    }
    console.log(this.imparirmenttypeslist);
  }*/

  getimpairmentdevices() {
    this.respondentservice.getImpairmentCompetencyList()
      .subscribe((res: any) => {
        console.log(res);
        this.competencyList = res.value;
      })
    this.respondentservice.getRespondentData('ImpairmentDevices', this.resId)
      .subscribe((res: any) => {
        console.log(res);
        this.impairmentdeviceslist = res.value;
        console.log(this.impairmentdeviceslist);
      })
  }

  updateimpairmentdevices(index: number, e) {
    if (e.target.checked) {
      this.impairmentdeviceslist[index].selected = true;
    }
    else {
      this.impairmentdeviceslist[index].selected = false;
    }
    console.log(this.impairmentdeviceslist);
  }

  getassistivetechnology() {
    this.respondentservice.getRespondentData('AssistiveTechnology', this.resId)
      .subscribe((res: any) => {
        console.log(res);
        this.assistivetechnologylist = res.value;
      })
  }

  updateassistivetechnology(index: number, e) {
    if (e.target.checked) {
      this.assistivetechnologylist[index].selected = true;
    }
    else {
      this.assistivetechnologylist[index].selected = false;
    }
    console.log(this.assistivetechnologylist);
  }


  updateBpmContact() {
    this.respondentservice.updateReferenceData('AssistiveTechnology', this.assistivetechnologylist, this.resId)
      .subscribe(res => {
        console.log(res);
      })

    this.respondentservice.updateReferenceData('ImpairmentDevices', this.impairmentdeviceslist, this.resId)
      .subscribe(res => {
        console.log(res);
      })

    console.log(this.imparirmenttypeslist);
    this.respondentservice.updateReferenceData('ImpairmentTypes', this.imparirmenttypeslist, this.resId)
      .subscribe(res => {
        console.log(res);
      })

    /*this.respondentservice.updateReferenceData('occupation', this.occupationlist, this.resId)
      .subscribe(res => {
        console.log(res);
      })*/

    this.respondentservice.updateRespondent(this.respondent)
      .subscribe((res: any) => {
        console.log(res);

        if (res.succeeded)
          swal(
            'Successfully Saved!',
            '',
            'success'
          )
      })
  }

  getLocation(e) {
    //if(this.client.suburb.length > 4)
    this.sharedservice.getLocationPostCodes(this.respondent.suburbHome)
      .subscribe((res: any) => {
        this.postcodes = res.value;
        this.isPostSuggShow = true;
        console.log(this.postcodes);
      });
  }

  selectedCode(pc) {
    this.isPostSuggShow = false;
    this.respondent.suburbHome = pc.suburb;
    this.respondent.state = pc.state;
    this.respondent.postcodeHome = pc.postcode;
  }

  gotoTop() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0)
    }
  }
}
