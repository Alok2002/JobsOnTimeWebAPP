import { CookieService } from 'ngx-cookie-service';
import { AnonymousSubscription } from 'rxjs/Subscription';
import { DashboardServices } from '../services/dashboard.services';
import { Component, OnDestroy, OnInit } from "@angular/core";
import { SharedServices } from "../services/shared.services";
import { JobServices } from "../services/job.services";
import { Job } from "../models/job";
import swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';
import { apiHost } from '../app.component';
import { timer } from 'rxjs/observable/timer';
import { TrackingJob } from '../models/trackingjob';

@Component({
  selector: 'JobTrackerComponent',
  templateUrl: './jobtracker.component.html'
})
export class JobTrackerComponent implements OnInit, OnDestroy {
  trackingJob: any;
  searchJobNo: string;
  searchJobResults: Array<Object> = [];
  job: Job;

  private timerSubscription: AnonymousSubscription;
  private trackingJobSubscription: AnonymousSubscription;
  public jobNoAPI: string;

  constructor(private sharedService: SharedServices, private jobservice: JobServices, private cookieservice: CookieService,
    private dashboardservice: DashboardServices, private _sanitizer: DomSanitizer) {
    if (this.cookieservice.check('auth_token')) {
      var token = this.cookieservice.get('auth_token');
      this.jobNoAPI = apiHost + "/api/search/job-number/:keyword/?token=" + token;
    }
  }

  public ngOnInit(): void {
    this.getCurrentlyTrackingJob();
  }

  getCurrentlyTrackingJob() {
    this.sharedService.getCurrentlyTrackingJob("Admin")
      .subscribe((res: any) => {
        console.log(res);
        if (res.value) {
          this.jobservice.getJobsByJob(res.value.jobId)
            .subscribe((rs: any) => {
              console.log(rs);
              this.cookieservice.set('currentlytracking', JSON.stringify(rs.value), null, '/');
              this.refreshData();
            });
        }
      });
  }

  public ngOnDestroy(): void {
    if (this.trackingJobSubscription) {
      //this.trackingJobSubscription.unsubscribe();
    }
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  refreshData(): void {
    /*this.trackingJobSubscription = this.sharedService.getCurrentlyTrackingJob()
      .subscribe(res => {
        this.trackingJob = res.value.id;
        console.log("inside refresh data");
        this.subscribeToData();
      });*/
    /*this.trackingJobSubscription = this.storageservice.readMap("currentlytacking")
      .subscribe(res => {
        console.log(res);
        //this.trackingJob = res;
      });*/

    // console.log(this.cookieservice.get("currentlytracking"));
    this.trackingJobSubscription = this.cookieservice.get("currentlytracking") ? JSON.parse(this.cookieservice.get("currentlytracking")) : null;

    //var trackingJson = JSON.parse(this.storageservice.readMap("currentlytracking"));
    var trackingJson = this.cookieservice.get("currentlytracking") ? JSON.parse(this.cookieservice.get("currentlytracking")) : null;
    this.trackingJob = trackingJson;    
    this.subscribeToData();
    // console.log(this.trackingJob);
  }

  private subscribeToData(): void {
    //setTimeout(() => {
    //this.timerSubscription = (() => this.refreshData());
    //this.refreshData();
    //}, 100);
    this.timerSubscription = timer(1000).subscribe(() => this.refreshData());
  }

  searchJob() {
    if (this.searchJobNo != "" && this.searchJobNo != null)
      this.sharedService.searchJob(this.searchJobNo)
        .subscribe((re: any) => {
          console.log(re);
          re.value.forEach(job => {
            this.searchJobResults.push({ id: job.jobNumber, value: job.jobName, jobid: job.id });
          });
        });
  }

  onSelect($event) {
    console.log("onselect");
  }

  startTrackingJob(searchjob) {
    console.log(searchjob)
    if (searchjob && searchjob != "" && searchjob != undefined && searchjob.hasOwnProperty('id')) {
      this.searchJobNo = "";
      console.log(searchjob);
      this.sharedService.startTrackingJob(searchjob.id, 'Admin')
        .subscribe((res: any) => {
          console.log(res);
          if (res.succeeded) {
            swal(
              'Tracked!',
              res.value.jobNumberAndName + ' job has been tracked.',
              'success'
            );
            var jsonstr = JSON.stringify(new TrackingJob(res.value));
            console.log(jsonstr);
            this.cookieservice.set('currentlytracking', jsonstr, null, '/');
            this.refreshData();
            this.searchJobResults = [];
            this.searchJobNo = "";
          } else {
            swal(
              'Oops...',
              'Something went wrong while tracking.',
              'info'
            );
          }
        });
    }
    else {
      this.searchJobNo = "";
    }
  }

  stopTrackingJob() {
    this.jobservice.getJobsByJob(this.trackingJob.id)
      .subscribe((res: any) => {
        this.job = res.value;
      });

    this.sharedService.stopTrackingJob(this.trackingJob.id, 'Admin')
      .subscribe((res: any) => {
        console.log(res);
        if (res.succeeded) {
          swal(
            'Tracking Stopped!',
            res.value.jobNumberAndName + ' job has been stopped tracking.',
            'success'
          );
          this.cookieservice.set('currentlytracking', null, null, '/');
          this.refreshData();
          this.searchJobResults = [];
          this.searchJobNo = "";
        } else {
          swal(
            'Oops...',
            'Something went wrong while stop tracking.',
            'info'
          );
        }
      });
  }
}