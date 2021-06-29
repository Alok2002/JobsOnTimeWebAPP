import { Component, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import * as moment from 'moment';
import { Subject } from 'rxjs/Subject';
import swal from 'sweetalert2';

import { SessionTime } from '../models/sessiontime';
import { SessionServices } from './../services/session.services';

declare var jQuery: any;

@Component({
    selector: 'SessionTimeComponent',
    templateUrl: './sessiontime.component.html'
})

export class SessionTimeComponent implements OnInit {
    @Input() id: number;
    @Input() isUpdateSession: boolean;

    sessiontime = new SessionTime();
    sessiontimes: Array<SessionTime> = [];

    deleteItemIds = [];

    @ViewChild('closeAddNewModal') closeAddNewModal;
    @ViewChild('checkBox') checkBox;

    selected = [];
    isSubmitForm = false;
    isSubmitFormSpinner = false;
    isLoading = true;

    @ViewChild('container', { read: ViewContainerRef })
    public containerRef: ViewContainerRef;

    constructor(private sessionsevice: SessionServices) { }

    ngOnInit() {
        this.getSessionTimes(this.id);
    }

    ngAfterViewInit() {
    }

    addNew() {
        this.sessiontime = new SessionTime();
    }

    getSessionTimes(id) {
        this.sessionsevice.getSessionTimesBySessionId(id)
            .subscribe((res: any) => {
                console.log(res);
                this.sessiontimes = res.value;
            })
    }

    deleteSessionTime() {
        //if (this.checkPermission()) {
        if (this.deleteItemIds.length > 0) {
            swal({
                title: 'Are you sure?',
                text: 'You will not be able to recover this item!',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                confirmButtonColor: '#ffaa00',
                cancelButtonText: 'No, keep it'
            }).then((result) => {
                if (result.value) {
                    this.sessionsevice.deleteSessionTime(this.deleteItemIds)
                        .subscribe((res: any) => {
                            if (res.succeeded) {
                                this.deleteItemIds = [];
                                this.getSessionTimes(this.id);

                                for (var i = 0; i < this.sessiontimes.length; i++) {
                                    this.selected[i] = false;
                                }
                                swal(
                                    'Deleted!',
                                    'Selected item has been deleted.',
                                    'success'
                                );
                            } else {
                                var err = '';
                                res.errors.forEach((er) => {
                                    err = err + ' ' + er;
                                });
                                swal(
                                    'Error!',
                                    err,
                                    'error'
                                );
                            }
                        });
                    // result.dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
                } else if (result.dismiss === swal.DismissReason.cancel) {
                    swal(
                        'Cancelled',
                        'Selected item is safe :)',
                        'error'
                    );
                }
            });
        }
        else {
            swal(
                'Oops...',
                'Please select an item to delete.',
                'info'
            );
        }
        //}
    }

    submitSessionTime(form) {
        this.isSubmitForm = true;
        this.isSubmitFormSpinner = true;
        if (form.invalid) {
            //this.isSubmitForm = false;
            this.isSubmitFormSpinner = false;
        }
        else {
            this.sessiontime.clientJobGroupId = this.id;

            if (this.sessiontime.groupTime) {
                var groupTime = moment(this.sessiontime.groupTime, "YYYY-MM-DD");
                this.sessiontime.groupTime = groupTime.format("hh:mm:ss a");
            }

            this.sessionsevice.updateSessionTime(this.sessiontime)
                .subscribe((res: any) => {
                    this.isSubmitFormSpinner = false;
                    this.isSubmitForm = false;
                    if (res.succeeded) {
                        this.closeAddNewModal.nativeElement.click();
                        //this.router.navigate(['/client']);
                        this.getSessionTimes(this.id);
                    }
                });
        }
    }

    updateDeleteList(id: number, e) {
        if (e.target.checked) {
            this.deleteItemIds.push(id);
        }
        else {
            this.deleteItemIds.forEach((di, i) => {
                if (di == id) {
                    this.deleteItemIds.splice(i, 1);
                }
            });
        }
    }

    editSessionTime(id) {
        this.sessiontimes.forEach((item) => {
            if (item.id == id) {
                this.sessiontime = item;

                if (this.sessiontime.groupTime)
                    this.sessiontime.groupTime = moment(this.sessiontime.groupTime).toDate();
            }
        });
    }

    exporttoExcel() {

    }
}