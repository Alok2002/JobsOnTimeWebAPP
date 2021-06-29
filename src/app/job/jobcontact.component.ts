import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router, NavigationEnd, RoutesRecognized } from '@angular/router';
declare var jQuery: any;
import swal from 'sweetalert2';
import { JobContact } from "../models/jobcontact";
import { ClientContact } from "../models/clientcontact";
import { ClientServices } from "../services/client.services";
import { SharedServices } from "../services/shared.services";
import { JobServices } from "../services/job.services";
import { Job } from "../models/job";

import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as stream from 'stream';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import { SecurityRights, SecurityRightsExportError } from '../shared/enum';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { PtableColumn } from '../models/ptablecolumn';

import { ObjectUtils } from 'primeng/components/utils/objectutils';

@Component({
  selector: 'JobContactComponent',
  templateUrl: './jobcontact.component.html'
})

export class JobContactComponent implements OnInit {
  @Input() id: number;
  @Input() isUpdateJob: boolean;

  jobcontact: JobContact;
  jobcontacts: Array<JobContact>;
  isLoading = true;
  isSubmitFormSpinner = false;
  isSubmitForm = false;

  deleteItemIds = [];

  @ViewChild("closeAddNewModal") closeAddNewModal;
  @ViewChild("checkBox") checkBox;

  selected = [];

  jobcontacttype = [];
  jobgroupcontacttype = [];
  job: Job;
  hasClientId = false;

  clientcontacts: Array<ClientContact>;
  selectedClientContact: ClientContact;
  isContactModel = false;

  isNewContact = false;

  noofrows = 50;
  selectedColumns: Array<PtableColumn> = [];
  cols: Array<PtableColumn> = [];
  selectedRowData = [];
  ptablesearch: string;

  constructor(private clientSevice: ClientServices, private jobService: JobServices,
    private sharedService: SharedServices, private securityInfoResolve: SecurityInfoResolve,
    private router: Router) { }

  ngOnInit() {
    this.cols = [
      { field: 'clientContact.fullName', header: 'Name', index: 0, width: '200', sort: true },
      { field: 'contactType', header: 'Contact Type', index: 1, width: '200', sort: true },
      { field: 'clientContact.contactType', header: 'Contact Position', index: 2, width: '200', sort: true },
      { field: 'clientContact.formattedPhone', header: 'Phone', index: 3, width: '100', sort: false },
      { field: 'clientContact.formattedMobile', header: 'Mobile', index: 4, width: '100', sort: false },
      { field: 'clientContact.formattedAfterhours', header: 'After Hours', index: 5, width: '100', sort: false },
      { field: 'clientContact.emailAddress', header: 'Email Address', index: 6, width: '200', sort: false },
      { field: 'clientContact.onlineAccess', header: 'Online Access', index: 7, width: '125', sort: false, textAlign: 'center' },
      { field: 'clientContact.onlineAccessThisJob', header: 'Online Access This Job', index: 8, width: '150', sort: false, textAlign: 'center' },
      { field: 'clientContact.stakeholder', header: 'Stakeholder', index: 9, width: '125', sort: false, textAlign: 'center' },
      { field: 'clientContact.comment', header: 'Comment', index: 10, width: 'auto', sort: false },
    ];

    this.selectedColumns = this.cols;

    this.getJobById(this.id);
    this.getClientJobContactTypeList();
    this.getClientJobGroupContactTypeList();

    if (this.id != null && this.isUpdateJob) {
      this.getContactsByJobId(this.id);
    }
    this.addNew();
  }

  addNew() {
    this.jobcontact = new JobContact();
    this.jobcontact.onlineAccessThisJob = false;
    this.selectedClientContact = null;
    this.isContactModel = true;

    this.isNewContact = false;
    setTimeout(() => {
      this.isNewContact = true;
    }, 100);
  }

  getJobById(id) {
    this.jobService.getJobsByJob(id)
      .subscribe((res: any) => {
        this.job = res.value;
        this.hasClientId = true;
        this.getClientContactsByClientId(this.job.clientId);
      });
  }

