import { FilterModule } from './filter.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { NgxMaskModule } from '../../assets/ax-npm/ngx-mask';
import { BulkDataComponent } from '../admin/bulkdata.component';
import { ReferenceComponent } from '../admin/reference.component';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SecurityRights } from '../shared/enum';
import { AdminComponent } from '../admin/admin.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { GlobalQueriesComponent } from '../admin/globalqueries.component';
import { PrivateListComponent } from '../admin/privatelist.component';
import { SearchEventsComponent } from '../admin/searchevents.component';
import { CKEditorModule } from 'ckeditor4-angular';
import { SearchArchivedEventsComponent } from '../admin/searcharchivedevents.component';
import { DevToolsComponent } from '../admin/devtools.component';

export const route: Routes = [
  { path: '', component: AdminComponent, pathMatch: 'full' },
  { path: 'bulkdata', component: BulkDataComponent, pathMatch: 'full' },
  { path: 'reference', component: ReferenceComponent, pathMatch: 'full', data: { securityData: SecurityRights.ReferenceDataAdmin }, resolve: { securityInfo: SecurityInfoResolve } },
  { path: 'globalqueries', component: GlobalQueriesComponent, pathMatch: 'full', data: { securityData: SecurityRights.ManageGlobalQueries }, resolve: { securityInfo: SecurityInfoResolve } },
  { path: 'privatelist', component: PrivateListComponent, pathMatch: 'full', data: { securityData: SecurityRights.PrivateListAdmin }, resolve: { securityInfo: SecurityInfoResolve } },
  { path: 'searchevents', component: SearchEventsComponent, pathMatch: 'full', data: { securityData: SecurityRights.SearchEvents }, resolve: { securityInfo: SecurityInfoResolve } },
  { path: 'searcharchivedevents', component: SearchArchivedEventsComponent, pathMatch: 'full', data: { securityData: SecurityRights.SearchEvents }, resolve: { securityInfo: SecurityInfoResolve } },
  { path: 'dev-tools', component: DevToolsComponent, pathMatch: 'full', data: { securityData: SecurityRights.DeveloperTools }, resolve: { securityInfo: SecurityInfoResolve } },

  // { path: 'searchevents', component: SearchEventsComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(route),
    NguiDatetimePickerModule,
    NgxMaskModule.forRoot(),
    TableModule,
    MultiSelectModule,
    CKEditorModule,
    FilterModule
  ],
  declarations: [
    BulkDataComponent,
    ReferenceComponent,
    AdminComponent,
    GlobalQueriesComponent,
    PrivateListComponent,
    SearchEventsComponent,
    SearchArchivedEventsComponent,
    DevToolsComponent
  ]
})

export class AdminModule {
}
