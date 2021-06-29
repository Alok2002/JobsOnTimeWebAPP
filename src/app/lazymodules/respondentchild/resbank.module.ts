import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { TextMaskModule } from 'angular2-text-mask';

import { NgxMaskModule } from '../../../assets/ax-npm/ngx-mask';
import { ResBankComponent } from '../../respondent/resbank.component';
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
    NguiAutoCompleteModule,
    TextMaskModule,
    NumericModule
  ],
  exports: [ResBankComponent],
  declarations: [
    ResBankComponent
  ]
})

export class ResbankModule {
}
