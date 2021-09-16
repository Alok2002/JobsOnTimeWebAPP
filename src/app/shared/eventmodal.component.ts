import { CookieService } from 'ngx-cookie-service';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import * as moment from 'moment';
import swal from 'sweetalert2';

import { EventClient } from '../models/eventclient';
import { ResEvent } from '../models/resevent';
import { SessionTime } from '../models/sessiontime';
import { ClientServices } from '../services/client.services';
import { EventServices } from '../services/event.services';
import { RespondentServices } from '../services/respondent.services';
import { SessionServices } from '../services/session.services';
import { SharedServices } from '../services/shared.services';
import { JobSessionServices } from '../services/jobsession.services';

@Component({
  selector: 'EventModalComponent',
  templateUrl: './eventmodal.component.html',
})

export class EventModalComponent implements OnInit, OnChanges {
  @Input() resevent: ResEvent;
  @Input() selectedClient: number;
  @Input() deleteItemIds: any;
  @Output() resetEventForm = new EventEmitter();

  postEventMsg: string;
  eventtypelist = [];
  eventClients: Array<EventClient> = [];
  eventJobs: Array<EventClient> = [];
  eventJobSessions: Array<EventClient> = [];
  eventIncentives: Array<EventClient> = [];
  sessiontimes: Array<SessionTime> = [];
  isEditInDepthTime = true;
  postEventErrors = [];
  isSubmitForm = false;
  selectAllCheckBox = false;
  postEventSucceeded = true;
  currentlyTrackingJob = null;

  isLoading = true;

  constructor(private clientSevice: ClientServices, private sharedService: SharedServices,
    private resservice: RespondentServices, private eventService: EventServices,
    public sessionservice: SessionServices, private cookieservice: CookieService, private jobSessionServices: JobSessionServices) {
    // console.log("inside constructor");
  }

  ngOnInit() {
    this.resevent.removeFromOtherGroups = true;
    this.getEventTypeListWithBlank();
    this.getEventClient();

    if (!this.resevent.respondentIdsString)
      this.resevent.respondentIdsString = this.deleteItemIds.join(",");
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
  }

  inItHelper() {
    this.getCurrentlyTrackingJob();
    if (this.currentlyTrackingJob) {
      this.selectedClient = this.currentlyTrackingJob.clientId;
      this.getEventClientJobs(this.currentlyTrackingJob.clientId);
      this.resevent.jobId = this.currentlyTrackingJob.id;
      this.getEventClientJobGroups(this.currentlyTrackingJob.id);
      this.getEventIncentiveListForJob(this.currentlyTrackingJob.id);
    } else {
      this.selectedClient = null;
      this.resevent.jobId = null;
    }
  }

  getEventClient() {
    this.eventService.getClients()
      .subscribe((res: any) => {
        console.log(res);
        this.eventClients = res.value;
        this.inItHelper();
      })
  }

  getEventTypeListWithBlank() {
    this.resservice.getEventTypeListWithBlank()
      .subscribe((res: any) => {
        this.eventtypelist = res.value;
        console.log(this.eventtypelist);
        this.isLoading = false;
      })
  }

  getEventClientJobs(clientId) {
    this.resevent.jobId = null;
    this.eventService.getClientJobs(clientId)
      .subscribe((res: any) => {
        console.log(res);
        this.eventJobs = res.value;
      })
  }

  getEventClientJobGroups(jobid) {
    this.resevent.groupId = null;
    this.eventService.getClientJobGroupsIncludePast(jobid)
      .subscribe((res: any) => {
        console.log(res);
        this.eventJobSessions = res.value;
      })
  }

  getEventIncentiveListForJob(jobid) {
    this.resevent.incentive = null;
    this.eventService.getIncentiveListForJob(jobid)
      .subscribe((res: any) => {
        console.log(res);
        this.eventIncentives = res.value;
      })
  }

  getIncentiveListForGroup(groupId) {
    this.resevent.incentive = null;
    this.eventService.getIncentiveListForGroup(groupId)
      .subscribe((res: any) => {
        console.log(res);
        this.eventIncentives = res.value;
      })
  }

  getSessionTimes(id) {
    this.resevent.interviewTime = null;
    this.sessionservice.getSessionTimesBySessionIdForEventModal(id)
      .subscribe((res: any) => {
        console.log(res);
        this.sessiontimes = res.value;
      })
  }

  createResEvent(form) {
    console.log(form)
    if (this.resevent.respondentIdsString != null && this.resevent.respondentIdsString != '') {
      this.isSubmitForm = true;
      if (!form.invalid) {
        this.postEventMsg = null;
        if (this.selectAllCheckBox) this.deleteItemIds = [];
        console.log(this.deleteItemIds);

        // if (!this.isEditInDepthTime)
        //   this.resevent.interviewTime = moment(this.resevent.interviewTime, "hh:mm").format("hh:mm A");

        console.log(this.resevent);
        this.resservice.createResEvent(this.resevent)
          .subscribe((res: any) => {
            console.log(res);
            if (res.succeeded) {
              this.postEventMsg = res.successMsg;
              //this.unCheckAllItems();
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

              this.postEventMsg = null;
              // this.postEventSucceeded = false;
              // this.postEventErrors = res.errors;
            }
          })
      }
    }
    else {
      swal(
        'Oops...',
        'Please select an item to create event.',
        'info'
      )
    }
  }

  getCurrentlyTrackingJob() {
    this.currentlyTrackingJob = this.cookieservice.get("currentlytracking") ? JSON.parse(this.cookieservice.get("currentlytracking")) : null;
  }

  getPermission(event) {
    var ret = false;
    if (event) {
      var eventlow = event.toLowerCase();
      // console.log(eventlow);
      if (eventlow == 'manual points added' || eventlow == 'points paid' || eventlow == 'points deleted' || eventlow == 'survey points added')
        ret = true;
    }
    return ret;
  }

  updateIncentiveId() {
    this.eventIncentives.forEach((ei) => {
      if (ei.text == this.resevent.incentive)
        this.resevent.incentiveId = ei.value;
    })
  }
}
