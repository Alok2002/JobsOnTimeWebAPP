import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';

import { UserServices } from '../services/user.services';
import { SharedServices } from './../services/shared.services';

@Component({
  selector: 'ForgotPassComponent',
  templateUrl: './forgotpass.component.html'
})

export class ForgotPassComponent implements OnInit {
  emailAddress: string;
  isSubmitForm = false;
  isDuplicateUser = false;
  firstName: string;
  lastName: string;
  error: string;
  isFarronResearch = false;

  constructor(private userservice: UserServices, private sharedservice: SharedServices) { }

  ngOnInit() {
    this.getIsFarronResearch();
  }

  resetPassword(form) {
    this.error = null;
    this.isSubmitForm = true;
    if (form.invalid) {
      //this.isSubmitForm = false;
    } else {
      this.userservice.forgotPassword(this.emailAddress, this.firstName, this.lastName, null)
        .subscribe((res: any) => {
          this.isSubmitForm = false;
          console.log(res);
          if (!res.value) {
            /*swal('Oops...',
              res.errors[0],
              'error'
            );*/
            this.error = res.errors[0];
          } else {
            swal(
              'Password sent successfully!',
              '',
              'success'
            );
            this.clearForm();
          }
        });
    }
  }

  clearForm() {
    this.emailAddress = null;
    this.firstName = null;
    this.lastName = null;
  }

  checkDuplicateUser() {
    this.userservice.checkDuplicateUser(this.emailAddress)
      .subscribe((res: any) => {
        console.log(res);
        this.isDuplicateUser = res;
      });
  }

  getIsFarronResearch() {
    this.sharedservice.getIsFarronResearch()
      .subscribe((res: any) => {
        this.isFarronResearch = res.value;
      })
  }
}
