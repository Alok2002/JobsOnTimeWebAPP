import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import { Subject } from 'rxjs/Subject';
import swal from 'sweetalert2';

import { Client } from '../models/client';
import { Note } from '../models/note';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SecurityRights, SecurityRightsExportError } from '../shared/enum';
import { ClientServices } from '../services/client.services';
import { SharedServices } from '../services/shared.services';

declare var jQuery: any;

@Component({
  selector: 'CliNotesComponent',
  templateUrl: './clinotes.component.html'
})

export class CliNotesComponent implements OnInit {
  client: Client;
  id = 1;
  isLoading = true;
  isSubmitFormSpinner = false;
  isSubmitForm = false;
  notes: Array<Note>;
  note: Note;

  deleteItemIds = [];

  @ViewChild("closeAddNewModal") closeAddNewModal;
  @ViewChild("checkBox") checkBox;

  selected = [];
  noteTypes = [];

  constructor(private router: Router, private securityInfoResolve: SecurityInfoResolve,
    private _clientService: ClientServices, private sharedService: SharedServices) { }

  ngOnInit() {
    this.getNotes(this.id);
    this.addNew();
    this.getNotesTypeList();
  }

  getNotes(id) {
    this._clientService.getClientNotes(id)
      .subscribe((res: any) => {
        this.notes = [];
        res.value.forEach((re) => {
          if (re.summary == 'External') {
            this.notes.push(re);
          }
        });
      });
  }

  getNotesTypeList() {
    this.sharedService.getNotesTypeList()
      .subscribe((res: any) => {
        this.noteTypes = res.value;
      });
  }

  addNew() {
    this.note = new Note();
    this.note.summary = 'External';
  }

  deleteNotes() {
    if (this.deleteItemIds.length > 0) {

      swal({
        title: 'Are you sure?',
        text: 'You will not be able to recover this item!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        confirmButtonColor: '#ffaa00',
        cancelButtonText: 'No, keep it'
      }).then((result) => {
        if (result.value) {
          swal(
            'Deleted!',
            'Selected item has been deleted.',
            'success'
          );

          this._clientService.deleteClientNotes(this.deleteItemIds)
            .subscribe(res => {
              this.deleteItemIds = [];
              this.getNotes(this.id);

              for (var i = 0; i < this.notes.length; i++) {
                this.selected[i] = false;
              }
            });
          // result.dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
        } else if (result.dismiss === swal.DismissReason.cancel) {
          swal(
            'Cancelled',
            'Selected item is safe :)',
            'error'
          )
        }
      });
    }
    else {
      swal(
        'Oops...',
        'Please select an item to delete.',
        'info'
      )
    }
  }


  submitClientNotes(form) {
    this.isSubmitForm = true;
    this.isSubmitFormSpinner = true;
    if (form.invalid) {
      //this.isSubmitForm = false;
      this.isSubmitFormSpinner = false;
    }
    else {
      this.note.clientId = this.id;
      //this.note.username = "Ram";
      this._clientService.postClientNote(this.note)
        .subscribe((res: any) => {
          this.isSubmitFormSpinner = false;
          this.isSubmitForm = false;
          if (res.succeeded) {
            this.closeAddNewModal.nativeElement.click();
            //this.router.navigate(['/client']);
            this.getNotes(this.id);
          }
        });
    }
  }

  updateDeleteList(id: number, e) {
    if (e.target.checked) {
      this.deleteItemIds.push(id);
    }
    else {
      this.deleteItemIds.forEach((di, i) => {
        if (di == id) {
          this.deleteItemIds.splice(i, 1);
        }
      });
    }
  }

  selectAll(e) {
    if (e.target.checked) {
      this.notes.forEach((item) => {
        this.deleteItemIds.push(item.id);
      });
    }
    else {
      this.deleteItemIds = [];
    }

    for (var i = 0; i < this.notes.length; i++) {
      this.selected[i] = e.target.checked;
    }
  }

  editNotes(id) {
    this.notes.forEach((item) => {
      if (item.id == id) {
        this.note = item;
      }
    });
  }

  exporttoExcel() {
    this.securityInfoResolve.checkPermission(SecurityRights.ExportAllResults)
      .subscribe((res: any) => {
        if (res.succeeded) {
          this.exporttoExcelHelper();
        } else {
          /*var err = "";
          res.errors.forEach((er) => {
            err = err + " " + er;
          });*/
          swal(
            'Access Denied!',
            SecurityRightsExportError,
            'error'
          )
        }
      })
  }

  exporttoExcelHelper() {
    const workbook = new Excel.Workbook();
    var sheet = workbook.addWorksheet('My Sheet');

    sheet.columns = [
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Type', key: 'summary', width: 30 },
      { header: 'User', key: 'username', width: 30 },
      { header: 'Notes', key: 'notes', width: 50 }
    ];

    this.notes.forEach((am) => {
      var dataobj = {};
      //sheet
      sheet.columns.forEach(cl => {
        if (cl.key == 'date'){
          var cdate = moment(am[cl.key]).format('DD/MM/YYYY');
          dataobj[cl.key] = cdate;
        }
        else
          dataobj[cl.key] = am[cl.key];
      });

      sheet.addRow(dataobj);
    });

    sheet.getRow('1').font = {
      size: 14,
      bold: true
    };

    var filename = "Client Notes.xlsx";
    /* save to file */
    workbook.xlsx.writeBuffer().then(function (data) {
      saveAs(new Blob([data], { type: 'application/octet-stream' }), filename);
    });
  }
}
