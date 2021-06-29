import { FilterModule } from './filter.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { ExcelModule, GridModule, PDFModule } from '@progress/kendo-angular-grid';
import { Daterangepicker } from 'ng2-daterangepicker';
import { TagInputModule } from 'ngx-chips';
import { NgxMaskModule } from '../../assets/ax-npm/ngx-mask';
import { StaffRosterComponent } from '../staff/roster.component';
import { StaffComponent } from '../staff/staff.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { SafepipeModule } from './safepipe.module';
import { SafeHtmlPipeModule } from './safehtmlpipe.module';
import { SecurityRights } from '../shared/enum';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { AttendanceComponent } from '../staff/attendance.component';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';

export const route: Routes = [
  { path: '', component: StaffComponent, pathMatch: 'full' },
  { path: 'roster', component: StaffRosterComponent, pathMatch: 'full' },
  { path: 'attendance', component: AttendanceComponent, pathMatch: 'full', data: { securityData: SecurityRights.ManageStaffAttendance }, resolve: { securityInfo: SecurityInfoResolve } },
  // { path: 'attendance', component: AttendanceComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(route),
    NguiDatetimePickerModule,
    NgxMaskModule.forRoot(),
    Daterangepicker,
    GridModule,
    PDFModule,
    ExcelModule,
    TagInputModule,
    TableModule,
    MultiSelectModule,
    SafeHtmlPipeModule,
    FilterModule,
    DateInputsModule
  ],
  declarations: [
    StaffComponent,
    StaffRosterComponent,
    AttendanceComponent
  ]
})

export class StaffModule {
}
