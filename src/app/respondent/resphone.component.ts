import { Component, Input, OnInit } from '@angular/core';
import swal from 'sweetalert2';

import { Respondent } from '../models/respondent';
import { RespondentServices } from '../services/respondent.services';

declare var jQuery: any;

@Component({
    selector: 'ResPhoneComponent',
    templateUrl: './resphone.component.html'
})

export class ResPhoneComponent implements OnInit {
    @Input() resId: number;
    @Input() isMyProfile = false;

    tvprovider = [];
    phoneproviders = [];
    internettypelist = [];
    internetproviders = [];

    isLoading = true;
    respondent: Respondent;

    constructor(private resService: RespondentServices) {
    }

    ngOnInit() {
        this.gettvprovider();
        this.getphoneproviders();
        this.getinternettypelist();
        this.getinternetproviders();

        if(this.resId){
            this.resService.getRespondentById(this.resId)
              .subscribe((res: any) => {
                this.respondent = res.value;
                this.isLoading = false;
              })
          }
          else{
            this.respondent = new Respondent();
            this.isLoading = false;
          }
    }

    gettvprovider() {
        this.resService.getRespondentData('tvprovider', this.resId)
            .subscribe((res: any) => {
                console.log(res);
                this.tvprovider = res.value;
            });
    }

    updatetvprovider(index: number, e) {
        if (e.target.checked) {
            this.tvprovider[index].selected = true;
        }
        else {
            this.tvprovider[index].selected = false;
        }
        console.log(this.tvprovider);
    }

    getphoneproviders() {
        this.resService.getRespondentData('phoneproviders', this.resId)
            .subscribe((res: any) => {
                console.log(res);
                this.phoneproviders = res.value;
            });
    }

    updatephoneproviders(index: number, e) {
        if (e.target.checked) {
            this.phoneproviders[index].selected = true;
        }
        else {
            this.phoneproviders[index].selected = false;
        }
        console.log(this.phoneproviders);
    }

    getinternetproviders() {
        this.resService.getRespondentData('internetproviders', this.resId)
            .subscribe((res: any) => {
                console.log(res);
                this.internetproviders = res.value;
            });
    }

    updateinternetproviders(index: number, e) {
        if (e.target.checked) {
            this.internetproviders[index].selected = true;
        }
        else {
            this.internetproviders[index].selected = false;
        }
        console.log(this.internetproviders);
    }

    getinternettypelist() {
        this.resService.getInternetTypeList()
            .subscribe((res: any) => {
                console.log(res);
                this.internettypelist = res.value;
            })
    }

    updateinternettypelist(i, $event) {

    }

    updateSubmit() {
        this.resService.updateReferenceData('tvprovider', this.tvprovider, this.resId)
            .subscribe(res => {
                console.log(res);
            })

        this.resService.updateReferenceData('internetproviders', this.internetproviders, this.resId)
            .subscribe(res => {
                console.log(res);
            })

        this.resService.updateReferenceData('phoneproviders', this.phoneproviders, this.resId)
            .subscribe((res: any) => {
                console.log(res);

                if(res.succeeded)
                swal(
                  'Successfully Saved!',
                  '',
                  'success'
                )
            })
    }
}
