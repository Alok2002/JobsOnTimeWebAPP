import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { TextMaskModule } from 'angular2-text-mask';

import { NgxMaskModule } from '../../assets/ax-npm/ngx-mask';
import { SignUpImpairmentComponent } from '../user/signupimpairment.component';
import { NumericModule } from './numeric.module';
import { SafeHtmlPipeModule } from './safehtmlpipe.module';

export const route: Routes = [
  { path: '', component: SignUpImpairmentComponent, pathMatch: 'full', data: { pagetitle: 'Join Our Disability Panel' } }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(route),
    NguiAutoCompleteModule,
    NgxMaskModule.forRoot(),
    TextMaskModule,
    NumericModule,
    SafeHtmlPipeModule,
  ],
  declarations: [
    SignUpImpairmentComponent
  ]
})

export class SignupImpairmentModule { }
