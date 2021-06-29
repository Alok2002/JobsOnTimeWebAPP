import { Component } from '@angular/core';
import * as JWT from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import swal from 'sweetalert2';
import { passwordPattern } from '../app.component';

import { ClientContact } from './../models/clientcontact';
import { ClientServices } from './../services/client.services';
declare var jQuery: any;

@Component({
  selector: 'CliSettingsComponent',
  templateUrl: './clisettings.component.html',
})

export class CliSettingsComponent {
  isSubmitForm = false;
  id: number;
  clientcontact: ClientContact;
  isLoading = true;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  isIncorrectPassword = false;
  isMismatchpassword = false;
  actort: string;
  // pattern = "(?=.*[@#$%*(!)~^&])(?=.*[A-Z]).*";
  pattern = passwordPattern;

  constructor(private clientservices: ClientServices, private cookieservice: CookieService) {
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
      if (this.clientcontact.passwordRaw != this.currentPassword) {
        this.isIncorrectPassword = true;
      }
      else if (this.confirmNewPassword != this.newPassword) {
        this.isMismatchpassword = true;
      }
      else {
        this.isIncorrectPassword = false;
        this.clientcontact.passwordRaw = this.newPassword;
        this.clientservices.updateClientContact(this.clientcontact)
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
    this.id = token['primarysid'];
    this.actort = token["actort"];
    //this.loginusername = token["unique_name"];
    this.getClientContactById();
  }

  getClientContactById() {
    this.clientservices.getClientContactById(this.id)
      .subscribe((res: any) => {
        console.log(res)
        this.clientcontact = res.value;
      })
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

  getPasswordErrorMsg(minlength, pattern) {
    var ret = "";
    // if (minlength) ret = "Password must contain at least 8 characters <br>";
    if (pattern) ret += "At Least 8 characters with number, symbol and an uppercase letter"
    return ret;
  }

  ngDoCheck() {
    if (typeof jQuery != 'undefined') {
      jQuery('[data-toggle="tooltip"]').tooltip({ container: 'body' });
    }
  }
}