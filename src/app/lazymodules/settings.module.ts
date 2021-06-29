import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { NgOtpInputModule } from 'ng-otp-input';
import { NgxMaskModule } from '../../assets/ax-npm/ngx-mask';
import { SettingsComponent } from '../shared/settings.component';
import { SafepipeModule } from './safepipe.module';

export const route: Routes = [
  { path: '', component: SettingsComponent, pathMatch: 'full', data: { pagetitle: 'My Settings' } },//NOT USE
  { path: 'settings', component: SettingsComponent, pathMatch: 'full', data: { pagetitle: 'My Settings' } },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(route),
    NguiDatetimePickerModule,
    NgxMaskModule.forRoot(),
    SafepipeModule,
    NgOtpInputModule
  ],
  declarations: [
    SettingsComponent
  ]
})

export class SettingsModule {
}
