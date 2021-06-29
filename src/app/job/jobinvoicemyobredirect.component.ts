import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

import { ClientServices } from '../services/client.services';
import { JobServices } from '../services/job.services';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SharedServices } from '../services/shared.services';
import { UserServices } from '../services/user.services';
import swal from 'sweetalert2';

@Component({
  selector: 'JobInvoiceMyObRedirectComponent',
  templateUrl: './jobinvoicemyobredirect.component.html'
})

export class JobInvoiceMyObRedirectComponent implements OnInit {
  errorList = [];
  jobId: string; 

  constructor(private jobsevice: JobServices, private userService: UserServices, private cookieservice: CookieService,
    private clientservice: ClientServices, private sharedservice: SharedServices, private securityInfoResolve: SecurityInfoResolve,
    private activatedRoute: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      var code = decodeURIComponent(params['code']);
      var state = decodeURIComponent(params['state']);
      this.jobId = state;
      this.jobsevice.myObPostInvoice(code, state)
        .subscribe((res: any) => {          
          if (res.succeeded) {
            this.router.navigate(['/job/edit', state, 'jobinvoice']);
          }
          else {
            /*var err = "";
            res.errors.forEach((er) => {
              err = err + " " + er;
            });
            swal(
              'Error!',
              err,
              'error'
            )*/
            this.errorList = res.errors;
          }
        })
    })
  }
}
