import { SmsServices } from './../services/sms.services';
import { CookieService } from 'ngx-cookie-service';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import swal from 'sweetalert2';

import { Event } from '../models/event';
import { JobRespondent } from '../models/jobrespondent';
import { SessionTime } from '../models/sessiontime';
import { JobServices } from '../services/job.services';
import { SessionServices } from '../services/session.services';
import { SharedServices } from '../services/shared.services';
import { PtableColumn } from '../models/ptablecolumn';
import { ObjectUtils } from 'primeng/components/utils/objectutils';
import { LazyLoadEvent } from 'primeng/api';
import { RespondentServices } from '../services/respondent.services';
import { apiHost } from '../app.component';
import { EmailServices } from '../services/email.services';
import { Email } from '../models/email';
import { Sms } from '../models/sms';

declare var jQuery: any;

@Component({
  selector: 'SessionQualifiedRespondent',
  templateUrl: './sessionqualifiedrespondent.component.html',
})

export class SessionQualifiedRespondent implements OnInit {
  @Input() id: number;
  @Input() isUpdateSession: boolean;
  @Input() jobId: number;

  respondents: Array<JobRespondent>;

  isLoading = true;

  deleteItemIds = [];
  selected = [];

  saveQueryName: string;
  maxrecords: any = null;
  filters: any;
  @ViewChild("saveQueryBtn") saveQueryBtn;
  @ViewChild("saveQueryCancelBtn") saveQueryCancelBtn;
  isUpdateFiler = true;
  totalItems = 0;

  dataTablesParameters: any;
  isSelectAllItem = false;
  comment: string;
  inDepthTime: string;

  @ViewChild("commentModalBtn") commentModalBtn;
  @ViewChild("inDepthTimeModalBtn") inDepthTimeModalBtn;
  @ViewChild("incentiveModalBtn") incentiveModalBtn;
  @ViewChild("noteModalBtn") noteModalBtn;
  sessiontimes: Array<SessionTime> = [];

  isOverride = false;
  selectAllCheckbox = false;

  noofrows = 50;
  selectedColumns: Array<PtableColumn> = [];
  cols: Array<PtableColumn> = [];
  selectedRowData = [];
  ptablesearch: string;
  isShowFilter = true;
  totalRecords = 0;
  colVisData = [];

  incentives = [];
  incentive: any;
  isSubmitForm = false;

  note: string;
  token: string;
  apihost = apiHost;

  @ViewChild("emailModlaBtn") emailModlaBtn;
  emailData = new Email();
  emailModalTitle: string;
  emailEntity: string;

  smsData = new Sms();
  smsModalTitle: string;
  @ViewChild("smsModlaBtn") smsModlaBtn;

  constructor(private jobservice: JobServices, private sessionservice: SessionServices, private cookieservice: CookieService,
    private sharedService: SharedServices, private respondentservice: RespondentServices, private emailService: EmailServices,
    private smsServices: SmsServices) { }

  ngOnInit() {
    if (this.cookieservice.check('auth_token')) {
      this.token = this.cookieservice.get('auth_token');
    }
    this.getQualResbyId();
    this.getSessionTimes(this.id);
    this.getSessionIncentiveBySessionId(this.id);
  }

  getQualResbyId() {
    this.cols = [
      { field: 'resId', header: 'ID', index: 0, width: '75', sort: false },
      { field: 'respondentFullName', header: 'Name', index: 1, width: '150', sort: false },
      { field: 'respondentMobile', header: 'Mobile', index: 2, width: '100', sort: false },
      { field: 'respondentEmail', header: 'Email', index: 3, width: '250', sort: false },
      { field: 'confirmationEmailSentDate', header: 'Conf Email Sent', index: 4, width: '150', sort: false },
      { field: 'confirmationSMSSentDate', header: 'Conf SMS Sent', index: 5, width: '150', sort: false },
      { field: 'respondentConfirmed', header: 'Confirmed', index: 6, width: '150', sort: false },
      { field: 'confirmedBy', header: 'Confirmed By', index: 7, width: '150', sort: false },
      { field: 'paymentSent', header: 'Payment Sent', index: 8, width: '100', sort: false, textAlign: 'center' },
      { field: 'userFullName', header: 'User', index: 9, width: '150', sort: false },
      { field: 'eventDate', header: 'Event Date', index: 10, width: '150', sort: false },
      { field: 'eventDescription', header: 'Event', index: 11, width: '150', sort: false },
      { field: 'inDepthTime24Hours', header: 'In Depth Time', index: 12, width: '100', sort: true },
      { field: 'incentive', header: 'Incentive', index: 13, width: '250', sort: false },
      { field: 'attendeeDocumentComment', header: 'Attendee Doc Comment', index: 14, width: '150', sort: false },
      { field: 'eventNotes', header: 'Notes', index: 15, width: '350', sort: false }
    ];

    this.selectedColumns = this.cols;
  }

