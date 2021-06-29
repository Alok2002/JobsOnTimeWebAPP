import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import swal from 'sweetalert2';
import { Sms } from '../models/sms';
import { SmsServices } from '../services/sms.services';

//import { JobTrackerComponent } from '../shared/jobtracker';

declare var tinymce: any;
@Component({
  selector: 'sms-component',
  templateUrl: './sms.component.html'
})

export class SmsComponent implements OnInit, OnChanges {
  @Input() smsData: Sms;
  @Input() modalTitle: string;
  @Output() closeModal = new EventEmitter();

  isSubmitForm = false;
  showSmsSuccessMsg = false;
  isLoading = true;

  constructor(private smsServices: SmsServices, private cookieservice: CookieService) {
  }

  ngOnInit() {
    if (this.modalTitle == null) this.modalTitle = 'Send Sms';
  }

  ngOnChanges() {
    this.generateSmsData();
    console.log(this.smsData);
  }

  generateSmsData() {
    if (this.smsData.recipients) {
      this.smsData.recipientsList = [];
      this.smsData.recipients.split(',').forEach(rl => {
        this.smsData.recipientsList.push({ display: rl, value: rl }); //this.emailData.recipients.split(',');
      })
    }

    if (this.smsData.recipientsList == null) this.smsData.recipientsList = [];

    this.isSubmitForm = false;
    this.showSmsSuccessMsg = false;
  }

  sendSms(form) {
    if (this.smsData.recipientsList) this.smsData.recipients = this.smsData.recipientsList.map(e => e.value).join(",");

    this.isSubmitForm = true;
    if (form.invalid || this.smsData.recipientsList.length < 1) {
      //this.isSubmitForm = false;
      console.log(form);
    }
    else {
      this.smsServices.postSMS(this.smsData)
        .subscribe((res: any) => {
          console.log(res);
          if (res.succeeded) {
            this.showSmsSuccessMsg = true;
          } else {
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

  resetSmsData() {
    this.smsData = new Sms();
    this.isSubmitForm = false;
    this.showSmsSuccessMsg = false;
  }

  checkStringLength(inputstring) {
    if (inputstring != null) {
      var mapstring = new String(inputstring);
      return mapstring.length;
    }
    return 0;
  }
}
