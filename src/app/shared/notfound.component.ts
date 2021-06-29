import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SharedServices } from '../services/shared.services';
import { UserServices } from '../services/user.services';

@Component({
  selector: 'NotFoundComponent',
  templateUrl: './notfound.component.html'
})

export class NotFoundComponent implements OnInit {
  constructor(private activateroute: ActivatedRoute, private sharedService: SharedServices,
    private userservice: UserServices, private securityInfoResolve: SecurityInfoResolve, private cookieservice: CookieService) {
  }

  ngOnInit() {
  }
}