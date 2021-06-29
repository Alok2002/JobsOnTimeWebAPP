import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';

import { NgxMaskModule } from '../../assets/ax-npm/ngx-mask';
import { TypeSwitchComponent } from '../user/typeswitch.component';

export const route: Routes = [
  { path: '', component: TypeSwitchComponent, pathMatch:'full' },//NOT USE
  { path: 'typeswitch', component: TypeSwitchComponent, pathMatch:'full' },
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
    TypeSwitchComponent
  ]
})

export class TypeswitchModule {
}
