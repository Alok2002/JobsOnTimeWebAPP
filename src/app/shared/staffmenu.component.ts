import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as JWT from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { AnonymousSubscription } from 'rxjs-compat/Subscription';
import swal from 'sweetalert2';

import { apiHost } from '../app.component';
import { SharedServices } from '../services/shared.services';
import { UserServices } from '../services/user.services';

//import { JobTrackerComponent } from '../shared/jobtracker';
declare var jQuery: any;

@Component({
  selector: 'StaffMenuComponent',
  templateUrl: './staffmenu.component.html',
  styleUrls: ['./staffmenu.component.css']
})

export class StaffMenuComponent implements OnInit {
  loginusername: string;
  selectedsearchfield = 'Mobile Number';

  resemail: string;
  resmobile: string;
  resid: string;
  jobno: string;
  jobname: string;
  jobinvoice: string;

  public jobNoAPI: string;
  public jobNameAPI: string;
  public jobInvoiceNoAPI: string;
  public respIdAPI: string;
  public respMobileAPI: string;
  public respEmailAPI: string;

  isShowMobileMenu = false;
  isFarronResearch = false;
  isBusinessPanelAllowed = false;
  isDisabilityPanelAllowed = false;
  clockIn: boolean = null;
  totalHours: string;
  isDisableClockToggle = false;
  userDropdownTimer: any;

  constructor(private sharedService: SharedServices,
    private userservice: UserServices,
    private cookieservice: CookieService,
    private router: Router, public httpClient: HttpClient) {
    if (this.cookieservice.check('auth_token')) {
      var token = this.cookieservice.get('auth_token');
      this.jobNoAPI = apiHost + "/api/search/job-number/:keyword/?token=" + token;
      this.jobNameAPI = apiHost + "/api/search/job-name/:keyword/?token=" + token;
      this.jobInvoiceNoAPI = apiHost + "/api/search/job-invnumber/:keyword/?token=" + token;
      this.respIdAPI = apiHost + "/api/search/resp-id/:keyword/?token=" + token;
      this.respMobileAPI = apiHost + "/api/search/resp-mobile/:keyword/?token=" + token;
      this.respEmailAPI = apiHost + "/api/search/resp-email/:keyword/?token=" + token;
    }
  }

  ngOnInit() {
    this.getIsFarronResearch();
    this.getLoginUserRoles();
    this.getIsBusinessPanelAllowed();
    this.getIsDisabilityPanelAllowed();
    this.updateClickPrevent();
    this.getWorkingHours();
  }

  getIsBusinessPanelAllowed() {
    this.sharedService.getIsBusinessPanelAllowed()
      .subscribe((res: any) => {
        this.isBusinessPanelAllowed = res.value;
      })
  }

  getIsDisabilityPanelAllowed() {
    this.sharedService.getIsDisabilityPanelAllowed()
      .subscribe((res: any) => {
        this.isDisabilityPanelAllowed = res.value;
      })
  }

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

  async logOutHelper(ipAddress) {
    var token = this.cookieservice.get('auth_token');
    await this.stopTrackingJobHelper();
    this.sharedService.logOut(token, ipAddress)
      .subscribe(res => {
        console.log(res);
        this.removeLoggedInUserCookie();
      })
  }

  removeLoggedInUserCookie() {
    this.cookieservice.delete('auth_token', '/');
    window.location.href = '/signin';
  }

  async stopTrackingJobHelper() {
    return new Promise(async (resolve) => {
      var trackingJobId = null;
      await this.getCurrentlyTrackingJob().then((data) => trackingJobId = data);
      await this.stopTrackingJob(trackingJobId).then((data) => trackingJobId = data);
      resolve(true);
    });
  }

  stopTrackingJob(trackingJobId) {
    return new Promise(resolve => {
      var ret = null;
      var token = this.getToken();
      if (trackingJobId == 0) {
        console.log("No Tracking Job")
        resolve(ret);
      } else {
        this.sharedService.stopTrackingJob(trackingJobId, token['primarysid'])
          .subscribe(res => {
            console.log(res);
            ret = res;
            resolve(ret);
          });
      }
    });
  }

  getCurrentlyTrackingJob() {
    return new Promise(resolve => {
      var ret = null;
      var token = this.getToken();
      this.sharedService.getCurrentlyTrackingJob(token['primarysid'])
        .subscribe((res: any) => {
          console.log(res);
          if (res.value) {
            ret = res.value.jobId;
          } else {
            ret = 0;
          }
          resolve(ret);
        });
    });
  }

