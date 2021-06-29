import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { LicenceComponent } from '../admin/licence.component';
import { NgxMaskModule } from '../../assets/ax-npm/ngx-mask';
import { TextMaskModule } from 'angular2-text-mask';
import { NumericModule } from './numeric.module';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SecurityRights } from '../shared/enum';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';

export const route: Routes = [
  { path: '', component: LicenceComponent, pathMatch: 'full', data: { securityData: SecurityRights.ResearchMeLicence }, resolve: { securityInfo: SecurityInfoResolve } }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(route),
    NguiDatetimePickerModule,
    NgxMaskModule.forRoot(),
    TextMaskModule,
    NumericModule,
    TableModule,
    MultiSelectModule,
    DateInputsModule
  ],
  declarations: [
    LicenceComponent
  ]
})

export class LicenceModule {
}
