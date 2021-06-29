import { ClientContact } from "./clientcontact";

export class Client {
  public id: number;
  public name: string;
  public address: string;
  public contactPerson: string;
  public phone: string;
  public fax: string;
  public email: string;
  public shortName: string;
  public password: string;
  public onlineAccess: boolean;
  public photoUrl: string;
  public notes: string;
  public website: string;
  public invoiceContactName: string;
  public invoiceContactEmail: string;
  public accountsContactName: string;
  public accountsContactEmail: string;
  public poRequired: boolean;
  public numberOfJobs: number;
  public myobCustomerId: number;
  public suburb: string;
  public postcode: string;
  public state: string;
  public category: string;
  public cardId: string;

  public createdDate: string;
  public lastUpdatedDate: string;
  public jobCount: number
  public allowOnlineAccess: boolean;
  public allowPrivateList: boolean;

  public clientContact: Array<ClientContact>;
  public dateAgreedToTerms: any;
}
