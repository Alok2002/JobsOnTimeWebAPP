import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { ContactModalComponent } from '../shared/contactmodal.component';
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
    NgxMaskModule.forRoot(),
    TextMaskModule,
    NumericModule
  ],
  exports: [ContactModalComponent],
  declarations: [
    ContactModalComponent
  ]
})

export class ClientContactModule {
}
