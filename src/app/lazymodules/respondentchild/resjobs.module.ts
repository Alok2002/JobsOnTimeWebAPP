import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';

import { NgxMaskModule } from '../../../assets/ax-npm/ngx-mask';
import { ResJobsComponent } from '../../respondent/resjobs.component';
import { EventModalModule } from '../child/eventmodal.module';
import { FilterModule } from '../filter.module';
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
    NguiAutoCompleteModule,
    NgxMaskModule.forRoot(),
    FilterModule,
    OrderbyModule,
    EventModalModule,
    RouterModule,
    TableModule,
    MultiSelectModule
  ],
  exports: [ResJobsComponent],
  declarations: [
    ResJobsComponent
  ]
})

export class ResjobsModule {
}
