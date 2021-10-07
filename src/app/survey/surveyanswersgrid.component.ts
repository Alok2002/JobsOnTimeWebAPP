import { LoadingBarService } from '@ngx-loading-bar/core';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import { CookieService } from 'ngx-cookie-service';
import swal from 'sweetalert2';

import { Client } from '../models/client';
import { Email } from '../models/email';
import { EmailTemplate } from '../models/emailtemplate';
import { Job } from '../models/job';
import { ResEvent } from '../models/resevent';
import { Session } from '../models/session';
import { Sms } from '../models/sms';
import { SurveyQuestions } from '../models/surveyquestions';
import { User } from '../models/user';
import { ClientServices } from '../services/client.services';
import { EmailServices } from '../services/email.services';
import { JobServices } from '../services/job.services';
import { JobSessionServices } from '../services/jobsession.services';
import { RespondentServices } from '../services/respondent.services';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SharedServices } from '../services/shared.services';
import { SmsServices } from '../services/sms.services';
import { SurveyServices } from '../services/survey.services';
import { UserServices } from '../services/user.services';
import { SecurityRights, SecurityRightsExportError } from '../shared/enum';
import { PtableColumn } from '../models/ptablecolumn';
import { LazyLoadEvent } from 'primeng/api';
import { ObjectUtils } from 'primeng/components/utils/objectutils';

// declare var tinymce: any;
declare var jQuery: any;

@Component({
  selector: 'SurveyAnswersGrid',
  templateUrl: './surveyanswersgrid.component.html'
})

export class SurveyAnswersGridComponent implements OnInit {
  @Input() jobId: number;
  @Input() isUpdateSurvey: boolean;
  @Input() surveyId: number;
  @Input() surveyquestions: Array<SurveyQuestions> = [];
  @Input() isScreener: boolean;
  @Input() noofrows: number; //= 25;

  isLoading = true;
  answerGrid = [];

  deleteItemIds = [];
  clients: Array<Client> = [];
  jobs: Array<Job> = [];
  sessions: Array<Session> = [];
  mobileNumbers = [];
  selectedSession: string;
  provider: string;

  public editor: any;
  @Output() onEditorKeyup = new EventEmitter<any>();

  //Email Model
  selectedUser: string;
  tempalteId: number;
  users: Array<User> = [];
  emailtemplates: Array<EmailTemplate> = [];
  subject: string;
  body: string;
  message: string;
  isElectronicDoc: string;
  selectedJob: number;
  selectedClient: number;

  dataTablesParameters: any;
  totalItems = 0;

  saveQueryName: string;
  maxrecords: any = null;
  filters: any;
  @ViewChild("saveQueryBtn") saveQueryBtn;
  isUpdateFiler = false;

  @ViewChild("saveQueryCancelBtn") saveQueryCancelBtn;
  tableHeaders = [];

  surveyanswers: Array<string> = [];
  selected = [];
  isSelectAllItem = false;

  postEventMsg: string;
  postEventSucceeded = true;
  postEventErrors = [];
  isOpenEventModal = false;
  @ViewChild("openEventModel") openEventModel;
  resevent = new ResEvent();
  emailModalTitle: string;
  emailData = new Email();
  @ViewChild("emailModlaBtn") emailModlaBtn;

  smsData = new Sms();
  smsModalTitle: string;
  @ViewChild("smsModlaBtn") smsModlaBtn;

  selectedColumns: Array<PtableColumn> = [];
  cols: Array<PtableColumn> = [];
  selectedRowData = [];
  ptablesearch: string;
  isShowFilter = true;
  totalRecords = 0;
  colVisData = [];

  frozenCols = [];
  selectedFilterId = null;
  confSmsEmailModalTitle: string;
  currentlyTrackingJob = null;
  jobIdForSmsEmailActionId = null;
  smsEmailJobData: { exJob: Job, trJob: Job } = null;
  job: Job;

