import { DashboardComponent } from './../shared/dashboard.component';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardChartComponent } from '../shared/dashboardchart.component';
import { ChartsModule } from 'ng2-charts';
import { NgxMaskModule } from '../../assets/ax-npm/ngx-mask';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { PaginatorModule } from 'primeng/paginator';

export const route: Routes = [
  { path: '', component: DashboardComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(route),
    NguiAutoCompleteModule,
    NgxMaskModule.forRoot(),    
    ChartsModule,
    TableModule,
    MultiSelectModule,
    PaginatorModule
  ],
  declarations: [
    DashboardComponent,
    DashboardChartComponent
  ]
})

export class DashboardModule { }
