import { SafeHtmlPipeModule } from './lazymodules/safehtmlpipe.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFacebookSquare } from '@fortawesome/free-brands-svg-icons/faFacebookSquare';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { MetaModule, MetaService } from '@ngx-meta/core';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { TextMaskModule } from 'angular2-text-mask';
import { CurrencyMaskConfig } from 'ng2-currency-mask/src/currency-mask.config';
import { DragulaService } from 'ng2-dragula';
import { CookieService } from 'ngx-cookie-service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfirmDeactivateGuard } from './lazymodules/confirmdeactivateguard';
import { NumericModule } from './lazymodules/numeric.module';
import { SafepipeModule } from './lazymodules/safepipe.module';
import { AuthInterceptor } from './services/auth.interceptor';
import { AuthService } from './services/auth.services';
import { ClientServices } from './services/client.services';
import { ConfigItemServices } from './services/configitem.services';
import { DashboardServices } from './services/dashboard.services';
import { DocumentServices } from './services/document.services';
import { EmailServices } from './services/email.services';
import { EventServices } from './services/event.services';
import { InputServices } from './services/input.services';
import { JobServices } from './services/job.services';
import { JobSessionServices } from './services/jobsession.services';
import { LicenceServices } from './services/licence.services';
import { ReportServices } from './services/report.services';
import { RespondentServices } from './services/respondent.services';
import { SecurityInfoResolve } from './services/securityinfo.reslove';
import { SessionServices } from './services/session.services';
import { SharedServices } from './services/shared.services';
import { SmsServices } from './services/sms.services';
import { StaffServices } from './services/staff.services';
import { SurveyServices } from './services/survey.services';
import { TicketServices } from './services/ticket.services';
import { UserServices } from './services/user.services';
import { ClientMenuComponent } from './shared/clientmenu.component';
import { FooterComponent } from './shared/footer.component';
import { JobTrackerComponent } from './shared/jobtracker.component';
import { NotFoundComponent } from './shared/notfound.component';
import { ResMenuComponent } from './shared/resmenu.component';
import { StaffMenuComponent } from './shared/staffmenu.component';
import { SurveyLandingComponent } from './survey/surveylanding.component';
import { SurveyRedirectComponent } from './survey/surveyredirect.component';
import { SurveyRevertChangesComponent } from './survey/surveyrevertchanges.component';
import { SurveyThankYouComponent } from './survey/surveythankyou.component';
import { SurveyWelcomeComponent } from './survey/surveywelcome.component';
import { RespondentBankingComponent } from './user-res/respondentbanking.component';
import { RespondentContactUs } from './user-res/respondentcontactus.component';
import { RespondentOpportunitiesComponent } from './user-res/respondentopportunities.component';
import { RespondentPointsComponent } from './user-res/respondentpoints.component';
import { RespondentSocial } from './user-res/respondentsocial.component';
import { ActivateComponent } from './user/activate.component';
import { ChangePassComponent } from './user/changepass.component';
import { ReferFriendComponent } from './user/referfriend.component';
import { ResetPassComponent } from './user/resetpass.component';
import { SetPassComponent } from './user/setpass.component';
import { UnsubscribeComponent } from './user/unsubscribe.component';

// Add an icon to the library for convenient access in other components
library.add(faFacebookSquare);

export const customCurrencyMaskConfig: CurrencyMaskConfig = {
  align: 'right',
  allowNegative: true,
  decimal: '.',
  precision: 2,
  prefix: '',
  suffix: '',
  thousands: ','
};

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    StaffMenuComponent,
    ClientMenuComponent,
    ResMenuComponent,
    JobTrackerComponent,
    SurveyRedirectComponent,
    ResetPassComponent,
    ActivateComponent,
    ChangePassComponent,
    SetPassComponent,
    NotFoundComponent,
    SurveyThankYouComponent,
    UnsubscribeComponent,
    RespondentBankingComponent,
    RespondentPointsComponent,
    RespondentContactUs,
    RespondentOpportunitiesComponent,
    RespondentSocial,
    SurveyLandingComponent,
    SurveyWelcomeComponent,
    SurveyRevertChangesComponent,
    ReferFriendComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),    
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    LoadingBarRouterModule,
    LoadingBarHttpClientModule,
    NguiAutoCompleteModule,
    SafepipeModule,
    TextMaskModule,
    NumericModule,
    ShareButtonsModule,
    MetaModule.forRoot(),
    SafepipeModule,
    SafeHtmlPipeModule
  ],
  providers: [
    AuthService,
    SharedServices,
    CookieService,
    UserServices,
    SurveyServices,
    JobServices,
    DashboardServices,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true, },
    SecurityInfoResolve,
    ClientServices,
    RespondentServices,
    EmailServices,
    EventServices,
    ReportServices,
    SmsServices,
    TicketServices,
    ConfigItemServices,
    LicenceServices,
    JobSessionServices,
    SessionServices,
    InputServices,
    DocumentServices,
    DragulaService,
    ConfirmDeactivateGuard,
    MetaService,
    StaffServices
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