  loadData(event: LazyLoadEvent) {
    if (!event.sortField) { event.sortField = "inDepthTime24Hours" }
    if (!event.sortOrder) { event.sortOrder = -1 }
    console.log(event);
    this.sharedService.getDataWithFilter(event, this.colVisData, this.maxrecords, this.filters, "sessionQualifiedRespondents", this.id)
      .subscribe((resp: any) => {
        // debugger;
        this.respondents = resp.value;
        this.totalRecords = resp.totalCount;
        console.log(this.respondents);
      });
  }

  postEvent() {
    var event = new Event();
    event.resId = 130141;
    event.userName = "Ram";
    event.eventDescription = "PreQualified";
    event.jobId = this.jobId;

    console.log(event);
    this.sessionservice.postEvent(event)
      .subscribe((res) => {
        console.log(res);
      });
  }

  actionButtons(btn) {
    this.deleteItemIds = [];
    this.selectedRowData.forEach(rd => {
      this.deleteItemIds.push(rd.id);
    })

    if (this.deleteItemIds.length > 0) {

      /*this.jobService.allocateJobs(this.deleteItemIds)
        .subscribe(res => {*/
      switch (btn) {
        case 'Confirmed by Call':
          swal(
            'Confirmed!',
            'Selected item has been Confirmed by Call.',
            'success'
          );
          break;

        case 'Confirmed by SMS':
          swal(
            'Confirmed!',
            'Selected item has been Confirmed by SMS.',
            'success'
          );
          break;

        case 'Accepted by Call':
          swal(
            'Accepted!',
            'Selected item has been Accepted by Call.',
            'success'
          );
          break;

        case 'Accepted by SMS':
          swal(
            'Accepted!',
            'Selected item has been Accepted by SMS.',
            'success'
          );
          break;

        case 'Send Afterhours Contact':
          swal(
            'Sent!',
            'Selected item has been Sent Afterhours Contact.',
            'success'
          );
          break;

        case 'Unconfirmed':
          swal(
            'Unconfirmed!',
            'Selected item has been Unconfirmed.',
            'success'
          );
          break;

        default:
          break;
      }


      this.deleteItemIds = [];
      //this.getAllJobs();

      /*for (var i = 0; i < this.jobs.length; i++) {
        this.selected[i] = false;
      }
    });*/
      // result.dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
    }
    else {
      swal(
        'Oops...',
        'Please select an item',
        'info'
      );
    }
  }

  filterSubmit(res) {
    console.log(res);
    this.isLoading = true;
    this.maxrecords = res.maxrecords;

    this.filters = res.filters;
    this.loadData({ first: 0, rows: this.noofrows });
  }

  saveQuery() {
    this.isUpdateFiler = false;
    this.sharedService.saveQuery('auditlog', null, '', this.saveQueryName, this.filters)
      .subscribe((res: any) => {
        console.log(res);
        if (res.succeeded) {
          this.isUpdateFiler = true;
          this.saveQueryCancelBtn.nativeElement.click();
          /*swal('Successfully Saved!',
            '',
            'success');*/
        }
      })
  }

  filtersEmit(res) {
    console.log(res);
    this.filters = res;
  }

  openSaveQueryModal() {
    this.saveQueryName = "";
    if (this.filters && this.filters.length > 0) {
      this.saveQueryBtn.nativeElement.click()
    }
    else {
      swal(
        'Oops...',
        'Select at least one filter to save query.',
        'info'
      )
    }
  }

  openModal(modalname) {
    this.deleteItemIds = [];
    this.selectedRowData.forEach(rd => {
      this.deleteItemIds.push(rd.id);
    })

    if (this.deleteItemIds.length > 0) {
      if (modalname == 'attendee')
        this.commentModalBtn.nativeElement.click();
      if (modalname == 'indepthtime')
        this.inDepthTimeModalBtn.nativeElement.click();
      if (modalname == 'incentive')
        this.incentiveModalBtn.nativeElement.click();
      if (modalname == 'note')
        this.noteModalBtn.nativeElement.click();
    }
    else {
      swal(
        'Oops...',
        'Select at least one item.',
        'info'
      )
    }
  }

  saveAttendeeDocComment() {
    this.deleteItemIds = [];
    this.selectedRowData.forEach(rd => {
      this.deleteItemIds.push(rd.id);
    })

    if (this.deleteItemIds.length > 0) {
      this.sessionservice.saveAttendeeDocComment(this.deleteItemIds, this.comment)
        .subscribe((res: any) => {
          console.log(res);
          this.loadData({ first: 0, rows: this.noofrows });

          if (res.succeeded) {
            this.deleteItemIds = [];
            this.unCheckAllItems();
            this.commentModalBtn.nativeElement.click();
          }
        });
    }
    else {
      swal(
        'Oops...',
        'Please select an item first.',
        'info'
      )
    }
  }

