import 'rxjs';
import { Injectable } from '@angular/core';
import { apiHost } from '../app.component';
import { AuthService } from './auth.services';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class TicketServices {
  constructor(private _http: HttpClient, private authService: AuthService) { }

  getAllTickets() {
    return this._http.get(apiHost + '/api/tickets');
  }

  getTicketById(id) {
    return this._http.get(apiHost + '/api/ticket/' + id);
  }

  GetTicketPriorityList() {
    return this._http.get(apiHost + '/api/data-provider/GetTicketPriorityList');
  }

  GetTicketStatusList() {
    return this._http.get(apiHost + '/api/data-provider/GetTicketStatusList');
  }

  GetTicketTypeList() {
    return this._http.get(apiHost + '/api/data-provider/GetTicketTypeList');
  }

  GetTicketModuleList() {
    return this._http.get(apiHost + '/api/data-provider/GetTicketModuleList');
  }

  deleteTicket(configitemid: Array<string>) {
    let input = new FormData();
    var json = JSON.stringify(configitemid);
    input.append("json", json);

    return this._http.post(apiHost + '/api/ticket/delete', input);
  }

  postTicket(ticket) {
    let input = new FormData();
    var json = JSON.stringify(ticket);
    input.append("json", json);

    return this._http.post(apiHost + '/api/ticket/update', input);
  }
}
