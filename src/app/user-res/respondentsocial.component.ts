import { MetaService } from '@ngx-meta/core';
import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

import { RespondentServices } from '../services/respondent.services';
import { SharedServices } from './../services/shared.services';
import { pageTile } from '../app.component';

@Component({
  selector: 'Respondent-Social',
  templateUrl: './respondentsocial.component.html',
})

export class RespondentSocial {
  constructor(private respondentservice: RespondentServices, private cookieservice: CookieService,
    private sharedService: SharedServices, private activatedRoute: ActivatedRoute, private metaservice: MetaService) {
  }
}