  saveNote() {
    this.deleteItemIds = [];
    this.selectedRowData.forEach(rd => {
      this.deleteItemIds.push(rd.id);
    })

    if (this.deleteItemIds.length > 0) {
      this.sessionservice.saveNote(this.deleteItemIds, this.note)
        .subscribe((res: any) => {
          console.log(res);
          this.loadData({ first: 0, rows: this.noofrows });

          if (res.succeeded) {
            this.deleteItemIds = [];
            this.unCheckAllItems();
            this.noteModalBtn.nativeElement.click();
          }
        });
    }
    else {
      swal(
        'Oops...',
        'Please select an item first.',
        'info'
      )
    }
  }

  saveInDepthTime() {
    this.deleteItemIds = [];
    this.selectedRowData.forEach(rd => {
      this.deleteItemIds.push(rd.id);
    })

    console.log(this.inDepthTime.toString());
    if (this.deleteItemIds.length > 0) {
      this.sessionservice.saveInDepthTime(this.deleteItemIds, this.inDepthTime)
        .subscribe((res: any) => {
          console.log(res);
          this.loadData({ first: 0, rows: this.noofrows });

          if (res.succeeded) {
            this.deleteItemIds = [];
            this.unCheckAllItems();
            this.inDepthTimeModalBtn.nativeElement.click();
          }
        });
    }
    else {
      swal(
        'Oops...',
        'Please select an item first.',
        'info'
      )
    }
  }

  confirmationAttendance() {
    this.deleteItemIds = [];
    this.selectedRowData.forEach(rd => {
      this.deleteItemIds.push(rd.id);
    })

    //if(this.checkPermission()){
    if (this.deleteItemIds.length > 0) {
      this.sessionservice.confirmAttendance(this.deleteItemIds)
        .subscribe((res: any) => {
          console.log(res);
          this.loadData({ first: 0, rows: this.noofrows });

          if (res.succeeded) {
            this.deleteItemIds = [];
            this.unCheckAllItems();

            swal(
              'Confirmed!',
              'Selected item has been Confirmed.',
              'success'
            );
          }
        });
    }
    else {
      swal(
        'Oops...',
        'Please select an item to confirm attendance.',
        'info'
      )
    }
  }

  unConfirmationAttendance() {
    this.deleteItemIds = [];
    this.selectedRowData.forEach(rd => {
      this.deleteItemIds.push(rd.id);
    })
    //if(this.checkPermission()){
    if (this.deleteItemIds.length > 0) {
      this.sessionservice.unConfirmAttendance(this.deleteItemIds)
        .subscribe((res: any) => {
          console.log(res);
          this.loadData({ first: 0, rows: this.noofrows });

          if (res.succeeded) {
            this.deleteItemIds = [];
            this.unCheckAllItems();

            swal(
              'Unconfirmed!',
              'Selected item has been Unconfirmed.',
              'success'
            );
          }
        });
    }
    else {
      swal(
        'Oops...',
        'Please select an item to Unconfirm attendance.',
        'info'
      )
    }
  }

