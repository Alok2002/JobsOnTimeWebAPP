import { Component, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import { saveAs } from 'file-saver';
import swal from 'sweetalert2';

import { ClientPO } from '../models/clientpo';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SecurityRights, SecurityRightsExportError } from '../shared/enum';
import { ClientServices } from '../services/client.services';
import { SharedServices } from '../services/shared.services';
import { PtableColumn } from '../models/ptablecolumn';
import * as moment from 'moment';

declare var jQuery: any;

@Component({
  selector: 'ClientPOComponent',
  templateUrl: './clientpo.component.html',
})

export class ClientPOComponent implements OnInit {
  clientpo: ClientPO;
  @Input() id: number;
  @Input() isUpdateClient: boolean;
  @Input() isJobInvoiceChild: boolean;

  isLoading = true;
  isSubmitFormSpinner = false;
  isSubmitForm = false;
  clientpos: Array<ClientPO>;

  deleteItemIds = [];

  @ViewChild("closeAddNewModal") closeAddNewModal;
  @ViewChild("checkBox") checkBox;

  selected = [];

  postcodes = [];
  isPostSuggShow = false;
  contactTypeList = [];

  stateslist = [];
  dropdownSettings = {};
  contactList = [];
  selectedContactList = [];

  noofrows = 50;
  selectedColumns: Array<PtableColumn> = [];
  cols: Array<PtableColumn> = [];
  selectedRowData = [];
  ptablesearch: string;

  @ViewChild('container', { read: ViewContainerRef })
  public containerRef: ViewContainerRef;

  constructor(private router: Router, private securityInfoResolve: SecurityInfoResolve,
    private _clientService: ClientServices, private sharedservice: SharedServices) { }

  ngOnInit() {
    this.cols = [
      { field: 'poNumber', header: 'PO Number', index: 0, width: '150', sort: true },
      { field: 'poValue', header: 'PO Value', index: 1, width: '150', sort: false },
      { field: 'expiryDate', header: 'Expiry Date', index: 2, width: '125', sort: true },
      { field: 'jobReference', header: 'Job Reference', index: 3, width: '150', sort: false },
      { field: 'associatedContacts', header: 'Associated Contacts', index: 4, width: '200', sort: false },
      { field: 'additionalNotes', header: 'Additional Notes', index: 5, width: 'auto', sort: false },
    ];
    this.selectedColumns = this.cols;

    this.getClientPObyClientId(this.id);
    this.getContactbyClient(this.id);
    this.addNew(null);
  }

  getClientPObyClientId(id) {
    this._clientService.getClientPoByClientId(id)
      .subscribe((res: any) => {
        console.log(res);
        this.clientpos = res.value;
        this.isLoading = false;
      })
  }

  getContactbyClient(id) {
    this._clientService.getContactbyClient(id)
      .subscribe((res: any) => {
        console.log(res);
        res.value.forEach(va => {
          this.contactList.push({ 'id': va.id, 'itemName': va.fullName })
        })
      })
  }

  addNew(eve) {
    this.clientpo = new ClientPO();
    this.selectedContactList = [];

    if (this.isJobInvoiceChild) {
      if (typeof jQuery != 'undefined') {
        jQuery('.modal').modal('hide');
        setTimeout(() => {
          //jQuery('.modal-backdrop').remove();
          if (eve == 'click')
            jQuery('#add-new-clientpo-modal').modal('show');
        }, 0)
      }
      //jQuery('#add-new-clientpo-modal').modal('show');
    }
  }

  ngAfterViewInit() {
    /*jQuery('#add-new-address-modal').on('shown.bs.modal', function () {
      jQuery('#phone').focus();
    })*/
  }

  deleteClientPo() {
    this.deleteItemIds = [];
    this.selectedRowData.forEach(rd => {
      this.deleteItemIds.push(rd.id);
    })
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
          this._clientService.deleteClientPo(this.deleteItemIds)
            .subscribe((res: any) => {

              if (res.succeeded) {
                this.deleteItemIds = [];
                this.getClientPObyClientId(this.id);

                for (var i = 0; i < this.clientpos.length; i++) {
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

  submitClientPo(form) {
    this.isSubmitForm = true;
    this.isSubmitFormSpinner = true;
    if (form.invalid) {
      //this.isSubmitForm = false;
      this.isSubmitFormSpinner = false;
    }
    else {
      this.clientpo.clientId = this.id;
      /*this.selectedContactList.forEach(re => {
        if (this.clientpo.associatedContacts)
          this.clientpo.associatedContacts = this.clientpo.associatedContacts + "|" + re.id
        else
          this.clientpo.associatedContacts = re.id + "|";
      });*/
      this.clientpo.associatedContacts = this.selectedContactList.map(e => e.id).join("|");
      console.log(this.clientpo.associatedContacts);

      if (this.clientpo.expiryDate) {
        var expiryDate = moment(this.clientpo.expiryDate, 'YYYY-MM-DD');
        this.clientpo.expiryDate = expiryDate.utcOffset(0, true).format();
      }

      this._clientService.updateClientPO(this.clientpo)
        .subscribe((res: any) => {
          this.isSubmitFormSpinner = false;
          this.isSubmitForm = false;
          if (res.succeeded) {
            this.closeAddNewModal.nativeElement.click();
            //this.router.navigate(['/client']);
            this.getClientPObyClientId(this.id);
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

  editClientPo(id) {
    this.selectedContactList = [];
    this.clientpos.forEach((item) => {
      if (item.id == id) {
        this.clientpo = item;
        if (this.clientpo.expiryDate)
          this.clientpo.expiryDate = moment(this.clientpo.expiryDate).toDate();
        if (this.clientpo.associatedContacts) {
          this.clientpo.associatedContacts.split('|').forEach((ac) => {
            this.contactList.forEach((cl) => {
              if (cl.id == ac)
                this.selectedContactList.push({ 'id': cl.id, 'itemName': cl.itemName });
            })
          })
        }
      }
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
      { header: 'PO Number', key: 'poNumber', width: 50 },
      { header: 'PO Value', key: 'poValue', width: 20 },
      { header: 'Expiry Date', key: 'expiryDate', width: 15 },
      { header: 'Job Reference', key: 'jobReference', width: 15 },
      { header: 'Additional Notes', key: 'additionalNotes', width: 30 }
    ];

    this.clientpos.forEach((am) => {
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

    var filename = "Client PO.xlsx";
    /* save to file */
    workbook.xlsx.writeBuffer().then(function (data) {
      saveAs(new Blob([data], { type: 'application/octet-stream' }), filename);
    });
  }

  checkPermission() {
    this.sharedservice.checkPermission("ClientAdmin")
      .subscribe((res: any) => {
        console.log(res);
        if (!res.succeeded) {
          swal(
            'Permission Denied',
            res.errors[0],
            'info'
          )
          return false;
        }
        else {
          return true;
        }
      })
  }

  getContactValue(con) {
    var ret = "";
    this.contactList.forEach((cl) => {
      if (cl.id == con)
        ret = cl.itemName;
    })
    return ret;
  }

  updateSelectedColumnsIndex() {
    this.selectedColumns.sort((a, b) => {
      if (a.index > b.index) return 1;
      if (a.index < b.index) return -1;
      return 0;
    })
  }
}
