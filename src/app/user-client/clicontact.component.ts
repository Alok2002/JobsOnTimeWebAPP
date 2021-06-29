import { ClientServices } from './../services/client.services';
import { Component, OnInit, Input } from '@angular/core';
import { ClientContact } from '../models/clientcontact';
import { PtableColumn } from '../models/ptablecolumn';

declare var jQuery: any;

@Component({
  selector: 'CliContactComponent',
  templateUrl: './clicontact.component.html'
})

export class CliContactComponent implements OnInit {
  @Input() id: number;
  @Input() isUpdateClient: boolean;
  @Input() isAccountContact: boolean;

  clientcontact: ClientContact;
  clientcontacts: Array<ClientContact>;

  noofrows = 99999;
  selectedColumns: Array<PtableColumn> = [];
  cols: Array<PtableColumn> = [];
  selectedRowData = [];
  ptablesearch: string;
  isLoading = true;

  constructor(private clientSevice: ClientServices) { }

  ngOnInit() {
    this.cols = [
      { field: 'fullName', header: 'Name', index: 0, width: '250', sort: true },
      { field: 'contactType', header: 'Contact Position', index: 1, width: '200', sort: true },
      { field: 'formattedPhone', header: 'Phone', index: 2, width: '100', sort: false },
      { field: 'formattedMobile', header: 'Mobile', index: 3, width: '100', sort: false },
      { field: 'formattedAfterhours', header: 'After Hours', index: 4, width: '100', sort: false },
      { field: 'emailAddress', header: 'Email Address', index: 5, width: 'auto', sort: false },
      { field: 'onlineAccess', header: 'Online Access', index: 6, width: '125', sort: false, textAlign: 'center' },
      // { field: 'comment', header: 'Comment', index: 7, width: 'auto', sort: false },
    ];

    this.selectedColumns = this.cols;

    console.log(this.id)
    console.log(this.isUpdateClient)
    if (this.id != null && this.isUpdateClient) {
      this.getClientContactsByClientId(this.id);
    }
  }

  getClientContactsByClientId(id) {
    if (this.isAccountContact) {
      this.clientSevice.getAccountContactByClient(id)
        .subscribe((res: any) => {
          console.log(res)
          this.clientcontacts = res.value;
          this.isLoading = false;
        })
    }
    else {
      this.clientSevice.getContactbyClient(id)
        .subscribe((res: any) => {
          this.clientcontacts = res.value;
          this.isLoading = false;
        });
    }
  }

  updateSelectedColumnsIndex() {
    this.selectedColumns.sort((a, b) => {
      if (a.index > b.index) return 1;
      if (a.index < b.index) return -1;
      return 0;
    })
  }

  editContact(id) {
    // this.isContactModel = true;
    // this.clientcontacts.forEach((item) => {
    //   if (item.id == id) {
    //     this.selectedClientContact = item;
    //   }
    // });
  }
}

