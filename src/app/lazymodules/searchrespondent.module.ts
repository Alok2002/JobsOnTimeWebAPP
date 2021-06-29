import { FilterMobileModule } from './filtermobile.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { TagInputModule } from 'ngx-chips';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { NgxMaskModule } from '../../assets/ax-npm/ngx-mask';
import { PanelMemberComponent } from '../respondent/panelmember.component';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SecurityRights } from '../shared/enum';
import { EmailModule } from './child/email.module';
import { EventModalModule } from './child/eventmodal.module';
import { SmsModule } from './child/sms.module';
import { FilterModule } from './filter.module';
import { OrderbyModule } from './orderby.module';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';

export const route: Routes = [
  { path: '', component: PanelMemberComponent, pathMatch: 'full' },//NOT USE data: { securityData: SecurityRights.RespondentAdmin }, resolve: { securityInfo: SecurityInfoResolve }
  { path: ':resid', component: PanelMemberComponent, pathMatch: 'full' },
  { path: 'filter/:filterid', component: PanelMemberComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(route),
    NguiDatetimePickerModule,
    NguiAutoCompleteModule,
    AngularMultiSelectModule,
    TagInputModule,
    GooglePlaceModule,
    FilterModule,
    OrderbyModule,
    NgxMaskModule.forRoot(),
    EmailModule,
    SmsModule,
    EventModalModule,
    TableModule,
    MultiSelectModule,
    FilterMobileModule
  ],
  declarations: [
    PanelMemberComponent
  ]
})

export class SearchrespondentModule {
}
