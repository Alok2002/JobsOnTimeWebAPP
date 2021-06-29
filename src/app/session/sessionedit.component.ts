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
  selector: 'SessionEditComponent',
  templateUrl: './sessionedit.component.html',
  styles: [`:host ::ng-deep .ck-editor__editable_inline {min-height: 50px;}`]
})

export class SessionEditComponent implements OnInit {
  editor;
  @Input() id: number;
  @Input() isUpdateSession: boolean;

  @Input() jobId: number;

  session: Session;
  isLoading = true;

  isSubmitForm = false;
  isSubmitFormSpinner = false;

  jobGroupTypes = [];
  venues: Array<Venue>;

  job: Job;
  clientId: number;

  selectedVenue = null;
  incentives: Array<Incentive> = [];

  incentive = new Incentive();
  incentivesTypes = [];
  @ViewChild("closeAddNewModal") closeAddNewModal;
  @ViewChild("closeAddNewSessionTimeModal") closeAddNewSessionTimeModal;
  @ViewChild("closeAddNewDurationModal") closeAddNewDurationModal;

  sessiontime = new SessionTime();
  sessiontimes: Array<SessionTime> = [];

  duration = new Duration();
  durations: Array<Duration> = [];

  timeMask = timeMask;
  viewIncentive: Incentive;

  incentivesAmoutPoints = [];

  @ViewChild('container', { read: ViewContainerRef })
  public containerRef: ViewContainerRef;
  invoices: Array<JobInvoice> = [];
  preSessions: Array<Session> = [];

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
    this.getJobGroupTypeList();
    if (!this.id)
      this.getJobByJobId();
    this.getIncentiveTypes();
    this.getIncentives();

    console.log(this.id, this.isUpdateSession);

