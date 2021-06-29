import { SafeHtmlPipeModule } from './safehtmlpipe.module';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { NgxMaskModule } from '../../assets/ax-npm/ngx-mask';
import { SurveyAnswersSummaryComponent } from '../survey/surveyanswerssummary.component';

export const route: Routes = [
  { path: '', component: SurveyAnswersSummaryComponent, pathMatch: 'full' },//NOT USE
  { path: 'surveyanswerssummary/:surveyid/:resid', component: SurveyAnswersSummaryComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(route),
    NguiDatetimePickerModule,
    NgxMaskModule.forRoot(),
    SafeHtmlPipeModule
  ],
  declarations: [
    SurveyAnswersSummaryComponent
  ]
})

export class SurveyanswerssummaryModule {
}
