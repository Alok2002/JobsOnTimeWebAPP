import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { NgxMaskModule } from '../../assets/ax-npm/ngx-mask';
import { CliDocComponent } from '../user-client/clidoc.component';
import { CliJobsComponent } from '../user-client/clijobs.component';
import { CliJobsDetailsComponent } from '../user-client/clijobsdetails.component';
import { FileuploadModule } from './fileupload.module';

export const route: Routes = [
  { path: '', component: CliJobsComponent, pathMatch: 'full' },//NOT USE
  { path: 'clijobs', component: CliJobsComponent, pathMatch: 'full' },
  { path: 'edit/:id', component: CliJobsDetailsComponent, pathMatch: 'full' },
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
    CliJobsComponent,
    CliJobsDetailsComponent,
    CliDocComponent
  ]
})

export class ClijobsModule {
}
