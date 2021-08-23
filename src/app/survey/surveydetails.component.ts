import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as JWT from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import swal from 'sweetalert2';

import { apiHost } from '../app.component';
import { Email } from '../models/email';
import { EmailTemplate } from '../models/emailtemplate';
import { Job } from '../models/job';
import { Survey } from '../models/survey';
import { SurveyQuestions } from '../models/surveyquestions';
import { User } from '../models/user';
import { JobServices } from '../services/job.services';
import { SurveyServices } from '../services/survey.services';
import { JobTrackerComponent } from '../shared/jobtracker.component';
import { SharedServices } from '../services/shared.services';
import { ClientServices } from '../services/client.services';
import { UserServices } from '../services/user.services';
import { EmailServices } from '../services/email.services';
import { TrackingJob } from '../models/trackingjob';


declare var jQuery: any;
declare var tinymce: any;

@Component({
  selector: 'SurveyDetails',
  templateUrl: './surveydetails.component.html',
  providers: [JobTrackerComponent]
})

export class SurveyDetailsComponent implements OnInit {
  @ViewChild('childSurveyQuestion') childSurveyQuestion;

  isUpdateSurvey = false;
  survey: Survey;
  surveyId: number;
  editSurveyId: number;
  selectedTab = 'surveyedit';
  isLoading = true;
  jobId: number;

  job: Job;
  sessionid: number;
  apihost = apiHost;

  fromUsername: string;
  recipients: string;
  bccrecipients: string;
  subject: string;
  body: string;
  showEmailSuccessMsg: boolean;

  public editor: any;
  @Output() onEditorKeyup = new EventEmitter<any>();

  users: Array<User> = [];
  emailtemplates: Array<EmailTemplate> = [];

  surveyquestions: Array<SurveyQuestions> = [];

  emailAttachments = [];
  emailData = new Email();
  isSubmitForm = false;
  isSubmitFormSpinner = false;
  emailModelTitle: string;

  token: string;
  @ViewChild("emailmodalbtn") emailmodalbtn: any;

  constructor(private activateroute: ActivatedRoute, private sharedService: SharedServices, private clientSevice: ClientServices,
    private surveyservice: SurveyServices, private jobservice: JobServices, private jtc: JobTrackerComponent,
    private cookieservice: CookieService, public router: Router, private _userService: UserServices, private emailService: EmailServices) {
  }

  ngOnInit() {
    if (this.cookieservice.check('auth_token')) {
      this.token = this.cookieservice.get('auth_token');
    }

    console.log('test');
    this.activateroute.params.subscribe(params => {
      if (params['surveyid']) {
        this.surveyId = params['surveyid'];
        this.getSurveyById();
      } else {
        this.isLoading = false;
      }
      if (params['jobid']) {
        this.jobId = params['jobid'];
        this.getJobById(this.jobId);
      }
      if (params['sessionid']) {
        this.sessionid = params['sessionid'];
      }

      //this.getCreateSurveyScreenerDocumentEmail();
    });

    // this.initTinymce();
    //this.getUsers();
    this.getEmailTemplates();
    this.getSurveyQuestionsbySurveyId();

    this.emailAttachments.length = 1;
  }

  getSurveyById() {
    console.log(this.surveyId);
    this.surveyservice.getSurveyById(this.surveyId)
      .subscribe((res: any) => {
        console.log(res);
        this.survey = res.value;

        if (res.value) this.isUpdateSurvey = true;

        this.isLoading = false;
      });
  }

  getJobById(id) {
    this.jobservice.getJobsByJob(id)
      .subscribe((res: any) => {
        this.job = res.value;
      });
  }

