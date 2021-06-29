// import 'tinymce/tinymce.min';
import { Component, EventEmitter, Inject, OnInit, Output, PLATFORM_ID } from '@angular/core';
import swal from 'sweetalert2';
import { EmailTemplate } from '../models/emailtemplate';
import { EmailServices } from '../services/email.services';
// import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ckEditorConfig } from '../app.component';
// import * as Editor from './../../assets/ckeditor/build/ckeditor';
import { isPlatformBrowser } from '@angular/common';

declare var jQuery: any;
// declare var tinymce: any;

@Component({
  selector: 'TemplateComponent',
  templateUrl: './template.component.html'
})

export class TemplateComponent implements OnInit {
  public editor;

  @Output() onEditorKeyup = new EventEmitter<any>();
  // public editor: any;
  isLoading = true;
  emailtemplate: EmailTemplate;
  emailtemplates: Array<EmailTemplate>;
  selectedEmailTemplateId: number;
  showTextEditor;
  ckEditorConfig = JSON.parse(JSON.stringify(ckEditorConfig));

  /*public Editor = ClassicEditor;
  public onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }*/
  isBrowser = false;
  
  constructor(private emailservice: EmailServices, @Inject(PLATFORM_ID) platformId: Object) {
    /*this.isBrowser = isPlatformBrowser(platformId);
    if(this.isBrowser) {
      const ClassicEditor = require('./../../assets/ckeditor/build/ckeditor');
      this.editor = ClassicEditor;
    }*/
  }

  ngOnInit() {
    //this.emailtemplate = new EmailTemplate();
    //this.initTinymce();
    this.getEmailTemplates();
  }

  getEmailTemplates() {
    this.emailservice.getEmailTemplates()
      .subscribe((res: any) => {
        this.emailtemplates = res.value;
        this.isLoading = false;

        if (this.emailtemplates && this.emailtemplates.length > 0) {
          this.selectedEmailTemplateId = this.emailtemplates[0].id;
          this.emailtemplate = this.emailtemplates[0];
          this.changeEmailTemplate();
        }
      })
  }

  changeEmailTemplate() {
    this.isLoading = true;
    this.emailtemplates.forEach(te => {
      if (te.id == this.selectedEmailTemplateId) {
        this.emailtemplate = te;
      }
    })

    // tinymce.remove();
    //this.initTinymce();
  }

  /*initTinymce() {
    var self = this;
    setTimeout(() => {
      tinymce.baseURL = "../../../assets/custom/tinymce";// trailing slash important      
      tinymce.init({
        selector: '.tinymce-editor', // change this value according to your HTML
        skin_url: '../../../assets/tinymce/skins/lightgray',
        branding: false,
        elementpath: false,
        height: 250,
        plugins: [
          "advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker",
          "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
          "save table contextmenu directionality emoticons template paste textcolor"
        ],
        toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist | l      ink image | preview media fullpage | forecolor backcolor",
        style_formats: [
          { title: 'Bold text', inline: 'b' },
          { title: 'Red text', inline: 'span', styles: { color: '#ff0000' } },
          { title: 'Red header', block: 'h1', styles: { color: '#ff0000' } },
          { title: 'Example 1', inline: 'span', classes: 'example1' },
          { title: 'Example 2', inline: 'span', classes: 'example2' },
          { title: 'Table styles' },
          { title: 'Table row 1', selector: 'tr', classes: 'tablerow1' }
        ],      
        setup: function (editor: any) {
          self.editor = editor;
          editor.on('keyup change blur',
            () => {
              console.log(editor);
              console.log(self.emailtemplate);
              let content = "";
              if (self.emailtemplate.name.toLowerCase().includes('sms'))
                content = editor.getContent({format: 'text'});
              else
                content = editor.getContent();

              self.onEditorKeyup.emit(content);
              if (editor.id == "elm1") {
                //template.galleryPreDeployment = content;
                self.emailtemplate.body = content;
              }
            });
        }
      });
      jQuery(".mce-tinymce").css('display', 'block');

      this.isLoading = false;
    }, 1000);
  }*/

  updateEmailTemplate() {
    console.log(this.emailtemplate);
    this.emailservice.updateEmailTemplate(this.emailtemplate)
      .subscribe((res: any) => {
        if (res.succeeded) {
          swal(
            'Successfully Saved!',
            '',
            'success'
          )
        }
      })
  }
}
