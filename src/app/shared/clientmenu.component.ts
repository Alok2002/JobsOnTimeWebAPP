import { ClientServices } from './../services/client.services';
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { SharedServices } from '../services/shared.services';
import { UserServices } from '../services/user.services';
import { HttpHeaders, HttpClient } from '@angular/common/http';
//import { JobTrackerComponent } from '../shared/jobtracker';
import * as JWT from 'jwt-decode';
import { Client } from '../models/client';

@Component({
  selector: 'ClientMenuComponent',
  templateUrl: './clientmenu.component.html'
})

export class ClientMenuComponent implements OnInit {
  username: string;
  isShowMobileMenu = true;
  client: Client;
  isFarronResearch = false;

  constructor(private sharedService: SharedServices, private userservice: UserServices,
    private cookieservice: CookieService, private httpClient: HttpClient, private clientservice: ClientServices) {
  }

  ngOnInit() {
    this.getIsFarronResearch();
    this.getLoginUserData();
  }

  getIsFarronResearch() {
    this.sharedService.getIsFarronResearch()
      .subscribe((res: any) => {
        this.isFarronResearch = res.value;
      })
  }

  /*getCurrentlyTrackingJob() {
    this.sharedService.getCurrentlyTrackingJob("ram")
      .subscribe((res) => {
        console.log(res);
        if (res.value) {
          this.stopTrackingJob(res.value.jobId);
        }
      });
  }*/

  stopTrackingJob(trackingJobId) {
    this.sharedService.stopTrackingJob(trackingJobId, 'ram')
      .subscribe(res => {
      });
  }

  /*logOut() {
    //this.getCurrentlyTrackingJob();
    //this.storageservice.write('isLogin', false);
    this.cookieservice.delete('auth_token');
    window.location.href = '/signin';
  }*/

  logOut() {
    //this.storageservice.write('isLogin', false);
    //this.cookieservice.delete('auth_token', '/');
    //window.location.href = '/signin';
    if (this.cookieservice.check('auth_token')) {
      this.httpClient.get('https://jsonip.com', { headers: new HttpHeaders() })
        .subscribe((ipOfNetwork) => {
          var ipAddress = ipOfNetwork['ip'];
          this.logOutHelper(ipAddress);
        }, err => {
          this.logOutHelper("");
        })
    }
  }

  logOutHelper(ipAddress) {
    this.sharedService.logOut(this.cookieservice.get('auth_token'), ipAddress)
      .subscribe(res => {
        console.log(res);
        this.cookieservice.delete('auth_token', '/');
        window.location.href = '/signin';
      })
  }

  getLoginUserData() {
    var token = JWT(this.cookieservice.get('auth_token'));
    console.log(token);
    this.username = token["unique_name"];
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
