import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';

import { NgxMaskModule } from '../../../assets/ax-npm/ngx-mask';
import { ResLoyalteeComponent } from '../../respondent/resloyaltee.component';

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
    NguiAutoCompleteModule
  ],
  exports: [ResLoyalteeComponent],
  declarations: [
    ResLoyalteeComponent
  ]
})

export class ResloyalteeModule {
}
