import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';

import { NgxMaskModule } from '../../assets/ax-npm/ngx-mask';
import { CliFeedbackComponent } from '../user-client/clifeedback.component';

export const route: Routes = [
  { path: '', component: CliFeedbackComponent, pathMatch:'full' },//NOT USE
  { path: 'clifeedback', component: CliFeedbackComponent, pathMatch:'full' },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(route),
    NguiDatetimePickerModule,
    NgxMaskModule.forRoot(),
  ],
  declarations: [
    CliFeedbackComponent
  ]
})

export class ClifeedbackModule {
}
