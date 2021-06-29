import { MetaService } from '@ngx-meta/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

import { UserServices } from '../services/user.services';
import { SharedServices } from './../services/shared.services';
import { pageTile } from '../app.component';

@Component({
    selector: 'ResetPassComponent',
    templateUrl: './resetpass.component.html',
    styleUrls: ['../../assets/css/disability.css']
})

export class ResetPassComponent implements OnInit {
    emailAddress: string;
    isSubmitForm = false;
    isDuplicateUser = false;
    firstName: string;
    lastName: string;
    error: string;
    role: string;
    isFarronResearch = false;

    constructor(private userservice: UserServices, private activatedRoute: ActivatedRoute,
        private sharedservice: SharedServices, private metaservice: MetaService) {
        this.activatedRoute.data.subscribe(data => {
            this.metaservice.setTitle(data.pagetitle + " - " + pageTile, true);
        });
    }

    ngOnInit() {
        this.getIsFarronResearch();
        this.activatedRoute.params.subscribe(params => {
            if (params['role']) {
                this.role = params['role'];
            }
        });
    }

    resetPassword(form) {
        this.error = null;
        this.isSubmitForm = true;
        if (form.invalid) {
            //this.isSubmitForm = false;
        } else {
            this.userservice.forgotPassword(this.emailAddress, this.firstName, this.lastName, this.role)
                .subscribe((res: any) => {
                    this.isSubmitForm = false;
                    console.log(res);
                    if (!res.value) {
                        /*swal('Oops...',
                          res.errors[0],
                          'error'
                        );*/
                        this.error = res.errors[0];
                    } else {
                        swal(
                            res.successMsg,
                            '',
                            'success'
                        );
                        this.clearForm();
                    }
                });
        }
    }

    clearForm() {
        this.emailAddress = null;
        this.firstName = null;
        this.lastName = null;
    }

    checkDuplicateUser() {
        if(this.emailAddress && this.emailAddress.length > 3) {
            this.userservice.checkDuplicateUser(this.emailAddress)
            .subscribe((res: any) => {
                console.log(res);
                this.isDuplicateUser = res;
            });
        }        
    }

    getIsFarronResearch() {
        this.sharedservice.getIsFarronResearch()
            .subscribe((res: any) => {
                this.isFarronResearch = res.value;
            })
    }
}