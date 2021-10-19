import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import 'rxjs';
import { apiHost } from "../app.component";

import * as JWT from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth.services';
import { ReferFriend } from "../models/user";

@Injectable()
export class UserServices {
    constructor(private _http: HttpClient, private authService: AuthService,
        private cookieService: CookieService) { }

    getAllUser() {
        return this._http.get(apiHost + '/api/users');
    }

    getStaffs() {
        return this._http.get(apiHost + '/api/users/staffs');
    }

    deactivateUser(configitemid: Array<string>) {
        let input = new FormData();
        var json = JSON.stringify(configitemid);
        input.append("json", json);

        return this._http.post(apiHost + '/api/users/delete', input);
    }

    submitUser(user) {
        let input = new FormData();
        var json = JSON.stringify(user);
        input.append("json", json);

        return this._http.post(apiHost + '/api/users/update', input);
    }

    checkDuplicateUser(email) {
        let input = new FormData();
        input.append("emailAddress", email);

        // return this._http.post(apiHost + '/api/check-duplicate-user', input, { headers: { ignoreLoadingBar: '' } });
        return this._http.post(apiHost + '/api/check-duplicate-user', input);
    }

    login(loginUser) {
        let input = new FormData();
        var json = JSON.stringify(loginUser);
        input.append("json", json);

        // return this._http.post(apiHost + '/api/login', input)
        return this._http.post(apiHost + '/api/user-login', input);
    }

    forgotPassword(email, firstname, lastname, role) {
        let input = new FormData();
        input.append("emailAddress", email);
        input.append("firstName", firstname);
        input.append("lastName", lastname);
        input.append("role", role);

        return this._http.post(apiHost + '/api/forgot-password', input);
    }

    getUserName() {
        var token = {};
        if (this.cookieService.get('auth_token'))
            token = JWT(this.cookieService.get('auth_token'));

        return this._http.get(apiHost + '/api/user-fullname/' + token['unique_name']);
    }

    signUp(user) {
        let input = new FormData();
        var json = JSON.stringify(user);
        input.append("json", json);

        return this._http.post(apiHost + '/api/res-signup', input);
    }

    getActiveUsers() {
        return this._http.get(apiHost + '/api/ActiveUsers');
    }

    updateNotes(usnStaff: string, usnNotes: string) {
        let input = new FormData();
        input.append("username", usnStaff);
        input.append("notes", usnNotes);

        return this._http.post(apiHost + '/api/users/UpdateNotes', input);
    }

    setPassword(newpassword: string, encrypt: string, role: string) {
        let input = new FormData();
        input.append("password", newpassword);
        input.append("encodedData", encrypt);
        input.append("role", role);

        return this._http.post(apiHost + '/api/Set-password', input);
    }

    gaGenerateSetupCode(username, role) {
        let input = new FormData();
        input.append("username", username);
        input.append("role", role);

        return this._http.post(apiHost + '/api/ga/GenerateSetupCode', input);
    }

    validateTwoFactorPIN(username, role, pin) {
        let input = new FormData();
        input.append("username", username);
        input.append("role", role);
        input.append("pin", pin);

        return this._http.post(apiHost + '/api/ga/ValidateTwoFactorPIN', input);
    }

    getUser2FAStatus(username) {
        return this._http.get(apiHost + '/api/user-2fa-Status/' + username);
    }

    getUserDetails(username) {
        return this._http.get(apiHost + '/api/user-detail/' + username);
    }

    referaFriend(referFriend: ReferFriend) {
        let input = new FormData();
        var json = JSON.stringify(referFriend);
        input.append("json", json);

        return this._http.post(apiHost + '/api/referaFriend', input);
    }
}