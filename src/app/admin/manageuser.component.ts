import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import { saveAs } from 'file-saver';
import { Subject } from 'rxjs/Subject';
import swal from 'sweetalert2';

import { mobileMask, phoneMask, phonePattern, mobilePattern } from '../app.component';
import { User } from '../models/user';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SecurityRights, SecurityRightsExportError } from '../shared/enum';
import { SharedServices } from './../services/shared.services';
import { UserServices } from '../services/user.services';
import { PtableColumn } from '../models/ptablecolumn';
import * as moment from 'moment';
import { JobServices } from '../services/job.services';

declare var jQuery: any;

@Component({
  selector: 'ManageUserComponent',
  templateUrl: './manageuser.component.html'
})

export class ManageUserComponent implements OnInit {
  mobilePattern = mobilePattern;
  phonePattern = phonePattern;
  user: User;
  users: Array<User>;
  isLoading = true;

  deleteItemIds = [];
  isSubmitForm = false;
  isSubmitFormSpinner = false;

  @ViewChild("closeAddNewModal") closeAddNewModal;
  @ViewChild("closeSecurityModal") closeSecurityModal;
  @ViewChild("checkBox") checkBox;

  selected = [];

  phoneMask = phoneMask;
  mobileMask = mobileMask;
  employeePosition = [];

  noofrows = 50;
  selectedColumns: Array<PtableColumn> = [];
  cols: Array<PtableColumn> = [];
  selectedRowData = [];
  ptablesearch: string;

  @ViewChild('container', { read: ViewContainerRef })
  public containerRef: ViewContainerRef;
  accountingSystemName: string;

  constructor(private _userService: UserServices, private sharedService: SharedServices,
    private securityInfoResolve: SecurityInfoResolve, private jobservice: JobServices) { }

  ngOnInit() {
    this.cols = [
      { field: 'inactive', header: 'Active', width: '100', index: 0, sort: false, textAlign: 'center' },
      { field: 'username', header: 'Username', width: '150', index: 1, sort: false },
      { field: 'firstName', header: 'First Name', width: '150', index: 2, sort: false },
      { field: 'lastName', header: 'Last Name', width: '150', index: 3, sort: false },
      { field: 'formattedDateofBirth', header: 'DOB', width: '100', index: 4, sort: false, textAlign: 'center' },
      { field: 'emailAddress', header: 'Office Email', width: 'auto', index: 5, sort: false },
      { field: 'formattedPhone', header: 'Direct Line', width: '125', index: 6, sort: false },
      { field: 'extension', header: 'Ext', width: '75', index: 7, sort: false },
      { field: 'enable2FA', header: '2FA', width: '75', index: 8, sort: false, textAlign: 'center' },
      { field: 'skip2FA', header: 'Skip 2FA', width: '75', index: 9, sort: false, textAlign: 'center' },
      { field: 'formattedMobile', header: 'Mobile', width: '125', index: 10, sort: false },
      { field: 'personalEmail', header: 'Personal Email', width: 'auto', index: 11, sort: false },
      { field: 'security', header: 'Security', width: '125', index: 12, sort: false },
    ];
    this.selectedColumns = this.cols;

    this.getEmployeePoistion();
    this.getUsers();
    this.addNew();
    this.getAccountingSystemName();
  }

  getAccountingSystemName() {
    this.jobservice.getAccountingSystemName()
      .subscribe((res: any) => {
        console.log(res)
        this.accountingSystemName = res.value.value;
      })
  }

  addNew() {
    this.user = new User();
  }

  getEmployeePoistion() {
    this.sharedService.getEmployeePositionList()
      .subscribe((res: any) => {
        console.log(res);
        this.employeePosition = res.value;
      })
  }

  getUsers() {
    this._userService.getAllUser()
      .subscribe((res: any) => {
        this.users = res.value;
        console.log(this.users)
      });
  }

