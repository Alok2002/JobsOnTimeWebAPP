import { SmsModule } from './child/sms.module';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { TagInputModule } from 'ngx-chips';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { SendEmailComponent } from '../comms/sendemail.component';
import { SendSmsComponent } from '../comms/sendsms.component';
import { SmsRepliesComponent } from '../comms/smsreplies.component';
import { OrderbyModule } from './orderby.module';
import { NgxMaskModule } from '../../assets/ax-npm/ngx-mask';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
// import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CKEditorModule } from 'ckeditor4-angular';
// import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

export const route: Routes = [
  { path: 'sendemail', component: SendEmailComponent, pathMatch: 'full' },
  { path: 'sendsms', component: SendSmsComponent, pathMatch: 'full' },
  { path: 'smsreplies', component: SmsRepliesComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(route),
    AngularMultiSelectModule,
    TagInputModule,
    NguiDatetimePickerModule,
    NgxMaskModule.forRoot(),
    OrderbyModule,
    TableModule,
    MultiSelectModule,
    CKEditorModule,
    SmsModule
  ],
  declarations: [
    SendEmailComponent,
    SendSmsComponent,
    SmsRepliesComponent
  ]
})

export class CommsModule {
}
