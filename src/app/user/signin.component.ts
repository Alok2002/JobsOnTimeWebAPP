import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as JWT from 'jwt-decode';
import * as moment from 'moment';
import { CookieService } from 'ngx-cookie-service';

import { LoginUser } from '../models/loginuser';
import { SharedServices } from '../services/shared.services';
import { UserServices } from '../services/user.services';
import { Client } from './../models/client';
import { AuthService } from './../services/auth.services';
import { ClientServices } from './../services/client.services';
import { SurveyServices } from './../services/survey.services';
import swal from 'sweetalert2';

@Component({
  selector: "SignInComponent",
  templateUrl: "./signin.component.html",
  styleUrls: ['../../assets/css/disability.css']
})

export class SignInComponent implements OnInit {
  loginUser: LoginUser;

  isSubmitForm = false;
  isSubmitFormSpinner = false;
  loginerrmsg: string;

  selectedTab = "Respondent";
  isDuplicateUser = false;

  loginuserrole: string;

  isShowPage = false;

  surveyRedirecJobId: number;
  welcomeCopies: any;
  @ViewChild("termsBtn") termsBtn: any;
  @ViewChild("termsBtnClose") termsBtnClose: any;
  client: Client;
  token: any;
  isFarronResearch = false;
  isBusinessPanelAllowed = false;
  isDisabilityPanelAllowed = false;

  isShow2FAOTP = false;
  tempToken: any;
  faPin: string;
  otpError: string;
  isShowClientOtpForm = false;
  clientOtp: string;

  @ViewChild('show2FAOTP') show2FAOTP: any;
  @ViewChild('showClientOTP') showClientOTP: any;

  constructor(private router: Router, private cookieService: CookieService, private authservice: AuthService,
    private userservice: UserServices, private sharedService: SharedServices, private activateroute: ActivatedRoute,
    private surveyservice: SurveyServices, public httpClient: HttpClient,
    private cookieservice: CookieService, private clientservice: ClientServices) {
    this.checkLogin();
  }

