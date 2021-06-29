import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import 'rxjs';
import { Observable } from "rxjs/Observable";
import { apiHost } from "../app.component";
import { AuthService } from "./auth.services";

@Injectable()
export class DocumentServices {
  constructor(private _http: HttpClient, private authService: AuthService) { }

  getQuotaDocuments(cid) {
    return this._http.get(apiHost + '/api/document/quote-document/' + cid);
  }

  getClientDocument(cid) {
    return this._http.get(apiHost + '/api/document/get/Client/' + cid);
  }

  getJobDocument(cid) {
    return this._http.get(apiHost + '/api/document/get/Job/' + cid);
  }

  postClientDocument(documentData, files) {
    let input = new FormData();
    var json = JSON.stringify(documentData);
    input.append("json", json);

    for (var i = 0; i < files.length; i++) {
      input.append("files" + i, files[i]);
    }

    return this._http.post(apiHost + '/api/document/upload', input);
  }

  deleteClientDocument(clientdoctids) {
    let input = new FormData();
    var json = JSON.stringify(clientdoctids);
    input.append("json", json);

    return this._http.post(apiHost + '/api/document/delete', input);
  }
  
  deleteClientPrivateList(clientdoctids) {
    let input = new FormData();
    var json = JSON.stringify(clientdoctids);
    input.append("json", json);

    return this._http.post(apiHost + '/api/client-private-list/delete', input);
  }

  updateDocument(doc) {
    let input = new FormData();
    var json = JSON.stringify(doc);
    input.append("json", json);

    return this._http.post(apiHost + '/api/document/update', input);
  }
}
