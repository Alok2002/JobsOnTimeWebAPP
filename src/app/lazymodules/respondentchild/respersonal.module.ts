import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { TextMaskModule } from 'angular2-text-mask';

import { NgxMaskModule } from '../../../assets/ax-npm/ngx-mask';
import { ResPersonalComponent } from '../../respondent/respersonal.component';
import { NumericModule } from '../numeric.module';

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
  exports: [ResPersonalComponent],
  declarations: [
    ResPersonalComponent
  ]
})

export class RespersonalModule {
}
