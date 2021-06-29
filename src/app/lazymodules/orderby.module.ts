import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrderBy } from '../pipes/order.pipe';

// export const route: Routes = [
//   {path: '', component: FilterComponent}
// ];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    //RouterModule.forChild(route),
  ],
  exports: [OrderBy],
  declarations: [
    OrderBy
  ]
})

export class OrderbyModule {
}
