import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { NgxMaskModule } from '../../assets/ax-npm/ngx-mask';
import { SurveyPreviewComponent } from '../survey/surveypreview.component';
import { SurveytemplateModule } from './surveytemplate.module';
import { ModalModule } from "ngx-modal";

export const route: Routes = [
  { path: '', component: SurveyPreviewComponent, pathMatch: 'full' },//NOT USE
  { path: '/:jobid/:surveyid', component: SurveyPreviewComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(route),
    NguiDatetimePickerModule,
    NgxMaskModule.forRoot(),
    SurveytemplateModule,
    ModalModule
  ],
  declarations: [
    SurveyPreviewComponent
  ]
})

export class SurveypreviewModule {
}
