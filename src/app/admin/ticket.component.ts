import { SharedServices } from './../services/shared.services';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import { saveAs } from 'file-saver';
import swal from 'sweetalert2';
import { Ticket } from '../models/ticket';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SecurityRights, SecurityRightsExportError } from '../shared/enum';
import { TicketServices } from '../services/ticket.services';
import { PtableColumn } from '../models/ptablecolumn';
import { timeMask } from '../app.component';
import { LazyLoadEvent } from 'primeng/api';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'TicketComponent',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})

export class TicketComponent implements OnInit {
  ticket: Ticket;
  tickets: Array<Ticket>;
  isSubmitForm = false;
  isSubmitFormSpinner = false;
  deleteItemIds = [];
  selected = [];

  noofrows = 50;
  selectedColumns: Array<PtableColumn> = [];
  cols: Array<PtableColumn> = [];
  selectedRowData = [];
  ptablesearch: string;
  timeMask = timeMask;
  loading = true;

  colVisData = [];
  maxrecords: any = null;
  filters: any = null;
  totalRecords = 0;
  isShowFilter = true;
  @ViewChild("saveQueryBtn") saveQueryBtn;
  isUpdateFiler = false;
  selectedFilterId = null;
  saveQueryName: string;
  saveForCurrentJob = false;
  @ViewChild("saveQueryCancelBtn") saveQueryCancelBtn;

  constructor(private _ticketservice: TicketServices, private securityInfoResolve: SecurityInfoResolve, private sharedService: SharedServices) { }

  ngOnInit() {
    this.cols = [
      { field: 'id', header: 'ID', width: '50', sort: true, index: 0 },
      { field: 'summary', header: 'Summary', width: 'auto', sort: true, index: 1 },
      { field: 'module', header: 'Module', width: '250', sort: true, index: 4 },
      { field: 'status', header: 'Status', width: '100', sort: true, index: 2 },
      { field: 'priority', header: 'Priority', width: '100', sort: true, index: 3 },
      { field: 'createdByStaff', header: 'Created By', width: '150', sort: true, index: 5 },
      { field: 'assignedToStaff', header: 'Assigned To', width: '150', sort: true, index: 6 },
      { field: 'estimDevDuration', header: 'Est Dev Time', width: '100', sort: true, index: 7 },
      { field: 'estimTestDuration', header: 'Est Test Time', width: '100', sort: true, index: 8 },
      { field: 'formattedCreatedDate', header: 'Created Date', width: '150', sort: true, index: 9 },
      { field: 'formattedLastChangedDate', header: 'Last Changed', width: '150', sort: true, index: 10 },
    ];
    this.selectedColumns = this.cols;

    //this.getAllConfigItems();
  }

  loadData(event: LazyLoadEvent) {
    this.loading = true;

    if (!event.sortField) { event.sortField = "name" }
    if (!event.sortOrder) { event.sortOrder = 1 }

    console.log(event);
    /*this.dataTablesParameters.start = event.first;
    this.dataTablesParameters.length = event.rows;*/

    this.sharedService.getDataWithFilter(event, this.colVisData, this.maxrecords, this.filters, "ticket", null)
      .subscribe((resp: any) => {
        // debugger;
        this.tickets = resp.value;
        console.log(resp);

        this.loading = false;
        this.totalRecords = resp.totalCount;
      });
  }

  /*getAllConfigItems() {
    this._ticketservice.getAllTickets()
      .subscribe((res: any) => {
        this.tickets = res.value;
      });
  }*/

  deleteTicket() {
    this.deleteItemIds = [];
    this.selectedRowData.forEach(rd => {
      this.deleteItemIds.push(rd.id);
    })

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
          swal(
            'Deleted!',
            'Selected item has been deleted.',
            'success'
          )

          this._ticketservice.deleteTicket(this.deleteItemIds)
            .subscribe(res => {
              this.deleteItemIds = [];
              this.loadData({ first: 0, rows: this.noofrows });

              for (var i = 0; i < this.tickets.length; i++) {
                this.selected[i] = false;
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
      })
    }
    else {
      swal(
        'Oops...',
        'Please select an item to delete.',
        'info'
      )
    }
  }

  exporttoExcel() {
    this.securityInfoResolve.checkPermission(SecurityRights.ExportAllResults)
      .subscribe((res: any) => {
        if (res.succeeded) {
          this.exporttoExcelHelper();
        } else {
          /*var err = "";
          res.errors.forEach((er) => {
            err = err + " " + er;
          });*/
          swal(
            'Access Denied!',
            SecurityRightsExportError,
            'error'
          )
        }
      })
  }

  exporttoExcelHelper() {
    const workbook = new Excel.Workbook();
    var sheet = workbook.addWorksheet('My Sheet');

    sheet.columns = [
      { header: 'ID', key: 'id', width: 20 },
      { header: 'Summary', key: 'summary', width: 50 },
      { header: 'Status', key: 'status', width: 30 },
      { header: 'Priority', key: 'priority', width: 20 },
      { header: 'Module', key: 'module', width: 20 },
      { header: 'Created By', key: 'createdByStaff', width: 20 },
      { header: 'Assigned To', key: 'assignedToStaff', width: 20 },
      { header: 'Created Date', key: 'formattedCreatedDate', width: 20 },
      { header: 'Last Changed', key: 'formattedLastChangedDate', width: 20 }
    ];

    this.tickets.forEach((am) => {
      var dataobj = {};
      //sheet
      sheet.columns.forEach(cl => {
        dataobj[cl.key] = am[cl.key];
      });

      sheet.addRow(dataobj);
    });

    sheet.getRow('1').font = {
      size: 14,
      bold: true
    };

    var filename = "Ticket.xlsx";
    /* save to file */
    workbook.xlsx.writeBuffer().then(function (data) {
      saveAs(new Blob([data], { type: 'application/octet-stream' }), filename);
    });
  }

  updateSelectedColumnsIndex() {
    this.selectedColumns.sort((a, b) => {
      if (a.index > b.index) return 1;
      if (a.index < b.index) return -1;
      return 0;
    })
  }

  filterSubmit(res) {
    this.maxrecords = res.maxrecords;
    this.filters = res.filters;
    this.loadData({ first: 0, rows: this.noofrows });
  }

  saveQuery(form) {
    this.isUpdateFiler = false;
    this.isSubmitForm = true;
    if (!form.invalid) {
      this.sharedService.saveQuery('ticket', this.saveForCurrentJob, '', this.saveQueryName, this.filters)
        .subscribe((res: any) => {
          console.log(res);
          this.selectedFilterId = res.value;   
          this.isUpdateFiler = true;
          if (res.succeeded) {
            this.saveQueryCancelBtn.nativeElement.click();
            /*swal('Successfully Saved!',
              '',
              'success');*/
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
        })
    }
  }

  filtersEmit(res) {
    console.log(res);
    this.filters = res;
  }

  openSaveQueryModal() {
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
}
