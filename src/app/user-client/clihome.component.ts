import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as JWT from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';

import { DocumentServices } from '../services/document.services';
import { Client } from './../models/client';
import { ClientServices } from './../services/client.services';
import { SharedServices } from './../services/shared.services';

declare var jQuery: any;

@Component({
  selector: 'CliHomeComponent',
  templateUrl: 'clihome.component.html'
})

export class CliHomeComponent implements OnInit {
  loginusername: string;
  client: Client;
  welcomeCopies: any;

  constructor(private router: Router, private _docService: DocumentServices, private cookieservice: CookieService,
    private clientservice: ClientServices, private sharedservice: SharedServices) {
  }

  ngOnInit() {
    this.getWebsiteCopies();
    this.getLoginUserData();
  }

  getWebsiteCopies() {
    this.sharedservice.getWebsiteCopies()
      .subscribe((res: any) => {
        console.log(res)
        this.welcomeCopies = res.value;
      })
  }

  getLoginUserData() {
    var token = JWT(this.cookieservice.get('auth_token'));
    console.log(token);
    this.loginusername = token["unique_name"];
    this.getClientContactById(token['primarysid']);
  }

  getClientContactById(id) {
    this.clientservice.getClientContactById(id)
      .subscribe((res: any) => {
        console.log(res)
        this.getClientById(res.value.clientId);
      })
  }

  getClientById(id) {
    this.clientservice.getAllClientbyId(id)
      .subscribe((res: any) => {
        console.log(res);
        this.client = res.value;
      });
  }
}

