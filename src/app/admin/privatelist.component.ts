import { PrivateList } from './../models/privatelist';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedServices } from '../services/shared.services';
import { UserServices } from '../services/user.services';
import { PtableColumn } from '../models/ptablecolumn';
import swal from 'sweetalert2';

declare var jQuery: any;
// declare var tinymce: any;

@Component({
  selector: 'PrivateListComponent',
  templateUrl: './privatelist.component.html'
})

export class PrivateListComponent implements OnInit {
  selectedColumns: Array<PtableColumn> = [];
  cols: Array<PtableColumn> = [];
  privateListList: Array<PrivateList> = [];
  privateList = new PrivateList();
  noofrows = 50;
  selectedRowData: any;
  ptablesearch: string;
  selected = [];
  isSubmitForm = false;
  @ViewChild("closePrivateListModal") closePrivateListModal;
  @ViewChild("inputFile") inputFile;
  samplefileurl: string;

  constructor(private router: Router, private sharedservice: SharedServices,
    private _userService: UserServices, private activateroute: ActivatedRoute) {
    // tinymce.remove();
  }

  ngOnInit() {
    this.cols = [
      { field: 'name', header: 'Name', width: '150', index: 0, sort: false },
      { field: 'description', header: 'Description', width: 'auto', index: 1, sort: false },
      { field: 'respondentCount', header: 'Count', width: '50', index: 2, sort: false },
      { field: 'customField1', header: 'Custom Field 1', width: '125', index: 3, sort: false },
      { field: 'customField2', header: 'Custom Field 2', width: '125', index: 4, sort: false },
      { field: 'customField3', header: 'Custom Field 3', width: '125', index: 5, sort: false },
      { field: 'customField4', header: 'Custom Field 4', width: '125', index: 6, sort: false },
      { field: 'customField5', header: 'Custom Field 5', width: '125', index: 7, sort: false },
      { field: 'customField6', header: 'Custom Field 6', width: '125', index: 8, sort: false },
      { field: 'customField7', header: 'Custom Field 7', width: '125', index: 9, sort: false },
    ];
    this.selectedColumns = this.cols;
    this.getAllPrivateList();
    this.getPrivateListSampleFile();
  }

  addNew() {
    this.privateList = new PrivateList();
  }

  deletePrivateList() {
    /*this.selectedRowData.forEach(rd => {
      deleteItemIds.push(rd.id);
    })*/

    if (this.selectedRowData && this.selectedRowData.id) {
      var deleteItemIds = [];
      deleteItemIds.push(this.selectedRowData.id)
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
          this.sharedservice.deleteprivatelist(deleteItemIds)
            .subscribe((res: any) => {
              deleteItemIds = [];
              this.getAllPrivateList();
              for (var i = 0; i < this.privateListList.length; i++) {
                this.selected[i] = false;
              }
              if (res.succeeded) {
                swal(
                  'Deleted!',
                  'Selected item has been deleted.',
                  'success'
                );
              }
              else {
                var err = "";
                res.errors.forEach((er) => {
                  err = err + " " + er;
                });
                swal(
                  'Error!',
                  err,
                  'error'
                )
              }
            });
          // result.dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
        } else if (result.dismiss === swal.DismissReason.cancel) {
          swal(
            'Cancelled',
            'Selected item is safe :)',
            'error'
          );
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

  getAllPrivateList() {
    this.sharedservice.getAllPrivateList()
      .subscribe((res: any) => {
        console.log(res)
        this.privateListList = res.value;
      })
  }

  updatePrivateList(pl) {
    this.privateList = pl;
    this.isSubmitForm = false;
  }

  updateSelectedColumnsIndex() {
    this.selectedColumns.sort((a, b) => {
      if (a.index > b.index) return 1;
      if (a.index < b.index) return -1;
      return 0;
    })
  }

  savePrivateList(form) {
    this.isSubmitForm = true;
    if (form.valid) {
      this.sharedservice.updatePrivateList(this.privateList)
        .subscribe((res: any) => {
          console.log(res)
          this.isSubmitForm = false;
          if (res.succeeded) {
            this.closePrivateListModal.nativeElement.click();
            this.getAllPrivateList();
          } else {
            var err = "";
            res.errors.forEach((er) => {
              err = err + " " + er;
            });
            swal(
              'Error!',
              err,
              'error'
            )
          }
        })
    }
  }

  uploadPrivateList() {
    if (this.selectedRowData && this.selectedRowData.id) {
      this.inputFile.nativeElement.click();
    }
    else {
      swal(
        'Oops...',
        'Please select an item to upload.',
        'info'
      )
    }
  }

  fileChange(event) {
    if (event.target.files && event.target.files.length > 0 && this.selectedRowData && this.selectedRowData.id) {
      this.sharedservice.uploadPrivateListFiles(event.target.files, this.selectedRowData.id)
        .subscribe((res: any) => {
          console.log(res);
          this.inputFile.nativeElement.value = null;
          this.getAllPrivateList();
          if (res.succeeded) {
            swal(
              'Success',
              'File upload successfully.',
              'success'
            )
          }
          else {
            var err = "";
            res.errors.forEach((er) => {
              err = err + " " + er;
            });
            swal(
              'Error!',
              err,
              'error'
            )
          }
        })
    }
  }

  downloadPrivateList() {
    if (this.selectedRowData && this.selectedRowData.id) {
      this.sharedservice.downloadPrivateList(this.selectedRowData.id)
        .subscribe((res: any) => {
          // console.log(res);
          var link = document.createElement('a');
          link.href = window.URL.createObjectURL(res);
          link.download = "Respondent List.csv";
          link.click();
        })
      // .subscribe((res: any) => {
      // console.log(res);
      // })
    }
    else {
      swal(
        'Oops...',
        'Please select an item to upload.',
        'info'
      )
    }
  }

  getPrivateListSampleFile() {
    this.sharedservice.getPrivateListSampleFile()
      .subscribe((res: any) => {
        console.log(res)
        this.samplefileurl = res.value;
      })
  }
}
