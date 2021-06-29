import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { NgxMaskModule } from '../../assets/ax-npm/ngx-mask';
import { ResSurveyComponent } from '../user-res/ressurvey.component';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';

export const route: Routes = [
  { path: '', component: ResSurveyComponent, pathMatch: 'full', data: { pagetitle: 'My Surveys' } },//NOT USE
  { path: 'ressurvey/:id', component: ResSurveyComponent, pathMatch: 'full', data: { pagetitle: 'My Surveys' } },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(route),
    NguiDatetimePickerModule,
    NgxMaskModule.forRoot(),
    TableModule,
    MultiSelectModule
  ],
  declarations: [
    ResSurveyComponent
  ]
})

export class RessurveyModule {
}
