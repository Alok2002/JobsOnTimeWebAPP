import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { AuthService } from '../services/auth.services';
import { SubMenuComponent } from '../shared/submenu.component';

export const route: Routes = [
  { path: '', component: SubMenuComponent, pathMatch:'full' }, //NOT USE
  { path: 'submenu/:menu', component: SubMenuComponent, canActivate: [AuthService], data: { permissions: ["staff"] } },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(route),
    NguiDatetimePickerModule,
  ],
  declarations: [
    SubMenuComponent
  ]
})

export class SubmenuModule {
}
