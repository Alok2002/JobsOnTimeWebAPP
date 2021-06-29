import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {NguiDatetimePickerModule} from '@ngui/datetime-picker';
import {SurveyMediaPreviewComponent} from "../survey/surveymediapreview.component";

// export const route: Routes = [
//   {path: '', component: FilterComponent}
// ];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    //RouterModule.forChild(route),
    NguiDatetimePickerModule
  ],
  exports: [SurveyMediaPreviewComponent],
  declarations: [
    SurveyMediaPreviewComponent
  ]
})

export class SurveyMediaPreviewModule {
}
