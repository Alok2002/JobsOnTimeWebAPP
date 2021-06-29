import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { TagInputModule } from 'ngx-chips';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { NgxMaskModule } from '../../assets/ax-npm/ngx-mask';
import { NewRespondentComponent } from '../respondent/newrespondent.component';
import { FilterModule } from './filter.module';
import { OrderbyModule } from './orderby.module';
import { ResbankModule } from './respondentchild/resbank.module';
import { ResbankingModule } from './respondentchild/resbanking.module';
import { RescontactModule } from './respondentchild/rescontact.module';
import { ResfamilyModule } from './respondentchild/resfamily.module';
import { ResfinanceModule } from './respondentchild/resfinance.module';
import { ReshealthModule } from './respondentchild/reshealth.module';
import { ResinsuranceModule } from './respondentchild/resinsurance.module';
import { ResjobsModule } from './respondentchild/resjobs.module';
import { ResloyalteeModule } from './respondentchild/resloyaltee.module';
import { ResoccupationModule } from './respondentchild/resoccupation.module';
import { ResotherModule } from './respondentchild/resother.module';
import { RespaymentsModule } from './respondentchild/respayments.module';
import { RespersonalModule } from './respondentchild/respersonal.module';
import { ResphoneModule } from './respondentchild/resphone.module';
import { ResresearchModule } from './respondentchild/resresearch.module';
import { ResservicesModule } from './respondentchild/resservices.module';
import { RessocialModule } from './respondentchild/ressocial.module';
import { RessurveysModule } from './respondentchild/ressurveys.module';
import { RestechnologyModule } from './respondentchild/restechnology.module';
import { RestelecommunicationModule } from './respondentchild/restelecommunication.module';
import { RestransportModule } from './respondentchild/restransport.module';
import { RestravelModule } from './respondentchild/restravel.module';
import { ResvehicleModule } from './respondentchild/resvehicle.module';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { RescustomfieldsModule } from './respondentchild/rescustomfields.module';

export const route: Routes = [
  {path: '', component: NewRespondentComponent, pathMatch: 'full'},//NOT USE
  {path: 'newrespondents', component: NewRespondentComponent, pathMatch: 'full'},
  {path: 'respondent/:resid', component: NewRespondentComponent, pathMatch: 'full'}
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(route),
    NguiDatetimePickerModule,
    //Ng2AutoCompleteModule,
    AngularMultiSelectModule,
    TagInputModule,
    GooglePlaceModule,
    FilterModule,
    OrderbyModule,
    NgxMaskModule.forRoot(),

    RespaymentsModule,
    RescontactModule,
    RespersonalModule,
    ResresearchModule,
    ResoccupationModule,
    ResfamilyModule,
    ResbankingModule,
    ResinsuranceModule,
    ResphoneModule,
    ResservicesModule,
    ResvehicleModule,
    RestravelModule,
    ReshealthModule,
    ResotherModule,
    ResfinanceModule,
    RessocialModule,
    RestechnologyModule,
    RestransportModule,
    RestelecommunicationModule,
    ResloyalteeModule,
    ResbankModule,
    RessurveysModule,
    ResjobsModule,
    DateInputsModule,
    RescustomfieldsModule
  ],
  declarations: [
    // PanelMemberComponent,
    NewRespondentComponent,
    
  ]
})

export class NewRespondentModule {
}
