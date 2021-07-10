import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { NgxMaskModule } from '../../assets/ax-npm/ngx-mask';
import { TicketComponent } from '../admin/ticket.component';
import { TicketEditComponent } from '../admin/ticketedit.component';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SecurityRights } from '../shared/enum';
import { FileuploadModule } from './fileupload.module';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { TextMaskModule } from 'angular2-text-mask';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { FilterModule } from './filter.module';
import { CKEditorModule } from 'ckeditor4-angular';
import { TagInputModule } from 'ngx-chips';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';

export const route: Routes = [
  { path: '', component: TicketComponent, pathMatch: 'full', data: { securityData: SecurityRights.ResearchMeLicence }, resolve: { securityInfo: SecurityInfoResolve } },
  { path: 'add', component: TicketEditComponent, pathMatch: 'full', data: { securityData: SecurityRights.ResearchMeLicence }, resolve: { securityInfo: SecurityInfoResolve } },
  { path: 'edit/:id', component: TicketEditComponent, pathMatch: 'full', data: { securityData: SecurityRights.ResearchMeLicence }, resolve: { securityInfo: SecurityInfoResolve } },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(route),
    NguiDatetimePickerModule,
    NgxMaskModule.forRoot(),
    FileuploadModule,
    TableModule,
    MultiSelectModule,
    CKEditorModule,
    TextMaskModule,
    NguiAutoCompleteModule,
    FilterModule,
    TagInputModule,
    DateInputsModule
  ],
  declarations: [
    TicketComponent,
    TicketEditComponent
  ]
})

export class TicketModule {
}
