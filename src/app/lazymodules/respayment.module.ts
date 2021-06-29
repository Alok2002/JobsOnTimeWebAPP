import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { ResPaymentComponent } from '../user-res/respayment.component';
import { RespaymentsModule } from './respondentchild/respayments.module';
import { FilterModule } from './filter.module';
import { NgxMaskModule } from '../../assets/ax-npm/ngx-mask';
import { TextMaskModule } from 'angular2-text-mask';
import { NumericModule } from './numeric.module';

export const route: Routes = [
  { path: '', component: ResPaymentComponent, pathMatch: 'full', data: { pagetitle: 'My Payments' } },//NOT USE
  { path: 'respayments/:id', component: ResPaymentComponent, pathMatch: 'full', data: { pagetitle: 'My Payments' } },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(route),
    NguiDatetimePickerModule,
    NgxMaskModule.forRoot(),
    RespaymentsModule,
    FilterModule,
    TextMaskModule,
    NumericModule
  ],
  declarations: [
    ResPaymentComponent
  ]
})

export class RespaymentModule {
}
