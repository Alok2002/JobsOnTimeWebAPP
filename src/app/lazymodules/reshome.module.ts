import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { NgxMaskModule } from '../../assets/ax-npm/ngx-mask';
import { ResHomeComponent } from '../user-res/reshome.component';

export const route: Routes = [
  { path: '', component: ResHomeComponent, pathMatch: 'full', data: { pagetitle: 'Home' } },//NOT USE
  { path: 'reshome', component: ResHomeComponent, pathMatch: 'full', data: { pagetitle: 'Home' } },
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
    ResHomeComponent
  ]
})

export class ReshomeModule {
}
