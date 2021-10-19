import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import swal from 'sweetalert2';

import { phoneMask, phonePattern } from '../app.component';
import { Licence } from '../models/licence';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SecurityRights, SecurityRightsExportError } from '../shared/enum';
import { LicenceServices } from '../services/licence.services';
import { PtableColumn } from '../models/ptablecolumn';
import { SharedServices } from '../services/shared.services';

declare var Clipboard: any;
declare var jQuery: any;

@Component({
  selector: 'DevToolsComponent',
  templateUrl: './devtools.component.html'
})

export class DevToolsComponent implements OnInit {    
  text: string;

  constructor(private sharedServices: SharedServices, private securityInfoResolve: SecurityInfoResolve) { }
  ngOnInit() {    
  }

  getEncryptDecryptString(type, form) {
    if(form.valid) {
      this.sharedServices.getEncryptDecryptString(type, this.text)
        .subscribe((res: any) => {
          console.log(res)
          if(res.value) {
            this.text = res.value
          }
        })
    }
  }

  clipboardCopy() {
    function showTooltip(elem: any, msg: string) {
      var classNames = elem.className;
      elem.setAttribute('class', classNames + ' hint--bottom');
      elem.setAttribute('aria-label', msg);
      setTimeout(() => {
        elem.setAttribute('class', classNames);
      },
        2000);
    }

    var clipboard = new Clipboard('.ccopy');

    clipboard.on('success',
      (e: any) => {    
        showTooltip(e.trigger, 'Copied!');
            
        clipboard.destroy();
        clipboard = new Clipboard('.ccopy');
        clipboard.destroy();
      });

    clipboard.on('error',
      (e: string) => {
        //  // console.log(e);
      });
  }
}