import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { CliHomeComponent } from '../user-client/clihome.component';
import { NgxMaskModule } from '../../assets/ax-npm/ngx-mask';
import { SafeHtmlPipeModule } from './safehtmlpipe.module';

export const route: Routes = [
  { path: '', component: CliHomeComponent, pathMatch: 'full', data: { pagetitle: 'Home' } },//NOT USE
  { path: 'clihome', component: CliHomeComponent, pathMatch: 'full', data: { pagetitle: 'Home' } },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(route),
    NguiDatetimePickerModule,
    NgxMaskModule.forRoot(),
    SafeHtmlPipeModule
  ],
  declarations: [
    CliHomeComponent
  ]
})

export class ClihomeModule {
}