    if (this.id != null && this.isUpdateSession) {
      this.getSessionById(this.id);
      this.getSessionIncentiveBySessionId(this.id);
      this.getSessionDurationBySessionId(this.id);
      this.getSessionTimes(this.id);
    } else {
      this.addNew();
    }
    this.getInvoicesByJobId();
    this.getPreviousSessions();
  }

  getPreviousSessions() {
    this.jobservice.getSessionByJob(this.jobId)
      .subscribe((res: any) => {
        console.log(res)
        this.preSessions = res.value;
      })
  }

  getInvoicesByJobId() {
    this.jobservice.getInvoicesByJobId(this.jobId)
      .subscribe((res: any) => {
        console.log(res)
        this.invoices = res.value;
      })
  }

  addNew() {
    this.session = new Session();
    this.isLoading = false;
  }

  getSessionById(id) {
    this.sessionservice.getSessionsbyId(id)
      .subscribe((res: any) => {
        console.log(res);
        this.session = res.value;
        if (this.session.dateTime)
          this.session.dateTime = moment(this.session.dateTime).toDate();

        this.getJobByJobId();
        this.isLoading = false;
      });
  }

  getJobGroupTypeList() {
    this.sharedservice.getJobGroupTypeList()
      .subscribe((res: any) => {
        this.jobGroupTypes = res.value;
      });
  }

  getJobByJobId() {
    this.jobservice.getJobsByJob(this.jobId)
      .subscribe((res: any) => {
        console.log(res);
        this.job = res.value;
        if (!this.id)
          this.session.hasHomeworkTask = this.job.hasHomeworkTask;
        this.getVenuebyClient(res.value.clientId);
      });
  }

  getVenuebyClient(id) {
    this.clientId = id;
    console.log(id);
    this._clientService.getVenuebyClient(id)
      .subscribe((res: any) => {
        this.venues = res.value;
        console.log(this.venues);
      });
  }

  updateorCreateSession(form) {
    this.isSubmitForm = true;
    this.isSubmitFormSpinner = true;
    if (form.invalid) {
      //this.isSubmitForm = false;
      this.isSubmitFormSpinner = false;
    } else {
      this.session.clientJobId = this.jobId;
      console.log(this.incentives)
      console.log(this.session.id)
      if (this.session.id) {
        this.sessionservice.updateSessionIncentive(this.incentives, this.session.id)
          .subscribe(res => {
            console.log(res);
          });
      }

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

            if (!this.isUpdateSession) {
              this.router.navigate(['/session/edit', res.value.id, this.jobId]);
            }

            this.getSessionById(res.value.id);
          }
        });
    }
  }

  response(res) {
    if (res.succeeded)
      this.getVenuebyClient(this.clientId);
  }

  preventInputOrPaste(e) {
    e.preventDefault();
  }

  addNewIncentive() {
    this.incentive = new Incentive();
  }

  getSessionIncentiveBySessionId(id) {
    this.sessionservice.getSessionIncentiveBySessionId(id)
      .subscribe((res: any) => {
        this.incentives = res.value;
        console.log(this.incentives);
      })
  }

  getIncentiveTypes() {
    this.sharedservice.getIncentiveTypeList()
      .subscribe((res: any) => {
        this.incentivesTypes = res.value;
      });
  }

  updateorCreateSessionIncentive(form) {
    this.isSubmitForm = true;
    this.isSubmitFormSpinner = true;
    if (form.invalid) {
      //this.isSubmitForm = false;
      this.isSubmitFormSpinner = false;
    } else {
      this.incentive.clientJobId = this.jobId;
      //this.incentive.clientJobGroupId = this.id;      
      this.jobservice.updateJobIncentive(this.incentive)
        .subscribe((res: any) => {
          this.isSubmitFormSpinner = false;
          this.isSubmitForm = false;

          if (res.succeeded) {
            this.closeAddNewModal.nativeElement.click();
            //this.router.navigate(['/client']);
            this.getSessionIncentiveBySessionId(this.id);
          }
        });
    }
  }

  //SESSION TIME
  addNewSessionTime() {
    this.sessiontime = new SessionTime();
  }

  getSessionTimes(id) {
    this.sessionservice.getSessionTimesBySessionId(id)
      .subscribe((res: any) => {
        console.log(res);
        this.sessiontimes = res.value;
      })
  }

  submitSessionTime(form) {
    console.log(this.sessiontime);
    this.isSubmitForm = true;
    this.isSubmitFormSpinner = true;
    if (form.invalid) {
      //this.isSubmitForm = false;
      this.isSubmitFormSpinner = false;
    }
    else {
      this.sessiontime.clientJobGroupId = this.id;
      this.sessionservice.updateSessionTime(this.sessiontime)
        .subscribe((res: any) => {
          this.isSubmitFormSpinner = false;
          this.isSubmitForm = false;
          if (res.succeeded) {
            this.closeAddNewSessionTimeModal.nativeElement.click();
            //this.router.navigate(['/client']);
            this.getSessionTimes(this.id);
          }
        });
    }
  }

  deleteSessionTime(id) {
    //if (this.checkPermission()) {
    var deleteIds = [];
    deleteIds.push(id);

    if (deleteIds.length > 0) {
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
          this.sessionservice.deleteSessionTime(deleteIds)
            .subscribe((res: any) => {
              if (res.succeeded) {
                deleteIds = [];
                this.getSessionTimes(this.id);

                swal(
                  'Deleted!',
                  'Selected item has been deleted.',
                  'success'
                );
              } else {
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
          // result.dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
        } else if (result.dismiss === swal.DismissReason.cancel) {
          swal(
            'Cancelled',
            'Selected item is safe :)',
            'error'
          );
        }
      });
    }
    else {
      swal(
        'Oops...',
        'Please select an item to delete.',
        'info'
      );
    }
    //}
  }

  //DURATION
  addNewDuration() {
    this.duration = new Duration();
  }

  getSessionDurationBySessionId(id) {
    this.sessionservice.getSessionDurationBySessionId(id)
      .subscribe((res: any) => {
        this.durations = res.value;
        console.log(this.incentives);
      })
  }

  updateSessionDuration(form) {
    this.isSubmitForm = true;
    this.isSubmitFormSpinner = true;
    if (form.invalid) {
      //this.isSubmitForm = false;
      this.isSubmitFormSpinner = false;
    } else {
      this.duration.clientJobId = this.jobId;

      if (this.duration.durations) {
        var groupTime = moment(this.duration.durations, "YYYY-MM-DD");
        this.duration.durations = groupTime.format("hh:mm:ss a");
      }
      //this.incentive.clientJobGroupId = this.id;
      this.jobservice.updateDurations(this.duration, this.jobId)
        .subscribe((res: any) => {
          this.isSubmitFormSpinner = false;
          this.isSubmitForm = false;

          if (res.succeeded) {
            this.closeAddNewDurationModal.nativeElement.click();
            //this.router.navigate(['/client']);
            this.getSessionDurationBySessionId(this.id);
          }
        });
    }
  }

  unmask(value) {
    var ret = value.replace(/\D+/g, '');
    return ret;
  }

  getIncentives() {
    this.resService.getRespondentData('Incentive', 0)
      .subscribe((res: any) => {
        console.log(res);
        this.incentivesAmoutPoints = res.value;
      });
  }

  updateSessionIncentives() {
    if (this.session.id) {
      this.sessionservice.updateSessionIncentive(this.incentives, this.session.id)
        .subscribe((res: any) => {
          console.log(res);
          if (res.succeeded) {
            this.getSessionIncentiveBySessionId(this.id);
          }
        });
    }
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
}
