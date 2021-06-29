import { Component, Inject, Input, OnInit, PLATFORM_ID, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import swal from 'sweetalert2';

import { ckEditorConfig, timeMask } from '../app.component';
import { Duration } from '../models/duration';
import { Job } from '../models/job';
import { Session } from '../models/session';
import { SessionTime } from '../models/sessiontime';
import { Venue } from '../models/venue';
import { ClientServices } from '../services/client.services';
import { JobServices } from '../services/job.services';
import { RespondentServices } from '../services/respondent.services';
import { SessionServices } from '../services/session.services';
import { SharedServices } from '../services/shared.services';
import { Incentive } from './../models/incentive';
import { JobInvoice } from '../models/jobinvoice';
// import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import * as Editor from './../../assets/ckeditor/build/ckeditor';
import { isPlatformBrowser } from '@angular/common';

declare var Clipboard: any;

@Component({
  selector: 'SessionConfirmationEmail',
  templateUrl: './sessionconfirmationemail.component.html',
  styles: [`:host ::ng-deep .ck-editor__editable_inline {min-height: 50px;}`]
})

export class SessionConfirmationEmailComponent implements OnInit {
  editor;
  @Input() id: number;
  @Input() isUpdateSession: boolean;
  @Input() jobId: number;

  session: Session;
  isLoading = true;

  isSubmitForm = false;
  ckEditorConfig = JSON.parse(JSON.stringify(ckEditorConfig));
  isBrowser = false;

  constructor(private sharedservice: SharedServices, private sessionservice: SessionServices, private _clientService: ClientServices,
    private jobservice: JobServices, private router: Router, private resService: RespondentServices, @Inject(PLATFORM_ID) platformId: Object) {
    /*this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      const ClassicEditor = require('./../../assets/ckeditor/build/ckeditor');
      this.editor = ClassicEditor;
    }*/
  }

  ngOnInit() {
    this.ckEditorConfig.height = 50;
    console.log(this.id)
    this.getSessionById(this.id);
  }

  getSessionById(id) {
    this.sessionservice.getSessionsbyId(id)
      .subscribe((res: any) => {
        console.log(res);
        this.session = res.value;
        if (this.session.dateTime)
          this.session.dateTime = moment(this.session.dateTime).toDate();
        this.isLoading = false;
      });
  }

  updateorCreateSession(form) {
    this.isSubmitForm = true;    
    if (form.invalid) {
      //this.isSubmitForm = false;
      // this.isSubmitFormSpinner = false;
    } else {
      this.session.clientJobId = this.jobId;

      if (this.session.dateTime) {
        var dateTime = moment(this.session.dateTime, 'YYYY-MM-DD');
        this.session.dateTime = dateTime.format();
      }

      this.sessionservice.postSession(this.session)
        .subscribe((res: any) => {
          console.log(res);
          if (res.succeeded) {
            swal(
              'Successfully Saved!',
              '',
              'success'
            )
            this.getSessionById(res.value.id);
          }
        });
    }
  }
}
