import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { JobSessionComponent } from '../../job/jobsession.component';
import { FilterModule } from '../filter.module';
import { EmailModule } from './email.module';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { PaginatorModule } from 'primeng/paginator';

// export const route: Routes = [
//   {path: '', component: FilterComponent}
// ];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    //RouterModule.forChild(route),
    RouterModule,
    FilterModule,
    EmailModule,
    TableModule,
    MultiSelectModule
  ],
  exports: [JobSessionComponent],
  declarations: [
    JobSessionComponent
  ]
})

export class JobSessionComponentModule {
}
