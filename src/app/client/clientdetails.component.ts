import { Component, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Client } from '../models/client';
import { ClientServices } from '../services/client.services';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SecurityRights } from '../shared/enum';

declare var jQuery: any;
@Component({
  selector: 'ClientComponent',
  templateUrl: './clientdetails.component.html'
})

export class ClientDetailsComponent implements OnInit {
  isUpdateClient = false;
  client: Client;
  editClientId: number;
  //  selectedTab: string;
  selectedTab = 'clientedit';
  isLoading = true;
  hasPrivateListPermission = false;

  constructor(private activateroute: ActivatedRoute, private clientSevice: ClientServices, private securityInfoResolve: SecurityInfoResolve) {
  }

  ngOnInit() {
    this.getPermissionDetails();
    this.activateroute.params.subscribe(params => {
      if (params['id']) {
        this.isUpdateClient = true;
        this.editClientId = params['id'];
        this.getClientById(this.editClientId);
      }
      setTimeout(() => {
        this.selectedTab = 'clientedit';
        if (params['selectedtab']) this.selectedTab = params['selectedtab'];
      });
      //else this.selectedTab = 'clientjob';

      console.log(this.selectedTab);
    });
  }

  getClientById(id) {
    this.clientSevice.getAllClientbyId(id)
      .subscribe((res: any) => {
        this.client = res.value;
      });
    this.isLoading = false;
  }

  updateClient(event) {
    // console.log(event);
    // this.client = event;
    if (event) this.getClientById(this.editClientId);
  }

  getPermissionDetails() {
    this.securityInfoResolve.checkPermission(SecurityRights.PrivateListAdmin)
      .subscribe((res: any) => {
        if (res.succeeded) {
          this.hasPrivateListPermission = true;
        }
      });
  }
}
