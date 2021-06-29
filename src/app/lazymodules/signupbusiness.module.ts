import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SignUpBusinessComponent } from '../user/signupbusiness.component';
import { NgxMaskModule } from '../../assets/ax-npm/ngx-mask';
import { TextMaskModule } from 'angular2-text-mask';
import { NumericModule } from './numeric.module';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { SafeHtmlPipeModule } from './safehtmlpipe.module';

export const route: Routes = [
  { path: '', component: SignUpBusinessComponent, pathMatch: 'full' }
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
    SafeHtmlPipeModule
  ],
  declarations: [
    SignUpBusinessComponent
  ]
})

export class SignupBusinessModule { }
