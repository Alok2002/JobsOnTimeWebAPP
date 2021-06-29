import { Injectable } from "@angular/core";
import 'rxjs';
import { Observable } from "rxjs/Observable";
import { apiHost } from "../app.component";
import { AuthService } from "./auth.services";
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ClientServices {  
  constructor(private _http: HttpClient, private authService: AuthService) {
  }

  getAllClientsforClientDT() {
    let input = new FormData();
    input.append("entity", "Client");
    input.append("dtparams", null);

    return this._http.post(apiHost + '/api/query/result', input);
  }

  getAllClients() {
    return this._http.get(apiHost + '/api/Clients-List');
  }

  getAllClientbyId(id) {
    return this._http.get(apiHost + '/api/client/' + id);
  }

  deleteClient(clientid: Array<string>) {
    let input = new FormData();
    var json = JSON.stringify(clientid);
    input.append("json", json);

    return this._http.post(apiHost + '/api/client/delete', input);
  }

  updateClient(client) {
    let input = new FormData();
    var json = JSON.stringify(client);
    input.append("json", json);

    return this._http.post(apiHost + '/api/client/update', input);
  }

  getClientNotes(cid) {
    return this._http.get(apiHost + '/api/client-notes/' + cid);
  }

  postClientNote(clientnotes) {
    let input = new FormData();
    var json = JSON.stringify(clientnotes);
    input.append("json", json);

    return this._http.post(apiHost + '/api/client-note/update', input);
  }

  deleteClientNotes(clientnotesids) {
    let input = new FormData();
    var json = JSON.stringify(clientnotesids);
    input.append("json", json);

    return this._http.post(apiHost + '/api/client-note/delete', input);
  }

  getFeedbackbyClient(cid) {
    return this._http.get(apiHost + '/api/client-feedback/' + cid);
  }

  getFeedbacks() {
    return this._http.get(apiHost + '/api/feedbacks');
  }

  updateClientFeedback(feedback) {
    let input = new FormData();
    var json = JSON.stringify(feedback);
    input.append("json", json);

    return this._http.post(apiHost + '/api/feedback/update', input);
  }

  deleteFeedback(feedbackids) {
    let input = new FormData();
    var json = JSON.stringify(feedbackids);
    input.append("json", json);

    return this._http.post(apiHost + '/api/feedback/delete', input);
  }

  getContactbyClient(cid) {
    return this._http.get(apiHost + '/api/client-contacts/' + cid);
  }

  updateClientContact(contact) {
    let input = new FormData();
    var json = JSON.stringify(contact);
    input.append("json", json);

    return this._http.post(apiHost + '/api/client-contact/update', input);
  }

  deleteContact(contactids) {
    let input = new FormData();
    var json = JSON.stringify(contactids);
    input.append("json", json);

    return this._http.post(apiHost + '/api/client-contact/delete', input);
  }

  getVenuebyClient(cid) {
    return this._http.get(apiHost + '/api/client-venues/' + cid);
  }

  getVenueAndGlobalbyClient(cid) {
    return this._http.get(apiHost + '/api/client-venues-plus-global/' + cid);
  }

  updateClientVenue(venue) {
    console.log(venue);
    let input = new FormData();
    var json = JSON.stringify(venue);
    input.append("json", json);

    return this._http.post(apiHost + '/api/client-venue/update', input);
  }

  deleteVenue(ids) {
    let input = new FormData();
    var json = JSON.stringify(ids);
    input.append("json", json);

    return this._http.post(apiHost + '/api/client-venue/delete', input);
  }

  getClientAddressbyClient(cid) {
    return this._http.get(apiHost + '/api/client-addresses/' + cid);
  }

  updateClientAddress(address) {
    let input = new FormData();
    var json = JSON.stringify(address);
    input.append("json", json);

    return this._http.post(apiHost + '/api/client-address/update', input);
  }

  deleteClientAddress(ids) {
    let input = new FormData();
    var json = JSON.stringify(ids);
    input.append("json", json);

    return this._http.post(apiHost + '/api/client-address/delete', input);
  }

  getClientJobContactTypeList() {
    return this._http.get(apiHost + '/api/data-provider/GetClientJobContactTypeList');
  }

  getClientContactsByTypeId(contactTypes, clientIds) {
    console.log(clientIds);
    let input = new FormData();
    var json = JSON.stringify({ clientIds: clientIds });
    var json1 = JSON.stringify({ contactTypes: contactTypes });
    input.append("clientIds", json);
    input.append("contactTypes", json1);

    return this._http.post(apiHost + '/api/GetClientContactsByTypeId', input);
  }

  getClientAccountNotes(clientid) {
    return this._http.get(apiHost + '/api/client-accounts-notes/' + clientid);
  }

  getClientContactType() {
    return this._http.get(apiHost + '/api/data-provider/GetClientAddressTypeList');
  }

  getClientPoByClientId(clientid) {
    return this._http.get(apiHost + '/api/client-pos/' + clientid);
  }

  updateClientPO(po) {
    let input = new FormData();
    var json = JSON.stringify(po);
    input.append("json", json);

    return this._http.post(apiHost + '/api/client-po/update', input);
  }

  deleteClientPo(ids) {
    let input = new FormData();
    var json = JSON.stringify(ids);
    input.append("json", json);

    return this._http.post(apiHost + '/api/client-po/delete', input);
  }

  updateClientNote(nt) {
    let input = new FormData();
    var json = JSON.stringify(nt);
    input.append("json", json);

    return this._http.post(apiHost + '/api/client-note/update', input);
  }

  getAccountContactByClient(clientid) {
    return this._http.get(apiHost + '/api/client-accounts-contacts/' + clientid);
  }

  getClientContactById(id: any) {
    return this._http.get(apiHost + '/api/client-contact/' + id);
  }

  uploadPrivateList(documentData, files) {
    let input = new FormData();
    var json = JSON.stringify(documentData);
    input.append("json", json);

    for (var i = 0; i < files.length; i++) {
      input.append("files" + i, files[i]);
    }

    return this._http.post(apiHost + '/api/private-list/upload', input);
  }

  getClientPrivateList(id) {
    return this._http.get(apiHost + '/api/document/client-private-list/' + id);
  }
  
  getClientJobPrivateList(clientContactId) {
    return this._http.get(apiHost + '/api/document/client-Job-private-list/' + clientContactId);
  }

  createClientFileDownloadOTP(clientcontactid) {
    return this._http.get(apiHost + '/api/CreateClientFileDownloadOTP/' + clientcontactid);    
  }

  validateClientFileDownloadOTP(otp: string, id: string) {
    let input = new FormData();    
    input.append("password", otp);
    input.append("clientContactId", id);

    return this._http.post(apiHost + '/api/ValidateClientFileDownloadOTP', input);
  }  

  updateClientContactTerms(client) {
    let input = new FormData();
    var json = JSON.stringify(client);
    input.append("json", json);

    return this._http.post(apiHost + '/api/client-contact-terms/update', input);
  }

  createClientLoginOTP(clientContactId) {    
    let input = new FormData();    
    input.append("clientContactId", clientContactId);    

    return this._http.post(apiHost + '/api/CreateClientLoginOTP', input);
  }
  
  validateClientLoginOTP(clientContactId, password) {    
    let input = new FormData();    
    input.append("clientContactId", clientContactId);    
    input.append("password", password);    

    return this._http.post(apiHost + '/api/ValidateClientLoginOTP', input);
  }
}
