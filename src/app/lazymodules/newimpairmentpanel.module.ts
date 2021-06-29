import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { NgxMaskModule } from '../../assets/ax-npm/ngx-mask';
import { NewImpairmentPanelMemberComponent } from '../respondent/newimpairmentpanelmember/newimpairmentpanelmember.component';
import { IpmcontactModule } from './respondentchild/ipmcontact.module';
import { IpmdetailsModule } from './respondentchild/ipmdetails.module';
import { ResjobsModule } from './respondentchild/resjobs.module';
import { ResotherModule } from './respondentchild/resother.module';
import { RespaymentsModule } from './respondentchild/respayments.module';
import { RessurveysModule } from './respondentchild/ressurveys.module';

export const route: Routes = [
  { path: '', component: NewImpairmentPanelMemberComponent, pathMatch: 'full' },
  { path: 'newimpairmentpanelmember', component: NewImpairmentPanelMemberComponent, pathMatch: 'full' },
  { path: 'impairmentpanelmember/:resid', component: NewImpairmentPanelMemberComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(route),
    NguiDatetimePickerModule,
    NgxMaskModule.forRoot(),

    RespaymentsModule,
    RessurveysModule,
    ResjobsModule,
    IpmcontactModule,
    IpmdetailsModule,
    ResotherModule
  ],
  declarations: [
    NewImpairmentPanelMemberComponent
  ]
})

export class NewimpairmentpanelModule {
}
