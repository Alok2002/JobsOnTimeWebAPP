import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
//import { JobTrackerComponent } from '../shared/jobtracker';
import * as JWT from 'jwt-decode';
import { SharedServices } from '../services/shared.services';
import { UserServices } from '../services/user.services';
import { HttpHeaders, HttpClient } from '@angular/common/http';
declare var jQuery: any;

@Component({
  selector: 'ResMenuComponent',
  templateUrl: './resmenu.component.html',
  styleUrls: ['./resmenu.component.css']
})

export class ResMenuComponent implements OnInit {
  loginusername: string;
  isShowMobileMenu = false;
  loginuserid: number;
  isPointsAllowed = false;
  isFarronResearch = false;
  showShubMenu: string;

  constructor(private sharedService: SharedServices, private userservice: UserServices,
    private cookieservice: CookieService, private httpClient: HttpClient) {
  }

  ngOnInit() {
    this.getIsPointsAllowed();
    this.getIsFarronResearch();
    this.getLoginUserRoles();
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
    this.cookieservice.delete('auth_token', '/');
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

  getLoginUserRoles() {
    var token = JWT(this.cookieservice.get('auth_token'));
    console.log(token);
    this.loginusername = token["unique_name"];
    this.loginuserid = token["primarysid"];
  }

  getIsPointsAllowed() {
    this.sharedService.getIsPointsAllowed()
      .subscribe((res: any) => {
        this.isPointsAllowed = res.value;
      })
  }

  getIsFarronResearch() {
    this.sharedService.getIsFarronResearch()
      .subscribe((res: any) => {
        this.isFarronResearch = res.value;
      })
  }

  // keydownTab(event) {
  //   if (typeof jQuery != 'undefined') {
  //     jQuery("#myaccountMenu").mouseover();
  //   }    
  // }
}