  ngOnInit() {
    this.getIsFarronResearch();
    this.getWebsiteCopies();
    this.activateroute.params.subscribe(params => {
      if (params['jobid']) this.surveyRedirecJobId = params['jobid'];
    });

    if (this.cookieService.check("loginTab"))
      this.selectedTab = this.cookieService.get("loginTab");
    else
      this.cookieService.set("loginTab", this.selectedTab, null, '/');

    this.loginUser = new LoginUser();
    this.getIsBusinessPanelAllowed();
    this.getIsDisabilityPanelAllowed();
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

  getWebsiteCopies() {
    this.sharedService.getWebsiteCopies()
      .subscribe((res: any) => {
        console.log(res)
        this.welcomeCopies = res.value;
      })
  }

  checkLogin() {
    this.authservice.checkloginStatus()
      .subscribe((res: any) => {
        console.log(res);
        if (!res.value) this.isShowPage = true;
        if (res.value && this.cookieService.get("auth_token")) {
          var token = JWT(this.cookieService.get("auth_token"));
          this.loginuserrole = token["actort"];
          console.log(token);

          if (this.loginuserrole == "Respondent") {
            window.location.href = "/resprofile";
          }
          if (this.loginuserrole == "Client") this.clientLoginRedirectHelper();
          if (this.loginuserrole == "Staff") {
            window.location.href = "/dashboard";
          }
        }
      });
  }

  newLoginUser() {
    this.loginUser = new LoginUser();
  }

  loginFormSubmit(form) {
    this.loginerrmsg = null;
    this.isSubmitForm = true;
    this.isSubmitFormSpinner = true;

    if (form.invalid) {
      //this.isSubmitForm = false;
      this.isSubmitFormSpinner = false;
    } else {
      this.httpClient.get('https://jsonip.com', { headers: new HttpHeaders() })
        .subscribe((ipOfNetwork) => {
          this.loginFormSubmitHelper(ipOfNetwork['ip'])
        }, error => {
          this.loginFormSubmitHelper("");
        })
    }
  }

  loginFormSubmitHelper(ipaddress) {
    this.loginUser.ipAddress = ipaddress;
    this.loginUser.role = this.selectedTab;
    if (this.selectedTab == "Respondent") this.loginUser.userName = "";
    else if (this.selectedTab == "Client") this.loginUser.userName = this.loginUser.emailAddress;
    else this.loginUser.emailAddress = "";

    this.loginUser.regoType = "";

    this.userservice.login(this.loginUser)
      .subscribe((res: any) => {
        console.log(res);
        this.isSubmitFormSpinner = false;
        if (!res.succeeded) {
          if (res.errors && res.errors.length > 0)
            this.loginerrmsg = res.errors[0];
        }
        else {
          //this.storageservice.write('auth_token', 'Bearer '+res.token);
          this.cookieService.set("isLogin", 'true', null, '/');

          var t = JWT(res.value);
          const date = new Date(0);
          date.setUTCSeconds(t["exp"]);

          if (this.selectedTab != "Staff" && this.selectedTab != "Client") {
            this.setAuthCookie(res.value);
            this.getCurrentlyTrackingJob(t["unique_name"]);
          }

          if (this.selectedTab == "Respondent") {
            let cookieExists = this.cookieService.check('auth_token');
            if (cookieExists) {
              var token = JWT(this.cookieService.get('auth_token'));
              if (token["actort"] == 'Respondent') {
                var resid = token["primarysid"];
                if (this.surveyRedirecJobId) {
                  this.surveyservice.getPublicSurveyEncodedValues(resid, this.surveyRedirecJobId)
                    .subscribe((res: any) => {
                      console.log(res);
                      if (res.value) {
                        window.location.href = '/survey/survey-start/' + res.value;
                      }
                    })
                }
                else {
                  window.location.href = '/resprofile';
                  //window.location.href = "/resprofile";
                }
              }
            }
          }
          if (this.selectedTab == "Client") {
            this.tempToken = res.value;
            this.clientLoginRedirectHelper();
          }
          if (this.selectedTab == "Staff") {
            this.userservice.getUser2FAStatus(t['primarysid'])
              .subscribe((res: any) => {
                console.log(res)
                if (!res.value.skip2FA && res.value.enable2FA)
                  this.isShow2FAOTP = true;
                else {
                  this.setAuthCookie(this.tempToken);
                  window.location.href = "/dashboard";
                  this.getCurrentlyTrackingJob(t["unique_name"]);
                }
              });
            this.tempToken = res.value;
            //window.location.href = "/dashboard";
          }
        }
      });
  }

  getCurrentlyTrackingJob(username) {
    this.sharedService.getCurrentlyTrackingJob(username)
      .subscribe((res: any) => {
        console.log(res);
        if (res.value) {
          this.stopTrackingJob(res.value.jobId, username);
        }
      });
  }

  stopTrackingJob(trackingJobId, username) {
    this.sharedService.stopTrackingJob(trackingJobId, username)
      .subscribe(res => { });
  }

  checkDuplicateUser() {
    if (this.selectedTab == 'Respondent') {
      this.userservice.checkDuplicateUser(this.loginUser.emailAddress)
        .subscribe((res: any) => {
          console.log(res);
          this.isDuplicateUser = res;
        });
    }
  }

  storeLoginTabs(selecttab) {
    this.isSubmitForm = false;
    this.cookieService.set("loginTab", selecttab, null, '/');
  }

  forgotPassword() {
    /*if (this.selectedTab == "Respondent")
      this.router.navigate(["/forgotpassword"]);
    else
      swal(
        "Oops...",
        "Please contact an administrator staff member to retrieve or reset your password.",
        "info"
      );*/
    this.router.navigate(['/resetpassword', this.selectedTab]);
  }

  reload() {
    window.location.reload(true);
  }

  clientLoginRedirectHelper() {
    this.getLoginUserData();
  }

  getLoginUserData() {
    console.log(this.tempToken);
    var token = JWT(this.tempToken);
    this.getClientContactById(token['primarysid']);
  }

  getClientContactById(id) {
    this.clientservice.getClientContactById(id)
      .subscribe((res: any) => {
        console.log(res)
        this.client = res.value;
        if (!this.client.dateAgreedToTerms) {
          this.token = this.cookieservice.get('auth_token');
          this.cookieservice.delete('auth_token', '/');
          this.termsBtn.nativeElement.click();          
        }
        else {
          this.createClientLoginOTP(this.client.id);
        }
      })
  }

  updateClient() {
    this.token = this.tempToken;
    this.client.dateAgreedToTerms = moment().toDate();
    console.log(this.client)
    this.clientservice.updateClientContactTerms(this.client)
      .subscribe((res: any) => {
        console.log(res)
        /*var t = JWT(this.token);
        const date = new Date(0);
        date.setUTCSeconds(t["exp"]);
        this.cookieService.set("auth_token", this.token, date, '/', null, false);

        window.location.href = "/clihome";*/
        this.createClientLoginOTP(this.client.id);
        this.termsBtnClose.nativeElement.click();
        this.isShowClientOtpForm = true;
      })
  }

  getIsFarronResearch() {
    this.sharedService.getIsFarronResearch()
      .subscribe((res: any) => {
        this.isFarronResearch = res.value;
      })
  }

  validateTwoFactorPIN() {
    this.loginerrmsg = null;
    this.otpError = null;
    var t = JWT(this.tempToken);

    if (!this.faPin) this.otpError = "Key Required";
    else if (this.faPin && this.faPin.length < 6) this.otpError = "Invalid Key";
    else {
      this.userservice.validateTwoFactorPIN(t['primarysid'], t['actort'], this.faPin)
        .subscribe((res: any) => {
          console.log(res)
          if (!res.value) {
            this.loginerrmsg = "Invalid Key";
          }
          else {
            this.setAuthCookie(this.tempToken);
            window.location.href = "/dashboard";
            this.getCurrentlyTrackingJob(t["unique_name"]);
          }
        })
    }
  }

  onOtpChange(e) {
    console.log(e);
    this.faPin = e;
  }

  setAuthCookie(t) {
    const date = new Date(0);
    date.setUTCSeconds(t["exp"]);
    console.log(t);
    this.cookieService.set("auth_token", t, date, '/', null, false);
    this.cookieService.set("show_clock_alert", JSON.stringify(true), date, '/', null, false);
    this.cookieservice.set("clock_in", JSON.stringify(false), null, '/', null, false);
  }

  onClientOtpChange(e) {
    this.clientOtp = e;
  }

  createClientLoginOTP(id, isResent?) {
    console.log(id)
    this.clientservice.createClientLoginOTP(id)
      .subscribe((res: any) => {
        console.log(res)
        if (!res.value)
          this.isShowClientOtpForm = true;

        if (isResent) {
          swal(
            'Success!',
            'OTP has been re-sent successfully.',
            'success'
          )
        }
      })
  }

  validateClientLoginOTP() {
    this.loginerrmsg = null;
    if (!this.clientOtp) this.otpError = "OTP Required";
    else if (this.clientOtp && this.clientOtp.length < 6) this.otpError = "Invalid OTP";
    else {
    this.clientservice.validateClientLoginOTP(this.client.id, this.clientOtp)
      .subscribe((res: any) => {
        console.log(res)
        if (!res.value) {
          this.loginerrmsg = "Invalid OTP";
        }
        else {
          this.setAuthCookie(this.tempToken);
          window.location.href = "/clihome";
        }
      })
    }
  }

  clear2FAOTP() {
    this.show2FAOTP.setValue(' ');
  }

  clearClientOTP() {
    this.showClientOTP.setValue(' ');
  }

  backtoClientLogin() {
    /*this.isShowClientOtpForm = false;
    this.loginUser.emailAddress = null;
    this.loginUser.password = null;*/
    window.location.reload();
  }

  backtoStaffForm() {
    /*this.isShow2FAOTP = false;
    this.loginUser.userName = null;
    this.loginUser.password = null;*/
    window.location.reload();
  }
}
