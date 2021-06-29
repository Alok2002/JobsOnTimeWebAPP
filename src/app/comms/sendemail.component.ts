import { ClientServices } from './../services/client.services';
// import 'tinymce/tinymce.min';
import { Component, EventEmitter, Inject, OnInit, Output, PLATFORM_ID } from '@angular/core';
import swal from 'sweetalert2';

import { Email } from '../models/email';
import { EmailTemplate } from '../models/emailtemplate';
import { EventClient } from '../models/eventclient';
import { ManageEmail } from '../models/manageemail';
import { User } from '../models/user';
import { EventServices } from '../services/event.services';
import { SharedServices } from './../services/shared.services';
import { UserServices } from '../services/user.services';
import { JobServices } from '../services/job.services';
import { EmailServices } from '../services/email.services';
import { CookieService } from 'ngx-cookie-service';
import { ckEditorConfig } from '../app.component';
// import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import ClassicEditor from '../shared/ckeditor.config';
// import * as Editor from './../../assets/ckeditor/build/ckeditor';
import { isPlatformBrowser } from '@angular/common';

// declare var tinymce: any;
declare var jQuery: any;

@Component({
  selector: 'SendEmailComponent',
  templateUrl: './sendemail.component.html'
})

export class SendEmailComponent implements OnInit {
  // public editor;  

  // clients: Array<Client>;
  // jobs: Array<Job>;
  // sessions: Array<Session>;
  eventClients: Array<EventClient> = [];
  eventJobs: Array<EventClient> = [];
  eventJobSessions: Array<EventClient> = [];
  isLoading = true;

  selectedClient: number;
  selectedJob: number;
  selectedSession: number;
  selectedUser: number;
  recipients = [];
  subject: string;
  body: string = null;
  isElectronicDoc = true;

  isSubmitForm = false;
  isSubmitFormSpinner = false;

  user: User;
  users: Array<User>;

  @Output() onEditorKeyup = new EventEmitter<any>();

  emailtemplates: Array<EmailTemplate>;
  tempalteId: number;
  emailAttachments = [];

  currentlyTrackingJob = null;
  manageEmails: Array<ManageEmail>;
  ckEditorConfig = JSON.parse(JSON.stringify(ckEditorConfig));

  /*public Editor = ClassicEditor;
  public onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }*/
  isBrowser = false;

  constructor(private clientService: ClientServices, private _userService: UserServices, private cookieservice: CookieService,
    private emailService: EmailServices, private sharedservice: SharedServices, private eventservices: EventServices, @Inject(PLATFORM_ID) platformId: Object) {
      /*this.isBrowser = isPlatformBrowser(platformId);
      if(this.isBrowser) {
        const ClassicEditor = require('./../../assets/ckeditor/build-v4/ckeditor');
        this.editor = ClassicEditor;
      }*/
    // tinymce.remove();    
  }

  ngOnInit() {
    if (this.cookieservice.check("currentlytracking"))
      this.currentlyTrackingJob = JSON.parse(this.cookieservice.get("currentlytracking"));
    // this.initTinymce();
    this.getClients();
    this.getUsers();
    this.getEmailTemplates();
    this.getAllMangeEmails();
  }

  getClients() {
    this.eventservices.getClients()
      .subscribe((res: any) => {
        this.eventClients = res.value;

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

  getUsers() {
    this._userService.getAllUser()
      .subscribe((res: any) => {
        this.users = res.value;
      });
  }

  getEmailTemplates() {
    this.emailService.getGeneralEmailTemplates()
      .subscribe((res: any) => {
        this.emailtemplates = res.value;
        this.isLoading = false;
      })
  }

  changeTemplate() {
    this.emailtemplates.forEach((te) => {
      if (te.id == this.tempalteId) {
        this.subject = te.subject;
        this.body = te.body;        

        // tinymce.remove();
        // this.initTinymce();
      }
    })
  }

  /*initTinymce() {
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
              if (editor.id == "elm1") {
                //template.galleryPreDeployment = content;
                //this.body = content;
                self.body = content;
              }
            });
        }
      });
      jQuery(".mce-tinymce").css('display', 'block');
    });
    this.isLoading = false;
  }*/

  submitEmail(form) {
    this.isSubmitForm = true;
    this.isSubmitFormSpinner = true;
    if (form.invalid || this.recipients.length < 1) {
      //this.isSubmitForm = false;
      this.isSubmitFormSpinner = false;
    }
    else {
      var emailData = new Email();
      emailData.clientId = this.selectedClient;
      emailData.jobId = this.selectedJob;
      emailData.groupId = this.selectedSession;
      emailData.templateId = this.tempalteId;
      emailData.fromId = this.selectedUser;
      if (this.recipients)
        emailData.recipients = this.recipients.map(e => e.value).join(",");
      emailData.subject = this.subject;
      emailData.body = this.body;

      this.emailService.postEmail(emailData, this.emailAttachments)
        .subscribe((res: any) => {
          if (res.succeeded) {
            this.resetForm();
            swal('Successfully Sent!', '', 'success');

          } else {
            var err = "";
            res.errors.forEach((er) => {
              err = err + " " + er;
            });
            swal('Error!', err, 'error')
          }
        });
    }
  }

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

  resetForm() {
    this.selectedClient = null;
    this.selectedJob = null;
    this.selectedSession = null;
    this.tempalteId = null;
    this.selectedUser = null;
    this.subject = null;
    this.body = '';
    this.isElectronicDoc = true;
    this.isSubmitForm = false;
    this.recipients = [];
    // tinymce.remove();
    // this.initTinymce();
  }

  getAllMangeEmails() {
    this.sharedservice.getAllMangeEmails()
      .subscribe((res: any) => {
        this.manageEmails = res.value;
        console.log(this.manageEmails)
      });
  }
}
