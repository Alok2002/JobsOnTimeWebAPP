import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Session } from '../models/session';
import { Client } from '../models/client';
import { JobServices } from '../services/job.services';
import { ClientServices } from '../services/client.services';
import { EmailServices } from '../services/email.services';
import { UserServices } from '../services/user.services';
import { RespondentServices } from '../services/respondent.services';
import { HttpClient } from '@angular/common/http';
import { SharedServices } from '../services/shared.services';
import { Respondent } from '../models/respondent';
import { Component, OnInit, ViewChild, ViewEncapsulation, EventEmitter, Output } from '@angular/core';
declare var jQuery: any;
import swal from 'sweetalert2';

import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as stream from 'stream';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import { User } from '../models/user';
import { EmailTemplate } from '../models/emailtemplate';
import { Job } from '../models/job';
import { Email } from '../models/email';
import { ResEvent } from '../models/resevent';
import { Incentive } from '../models/incentive';
import { Sms } from '../models/sms';
import { SecurityRights, SecurityRightsExportError } from '../shared/enum';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { EventClient } from '../models/eventclient';
import { EventServices } from '../services/event.services';
import { SurveyServices } from "../services/survey.services";
import { SmsServices } from '../services/sms.services';
import { SessionTime } from '../models/sessiontime';
import { JobSessionServices } from '../services/jobsession.services';
import { SessionServices } from '../services/session.services';
import { PtableColumn } from '../models/ptablecolumn';
import { LazyLoadEvent } from 'primeng/api';
import { isMobile } from '../app.component';

declare var Clipboard: any;


// declare var tinymce: any;

@Component({
  templateUrl: './panelmember.component.html',
})

export class PanelMemberComponent implements OnInit {
  respondents: Array<Respondent>;
  respondent: Respondent;
  selectres: Respondent;
  isLoading = true;

  deleteItemIds = [];
  isSubmitForm = false;
  isSubmitFormSpinner = false;

  @ViewChild("closeAddNewModal") closeAddNewModal;
  @ViewChild("checkBox") checkBox;

  selected = [];
  totalItems: number;


