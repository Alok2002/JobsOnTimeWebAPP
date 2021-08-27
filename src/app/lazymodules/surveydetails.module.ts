import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { DragulaModule } from 'ng2-dragula';
import { TagInputModule } from 'ngx-chips';
import { NgxMaskModule } from '../../assets/ax-npm/ngx-mask';
import { QuotaModalComponent } from '../shared/quotamodal.component';
import { SurveyAnswersGridComponent } from '../survey/surveyanswersgrid.component';
import { SurveyDetailsComponent } from '../survey/surveydetails.component';
import { SurveyEditComponent } from '../survey/surveyedit.component';
import { SurveyEventsComponent } from '../survey/surveyevents.component';
import { SurveyQuestionsComponent } from '../survey/surveyquestions.component';
import { SurveyStatsComponent } from '../survey/surveystats.component';
import { EmailModule } from './child/email.module';
import { EventModalModule } from './child/eventmodal.module';
import { SmsModule } from './child/sms.module';
import { FileuploadModule } from './fileupload.module';
import { FilterModule } from './filter.module';
import { OrderbyModule } from './orderby.module';
import { SafepipeModule } from './safepipe.module';
import { SurveyMediaPreviewModule } from './surveymediapreview.module';
import { SurveytemplateModule } from './surveytemplate.module';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { ConfirmDeactivateGuard } from './confirmdeactivateguard';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { SafeHtmlPipeModule } from './safehtmlpipe.module';
import { CKEditorModule } from 'ckeditor4-angular';
import { SurveyLibraryQuestionsComponent } from '../survey/surveylibraryquestions.component';

export const route: Routes = [
  {
    path: '', component: SurveyDetailsComponent, pathMatch: 'full', canDeactivate: [ConfirmDeactivateGuard], children: [
      { path: '/:jobid', component: SurveyDetailsComponent, pathMatch: 'full' },
      { path: '/:jobid/:surveyid', component: SurveyDetailsComponent, pathMatch: 'full' },
      { path: '/managesessionsurvey/:jobid/:sessionid', component: SurveyDetailsComponent, pathMatch: 'full' },
      { path: '/managesessionsurvey/:jobid/:surveyid/:sessionid', component: SurveyDetailsComponent, pathMatch: 'full' },
      { path: '/managescreener/:jobid', component: SurveyDetailsComponent, pathMatch: 'full' },
      { path: '/managescreener/:jobid/:surveyid', component: SurveyDetailsComponent, pathMatch: 'full' }]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(route),
    NguiDatetimePickerModule,
    NgxMaskModule.forRoot(),
    FileuploadModule,
    DragulaModule,
    OrderbyModule,
    TagInputModule,
    SafepipeModule,
    SurveytemplateModule,
    FilterModule,
    NguiAutoCompleteModule,
    SurveyMediaPreviewModule,
    AngularMultiSelectModule,
    EmailModule,
    EventModalModule,
    SmsModule,
    TableModule,
    MultiSelectModule,
    DateInputsModule,
    SafeHtmlPipeModule,
    CKEditorModule
  ],
  declarations: [
    SurveyDetailsComponent,
    SurveyEditComponent,
    SurveyQuestionsComponent,
    SurveyStatsComponent,
    SurveyAnswersGridComponent,
    SurveyEventsComponent,
    QuotaModalComponent,
    //SurveyTemplateComponent
    SurveyLibraryQuestionsComponent
  ]
})

export class SurveydetailsModule {
}
