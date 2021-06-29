import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';

import { NgxMaskModule } from '../../assets/ax-npm/ngx-mask';
import { CliPrivateListComponent } from '../user-client/cliprivatelist.component';
import { FileuploadModule } from './fileupload.module';

export const route: Routes = [
  { path: '', component: CliPrivateListComponent, pathMatch: 'full' },//NOT USE
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
    FileuploadModule,
  ],
  declarations: [
    CliPrivateListComponent,
  ]
})

export class CliPrivateListModule {
}
