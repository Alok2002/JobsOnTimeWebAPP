import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NumericDirective } from '../shared/numeric';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [NumericDirective],
  declarations: [
    NumericDirective
  ]
})

export class NumericModule {
}
