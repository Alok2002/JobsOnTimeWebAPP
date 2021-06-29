import { Component, Input, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { RespondentServices } from '../services/respondent.services';

declare var jQuery: any;

@Component({
    selector: 'ResLoyalteeComponent',
    templateUrl: './resloyaltee.component.html'
})

export class ResLoyalteeComponent implements OnInit {
    @Input() resId: number;
    @Input() isMyProfile = false;

    frequentflyers = [];

    constructor(private resService: RespondentServices) {
    }

    ngOnInit() {
        this.getRespFrequentflyers();
    }

    getRespFrequentflyers() {
        this.resService.getRespondentData('frequentflyer', this.resId)
            .subscribe((res: any) => {
                console.log(res);
                this.frequentflyers = res.value;
            });
    }

    updateFreqFlyersDetails(index: number, e) {
        if (e.target.checked) {
            this.frequentflyers[index].selected = true;
        }
        else {
            this.frequentflyers[index].selected = false;
        }
        console.log(this.frequentflyers);
    }

    updateSubmit() {
        this.resService.updateReferenceData('frequentflyer', this.frequentflyers, this.resId)
            .subscribe((res: any) => {
                console.log(res);

                if (res.succeeded)
                    swal(
                        'Successfully Saved!',
                        '',
                        'success'
                    )
            })
    }
}
