import {ClientContact} from './clientcontact';

export class SessionContact {
  public id: number;
  public clientJobGroupId: number;
  public clientContactId: number;
  public clientContact: ClientContact;
  public jobContactType: string;
}
