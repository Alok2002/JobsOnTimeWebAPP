import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { DragulaModule } from 'ng2-dragula';
import { Ng5SliderModule } from 'ng5-slider';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

import { NgxMaskModule } from '../../assets/ax-npm/ngx-mask';
import { SurveyTemplateComponent } from '../survey/surveytemplate.component';
import { SafeHtmlPipeModule } from './safehtmlpipe.module';
import { SafepipeModule } from './safepipe.module';
import { SurveyMediaPreviewModule } from './surveymediapreview.module';

// export const route: Routes = [
//   {path: '', component: FilterComponent}
// ];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    //RouterModule.forChild(route),
    NguiDatetimePickerModule,
    NgxMaskModule.forRoot(),
    SafepipeModule,
    DragulaModule,
    SurveyMediaPreviewModule,
    Ng5SliderModule,
    SafeHtmlPipeModule,
    GooglePlaceModule
  ],
  exports: [SurveyTemplateComponent],
  declarations: [
    SurveyTemplateComponent
  ]
})

export class SurveytemplateModule {
}
