import { Component, OnInit, Input } from '@angular/core';
import { Route, Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Job } from '../models/job';
import { State } from '../models/state';
import { Category } from '../models/category';
import { ClientServices } from '../services/client.services';
import { SharedServices } from '../services/shared.services';
import { Client } from '../models/client';
import { JobServices } from '../services/job.services';
import { UserServices } from '../services/user.services';
import { User } from '../models/user';

import swal from 'sweetalert2';
import * as moment from 'moment';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SecurityRights } from '../shared/enum';
import { Note } from '../models/note';

@Component({
  selector: 'JobEditComponent',
  templateUrl: './jobedit.component.html'
})

export class JobEditComponent implements OnInit {
  job: Job;
  @Input() id: number;
  @Input() isUpdateJob: boolean;
  isLoading = true;
  isSubmitFormSpinner = false;
  isSubmitForm = false;
  states: Array<State>;
  categories: Array<Category>;
  clients: Array<Client>;
  staffs: Array<User>;
  projectManagers: Array<User>;
  recruiters: Array<User>;
  jobgrouptypes = [];
  jobstatus = [];
  difficultystatus = [];
  jobTopicList = [];

  @Input() paramsClientId: number;
  clientNotes: Array<Note> = [];
  numberOfInvitees: number;
  numberOfSMSInvites: number;

  constructor(private jobsevice: JobServices, private _userService: UserServices,
    private router: Router, private sharedservice: SharedServices,
    private _clientservice: ClientServices, private securityInfoResolve: SecurityInfoResolve) {
  }

  ngOnInit() {
    this.getAllClients();
    this.getStaffs();
    this.getActiveUsers();
    // this.getProjectManages();
    // this.getRecruiters();
    this.getJobType();
    this.getJobStatus();
    this.getDifficultystatus();

    if (this.id != null && this.isUpdateJob) {
      this.getJobById(this.id);
      this.getJobSurveyDetails(this.id);
    } else {
      this.addNew();
    }

    this.getJobTopicList();
  }

  addNew() {
    this.job = new Job();
    this.job.jobNumber = 'AUTO';
    this.job.dateReceived = moment().toDate();
    this.isLoading = false;

    if (this.paramsClientId) this.job.clientId = this.paramsClientId;
    console.log(this.paramsClientId);
    console.log(this.job);
  }

  getJobById(id) {
    this.isLoading = true;
    this.jobsevice.getJobsByJob(id)
      .subscribe((res: any) => {
        this.job = res.value;
        if (this.job.dateReceived)
          this.job.dateReceived = moment(this.job.dateReceived).toDate();
        if (this.job.dateAllocatedToRecruitment)
          this.job.dateAllocatedToRecruitment = moment(this.job.dateAllocatedToRecruitment).toDate();
        if (this.job.expectedFirstSessionDate)
          this.job.expectedFirstSessionDate = moment(this.job.expectedFirstSessionDate).toDate();
        if (this.job.expectedLastSessionDate)
          this.job.expectedLastSessionDate = moment(this.job.expectedLastSessionDate).toDate();
        console.log(this.job);
        this.isLoading = false;

        this.getJobWarningByClient(this.job.clientId);
      });
  }

  getJobWarningByClient(cid) {
    this.jobsevice.getInvoiceWarningByClient(cid)
      .subscribe((res: any) => {
        this.clientNotes = res.value;
        console.log(this.clientNotes);
      })
  }

  getStaffs() {
    this._userService.getAllUser()
      .subscribe((res: any) => {
        this.staffs = res.value;
      });
  }

  getActiveUsers() {
    this._userService.getActiveUsers()
      .subscribe((res: any) => {
        this.projectManagers = res.value;
        this.recruiters = res.value;
      });
  }

  getJobType() {
    this.sharedservice.getJobGroupTypeList()
      .subscribe((res: any) => {
        this.jobgrouptypes = res.value;
      });
  }

  getJobStatus() {
    this.sharedservice.getJobStatusList()
      .subscribe((res: any) => {
        console.log(res);
        this.jobstatus = res.value;
      });
  }

  getDifficultystatus() {
    this.sharedservice.getdifficultyStatusList()
      .subscribe((res: any) => {
        console.log(res);
        this.difficultystatus = res.value;
      });
  }

  updateorCreateJob(form) {
    this.isSubmitForm = true;
    this.isSubmitFormSpinner = true;

    /*if (this.job.dateReceived) {
      var dateReceived = moment(this.job.dateReceived, 'YYYY-MM-DD');
      this.job.dateReceived = dateReceived.format();
    }

    if (this.job.dateAllocatedToRecruitment) {
      var dateAllocatedToRecruitment = moment(this.job.dateAllocatedToRecruitment, 'YYYY-MM-DD');
      this.job.dateAllocatedToRecruitment = dateAllocatedToRecruitment.format();
    }

    if (this.job.expectedFirstSessionDate) {
      var expectedFirstSessionDate = moment(this.job.expectedFirstSessionDate, 'YYYY-MM-DD');
      this.job.expectedFirstSessionDate = expectedFirstSessionDate.format();
    }

    if (this.job.expectedLastSessionDate) {
      var expectedLastSessionDate = moment(this.job.expectedLastSessionDate, 'YYYY-MM-DD');
      this.job.expectedLastSessionDate = expectedLastSessionDate.format();
    }*/

    if (form.invalid) {
      //this.isSubmitForm = false;
      this.isSubmitFormSpinner = false;
    } else {
      this.jobsevice.updateJob(this.job)
        .subscribe((res: any) => {
          console.log(res);
          this.isSubmitFormSpinner = false;
          this.isSubmitForm = false;

          if (res.succeeded) {
            swal(
              'Successfully Saved!',
              '',
              'success'
            );

            if (!this.isUpdateJob) {
              this.router.navigate(['/job/edit', res.value.id]);
              //this.id = res.value.id;
            }
            this.getJobById(res.value.id);
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

  getAllClients() {
    this._clientservice.getAllClients()
      .subscribe((res: any) => {
        this.clients = res.value;
      });
  }

  getJobTopicList() {
    this.sharedservice.getReferenceDataProvider('JobTopic')
      .subscribe((res: any) => {
        this.jobTopicList = res.value;
        console.log(this.jobTopicList);
      });
  }

  changeProjectManager() {
    if (this.job.projectManagerUsername != '') {
      if (this.job.jobStatus == 'To be allocated to Manager') {
        this.job.jobStatus = 'Allocated to Manager';
      }
    }
  }

  getJobSurveyDetails(id) {
    this.sharedservice.getJobSurveyDetails(id)
      .subscribe((res: any) => {
        console.log(res)
        this.numberOfInvitees = res.value.numberOfInvitees;
        this.numberOfSMSInvites = res.value.numberOfSMSInvites;
      })
  }
}
