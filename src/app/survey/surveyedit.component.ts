import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import swal from 'sweetalert2';
import { Job } from '../models/job';
import { Survey } from '../models/survey';
import { SurveyServices } from '../services/survey.services';
import { JobServices } from '../services/job.services';

declare var Clipboard: any;

@Component({
  selector: 'SurveyEditComponent',
  templateUrl: './surveyedit.component.html'
})

export class SurveyEditComponent implements OnInit {
  @Input() surveyId: number;
  @Input() isUpdateSurvey: boolean;
  @Input() jobId: number;
  @Input() sessionid: number;

  survey: Survey;
  isSubmitForm = false;

  job: Job;

  constructor(private surveyservice: SurveyServices, private jobsevice: JobServices,
    private activateroute: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.getSurvey();
    console.log(this.isUpdateSurvey);
  }

  getSurvey() {
    this.surveyservice.getSurveyById(this.surveyId)
      .subscribe((res: any) => {
        console.log(res);
        if (res.value) {
          this.survey = res.value;
          if (this.survey.expiryDate) this.survey.expiryDate = moment(this.survey.expiryDate).toDate();
        }
        else {
          this.survey = new Survey();
          this.getJobById(this.jobId);
        }

        if (this.sessionid)
          this.survey.clientJobGroupId = this.sessionid;
      });
  }

  getJobById(id) {
    this.jobsevice.getJobsByJob(id)
      .subscribe((res: any) => {
        this.job = res.value;
        this.survey.title = this.job.jobNumber + ' Job Survey';
      });
  }

  submitSurvey(form) {
    this.isSubmitForm = true;
    if (form.invalid) {
      //this.isSubmitFormSpinner = false;
    } else {
      this.survey.clientJobId = this.jobId;
      if (this.survey.completionSuccessPoints == null || this.survey.completionSuccessPoints.toString() == '') this.survey.completionSuccessPoints = 0
      if (this.survey.completionDisqualifiedPoints == null || this.survey.completionDisqualifiedPoints.toString() == '') this.survey.completionDisqualifiedPoints = 0
      if (this.survey.maxSuccessRequired == null || this.survey.maxSuccessRequired.toString() == '') this.survey.maxSuccessRequired = 0

      if (this.survey.expiryDate) {
        var expiryDate = moment(this.survey.expiryDate, 'YYYY-MM-DD HH:mm');
        this.survey.expiryDate = expiryDate.utcOffset(0, true).format();
      }

      console.log(this.survey);

      this.surveyservice.submitSurvey(this.survey)
        .subscribe((res: any) => {
          console.log(res);
          if (res.succeeded) {
            swal(
              'Successfully Saved!',
              '',
              'success'
            );
            if (!this.isUpdateSurvey) {
              this.router.navigate(['/managesurvey', this.jobId, res.value.id]);
            }
          }
        });
    }
  }

  clipboardCopy() {
    function showTooltip(elem: any, msg: string) {
      var classNames = elem.className;
      elem.setAttribute('class', classNames + ' hint--bottom');
      elem.setAttribute('aria-label', msg);
      setTimeout(() => {
        elem.setAttribute('class', classNames);
      },
        2000);
    }

    var clipboard = new Clipboard('.ccopy');

    clipboard.on('success',
      (e: any) => {
        showTooltip(e.trigger, 'Copied!');

        clipboard.destroy();
        clipboard = new Clipboard('.ccopy');
        clipboard.destroy();
      });

    clipboard.on('error',
      (e: string) => {
        //  // console.log(e);
      });
  }
}