  fields = [
    { "data": "ID", "value": true, "model": "id", "isDate": false, "width": '100' },
    { "data": "First Name", "value": true, "model": "givenNames", "isDate": false, "width": '100' },
    { "data": "Last Name", "value": true, "model": "lastName", "isDate": false, "width": '100' },
    { "data": "Gender", "value": true, "model": "gender", "isDate": false, "width": '100' },
    { "data": "Age", "value": true, "model": "", "isDate": false, "width": '100' },
    { "data": "State", "value": true, "model": "state", "isDate": false, "width": '100' },
    { "data": "Mobile", "value": true, "model": "formattedPhoneMobile", "isDate": false, "width": '100' },
    { "data": "Email", "value": true, "model": "email", "isDate": false, "width": '100' },
    { "data": "Jobs", "value": true, "model": "jobsSummary", "isDate": false, "width": '100' },
    { "data": "Events Summary", "value": true, "model": "eventsSummaryCondensed", "isDate": false, "width": '100' },
    { "data": "Suburb Home", "value": false, "model": "suburbHome", "isDate": false, "width": '100' },
    { "data": "Phone - Home", "value": true, "model": "phoneHome", "isDate": false, "width": '100' },
    { "data": "Phone - Work", "value": true, "model": "phoneBusiness", "isDate": false, "width": '100' },
    { "data": "Date Created", "value": false, "model": "dateCreated", "isDate": true, "width": '100' },
    { "data": "Rating", "value": false, "model": "rating", "isDate": false, "width": '100' },
    { "data": "Source", "value": false, "model": "source", "isDate": false, "width": '100' },
    { "data": "Close City", "value": false, "model": "closeCity", "isDate": false, "width": '100' },
    { "data": "Visa Status", "value": false, "model": "visaStatus", "isDate": false, "width": '100' },
    { "data": "Brth Country", "value": false, "model": "birthCountry", "isDate": false, "width": '100' },
    { "data": "Origin Country", "value": false, "model": "originCountry", "isDate": false, "width": '100' },
    { "data": "Ethnic Background", "value": false, "model": "ethnicBackground", "isDate": false, "width": '100' },
    { "data": "Phone Mobile2", "value": false, "model": "phoneMobile2", "isDate": false, "width": '100' },
    { "data": "Postcode Home", "value": false, "model": "postcodeHome", "isDate": false, "width": '100' },
    { "data": "Suburb Business", "value": false, "model": "suburbBusiness", "isDate": false, "width": '100' },
    { "data": "Postcode Business", "value": false, "model": "postcodeBusiness", "isDate": false, "width": '100' },
    { "data": "Occupation Level", "value": false, "model": "occupationLevel", "isDate": false, "width": '100' },
    { "data": "Student PrivPub", "value": false, "model": "studentPrivPub", "isDate": false, "width": '100' },
    { "data": "Student Suburb", "value": false, "model": "studentSuburb", "isDate": false, "width": '100' },
    { "data": "Student StudyField", "value": false, "model": "studentStudyField", "isDate": false, "width": '100' },
    { "data": "Contacts Brand", "value": false, "model": "contactsBrand", "isDate": false, "width": '100' },
    { "data": "Other", "value": false, "model": "other", "isDate": false, "width": '100' },
    { "data": "Business Size", "value": false, "model": "businessSize", "isDate": false, "width": '100' },
    { "data": "Partner Business Size", "value": false, "model": "partnerBusinessSize", "isDate": false, "width": '100' },
    { "data": "Computer User", "value": false, "model": "computerUser", "isDate": false, "width": '100' },
    { "data": "Internet User", "value": false, "model": "internetUser", "isDate": false, "width": '100' },
    { "data": "Glasses", "value": false, "model": "glasses", "isDate": false, "width": '100' },
    { "data": "One Off Respondent", "value": false, "model": "oneOffRespondent", "isDate": false, "width": '100' },
    { "data": "Do Not Call", "value": false, "model": "doNotCall", "isDate": false, "width": '100' },
    { "data": "Occupation Id", "value": false, "model": "occupationId", "isDate": false, "width": '100' },
    { "data": "Industry Id", "value": false, "model": "industryId", "isDate": false, "width": '100' },
    { "data": "Partner Occupation Id", "value": false, "model": "partnerOccupationId", "isDate": false, "width": '100' },
    { "data": "Travel Location Id", "value": false, "model": "travelLocationId", "isDate": false, "width": '100' },
    { "data": "Drink Type Id", "value": false, "model": "drinkTypeId", "isDate": false, "width": '100' },
    { "data": "Phone Mobile Provider Id", "value": false, "model": "phoneMobileProviderId", "isDate": false, "width": '100' },
    { "data": "Phone Mobile Provider2 Id", "value": false, "model": "phoneMobileProvider2Id", "isDate": false, "width": '100' },
    { "data": "House hold Type Id", "value": false, "model": "householdTypeId", "isDate": false, "width": '100' },
    { "data": "Marital Status Id", "value": false, "model": "maritalStatusId", "isDate": false, "width": '100' },
    { "data": "Residence Type Id", "value": false, "model": "residenceTypeId", "isDate": false, "width": '100' },
    { "data": "Main City Location Id", "value": false, "model": "mainCityLocationId", "isDate": false, "width": '100' },
    { "data": "Internet Provider Id", "value": false, "model": "internetProviderId", "isDate": false, "width": '100' },
    { "data": "Vehicle1 Year", "value": false, "model": "vehicle1Year", "isDate": false, "width": '100' },
    { "data": "Vehicle1 Make Id", "value": false, "model": "vehicle1MakeId", "isDate": false, "width": '100' },
    { "data": "Vehicle1 Model", "value": false, "model": "vehicle1Model", "isDate": false, "width": '100' },
    { "data": "Vehicle2 Year", "value": false, "model": "vehicle2Year", "isDate": false, "width": '100' },
    { "data": "Vehicle2 Make Id", "value": false, "model": "vehicle2MakeId", "isDate": false, "width": '100' },
    { "data": "Vehicle2 Model", "value": false, "model": "vehicle2Model", "isDate": false, "width": '100' },
    { "data": "Articulation Rating", "value": false, "model": "articulationRating", "isDate": false, "width": '100' },
    { "data": "Accent", "value": false, "model": "hasAccent", "isDate": false, "width": '100' },
    { "data": "Phone Mobile1 Type", "value": false, "model": "phoneMobile1Type", "isDate": false, "width": '100' },
    { "data": "Phone Mobile2 Type", "value": false, "model": "phoneMobile2Type", "isDate": false, "width": '100' },
    { "data": "Phone Home Provider Id", "value": false, "model": "phoneHomeProviderId", "isDate": false, "width": '100' },
    { "data": "Phone Business Provider Id", "value": false, "model": "phoneBusinessProviderId", "isDate": false, "width": '100' },
    { "data": "Smoke Social", "value": false, "model": "smokeSocial", "isDate": false, "width": '100' },
    { "data": "Smoke Quit", "value": false, "model": "smokeQuit", "isDate": false, "width": '100' },
    { "data": "Smoke Regular", "value": false, "model": "smokeRegular", "isDate": false, "width": '100' },
    { "data": "Photo Url", "value": false, "model": "photoUrl", "isDate": false, "width": '100' },
    { "data": "Photo Url", "value": false, "model": "photoUrl", "isDate": false, "width": '100' },
    { "data": "Active", "value": false, "model": "inactive", "isDate": false, "width": '100' },
    { "data": "Inactive Reason", "value": false, "model": "inactiveReason", "isDate": false, "width": '100' },
    { "data": "Source Type", "value": false, "model": "sourceType", "isDate": false, "width": '100' },
    { "data": "Children Allowed", "value": false, "model": "childrenAllowed", "isDate": false, "width": '100' },
    { "data": "Source Details", "value": false, "model": "sourceDetails", "isDate": false, "width": '100' },
    { "data": "Household Income Level", "value": false, "model": "householdIncomeLevel", "isDate": false, "width": '100' },
    { "data": "Education Level", "value": false, "model": "educationLevel", "isDate": false, "width": '100' },
    { "data": "Student", "value": false, "model": "isStudent", "isDate": false, "width": '100' },
    { "data": "Business Owner", "value": false, "model": "isBusinessOwner", "isDate": false, "width": '100' },
    { "data": "Unemployed", "value": false, "model": "isUnemployed", "isDate": false, "width": '100' },
    { "data": "Retired", "value": false, "model": "isRetired", "isDate": false, "width": '100' },
    { "data": "Birth Month", "value": false, "model": "birthMonth", "isDate": false, "width": '100' },
    { "data": "Employer Turnover", "value": false, "model": "employerTurnover", "isDate": false, "width": '100' },
    { "data": "Travel Frequency", "value": false, "model": "travelFrequency", "isDate": false, "width": '100' },
    { "data": "Children", "value": false, "model": "hasChildren", "isDate": false, "width": '100' },
    { "data": "Email Additional", "value": false, "model": "emailAdditional", "isDate": false, "width": '100' },
    { "data": "Other Visible", "value": false, "model": "otherVisible", "isDate": false, "width": '100' },
    { "data": "Partner IndustryId", "value": false, "model": "partnerIndustryId", "isDate": false, "width": '100' },
    { "data": "Job Title", "value": false, "model": "jobTitle", "isDate": false, "width": '100' },
    { "data": "Current Education Year", "value": false, "model": "currentEducationYear", "isDate": false, "width": '100' },
    { "data": "Occupation Hours Per Week", "value": false, "model": "occupationHoursPerWeek", "isDate": false, "width": '100' },
    { "data": "Inactive Until", "value": false, "model": "inactiveUntil", "isDate": false, "width": '100' },
    { "data": "Indigenous", "value": false, "model": "indigenous", "isDate": false, "width": '100' },
    { "data": "Partner Smoke Quit", "value": false, "model": "partnerSmokeQuit", "isDate": false, "width": '100' },
    { "data": "Partner Smoke Social", "value": false, "model": "partnerSmokeSocial", "isDate": false, "width": '100' },
    { "data": "Partner Smoke Regular", "value": false, "model": "partnerSmokeRegular", "isDate": false, "width": '100' },
    { "data": "Date Last Updated", "value": false, "model": "dateLastUpdated", "isDate": true, "width": '100' },
    { "data": "Do Not Call Reason", "value": false, "model": "doNotCallReason", "isDate": false, "width": '100' },
    { "data": "Employed", "value": false, "model": "isEmployed", "isDate": false, "width": '100' },
    { "data": "On Maternity Leave", "value": false, "model": "isOnMaternityLeave", "isDate": false, "width": '100' },
    { "data": "Stay At Home Parent", "value": false, "model": "isStayAtHomeParent", "isDate": false, "width": '100' },
    { "data": "Year Moved To Country", "value": false, "model": "yearMovedToCountry", "isDate": false, "width": '100' },
    { "data": "Preferred Contact Method", "value": false, "model": "preferredContactMethod", "isDate": false, "width": '100' },
    { "data": "Preferred Contact Time", "value": false, "model": "preferredContactTime", "isDate": false, "width": '100' },
    { "data": "Vehicle1 Type", "value": false, "model": "vehicle1Type", "isDate": false, "width": '100' },
    { "data": "Vehicle2 Type", "value": false, "model": "vehicle2Type", "isDate": false, "width": '100' },
    { "data": "Maternity From Date", "value": false, "model": "maternityFromDate", "isDate": true, "width": '100' },
    { "data": "Maternity To Date", "value": false, "model": "maternityToDate", "isDate": true, "width": '100' },
    { "data": "Acknowledge No Email", "value": false, "model": "acknowledgeNoEmail", "isDate": false, "width": '100' },
    { "data": "Preferred Group Type", "value": false, "model": "preferredGroupType", "isDate": false, "width": '100' },
    { "data": "Main Bank Id", "value": false, "model": "mainBankId", "isDate": false, "width": '100' },
    { "data": "Business Rego", "value": false, "model": "businessRego", "isDate": false, "width": '100' },
    { "data": "Employer Name", "value": false, "model": "employerName", "isDate": false, "width": '100' },
    { "data": "Private List Name", "value": false, "model": "privateListName", "isDate": false, "width": '100' },
    { "data": "Accumulated Points", "value": false, "model": "accumulatedPoints", "isDate": false, "width": '100' },
    { "data": "Finance Bsb", "value": false, "model": "financeBsb", "isDate": false, "width": '100' },
    { "data": "Finance Account Number", "value": false, "model": "finfinanceAccountNumberanceBsb", "isDate": false, "width": '100' },
    { "data": "Finance Account Name", "value": false, "model": "financeAccountName", "isDate": false, "width": '100' },
    { "data": "Finance Bank Name", "value": false, "model": "financeBankName", "isDate": false, "width": '100' },
    { "data": "Respondent List Id", "value": false, "model": "respondentListId", "isDate": false, "width": '100' },
    { "data": "Internet Type", "value": false, "model": "internetType", "isDate": false, "width": '100' },
    { "data": "Main Language", "value": false, "model": "mainLanguage", "isDate": false, "width": '100' },
    { "data": "Main Language At Home", "value": false, "model": "mainLanguageAtHome", "isDate": false, "width": '100' },
    { "data": "Other Language", "value": false, "model": "otherLanguage", "isDate": false, "width": '100' },
    { "data": "Wrong Email", "value": false, "model": "wrongEmail", "isDate": false, "width": '100' },
    { "data": "Paid Points", "value": false, "model": "paidPoints", "isDate": false, "width": '100' },
    { "data": "Total Points", "value": true, "model": "totalPoints", "isDate": false, "width": '100' },
  ];

