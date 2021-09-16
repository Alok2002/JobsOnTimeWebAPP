import { Component, OnInit } from '@angular/core';
import { SharedServices } from '../services/shared.services';
import { environment } from './../../environments/environment';

@Component({
    selector: 'FooterComponent',
    templateUrl: './footer.component.html'
})

export class FooterComponent implements OnInit {
    year = new Date().getFullYear();
    apiVersion: string;
    appVersion: string = environment.appVersion;
    
    constructor(private sharedServices: SharedServices) { }

    ngOnInit() {
        this.getApiVersion();
    }

    getApiVersion() {
        this.sharedServices.getApiVersion()
        	.subscribe((res: any) => {
        		console.log(res);
                this.apiVersion = res.value;
        	})
    }
}