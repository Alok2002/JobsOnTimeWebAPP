import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { EventClient } from '../models/eventclient';
import { Sms } from '../models/sms';
import { EventServices } from '../services/event.services';
import { SharedServices } from './../services/shared.services';
import { SmsServices } from '../services/sms.services';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'SendSmsComponent',
  templateUrl: './sendsms.component.html'
})

export class SendSmsComponent implements OnInit {
  //clients: Array<Client>;
  //jobs: Array<Job>;
  //sessions: Array<Session>;
  eventClients: Array<EventClient> = [];
  eventJobs: Array<EventClient> = [];
  eventJobSessions: Array<EventClient> = [];
  eventIncentives: Array<EventClient> = [];

  isLoading = true;

  selectedClient: number;
  selectedJob: number;
  selectedSession: number;
  // mobileNumbers: Array<{ display: string, value: string }> = [];
  subject: string;
  provider: string;
  message: string;
  isElectronicDoc = true;

  isSubmitForm = false;
  isSubmitFormSpinner = false;

  currentlyTrackingJob = null;
  mobileNumberstr: string;


  constructor(private eventservices: EventServices, private cookieservice: CookieService,
    private smsService: SmsServices, private sharedservice: SharedServices) { }

  ngOnInit() {
    if (this.cookieservice.check("currentlytracking"))
      this.currentlyTrackingJob = JSON.parse(this.cookieservice.get("currentlytracking"));
    this.getClients();
  }

  getClients() {
    this.eventservices.getClients()
      .subscribe((res: any) => {
        console.log(res);
        this.eventClients = res.value;
        this.isLoading = false;

        if (this.currentlyTrackingJob) {
          console.log(this.currentlyTrackingJob);
          this.selectedClient = this.currentlyTrackingJob.clientId;
          this.getJobsbyClientId(this.currentlyTrackingJob.clientId);
          this.selectedJob = this.currentlyTrackingJob.id;
          this.getSessionbyJobId(this.currentlyTrackingJob.id);
        }
      });

  }

  getJobsbyClientId(clientId) {
    this.eventservices.getClientJobs(clientId)
      .subscribe((res: any) => {
        this.eventJobs = res.value;
      });
  }

  getSessionbyJobId(jobId) {
    this.eventservices.getClientJobGroups(jobId)
      .subscribe((res: any) => {
        this.eventJobSessions = res.value;
      });
  }

  sendSms(form) {
    this.isSubmitForm = true;
    this.isSubmitFormSpinner = true;
    if (form.invalid) {
      //this.isSubmitForm = false;
      this.isSubmitFormSpinner = false;
    }
    else if (this.mobileNumberstr.length > 0) {
      //console.log(this.configItem);
      /*var sms = {
        'client': this.selectedClient,
        'job': this.selectedJob,
        'session': this.selectedSession,
        'mobileNumbers': this.mobileNumbers,
        'subject': this.subject,
        'message': this.message,
        'isElectronicDoc': this.isElectronicDoc,
      }*/

      var sms = new Sms();
      sms.recipients = this.mobileNumberstr; //this.mobileNumbers.map(e => e.value).join(",");
      sms.subject = this.subject;
      sms.body = this.message;

      console.log(sms);

      this.smsService.postSMS(sms)
        .subscribe((res: any) => {
          if (res.succeeded) {
            swal('Successfully Sent!',
              '',
              'success');

            this.resetForm();
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
        });
    }
  }

  checkStringLength(inputstring) {
    if (inputstring != null) {
      var mapstring = new String(inputstring);
      return mapstring.length;
    }
    return 0;
  }

  resetForm() {
    this.selectedClient = null;
    this.selectedJob = null;
    this.selectedSession = null;
    //this.mobileNumbers = [];
    this.subject = null;
    this.message = null;
    this.isElectronicDoc = true;
    this.isSubmitForm = false;
    this.mobileNumberstr = null;
  }

  getMobileNumberCount() {
    var ret = 0;
    if(this.mobileNumberstr) {
      ret = this.mobileNumberstr.split(',').length;
    }
    return ret;
  }
}