  /*getUserName() {
    this.userservice.getUserName()
      .subscribe(res => {
        this.username = res.value;
      });
  }*/

  getLoginUserRoles() {
    var token = this.getToken();
    console.log(token);
    this.loginusername = token["unique_name"];
  }


  gotoRespondent(res) {
    if (res && res != "" && res != 0 && res.hasOwnProperty('id')) {
      this.resetSearchBoxs();
      this.router.navigate(['/respondent/', res.id]);
    }
    else
      this.resetSearchBoxs();
  }

  gotoJob(job) {
    console.log(job);
    if (job && job != "" && job != 0 && job.hasOwnProperty('id')) {
      this.resetSearchBoxs();
      this.router.navigate(['/job/edit/', job.id]);
    }
    else
      this.resetSearchBoxs();
  }

  resetSearchBoxs() {
    this.resemail = "";
    this.resmobile = "";
    this.resid = "";
    this.jobno = "";
    this.jobname = "";
    this.jobinvoice = "";
  }

  gotoRespondentById(resid) {
    this.router.navigate(['/respondent/', resid]);
  }

  getToken() {
    let cookieExists = this.cookieservice.check('auth_token');
    console.log(cookieExists);
    if (cookieExists) {
      var token = JWT(this.cookieservice.get('auth_token'));
      return token;
    }
    else {
      window.location.href = '/signin';
    }
  }

  getIsFarronResearch() {
    this.sharedService.getIsFarronResearch()
      .subscribe((res: any) => {
        console.log(res)
        this.isFarronResearch = res.value;
      })
  }

  updateClickPrevent() {
    if (typeof jQuery != 'undefined') {
      jQuery('#switch').on('click', function (e) {
        e.stopPropagation();
      });
    }
  }

  getWorkingHours() {
    var token = this.getToken();
    this.sharedService.getWorkingHours(token['primarysid'])
      .subscribe((res: any) => {
        console.log(res)
        if (res.value.statusString == 'IN') this.clockIn = true;
        if (res.value.statusString == 'OUT') this.clockIn = false;
        this.totalHours = res.value.hoursString;
        this.cookieservice.set("clock_in", JSON.stringify(this.clockIn), null, '/', null, false);
        this.showClockAlert();
      })
  }

  toggleClock() {
    var token = this.getToken();
    this.isDisableClockToggle = true;
    if (this.clockIn) {
      this.sharedService.updateClockOn(token['primarysid'])
        .subscribe((res: any) => {
          console.log(res)
        })
    } else {
      this.sharedService.updateClockOff(token['primarysid'])
        .subscribe((res: any) => {
          console.log(res)
          // this.logOut()
        })
    }
    this.cookieservice.set("clock_in", JSON.stringify(this.clockIn), null, '/', null, false);
    this.cookieservice.set("show_clock_alert", "false", null, '/', null, false);
  }

  startDropdownTimer() {
    clearTimeout(this.userDropdownTimer);
    this.userDropdownTimer = setTimeout(() => {
      if (typeof jQuery != 'undefined') {
        jQuery('#user-dropdown').removeClass('open');
      }
    }, 10000)
  }

  ngOnDestroy() {
    clearTimeout(this.userDropdownTimer);
  }

  showClockAlert() {
    if (this.cookieservice.check("show_clock_alert")) {
      var ret = JSON.parse(this.cookieservice.get("show_clock_alert"));
      if (ret && !this.getClockIn()) {
        this.sharedService.isAttendanceAlertEnabled()
          .subscribe((res: any) => {
            console.log(res)
            if (res.value) {
              this.cookieservice.set("show_clock_alert", "false", null, '/', null, false);
              swal({
                title: 'Do you want to Clock In?',
                text: '',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                confirmButtonColor: '#ffaa00',
                cancelButtonText: 'No'
              }).then((result) => {
                if (result.value) {
                  this.clockIn = true;
                  this.toggleClock();
                }
              });
            }
          })
      }
    }
  }

  getClockIn() {
    var ret = false;
    if (this.cookieservice.check("clock_in")) {
      ret = JSON.parse(this.cookieservice.get("clock_in"));
    }
    return ret;
  }
}
