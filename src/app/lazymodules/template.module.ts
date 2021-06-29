import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { TemplateComponent } from '../admin/template.component';
import { NgxMaskModule } from '../../assets/ax-npm/ngx-mask';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SecurityRights } from '../shared/enum';
import { CKEditorModule } from 'ckeditor4-angular';
// import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

export const route: Routes = [
  { path: '', component: TemplateComponent, pathMatch: 'full', data: { securityData: SecurityRights.EmailTemplateAdmin }, resolve: { securityInfo: SecurityInfoResolve } },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(route),
    NguiDatetimePickerModule,
    NgxMaskModule.forRoot(),
    CKEditorModule
  ],
  declarations: [
    TemplateComponent
  ]
})

export class TemplateModule {
}
