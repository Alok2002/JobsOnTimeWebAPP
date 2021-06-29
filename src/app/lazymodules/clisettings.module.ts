import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';

import { NgxMaskModule } from '../../assets/ax-npm/ngx-mask';
import { CliSettingsComponent } from '../user-client/clisettings.component';

export const route: Routes = [
  { path: '', component: CliSettingsComponent, pathMatch:'full' },//NOT USE
  { path: 'settings', component: CliSettingsComponent, pathMatch: 'full' },
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
    CliSettingsComponent
  ]
})

export class CliSettingsModule {
}