  startTracking() {
    var token = JWT(this.cookieservice.get('auth_token'));
    var userName = token['primarysid'];

    this.sharedService.startTrackingJob(this.jobId, userName)
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

  deleteSurvey() {
    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this item!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#ffaa00',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.surveyservice.deleteSurveyById(this.surveyId)
          .subscribe((res: any) => {
            console.log(res);

            if (res.succeeded) {
              swal(
                'Deleted!',
                'Survey has been deleted.',
                'success'
              )
              this.router.navigate(['/job/edit', this.jobId]);
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
        // result.dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
      } else if (result.dismiss === swal.DismissReason.cancel) {
        swal(
          'Cancelled',
          'Survey is safe :)',
          'error'
        )
      }
    });
  }

  selectedTabFn(tab) {
    if (this.childSurveyQuestion == null || !this.childSurveyQuestion.alertChangeDetect()) {
      this.selectedTab = null;
      setTimeout(() => {
        this.selectedTab = tab;
      }, 1000)
    } else {
      var ret = swal({
        title: 'Are you sure?',
        text: "Survey is not saved. You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
      }).then((result) => {
        if (result.value) {
          console.log("inside true");
          this.selectedTab = tab;
        }
        else
          return false;
      });
    }
  }

  /*initTinymce() {
    tinymce.remove();
    var self = this;
    setTimeout(() => {
      tinymce.baseURL = "../../../assets/custom/tinymce";// trailing slash important      
      tinymce.init({
        selector: '.tinymce-editor', // change this value according to your HTML
        skin_url: '../../../assets/tinymce/skins/lightgray',
        branding: false,
        elementpath: false,
        height: 250,
        plugins: [
          "advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker",
          "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
          "save table contextmenu directionality emoticons template paste textcolor"
        ],
        toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist | l      ink image | preview media fullpage | forecolor backcolor",
        style_formats: [
          { title: 'Bold text', inline: 'b' },
          { title: 'Red text', inline: 'span', styles: { color: '#ff0000' } },
          { title: 'Red header', block: 'h1', styles: { color: '#ff0000' } },
          { title: 'Example 1', inline: 'span', classes: 'example1' },
          { title: 'Example 2', inline: 'span', classes: 'example2' },
          { title: 'Table styles' },
          { title: 'Table row 1', selector: 'tr', classes: 'tablerow1' }
        ],
        setup: function (editor: any) {
          self.editor = editor;
          editor.on('keyup change blur',
            () => {
              console.log(editor);
              const content = editor.getContent();
              console.log(content);
              self.onEditorKeyup.emit(content);
              if (editor.id == "galleryPreDeployment") {
                //template.galleryPreDeployment = content;
                //this.body = content;
              }
            });
        }
      });
      jQuery(".mce-tinymce").css('display', 'block');
    });
    this.isLoading = false;
  }*/

  getUsers() {
    this._userService.getAllUser()
      .subscribe((res: any) => {
        this.users = res.value;
      });
  }

  getEmailTemplates() {
    this.emailService.getEmailTemplates()
      .subscribe((res: any) => {
        this.emailtemplates = res.value;
        this.isLoading = false;
      })
  }

  async getSurveyQuestionsbySurveyId() {
    return new Promise(resolve => {
      var ret = null;
      this.surveyquestions = null;
      this.surveyservice
        .getSurveyQuestionsbySurveyId(this.surveyId)
        .subscribe((res: any) => {
          console.log(res);
          this.surveyquestions = res.value;
          ret = this.surveyquestions;
          resolve(ret);
        })
    });
  }

  surveyQuestionUpdate($event) {
    /*if ($event)
      this.getSurveyQuestionsbySurveyId();*/
  }

  getEmailData(entity, title) {
    this.emailModelTitle = title;
    this.emailService.getEmailData(entity, this.surveyId)
      .subscribe((res: any) => {
        console.log(res);
        if (res.succeeded) {
          this.emailData = res.value;
          if (res.value.recipients)
            this.emailData.recipientsList = res.value.recipients.split(',');
          if (res.value.bccRecipients)
            this.emailData.bccRecipientsList = res.value.bccRecipients.split(',');

          if (this.emailData.fromId == 0) this.emailData.fromId = null;
          if (this.emailData.recipientsList == null) this.emailData.recipientsList = [];
          if (this.emailData.bccRecipientsList == null) this.emailData.bccRecipientsList = [];

          setTimeout(() => {
            this.emailmodalbtn.nativeElement.click();
          }, 500)
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

  async isDestorySurveyQuestion(event) {
    if (event) {
      debugger
      await this.getSurveyQuestionsbySurveyId();
    }
  }

  /*
  selectEmailAttachmentFiles(e) {
    console.log(e);
    //if(this.emailAttachments && !this.emailAttachments[0].hasOwnProperty('name')) this.emailAttachments.splice(0,1);
    //this.emailAttachments = this.emailAttachments.concat(e.target.files);

    for (let i = 0; i < e.target.files.length; i++) {
      this.emailAttachments.push(e.target.files[i]);
    }

    if (this.emailAttachments.length == 4) this.emailAttachments.splice(0, 1);
  }

  removeEmailAttachmentFiles(i) {
    this.emailAttachments.splice(i, 1);
    if (this.emailAttachments.length < 3) this.emailAttachments.unshift(null);
  }

  sendEmail(form) {
    console.log(form);
    if(this.emailData.recipientsList)this.emailData.recipients = this.emailData.recipientsList.join(',');
    if(this.emailData.bccRecipientsList)this.emailData.bccRecipients = this.emailData.bccRecipientsList.join(',');

    this.isSubmitForm = true;
    this.isSubmitFormSpinner = true;
    if (form.invalid || this.emailData.recipientsList.length < 1) {
      //this.isSubmitForm = false;
      this.isSubmitFormSpinner = false;
    }
    else {
      this.emailService.postEmail(this.emailData, this.emailAttachments)
        .subscribe(res => {
          console.log(res);
          if (res.succeeded) {

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

  changeTemplate() {
    this.emailtemplates.forEach((te) => {
      if (te.id == this.emailData.templateId) {
        this.emailData.subject = te.subject;
        this.emailData.body = te.body;

        tinymce.remove();
        this.initTinymce();
      }
    })
  }*/
}
