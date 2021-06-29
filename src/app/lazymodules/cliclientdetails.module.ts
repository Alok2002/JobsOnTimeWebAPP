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
import { CliClientDetailsComponent } from '../user-client/cliclientdetails.component';
import { CliContactComponent } from '../user-client/clicontact.component';
import { CliVenueComponent } from '../user-client/clivenue.component';
import { CliEditComponent } from '../user-client/cliedit.component';
import { CliAddressComponent } from '../user-client/cliaddress.component';

export const route: Routes = [
  { path: '', component: CliClientDetailsComponent, pathMatch: 'full' },//NOT USE  
  { path: 'edit/:id', component: CliClientDetailsComponent, pathMatch: 'full' },
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
    CliClientDetailsComponent,
    CliContactComponent,
    CliVenueComponent,
    CliEditComponent,
    CliAddressComponent
  ]
})

export class CliClientDetailsModule {
}
