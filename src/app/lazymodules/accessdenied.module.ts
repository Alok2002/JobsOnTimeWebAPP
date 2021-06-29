import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AccessDeniedComponent } from '../shared/accessdenied.component';

export const route: Routes = [
  { path: '', component: AccessDeniedComponent, pathMatch:'full' },
  { path: ':securitydata', component: AccessDeniedComponent, pathMatch:'full' }  
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(route),    
  ],
  declarations: [
    AccessDeniedComponent
  ]
})

export class AccessDeniedModule {
}
