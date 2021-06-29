import { SharedServices } from './../services/shared.services';
import { SurveyServices } from './../services/survey.services';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import swal from 'sweetalert2';
import { UserServices } from '../services/user.services';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'surveythankyoucomponent',
    templateUrl: './surveythankyou.component.html'
})

export class SurveyThankYouComponent {
    jid: number = 0;
    eid: number = 0;
    sid: number = 0;
    rid: number = 0;
    isFarronResearch = false;
    thankyoupagesign: string;

    constructor(private surveyservices: SurveyServices, private activatedroute: ActivatedRoute,
        private sharedService: SharedServices, @Inject(PLATFORM_ID) public platformId: Object) { }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.getIsFarronResearch();
            this.activatedroute.queryParams
                .subscribe(params => {
                    if (params['jid'])
                        this.jid = params['jid'];
                    if (params['eid'])
                        this.eid = params['eid'];
                    if (params['sid'])
                        this.sid = params['sid'];
                    if (params['rid'])
                        this.rid = params['rid'];
                })

            this.surveyservices.postsurveythankyou(this.jid, this.eid, this.sid, this.rid)
                .subscribe(res => {
                    console.log(res)
                })
        }
        this.getThankYouPageSign();
    }

    getIsFarronResearch() {
        this.sharedService.getIsFarronResearch()
            .subscribe((res: any) => {
                this.isFarronResearch = res.value;
            })
    }

    getThankYouPageSign() {
        this.surveyservices.getThankYouPageSign()
            .subscribe((res: any) => {
                console.log(res)
                if (res.value && res.value.value)
                    this.thankyoupagesign = res.value.value;
            })
    }
}