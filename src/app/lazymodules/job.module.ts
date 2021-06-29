import { FilterMobileModule } from './filtermobile.module';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OrderBy } from '../pipes/order.pipe';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { TagInputModule } from 'ngx-chips';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { FileUpload } from '../shared/ng2-fileupload/src/file-upload.component';
import { FilterModule } from './filter.module';
import { JobComponent } from '../job/job.component';
import { JobDetailsComponent } from '../job/jobdetails.component';
import { OrderbyModule } from './orderby.module';
import { JobEditComponent } from '../job/jobedit.component';
import { JobContactComponent } from '../job/jobcontact.component';
import { JobSessionComponent } from '../job/jobsession.component';
import { JobIncentiveComponent } from '../job/jobincentive.component';
import { JobQuotaComponent } from '../job/jobquota.component';
import { JobTimeAllocationComponent } from '../job/jobtimeallocation.component';
import { JobDocumentComponent } from '../job/jobdocument.component';
import { JobAllRespondentComponent } from '../job/joballrespondent.component';
import { JobInvoiceComponent } from '../job/jobinvoice.component';
import { JobStandbyRespondentComponent } from '../job/jobstandbyrespondent.component';
import { JobInvitationEmailComponent } from '../job/jobinvitationemail.component';
import { ClientContactModule } from './clientcontact.module';
import { FileuploadModule } from './fileupload.module';
import { NgxMaskModule } from '../../assets/ax-npm/ngx-mask';

import { CurrencyMaskModule } from 'ng2-currency-mask';
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask/src/currency-mask.config';
import { customCurrencyMaskConfig } from '../app.module';
import { JobDurationComponent } from '../job/jobduration.component';
import { ClientPOModule } from './clientpo.module';
import { TextMaskModule } from 'angular2-text-mask';
import { JobVenueComponent } from '../job/jobvenue.component';
import { ClientVenueModule } from './clientvenue.module';
import { NgxTypeaheadModule } from 'ngx-typeahead';
import { JobComponentModule } from "./child/jobcomponent.module";
import { JobSessionComponentModule } from "./child/jobsessioncomponent.module";
import { JobQueriesComponent } from "../job/jobqueries.component";
import { EmailModule } from "./child/email.module";
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SecurityRights } from '../shared/enum';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { JobPotentialComponent } from '../job/jobpotential.component';
import { JobInvoiceMyObRedirectComponent } from '../job/jobinvoicemyobredirect.component';
import { NoCommaPipe } from '../pipes/nocomma.pipe';
import { JobPrivateListComponent } from '../job/jobprivatelist.component';
import { CKEditorModule } from 'ckeditor4-angular';

export const route: Routes = [
  { path: '', component: JobComponent, pathMatch: 'full', data: { securityData: SecurityRights.JobAdmin }, resolve: { securityInfo: SecurityInfoResolve } },
  { path: 'add', component: JobDetailsComponent, pathMatch: 'full', data: { securityData: SecurityRights.JobAdmin }, resolve: { securityInfo: SecurityInfoResolve } },
  { path: 'add/:clientid', component: JobDetailsComponent, pathMatch: 'full', data: { securityData: SecurityRights.JobAdmin }, resolve: { securityInfo: SecurityInfoResolve } },
  { path: 'edit/:id', component: JobDetailsComponent, pathMatch: 'full', data: { securityData: SecurityRights.JobAdmin }, resolve: { securityInfo: SecurityInfoResolve } },
  { path: 'edit/:id/:selectedtab', component: JobDetailsComponent, pathMatch: 'full', data: { securityData: SecurityRights.JobAdmin }, resolve: { securityInfo: SecurityInfoResolve } },
  { path: 'myobcallback', component: JobInvoiceMyObRedirectComponent, pathMatch: 'full', data: { securityData: SecurityRights.JobAdmin }, resolve: { securityInfo: SecurityInfoResolve } },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(route),
    NguiAutoCompleteModule,
    AngularMultiSelectModule,
    TagInputModule,
    GooglePlaceModule,
    NguiDatetimePickerModule,
    NgxMaskModule.forRoot(),
    FilterModule,
    OrderbyModule,
    ClientContactModule,
    FileuploadModule,
    CurrencyMaskModule,
    ClientPOModule,
    TextMaskModule,
    ClientVenueModule,
    NgxTypeaheadModule,
    JobComponentModule,
    JobSessionComponentModule,
    EmailModule,
    TableModule,
    MultiSelectModule,
    DateInputsModule,
    FilterMobileModule,
    CKEditorModule
  ],
  declarations: [
    JobDetailsComponent,
    JobEditComponent,
    JobContactComponent,
    JobIncentiveComponent,
    JobQuotaComponent,
    JobTimeAllocationComponent,
    JobDocumentComponent,
    JobAllRespondentComponent,
    JobInvoiceComponent,
    JobStandbyRespondentComponent,
    JobInvitationEmailComponent,
    JobDurationComponent,
    JobVenueComponent,
    JobQueriesComponent,
    JobPotentialComponent,
    JobInvoiceMyObRedirectComponent,
    NoCommaPipe,
    JobPrivateListComponent
  ],
  providers: [{ provide: CURRENCY_MASK_CONFIG, useValue: customCurrencyMaskConfig }]
})

export class JobModule {
}
