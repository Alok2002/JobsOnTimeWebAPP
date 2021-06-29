import { Component, OnInit, Input, ViewChild, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ClientContact } from '../models/clientcontact';
import { ClientServices } from '../services/client.services';
import { SharedServices } from '../services/shared.services';
import { Client } from '../models/client';
import { mobileMask, phoneMask, postcodeMask, yearMask, phonePattern, mobilePattern } from '../app.component';
import swal from "sweetalert2";
declare var jQuery: any;

@Component({
  selector: 'ContactModalComponent',
  templateUrl: './contactmodal.component.html',
})

export class ContactModalComponent implements OnInit, OnChanges {
  phonePattern = phonePattern;
  mobilePattern = mobilePattern;
  isSubmitForm = false;
  isSubmitFormSpinner = false;
  @Input() clientId: number;
  @Input() clientcontact: ClientContact;
  @Input() isNewContact: boolean;
  @ViewChild('closeAddNewModal') closeAddNewModal;
  contactTypes = [];

  @Output() response = new EventEmitter();
  isLoading = true;

  @Input() isAccountContact: boolean;
  client: Client;

  phoneMask = phoneMask;
  mobileMask = mobileMask;
  yearMask = yearMask;
  postcodeMask = postcodeMask;

  @Input() clientJobId: number;
  jobcontacttype = [];
  jobContactType: string;
  countrycode: string = null;

  constructor(private clientSevice: ClientServices, private sharedService: SharedServices) {
    // console.log("inside constructor");
  }

  ngOnInit() {
    this.getCountryCode();
    this.getClientById();
    console.log(this.clientcontact);
    if (this.clientcontact == null) {
      // console.log("inside null")
      this.addNew();
    } else {
      this.isLoading = false;
    }
    this.getClientContactTypeList();
    // console.log(this.clientcontact);

    if (this.clientJobId != null) this.getClientJobContactTypeList();
  }

  getClientById() {
    this.clientSevice.getAllClientbyId(this.clientId)
      .subscribe((res: any) => {
        console.log(res);
        this.client = res.value;
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log("inside onchange");
    this.isLoading = true;

    this.ngOnInit();

    if (typeof jQuery != 'undefined') {
      jQuery('#add-new-contact-modal').on('shown.bs.modal', function () {
        jQuery('#contactname').focus();
      });
    }

    if (this.isNewContact) {
      this.addNew();
    }
  }

  ngDoCheck() {
    // console.log(this.clientcontact)
    if (this.clientcontact == null) {
      this.addNew();
    }

    /*if(this.isAccountContact)
      this.clientcontact.contactType = 'Accounts';*/
  }

  addNew() {
    this.clientcontact = new ClientContact();
    this.clientcontact.onlineAccessThisJob = false;
    this.clientcontact.onlineAccess = false;
    this.clientcontact.stakeholder = true;
    this.jobContactType = null;
    this.isLoading = false;
  }

  getClientContactTypeList() {
    this.sharedService.getReferenceDataProvider('ClientContactType')
      .subscribe((res: any) => {
        this.contactTypes = res.value;
        console.log(this.contactTypes);
      });
  }

  updateorCreateClientContact(form) {
    this.isSubmitForm = true;
    this.isSubmitFormSpinner = true;
    if (form.invalid) {
      //this.isSubmitForm = false;
      this.isSubmitFormSpinner = false;
    } else {
      this.clientcontact.clientId = this.clientId;

      if (this.clientcontact.phone)
        this.clientcontact.phone = this.clientcontact.phone.replace(/\D+/g, '');
      if (this.clientcontact.mobile)
        this.clientcontact.mobile = this.clientcontact.mobile.replace(/\D+/g, '');
      if (this.clientcontact.afterhours)
        this.clientcontact.afterhours = this.clientcontact.afterhours.replace(/\D+/g, '');

      this.clientcontact.clientJobId = this.clientJobId;
      this.clientcontact.jobContactType = this.jobContactType;

      console.log(this.clientcontact);

      this.clientSevice.updateClientContact(this.clientcontact)
        .subscribe((res: any) => {
          console.log(res);

          this.isSubmitFormSpinner = false;
          this.isSubmitForm = false;

          if (res.succeeded) {
            //this.clientcontact = new ClientContact();
            this.closeAddNewModal.nativeElement.click();
            this.response.emit(res);
            //this.router.navigate(['/client']);
            //this.clientcontact = null;
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

  ngAfterViewInit() {
    if (typeof jQuery != 'undefined') {
      jQuery('#add-new-contact-modal').on('shown.bs.modal', function () {
        jQuery('#contactname').focus();
      });
    }
  }

  autoUpperFirstLetter(modal) {
    if (this.clientcontact[modal]) {
      var arr = this.clientcontact[modal].split('');
      arr.forEach((cl, i) => {
        if (i == 0) arr[i] = cl.toUpperCase();
      });
      this.clientcontact[modal] = arr.join('');
    }
    //this.clientcontact[modal] = this.clientcontact[modal].charAt(0).toUpperCase();
  }

  _keyPressMaxLength(event: any, model, length) {
    if (this.clientcontact[model]) {
      var arr = this.clientcontact[model].split('');
      if (arr.length > length)
        event.preventDefault();
    }
  }

  _keyPress(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  unmask(value) {
    var ret = value.replace(/\D+/g, '');
    return ret;
  }

  getClientJobContactTypeList() {
    this.sharedService.getClientJobContactTypeList()
      .subscribe((res: any) => {
        this.jobcontacttype = res.value;
      });
  }

  getCountryCode() {
    this.sharedService.getCountryCode()
      .subscribe((res: any) => {
        console.log(res)
        this.countrycode = res.value.value;
        console.log(this.countrycode)
      })
  }
}
