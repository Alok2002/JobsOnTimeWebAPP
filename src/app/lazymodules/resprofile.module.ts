import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { NgxMaskModule } from '../../assets/ax-npm/ngx-mask';
import { ResProfileComponent } from '../user-res/resprofile.component';
import { BpmcontactModule } from './respondentchild/bpmcontact.module';
import { IpmcontactModule } from './respondentchild/ipmcontact.module';
import { IpmdetailsModule } from './respondentchild/ipmdetails.module';
import { RescontactModule } from './respondentchild/rescontact.module';
import { ResfamilyModule } from './respondentchild/resfamily.module';
import { ResfinanceModule } from './respondentchild/resfinance.module';
import { ReshealthModule } from './respondentchild/reshealth.module';
import { ResinsuranceModule } from './respondentchild/resinsurance.module';
import { ResoccupationModule } from './respondentchild/resoccupation.module';
import { ResotherModule } from './respondentchild/resother.module';
import { RespersonalModule } from './respondentchild/respersonal.module';
import { ResresearchModule } from './respondentchild/resresearch.module';
import { ResservicesModule } from './respondentchild/resservices.module';
import { RessocialModule } from './respondentchild/ressocial.module';
import { RestechnologyModule } from './respondentchild/restechnology.module';
import { RestelecommunicationModule } from './respondentchild/restelecommunication.module';
import { RestransportModule } from './respondentchild/restransport.module';
import { RestravelModule } from './respondentchild/restravel.module';
import { RescustomfieldsModule } from './respondentchild/rescustomfields.module';

export const route: Routes = [
  { path: '', component: ResProfileComponent, pathMatch: 'full',  data: { pagetitle: 'My Profile' } },//NOT USE
  { path: 'resprofile', component: ResProfileComponent, pathMatch: 'full',  data: { pagetitle: 'My Profile' } },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(route),    
    NguiDatetimePickerModule,    
    NgxMaskModule.forRoot(),

    RescontactModule,
    RespersonalModule,
    ResresearchModule,
    ResoccupationModule,
    ResfamilyModule,
    ResfinanceModule,
    RessocialModule,
    ResotherModule,
    ReshealthModule,
    ResinsuranceModule,
    RestechnologyModule,
    RestelecommunicationModule,
    RestravelModule,
    ResservicesModule,
    RestransportModule,
    BpmcontactModule,
    IpmdetailsModule,
    IpmcontactModule,
    RescustomfieldsModule
  ],
  declarations: [
    ResProfileComponent
  ]
})

export class ResprofileModule {
}