  recordPayment() {
    this.deleteItemIds = [];
    this.selectedRowData.forEach(rd => {
      this.deleteItemIds.push(rd.id);
    })

    //if(this.checkPermission()){
    if (this.deleteItemIds.length > 0) {
      this.sessionservice.recordPayment(this.deleteItemIds, this.jobId, this.id)
        .subscribe((res: any) => {
          console.log(res);
          this.loadData({ first: 0, rows: this.noofrows });
          if (res.succeeded) {
            this.deleteItemIds = [];
            this.unCheckAllItems();

            swal(
              'Record Payment!',
              'Selected item has been record payment.',
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
        });
    }
    else {
      swal(
        'Oops...',
        'Please select an item to Record Payment.',
        'info'
      )
    }
  }

  cancelPayment() {
    this.deleteItemIds = [];
    this.selectedRowData.forEach(rd => {
      this.deleteItemIds.push(rd.id);
    })

    //if(this.checkPermission()){
    if (this.deleteItemIds.length > 0) {
      this.sessionservice.cancelPayment(this.deleteItemIds, this.jobId, this.id)
        .subscribe((res: any) => {
          console.log(res);
          this.loadData({ first: 0, rows: this.noofrows });
          if (res.succeeded) {
            this.deleteItemIds = [];
            this.unCheckAllItems();

            swal(
              'Cancel Payment!',
              'Selected item has been cancel payment.',
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
        });
    }
    else {
      swal(
        'Oops...',
        'Please select an item to Cancel Payment.',
        'info'
      )
    }
  }

  unCheckAllItems() {
    this.deleteItemIds = [];
    this.selectedRowData = [];
  }

  getSessionTimes(id) {
    this.sessionservice.getSessionTimesBySessionId(id)
      .subscribe((res: any) => {
        console.log(res);
        this.sessiontimes = res.value;
      })
  }

  getSessionIncentiveBySessionId(id) {
    this.sessionservice.getIncentiveListForGroup(id)
      .subscribe((res: any) => {
        this.incentives = res.value;
        console.log(this.incentives);
      })
  }

  updateSelectedColumnsIndex() {
    this.selectedColumns.sort((a, b) => {
      if (a.index > b.index) return 1;
      if (a.index < b.index) return -1;
      return 0;
    })
  }

  resolveFieldData(data, field) {
    return ObjectUtils.resolveFieldData(data, field);
  }

  saveIncentive(form) {
    this.isSubmitForm = true;
    if (form.valid) {
      this.sessionservice.saveIncentive(this.deleteItemIds, this.incentive)
        .subscribe((res: any) => {
          this.isSubmitForm = false;
          this.loadData({ first: 0, rows: this.noofrows });

          if (res.succeeded) {
            this.deleteItemIds = [];
            this.unCheckAllItems();
            this.incentiveModalBtn.nativeElement.click();
          }
        })
    }
  }

  deleteJobs() {
    this.deleteItemIds = [];
    this.selectedRowData.forEach(rd => {
      this.deleteItemIds.push(rd.id);
    })

    //if(this.checkPermission()){
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
          this.respondentservice.deleteResJobs(this.deleteItemIds)
            .subscribe((res: any) => {
              console.log(res);

              if (res.succeeded) {
                this.deleteItemIds = [];
                //this.getAllClients();
                this.loadData({ first: 0, rows: this.noofrows });

                for (var i = 0; i < this.respondents.length; i++) {
                  this.selected[i] = false;
                }
                swal(
                  'Deleted!',
                  'Selected item has been deleted.',
                  'success'
                )
              } else {
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
            });
          // result.dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
        } else if (result.dismiss === swal.DismissReason.cancel) {
          swal(
            'Cancelled',
            'Selected item is safe :)',
            'error'
          )
        }
      });
    }
    else {
      swal(
        'Oops...',
        'Please select an item to delete.',
        'info'
      )
    }
    /*}*/
  }

  //Send confirmation email
  getConfirmationEmailData() {
    this.deleteItemIds = [];
    this.selectedRowData.forEach(rd => {
      this.deleteItemIds.push(rd.resId);
    })

    if (this.deleteItemIds.length > 0) {
      var err = [];
      this.deleteItemIds.forEach(id => {
        var index = this.respondents.findIndex((res) => res.id == id);
        if (index >= 0) {
          if (!this.respondents[index].respondentEmail)
            err.push(this.respondents[index].respondentFullName + ' email address missing.');
        }
      });
      if (err.length == 0) {
        this.emailService.createSessionConfirmationResIdsEmail(this.deleteItemIds, this.id)
          .subscribe((res: any) => {
            console.log(res)
            if (res.succeeded) {
              this.deleteItemIds = [];
              this.emailData = res.value;
              this.emailEntity = "CreateSessionConfirmationEmail";
              console.log(this.emailData);
              setTimeout(() => {
                this.emailModlaBtn.nativeElement.click();
              }, 1000)
            } else {
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
          })
      } else {
        swal(
          'Error!',
          err.join('. '),
          'error'
        )
      }
    } else {
      swal(
        'Oops...',
        'Please select an item to send confirmation email.',
        'info'
      )
    }
  }

  //Send Confirmation SMS
  getConfirmationSmsData() {
    this.deleteItemIds = [];
    this.selectedRowData.forEach(rd => {
      this.deleteItemIds.push(rd.resId);
    })

    if (this.deleteItemIds.length > 0) {
      var err = [];
      this.deleteItemIds.forEach(id => {
        var index = this.respondents.findIndex((res) => res.id == id);
        if (index >= 0) {
          if (!this.respondents[index].respondentMobile)
            err.push(this.respondents[index].respondentFullName + ' mobile number missing.');
        }
      });
      if (err.length == 0) {
        this.smsServices.getResIdsSmsData(this.deleteItemIds, this.id)
          .subscribe((res: any) => {
            console.log(res)
            if (res.succeeded) {
              this.deleteItemIds = [];
              this.smsData = res.value;
              this.smsModalTitle = "Confirmation SMS";
              console.log(this.emailData);
              setTimeout(() => {
                this.smsModlaBtn.nativeElement.click();
              }, 1000)
            } else {
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
          })
      } else {
        swal(
          'Error!',
          err.join('. '),
          'error'
        )
      }
    } else {
      swal(
        'Oops...',
        'Please select an item to send confirmation SMS.',
        'info'
      )
    }
  }
}