  constructor(private router: Router, private securityInfoResolve: SecurityInfoResolve,
    private activateroute: ActivatedRoute, private surveyservice: SurveyServices,
    private resservice: RespondentServices, private clientService: ClientServices,
    private _userService: UserServices, private emailService: EmailServices, private sharedService: SharedServices,
    private jobService: JobServices, private jobSessionService: JobSessionServices,
    private smsservice: SmsServices, private cookieservice: CookieService, private loader: LoadingBarService) {
  }

  ngOnInit() {
    this.getJobById();
    this.getAnswerGrid();
    this.getClients();
    // this.initTinymce();
    this.getUsers();
    this.getEmailTemplates();

    //this.populateTableFields();
  }

  getJobById() {
    this.jobService.getJobsByJob(this.jobId)
      .subscribe((res: any) => {
        this.job = res.value;
      })
  }

  getAnswerGrid() {
    this.cols = [
      { field: 'respondentID', header: 'Action', index: 0, width: '75', sort: true },
      { field: 'respondentFullName', header: 'Respondent Name', index: 1, width: '150', sort: true },
      { field: 'respondentGender', header: 'Gender', index: 2, width: '75', sort: true },
      { field: 'respondentPhoneMobile', header: 'Mobile', index: 3, width: '100', sort: true },
      { field: 'respondentEmail', header: 'Email', index: 4, width: '200', sort: true },
      { field: 'respondentState', header: 'State', index: 4, width: '75', sort: true },
      { field: 'startedTime', header: 'Started', index: 5, width: '150', sort: true },
      { field: 'lastQualifiedEventDateTime', header: 'Qualified Date', index: 6, width: '150', sort: true },
      { field: 'success', header: 'Success', index: 7, width: '75', sort: true },
      { field: 'qualfiiedToGroup', header: 'Qualified', index: 8, width: '100', sort: true },
      { field: 'disqualfiiedToGroup', header: 'Disqualified', index: 9, width: '100', sort: true },
      { field: 'respondent.age', header: 'Age', index: 10, width: '75', sort: true },
      { field: 'respondent.jobsSummary', header: 'Jobs', index: 11, width: '300', sort: true },
      { field: 'respondent.eventsSummaryCondensed', header: 'Event Summary', index: 12, width: '510', sort: true }
    ];

    this.selectedColumns = this.cols;

    var index = 13;
    this.surveyquestions.forEach(sq => {
      /*this.colVisData.push({ data: sq.questionText, value: true, dbModel: sq.questionText });
      this.columns.push({ name: sq.questionText });*/
      this.cols.push({ field: "answer", header: sq.questionNumber + '. ' + sq.questionTextClean, index: index++, width: '125', sort: true })
    });

    this.frozenCols = [
      { field: 'respondentID', header: 'Action', index: 0, width: '75', sort: true },
      { field: 'respondentFullName', header: 'Respondent Name', index: 1, width: '150', sort: true }
    ];
  }

  loadData(event: LazyLoadEvent) {
    if (!event.sortField) { event.sortField = "success" }
    if (!event.sortOrder) { event.sortOrder = 1 }

    console.log(event);
    this.sharedService.getDataWithFilter(event, this.colVisData, this.maxrecords, this.filters, "ClientJobSurvey", this.surveyId)
      .subscribe((resp: any) => {
        // debugger;
        this.answerGrid = resp.value;
        this.totalRecords = resp.totalCount;
        console.log(this.answerGrid);
        console.log(this.loader);
        this.loader.complete();
        this.loader.stop();
      });
  }

  getValueFromObject(answersobj) {
    return Object.keys(answersobj).map(i => answersobj[i]);
  }

  populateTableFields() {
    this.tableHeaders.push('test1');
    this.tableHeaders.push('test2');
    this.tableHeaders.push('test3');
    console.log("populate");
  }

