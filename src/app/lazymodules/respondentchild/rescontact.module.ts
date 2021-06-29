import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { TextMaskModule } from 'angular2-text-mask';

import { NgxMaskModule } from '../../../assets/ax-npm/ngx-mask';
import { ResContactComponent } from '../../respondent/rescontact.component';
import { NumericModule } from '../numeric.module';

// import {NgxMaskModule} from 'ngx-mask';
// export const route: Routes = [
//   {path: '', component: FilterComponent}
// ];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    //RouterModule.forChild(route),
    NguiDatetimePickerModule,
    NguiAutoCompleteModule,
    NgxMaskModule.forRoot(),
    TextMaskModule,
    NumericModule
  ],
  exports: [ResContactComponent],
  declarations: [
    ResContactComponent
  ]
})

export class RescontactModule {
}
