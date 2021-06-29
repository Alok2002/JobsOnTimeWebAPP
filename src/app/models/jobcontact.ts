import {ClientContact} from "./clientcontact";

export class JobContact {
  public id: number;
  public clientJobId: number;
  public clientContactId: number;
  public contactType: string;
  public formattedPhone: string;
  public formattedMobile: string;
  public formattedAfterhours: string;
  public emailAddress: string;
  public onlineAccess: boolean;
  public comment: boolean;
  public onlineAccessThisJob: boolean;

  public clientContact:ClientContact;
}
