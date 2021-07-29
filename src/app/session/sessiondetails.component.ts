import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import swal from 'sweetalert2';

import { apiHost } from '../app.component';
import { Email } from '../models/email';
import { Job } from '../models/job';
import { Session } from '../models/session';
import { Sms } from '../models/sms';
import { Survey } from '../models/survey';
import { JobServices } from '../services/job.services';
import { SessionServices } from '../services/session.services';
import { SurveyServices } from '../services/survey.services';
import { EmailServices } from '../services/email.services';
import { SmsServices } from '../services/sms.services';

@Component({
  selector: 'SessionDetailsComponent',
  templateUrl: './sessiondetails.component.html'
})

export class SessionDetailsComponent implements OnInit {
  isUpdateSession = false;
  session: Session;
  editSessionId: number;
  selectedTab = 'sessionedit';
  jobId: number;

  job: Job;

  surveys: Array<Survey>;
  survey: Survey;
  screener: Survey;

  apihost = apiHost;

  @ViewChild("emailModlaBtn") emailModlaBtn;
  emailData = new Email();
  emailModalTitle: string;

  smsData = new Sms();
  smsModalTitle: string;
  @ViewChild("smsModlaBtn") smsModlaBtn;

  token: string;
  emailEntity: string;

  constructor(private activateroute: ActivatedRoute, private emailservice: EmailServices, private smsservice: SmsServices,
    private sessionService: SessionServices, private jobsevice: JobServices, private surveyservice: SurveyServices, 
    private cookieservice: CookieService) {
  }

  ngOnInit() {
    if (this.cookieservice.check('auth_token')) {
      this.token = this.cookieservice.get('auth_token');
    }

    this.activateroute.params.subscribe(params => {
      if (params['id']) {
        console.log(params['id']);
        this.isUpdateSession = true;
        this.editSessionId = params['id'];

        this.getSessionbyId(this.editSessionId);
      }
      if (params['jobid'])
        this.jobId = params['jobid'];
      if (params['tab']) {
        this.selectedTab = params['tab'];
      }
    });

    this.getJobById(this.jobId);
    this.getSurveysByJobId(this.jobId);
  }

  getSessionbyId(id) {
    this.sessionService.getSessionsbyId(id)
      .subscribe((res: any) => {
        console.log(res);
        this.session = res.value;
        console.log(this.session);
      });
  }

  getJobById(id) {
    this.jobsevice.getJobsByJob(id)
      .subscribe((res: any) => {
        this.job = res.value;
        console.log(this.job);
      });
  }

  getSurveysByJobId(editJobId: number) {
    this.surveyservice.getSurveysByJobId(editJobId)
      .subscribe((res: any) => {
        this.surveys = res.value;

        this.surveys.forEach((sr) => {
          if (sr.clientJobGroupId && !sr.isScreener)
            this.survey = sr;
          if (sr.clientJobGroupId && sr.isScreener)
            this.screener = sr;
        });
      });
  }

  copySessionScreener(surveyid) {
    this.surveyservice.copysurveytosessionscreener(surveyid, this.editSessionId)
      .subscribe(res => {
        console.log(res);
      });
  }

  openEmailModal(entity, title) {
    this.emailModalTitle = title;
    this.emailEntity = entity;
    //var ids = "?sessionids=" + this.editSessionId;
    this.emailservice.getEmailData(entity, this.editSessionId)
      .subscribe((res: any) => {
        console.log(res);
        if (res.succeeded) {
          this.emailData = res.value;
          console.log(this.emailData);
          setTimeout(() => {
            this.emailModlaBtn.nativeElement.click();
          }, 1000)
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

  openSmsModal(entity, title) {
    this.smsModalTitle = title;
    this.smsservice.getSmsData(entity, this.editSessionId)
      .subscribe((res: any) => {
        if (res.succeeded) {
          this.smsData = res.value;
          this.smsModlaBtn.nativeElement.click();
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
