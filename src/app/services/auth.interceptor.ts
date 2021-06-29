import { CookieService } from 'ngx-cookie-service';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as JWT from 'jwt-decode';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private cookieService: CookieService, private router: Router) { }

    private handleAuthError(err: HttpErrorResponse): Observable<any> {
        //handle your auth error or rethrow
        if (err.status === 401 || err.status === 403) {
            //navigate /delete cookies or whatever
            this.router.navigateByUrl(`/signin`);
            // if you've caught / handled the error, you don't want to rethrow it unless you also want downstream consumers to have to handle it as well.
            return Observable.of(err.message);
        }
        return Observable.throw(err);
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        /*var token = JWT(this.cookieService.get('auth_token'));
        console.log(token);*/
        if (!req.url.includes('//jsonip.com')) {
            req = req.clone({
                setHeaders: {
                    'Authorization': 'Bearer ' + this.cookieService.get('auth_token'),
                },
            });
        }

        return next.handle(req).catch(x => this.handleAuthError(x));
    }
}