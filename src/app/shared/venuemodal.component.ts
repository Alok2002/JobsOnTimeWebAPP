import { Component, OnInit, Input, ViewChild, Output, EventEmitter, OnChanges } from '@angular/core';
import { ClientContact } from "../models/clientcontact";
import { ClientServices } from "../services/client.services";
import { SharedServices } from "../services/shared.services";
import { Venue } from "../models/venue";
import { mobileMask, phoneMask, postcodeMask, phonePattern, mobilePattern, postcodePattern } from '../app.component';
import swal from "sweetalert2";
declare var jQuery: any;

@Component({
  selector: 'VenueModalComponent',
  templateUrl: './venuemodal.component.html',
})

export class VenueModalComponent implements OnInit, OnChanges {
  phonePattern = phonePattern;
  mobilePattern = mobilePattern;
  postcodePattern = postcodePattern;
  isSubmitForm = false;
  isSubmitFormSpinner = false;
  @Input() clientId: number;
  @Input() venue: Venue;
  @Input() isNewVenue: boolean;
  @ViewChild("closeAddNewModal") closeAddNewModal;

  @Output() response = new EventEmitter();
  isLoading = true;
  postcodes = [];
  isPostSuggShow = false;
  stateslist = [];

  phoneMask = phoneMask;
  mobileMask = mobileMask;
  postcodeMask = postcodeMask;

  @Input() clientJobId: number;
  countrycode: string = "AU";

  constructor(private clientSevice: ClientServices, private sharedService: SharedServices) { }

  ngOnInit() {
    this.getStates();
    if (this.venue == null) {
      this.addNew();
    } else {
      this.isLoading = false;
    }
    console.log(this.venue);

    this.initFocus();
    this.getCountryCode();
  }

  /*getCountryCode() {
    this.sharedService.getCountryCode()
      .subscribe((res: any) => {
        console.log(res)
        this.countrycode = res.value.value;
      })
  }*/

  ngOnChanges() {
    this.isLoading = true;
    this.ngOnInit();

    if (this.isNewVenue || !this.venue) {
      this.addNew();
    }
  }

  addNew() {
    this.venue = new Venue();
    this.venue.state = null;
    this.isLoading = false;
  }

  submitVenue(form) {
    this.isSubmitForm = true;
    this.isSubmitFormSpinner = true;
    if (form.invalid) {
      //this.isSubmitForm = false;
      this.isSubmitFormSpinner = false;
    }
    else {
      this.venue.clientId = this.clientId;
      if (this.venue.phone)
        this.venue.phone = this.venue.phone.replace(/\D+/g, '');
      if (this.venue.mobile)
        this.venue.mobile = this.venue.mobile.replace(/\D+/g, '');


      this.venue.clientJobId = this.clientJobId;
      this.clientSevice.updateClientVenue(this.venue)
        .subscribe((res: any) => {
          console.log(res);
          this.isSubmitFormSpinner = false;
          this.isSubmitForm = false;

          if (res.succeeded) {
            this.closeAddNewModal.nativeElement.click();
            //this.router.navigate(['/client']);
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

          this.response.emit(res);
        });
    }
  }

  getLocation(e) {
    //if(this.client.suburb.length > 4)
    this.sharedService.getLocationPostCodes(this.venue.suburb)
      .subscribe((res: any) => {
        this.postcodes = res.value;
        this.isPostSuggShow = true;
        console.log(this.postcodes);
      });
  }

  selectedCode(pc) {
    this.isPostSuggShow = false;
    this.venue.suburb = pc.suburb;
    this.venue.state = pc.state;
    this.venue.postcode = pc.postcode;
  }

  initFocus() {
    if (typeof jQuery != 'undefined') {
      jQuery('#add-new-venue-modal').on('shown.bs.modal', function () {
        jQuery('#venue').focus();
      })
    }
  }

  public handleAddressChange(address) {
    // Do some stuff
    console.log(address);
    address.address_components.forEach(ad => {
      ad.types.forEach(ty => {
        if (ty == 'postal_code')
          this.venue.postcode = ad.short_name;
        if (ty == 'administrative_area_level_1')
          this.venue.state = ad.short_name;
        if (ty == 'locality')
          this.venue.suburb = ad.short_name;
      });
    });

    if (address.formatted_address)
      this.venue.address = address.formatted_address.split(',')[0];
  }

  getStates() {
    this.sharedService.getStates()
      .subscribe((re: any) => {
        console.log(re);
        this.stateslist = re.value;
      })
  }

  autoUpperFirstLetter(modal) {
    if (this.venue[modal]) {
      var arr = this.venue[modal].split('');
      arr.forEach((cl, i) => {
        if (i == 0) arr[i] = cl.toUpperCase();
      });
      this.venue[modal] = arr.join('');
    }
    //this.clientcontact[modal] = this.clientcontact[modal].charAt(0).toUpperCase();
  }

  unmask(value) {
    var ret = value.replace(/\D+/g, '');
    return ret;
  }

  getCountryCode() {
    if (typeof window != 'undefined') {
      if (window.location.hostname.toLowerCase().indexOf('prime') > -1) {
        this.countrycode = 'NZ';
      }
    }
  }
}
