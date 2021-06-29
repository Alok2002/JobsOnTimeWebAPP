import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import swal from 'sweetalert2';

import { Respondent } from '../models/respondent';
import { RespondentServices } from '../services/respondent.services';

declare var jQuery: any;

@Component({
    selector: 'ResTechnologyComponent',
    templateUrl: './restechnology.component.html'
})

export class ResTechnologyComponent implements OnInit {
    @Input() resId: number;
    @Input() isMyProfile = false;

    isLoading = true;
    respondent: Respondent;

    portableDevicesList = [];
    technologyDevicesList = [];
    technologyUsedList = [];
    today = new Date();

    constructor(private respondentservice: RespondentServices,
        @Inject(PLATFORM_ID) public platformId: Object) { }

    ngOnInit() {
        if (this.resId) {
            this.respondentservice.getRespondentById(this.resId)
                .subscribe((res: any) => {
                    this.respondent = res.value;
                    console.log(this.respondent);
                })
        }
        else {
            this.respondent = new Respondent();
        }

        this.getData();
    }

    getData() {
        this.respondentservice.getRespondentData('TechnologyDevices', this.resId)
            .subscribe((res: any) => {
                this.technologyDevicesList = res.value;
                console.log(res);
            })
        this.respondentservice.getRespondentData('TechnologyUsed', this.resId)
            .subscribe((res: any) => {
                this.technologyUsedList = res.value;
                console.log(res);
            })
        this.respondentservice.getRespondentData('PortableDevices', this.resId)
            .subscribe((res: any) => {
                this.portableDevicesList = res.value;
                console.log(res);

                setTimeout(() => {
                    this.isLoading = false;
                }, 500);
            })
    }

    updateSubmit() {
        // this.respondentservice.updateRespondent(this.respondent)
        //   .subscribe(res => {
        //     console.log(res);

        //     if(res.succeeded)
        //     swal(
        //       'Successfully Saved!',
        //       '',
        //       'success'
        //     )
        //   })
        this.respondentservice.updateReferenceData('TechnologyDevices', this.technologyDevicesList, this.resId)
            .subscribe(res => {
                console.log(res);
            });

        this.respondentservice.updateReferenceData('TechnologyUsed', this.technologyUsedList, this.resId)
            .subscribe(res => {
                console.log(res);
            });

        this.respondentservice.updateReferenceData('PortableDevices', this.portableDevicesList, this.resId)
            .subscribe(res => {
                console.log(res);
            });

        this.respondentservice.updateRespondent(this.respondent)
            .subscribe((res: any) => {
                console.log(res);
                if (res.succeeded) {
                    swal(
                        'Successfully Saved!',
                        '',
                        'success'
                    );
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
                }
                this.respondent = res.value;
            });
    }

    gotoTop() {
        if (isPlatformBrowser(this.platformId)) {
            window.scrollTo(0, 0)
        }
    }
}
