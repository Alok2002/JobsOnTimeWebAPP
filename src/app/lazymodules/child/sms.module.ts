import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { TagInputModule } from "ngx-chips";
import { SmsComponent } from "../../shared/sms.component";

// export const route: Routes = [
//   {path: '', component: FilterComponent}
// ];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TagInputModule,
  ],
  exports: [SmsComponent],
  declarations: [
    SmsComponent
  ]
})

export class SmsModule {
}
