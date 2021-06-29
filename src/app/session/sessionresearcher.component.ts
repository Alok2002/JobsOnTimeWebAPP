import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import { saveAs } from 'file-saver';
import { Subject } from 'rxjs/Subject';
import swal from 'sweetalert2';

import { ClientContact } from '../models/clientcontact';
import { Job } from '../models/job';
import { JobContact } from '../models/jobcontact';
import { SessionContact } from '../models/sessioncontact';
import { JobServices } from '../services/job.services';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SessionServices } from '../services/session.services';
import { SharedServices } from '../services/shared.services';
import { SecurityRights, SecurityRightsExportError } from '../shared/enum';
import { PtableColumn } from '../models/ptablecolumn';
import { ObjectUtils } from 'primeng/components/utils/objectutils';

declare var jQuery: any;

@Component({
  selector: 'SessionResearcherComponent',
  templateUrl: './sessionresearcher.component.html'
})

export class SessionResearcherComponent implements OnInit {
  @Input() id: number;
  @Input() isUpdateSession: boolean;
  @Input() jobId: number;

  isLoading = true;
  isSubmitFormSpinner = false;
  isSubmitForm = false;

  clientcontacts: Array<ClientContact> = [];

  deleteItemIds = [];

  @ViewChild("closeAddNewModal") closeAddNewModal;
  @ViewChild("checkBox") checkBox;

  selected = [];

  sessionContact: SessionContact;
  job: Job;
  hasClientId = false;
  sessioncontacts = [];

  jobcontacts: Array<JobContact> = [];
  jobcontacttype = [];

  selectedClientContact: ClientContact;

  noofrows = 50;
  selectedColumns: Array<PtableColumn> = [];
  cols: Array<PtableColumn> = [];
  selectedRowData = [];
  ptablesearch: string;

  constructor(private router: Router, private securityInfoResolve: SecurityInfoResolve,
    private sessionservice: SessionServices, private jobservice: JobServices,
    private sharedservice: SharedServices) { }

  ngOnInit() {
    this.cols = [
      { field: 'id', header: '', index: -1, width: '30', sort: false },
      { field: 'fullName', header: 'Name', index: 0, width: '200', sort: true },
      { field: 'contactType', header: 'Contact Type', index: 1, width: '200', sort: true },
      { field: 'clientContact.contactType', header: 'Contact Position', index: 2, width: '200', sort: true },
      { field: 'clientContact.formattedPhone', header: 'Phone', index: 3, width: '100', sort: false },
      { field: 'clientContact.formattedMobile', header: 'Mobile', index: 4, width: '100', sort: false },
      { field: 'clientContact.formattedAfterhours', header: 'After Hours', index: 5, width: '150', sort: false },
      { field: 'emailAddress', header: 'Email Address', index: 6, width: '250', sort: false },
      { field: 'onlineAccess', header: 'Online Access', index: 7, width: '125', sort: false, textAlign: 'center' },
      { field: 'clientContact.stakeholder', header: 'Stakeholder', index: 9, width: '125', sort: false, textAlign: 'center' },
      { field: 'clientContact.comment', header: 'Comment', index: 8, width: 'auto', sort: false },
    ];
    this.selectedColumns = this.cols;

    this.getSessionContactbySessionId(this.id);
    this.getContactsByJobId();
    this.getJobById(this.jobId);
  }

  getJobById(id) {
    this.jobservice.getJobsByJob(id)
      .subscribe((res: any) => {
        this.job = res.value;
        this.hasClientId = true;
      });
  }

  getSessionContactbySessionId(id) {
    this.sessionservice.getSessionContactByJob(id)
      .subscribe((res: any) => {
        this.sessioncontacts = res.value;
        console.log(this.sessioncontacts);
      });
  }

  getContactsByJobId() {
    this.jobservice.getContactsByJob(this.jobId)
      .subscribe((res: any) => {
        this.jobcontacts = res.value;
        console.log(this.jobcontacts);
      });
  }

  delinkSession() {
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
          );

          this.sessionservice.delinkSessionContact(this.deleteItemIds)
            .subscribe(res => {
              this.deleteItemIds = [];
              this.getSessionContactbySessionId(this.id);

              for (var i = 0; i < this.clientcontacts.length; i++) {
                this.selected[i] = false;
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
  }

  editAddress(id) {
    this.clientcontacts.forEach((item) => {
      if (item.id == id) {
        //this.address = item;
      }
    });
  }

  response(res) {
    if (res.succeeded)
      this.getSessionContactbySessionId(this.id);
    this.getContactsByJobId();
  }

  compareToSession(clientContactId) {
    var found = false;
    this.sessioncontacts.forEach((sc) => {
      if (sc.clientContactId == clientContactId)
        found = true;
    });

    return found;
  }

  toggleCheckBox(clientcontactid, $event) {
    console.log($event);

    if ($event.target.checked) {
      var sessioncontact = new SessionContact();
      sessioncontact.clientContactId = clientcontactid;
      sessioncontact.clientJobGroupId = this.id;

      this.sessionservice.updateSessionContact(sessioncontact)
        .subscribe((res: any) => {
          if (res.succeeded) {
            this.getSessionContactbySessionId(this.id);
            this.getContactsByJobId();
          }
        });
    } else {
      var id = null;
      this.sessioncontacts.forEach((sc) => {
        if (sc.clientContactId == clientcontactid)
          id = sc.id;
      });

      if (id != null) {
        console.log(id);
        this.sessionservice.delinkSessionContact(id)
          .subscribe((res: any) => {
            if (res.succeeded) {
              this.getSessionContactbySessionId(this.id);
              this.getContactsByJobId();
            }
          });
      }
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
      { header: 'Contact Type', key: 'contactType', width: 15 },
      { header: 'Name', key: 'firstname', width: 20 },
      { header: 'Position', key: 'contactType', width: 20 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Mobile', key: 'mobile', width: 15 },
      { header: 'After Hours', key: 'afterhours', width: 15 },
      { header: 'Email Address', key: 'emailAddress', width: 30 },
      { header: 'Comment', key: 'comment', width: 50 }
    ];

    this.jobcontacts.forEach((am) => {
      var dataobj = {};
      //sheet
      sheet.columns.forEach(cl => {
        if (cl.key == 'contactType')
          dataobj[cl.key] = am[cl.key];
        else
          dataobj[cl.key] = am['clientContact'][cl.key];
      });

      sheet.addRow(dataobj);
    });

    sheet.getRow('1').font = {
      size: 14,
      bold: true
    };

    var filename = "Session Researcher.xlsx";
    /* save to file */
    workbook.xlsx.writeBuffer().then(function (data) {
      saveAs(new Blob([data], { type: 'application/octet-stream' }), filename);
    });
  }

  editContact(id) {
    this.jobcontacts.forEach((item) => {
      if (item.id == id) {
        this.selectedClientContact = item.clientContact;
      }
    });
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
}