  colVisData = [
    { "data": "ID", "value": true, "model": "id", "isDate": false, "width": '100' },
    { "data": "First Name", "value": true, "model": "givenNames", "isDate": false, "width": '120' },
    { "data": "Last Name", "value": true, "model": "lastName", "isDate": false, "width": '120' },
    { "data": "Gender", "value": true, "model": "gender", "isDate": false, "width": '75' },
    { "data": "Age", "value": true, "model": "age", "isDate": false, "width": '50' },
    { "data": "State", "value": true, "model": "state", "isDate": false, "width": '60' },
    { "data": "Mobile", "value": true, "model": "formattedPhoneMobile", "isDate": false, "width": '100' },
    { "data": "Email", "value": true, "model": "email", "isDate": false, "width": '250' },
    { "data": "Jobs", "value": true, "model": "jobsSummary", "isDate": false, "width": '350' },
    { "data": "Events Summary", "value": true, "model": "eventsSummaryCondensed", "isDate": false, "width": '510' },
    { "data": "Home Suburb", "value": false, "model": "suburbHome", "isDate": false, "width": '100' },
    { "data": "Work Suburb", "value": false, "model": "suburbBusiness", "isDate": false, "width": '100' },
    { "data": "Home Phone", "value": true, "model": "formattedPhoneHome", "isDate": false, "width": '100' },
    { "data": "Work Phone", "value": true, "model": "formattedPhoneBusiness", "isDate": false, "width": '100' },
  ];

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
  saveQueryName: string;
  saveForCurrentJob = true;
  maxrecords: any = null;
  filters: any = null;


  getResId: string;
  @ViewChild("saveQueryBtn") saveQueryBtn;


  email: Email;
  bccrecipients = [];
  showEmailSuccessMsg = false;
  showSMSSuccessMsg = false;
  contactTypeList = [];
  selectedContactTypes = [];
  recipients = [];
  contactType: string;
  dropdownSettings = {};

  resevent = new ResEvent();
  eventtypelist = [];
  incentivelist: Array<Incentive>;
  selectAllCheckBox = false;

  sms: Sms;

  @ViewChild("openEventModel") openEventModel;
  @ViewChild("emailModel") emailModel;
  @ViewChild("smsModel") smsModel;
  @ViewChild("sendUpdateEmailModel") sendUpdateEmailModel;
  @ViewChild("sendUpdateSmsModel") sendUpdateSmsModel;

  postEventMsg: string;

  sendupdateemailtemplate: string;
  sendupdatesmstemplate: string;

  postEventErrors = [];
  postEventSucceeded = true;

  sessiontimes: Array<SessionTime> = [];

  @ViewChild("emailModlaBtn") emailModlaBtn;
  emailData = new Email();
  emailModalTitle: string;

  filterid: number;

  smsData = new Sms();
  smsModalTitle: string;
  @ViewChild("smsModlaBtn") smsModlaBtn;

  @ViewChild("surveyInviteModalBtn") surveyInviteModalBtn;
  @ViewChild("saveQueryCancelBtn") saveQueryCancelBtn;
  isUpdateFiler = false;

  eventClients: Array<EventClient> = [];
  eventJobs: Array<EventClient> = [];
  eventJobSessions: Array<EventClient> = [];
  eventIncentives: Array<EventClient> = [];
  currentlyTrackingJob = null;
  isEditInDepthTime = true;

  @ViewChild("sendInviteEmailBtn") sendInviteEmailBtn;
  @ViewChild("screenModalBtn") screenModalBtn;
  @ViewChild("screenModalCloseBtn") screenModalCloseBtn;
  isOpenEventModal = false;

  gotoScreenObj = { clientId: null, jobId: null, jobGroupId: null };
  initView = false;

  //isSurveyInviteEmail: boolean;
  emailSelectionType: string;

