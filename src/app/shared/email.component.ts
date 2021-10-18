import { Session } from './../models/session';
import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, PLATFORM_ID, ViewChild } from '@angular/core';
import swal from 'sweetalert2';
import { Email } from '../models/email';
import { EmailTemplate } from '../models/emailtemplate';
import { EmailServices } from '../services/email.services';
import { apiHost, ckEditorConfig } from './../app.component';
import { Job } from '../models/job';

// declare var tinymce: any;
declare var jQuery: any;
declare var ics: any;

@Component({
  selector: 'email-component',
  templateUrl: './email.component.html'
})

export class EmailComponent implements OnInit, OnChanges {
  editor;
  @Input() emailData: Email;
  @Input() modalTitle: string;
  @Output() closeModal = new EventEmitter();

  isSubmitForm = false;
  showEmailSuccessMsg = false;
  emailAttachments = [];

  // public editor: any;
  @Output() onEditorKeyup = new EventEmitter<any>();
  isLoading = true;

  apihost = apiHost;

  emailtemplates: Array<EmailTemplate> = [];

  /*public Editor = ClassicEditor;
  public onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }*/

  @ViewChild("attachment1") attachment1: any;
  ckEditorConfig = JSON.parse(JSON.stringify(ckEditorConfig));
  isBrowser = false;
  @Input() session: Session;
  @Input() emailEntity: string;
  isAttachIcsFile = false;
  @Input() redirectUrl: string;

  emailSuccessMsg = "Email Sent Successfully.";
  @Input() jobData: { exJob: Job, trJob: Job } = null;

  constructor(private emailService: EmailServices, @Inject(PLATFORM_ID) platformId: Object) {
    /*this.isBrowser = isPlatformBrowser(platformId);
    if(this.isBrowser) {
      const ClassicEditor = require('./../../assets/ckeditor/build/ckeditor');
      this.editor = ClassicEditor;
    }*/
  }

  ngOnInit() {
    if (this.modalTitle == null) this.modalTitle = 'Send Email';

    this.emailAttachments.push(null);
    //this.initTinymce();
    this.getEmailTemplates();
  }

  ngOnChanges() {
    console.log("inside onchange");
    this.generateEmailData();
    //this.initTinymce();
  }

