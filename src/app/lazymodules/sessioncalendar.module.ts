import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { TagInputModule } from 'ngx-chips';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { NgxMaskModule } from '../../assets/ax-npm/ngx-mask';
import { SessionCalendarComponent } from '../session/sessioncalendar.component';
import { JobSessionComponentModule } from './child/jobsessioncomponent.module';
import { FileuploadModule } from './fileupload.module';
import { FilterModule } from './filter.module';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';

export const route: Routes = [
  {path: '', component: SessionCalendarComponent, pathMatch: 'full'},
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(route),
    NguiAutoCompleteModule,
    AngularMultiSelectModule,
    TagInputModule,
    NguiDatetimePickerModule,
    NgxMaskModule.forRoot(),
    FilterModule,
    FileuploadModule,
    JobSessionComponentModule,
    TableModule,
    MultiSelectModule
  ],
  declarations: [
    SessionCalendarComponent,
    //FileUpload
  ]
})

export class SessioncalendarModule {
}
