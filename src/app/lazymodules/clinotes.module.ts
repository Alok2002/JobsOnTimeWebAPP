import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { NgxMaskModule } from '../../assets/ax-npm/ngx-mask';
import { CliNotesComponent } from '../user-client/clinotes.component';

export const route: Routes = [
  { path: '', component: CliNotesComponent, pathMatch:'full' },//NOT USE
  { path: 'clinotes', component: CliNotesComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(route),
    NguiDatetimePickerModule,
    NgxMaskModule.forRoot(),
  ],
  declarations: [
    CliNotesComponent
  ]
})

export class ClinotesModule {
}
