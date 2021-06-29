import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { LoginAuditsComponent } from '../admin/loginaudits.component';
import { FilterModule } from './filter.module';
import { NgxMaskModule } from '../../assets/ax-npm/ngx-mask';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SecurityRights } from '../shared/enum';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';

export const route: Routes = [
  { path: '', component: LoginAuditsComponent, pathMatch: 'full', data: { securityData: SecurityRights.LoginAuditAdmin }, resolve: { securityInfo: SecurityInfoResolve } },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(route),
    NguiDatetimePickerModule,
    NgxMaskModule.forRoot(),
    FilterModule,
    TableModule,
    MultiSelectModule
  ],
  declarations: [
    LoginAuditsComponent
  ]
})

export class LoginauditsModule {
}