  exporttoExcel(method) {
    this.securityInfoResolve.checkPermission(SecurityRights.ExportAllResults)
      .subscribe((res: any) => {
        if (res.succeeded) {
          if (method == 'excel') {
            //this.exporttoExcelHelper();
            this.sharedService.getQueryResultsDataExport(event, this.colVisData, this.maxrecords, this.filters, "ClientJobSurvey", this.surveyId)
              .subscribe((res: any) => {
                //console.log(res);
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(res);
                link.download = "Survey Answer.xlsx";
                link.click();
              })
          }
          if (method == 'raw') {
            this.sharedService.getQueryResultsRawDataExport(event, this.colVisData, this.maxrecords, this.filters, "ClientJobSurvey", this.surveyId)
              .subscribe((res: any) => {
                //console.log(res);
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(res);
                link.download = "Survey Answer.csv";
                link.click();
              })
          }
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

    var col = [{ header: 'Res Id', key: 'respondentID', width: 10 },
    { header: 'Respondent Name', key: 'respondentFullName', width: 25 },
    { header: 'Gender', key: 'respondentGender', width: 10 },
    { header: 'Mobile', key: 'respondentPhoneMobile', width: 15 },
    { header: 'Email', key: 'respondentEmail', width: 30 },
    { header: 'State', key: 'respondentState', width: 30 },
    { header: 'Started', key: 'startedTime', width: 30 },
    { header: 'Last Qualified', key: 'lastQualifiedEventDateTime', width: 30 },
    { header: 'Success', key: 'success', width: 15 },
    { header: 'Qualified', key: 'qualfiiedToGroup', width: 15 },
    { header: 'Disqualified', key: 'disqualfiiedToGroup', width: 15 },
    { header: 'Age', key: 'respondent.age', width: 15 },
      // { header: 'Jobs', key: 'respondent.jobsSummary', width: 100 },
      // { header: 'Event Summary', key: 'respondent.eventsSummaryCondensed', width: 100 }
    ];

    this.surveyquestions.forEach(sq => {
      col.push({ header: sq.questionTextClean, key: sq.questionTextClean, width: 15 });
    });

    sheet.columns = col;

    let dataArray = [];
    console.log(this.answerGrid);
    this.answerGrid.forEach((am) => {
      var dataobj = {};
      //sheet
      sheet.columns.forEach(cl => {
        if ((cl.key == 'lastQualifiedEventDateTime' || cl.key == 'startedTime') &&
          am[cl.key] != '0001-01-01T00:00:00') {
          var cdate = moment(am[cl.key]).format('DD/MM/YYYY hh:mm');
          dataobj[cl.key] = cdate;
        }
        else if (am[cl.key] == '0001-01-01T00:00:00') {
          dataobj[cl.key] = "";
        }
        else if (cl.key == 'respondent.age') {
          dataobj[cl.key] = am["respondent"]["age"];
        }
        else {
          dataobj[cl.key] = am[cl.key];
        }
      });

      this.surveyquestions.forEach((sq, i) => {
        dataobj[sq.questionTextClean] = this.getValueFromObject(am.answers)[i];
      });

      dataArray.push(dataobj);
    });

    console.log(dataArray)
    dataArray.forEach(da => {
      sheet.addRow(da);
    })

    sheet.getRow('1').font = {
      size: 14,
      bold: true
    };

    var filename = "Survey Answers.xlsx";
    /* save to file */
    workbook.xlsx.writeBuffer().then(function (data) {
      saveAs(new Blob([data], { type: 'application/octet-stream' }), filename);
    });
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
              const content = editor.getContent();
              console.log(content);
              self.onEditorKeyup.emit(content);
              if (editor.id == "galleryPreDeployment") {
                //template.galleryPreDeployment = content;
                //this.body = content;
              }
            });
        }
      });
      jQuery(".mce-tinymce").css('display', 'block');
    });
    this.isLoading = false;
  }*/

  getUsers() {
    this._userService.getAllUser()
      .subscribe((res: any) => {
        this.users = res.value;
      });
  }

  getEmailTemplates() {
    this.emailService.getEmailTemplates()
      .subscribe((res: any) => {
        this.emailtemplates = res.value;
        this.isLoading = false;
      })
  }

  changeTemplate() {
    this.emailtemplates.forEach((te) => {
      if (te.id == this.tempalteId) {
        this.subject = te.subject;
        this.body = te.body;

        /*tinymce.remove();
        this.initTinymce();*/
      }
    })
  }

  getClients() {
    this.clientService.getAllClients()
      .subscribe((res: any) => {
        console.log(res);
        this.clients = res.value;
        console.log(this.clients);
        this.isLoading = false;
      });

  }

  getJobsbyClientId(clientId) {
    this.jobService.getJobsByClient(clientId)
      .subscribe((res: any) => {
        this.jobs = res.value;
      });
  }

  getSessionbyJobId(jobId) {
    this.jobSessionService.getSessionByJob(jobId)
      .subscribe((res: any) => {
        this.sessions = res.value;
      });
  }

  checkStringLength(inputstring) {
    if (inputstring != null) {
      var mapstring = new String(inputstring);
      return mapstring.length;
    }
    return 0;
  }

  voiceMailLeft() {
    var currentlyTrackingJob = this.cookieservice.check("currentlytracking") ? JSON.parse(this.cookieservice.get("currentlytracking")) : null;

    this.deleteItemIds = [];
    this.selectedRowData.forEach(rd => {
      this.deleteItemIds.push(rd.respondentID);
    })
    if (this.deleteItemIds.length > 0) {
      var resevnt = new ResEvent();
      resevnt.respondentIdsString = this.deleteItemIds.join(',');
      /*this.jobService.allocateJobs(this.deleteItemIds)
        .subscribe(res => {*/
      // this.resservice.voiceMailleft()
      // .subscribe((res) => {
      //   console.log(res);
      // });

      if (currentlyTrackingJob) resevnt.jobId = currentlyTrackingJob.id;
      console.log(resevnt);

      this.resservice.voiceMailleft(resevnt)
        .subscribe((res: any) => {
          console.log(res);
          if (res.succeeded) {
            swal(
              'Voice Mail Sent!',
              res.successMsg,
              'success'
            );
          }
          this.unCheckAllItems();
        })
    }
    else {
      swal(
        'Oops...',
        'Please select an item.',
        'info'
      );
    }
  }

  unCheckAllItems() {
    this.selectedRowData = [];
    this.deleteItemIds = [];
  }

  filterSubmit(res) {
    console.log(res);
    this.isLoading = true;
    this.filters = res.filters;
    this.maxrecords = res.maxrecords == null ? 50 : res.maxrecords;

    this.loadData({ first: 0, rows: this.noofrows });
  }

  saveQuery() {
    this.isUpdateFiler = false;
    console.log(this.filters)
    this.sharedService.saveQuery('ClientJobSurvey', null, this.jobId, this.saveQueryName, this.filters, this.surveyId)
      .subscribe((res: any) => {
        console.log(res);
        if (res.succeeded) {
          this.selectedFilterId = res.value;
          this.isUpdateFiler = true;
          this.saveQueryCancelBtn.nativeElement.click();
        }
      })
  }

  filtersEmit(res) {
    console.log(res);
    this.filters = res;
  }

  openSaveQueryModal() {
    this.saveQueryName = "";
    if (this.filters && this.filters.length > 0) {
      this.saveQueryBtn.nativeElement.click()
    }
    else {
      swal(
        'Oops...',
        'Select at least one filter to save query.',
        'info'
      )
    }
  }

  gotoScreen(resid) {
    this.surveyservice.getScreenerId(this.jobId, 0)
      .subscribe((res: any) => {
        console.log(res);
        if (res.succeeded) {
          //this.router.navigate(['/screener', this.surveyId, resid, res.value, this.jobId]);
          var link = '/screener/' + this.surveyId + '/' + resid + '/' + res.value + '/' + this.jobId;
          this.router.navigate([]).then(result => { window.open(link, '_blank'); });

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

  getToolTipData(resid) {
    var ret = "";
    this.answerGrid.forEach(ag => {
      var rs = ag.respondent;
      if (rs.id == resid) {
        if (rs.doNotCall)
          ret = "<div class='text-danger text-left'>- Do Not Call</div>";

        if (rs.hasAccent || rs.oneOffRespondent || rs.keenRespondent) {
          if (rs.keenRespondent)
            ret += "<div class='text-warning text-left'>- Keen Respondent</div>";
          if (rs.hasAccent)
            ret += "<div class='text-info text-left'>- Has Accent</div>";
          if (rs.oneOffRespondent)
            ret += "<div class='text-success text-left'>- One Off Repondent</div>";
        }

        if (rs.inactive) ret += "<div class='text-danger text-left'>- Inactive</div>";
      }
    })
    return ret;
  }

  ngDoCheck() {
    if (typeof jQuery != 'undefined') {
      jQuery('[data-toggle="tooltip"]').tooltip({ container: 'body' });
    }
  }

  getAge(month, year) {
    //var years = moment().diff(year + '-' + month + '-01', 'years');

    var currentYear = (new Date()).getFullYear();
    var currentMonth = (new Date()).getMonth() + 1;

    //currentYear--;
    var ageYear = currentYear - year;
    if (month < currentMonth)
      ageYear = ageYear + 1;
    return (ageYear - 1);
  }

  /***PanelMember Function**/
  newResEvent() {
    this.postEventMsg = null;
    this.postEventSucceeded = true;
    this.postEventErrors = [];

    this.deleteItemIds = [];
    this.selectedRowData.forEach(rd => {
      this.deleteItemIds.push(rd.respondentID);
    })
    if (this.deleteItemIds.length > 0) {
      this.isOpenEventModal = true;
      this.resevent = new ResEvent();
      setTimeout(() => {
        this.openEventModel.nativeElement.click();
      }, 1000);
    }
    else {
      swal(
        'Oops...',
        'Please select an item to create event.',
        'info'
      )
    }
  }

  resetEventForm(event) {
    if (event) {
      this.resevent = new ResEvent();
      this.selectedClient = null;
      this.deleteItemIds = [];
      this.unCheckAllItems();
      this.isOpenEventModal = false;
    }
  }

  openEmailModal(entity, title) {
    this.emailModalTitle = title;
    this.deleteItemIds = [];
    this.selectedRowData.forEach(rd => {
      this.deleteItemIds.push(rd.respondentID);
    })
    console.log(this.deleteItemIds);

    if (this.deleteItemIds.length > 0) {
      /*var ids = "?";
      this.deleteItemIds.forEach(di => {
        ids += 'respondentIds=' + di + '&';
      });
      this.emailService.getEmailData(entity, ids)*/
      this.emailService.getCreateRespondentEmail(this.deleteItemIds, this.jobId, null)
        .subscribe((res: any) => {
          console.log(res);
          if (res.succeeded) {
            this.emailData = res.value;
            this.emailData.jobId = this.jobIdForSmsEmailActionId;
            console.log(this.emailData);

            setTimeout(() => {
              this.emailModlaBtn.nativeElement.click();
            }, 1000)
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
    else {
      swal(
        'Oops...',
        'Please select an item.',
        'info'
      )
    }
  }

  closeModal(e) {
    if (e) {
      this.unCheckAllItems();
    }
  }

  openSmsModal(entity, title) {
    console.log(this.deleteItemIds)
    this.smsModalTitle = title;
    this.deleteItemIds = [];
    this.selectedRowData.forEach(rd => {
      this.deleteItemIds.push(rd.respondentID);
    })

    if (this.deleteItemIds.length > 0) {
      var ids = "?";
      this.deleteItemIds.forEach(di => {
        ids += 'respondentIds=' + di + '&';
      });
      console.log(ids);
      this.smsservice.getSmsData(entity, ids)
        .subscribe((res: any) => {
          console.log(res);
          this.smsData = res.value;
          this.smsData.jobId = this.jobIdForSmsEmailActionId;
          this.smsModlaBtn.nativeElement.click();
        })
    }
    else {
      swal(
        'Oops...',
        'Please select an item.',
        'info'
      )
    }
  }

  getReplacedData(data) {
    if (data)
      return data.replace(/\n/g, '<br>');
    else
      return '';
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

  /*onRowSelect(e) {
    var index = this.selectedRowData.findIndex(sr => sr.id == e.data.respondentID);
    if (index < 0)
      this.selectedRowData.push({ respondentID: e.data.respondentID })
  }

  onRowUnselect(e) {
    var index = this.selectedRowData.findIndex(sr => sr.respondentID == e.data.respondentID);
    this.selectedRowData.splice(index, 1);
  }*/

  trackByFn(index, item) {
    // console.log( 'TrackBy:', item, index );
    return (item.respondentID);
  }

  onRowClick(e, resid) {
    var index = this.selectedRowData.findIndex(sr => sr.id == resid);
    if (index < 0 && this.selectedRowData.length < 1) {
      this.selectedRowData.push({ respondentID: resid });
    }
    else if (index < 0 && this.selectedRowData.length > 1 && e.ctrlKey) {
      this.selectedRowData.push({ respondentID: resid });
    }
    else if (index >= 0 && this.selectedRowData.length > 0 && e.ctrlKey) {
      this.selectedRowData.splice(index, 1);
    }
    else if (e.ctrlKey)
      this.selectedRowData.push({ respondentID: resid });
    else {
      this.selectedRowData = [];
      this.selectedRowData.push({ respondentID: resid });
    }
    console.log(this.selectedRowData);
  }

  isRowSelected(resid) {
    var ret = false;
    var index = this.selectedRowData.findIndex(sr => sr.respondentID == resid);
    if (index >= 0) ret = true;
    return ret;
  }

  confirmModalForSmsEmail(module) {
    this.smsEmailJobData = { exJob: null, trJob: null };
    this.getCurrentlyTrackingJob();
    this.smsEmailJobData.exJob = this.job;
    this.jobIdForSmsEmailActionId = this.smsEmailJobData.exJob.id;

    if (this.currentlyTrackingJob && this.currentlyTrackingJob.id && this.jobIdForSmsEmailActionId != this.currentlyTrackingJob.id) {
      this.smsEmailJobData.trJob = this.currentlyTrackingJob;
      /*swal({
        title: 'Do you want this action against the tracked job?',
        text: '',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        confirmButtonColor: '#ffaa00',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {
          this.jobIdForSmsEmailActionId = this.currentlyTrackingJob.id;
        } else {
          this.jobIdForSmsEmailActionId = this.jobId;
        }
        this.confirmModalForSmsEmailHelper(module);
      });*/
    } //else {
    console.log(this.smsEmailJobData)
    this.confirmModalForSmsEmailHelper(module);
    //}
  }

  confirmModalForSmsEmailHelper(module) {
    if (module == 'email') {
      this.openEmailModal('CreateRespondentEmail', 'Send Email')
    }
    if (module == 'sms') {
      this.openSmsModal('CreateRespondentSms', 'Send SMS')
    }
  }

  getCurrentlyTrackingJob() {
    if (this.cookieservice.check("currentlytracking"))
      this.currentlyTrackingJob = JSON.parse(this.cookieservice.get("currentlytracking"));
    else
      this.currentlyTrackingJob = null;
  }
}

