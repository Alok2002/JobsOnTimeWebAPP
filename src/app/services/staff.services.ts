import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import 'rxjs';
import { apiHost } from "../app.component";

import * as JWT from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth.services';

@Injectable()
export class StaffServices {
    constructor(private _http: HttpClient, private authService: AuthService,
        private cookieService: CookieService) { }

    updateAttendanceReport(attendanceReport) {
        let input = new FormData();
        var json = JSON.stringify(attendanceReport);
        input.append("json", json);

        return this._http.post(apiHost + '/api/AttendanceReport/update', input);
    }

    deleteAttendanceReport(ids) {
        let input = new FormData();
        var json = JSON.stringify(ids);
        input.append("json", json);

        return this._http.post(apiHost + '/api/AttendanceReport/delete', input);
    }
}