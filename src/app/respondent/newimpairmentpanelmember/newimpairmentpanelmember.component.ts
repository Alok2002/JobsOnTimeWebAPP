import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Respondent } from '../../models/respondent';
import { RespondentServices } from '../../services/respondent.services';

declare var jQuery: any;

@Component({
  selector: 'NewImpairmentPanelMemberComponent',
  templateUrl: './newimpairmentpanelmember.component.html'
})

export class NewImpairmentPanelMemberComponent implements OnInit {
  selectTab = 'contact';
  //isLoading = true;
  // resId = 103311;
  resId: number;
  respondent: Respondent;

  constructor(private activateroute: ActivatedRoute, private respondentservice: RespondentServices) { }

  ngOnInit() {
    this.activateroute.params.subscribe(params => {
      if (params['resid']) {
        this.resId = params['resid'];
        this.getRespondentById();
        this.selectTab = 'jobs';
      }
      else {
        this.respondent = new Respondent();
        this.resId = 0;
        this.getRespondentById();
      }
    });
  }

  getRespondentById() {
    this.respondentservice.getRespondentById(this.resId)
      .subscribe((res: any) => {
        this.respondent = res.value;
      })
  }
}
