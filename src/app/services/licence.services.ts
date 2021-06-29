import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import 'rxjs';
import { Observable } from "rxjs/Observable";
import { Licence } from '../models/licence';
import { apiHost } from "../app.component";
import { AuthService } from "./auth.services";
@Injectable()
export class LicenceServices {
  constructor(private _http: HttpClient, private authService: AuthService) { }

  getAllLicences() {
    return this._http.get(apiHost + '/api/licences');
  }

  getLiceceUsage(lid) {
    return this._http.get(apiHost + '/api/licence-usage/' + lid);
  }

  postNewLicence(licence: Licence) {
    let input = new FormData();
    var json = JSON.stringify(licence);
    input.append("json", json);

    return this._http.post(apiHost + '/api/licence/update', input);
  }
}
