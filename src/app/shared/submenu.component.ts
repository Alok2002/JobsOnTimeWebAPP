import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { SharedServices } from '../services/shared.services';
import { UserServices } from '../services/user.services';

//import { JobTrackerComponent } from '../shared/jobtracker';
@Component({
    selector: 'SubMenuComponent',
    templateUrl: './submenu.component.html'
})

export class SubMenuComponent implements OnInit {
    paramsmenu: string;
    menuItems: Array<{ 'url': string, 'label': string }> = [];
    pageTitle: string;

    constructor(private sharedService: SharedServices,private userservice: UserServices,
        private cookieservice: CookieService,private router: Router, private activateroute: ActivatedRoute) {
    }

    ngOnInit() {
        this.activateroute.params.subscribe(params => {
            if (params['menu']) {
                this.paramsmenu = params['menu'];
            }

            this.genearteMenu(this.paramsmenu)
        });
    }

    genearteMenu(menu) {
        this.menuItems = [];
        if (menu) {
            if (menu == 'respondent') {
                this.pageTitle = "Panel Member";
                this.menuItems.push({ 'url': '/newrespondents', 'label': 'New Panel Member' });
                this.menuItems.push({ 'url': '/newbussinesspanelmember', 'label': 'New Business Panel Member' });
                this.menuItems.push({ 'url': '/newimpairmentpanelmember', 'label': 'New Impairment Panel Member' });
            }
            if (menu == 'communication') {
                this.pageTitle = "Communication";
                this.menuItems.push({ 'url': '/comms/sendsms', 'label': 'Send SMS' });
                this.menuItems.push({ 'url': '/comms/sendemail', 'label': 'Send Email' });
                this.menuItems.push({ 'url': '/comms/smsreplies', 'label': 'SMS Replies' });
            }
            if (menu == 'admin') {
                this.pageTitle = "Admin";
                this.menuItems.push({ 'url': '/system-users', 'label': 'System Users' });
                this.menuItems.push({ 'url': '/loginaudit', 'label': 'Login Audit' });
                this.menuItems.push({ 'url': '/support-ticket', 'label': 'Support Tickets' });
                this.menuItems.push({ 'url': '/emailtemplates', 'label': 'Email Templates' });
                this.menuItems.push({ 'url': '/admin/reference', 'label': 'System References' });
                this.menuItems.push({ 'url': '/system-configuration', 'label': 'System Configuration' });
                this.menuItems.push({ 'url': '/software-licence', 'label': 'Software Licences' });
            }
            if (menu == 'reports') {
                this.pageTitle = "Reports";
                this.menuItems.push({ 'url': '/report/sessionrecruitment', 'label': 'Session Recruitment Report' });
                this.menuItems.push({ 'url': '/report/jobrecruitment', 'label': 'Job Recruitment Report' });
                this.menuItems.push({ 'url': '/report/jobsummary', 'label': 'PM Job Summary Report' });
                this.menuItems.push({ 'url': '/report/jobsummarydetail', 'label': 'PM Job Detail Report' });
                this.menuItems.push({ 'url': '/report/joborder', 'label': 'Job Order Report' });
                this.menuItems.push({ 'url': '/report/staffkpi', 'label': 'Staff KPI Report' });
                this.menuItems.push({ 'url': '/report/staffattendance', 'label': 'Staff Attendance Report' });
                this.menuItems.push({ 'url': '/report/staffpayroll', 'label': 'Staff Payroll Report' });
            }
        }
    }
}