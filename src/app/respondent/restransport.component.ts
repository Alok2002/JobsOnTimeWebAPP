import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import swal from 'sweetalert2';

import { yearMask } from '../app.component';
import { Respondent } from '../models/respondent';
import { RespondentServices } from '../services/respondent.services';
import { SharedServices } from './../services/shared.services';

declare var jQuery: any;

@Component({
  selector: 'ResTransportComponent',
  templateUrl: './restransport.component.html'
})

export class ResTransportComponent implements OnInit {
  @Input() resId: number;
  @Input() isMyProfile = false;

  isLoading = true;
  respondent: Respondent;
  vehicleFinancesList = [];
  vehicleLicenceTypesList = [];
  vehicleSalesMethodsList = [];
  transportationModesList = [];
  publicTransportTypesList = [];
  rideShareServicesList = [];
  vehicleMakeList = [];
  vehicleModelsList = [];
  vehicleTypesList = [];
  today = new Date();

  vehicletypelist = [];
  vehiclemakelist = [];

  isSubmitForm = false;

  yearMask = yearMask;
  @ViewChild('resTransportForm') resTransportForm;

  constructor(private respondentservice: RespondentServices, private sharedservice: SharedServices,
    @Inject(PLATFORM_ID) public platformId: Object) {
  }

  ngOnInit() {
    if (this.resId) {
      this.respondentservice.getRespondentById(this.resId)
        .subscribe((res: any) => {
          this.respondent = res.value;
          // this.respondent.vehicle1IsNew = false;
          // this.respondent.vehicle2IsNew = false;
          console.log(this.respondent);
        });
    }
    else {
      this.respondent = new Respondent();
    }

    this.getData();
    this.getvehicletypelist();
    this.getvehiclemakelist();
  }

  getvehicletypelist() {
    this.respondentservice.getRespondentData('VehicleTypes', this.resId)
      .subscribe((res: any) => {
        this.vehicletypelist = res.value;
        console.log(res);
      })
    /*this.respondentservice.getVehicleTypeList()
      .subscribe(res => {
        this.vehicletypelist = res.value;
        console.log(this.vehicletypelist);
      });*/
  }

  getvehiclemakelist() {
    this.respondentservice.getRespondentData('VehicleMake', this.resId)
      .subscribe((res: any) => {
        this.vehiclemakelist = res.value;
        console.log(res);
      });
  }

  getData() {
    this.respondentservice.getRespondentData('VehicleFinances', this.resId)
      .subscribe((res: any) => {
        this.vehicleFinancesList = res.value;
        console.log(res);
      });
    this.respondentservice.getRespondentData('VehicleLicenceTypes', this.resId)
      .subscribe((res: any) => {
        this.vehicleLicenceTypesList = res.value;
        console.log(res);
      });
    this.respondentservice.getRespondentData('VehicleSalesMethods', this.resId)
      .subscribe((res: any) => {
        this.vehicleSalesMethodsList = res.value;
        console.log(res);
      });
    this.respondentservice.getRespondentData('TransportationModes', this.resId)
      .subscribe((res: any) => {
        this.transportationModesList = res.value;
        console.log(res);
      });
    this.respondentservice.getRespondentData('PublicTransportTypes', this.resId)
      .subscribe((res: any) => {
        this.publicTransportTypesList = res.value;
        console.log(res);
      });
    this.respondentservice.getRespondentData('RideShareServices', this.resId)
      .subscribe((res: any) => {
        this.rideShareServicesList = res.value;
        console.log(res);
      });
    this.respondentservice.getRespondentData('VehicleMake', this.resId)
      .subscribe((res: any) => {
        this.vehicleMakeList = res.value;
        console.log(res);
      });
    this.respondentservice.getRespondentData('VehicleModels', this.resId)
      .subscribe((res: any) => {
        this.vehicleModelsList = res.value;
        console.log(res);
      });
    this.respondentservice.getRespondentData('VehicleTypes', this.resId)
      .subscribe((res: any) => {
        this.vehicleTypesList = res.value;
        console.log(res);
        this.isLoading = false;
      });
  }

  updateSubmit(form) {
    this.isSubmitForm = true;
    if (form.invalid) {
      console.log(form);
      //this.isSubmitForm = false;
    } else {

      this.respondentservice.updateReferenceData('VehicleFinances', this.vehicleFinancesList, this.resId)
        .subscribe(res => {
          console.log(res);
        });

      this.respondentservice.updateReferenceData('VehicleLicenceTypes', this.vehicleLicenceTypesList, this.resId)
        .subscribe(res => {
          console.log(res);
        });

      this.respondentservice.updateReferenceData('VehicleSalesMethods', this.vehicleSalesMethodsList, this.resId)
        .subscribe(res => {
          console.log(res);
        });

      this.respondentservice.updateReferenceData('TransportationModes', this.transportationModesList, this.resId)
        .subscribe(res => {
          console.log(res);
        });

      this.respondentservice.updateReferenceData('PublicTransportTypes', this.publicTransportTypesList, this.resId)
        .subscribe(res => {
          console.log(res);
        });

      this.respondentservice.updateReferenceData('RideShareServices', this.rideShareServicesList, this.resId)
        .subscribe(res => {
          console.log(res);
        });

      this.respondentservice.updateReferenceData('VehicleMake', this.vehicleMakeList, this.resId)
        .subscribe(res => {
          console.log(res);
        });

      this.respondentservice.updateReferenceData('VehicleModels', this.vehicleModelsList, this.resId)
        .subscribe(res => {
          console.log(res);
        });

      this.respondentservice.updateReferenceData('VehicleTypes', this.vehicleTypesList, this.resId)
        .subscribe(res => {
          console.log(res);
        });

      this.respondentservice.updateRespondent(this.respondent)
        .subscribe((res: any) => {
          console.log(res);
          if (res.succeeded) {
            swal(
              'Successfully Saved!',
              '',
              'success'
            );
          }
          else {
            var err = '';
            res.errors.forEach((er) => {
              err = err + ' ' + er;
            });
            swal(
              'Error!',
              err,
              'error'
            );
          }
          this.respondent = res.value;
        });
    }
  }

  unmask(value) {
    var ret = value.replace(/\D+/g, '');
    return ret;
  }

  gotoTop() {
    if (isPlatformBrowser(this.platformId)) {
        window.scrollTo(0, 0)
    }
  }
}
