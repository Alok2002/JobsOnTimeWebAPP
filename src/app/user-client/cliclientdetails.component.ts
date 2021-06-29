import { ClientServices } from './../services/client.services';
import { CookieService } from 'ngx-cookie-service';
import { Component, Input, OnInit } from '@angular/core';
import * as JWT from 'jwt-decode';

import { JobServices } from '../services/job.services';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SharedServices } from '../services/shared.services';
import { Client } from '../models/client';

declare var jQuery: any;

@Component({
  selector: 'CliClientDetailsComponent',
  templateUrl: './cliclientdetails.component.html'
})

export class CliClientDetailsComponent implements OnInit {
  @Input() editClientId: number;
  @Input() isUpdateClient: boolean = true;
  @Input() selectedTab: string;
  client: Client;

  constructor(private jobService: JobServices, private sharedService: SharedServices, private securityInfoResolve: SecurityInfoResolve,
    private cookieservice: CookieService, private clientservice: ClientServices) { }

  ngOnInit() {
    this.selectedTab = "clientdetails";
    this.getLoginUserData();
  }

  getLoginUserData() {
    var token = JWT(this.cookieservice.get('auth_token'));
    console.log(token);
    this.getClientContactById(token['primarysid']);
  }

  getClientContactById(id) {
    this.clientservice.getClientContactById(id)
      .subscribe((res: any) => {
        console.log(res)
        this.editClientId = res.value.clientId;
        this.getClientById();
      })
  }

  getClientById() {
    this.clientservice.getAllClientbyId(this.editClientId)
      .subscribe((res: any) => {
        console.log(res);
        this.client = res.value;
      });
  }
}
