import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';

import { NgxMaskModule } from '../../assets/ax-npm/ngx-mask';
import { BPMFurtherdetails } from '../respondent/newbusinesspanelmember/bpmfurtherdetails.component';
import { NewBusinessPanelMemberComponent } from '../respondent/newbusinesspanelmember/newbusinesspanelmember.component';
import { BpmcontactModule } from './respondentchild/bpmcontact.module';
import { ResjobsModule } from './respondentchild/resjobs.module';
import { ResotherModule } from './respondentchild/resother.module';
import { RespaymentsModule } from './respondentchild/respayments.module';
import { RessurveysModule } from './respondentchild/ressurveys.module';

export const route: Routes = [
  { path: '', component: NewBusinessPanelMemberComponent, pathMatch:'full' },
  { path: 'newbussinesspanelmember', component: NewBusinessPanelMemberComponent, pathMatch: 'full' },
  { path: 'bussinesspanelmember/:resid', component: NewBusinessPanelMemberComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(route),
    NguiDatetimePickerModule,
    NgxMaskModule.forRoot(),
    BpmcontactModule,
    RespaymentsModule,
    RessurveysModule,
    ResjobsModule,
    ResotherModule
  ],
  declarations: [
    NewBusinessPanelMemberComponent,
    BPMFurtherdetails
  ]
})

export class NewbusinesspanelModule {
}
