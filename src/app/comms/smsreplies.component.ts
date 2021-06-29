import { ShareService } from '@ngx-share/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import { Subject } from 'rxjs/Subject';
import swal from 'sweetalert2';

import { SmsReply } from '../models/smsreply';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SecurityRights, SecurityRightsExportError } from '../shared/enum';
import { SmsServices } from '../services/sms.services';
import { PtableColumn } from '../models/ptablecolumn';
import { Sms } from '../models/sms';
import { SharedServices } from '../services/shared.services';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'SmsRepliesComponent',
  templateUrl: './smsreplies.component.html'
})

export class SmsRepliesComponent implements OnInit {
  smsReplies: Array<SmsReply> = [];

  isLoading = true;

  deleteItemIds = [];
  isSelectAllItem = false;
  selected = [];

  noofrows = 50;
  selectedColumns: Array<PtableColumn> = [];
  cols: Array<PtableColumn> = [];
  selectedRowData = [];
  ptablesearch: string;

  smsData = new Sms();
  smsModalTitle: string;
  @ViewChild("smsModlaBtn") smsModlaBtn;

  constructor(private smsService: SmsServices, private securityInfoResolve: SecurityInfoResolve, private sharedService: SharedServices) { }

  ngOnInit() {
    this.cols = [
      { field: 'formattedReplyDateTime', header: 'Date Time', width: '150', index: 0, sort: true },
      { field: 'formattedSender', header: 'Mobile No', width: '100', index: 1, sort: false },
      { field: 'respondentIDs', header: 'Panel Member ID(s)', width: '150', index: 2, sort: false },
      { field: 'respondentNames', header: 'Panel Member Name(s)', width: '200', index: 3, sort: false },
      { field: 'lastSMSSentInformation', header: 'Last Sent SMS', width: 'auto', index: 4, sort: false },
      { field: 'replyText', header: 'Reply', width: 'auto', index: 5, sort: false },
    ];
    this.selectedColumns = this.cols;
    this.getAllSmsReplies();
  }

  getAllSmsReplies() {
    this.smsService.getSmsReply()
      .subscribe((res: any) => {
        this.smsReplies = res.value;
        console.log(this.smsReplies);
      });
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
      { header: 'Date Time', key: 'formattedReplyDateTime', width: 10 },
      { header: 'Mobile', key: 'formattedSender', width: 25 },
      { header: 'Respondent Ids', key: 'respondentIDs', width: 10 },
      { header: 'Respondedn Names', key: 'respondentNames', width: 15 },
      { header: 'Last Sent SMS', key: 'lastSMSSentInformation', width: 30 },
      { header: 'Reply', key: 'replyText', width: 30 }
    ];

    this.smsReplies.forEach((am) => {
      var dataobj = {};
      //sheet
      sheet.columns.forEach(cl => {
        if (cl.key == 'datetime') {
          var cdate = moment(am[cl.key]).format('DD/MM/YYYY hh:mm');
          dataobj[cl.key] = cdate;
        }
        else
          dataobj[cl.key] = am[cl.key];
      });

      sheet.addRow(dataobj);
    });

    sheet.getRow('1').font = {
      size: 14,
      bold: true
    };

    var filename = "SMS Replies.xlsx";
    /* save to file */
    workbook.xlsx.writeBuffer().then(function (data) {
      saveAs(new Blob([data], { type: 'application/octet-stream' }), filename);
    });
  }

  selectAll(e) {
    if (e.target.checked) {
      this.smsReplies.forEach((item) => {
        this.deleteItemIds.push(item.messageID);
      });
      this.isSelectAllItem = true;
    }
    else {
      this.deleteItemIds = [];
      this.isSelectAllItem = false;
    }

    for (var i = 0; i < this.smsReplies.length; i++) {
      this.selected[i] = e.target.checked;
    }
  }

  unCheckAllItems() {
    if (!this.isSelectAllItem) {
      for (var i = 0; i < this.smsReplies.length; i++) {
        this.selected[i] = false;
      }
      this.deleteItemIds = [];
    }
  }

  deleteSMSReply() {
    this.deleteItemIds = [];
    this.selectedRowData.forEach(rd => {
      this.deleteItemIds.push(rd.messageID);
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
          this.smsService.deleteReplies(this.deleteItemIds)
            .subscribe((res: any) => {
              console.log(res);

              if (res.succeeded) {
                this.deleteItemIds = [];
                this.getAllSmsReplies();
                this.unCheckAllItems();

                for (var i = 0; i < this.smsReplies.length; i++) {
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

  updateSelectedColumnsIndex() {
    this.selectedColumns.sort((a, b) => {
      if (a.index > b.index) return 1;
      if (a.index < b.index) return -1;
      return 0;
    })
  }

  closeModal(e) {
    if (e) {
      this.unCheckAllItems();
    }
  }

  openSmsModal(entity, title) {
    this.smsModalTitle = title;

    this.deleteItemIds = [];
    this.selectedRowData.forEach(rd => {
      if (rd.respondentIDs) {
        rd.respondentIDs.split(',').forEach((mid) => {
          this.deleteItemIds.push(mid);
        })
      }
    })

    if (this.deleteItemIds.length > 0) {
      this.openSmsModalHelper(entity, this.deleteItemIds);
    }
    else if (this.selectedRowData.length > 0) {
      swal(
        'Oops...',
        'Member data missing.',
        'info'
      )
    }
    else {
      swal(
        'Oops...',
        'Please select an item.',
        'info'
      )
    }
  }

  openSmsModalHelper(entity, idsarr) {
    var ids = "?";
    idsarr.forEach(di => {
      ids += 'respondentIds=' + di + '&';
    });
    this.smsService.getSmsData(entity, ids)
      .subscribe((res: any) => {
        this.smsData = res.value;
        this.smsModlaBtn.nativeElement.click();
      })
  }
}
