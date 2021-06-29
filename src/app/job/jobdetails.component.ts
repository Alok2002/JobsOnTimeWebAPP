import { Client } from './../models/client';
import { ClientServices } from './../services/client.services';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Route, Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

import { JobServices } from '../services/job.services';
import { Job } from '../models/job';

import swal from 'sweetalert2';
import { JobTrackerComponent } from '../shared/jobtracker.component';
import { SharedServices } from '../services/shared.services';
import { SurveyServices } from '../services/survey.services';
import { Survey } from '../models/survey';
import { apiHost } from '../app.component';
import * as JWT from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { Email } from "../models/email";
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SecurityRights } from '../shared/enum';
import { EmailServices } from '../services/email.services';
import { TrackingJob } from '../models/trackingjob';

@Component({
  selector: 'JobDetailsComponent',
  templateUrl: './jobdetails.component.html',
  providers: [JobTrackerComponent]
})

export class JobDetailsComponent implements OnInit {
  selectedTab = 'jobedit';
  isUpdateJob: boolean;
  editJobId: number;
  isLoading = true;
  job: Job;

  survey: Survey;
  surveys: Array<Survey>;

  screener: Survey;

  apihost = apiHost;
  @ViewChild('closeAddNewModal') closeAddNewModal;

  isSubmitCopySurveyForm = false;
  paramsClientId: number;

  emailData = new Email();
  @ViewChild("emailModlaBtn") emailModlaBtn;
  emailModalTitle: string;
  hasInvoicePermission = false;
  hasIncentivePermission = false;

  token: string;
  client: Client;

  hasPrivateListPermission = false;

  constructor(private activateroute: ActivatedRoute, private jobSevice: JobServices, private clientSevice: ClientServices,
    private cookieservice: CookieService, private jtc: JobTrackerComponent,
    private sharedService: SharedServices, private surveyservice: SurveyServices, private router: Router,
    private emailservice: EmailServices, private securityInfoResolve: SecurityInfoResolve) {
  }

  ngOnInit() {
    if (this.cookieservice.check('auth_token')) {
      this.token = this.cookieservice.get('auth_token');
    }

    this.getPermissionDetails();
    this.activateroute.params.subscribe(params => {
      this.paramsClientId = params['clientid'];
      if (params['id']) {
        this.isUpdateJob = true;
        this.editJobId = params['id'];

        this.getJobById(this.editJobId);
        //this.getSurveyByJobId(this.editJobId);
        this.getSurveysByJobId(this.editJobId);

        this.selectedTab = null;
        setTimeout(() => {
          this.selectedTab = 'jobedit';
          if (params['selectedtab']) this.selectedTab = params['selectedtab'];
        });
      }
    });
  }

  getJobById(jobid) {
    this.jobSevice.getJobsByJob(jobid)
      .subscribe((res: any) => {
        console.log(res);
        this.job = res.value;
        this.isLoading = false;
        this.getClientById(this.job.clientId);
      });
  }

  getClientById(id) {
    this.clientSevice.getAllClientbyId(id)
      .subscribe((res: any) => {
        this.client = res.value;
      });    
  }

  startTracking() {
    var token = JWT(this.cookieservice.get('auth_token'));
    var userName = token['primarysid'];

    this.sharedService.startTrackingJob(this.job.id, userName)
      .subscribe((res: any) => {
        console.log(res);
        if (res.succeeded) {
          swal(
            'Tracked!',
            this.job.jobNumberAndName + ' job has been tracked.',
            'success'
          );
          var jsonstr = JSON.stringify(new TrackingJob(res.value));
          this.cookieservice.set('currentlytracking', jsonstr, null, '/');
          this.refreshData();
        } else {
          swal(
            'Oops...',
            'Something went wrong while tracking.',
            'info'
          );
        }

      });
  }

  public refreshData(): void {
    this.jtc.refreshData();
  }

  /*getSurveyByJobId(editJobId: number) {
    this.surveyservice.getSurveyByJobId(editJobId)
      .subscribe((sur) => {
        console.log(sur);
        this.survey = sur.value;
      });
  }*/

  getSurveysByJobId(editJobId: number) {
    this.surveyservice.getSurveysByJobId(editJobId)
      .subscribe((res: any) => {
        this.surveys = res.value;

        this.surveys.forEach((sr) => {
          if (!sr.clientJobGroupId && !sr.isScreener)
            this.survey = sr;
          if (!sr.clientJobGroupId && sr.isScreener)
            this.screener = sr;
        });
      });
  }

  copySurvey(surveyid) {
    console.log(surveyid);
    this.isSubmitCopySurveyForm = true;
    if (surveyid != null && surveyid != '') {
      this.isSubmitCopySurveyForm = false;
      this.surveyservice.copysurveytoscreener(surveyid)
        .subscribe((res: any) => {
          console.log(res);
          if (res.succeeded) {
            this.closeAddNewModal.nativeElement.click();
            this.router.navigate(['/managescreener', this.editJobId, res.value.id]);
          }
        });
    }
  }

  generateEmailData(entity, title) {
    this.emailModalTitle = title;

    this.emailservice.getEmailData(entity, this.editJobId)
      .subscribe((res: any) => {
        console.log(res);
        if (res.succeeded) {
          this.emailData = res.value;
          setTimeout(() => {
            this.emailModlaBtn.nativeElement.click();
          }, 1000)

          if (res.value.recipients)
            this.emailData.recipientsList = res.value.recipients.split(',');
          if (res.value.bccRecipients)
            this.emailData.bccRecipientsList = res.value.bccRecipients.split(',');

          if (this.emailData.fromId == 0) this.emailData.fromId = null;
          if (this.emailData.recipientsList == null) this.emailData.recipientsList = [];
          if (this.emailData.bccRecipientsList == null) this.emailData.bccRecipientsList = [];
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

  getPermissionDetails() {
    this.securityInfoResolve.checkPermission(SecurityRights.Invoicing)
      .subscribe((res: any) => {
        if (res.succeeded) {
          this.hasInvoicePermission = true;
        }
      });
    this.securityInfoResolve.checkPermission(SecurityRights.Incentives)
      .subscribe((res: any) => {
        if (res.succeeded) {
          this.hasIncentivePermission = true;
        }
      });  
    this.securityInfoResolve.checkPermission(SecurityRights.PrivateListAdmin)
      .subscribe((res: any) => {
        if (res.succeeded) {
          this.hasPrivateListPermission = true;
        }
      });
  }
}
