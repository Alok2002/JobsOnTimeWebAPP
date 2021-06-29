import { JobComponent } from './../../job/job.component';
import { FilterMobileModule } from './../filtermobile.module';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { TagInputModule } from "ngx-chips";
import { FilterModule } from '../filter.module';
import { EmailModule } from './email.module';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';

// export const route: Routes = [
//   {path: '', component: FilterComponent}
// ];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    FilterModule,
    TagInputModule,
    EmailModule,
    TableModule,
    MultiSelectModule,
    FilterMobileModule
  ],
  exports: [JobComponent],
  declarations: [
    JobComponent
  ]
})

export class JobComponentModule {
}
