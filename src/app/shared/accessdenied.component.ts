import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SharedServices } from '../services/shared.services';
import { UserServices } from '../services/user.services';

//import { JobTrackerComponent } from '../shared/jobtracker';

@Component({
  selector: 'AccessDeniedComponent',
  templateUrl: './accessdenied.component.html'
})

export class AccessDeniedComponent implements OnInit {
  securitydata: string;
  errors = [];

  constructor(private activateroute: ActivatedRoute, private sharedService: SharedServices, 
        private userservice: UserServices, private securityInfoResolve: SecurityInfoResolve,    private cookieservice: CookieService) {
  }

  ngOnInit() {
    this.activateroute.params.subscribe(params => {
      if (params['securitydata']) {
        this.securitydata = params['securitydata'];
        this.getPermissionDetails();
      }
    });
  }

  getPermissionDetails(){
    this.securityInfoResolve.checkPermission(this.securitydata)
      .subscribe((res: any) => {
        this.errors = res.errors;
      })
  }
}
