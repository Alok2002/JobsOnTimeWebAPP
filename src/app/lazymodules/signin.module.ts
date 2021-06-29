import { SignInComponent } from './../user/signin.component';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgxMaskModule } from 'ngx-mask';
import { SafeHtmlPipeModule } from './safehtmlpipe.module';
import { NgOtpInputModule } from  'ng-otp-input';

export const route: Routes = [
    { path: '', component: SignInComponent, pathMatch: 'full', data: { pagetitle: 'Login' } },
    { path: '/:jobid', component: SignInComponent, pathMatch: 'full', data: { pagetitle: 'Login' } },
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(route),
        NgxMaskModule.forRoot(),
        SafeHtmlPipeModule,
        NgOtpInputModule
    ],
    declarations: [
        SignInComponent,
    ]
})

export class SigninModule { }
