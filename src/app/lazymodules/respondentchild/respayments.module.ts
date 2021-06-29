import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { TextMaskModule } from 'angular2-text-mask';

import { NgxMaskModule } from '../../../assets/ax-npm/ngx-mask';
import { ResPaymentsComponent } from '../../respondent/respayments.component';
import { EventModalModule } from '../child/eventmodal.module';
import { FilterModule } from '../filter.module';
import { NumericModule } from '../numeric.module';
import { OrderbyModule } from '../orderby.module';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';

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
    FilterModule,
    OrderbyModule,
    TextMaskModule,
    NumericModule,
    EventModalModule,
    TableModule,
    MultiSelectModule
  ],
  exports: [ResPaymentsComponent],
  declarations: [
    ResPaymentsComponent
  ]
})

export class RespaymentsModule {
}
