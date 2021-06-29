import { Component, OnInit, Input } from '@angular/core';
import { Router, NavigationEnd, RoutesRecognized } from '@angular/router';
import { Client } from '../models/client';
import { State } from '../models/state';
import { Category } from '../models/category';

declare var jQuery: any;
declare var $: any;
import swal from 'sweetalert2';
import { ClientServices } from '../services/client.services';
import { SharedServices } from '../services/shared.services';
import { RespondentServices } from '../services/respondent.services';

@Component({
  selector: 'CliEditComponent',
  templateUrl: './cliedit.component.html'
})

export class CliEditComponent implements OnInit {
  client: Client;
  @Input() id: number;
  @Input() isUpdateClient: boolean;
  isLoading = true;
  isSubmitFormSpinner = false;
  isSubmitForm = false;
  states: Array<State>;
  categories = [];

  postcodes = [];
  postcodesdetails = [];
  isPostSuggShow = false;

  constructor(private clientSevice: ClientServices, private router: Router,
    private sharedservice: SharedServices, private resservice: RespondentServices) { }

  ngOnInit() {
    this.getStateList();
    this.getCategoryList();

    if (this.id != null) {
      this.getClientById(this.id);
    } else {
      this.addNew();
    }

  }

  addNew() {
    this.client = new Client();
    this.client.id = 0;
    this.isLoading = false;
  }

  getClientById(id) {
    this.clientSevice.getAllClientbyId(id)
      .subscribe((res: any) => {
        console.log(res);
        this.client = res.value;
        this.isLoading = false;
      });
  }

  getStateList() {
    this.sharedservice.getStateList()
      .subscribe((res: any) => {
        this.states = res.value;
      });
  }

  getCategoryList() {
    this.sharedservice.getClientCategoryList()
      .subscribe((res: any) => {
        console.log(res);
        this.categories = res.value;
      });
  }

  getLocation(e) {
    //if(this.client.suburb.length > 4)
    this.sharedservice.getLocationPostCodes(this.client.suburb)
      .subscribe((res: any) => {
        this.postcodes = res.value;
        this.isPostSuggShow = true;
        console.log(this.postcodes);
      });
  }

  selectedCode(pc) {
    this.isPostSuggShow = false;
    this.client.suburb = pc.suburb;
    this.client.state = pc.state;
    this.client.postcode = pc.postcode;
  }

  updateorCreateClient(form) {
    this.isSubmitForm = true;
    this.isSubmitFormSpinner = true;
    if (form.invalid) {
      //this.isSubmitForm = false;
      this.isSubmitFormSpinner = false;
    } else {
      console.log(this.client);
      this.clientSevice.updateClient(this.client)
        .subscribe((res: any) => {
          console.log(res);
          if (res.succeeded) {
            swal(
              'Successfully Saved!',
              '',
              'success'
            )
            if (!this.isUpdateClient) {
              this.router.navigate(['/client/edit', res.value.id]);
            }
            this.getClientById(res.value.id);
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
}
