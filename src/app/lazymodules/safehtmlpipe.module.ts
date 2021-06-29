import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {SafePipe} from '../pipes/safe.pipe';
import { SafeHtmlPipe } from '../pipes/safehtml.pipe';

// export const route: Routes = [
//   {path: '', component: FilterComponent}
// ];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    //RouterModule.forChild(route),
    //NguiDatetimePickerModule
  ],
  exports: [SafeHtmlPipe],
  declarations: [
    SafeHtmlPipe
  ]
})

export class SafeHtmlPipeModule {
}