  noofrows = 50;
  selectedColumns: Array<PtableColumn> = [];
  cols: Array<PtableColumn> = [];
  selectedRowData = [];
  ptablesearch: string;
  isShowFilter = true;
  totalRecords = 0;

  selectedFilterId = null;
  isMobile = isMobile;
  @ViewChild('sendInviteSmsBtn') sendInviteSmsBtn;

  constructor(private _userService: UserServices,
    private emailService: EmailServices, private http: HttpClient, private sharedService: SharedServices,
    private resservice: RespondentServices, private clientService: ClientServices,
    private activateroute: ActivatedRoute, private jobService: JobServices,
    private jobSessionService: JobSessionServices, private sessionservice: SessionServices,
    private smsservice: SmsServices, private securityInfoResolve: SecurityInfoResolve,
    private eventService: EventServices, private surveyservice: SurveyServices, private router: Router,
    private cookieservice: CookieService) {
  }

  ngOnInit() {
    this.getEventTypeListWithBlank();
    // this.newEmail();
    // this.newSms();
    this.activateroute.params.subscribe(params => {
      if (params['resid']) {
        if (this.getResId) {
          console.log(this.getResId)
        }
        this.getResId = params['resid'];
      }

      if (params['filterid']) this.selectedFilterId = params['filterid'];

      console.log("inside route params");
    });

    const that = this;

    this.getClients();
    // this.initTinymce();
    this.getUsers();
    this.getEmailTemplates();

    this.getEventClient();
    this.getPanelMembers();
  }

  getPanelMembers() {
    this.cols = [];
    this.selectedColumns = [];

    this.colVisData.forEach((fl, i) => {
      this.cols.push({ field: fl.model, header: fl.data, index: i++, width: fl.width, sort: true, isDate: fl.isDate })
      //this.selectedColumns.push({ field: fl.model, header: fl.data, index: i++, width: fl.width, sort: true, isDate: fl.isDate })
    })
    this.selectedColumns = JSON.parse(JSON.stringify(this.cols));
    // this.fields.forEach((fl, i) => {
    //   var ind = this.cols.findIndex(cl => cl.field == fl.model);
    //   if (ind < 0) this.cols.push({ field: fl.model, header: fl.data, index: i++, width: fl.width, sort: true, isDate: fl.isDate })
    // })

    console.log(this.selectedColumns);
  }

  loadData(event: LazyLoadEvent) {
    this.selectedRowData = [];
    if (!event.sortField) { event.sortField = "name" }
    if (!event.sortOrder) { event.sortOrder = 1 }

    console.log(event);
    console.log(this.filters);
    if (this.initView) {
      this.sharedService.getDataWithFilter(event, this.colVisData, this.maxrecords, this.filters, "respondent", null)
        .subscribe((resp: any) => {
          // debugger;
          this.respondents = resp.value;
          this.totalRecords = resp.totalCount;
          console.log(this.respondents);
        });
    }
  }

  ngOnChange() {
    console.log("inside on cahnge");
  }

  /*getAllJobs() {
    this.jobService.getAllJobs()
      .subscribe((res) => {
        this.jobs = res.value;
    console.log(this.jobs);
        this.destroyDataTable();
        this.dtTrigger.next();
        this.updateDataTable();
        this.isLoading = false;
      });
  }*/

  ngDoCheck() {
    if (typeof jQuery != 'undefined') {
      jQuery('[data-toggle="tooltip"]').tooltip({ container: 'body' });
      jQuery('body').on('hidden.bs.modal', function () {
        jQuery("body").css('padding-right', '0px');
      })
    }
  }

  panelMemberInitFn(event) {
    console.log(event);
    this.initView = event;
  }

