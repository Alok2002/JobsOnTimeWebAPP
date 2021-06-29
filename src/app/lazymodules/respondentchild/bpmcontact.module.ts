import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { TextMaskModule } from 'angular2-text-mask';
import { NgxMaskModule } from '../../../assets/ax-npm/ngx-mask';
import { BPMContactComponent } from '../../respondent/newbusinesspanelmember/bpmcontact.component';
import { NumericModule } from '../numeric.module';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';

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
  exports: [BPMContactComponent],
  declarations: [
    BPMContactComponent
  ]
})

export class BpmcontactModule {
}
