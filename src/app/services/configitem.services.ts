import 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiHost } from '../app.component';
import { ConfigItem } from '../models/configitem';
import { AuthService } from './auth.services';
@Injectable()
export class ConfigItemServices {
  constructor(private _http: HttpClient, private authService: AuthService) { }

  getAllConfigItems() {
    return this._http.get(apiHost + '/api/configitems');
  }

  postConfigItem(configitem: ConfigItem) {
    let input = new FormData();
    var json = JSON.stringify(configitem);
    input.append("json", json);

    return this._http.post(apiHost + '/api/configitem/update', input);
  }

  deleteConfigItem(configitemid: Array<string>) {
    let input = new FormData();
    var json = JSON.stringify(configitemid);
    input.append("json", json);

    return this._http.post(apiHost + '/api/configitem/delete', input);
  }
}
