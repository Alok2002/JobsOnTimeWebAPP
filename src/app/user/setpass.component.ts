import { MetaService } from '@ngx-meta/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';

import { UserServices } from '../services/user.services';
import { SharedServices } from './../services/shared.services';
import { pageTile, passwordPattern } from '../app.component';

@Component({
    selector: 'SetPassComponent',
    templateUrl: './setpass.component.html'
})

export class SetPassComponent implements OnInit {
    newpassword: string;
    confirmnewpassword: string;
    isSubmitForm = false;
    error: string;
    encrypt: string;
    confrimpwderror: string;
    role: string;
    pattern: string;
    minlength: number = 6;
    isFarronResearch = false;

    constructor(private userservice: UserServices, private activateroute: ActivatedRoute, private metaservice: MetaService,
        private router: Router, private sharedservice: SharedServices) {
        this.activateroute.data.subscribe(data => {
            this.metaservice.setTitle(data.pagetitle + " - " + pageTile, true);
        });
    }

    ngOnInit() {
        this.getIsFarronResearch();
        this.activateroute.params.subscribe(params => {
            if (params['encrypt']) {
                this.encrypt = params['encrypt'];
            }
            if (params['role']) {
                this.role = params['role'];
                //if (this.role != 'Respondent') {                    
                    // this.pattern = "(?=.*[@#$%*(!)~^&])(?=.*[A-Z]).*";
                    this.pattern = passwordPattern;
                    this.minlength = 8;
                //}
            }
        });
    }

    setPassword(form) {
        this.isSubmitForm = true;
        this.confrimpwderror = null;
        if (this.confirmnewpassword == this.newpassword && !form.invalid) {
            this.userservice.setPassword(this.newpassword, this.encrypt, this.role)
                .subscribe((res: any) => {
                    console.log(res);
                    this.isSubmitForm = false;
                    this.newpassword = null;
                    this.confirmnewpassword = null;
                    if (!res.value) {
                        /*swal('Oops...',
                          res.errors[0],
                          'error'
                        );*/
                        this.error = res.errors[0];
                    } else {
                        swal(
                            'Password has been set successfully!',
                            '',
                            'success'
                        );
                        this.router.navigate(["/"]);
                    }
                })
        }
        else if (this.confirmnewpassword != this.newpassword) {
            this.confrimpwderror = "Invalid confirm password";
        }
        console.log(form);
    }

    confirmnewpasswordvalidation() {
        if (this.confirmnewpassword == this.newpassword) this.confrimpwderror = null;
        else if (this.isSubmitForm) this.confrimpwderror = "Invalid confirm password";
        else this.confrimpwderror = null;
    }

    getIsFarronResearch() {
        this.sharedservice.getIsFarronResearch()
            .subscribe((res: any) => {
                this.isFarronResearch = res.value;
            })
    }
}