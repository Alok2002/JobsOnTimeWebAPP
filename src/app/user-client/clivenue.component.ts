import { SharedServices } from './../services/shared.services';
import { ClientServices } from './../services/client.services';
import { Component, OnInit, Input } from '@angular/core';
import { ClientContact } from '../models/clientcontact';
import { PtableColumn } from '../models/ptablecolumn';
import { Venue } from '../models/venue';
import { State } from '../models/state';

declare var jQuery: any;

@Component({
  selector: 'CliVenueComponent',
  templateUrl: 'clivenue.component.html'
})

export class CliVenueComponent implements OnInit {
  @Input() id: number;
  @Input() isUpdateClient: boolean;

  noofrows = 99999;
  selectedColumns: Array<PtableColumn> = [];
  cols: Array<PtableColumn> = [];
  selectedRowData = [];
  ptablesearch: string;
  isLoading = true;

  venues: Array<Venue> = [];
  states: Array<State> = [];

  constructor(private _clientService: ClientServices, private sharedservice: SharedServices) { }

  ngOnInit() {
    this.cols = [
      { field: 'venueName', header: 'Venue Name', width: '250', sort: false, index: 0 },
      // { field: 'global', header: 'Global', width: '75', sort: false, index: 1 },
      { field: 'contactName', header: 'Venue Contact Name', width: '200', sort: false, index: 2 },
      { field: 'address', header: 'Address', width: 'auto', sort: false, index: 3 },
      { field: 'suburb', header: 'Suburb', width: '100', sort: false, index: 4 },
      { field: 'postcode', header: 'Postcode', width: '100', sort: false, index: 5 },
      { field: 'state', header: 'State', width: '75', sort: false, index: 6 },
      { field: 'formattedPhone', header: 'Phone', width: '100', sort: false, index: 7 },
      { field: 'formattedMobile', header: 'Mobile', width: '100', sort: false, index: 8 },
      { field: 'location', header: 'Location Url', width: '250', sort: false, index: 9 },
    ];
    this.selectedColumns = this.cols;

    this.getVenuebyClient(this.id);
    console.log(this.venues);
    this.getStateList();
  }

  getVenuebyClient(id) {
    this._clientService.getVenuebyClient(id)
      .subscribe((res: any) => {
        console.log(res);
        this.venues = res.value;
        console.log(this.venues);
      });
  }

  getStateList() {
    this.sharedservice.getStateList()
      .subscribe((res: any) => {
        this.states = res.value;
      });
  }
  
  updateSelectedColumnsIndex() {
    this.selectedColumns.sort((a, b) => {
      if (a.index > b.index) return 1;
      if (a.index < b.index) return -1;
      return 0;
    })
  }

  editVenue() {

  }
}
