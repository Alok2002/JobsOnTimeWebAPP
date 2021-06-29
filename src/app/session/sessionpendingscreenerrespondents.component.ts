import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import swal from 'sweetalert2';

import { JobRespondent } from '../models/jobrespondent';
import { JobServices } from '../services/job.services';
import { SessionServices } from '../services/session.services';
import { SharedServices } from '../services/shared.services';
import { LazyLoadEvent } from 'primeng/api';
import { PtableColumn } from '../models/ptablecolumn';
import { ObjectUtils } from 'primeng/components/utils/objectutils';
import { RespondentServices } from '../services/respondent.services';

declare var jQuery: any;

@Component({
  selector: 'SessionPendingScreenerRespondents',
  templateUrl: './sessionpendingscreenerrespondents.component.html',
})

export class SessionPendingScreenerRespondents implements OnInit {
  @Input() id: number;
  @Input() isUpdateSession: boolean;
  @Input() jobId: number;

  respondents: Array<JobRespondent>;

  isLoading = true;

  saveQueryName: string;
  maxrecords: any = null;
  filters: any;
  @ViewChild('saveQueryBtn') saveQueryBtn;
  @ViewChild('saveQueryCancelBtn') saveQueryCancelBtn;
  @ViewChild("noteModalBtn") noteModalBtn;
  isUpdateFiler = true;

  totalItems = 0;

  dataTablesParameters: any;

  noofrows = 50;
  selectedColumns: Array<PtableColumn> = [];
  cols: Array<PtableColumn> = [];
  selectedRowData = [];
  ptablesearch: string;
  isShowFilter = true;
  totalRecords = 0;
  colVisData = [];
  deleteItemIds = [];
  selected = [];
  note: string;

  constructor(private jobservice: JobServices, private sessionservice: SessionServices, 
    public sharedService: SharedServices, private respondentservice: RespondentServices) {
  }

  ngOnInit() {
    this.getStandbyId();
  }

  getStandbyId() {
    this.cols = [
      { field: 'id', header: 'ID', index: 0, width: '75', sort: false },
      { field: 'respondentFullName', header: 'Name', index: 1, width: '200', sort: false },
      { field: 'userFullName', header: 'User', index: 2, width: '150', sort: false },
      { field: 'eventDate', header: 'Event Date', index: 3, width: '150', sort: false },
      { field: 'eventDescription', header: 'Event', index: 4, width: '150', sort: false },
      { field: 'inDepthTime', header: 'In Depth Time', index: 5, width: '100', sort: false },
      { field: 'eventNotes', header: 'Notes', index: 6, width: 'auto', sort: false },
      { field: 'respondentConfirmed', header: 'Confirmed', index: 7, width: '150', sort: false }
    ];

    this.selectedColumns = this.cols;
  }

  loadData(event: LazyLoadEvent) {
    if (!event.sortField) { event.sortField = "eventDate" }
    if (!event.sortOrder) { event.sortOrder = -1 }

    console.log(event);
    this.sharedService.getDataWithFilter(event, this.colVisData, this.maxrecords, this.filters, 'sessionPotentialRespondents', this.id)
      .subscribe((resp: any) => {
        // debugger;
        this.respondents = resp.value;
        this.totalRecords = resp.totalCount;
        console.log(this.respondents);
      });
  }

  filterSubmit(res) {
    console.log(res);
    this.filters = res.filters;
    this.maxrecords = res.maxrecords;

    this.loadData({ first: 0, rows: this.noofrows });
  }

  saveQuery() {
    this.isUpdateFiler = false;
    this.sharedService.saveQuery('sessionPotentialRespondents', null, '', this.saveQueryName, this.filters)
      .subscribe((res: any) => {
        console.log(res);
        if (res.succeeded) {
          this.isUpdateFiler = true;
          this.saveQueryCancelBtn.nativeElement.click();
          /*swal('Successfully Saved!',
            '',
            'success');*/
        }
      });
  }

  filtersEmit(res) {
    console.log(res);
    this.filters = res;
  }

  openSaveQueryModal() {
    this.saveQueryName = '';
    if (this.filters && this.filters.length > 0) {
      this.saveQueryBtn.nativeElement.click();
    }
    else {
      swal(
        'Oops...',
        'Select at least one filter to save query.',
        'info'
      );
    }
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

  openModal(modalname) {
    this.deleteItemIds = [];
    this.selectedRowData.forEach(rd => {
      this.deleteItemIds.push(rd.id);
    })

    if (this.deleteItemIds.length > 0) {
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

  unCheckAllItems() {
    this.deleteItemIds = [];
    this.selectedRowData = [];
  }
}
