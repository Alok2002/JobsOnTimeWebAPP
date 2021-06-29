import { User } from './../models/user';
import { UserServices } from './../services/user.services';
import { Component, ViewChild } from '@angular/core';
import * as JWT from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import swal from 'sweetalert2';

import { Respondent } from '../models/respondent';
import { RespondentServices } from '../services/respondent.services';
import { SharedServices } from './../services/shared.services';
import { passwordPattern } from '../app.component';

@Component({
  selector: 'SettingsComponent',
  templateUrl: './settings.component.html',
  styleUrls: ['../../assets/css/disability.css'],
  styles: ['::ng-deep .otp-input {width: 107px !important;height: 107px !important;}']
})

export class SettingsComponent {
  isSubmitForm = false;
  resId: number;
  respondent: Respondent;
  isLoading = true;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  isIncorrectPassword = false;
  isMismatchpassword = false;
  actort: string;
  
  pattern = passwordPattern;
  minlength = 8;
  loginusername: string;
  qrCodePath: string;
  isShowOtpForm = false;
  faPin: number;
  staffUser: User;
  @ViewChild('show2FAOTP') show2FAOTP: any;

  constructor(private respondentservice: RespondentServices, private cookieservice: CookieService,
    private sharedService: SharedServices, private userservices: UserServices) {
  }

  ngOnInit() {
    this.getLoginUserData();    
  }

  submitChangePassword(form) {
    this.isSubmitForm = true;
    this.isIncorrectPassword = false;
    this.isMismatchpassword = false;

    if (form.invalid) {
      //this.isSubmitForm = false;
    } else {
      if (this.respondent.passwordRaw != this.currentPassword) {
        this.isIncorrectPassword = true;
      }
      else if (this.confirmNewPassword != this.newPassword) {
        this.isMismatchpassword = true;
      }
      else {
        this.isIncorrectPassword = false;
        this.respondent.passwordRaw = this.newPassword;
        this.respondentservice.updateRespondent(this.respondent)
          .subscribe((res: any) => {
            this.isSubmitForm = false;
            if (res.succeeded) {
              swal(
                'Password Changed Successfully!',
                '',
                'success'
              );
              this.newPassword = null;
              this.confirmNewPassword = null;
              this.currentPassword = null;
            }
            else {
              var err = "";
              res.errors.forEach((er) => {
                err = err + " " + er;
              });
              swal(
                'Error!',
                err,
                'error'
              )
            }
          })
      }
    }
  }

  validatePasswordMissMatch() {
    if (this.confirmNewPassword == this.newPassword)
      this.isMismatchpassword = false;
    else
      this.isMismatchpassword = true;
  }

  getLoginUserData() {
    var token = JWT(this.cookieservice.get('auth_token'));
    console.log(token);
    this.resId = token['primarysid'];
    this.actort = token["actort"];
    this.loginusername = token["unique_name"];
    if(this.actort != 'Staff')
      this.getRespondentById();
    else {
      this.getUserDetails();
      this.setupTwoFactorAuth();
    }    
  }

  getRespondentById() {
    this.respondentservice.getRespondentById(this.resId)
      .subscribe((res: any) => {
        console.log(res);
        this.respondent = res.value;
        this.isLoading = false;
      });
  }

  unsubscribeAlert() {
    swal({
      title: 'Are you sure?',
      html: 'You will be unsubscribed from our system <br>and no longer will be contacted.',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: '#ffaa00',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.respondent.inactive = true;
        this.respondent.inactiveReason = 'Unsubscribed via logging in';

        this.respondentservice.updateRespondent(this.respondent)
          .subscribe((res: any) => {
            console.log(res);

            if (res.succeeded) {
              /*swal(
                'Successfully Unsubscribed!',
                '',
                'success'
              );*/

              this.logOut();
            }
          });
      }
    });
  }

  logOut() {
    this.cookieservice.delete('auth_token');
    window.location.href = '/signin';
  }

  clearChangePassword() {
    this.currentPassword = null;
    this.newPassword = null;
    this.confirmNewPassword = null;
  }

  setupTwoFactorAuth() {
    this.userservices.gaGenerateSetupCode(this.resId, this.actort)
      .subscribe((res: any) => {
        console.log(res)
        if (res.succeeded)
          this.qrCodePath = res.value;
      })
  }

  getUserDetails() {
    var token = {};
    if (this.cookieservice.get('auth_token'))
      token = JWT(this.cookieservice.get('auth_token'));
    
    this.userservices.getUserDetails(token['primarysid'])
      .subscribe((res: any) => {
        console.log(res)
        this.staffUser = res.value;
        // this.enable2FA = res.value.enable2FA;
        // this.skip2FA = res.value.skip2FA;
      })
  }

  onOtpChange(e) {
    console.log(e);
    this.faPin = e;
  }

  validateTwoFactorPIN() {
    var t = {};
    if (this.cookieservice.get('auth_token'))
      t = JWT(this.cookieservice.get('auth_token'));

    this.userservices.validateTwoFactorPIN(t['primarysid'], t['actort'], this.faPin)
      .subscribe((res: any) => {
        console.log(res)
        if (!res.value) {
          swal('Error!',
            'Invalid Key',
            'error'
          )
        }
        else {
          this.staffUser.enable2FA = true;
          this.staffUser.skip2FA = false;
          this.userservices.submitUser(this.staffUser)
            .subscribe((res: any) => {
              console.log(res)
              this.getUserDetails();
            })
        }
      });
  }

  clear2FAOTP() {
    this.show2FAOTP.setValue('');
  }

  submitChangePasswordStaff(form) {
    this.isSubmitForm = true;
    this.isIncorrectPassword = false;
    this.isMismatchpassword = false;

    if (form.invalid) {
      //this.isSubmitForm = false;
    } else {
      if (this.staffUser.passwordRaw != this.currentPassword) {
        this.isIncorrectPassword = true;
      }
      else if (this.confirmNewPassword != this.newPassword) {
        this.isMismatchpassword = true;
      }
      else {
        this.isIncorrectPassword = false;
        this.staffUser.passwordRaw = this.newPassword;
        this.userservices.submitUser(this.staffUser)
          .subscribe((res: any) => {
            this.isSubmitForm = false;
            if (res.succeeded) {
              swal(
                'Password Changed Successfully!',
                '',
                'success'
              );
              this.newPassword = null;
              this.confirmNewPassword = null;
              this.currentPassword = null;
            }
            else {
              var err = "";
              res.errors.forEach((er) => {
                err = err + " " + er;
              });
              swal(
                'Error!',
                err,
                'error'
              )
            }
          })
      }
    }
  }
}