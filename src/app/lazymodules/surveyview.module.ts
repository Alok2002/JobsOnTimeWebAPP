import { TextMaskModule } from 'angular2-text-mask';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { SurveyViewComponent } from '../survey/surveyview.component';
import { SurveyTemplateComponent } from '../survey/surveytemplate.component';
import { DragulaModule } from 'ng2-dragula';
import { SafepipeModule } from './safepipe.module';
import { SurveytemplateModule } from './surveytemplate.module';
import { NgxMaskModule } from '../../assets/ax-npm/ngx-mask';

export const route: Routes = [
  { path: '', component: SurveyViewComponent, pathMatch: 'full' },//NOT USE
  { path: '/:action/:encodeddata', component: SurveyViewComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(route),
    NguiDatetimePickerModule,
    NgxMaskModule.forRoot(),
    DragulaModule,
    SafepipeModule,
    SurveytemplateModule,
    TextMaskModule
  ],
  declarations: [
    SurveyViewComponent,
    //SurveyTemplateComponent
  ]
})

export class SurveyviewModule {
}