  getClientContactsByClientId(id) {
    this.clientSevice.getContactbyClient(id)
      .subscribe((res: any) => {
        this.clientcontacts = res.value;
        console.log(this.clientcontacts);
      });
  }

  getContactsByJobId(id) {
    this.jobService.getContactsByJob(id)
      .subscribe((res: any) => {

        this.jobcontacts = res.value;
        console.log(this.jobcontacts);
      });
  }

  getClientJobContactTypeList() {
    this.sharedService.getClientJobContactTypeList()
      .subscribe((res: any) => {
        this.jobcontacttype = res.value;
      });
  }

  getClientJobGroupContactTypeList() {
    this.sharedService.getClientJobGroupContactTypeList()
      .subscribe((res: any) => {
        this.jobgroupcontacttype = res.value;
      });
  }

  delinkContact() {
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
        confirmButtonText: 'Yes, delink it!',
        confirmButtonColor: '#ffaa00',
        cancelButtonText: 'No, keep it'
      }).then((result) => {
        if (result.value) {


          this.jobService.deleteContact(this.deleteItemIds)
            .subscribe((res: any) => {
              if (res.succeeded) {
                this.deleteItemIds = [];
                this.getContactsByJobId(this.id);

                for (var i = 0; i < this.jobcontacts.length; i++) {
                  this.selected[i] = false;
                }

                swal(
                  'Delinked!',
                  'Selected item has been delinked.',
                  'success'
                );
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
        'Please select an item to delink.',
        'info'
      )
    }
  }

  editContact(id) {
    this.jobcontacts.forEach((item) => {
      if (item.id == id) {
        this.jobcontact = item;
        this.selectedClientContact = item.clientContact;
      }
    });
  }

  response(res) {
    if (res.succeeded)
      this.getContactsByJobId(this.id);
    this.getJobById(this.id)
  }

  updateJobContact(form) {
    this.isSubmitForm = true;
    this.isSubmitFormSpinner = true;
    if (form.invalid) {
      //this.isSubmitForm = false;
      this.isSubmitFormSpinner = false;
    } else {
      this.jobcontact.clientJobId = this.id;
      this.jobService.updateJobContact(this.jobcontact)
        .subscribe((res: any) => {
          this.isSubmitFormSpinner = false;
          this.isSubmitForm = false;

          if (res.succeeded) {
            this.closeAddNewModal.nativeElement.click();
            //this.router.navigate(['/client']);
            this.getContactsByJobId(this.id);
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
      { header: 'Name', key: 'clientContact.fullName', width: 20 },
      { header: 'Contact Type', key: 'contactType', width: 20 },
      { header: 'Contact Position', key: 'clientContact.contactType', width: 15 },
      { header: 'Phone', key: 'clientContact.formattedPhone', width: 15 },
      { header: 'Mobile', key: 'clientContact.formattedMobile', width: 15 },
      { header: 'After Hours', key: 'clientContact.formattedAfterhours', width: 15 },
      { header: 'Email Address', key: 'clientContact.emailAddress', width: 30 },
      { header: 'Online Access', key: 'clientContact.onlineAccess', width: 30 },
      { header: 'Comment', key: 'clientContact.comment', width: 50 }
    ];

    this.jobcontacts.forEach((am) => {
      var dataobj = {};
      //sheet
      sheet.columns.forEach(cl => {
        if (cl.key == 'cn.contactType')
          dataobj[cl.key] = am['contactType'];
        else if (cl.key == 'name')
          dataobj[cl.key] = am['clientContact']['firstname'] + " " + am['clientContact']['lastname'];
        else
          dataobj[cl.key] = am['clientContact'][cl.key];
      });

      sheet.addRow(dataobj);
    });

    sheet.getRow('1').font = {
      size: 14,
      bold: true
    };

    var filename = "Job Contact.xlsx";
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

  resolveFieldData(data, field) {
    return ObjectUtils.resolveFieldData(data, field);
  }

  updateClientContact(jobcontact) {
    console.log(jobcontact)
    this.jobService.updateJobContact(jobcontact)
      .subscribe((res: any) => {
        console.log(res)
      });
  }
}
