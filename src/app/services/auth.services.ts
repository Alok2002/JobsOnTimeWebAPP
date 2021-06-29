import { SharedServices } from './shared.services';
import { MetaService } from '@ngx-meta/core';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, NavigationEnd, ActivatedRoute, ChildActivationEnd, ActivationStart } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as JWT from 'jwt-decode';
import { apiHost, pageTile } from '../app.component';
import { map, filter, take } from 'rxjs/operators';
import { route } from '../lazymodules/accessdenied.module';

@Injectable()
export class AuthService implements CanActivate {
    roles: any;
    result: any;
    pageTile = pageTile;

    /*public httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        withCredentials: true // to allow cookies to go from "https://localhost:4567" to "http://localhost:5678"
    };

    public createAuthorizationHeader() {
        var headers = new HttpHeaders();
        headers.append('Authorization', 'Bearer ' + this.cookieService.get('auth_token'));
        this.httpOptions.headers = headers;
        return this.httpOptions;
    }*/

    constructor(private _http: HttpClient, private _router: Router, public cookieService: CookieService,
        private metaservice: MetaService, public router: Router, public activatedRoute: ActivatedRoute) {
        /*this.router
            .events
            .filter(e => e instanceof NavigationEnd)
            .map(() => {
                let route = this.activatedRoute.firstChild;
                let child = route;

                while (child) {
                    if (child.firstChild) {
                        child = child.firstChild;
                        route = child;
                    } else {
                        child = null;
                    }
                }

                return route;
            })
            .mergeMap(route => route.data)
            .subscribe(data => console.log(data));*/
    }

    public checkloginStatus() {
        return this._http.get(apiHost + '/api/login-status');
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let route = next.firstChild;
        let child = route;
        while (child) {
            if (child.firstChild) {
                child = child.firstChild;
                route = child;
            } else {
                child = null;
            }
        }
        route;        
        var routetitle = null;
        if (route) routetitle = route.data.pagetitle;
        else routetitle = next.data.pagetitle;

        if (routetitle)
            this.metaservice.setTitle(routetitle + " - " + pageTile, true);
        else
            this.metaservice.setTitle(pageTile, true);

        this.roles = [];
        this.roles = next.data;
        this.result = false;

        if (this.cookieService.get('auth_token'))
            var token = JWT(this.cookieService.get('auth_token'));
        else this._router.navigate(['/signin']);

        //console.log(this.authHelperService.checkloginStatus());
        this.result = this._http.get(apiHost + '/api/login-status')
            .pipe(map(res => {
                for (var j = 0; j < this.roles.permissions.length; j++) {
                    if (res['value'] && token['actort'] == this.roles.permissions[j]) {
                        return true;
                    }
                }

                this._router.navigate(['/signin']);
                return false;
            }));
        console.log(this.result);
        return this.result;
    }
}
