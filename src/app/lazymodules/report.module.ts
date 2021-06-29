import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ExcelModule, GridModule, PDFModule } from '@progress/kendo-angular-grid';
import { Daterangepicker } from 'ng2-daterangepicker';
import { JobOrderComponent } from '../report/joborder.component';
import { JobRecruitmentReportComponent } from '../report/jobrecruitment.component';
import { JobSummaryReportComponent } from '../report/jobreportsummary.component';
import { JobSummaryDetailReportComponent } from '../report/jobsummarydetail.component';
import { MemberPointsDetailComponent } from '../report/memberpointsdetail.component';
import { MemberProfilePointComponent } from '../report/memberprofilepoint.component';
import { SalesReportComponent } from '../report/sales.component';
import { SessionRecruitReportComponent } from '../report/sessionrecruitment.component';
import { StaffAttendanceReportComponent } from '../report/staffattendance.component';
import { StaffKpiReportComponent } from '../report/staffkpi.component';
import { StaffPayrollReportComponent } from '../report/staffpayroll.component';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SecurityRights } from '../shared/enum';
import { IncentiveReportComponent } from '../report/incentive.component';

export const route: Routes = [
  { path: '', component: SessionRecruitReportComponent, pathMatch: 'full', data: { securityData: SecurityRights.SessionRecruitmentReport }, resolve: { securityInfo: SecurityInfoResolve } }, //NOT USE
  { path: 'sessionrecruitment', component: SessionRecruitReportComponent, pathMatch: 'full', data: { securityData: SecurityRights.SessionRecruitmentReport }, resolve: { securityInfo: SecurityInfoResolve } },
  { path: 'jobrecruitment', component: JobRecruitmentReportComponent, pathMatch: 'full', data: { securityData: SecurityRights.JobRecruitmentReport }, resolve: { securityInfo: SecurityInfoResolve } },
  { path: 'jobsummary', component: JobSummaryReportComponent, pathMatch: 'full', data: { securityData: SecurityRights.PMJobSummaryReport }, resolve: { securityInfo: SecurityInfoResolve } },
  { path: 'jobsummarydetail', component: JobSummaryDetailReportComponent, pathMatch: 'full', data: { securityData: SecurityRights.PMJobDetailReport }, resolve: { securityInfo: SecurityInfoResolve } },
  { path: 'staffkpi', component: StaffKpiReportComponent, pathMatch: 'full', data: { securityData: SecurityRights.StaffKPIReport }, resolve: { securityInfo: SecurityInfoResolve } },
  { path: 'staffattendance', component: StaffAttendanceReportComponent, pathMatch: 'full', data: { securityData: SecurityRights.StaffAttendanceReport }, resolve: { securityInfo: SecurityInfoResolve } },
  { path: 'staffpayroll', component: StaffPayrollReportComponent, pathMatch: 'full', data: { securityData: SecurityRights.StaffPayrollReport }, resolve: { securityInfo: SecurityInfoResolve } },
  { path: 'joborder', component: JobOrderComponent, pathMatch: 'full', data: { securityData: SecurityRights.JobOrderReport }, resolve: { securityInfo: SecurityInfoResolve } },
  { path: 'sales', component: SalesReportComponent, pathMatch: 'full', data: { securityData: SecurityRights.SalesReport }, resolve: { securityInfo: SecurityInfoResolve } },
  { path: 'memberprofilepoint', component: MemberProfilePointComponent, pathMatch: 'full', data: { securityData: SecurityRights.MemberPointReport }, resolve: { securityInfo: SecurityInfoResolve } },
  { path: 'memberpointsdetail', component: MemberPointsDetailComponent, pathMatch: 'full', data: { securityData: SecurityRights.MemberPointReport }, resolve: { securityInfo: SecurityInfoResolve } },
  { path: 'incentive', component: IncentiveReportComponent, pathMatch: 'full', data: { securityData: SecurityRights.IncentiveReport }, resolve: { securityInfo: SecurityInfoResolve } }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(route),
    Daterangepicker,
    GridModule,
    PDFModule,
    ExcelModule,
  ],
  declarations: [
    SessionRecruitReportComponent,
    JobRecruitmentReportComponent,
    JobSummaryDetailReportComponent,
    JobSummaryReportComponent,
    StaffKpiReportComponent,
    StaffAttendanceReportComponent,
    StaffPayrollReportComponent,
    JobOrderComponent,
    SalesReportComponent,
    MemberProfilePointComponent,
    MemberPointsDetailComponent,
    IncentiveReportComponent
  ]
})

export class ReportModule {
}
