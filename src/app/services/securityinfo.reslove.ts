import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.services';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, NavigationEnd, ActivatedRoute, RoutesRecognized, ResolveStart } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { apiHost } from '../app.component';
import { promise } from "protractor";
import { filter, map } from "rxjs/operators";


@Injectable()
export class SecurityInfoResolve implements Resolve<boolean> {

  constructor(private router: Router, private authhelperservice: AuthService, private _http: HttpClient,
    private cookieService: CookieService, private activatedRoute: ActivatedRoute) { }

  public checkPermission(sdata) {
    return this._http.get(apiHost + '/api/access-allowed/' + sdata);
  }

  resolve(route: ActivatedRouteSnapshot): Promise<boolean> | boolean {
    let securityData = route.data.securityData;
    //return true;
    return this.checkPermission(securityData)
      .toPromise()
      .then((data: any) => {
        console.log(data);
        if (data.succeeded) {
          return true;
        } else {
          this.router.navigate(['/accessdenied', securityData]);
          return false;
        }
      });
  }
}