import { RespondentServices } from '../services/respondent.services';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
declare var jQuery: any;
import swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { Respondent } from '../models/respondent';

@Component({
    selector: 'NewRespondentComponent',
    templateUrl: './newrespondent.component.html',
    styles: ['.nav.tabs-vertical > li > a {line-height: 40px}']
})

export class NewRespondentComponent implements OnInit {
    selectTab = 'contact';
    resId: number;
    respondent: Respondent;
    @Input() inputResId: number;

    constructor(private activateroute: ActivatedRoute, private respondentservice: RespondentServices) {
    }

    ngOnInit() {
        if (this.inputResId)
            this.resId = this.inputResId;
        else {
            this.activateroute.params.subscribe(params => {
                if (params['resid']) {
                    this.selectTab = null;
                    this.resId = params['resid'];
                    this.getRespondentById();                    
                    setTimeout(() => {
                        this.selectTab = 'jobs';
                    }, 1000) 
                }
                else {
                    this.respondent = new Respondent();
                    this.resId = 0;
                    this.getRespondentById();
                    this.selectTab = 'contact';
                }
            });
        }
    }

    getRespondentById() {
        this.respondentservice.getRespondentById(this.resId)
            .subscribe((res: any) => {
                this.respondent = res.value;
            });
    }
}