  deactivateUser() {
    this.deleteItemIds = [];
    this.selectedRowData.forEach(rd => {
      this.deleteItemIds.push(rd.username);
    })

    if (this.deleteItemIds.length > 0) {
      swal({
        title: 'Are you sure?',
        text: '',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, deactivate',
        confirmButtonColor: '#ffaa00',
        cancelButtonText: 'No, keep it'
      }).then((result) => {
        if (result.value) {
          swal(
            'Deactivated!',
            'Selected user has been deactivated.',
            'success'
          )

          this._userService.deactivateUser(this.deleteItemIds)
            .subscribe(res => {
              this.deleteItemIds = [];
              this.getUsers();

              for (var i = 0; i < this.users.length; i++) {
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

  submitConfigItem(form) {
    this.isSubmitForm = true;
    this.isSubmitFormSpinner = true;
    if (form.invalid) {
      //this.isSubmitForm = false;
      this.isSubmitFormSpinner = false;
    } else {
      console.log(this.user);
      if (this.user.id == 0) this.user.newUser = false;
      else this.user.newUser = true;

      if (this.user.dateofBirth)
        this.user.dateofBirth = moment(this.user.dateofBirth).toDate();

      this._userService.submitUser(this.user)
        .subscribe((res: any) => {
          console.log(res);
          if (res.succeeded) {
            this.getUsers();

            this.isSubmitForm = false;
            this.isSubmitFormSpinner = false;
            setTimeout(() => {
              this.closeAddNewModal.nativeElement.click();
              this.closeSecurityModal.nativeElement.click();
            }, 500);
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
  }

  updateUser(user) {
    this.user = user;
    if (this.user.dateofBirth)
      this.user.dateofBirth = moment(this.user.dateofBirth).toDate();
    console.log(this.user);
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
      { header: 'Username', key: 'username', width: 30 },
      { header: 'First Name', key: 'firstName', width: 20 },
      { header: 'Last Name', key: 'lastName', width: 20 },
      { header: 'DOB', key: 'formattedDateofBirth', width: 15 },
      { header: 'Office Emai', key: 'emailAddress', width: 30 },
      { header: 'Direct Line', key: 'directLine', width: 15 },
      { header: 'Extension', key: 'extension', width: 15 },
      { header: 'Mobile', key: 'mobile', width: 15 },
      { header: 'Personal Email', key: 'personalEmail', width: 30 }
    ];

    this.users.forEach((am) => {
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

    var filename = "System User.xlsx";
    /* save to file */
    workbook.xlsx.writeBuffer().then(function (data) {
      saveAs(new Blob([data], { type: 'application/octet-stream' }), filename);
    });
  }

  unmask(value) {
    var ret = value.replace(/\D+/g, '');
    return ret;
  }

  selectAllSecutriyQuestion(e) {
    console.log(e);
    if (e.target.checked) {
      this.user.security_ARPT = true;
      this.user.security_BNK = true;
      this.user.security_CFG = true;
      this.user.security_CLN = true;
      this.user.security_EXP = true;
      this.user.security_ICV = true;
      this.user.security_INV = true;
      this.user.security_KRPT = true;
      this.user.security_LST = true;
      this.user.security_MRPT = true;
      this.user.security_MYOB = true;
      this.user.security_ORPT = true;
      this.user.security_QTE = true;
      this.user.security_REF = true;
      this.user.security_RES = true;
      this.user.security_RLI = true;
      this.user.security_RME = true;
      this.user.security_RPT = true;
      this.user.security_RSP = true;
      this.user.security_SRPT = true;
      this.user.security_TKT = true;
      this.user.security_USR = true;
      this.user.security_CLI = true;
      this.user.security_CEN = true;
      this.user.security_SRRPT = true;
      this.user.security_JRRPT = true;
      this.user.security_JSRPT = true;
      this.user.security_JDRPT = true;
      this.user.security_JORPT = true;
      this.user.security_SKRPT = true;
      this.user.security_SARPT = true;
      this.user.security_SPKRPT = true;
      this.user.security_JOB = true;
      this.user.security_ETA = true;
      this.user.security_ESA = true;
      this.user.security_LAA = true;
      this.user.security_SLRPT = true;
      this.user.security_MPRPT = true;
      this.user.security_MSA = true;
    }
    else {
      this.user.security_ARPT = false;
      this.user.security_BNK = false;
      this.user.security_CFG = false;
      this.user.security_CLN = false;
      this.user.security_EXP = false;
      this.user.security_ICV = false;
      this.user.security_INV = false;
      this.user.security_KRPT = false;
      this.user.security_LST = false;
      this.user.security_MRPT = false;
      this.user.security_MYOB = false;
      this.user.security_ORPT = false;
      this.user.security_QTE = false;
      this.user.security_REF = false;
      this.user.security_RES = false;
      this.user.security_RLI = false;
      this.user.security_RME = false;
      this.user.security_RPT = false;
      this.user.security_RSP = false;
      this.user.security_SRPT = false;
      this.user.security_TKT = false;
      this.user.security_USR = false;
      this.user.security_CLI = false;
      this.user.security_CEN = false;
      this.user.security_SRRPT = false;
      this.user.security_JRRPT = false;
      this.user.security_JSRPT = false;
      this.user.security_JDRPT = false;
      this.user.security_JORPT = false;
      this.user.security_SKRPT = false;
      this.user.security_SARPT = false;
      this.user.security_SPKRPT = false;
      this.user.security_JOB = false;
      this.user.security_ETA = false;
      this.user.security_ESA = false;
      this.user.security_LAA = false;
      this.user.security_SLRPT = false;
      this.user.security_MPRPT = false;
      this.user.security_MSA = false;
    }
  }

  toggleSecurityOptions(data, type) {
    /*var data = false;
    if (e.target.checked) {
      data = true;
    }*/
    if (type == 'generalsecurity') {
      this.user.security_RLI = data;
      this.user.security_EXP = data;
      this.user.security_EXR = data;
    }
    if (type == 'clientlevelsecurity') {
      this.user.security_CEN = data;
      this.user.security_CLI = data;
    }
    if (type == 'joblevelsecurity') {
      this.user.security_JOB = data;
      this.user.security_INV = data;
      this.user.security_QTE = data;
      this.user.security_ICV = data;
      this.user.security_MYOB = data;
      this.user.security_RJA = data;
      this.user.security_SMR = data;
      this.user.security_MSLQ = data;
    }
    if (type == 'reportslevelsecurity') {
      this.user.security_SRRPT = data;
      this.user.security_JRRPT = data;
      this.user.security_JSRPT = data;
      this.user.security_JDRPT = data;
      this.user.security_JORPT = data;
      this.user.security_SLRPT = data;
      this.user.security_MPRPT = data;
      this.user.security_SKRPT = data;
      this.user.security_SARPT = data;
      this.user.security_SPKRPT = data;
      this.user.security_INCRPT = data;
    }
    if (type == 'repondentlevelsecurity') {
      this.user.security_RES = data;
      this.user.security_BNK = data;
      this.user.security_RSP = data;
    }
    if (type == 'adminlevelsecurity') {
      this.user.security_USR = data;
      this.user.security_REF = data;
      this.user.security_CFG = data;
      this.user.security_RME = data;
      this.user.security_TKT = data;
      this.user.security_ETA = data;
      this.user.security_ESA = data;
      this.user.security_LAA = data;
      this.user.security_MGQ = data;
      this.user.security_LST = data;
      this.user.security_SEV = data;
      this.user.security_MSA = data;
    }
  }

  updateSelectedColumnsIndex() {
    this.selectedColumns.sort((a, b) => {
      if (a.index > b.index) return 1;
      if (a.index < b.index) return -1;
      return 0;
    })
  }
}
