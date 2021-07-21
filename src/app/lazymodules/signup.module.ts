import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TextMaskModule } from 'angular2-text-mask';
import { NgxMaskModule } from '../../assets/ax-npm/ngx-mask';
import { SignUpComponent } from '../user/signup.component';
import { NumericModule } from './numeric.module';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { SafeHtmlPipeModule } from './safehtmlpipe.module';
import { NgxCaptchaModule } from 'ngx-captcha';

export const route: Routes = [
  { path: '', component: SignUpComponent, pathMatch: 'full' }
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
    NgxCaptchaModule
  ],
  declarations: [
    SignUpComponent
  ]
})

export class SignupModule { }
