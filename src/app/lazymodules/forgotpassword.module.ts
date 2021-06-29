import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {ForgotPassComponent} from '../user/forgotpass.component';

export const route: Routes = [
  {path: '', component: ForgotPassComponent, pathMatch: 'full', data: { pagetitle: 'Forgot your password' }}
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(route),
  ],
  declarations: [
    ForgotPassComponent,
  ]
})

export class ForgotpasswordModule {
}
