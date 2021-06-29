import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';

import { NgxMaskModule } from '../../assets/ax-npm/ngx-mask';
import { ResSessionComponent } from '../user-res/ressession.component';
import { SafeHtmlPipeModule } from './safehtmlpipe.module';
import { SafepipeModule } from './safepipe.module';

export const route: Routes = [
  { path: '', component: ResSessionComponent, pathMatch: 'full', data: { pagetitle: 'My Sessions' } },//NOT USE
  { path: 'ressession/:id', component: ResSessionComponent, pathMatch: 'full', data: { pagetitle: 'My Sessions' } },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(route),
    NguiDatetimePickerModule,
    NgxMaskModule.forRoot(),
    TableModule,
    MultiSelectModule,
    SafeHtmlPipeModule,
    SafepipeModule
  ],
  declarations: [
    ResSessionComponent
  ]
})

export class RessessionModule {
}