  generateEmailData() {
    console.log(this.emailData);
    if (this.emailData.recipients) {
      this.emailData.recipientsList = [];
      this.emailData.recipients.split(',').forEach(rl => {
        this.emailData.recipientsList.push({ display: rl, value: rl }); //this.emailData.recipients.split(',');
      })
    }

    //if (this.emailData.bccRecipients)
    //  this.emailData.bccRecipientsList = this.emailData.bccRecipients.split(',');

    if (this.emailData.fromId == 0) this.emailData.fromId = null;
    if (this.emailData.recipientsList == null) this.emailData.recipientsList = [];
    if (this.emailData.bccRecipientsList == null) this.emailData.bccRecipientsList = [];

    this.isSubmitForm = false;
    this.showEmailSuccessMsg = false;
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
        toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist | link image | preview media fullpage | forecolor backcolor | paste",
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
              const content = editor.getContent();
              self.onEditorKeyup.emit(content);
              if (editor.id == "elm1") {
                //template.galleryPreDeployment = content;
                //this.body = content;
                self.emailData.body = content;
              }
            });
        }
      });
      jQuery(".mce-tinymce").css('display', 'block');
    });
    this.isLoading = false;
  }*/

  selectEmailAttachmentFiles(e) {
    //if(this.emailAttachments && !this.emailAttachments[0].hasOwnProperty('name')) this.emailAttachments.splice(0,1);
    //this.emailAttachments = this.emailAttachments.concat(e.target.files);

    for (let i = 0; i < e.target.files.length; i++) {
      this.emailAttachments.unshift(e.target.files[i]);
    }

    /*if (this.emailAttachments.length > 4) 
      this.emailAttachments.splice(0, 1);*/

    if (this.emailAttachments.length >= 4) {
      var index = this.emailAttachments.indexOf(null);
      if (index >= 0)
        this.emailAttachments.splice(index, 1);
    }

    this.attachment1.nativeElement.value = null;
  }

  removeEmailAttachmentFiles(i) {
    console.log(this.emailAttachments)
    this.emailAttachments.splice(i, 1);
    //if (this.emailAttachments.length < 3) this.emailAttachments.unshift(null);
    if (this.emailAttachments.length < 1) this.emailAttachments.push(null);

    if (this.emailAttachments.length < 3) {
      var index = this.emailAttachments.indexOf(null);
      if (index < 0) this.emailAttachments.push(null);
    }

    console.log(i)
    console.log(this.emailAttachments)
  }

  sendEmail(form) {
    console.log(this.emailData);
    var filteredEmailAttachments = this.emailAttachments.filter(function (el) {
      return el != null;
    });

    console.log(this.emailData.body);

    if (this.modalTitle.toLowerCase() == 'send confirmation email (all respondents)' ||
      this.modalTitle.toLowerCase() == 'send confirmation email (only new respondents)') {
      if (this.emailData.body.match("Homework") != null) {
        swal({
          title: 'Are you sure?',
          text: 'Make sure you attach the Homework Task document if required.',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, Send',
          confirmButtonColor: '#ffaa00',
          cancelButtonText: "Don't Send"
        }).then((result) => {
          console.log(result);
          if (result.value)
            this.sendEmailHelper(form);
        })
      } else {
        this.sendEmailHelper(form);
      }
    } else {
      this.sendEmailHelper(form);
    }
  }

  async sendEmailHelper(form) {
    if (this.emailData.recipientsList) this.emailData.recipients = this.emailData.recipientsList.map(e => e.value).join(",");
    //if(this.emailData.bccRecipientsList)this.emailData.bccRecipients = this.emailData.bccRecipientsList.join(',');

    this.isSubmitForm = true;
    if (form.invalid || this.emailData.recipientsList.length < 1) {
      //this.isSubmitForm = false;
    }
    else {
      console.log(this.emailData);
      // if (this.isAttachIcsFile) {
      //   await this.generateIcsFile().then((data) => this.emailAttachments.push(data));
      // }

      if (this.emailData.recipientsList.length > 1500) {
        this.emailService.postEmail(this.emailData, this.emailAttachments, true)
          .subscribe((res: any) => {
            console.log(res)
          });
        this.showEmailSuccessMsg = true;
        this.emailSuccessMsg = "Emails are in the queue. System will notify once the emails are sent";
      } else {
        this.emailService.postEmail(this.emailData, this.emailAttachments)
          .subscribe((res: any) => {
            this.emailData = new Email();
            this.emailAttachments = [];
            this.emailAttachments.length = 1;

            if (res.succeeded) {
              this.showEmailSuccessMsg = true;
              this.gotoRedirectUrl();
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
  }

  resetEmailData() {
    this.emailData = new Email();
    this.emailData.body = '';
    this.isSubmitForm = false;
    this.showEmailSuccessMsg = false;
  }

  getFileName(af) {
    var ret = '';
    if (af) {
      var arr = af.split("\\");
      ret = arr[arr.length - 1];
    }
    return ret;
  }

  getEmailTemplates() {
    this.emailService.getEmailTemplates()
      .subscribe((res: any) => {
        this.emailtemplates = res.value;
      })
  }

  changeTemplate() {
    this.emailtemplates.forEach((te) => {
      if (te.id == this.emailData.templateId) {
        this.emailData.subject = te.subject;
        this.emailData.body = te.body;

        //tinymce.remove();
        //this.initTinymce();
      }
    })
  }

  async generateIcsFile() {
    console.log(this.session);
    return new Promise(resolve => {
      var ret = null;
      var cal = ics();
      cal.addEvent('subject', 'description', 'location', new Date(this.session.dateTime), new Date(this.session.dateTime));
      var ret = cal.download('event');
      var file = new File([ret], 'event.ics');
      console.log(file);
      ret = file;
      resolve(ret);
    });
  }

  gotoRedirectUrl() {
    if (this.redirectUrl) {
      setTimeout(() => {
        window.location.href = this.redirectUrl;
      }, 1500)
    }
  }
}
