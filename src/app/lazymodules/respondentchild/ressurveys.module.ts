import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';

import { NgxMaskModule } from '../../../assets/ax-npm/ngx-mask';
import { ResSurveysComponent } from '../../respondent/ressurveys.component';
import { FilterModule } from '../filter.module';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';

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
    NguiAutoCompleteModule,
    FilterModule,
    RouterModule,
    TableModule,
    MultiSelectModule
  ],
  exports: [ResSurveysComponent],
  declarations: [
    ResSurveysComponent
  ]
})

export class RessurveysModule {
}
