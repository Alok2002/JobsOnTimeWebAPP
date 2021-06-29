import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { TagInputModule } from "ngx-chips";
import { EmailComponent } from "../../shared/email.component";
import { CKEditorModule } from 'ckeditor4-angular';
// import { CKEditorModule } from '@ckeditor/ckeditor5-build-classic';

// export const route: Routes = [
//   {path: '', component: FilterComponent}
// ];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TagInputModule,
    CKEditorModule
  ],
  exports: [EmailComponent],
  declarations: [
    EmailComponent
  ]
})

export class EmailModule {
}
