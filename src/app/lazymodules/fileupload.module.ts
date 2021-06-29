import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FileUpload } from '../shared/ng2-fileupload/src/file-upload.component';

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
  exports: [FileUpload],
  declarations: [
    FileUpload
  ]
})

export class FileuploadModule {
}
