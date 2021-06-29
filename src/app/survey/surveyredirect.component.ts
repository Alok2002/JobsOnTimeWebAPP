import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as JWT from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { RespondentServices } from '../services/respondent.services';
import { SessionServices } from '../services/session.services';
import { SurveyServices } from '../services/survey.services';
import { JobServices } from '../services/job.services';

@Component({
  selector: 'SurveyRedirectComponent',
  templateUrl: './surveyredirect.component.html'
})

export class SurveyRedirectComponent implements OnInit {
  jobId: number;

  constructor(private router: Router, private activateroute: ActivatedRoute, private resservice: RespondentServices,
    private surveyservice: SurveyServices, private jobservice: JobServices, private sessionservice: SessionServices,
    private cookieservice: CookieService) {
  }

  ngOnInit() {
    this.activateroute.params.subscribe(params => {
      if (params['jobid']) this.jobId = params['jobid'];
    });
    this.getLoginUserData();
  }

  getLoginUserData() {
    let cookieExists = this.cookieservice.check('auth_token');
    if (cookieExists) {
      var token = JWT(this.cookieservice.get('auth_token'));
      if (token["actort"] == 'Respondent') {
        var resid = token["primarysid"];
        this.surveyservice.getPublicSurveyEncodedValues(resid, this.jobId)
          .subscribe((res: any) => {
            console.log(res);
            if (res.value)
              this.router.navigate(['/survey', 'survey-start', res.value]);
          })
      }
    }
    else {
      window.location.href = '/signin/' + this.jobId;
    }
  }
}
