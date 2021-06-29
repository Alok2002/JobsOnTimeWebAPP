import { SurveyLandingComponent } from './survey/surveylanding.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthService } from './services/auth.services';
import { SurveyRedirectComponent } from './survey/surveyredirect.component';
import { ResetPassComponent } from './user/resetpass.component';
import { SetPassComponent } from './user/setpass.component';
import { NotFoundComponent } from './shared/notfound.component';
import { SurveyThankYouComponent } from './survey/surveythankyou.component';
import { UnsubscribeComponent } from './user/unsubscribe.component';
import { RespondentBankingComponent } from './user-res/respondentbanking.component';
import { RespondentPointsComponent } from './user-res/respondentpoints.component';
import { RespondentContactUs } from './user-res/respondentcontactus.component';
import { RespondentOpportunitiesComponent } from './user-res/respondentopportunities.component';
import { RespondentSocial } from './user-res/respondentsocial.component';
import { SurveyWelcomeComponent } from './survey/surveywelcome.component';
import { SurveyRevertChangesComponent } from './survey/surveyrevertchanges.component';
import { ReferFriendComponent } from './user/referfriend.component';

const routes: Routes = [
  { path: 'signin', loadChildren: './lazymodules/signin.module#SigninModule', data: { name: 'signin' } },
  { path: 'signin/:jobid', loadChildren: './lazymodules/signin.module#SigninModule', data: { name: 'signin' } },
  { path: 'signup', loadChildren: './lazymodules/signup.module#SignupModule', data: { name: 'signup' } },
  { path: 'signup/:jobid', loadChildren: './lazymodules/signup.module#SignupModule', data: { name: 'signup' } },
  { path: 'signup-business', loadChildren: './lazymodules/signupbusiness.module#SignupBusinessModule', data: { name: 'signup' } },
  { path: 'signup-impairment', loadChildren: './lazymodules/signupimpairment.module#SignupImpairmentModule', data: { name: 'signup' } },
  { path: 'forgotpassword', loadChildren: './lazymodules/forgotpassword.module#ForgotpasswordModule', data: { name: 'signin' } },
  { path: 'unsubscribe/:encrypt', component: UnsubscribeComponent, data: { name: 'signin' } },
  { path: 'refer-a-friend', component: ReferFriendComponent, data: { name: 'signup' } },

  //CLIENT
  { path: 'client', loadChildren: './lazymodules/client.module#ClientModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'client/add', loadChildren: './lazymodules/client.module#ClientModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'client/edit/:id', loadChildren: './lazymodules/client.module#ClientModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'client/edit/:id/:selectedtab', loadChildren: './lazymodules/client.module#ClientModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },

  //JOB
  { path: 'job', loadChildren: './lazymodules/job.module#JobModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'job/add', loadChildren: './lazymodules/job.module#JobModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'job/add/:clientid', loadChildren: './lazymodules/job.module#JobModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'job/edit/:id', loadChildren: './lazymodules/job.module#JobModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'job/edit/:id/:selectedtab', loadChildren: './lazymodules/job.module#JobModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'myobcallback', loadChildren: './lazymodules/job.module#JobModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },

  //REPORT
  { path: 'report', loadChildren: './lazymodules/report.module#ReportModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'report/sessionrecruitment', loadChildren: './lazymodules/report.module#ReportModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'report/jobrecruitment', loadChildren: './lazymodules/report.module#ReportModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'report/jobsummary', loadChildren: './lazymodules/report.module#ReportModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'report/jobsummarydetail', loadChildren: './lazymodules/report.module#ReportModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'report/staffkpi', loadChildren: './lazymodules/report.module#ReportModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'report/staffattendance', loadChildren: './lazymodules/report.module#ReportModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'report/staffpayroll', loadChildren: './lazymodules/report.module#ReportModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'report/joborder', loadChildren: './lazymodules/report.module#ReportModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },

  //COMMUNICATION
  { path: 'comms', loadChildren: './lazymodules/comms.module#CommsModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'comms/sendemail', loadChildren: './lazymodules/comms.module#CommsModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'comms/sendsms', loadChildren: './lazymodules/comms.module#CommsModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'comms/smsreplies', loadChildren: './lazymodules/comms.module#CommsModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },

  //TICKET
  { path: 'support-ticket', loadChildren: './lazymodules/ticket.module#TicketModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'support-ticket/add', loadChildren: './lazymodules/ticket.module#TicketModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'support-ticket/edit/:id', loadChildren: './lazymodules/ticket.module#TicketModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },

  //STAFF
  { path: 'staff', loadChildren: './lazymodules/staff.module#StaffModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'staff/roster', loadChildren: './lazymodules/staff.module#StaffModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'staff/leave', loadChildren: './lazymodules/staff.module#StaffModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'staff/meeting', loadChildren: './lazymodules/staff.module#StaffModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'staff/attendance', loadChildren: './lazymodules/staff.module#StaffModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },

  //ADMIN
  { path: 'admin', loadChildren: './lazymodules/admin.module#AdminModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'admin/bulkdata', loadChildren: './lazymodules/admin.module#AdminModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'admin/reference', loadChildren: './lazymodules/admin.module#AdminModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'system-users', loadChildren: './lazymodules/manageuser.module#ManageuserModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'software-licence', loadChildren: './lazymodules/licence.module#LicenceModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'system-configuration', loadChildren: './lazymodules/configitem.module#ConfigitemModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'emailtemplates', loadChildren: './lazymodules/template.module#TemplateModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'loginaudit', loadChildren: './lazymodules/loginaudits.module#LoginauditsModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'emailsender', loadChildren: './lazymodules/manageemail.module#ManageEmailModel', canActivate: [AuthService], data: { permissions: ["Staff"] } },

  //RESPONDENT
  { path: 'searchrespondents', loadChildren: './lazymodules/searchrespondent.module#SearchrespondentModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'searchrespondents/:resid', loadChildren: './lazymodules/searchrespondent.module#SearchrespondentModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'searchrespondents/filter/:filterid', loadChildren: './lazymodules/searchrespondent.module#SearchrespondentModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'newrespondents', loadChildren: './lazymodules/newrespondent.module#NewRespondentModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'respondent/:resid', loadChildren: './lazymodules/newrespondent.module#NewRespondentModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'newbussinesspanelmember', loadChildren: './lazymodules/newbusinesspanel.module#NewbusinesspanelModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'bussinesspanelmember/:resid', loadChildren: './lazymodules/newbusinesspanel.module#NewbusinesspanelModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'newimpairmentpanelmember', loadChildren: './lazymodules/newimpairmentpanel.module#NewimpairmentpanelModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'impairmentpanelmember/:resid', loadChildren: './lazymodules/newimpairmentpanel.module#NewimpairmentpanelModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },

  //SESSION
  { path: 'session/add/:jobid', loadChildren: './lazymodules/session.module#SessionModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'session/edit/:id/:jobid', loadChildren: './lazymodules/session.module#SessionModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'session/edit/:id/:jobid/:tab', loadChildren: './lazymodules/session.module#SessionModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'sessioncalendar', loadChildren: './lazymodules/sessioncalendar.module#SessioncalendarModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },

  //SURVEY & SESSION SURVEY & SCREENER
  { path: 'managesurvey/:jobid', loadChildren: './lazymodules/surveydetails.module#SurveydetailsModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'managesurvey/:jobid/:surveyid', loadChildren: './lazymodules/surveydetails.module#SurveydetailsModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'managesessionsurvey/:jobid/:sessionid', loadChildren: './lazymodules/surveydetails.module#SurveydetailsModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'managesessionsurvey/:jobid/:surveyid/:sessionid', loadChildren: './lazymodules/surveydetails.module#SurveydetailsModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'managescreener/:jobid', loadChildren: './lazymodules/surveydetails.module#SurveydetailsModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'managescreener/:jobid/:surveyid', loadChildren: './lazymodules/surveydetails.module#SurveydetailsModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },

  { path: 'survey/:action/:encodeddata', loadChildren: './lazymodules/surveyview.module#SurveyviewModule', data: { name: 'survey' } },

  { path: 'submenu/:menu', loadChildren: './lazymodules/submenu.module#SubmenuModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'settings', loadChildren: './lazymodules/settings.module#SettingsModule', canActivate: [AuthService], data: { permissions: ["Staff", "Client", "Respondent"] } },
  { path: 'surveythankyou', component: SurveyThankYouComponent },

  { path: 'survey-landing/:encodeddata', component: SurveyLandingComponent },
  { path: 'survey-welcome/:encodeddata', component: SurveyWelcomeComponent },
  { path: 'survey-revert-changes/:encodeddata', component: SurveyRevertChangesComponent },

  //USER-CLI
  { path: 'clihome', loadChildren: './lazymodules/clihome.module#ClihomeModule', canActivate: [AuthService], data: { permissions: ["Client"] } },
  { path: 'clijobs', loadChildren: './lazymodules/clijobs.module#ClijobsModule', canActivate: [AuthService], data: { permissions: ["Client"] } },
  { path: 'clinotes', loadChildren: './lazymodules/clinotes.module#ClinotesModule', canActivate: [AuthService], data: { permissions: ["Client"] } },
  { path: 'cliprivatelist', loadChildren: './lazymodules/cliprivatelist.module#CliPrivateListModule', canActivate: [AuthService], data: { permissions: ["Client"] } },
  { path: 'clifeedback', loadChildren: './lazymodules/clifeedback.module#ClifeedbackModule', canActivate: [AuthService], data: { permissions: ["Client"] } },
  { path: 'cliclient', loadChildren: './lazymodules/cliclientdetails.module#CliClientDetailsModule', canActivate: [AuthService], data: { permissions: ["Client"] } },
  { path: 'clisettings', loadChildren: './lazymodules/clisettings.module#CliSettingsModule', canActivate: [AuthService], data: { permissions: ["Client"] } },

  //USER-RES
  { path: 'reshome', loadChildren: './lazymodules/reshome.module#ReshomeModule', canActivate: [AuthService], data: { permissions: ["Respondent"] } },
  { path: 'resbanking', component: RespondentBankingComponent, canActivate: [AuthService], data: { permissions: ["Respondent"], pagetitle: 'My Bank Details' } },
  { path: 'respoints', component: RespondentPointsComponent, canActivate: [AuthService], data: { permissions: ["Respondent"], pagetitle: 'My Points' } },
  { path: 'rescontactus', component: RespondentContactUs, canActivate: [AuthService], data: { permissions: ["Respondent", "Client"], pagetitle: 'Contact Us' } },
  { path: 'respayments/:id', loadChildren: './lazymodules/respayment.module#RespaymentModule', canActivate: [AuthService], data: { permissions: ["Respondent"] } },
  { path: 'ressession/:id', loadChildren: './lazymodules/ressession.module#RessessionModule', canActivate: [AuthService], data: { permissions: ["Respondent"] } },
  { path: 'ressurvey/:id', loadChildren: './lazymodules/ressurvey.module#RessurveyModule', canActivate: [AuthService], data: { permissions: ["Respondent"] } },
  { path: 'resopportunities/:id', component: RespondentOpportunitiesComponent, canActivate: [AuthService], data: { permissions: ["Respondent"], pagetitle: 'My Opportunities' } },
  { path: 'resprofile', loadChildren: './lazymodules/resprofile.module#ResprofileModule', canActivate: [AuthService], data: { permissions: ["Respondent"] } },
  { path: 'ressocialshare', component: RespondentSocial, canActivate: [AuthService], data: { permissions: ["Respondent"], pagetitle: 'Share With Friends' } },

  { path: 'typeswitch', loadChildren: './lazymodules/typeswitch.module#TypeswitchModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'surveypreview/:jobid/:surveyid', loadChildren: './lazymodules/surveypreview.module#SurveypreviewModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'surveyanswers/:surveyid/:resid/:jobid', loadChildren: './lazymodules/surveyanswers.module#SurveyanswersModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'screener/:surveyid/:resid/:screenerid/:jobid', loadChildren: './lazymodules/surveyanswers.module#SurveyanswersModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: 'surveyanswerssummary/:surveyid/:resid', loadChildren: './lazymodules/surveyanswerssummary.module#SurveyanswerssummaryModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },

  { path: 'accessdenied', loadChildren: './lazymodules/accessdenied.module#AccessDeniedModule', canActivate: [AuthService], data: { permissions: ["Staff", "Respondent", "Client"] } },
  { path: 'accessdenied/:securitydata', loadChildren: './lazymodules/accessdenied.module#AccessDeniedModule', canActivate: [AuthService], data: { permissions: ["Staff", "Respondent", "Client"] } },
  { path: 'survey-redirect/:jobid', component: SurveyRedirectComponent },

  { path: 'resetpassword/:role', component: ResetPassComponent, data: { pagetitle: 'Reset your password' } },
  { path: 'setpassword/:encrypt/:role', component: SetPassComponent, data: { pagetitle: 'Set your password' } },

  { path: 'dashboard', loadChildren: './lazymodules/dashboard.module#DashboardModule', canActivate: [AuthService], data: { permissions: ["Staff"] } },
  { path: '', loadChildren: './lazymodules/signin.module#SigninModule', data: { name: 'signin' } },

  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
