import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { ConfigItemComponent } from '../admin/configitem.component';
import { NgxMaskModule } from '../../assets/ax-npm/ngx-mask';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SecurityRights } from '../shared/enum';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';

export const route: Routes = [
  { path: '', component: ConfigItemComponent, pathMatch: 'full', data: { securityData: SecurityRights.ConfigurationAdmin }, resolve: { securityInfo: SecurityInfoResolve } }
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
  ],
  declarations: [
    ConfigItemComponent
  ]
})

export class ConfigitemModule {
}