  exporttoExcel() {
    this.securityInfoResolve.checkPermission(SecurityRights.ExportRespondents)
      .subscribe((res: any) => {
        if (res.succeeded) {
          //this.exporttoExcelHelper();          
          this.sharedService.getQueryResultsExport(event, this.colVisData, this.maxrecords, this.filters, "respondent", null)
            .subscribe((res: any) => {
              //console.log(res);

              /*let blob = new Blob(res, { type: "application/ms-excel" });
              let url = window.URL.createObjectURL(blob);
              let pwa = window.open(url);
              if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
                alert('Please disable your Pop-up blocker and try again.');
              }*/
              var link = document.createElement('a');
              link.href = window.URL.createObjectURL(res);
              link.download = "Respondent.csv";
              link.click();
            })
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
      { header: 'ID', key: 'id', width: 10 },
      { header: 'First Name', key: 'givenNames', width: 30 },
      { header: 'Last Name', key: 'lastName', width: 30 },
      { header: 'Gender', key: 'gender', width: 30 },
      { header: 'Age', key: 'age', width: 15 },
      { header: 'State', key: 'state', width: 50 },
      { header: 'Mobile', key: 'formattedPhoneMobile', width: 50 },
      { header: 'Email', key: 'email', width: 50 },
      { header: 'Job', key: 'jobsSummary', width: 150 },
      { header: 'Events Summary', key: 'eventsSummaryCondensed', width: 150 },
      { header: 'Home Suburb', key: 'suburbHome', width: 20 },
      { header: 'Work Suburb', key: 'suburbBusiness', width: 20 },
      { header: 'Home Phone', key: 'formattedPhoneHome', width: 20 },
      { header: 'Work Phone', key: 'formattedPhoneBusiness', width: 20 }
    ];

    this.respondents.forEach((am) => {
      var dataobj = {};
      //sheet
      sheet.columns.forEach(cl => {
        dataobj[cl.key] = am[cl.key];
      });

      sheet.addRow(dataobj);
    });

    sheet.getRow('1').font = {
      size: 14,
      bold: true
    };

    var filename = "Panel Member.xlsx";
    /* save to file */
    workbook.xlsx.writeBuffer().then(function (data) {
      saveAs(new Blob([data], { type: 'application/octet-stream' }), filename);
    });
  }

  /*initTinymce() {
    tinymce.remove();
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
        console.log(this.emailtemplates);
      })
  }

  changeTemplate() {
    this.emailtemplates.forEach((te) => {
      if (te.id == this.tempalteId) {
        this.email.subject = te.subject;
        this.email.body = te.body;

        // tinymce.remove();
        // this.initTinymce();
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
    this.deleteItemIds = [];
    this.selectedRowData.forEach(rd => {
      this.deleteItemIds.push(rd.id);
    })

    this.getCurrentlyTrackingJob();
    if (this.deleteItemIds.length > 0) {

      /*this.jobService.allocateJobs(this.deleteItemIds)
        .subscribe(res => {*/
      // this.resservice.voiceMailleft()
      // .subscribe((res) => {
      //   console.log(res);
      // });

      this.voiceMailLeftHelper(this.deleteItemIds);
    }
    else {
      /*swal(
        'Oops...',
        'Please select an item to post a event.',
        'info'
      );*/
      swal({
        title: 'Are you sure?',
        html: 'You have not selected any respondents. Do you want to perform this action on ALL respondents that matched the query you have run?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        confirmButtonColor: '#ffaa00',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {
          this.sharedService.getQueryResultsIds(event, this.colVisData, this.maxrecords, this.filters, "respondent", null)
            .subscribe((resp: any) => {
              console.log(resp);
              this.voiceMailLeftHelper(resp.value);
            });
        }
      });
    }
  }

  voiceMailLeftHelper(ids) {
    var resevnt = new ResEvent();
    resevnt.respondentIdsString = ids.join(',');
    if (this.currentlyTrackingJob) resevnt.jobId = this.currentlyTrackingJob.id;

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
        this.deleteItemIds = [];
      })
  }


  //FILTERS
  filterSubmit(res) {
    this.getResId = null;
    console.log("inside filter submit");
    console.log(res)
    debugger
    //this.maxrecords = res.maxrecords == null ? 50 : res.maxrecords;
    this.filters = res.filters;

    if (!this.initView) {
      this.initView = true;
    } else {
      this.loadData({ first: 0, rows: this.noofrows });
    }
    this.unCheckAllItems();
  }

  saveQuery(form) {
    this.isUpdateFiler = false;
    this.isSubmitForm = true;
    if (!form.invalid) {
      var trackingJobNo = 0;
      var trackingJson = this.cookieservice.get("currentlytracking") ? JSON.parse(this.cookieservice.get("currentlytracking")) : null;
      if (this.saveForCurrentJob && trackingJson) {
        trackingJobNo = trackingJson.id;
      }

      this.sharedService.saveQuery('respondent', this.saveForCurrentJob, '', this.saveQueryName, this.filters, null, trackingJobNo, this.maxrecords)
        .subscribe((res: any) => {
          console.log(res);
          if (res.succeeded) {
            this.isSubmitForm = false;
            this.selectedFilterId = res.value;
            this.isUpdateFiler = true;
            this.saveQueryCancelBtn.nativeElement.click();
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

  filtersEmit(res) {
    console.log(res);
    this.filters = res;

    this.filters.forEach(fl => {
      if (fl.caption == 'Registration Type') {
        if (fl.value1 == null || fl.value1 == '') fl.value1 = 'Consumer';
      }
    })
  }

  openSaveQueryModal() {
    if (this.filters && this.filters.length > 0) {
      this.saveQueryBtn.nativeElement.click();
      this.isSubmitForm = false;
    }
    else {
      swal(
        'Oops...',
        'Select at least one filter to save query.',
        'info'
      )
    }
  }

  clipboardCopy(res) {
    var txt = "Id: 37986, Name: Morgan Jones, Mobile: 0401 734 714";

    function showTooltip(elem: any, msg: string) {
      var classNames = elem.className;
      elem.setAttribute('class', classNames + ' hint--bottom');
      elem.setAttribute('aria-label', msg);
      setTimeout(() => {
        elem.setAttribute('class', classNames);
        clipboard.destroy();
      }, 2000);
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

  getClientContactsByType(e) {
    this.recipients = [];
    var contactTypes = [];


    this.selectedContactTypes.forEach(ct => {
      contactTypes.push(ct.itemName);
    })

    this.deleteItemIds = [];
    this.selectedRowData.forEach(rd => {
      this.deleteItemIds.push(rd.id);
    })

    this.clientService.getClientContactsByTypeId(contactTypes, this.deleteItemIds)
      .subscribe((res: any) => {
        console.log(res);
        res.value.forEach((rs) => {
          this.recipients.push(rs.emailAddress);
        });
      })


    /*this._clientservice.getContactbyClient(1)
      .subscribe(res => {
        console.log(res)
        if(res.value){
          res.value.forEach((rs) => {
            this.recipients.push(rs.emailAddress);
          });
        }
      })*/
  }

  sendEmail() {
    this.email.recipients = this.recipients.join(',');
    this.email.bccRecipients = this.bccrecipients.join(',');

    this.sharedService.sendEmail(this.email)
      .subscribe((res: any) => {
        console.log(res);
        if (res.succeeded)
          this.showEmailSuccessMsg = true;
        this.unCheckAllItems();
      })
  }

  sendSMS() {
    this.sharedService.sendSms(this.sms)
      .subscribe((res: any) => {
        console.log(res);
        if (res.succeeded)
          this.showSMSSuccessMsg = true;
        this.unCheckAllItems();
      });
  }

  newSms(openmodel) {
    this.deleteItemIds = [];
    this.selectedRowData.forEach(rd => {
      this.deleteItemIds.push(rd.id);
    })

    if (this.deleteItemIds.length > 0) {
      if (openmodel == 'sms')
        this.smsModel.nativeElement.click();
      /*if (openmodel == 'sendUpdateSms')
        this.sendUpdateSmsModel.nativeElement.click();*/
      this.sms = new Sms();
      this.sms.addToElectronicDocuments = true;

      if (openmodel == 'sendUpdateSms') {
        if (this.sendupdatesmstemplate == null) {
          this.sharedService.GetProfileUpdateSmsTemplate()
            .subscribe((res: any) => {
              console.log(res);
              if (res.value != null)
                this.sendupdatesmstemplate = res.value.body;
              this.sms.body = this.sendupdatesmstemplate;
              // this.initTinymce();
              this.sendUpdateSmsModel.nativeElement.click();
            })
        }
        else {
          this.sms.body = this.sendupdatesmstemplate;
          this.sendUpdateSmsModel.nativeElement.click();
        }
      }
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

  getClientJobContactTypeList() {
    this.contactTypeList = [];
    this.sharedService.getReferenceDataProvider('ClientContactType')
      .subscribe((res: any) => {
        console.log(res);
        res.value.forEach((ct) => {
          if (ct.id)
            this.contactTypeList.push({ id: ct.id, itemName: ct.description });
          ;
        })
      })
  }

  resetEmailModel() {
    this.tempalteId = null;
    this.contactType = null;
    this.recipients = [];
    this.bccrecipients = [];
    this.subject = null;
    this.body = null;
    this.selectedContactTypes = [];
    this.showEmailSuccessMsg = false;
  }

  resetSMSModel() {
    this.showSMSSuccessMsg = false;
  }

  getToolTipData(resid) {
    var ret = "";
    if (this.respondents) {
      this.respondents.forEach(rs => {
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

          if (rs.qualBlacklist)
            ret += "<div class='text-success text-left'>- Excluded from Qual Study</div>";
          if (rs.quantBlacklist)
            ret += "<div class='text-success text-left'>- Excluded from Quant Study</div>";

          if (rs.inactive) ret += "<div class='text-danger text-left'>- Inactive</div>";
        }
      })
    }
    return ret;
  }

  createResEvent(form) {
    console.log(form)
    this.deleteItemIds = [];
    this.selectedRowData.forEach(rd => {
      this.deleteItemIds.push(rd.id);
    })

    //if (this.deleteItemIds.length > 0) {
    this.isSubmitForm = true;
    if (!form.invalid) {
      this.postEventMsg = "";
      if (this.selectAllCheckBox) this.deleteItemIds = [];

      //this.resevent.respondentIdsString = this.deleteItemIds.join(',');
      this.resservice.createResEvent(this.resevent)
        .subscribe((res: any) => {
          console.log(res);
          if (res.succeeded) {
            this.postEventMsg = res.successMsg;
            this.unCheckAllItems();
          }
          else {
            this.postEventMsg = null;
            this.postEventSucceeded = false;
            this.postEventErrors = res.errors;
          }
        })
    }
    //}
    /*else {
      swal(
        'Oops...',
        'Please select an item to create event.',
        'info'
      )
    }*/
  }

  getEventTypeListWithBlank() {
    this.resservice.getEventTypeListWithBlank()
      .subscribe((res: any) => {
        this.eventtypelist = res.value;
        console.log(this.eventtypelist);
      })
  }

  getIncentiveById(selectedJob) {
    this.jobService.getJobIncentivesByJob(selectedJob)
      .subscribe((res: any) => {
        console.log(res);
        this.incentivelist = res.value;
      })
  }

  getSessionTimes(id) {
    this.sessionservice.getSessionTimesBySessionId(id)
      .subscribe((res: any) => {
        console.log(res);
        this.sessiontimes = res.value;
      })
  }

  newResEvent() {
    this.postEventMsg = null;
    this.postEventSucceeded = true;
    this.postEventErrors = [];

    this.deleteItemIds = [];
    this.selectedRowData.forEach(rd => {
      this.deleteItemIds.push(rd.id);
    })

    if (this.deleteItemIds.length > 0) {
      this.isOpenEventModal = true;
      this.resevent = new ResEvent();
      this.resevent.respondentIdsString = this.deleteItemIds.join(',');
      /*this.getCurrentlyTrackingJob();
      if (this.currentlyTrackingJob) {
        console.log(this.currentlyTrackingJob);
        this.selectedClient = this.currentlyTrackingJob.clientId;
        this.getEventClientJobs(this.currentlyTrackingJob.clientId);
        this.resevent.jobId = this.currentlyTrackingJob.id;
        this.getEventClientJobGroups(this.currentlyTrackingJob.id);
        this.getEventIncentiveListForJob(this.currentlyTrackingJob.id);
      } else {
        this.selectedClient = null;
        this.resevent.jobId = null;
      }*/

      setTimeout(() => {
        this.openEventModel.nativeElement.click();
      }, 1000);
    }
    else {
      /*swal(
        'Oops...',
        'Please select an item to create event.',
        'info'
      )*/
      swal({
        title: 'Are you sure?',
        html: 'You have not selected any respondents. Do you want to perform this action on ALL respondents that matched the query you have run?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        confirmButtonColor: '#ffaa00',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {
          this.sharedService.getQueryResultsIds(event, this.colVisData, this.maxrecords, this.filters, "respondent", null)
            .subscribe((resp: any) => {
              console.log(resp);

              this.isOpenEventModal = true;
              this.resevent = new ResEvent();
              this.resevent.respondentIdsString = resp.value.join(',');

              setTimeout(() => {
                this.openEventModel.nativeElement.click();
              }, 1000);
            });
        }
      });
    }
  }

  deleteRespondent() {
    this.deleteItemIds = [];
    this.selectedRowData.forEach(rd => {
      this.deleteItemIds.push(rd.id);
    })

    //if(this.checkPermission()){
    if (this.deleteItemIds.length > 0) {
      swal({
        title: 'Are you sure?',
        html: 'You will not be able to recover this item! <br> Please mark the Panel Member as Inactive instead.',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        confirmButtonColor: '#ffaa00',
        cancelButtonText: 'No, keep it'
      }).then((result) => {
        if (result.value) {
          this.resservice.deleteRespondent(this.deleteItemIds)
            .subscribe((res: any) => {
              console.log(res);

              if (res.succeeded) {
                this.deleteItemIds = [];
                this.loadData({ first: 0, rows: this.noofrows });

                for (var i = 0; i < this.clients.length; i++) {
                  this.selected[i] = false;
                }
                swal(
                  'Deleted!',
                  'Selected item has been deleted.',
                  'success'
                )
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
            });
          this.unCheckAllItems();
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
    /*}*/
  }

  unCheckAllItems() {
    this.deleteItemIds = [];
    this.selectedRowData = [];
  }

  openEmailModal(entity, title) {
    this.emailModalTitle = title;

    this.deleteItemIds = [];
    this.selectedRowData.forEach(rd => {
      this.deleteItemIds.push(rd.id);
    })

    if (this.deleteItemIds.length > 0) {
      var ids = "?";
      this.deleteItemIds.forEach(di => {
        ids += 'respondentIds=' + di + '&';
      });
      this.openEmailModalHelper(entity, ids);
    }
    else {
      swal({
        title: 'Are you sure?',
        html: 'You have not selected any respondents. Do you want to perform this action on ALL respondents that matched the query you have run?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        confirmButtonColor: '#ffaa00',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {
          this.sharedService.getQueryResultsIds(event, this.colVisData, this.maxrecords, this.filters, "respondent", null)
            .subscribe((resp: any) => {
              console.log(resp);
              var ids = "?";
              resp.value.forEach(di => {
                ids += 'respondentIds=' + di + '&';
              });
              this.openEmailModalHelper(entity, ids);
            });
        }
      });
    }
  }

  openEmailModalHelper(entity, ids) {
    this.emailService.getEmailData(entity, ids)
      .subscribe((res: any) => {
        console.log(res);
        if (res.succeeded) {
          this.emailData = res.value;
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

  openSmsModal(entity, title) {
    this.smsModalTitle = title;

    this.deleteItemIds = [];
    this.selectedRowData.forEach(rd => {
      this.deleteItemIds.push(rd.id);
    })

    if (this.deleteItemIds.length > 0) {
      this.openSmsModalHelper(entity, this.deleteItemIds);
    }
    else {
      /*swal(
        'Oops...',
        'Please select an item.',
        'info'
      )*/
      swal({
        title: 'Are you sure?',
        html: 'You have not selected any respondents. Do you want to perform this action on ALL respondents that matched the query you have run?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        confirmButtonColor: '#ffaa00',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {
          this.sharedService.getQueryResultsIds(event, this.colVisData, this.maxrecords, this.filters, "respondent", null)
            .subscribe((resp: any) => {
              console.log(resp);
              this.openSmsModalHelper(entity, resp.value);
            })
        }
      });
    }
  }

  openSmsModalHelper(entity, idsarr) {
    var ids = "?";
    idsarr.forEach(di => {
      ids += 'respondentIds=' + di + '&';
    });
    this.smsservice.getSmsData(entity, ids)
      .subscribe((res: any) => {
        this.smsData = res.value;
        this.smsModlaBtn.nativeElement.click();
      })
  }

  closeModal(e) {
    if (e) {
      this.unCheckAllItems();
    }
  }

  getEventClient() {
    this.eventService.getClients()
      .subscribe((res: any) => {
        console.log(res);
        this.eventClients = res.value;
      })
  }

  getEventClientJobs(clientId) {
    this.eventService.getClientJobs(clientId)
      .subscribe((res: any) => {
        console.log(res);
        this.eventJobs = res.value;
        this.eventJobs = this.eventJobs.filter((jb) => jb.value != 0);
        if (this.emailData.jobId) {
          var index = this.eventJobs.findIndex((ej) => ej.value == this.emailData.jobId);
          if (index < 0)
            this.emailData.jobId = null;
        }
      })
  }

  getEventClientJobGroups(jobid) {
    this.eventService.getClientJobGroups(jobid)
      .subscribe((res: any) => {
        console.log(res);
        this.eventJobSessions = res.value;
      })
  }

  getEventIncentiveListForJob(jobid) {
    this.eventService.getIncentiveListForJob(jobid)
      .subscribe((res: any) => {
        console.log(res);
        this.eventIncentives = res.value;
      })
  }

  getIncentiveListForGroup(groupId) {
    this.eventService.getIncentiveListForGroup(groupId)
      .subscribe((res: any) => {
        console.log(res);
        this.eventIncentives = res.value;
      })
  }

  getCurrentlyTrackingJob() {
    if (this.cookieservice.check("currentlytracking"))
      this.currentlyTrackingJob = JSON.parse(this.cookieservice.get("currentlytracking"));
    console.log(this.currentlyTrackingJob);
  }

  openSurveyEmailModelHelper(entity, title) {
    console.log(entity);
    console.log(title);
    this.emailModalTitle = title;

    this.deleteItemIds = [];
    this.selectedRowData.forEach(rd => {
      this.deleteItemIds.push(rd.id);
    })

    if (this.deleteItemIds.length > 0) {
      /*var ids = "?";
      this.deleteItemIds.forEach(di => {
        ids += 'respondentIds=' + di + '&';
      });*/
      this.openSurveyEmailModelHelperChild(entity);
    }
    else {
      swal({
        title: 'Are you sure?',
        html: 'You have not selected any respondents. Do you want to perform this action on ALL respondents that matched the query you have run?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        confirmButtonColor: '#ffaa00',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {
          this.sharedService.getQueryResultsIds(event, this.colVisData, this.maxrecords, this.filters, "respondent", null)
            .subscribe((resp: any) => {
              console.log(resp);
              this.deleteItemIds = resp.value;
              debugger;
              this.openSurveyEmailModelHelperChild(entity);
            });
        }
      });
    }
  }

  openSurveyEmailModelHelperChild(entity) {
    this.isSubmitForm = false;
    if (entity == 'CreateResSurveyInviteEmail' || entity == 'CreateRespondentEmail' ||
      entity == 'SurveywithThirdpartyURL' || entity == 'SurveywithUniqueRespondentID' || entity == 'CreateResSurveyInviteSMS') {
      this.surveyInviteModalBtn.nativeElement.click();
      this.getCurrentlyTrackingJob();
      if (this.currentlyTrackingJob) {
        this.emailData.clientId = this.currentlyTrackingJob.clientId;
        this.getEventClientJobs(this.currentlyTrackingJob.clientId);
        this.emailData.jobId = this.currentlyTrackingJob.id;
        this.getEventClientJobGroups(this.currentlyTrackingJob.id);
      }
      else {
        this.emailData.clientId = null;
        this.emailData.jobId = null;
      }
      this.emailData.groupId = null;
    }
  }

  getSurveyInviteEmailData(form) {
    this.isSubmitForm = true;

    if (this.selectedRowData.length > 0) {
      this.deleteItemIds = [];
      this.selectedRowData.forEach(rd => {
        this.deleteItemIds.push(rd.id);
      })
    }

    if (form.valid) {
      this.sendInviteEmailBtn.nativeElement.click();

      if (this.emailSelectionType == 'isSurveyInviteEmail') {
        this.emailService.getSurveyInviteEmailData(this.deleteItemIds, this.emailData.jobId, this.emailData.groupId)
          .subscribe((res: any) => {
            console.log(res);
            this.emailData = res.value;
            this.isSubmitForm = false;
          })
      }
      else if (this.emailSelectionType == 'isNoShowEmail') {
        this.emailService.getNoShowEmail(this.deleteItemIds, this.emailData.jobId, this.emailData.groupId)
          .subscribe((res: any) => {
            console.log(res);
            this.emailData = res.value;
            this.isSubmitForm = false;
          })
      }
      else if (this.emailSelectionType == 'isEmail') {
        this.emailService.getCreateRespondentEmail(this.deleteItemIds, this.emailData.jobId, this.emailData.groupId)
          .subscribe((res: any) => {
            console.log(res);
            if (res.succeeded) {
              this.emailData = res.value;
              this.isSubmitForm = false;

              setTimeout(() => {
                // this.emailModlaBtn.nativeElement.click();
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
      else if (this.emailSelectionType == 'isSurveywithThirdpartyURL') {
        this.emailService.getCreateOnlineSurveywithThirdpartyURL(this.deleteItemIds, this.emailData.jobId, this.emailData.groupId)
          .subscribe((res: any) => {
            console.log(res);
            this.emailData = res.value;
            this.isSubmitForm = false;
          })
      } else if (this.emailSelectionType == 'isSurveywithUniqueRespondentID') {
        this.emailService.getCreateOnlineSurveywithUniqueRespondentID(this.deleteItemIds, this.emailData.jobId, this.emailData.groupId)
          .subscribe((res: any) => {
            console.log(res);
            this.emailData = res.value;
            this.isSubmitForm = false;
          })
      }
    }
  }

  getSurveyInviteSMSData(form) {
    this.isSubmitForm = true;
    if (this.selectedRowData.length > 0) {
      this.deleteItemIds = [];
      this.selectedRowData.forEach(rd => {
        this.deleteItemIds.push(rd.id);
      })
    }

    if (form.valid) {
      this.sendInviteSmsBtn.nativeElement.click();
      this.smsservice.getSurveyInviteSmsData(this.deleteItemIds, this.emailData.jobId, this.emailData.groupId)
        .subscribe((res: any) => {
          console.log(res);
          this.smsData = res.value;
          setTimeout(() => {
            this.smsModlaBtn.nativeElement.click();
          })
          this.isSubmitForm = false;
        })
    }
  }

  openScreen() {
    this.deleteItemIds = [];
    this.selectedRowData.forEach(rd => {
      this.deleteItemIds.push(rd.id);
    })

    if (this.deleteItemIds && this.deleteItemIds.length > 0) {
      if (this.deleteItemIds.length == 1) {
        this.getCurrentlyTrackingJob();
        if (this.currentlyTrackingJob) {
          this.gotoScreenObj.clientId = this.currentlyTrackingJob.clientId;
          this.getEventClientJobs(this.currentlyTrackingJob.clientId);
          this.gotoScreenObj.jobId = this.currentlyTrackingJob.id;
          this.getEventClientJobGroups(this.currentlyTrackingJob.id);
          this.getEventIncentiveListForJob(this.currentlyTrackingJob.id);
        } else {
          this.gotoScreenObj.clientId = null;
          this.gotoScreenObj.jobId = null;
        }

        setTimeout(() => {
          this.screenModalBtn.nativeElement.click();
        }, 1000);
      } else {
        swal(
          'Oops...',
          'Please select only one item.',
          'info'
        );
      }
    } else {
      swal(
        'Oops...',
        'Please select an item.',
        'info'
      )
    }
  }

  resetEventForm(event) {
    console.log(event);
    if (event) {
      this.resevent = new ResEvent();
      this.selectedClient = null;
      this.deleteItemIds = [];
      this.selectedRowData = [];
      this.unCheckAllItems();
      this.isOpenEventModal = false;
    }
  }

  gotoScreen(form) {
    this.isSubmitForm = true;
    this.deleteItemIds = [];
    this.selectedRowData.forEach(rd => {
      this.deleteItemIds.push(rd.id);
    })

    var resid = this.deleteItemIds[0];
    if (form.valid) {
      console.log(this.gotoScreenObj);
      if (this.gotoScreenObj.jobGroupId == null) this.gotoScreenObj.jobGroupId = 0;
      this.surveyservice.getSurveyIdScreenerId(this.gotoScreenObj.jobId, this.gotoScreenObj.jobGroupId)
        .subscribe((res: any) => {
          this.screenModalCloseBtn.nativeElement.click();
          console.log(res);
          if (res.succeeded) {
            this.router.navigate(['/screener', res.value.surveyId, resid, res.value.screenerId, this.gotoScreenObj.jobId]);
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

  mergeRespondent() {
    this.deleteItemIds = [];
    this.selectedRowData.forEach(rd => {
      this.deleteItemIds.push(rd.id);
    })

    //if(this.checkPermission()){
    if (this.deleteItemIds.length > 0) {
      swal({
        title: 'Are you sure you want to merge all the selected respondents into the newest of those selected?',
        html: 'The other respondents will be marked as inactive, and all events and internal notes will be moved across.<br>This action cannot be undone!!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, merge it!',
        confirmButtonColor: '#ffaa00',
        cancelButtonText: 'No, keep it'
      }).then((result) => {
        if (result.value) {
          this.resservice.mergeRespondent(this.deleteItemIds)
            .subscribe((res: any) => {
              console.log(res);

              if (res.succeeded) {
                this.deleteItemIds = [];
                this.loadData({ first: 0, rows: this.noofrows });

                for (var i = 0; i < this.clients.length; i++) {
                  this.selected[i] = false;
                }
                swal(
                  'Merged!',
                  res.successMsg,
                  'success'
                )
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
            });
          this.unCheckAllItems();
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
        'Please select an item to merge.',
        'info'
      )
    }
    /*}*/
  }

  updateSelectedColumnsIndex() {
    this.selectedColumns.sort((a, b) => {
      if (a.index > b.index) return 1;
      if (a.index < b.index) return -1;
      return 0;
    })
  }

  /*onRowSelect(e) {
    var index = this.selectedRowData.findIndex(sr => sr.id == e.data.id);
    if (index < 0 && e.originalEvent.ctrlKey)
      this.selectedRowData.push({ id: e.data.id })
    else
      this.selectedRowData = [];
  }
  
  onRowUnselect(e) {
    var index = this.selectedRowData.findIndex(sr => sr.id == e.data.id);
    this.selectedRowData.splice(index, 1);
  }*/

  trackByFn(index, item) {
    // console.log( 'TrackBy:', item, index );
    return (item.id);
  }

  onRowClick(e, resid) {
    var index = this.selectedRowData.findIndex(sr => sr.id == resid);
    /*if (index < 0 && this.selectedRowData.length < 1)
      this.selectedRowData.push({ id: resid })
    else if (index < 0 && this.selectedRowData.length >= 0 && e.ctrlKey)
      this.selectedRowData.push({ id: resid })
    else if (index < 0 && this.selectedRowData.length >= 0 && !e.ctrlKey) {
      this.selectedRowData = [];
      this.selectedRowData.push({ id: resid });
    }
    else
      this.selectedRowData.splice(index, 1);*/

    if (index < 0 && this.selectedRowData.length < 1) {
      this.selectedRowData.push({ id: resid });
    }
    else if (index < 0 && this.selectedRowData.length > 1 && e.ctrlKey) {
      this.selectedRowData.push({ id: resid });
    }
    else if (index >= 0 && this.selectedRowData.length > 0 && e.ctrlKey) {
      this.selectedRowData.splice(index, 1);
    }
    else if (e.ctrlKey)
      this.selectedRowData.push({ id: resid });
    else {
      this.selectedRowData = [];
      this.selectedRowData.push({ id: resid });
    }
  }

  isRowSelected(resid) {
    var ret = false;
    var index = this.selectedRowData.findIndex(sr => sr.id == resid);
    if (index >= 0) ret = true;
    return ret;
  }
}
