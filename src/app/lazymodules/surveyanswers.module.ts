import { SmsModule } from './child/sms.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { DragulaModule } from 'ng2-dragula';

import { NgxMaskModule } from '../../assets/ax-npm/ngx-mask';
import { SurveyAnswersComponent } from '../survey/surveyanswers.component';
import { EmailModule } from './child/email.module';
import { SafepipeModule } from './safepipe.module';
import { SurveytemplateModule } from './surveytemplate.module';

export const route: Routes = [
  { path: '', component: SurveyAnswersComponent, pathMatch: 'full' },//NOT USE
  { path: 'surveyanswers/:surveyid/:resid/:jobid', component: SurveyAnswersComponent, pathMatch: 'full' },
  { path: 'screener/:surveyid/:resid/:screenerid/:jobid', component: SurveyAnswersComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(route),
    NguiDatetimePickerModule,
    NgxMaskModule.forRoot(),
    SafepipeModule,
    DragulaModule,
    SurveytemplateModule,
    EmailModule,
    SmsModule
  ],
  declarations: [
    SurveyAnswersComponent
  ]
})

export class SurveyanswersModule {
}
