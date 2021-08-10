import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { TextMaskModule } from 'angular2-text-mask';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { TagInputModule } from 'ngx-chips';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

import { NgxMaskModule } from '../../assets/ax-npm/ngx-mask';
import { SessionAllRespondents } from '../session/sessionallrespondents.component';
import { SessionCustomiseRVR } from '../session/sessioncustomiservr.component';
import { SessionDetailsComponent } from '../session/sessiondetails.component';
import { SessionEditComponent } from '../session/sessionedit.component';
import { SessionIncentiveComponent } from '../session/sessionincentive.component';
import { SessionPendingScreenerRespondents } from '../session/sessionpendingscreenerrespondents.component';
import { SessionQualifiedRespondent } from '../session/sessionqualifiedrespondent.component';
import { SessionQuota } from '../session/sessionquota.component';
import { SessionResearcherComponent } from '../session/sessionresearcher.component';
import { SessionTimeComponent } from '../session/sessiontime.component';
import { SessionVenueComponent } from '../session/sessionvenue.component';
import { SessionWaitlistRespondents } from '../session/sessionwaitlistrespondents.component';
import { EmailModule } from './child/email.module';
import { SmsModule } from './child/sms.module';
import { ClientContactModule } from './clientcontact.module';
import { ClientVenueModule } from './clientvenue.module';
import { FileuploadModule } from './fileupload.module';
import { FilterModule } from './filter.module';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { CKEditorModule } from 'ckeditor4-angular';
import { SessionConfirmationEmailComponent } from '../session/sessionconfirmationemail.component';

export const route: Routes = [
  { path: '', component: SessionDetailsComponent, pathMatch: 'full' },//NOT USE
  { path: 'add/:jobid', component: SessionDetailsComponent, pathMatch: 'full' },
  { path: 'add/:jobid/:sessionno', component: SessionDetailsComponent, pathMatch: 'full' },
  { path: 'edit/:id/:jobid', component: SessionDetailsComponent, pathMatch: 'full' },
  { path: 'edit/:id/:jobid/:tab', component: SessionDetailsComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(route),
    NguiAutoCompleteModule,
    AngularMultiSelectModule,
    TagInputModule,
    NguiDatetimePickerModule,
    FilterModule,
    FileuploadModule,
    ClientVenueModule,
    GooglePlaceModule,
    NgxMaskModule.forRoot(),
    CurrencyMaskModule,
    TextMaskModule,
    ClientContactModule,
    EmailModule,
    SmsModule,
    TableModule,
    MultiSelectModule,
    DateInputsModule,
    CKEditorModule
  ],
  declarations: [
    SessionDetailsComponent,
    SessionEditComponent,
    SessionTimeComponent,
    SessionResearcherComponent,
    SessionIncentiveComponent,
    SessionCustomiseRVR,
    SessionQualifiedRespondent,
    SessionWaitlistRespondents,
    SessionAllRespondents,
    SessionQuota,
    SessionVenueComponent,
    SessionPendingScreenerRespondents,
    SessionConfirmationEmailComponent
    //FileUpload
  ]
})

export class SessionModule {
}
