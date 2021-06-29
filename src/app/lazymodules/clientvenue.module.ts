import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { VenueModalComponent } from '../shared/venuemodal.component';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { NgxMaskModule } from '../../assets/ax-npm/ngx-mask';
import { TextMaskModule } from 'angular2-text-mask';
import { NumericModule } from './numeric.module';

// export const route: Routes = [
//   {path: '', component: FilterComponent}
// ];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    //RouterModule.forChild(route),
    NguiDatetimePickerModule,
    GooglePlaceModule,
    NgxMaskModule.forRoot(),
    TextMaskModule,
    NumericModule
  ],
  exports: [VenueModalComponent],
  declarations: [
    VenueModalComponent
  ]
})

export class ClientVenueModule {
}
