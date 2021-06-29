import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { JobQuota } from '../models/jobquota';
import { ClientServices } from '../services/client.services';
import { JobServices } from '../services/job.services';
import { SharedServices } from '../services/shared.services';

@Component({
  selector: 'QuotaModalComponent',
  templateUrl: './quotamodal.component.html',
})

export class QuotaModalComponent implements OnInit, OnChanges {
  isSubmitForm = false;
  isSubmitFormSpinner = false;
  @Input() jobId: number;
  @Input() jobQuota: JobQuota;
  @ViewChild("closeAddNewModal") closeAddNewModal;
  
  @Output() response = new EventEmitter();
  isLoading = true;

  constructor(private clientSevice: ClientServices,
    private sharedService: SharedServices, private jobservice: JobServices) { }

  ngOnInit() {
    if (this.jobQuota == null) {
      this.addNew();
    } else {
      this.isLoading = false;
    }
    console.log(this.jobQuota);
  }

  ngOnChanges() {
    this.isLoading = true;
    this.ngOnInit();
  }

  addNew() {
    this.jobQuota = new JobQuota();
    this.isLoading = false;
  }

  submitQuota(form) {
    this.isSubmitForm = true;
    this.isSubmitFormSpinner = true;
    if (form.invalid) {
      //this.isSubmitForm = false;
      this.isSubmitFormSpinner = false;
    } else {
      this.jobQuota.jobId = this.jobId;
      this.jobservice.updateJobQuota(this.jobQuota)
        .subscribe((res: any) => {
          this.isSubmitFormSpinner = false;
          this.isSubmitForm = false;

          if (res.succeeded) {
            this.closeAddNewModal.nativeElement.click();
            //this.router.navigate(['/client']);
          }

          this.response.emit(res);
        });
    }
  }
}
