import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ManageEmailComponent } from '../admin/manageemail.component';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SecurityRights } from '../shared/enum';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';

export const route: Routes = [
  { path: '', component: ManageEmailComponent, pathMatch: 'full', data: { securityData: SecurityRights.EmailSenderAdmin }, resolve: { securityInfo: SecurityInfoResolve } },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(route),
    TableModule,
    MultiSelectModule,
  ],
  declarations: [
    ManageEmailComponent
  ]
})

export class ManageEmailModel {
}
