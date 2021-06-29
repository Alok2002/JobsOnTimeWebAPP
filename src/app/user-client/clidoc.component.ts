import { SharedServices } from './../services/shared.services';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { DocumentServices } from '../services/document.services';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { PtableColumn } from '../models/ptablecolumn';
import { Job } from '../models/job';
import { Documents } from '../models/documents';
import { LazyLoadEvent } from 'primeng/api';
import { apiHost } from '../app.component';
import swal from 'sweetalert2';

declare var jQuery: any;

@Component({
  selector: 'CliDocComponent',
  templateUrl: 'clidoc.component.html'
})

export class CliDocComponent implements OnInit {
  apiHost = apiHost;
  @Input() id: number;
  @Input() isUpdateJob: boolean;
  noofrows = 50;
  selectedColumns: Array<PtableColumn> = [];
  cols: Array<PtableColumn> = [];
  selectedRowData: any;
  ptablesearch: string;
  isShowFilter = true;
  totalRecords = 0;
  colVisData = [];
  selectedFilterId = null;
  docs: Array<Documents>;
  doc: Documents;
  maxrecords: any = null;
  filters: any = null;

  allowedTypes: any;
  isUploadingDoc = false;
  categories = [];
  submitResults = [];

  entity = 'jobDocument';
  isChangeActionStatus = false;
  loginusername: string;
  loginnameid: string;
  documentActionList = [];

  constructor(private router: Router, private securityInfoResolve: SecurityInfoResolve,
    private _docService: DocumentServices, private sharedService: SharedServices) {
  }

  ngOnInit() {
    this.getDocuments(this.id);
    this.getCategories();
  }

  getDocuments(id) {
    this.cols = [
      { field: 'date', header: 'Date', index: 0, width: '100', sort: true },
      { field: 'time', header: 'Time', index: 1, width: '75', sort: false },
      { field: 'isPreviousVersion', header: 'Old', index: 2, width: '50', sort: false, textAlign: 'center' },
      { field: 'userFullName', header: 'Username', index: 3, width: '150', sort: false },
      { field: 'documentName', header: 'Document Name', index: 4, width: 'auto', sort: false },
      // { field: 'category', header: 'Category', index: 5, width: '120', sort: false },
      // { field: 'accessType', header: 'Access Type', index: 6, width: '120', sort: false },
      // { field: 'actionStatus', header: 'Action Status', index: 7, width: '120', sort: false },
      // { field: 'dateActioned', header: 'Date Actioned', index: 8, width: '125', sort: false, textAlign: 'center' },
      // { field: 'actionedByFullName', header: 'Actioned By', index: 9, width: '150', sort: false }
    ];

    this.selectedColumns = this.cols;
  }

  loadData(event: LazyLoadEvent) {
    if (!event.sortField) { event.sortField = "dateCreated" }
    if (!event.sortOrder) { event.sortOrder = -1 }

    console.log(event);
    this.sharedService.getDataWithFilter(event, this.colVisData, this.maxrecords, this.filters, "jobDocument", this.id)
      .subscribe((resp: any) => {
        // debugger;
        this.docs = resp.value;
        this.totalRecords = resp.totalCount;
        console.log(this.docs);
      });
  }

  getCategories() {
    this.sharedService.getReferenceDataProvider('ElectronicDocumentCategory')
      .subscribe((res: any) => {
        this.categories = res.value;
        console.log(res);
      })
  }

  onUploadFiles(evt: any) {
    this.isUploadingDoc = true;

    if (evt.error) {
      throw evt.error;
    }

    const files = evt.files;
    this.submitClientNotes(files);
    // You can run upload script here
  }
  
  submitClientNotes(files) {
    var docData = { 'parentId': this.id, 'parentTableName': 'ClientJob' };
    console.log(this.submitResults);
    this._docService.postClientDocument(docData, files)
      .subscribe((res: any) => {
        this.isUploadingDoc = false;
        this.loadData({ first: 0, rows: this.noofrows });

        if (res.succeeded) {
          this.submitResults.forEach((sr) => {
            sr.status = "Success";
          });
        } else {
          this.submitResults.forEach((sr) => {
            sr.status = "Failed";
          });
        }
      });
  }

  updateSelectedColumnsIndex() {
    this.selectedColumns.sort((a, b) => {
      if (a.index > b.index) return 1;
      if (a.index < b.index) return -1;
      return 0;
    })
  }

  updateDocument(doc) {
    if (this.isChangeActionStatus) {
      doc.actionedBy = this.loginnameid;
      doc.actionedByFullName = this.loginusername;
      doc.dateActioned = new Date();
      this.isChangeActionStatus = false;
    }

    this._docService.updateDocument(doc)
      .subscribe((res: any) => {
        console.log(res);
        if (res.succeeded) {
          this.loadData({ first: 0, rows: this.noofrows });
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

