import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import swal from 'sweetalert2';
import { ckEditorConfig } from '../app.component';

import { Job } from '../models/job';
import { JobInvitationEmail } from '../models/jobinvitationemail';
import { JobServices } from '../services/job.services';
import { SharedServices } from './../services/shared.services';
// import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import * as Editor from './../../assets/ckeditor/build/ckeditor';
import { isPlatformBrowser } from '@angular/common';

declare var jQuery: any;
declare var Clipboard: any;

@Component({
  selector: 'JobInvitationEmailComponent',
  templateUrl: './jobinvitationemail.component.html',
  styles: [':host ::ng-deep .ck-editor__editable_inline {min-height: 50px;}']
})

export class JobInvitationEmailComponent implements OnInit {
  editor;
  @Input() id: number;
  @Input() isUpdateJob: boolean;

  jobInvitationEmail: JobInvitationEmail;
  isLoading = true;

  job: Job;
  isSubmitForm = false;
  isSubmitFormSpinner = false;

  providersList = [];
  provider: string;
  link: string;
  generatedlink = null;
  ckEditorConfig = JSON.parse(JSON.stringify(ckEditorConfig));
  isBrowser = false;

  constructor(private jobSerive: JobServices, private sharedservice: SharedServices, @Inject(PLATFORM_ID) platformId: Object) {
    /*this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      const ClassicEditor = require('./../../assets/ckeditor/build/ckeditor');
      this.editor = ClassicEditor;
    }*/
  }

  ngOnInit() {
    this.ckEditorConfig.height = 50;
    // this.jobInvitationEmail = new JobInvitationEmail();    
    this.getJobById(this.id);
    this.getSurveyProvidersList();
  }

  getJobById(jobid) {
    this.jobSerive.getJobsByJob(jobid)
      .subscribe((res: any) => {
        console.log(res);
        this.job = res.value;
        this.isLoading = false;

        if (this.job.inviteJobType == null || this.job.inviteJobType == '') this.job.inviteJobType = this.job.sessionType;
      });
  }

  updateJob(form) {
    this.isSubmitForm = true;
    this.isSubmitFormSpinner = true;
    if (form.invalid) {
      //this.isSubmitForm = false;
      this.isSubmitFormSpinner = false;
    } else {
      this.jobSerive.updateJob(this.job)
        .subscribe((res: any) => {
          console.log(res);
          this.isSubmitFormSpinner = false;
          this.isSubmitForm = false;

          if (res.succeeded) {
            swal(
              'Successfully Saved!',
              '',
              'success'
            )
          }
          else {
            var err = '';
            res.errors.forEach((er) => {
              err = err + ' ' + er;
            });
            swal(
              'Error!',
              err,
              'error'
            );
          }
        });
    }
  }

  uploadFile(e) {
    var files = [];
    files.push(e.target.files[0]);

    console.log(files)
    this.sharedservice.uploadFile(files)
      .subscribe((res: any) => {
        console.log(res);
        if (res && res.length > 0)
          this.job.inviteImageUrl = res[0];
      });
  }

  getSurveyProvidersList() {
    this.sharedservice.getSurveyProvidersList()
      .subscribe((res: any) => {
        console.log(res)
        this.providersList = res.value;
      })
  }

  clipboardCopy() {
    function showTooltip(elem: any, msg: string) {
      console.log(elem)
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

  generateLink(linkgenform) {
    this.isSubmitForm = true;
    this.generatedlink = null;
    if (linkgenform.valid) {
      this.jobSerive.generateLink(this.provider, this.link)
        .subscribe((res: any) => {
          console.log(res)
          this.isSubmitForm = false;
          this.generatedlink = res.value;
        })
    }
  }

  checkStringLength(inputstring) {
    if (inputstring != null) {
      var mapstring = new String(inputstring);
      return mapstring.length;
    }
    return 0;
  }
}
