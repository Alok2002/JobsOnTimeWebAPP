import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import { Subject } from 'rxjs/Subject';
import swal from 'sweetalert2';
import { RespEvent } from '../models/respevent';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SurveyServices } from '../services/survey.services';
import { SecurityRights, SecurityRightsExportError } from '../shared/enum';
import { SharedServices } from '../services/shared.services';
import { PtableColumn } from '../models/ptablecolumn';
import { LazyLoadEvent } from 'primeng/api';
import { ObjectUtils } from 'primeng/components/utils/objectutils';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'SurveyEventsComponent',
  templateUrl: './surveyevents.component.html',
})

export class SurveyEventsComponent implements OnInit {
  constructor(private surveyservice: SurveyServices, private securityInfoResolve: SecurityInfoResolve,
    private sharedService: SharedServices) {
  }

  @Input() jobId: number;
  @Input() isUpdateSurvey: boolean;
  @Input() isScreener: boolean;

  respEvent: RespEvent;
  respEvents: Array<RespEvent>;

  deleteItemIds = [];
  isSubmitForm = false;
  isSubmitFormSpinner = false;
  isLoading = true;

  @ViewChild('closeAddNewModal') closeAddNewModal;
  @ViewChild('checkBox') checkBox;
  selected = [];
  id: number;

  dataTablesParameters: any;
  totalItems = 0;

  saveQueryName: string;
  maxrecords: any = null;
  filters: any;
  @ViewChild('saveQueryBtn') saveQueryBtn;

  isSelectAllItem = false;
  isUpdateFiler = false;
  @ViewChild("saveQueryCancelBtn") saveQueryCancelBtn;

  noofrows = 50;
  selectedColumns: Array<PtableColumn> = [];
  cols: Array<PtableColumn> = [];
  selectedRowData = [];
  ptablesearch: string;
  isShowFilter = true;
  totalRecords = 0;
  colVisData = [];

  entity: string;

  ngOnInit() {
    if(!this.isScreener) this.entity = 'surveyEvents';
    else this.entity = 'screenerEvents';

    this.getAllSurveyEvents();
    this.addNew();
  }

  addNew() {
    this.respEvent = new RespEvent();
  }

  getAllSurveyEvents() {
    this.cols = [
      { field: 'id', header: 'ID', index: 0, width: '75', sort: false },
      { field: 'respondentFullName', header: 'Name', index: 1, width: '200', sort: false },
      { field: 'userFullName', header: 'User', index: 2, width: '150', sort: false },
      { field: 'eventDate', header: 'Event Date', index: 3, width: '120', sort: false },
      { field: 'eventDescription', header: 'Event', index: 4, width: '250', sort: false },
      { field: 'eventNotes', header: 'Notes', index: 5, width: 'auto', sort: false }
    ];

    this.selectedColumns = this.cols;
  }

  loadData(event: LazyLoadEvent) {
    console.log(this.jobId);
    if (!event.sortField) { event.sortField = "eventDate" }
    if (!event.sortOrder) { event.sortOrder = -1 }

    console.log(event);
    this.sharedService.getDataWithFilter(event, this.colVisData, this.maxrecords, this.filters, this.entity, this.jobId)
      .subscribe((resp: any) => {
        // debugger;
        this.respEvents = resp.value;
        this.totalRecords = resp.totalCount;
        console.log(this.respEvents);
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
      { header: 'Id', key: 'resId', width: 10 },
      { header: 'Name', key: 'userName', width: 20 },
      { header: 'Date', key: 'eventDate', width: 15 },
      { header: 'Event', key: 'eventDescription', width: 15 },
      { header: 'User', key: 'fullName', width: 25 },
      { header: 'Notes', key: 'eventNotes', width: 50 }
    ];

    this.respEvents.forEach((am) => {
      var dataobj = {};
      //sheet
      sheet.columns.forEach(cl => {
        if (cl.key == 'fullName')
          dataobj[cl.key] = am['userNameNavigation'][cl.key];
        else if (cl.key == 'eventDate') {
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

    var filename = 'Survey Events.xlsx';
    /* save to file */
    workbook.xlsx.writeBuffer().then(function (data) {
      saveAs(new Blob([data], { type: 'application/octet-stream' }), filename);
    });
  }

  unCheckAllItems() {
    this.deleteItemIds = [];
    this.selectedRowData = [];
  }

  filterSubmit(res) {
    console.log(res);
    this.filters = res.filters;
    this.maxrecords = res.maxrecords;

    this.loadData({ first: 0, rows: this.noofrows });
  }

  saveQuery() {
    this.isUpdateFiler = false;
    this.sharedService.saveQuery('jobgroup', null, '', this.saveQueryName, this.filters)
      .subscribe((res: any) => {
        console.log(res);
        if (res.succeeded) {
          this.isUpdateFiler = true;
          this.saveQueryCancelBtn.nativeElement.click();
          /*swal('Successfully Saved!',
            '',
            'success');*/
        }
      });
  }

  filtersEmit(res) {
    console.log(res);
    this.filters = res;
  }

  updateSelectedColumnsIndex() {
    this.selectedColumns.sort((a, b) => {
      if (a.index > b.index) return 1;
      if (a.index < b.index) return -1;
      return 0;
    })
  }

  resolveFieldData(data, field) {
    return ObjectUtils.resolveFieldData(data, field);
  }
}
