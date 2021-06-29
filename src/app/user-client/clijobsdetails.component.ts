import { ActivatedRoute } from '@angular/router';
import { ObjectUtils } from 'primeng/components/utils/objectutils';
import { Component, OnInit, Input } from '@angular/core';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import swal from 'sweetalert2';
import { Job } from '../models/job';
import { JobServices } from '../services/job.services';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SharedServices } from '../services/shared.services';
import { SecurityRights, SecurityRightsExportError } from '../shared/enum';
import { PtableColumn } from '../models/ptablecolumn';
import { LazyLoadEvent } from 'primeng/api';

declare var jQuery: any;

@Component({
  selector: 'CliJobsDetailsComponent',
  templateUrl: './clijobsdetails.component.html'
})

export class CliJobsDetailsComponent implements OnInit {
  @Input() editJobId: number;
  @Input() isUpdateJob: boolean;
  @Input() paramsClientId: number;
  @Input() selectedTab: string;
  job: Job;

  constructor(private jobService: JobServices, private sharedService: SharedServices, 
    private securityInfoResolve: SecurityInfoResolve, private activateroute: ActivatedRoute) { }

  ngOnInit() {
    this.activateroute.params.subscribe(params => {
      this.paramsClientId = params['clientid'];
      if (params['id']) {
        this.isUpdateJob = true;
        this.editJobId = params['id'];
      }
    });
    this.selectedTab = "jobdoc";
    this.getJobById(this.editJobId);
  }

  getJobById(jobid) {
    this.jobService.getJobsByJob(jobid)
      .subscribe((res: any) => {
        console.log(res);
        this.job = res.value;
      });
  }
}
