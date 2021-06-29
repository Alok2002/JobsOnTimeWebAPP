import { JobServices } from './../services/job.services';
import { Duration } from './../models/duration';
import { Component, OnInit, Input, ViewChild, ViewContainerRef } from '@angular/core';
declare var jQuery: any;
import swal from 'sweetalert2';
import * as moment from 'moment';

@Component({
    selector: 'JobDurationComponent',
    templateUrl: './jobduration.component.html'
})

export class JobDurationComponent implements OnInit {
    @Input() id: number;
    @Input() isUpdateJob: boolean;

    duration = new Duration();
    durations: Array<Duration> = [];
    deleteItemIds = [];

    @ViewChild('closeAddNewModal') closeAddNewModal;
    @ViewChild('checkBox') checkBox;

    selected = [];
    isSubmitForm = false;
    isSubmitFormSpinner = false;
    isLoading = true;

    @ViewChild('container', { read: ViewContainerRef })
    public containerRef: ViewContainerRef;

    constructor(private jobservices: JobServices) { }

    ngOnInit() {
        this.getDurations(this.id);
    }

    ngAfterViewInit() {
        /*jQuery('#add-new-address-modal').on('shown.bs.modal', function () {
          jQuery('#phone').focus();
        });*/
    }

    addNew() {
        this.duration = new Duration();
    }

    getDurations(id) {
        this.jobservices.getDurationsByJobId(id)
            .subscribe((res: any) => {
                console.log(res);
                this.durations = res.value;
                this.getDurations(this.id);
                this.isLoading = false;
            })
    }

    deleteDurations() {
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
                    this.jobservices.deleteDurations(this.deleteItemIds)
                        .subscribe((res: any) => {

                            if (res.succeeded) {
                                this.deleteItemIds = [];
                                this.getDurations(this.id);

                                for (var i = 0; i < this.durations.length; i++) {
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
            this.duration.clientJobId = this.id;

            if (this.duration.durations) {
                var groupTime = moment(this.duration.durations, "YYYY-MM-DD");
                this.duration.durations = groupTime.format("hh:mm:ss a");
            }

            this.jobservices.updateDurations(this.duration, this.id)
                .subscribe((res: any) => {
                    this.isSubmitFormSpinner = false;
                    this.isSubmitForm = false;
                    if (res.succeeded) {
                        this.closeAddNewModal.nativeElement.click();
                        //this.router.navigate(['/client']);
                        this.getDurations(this.id);
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
        this.durations.forEach((item) => {
            if (item.id == id) {
                this.duration = item;
                if (this.duration.durations)
                    this.duration.durations = moment(this.duration.durations).toDate();
            }
        });
    }

    exporttoExcel() {

    }
}