import { SharedServices } from './../services/shared.services';
import { Component, OnInit } from '@angular/core';
import { BulkEmailSms } from '../models/bulkemailsms';
import swal from 'sweetalert2';

@Component({
    selector: 'BulkDataComponent',
    templateUrl: './bulkdata.component.html'
})

export class BulkDataComponent implements OnInit {
    newBulkEmailSms = new BulkEmailSms();
    errors = [];
    successMsg: string;

    constructor(public sharedservice: SharedServices) { }

    ngOnInit() {
        this.newBulkEmailSms.bulkUnsubscribe = true;
        this.newBulkEmailSms.notifyViaAlternateMethod = true;
    }

    submitBulkData() {
        this.errors = [];
        this.successMsg = null;
        this.sharedservice.bulkEmailSMSUpdate(this.newBulkEmailSms)
            .subscribe((res: any) => {
                console.log(res);
                if (res.succeeded) {
                    // swal('Success!',
                    //     'Bulk Emails / Mobile Numbers has been updated successfully.',
                    //     'success');

                    this.newBulkEmailSms = new BulkEmailSms();
                    this.newBulkEmailSms.bulkUnsubscribe = true;
                    this.newBulkEmailSms.notifyViaAlternateMethod = true;
                    this.successMsg = res.successMsg;
                }
                else {
                    this.errors = res.errors;
                }
            })
    }
}
