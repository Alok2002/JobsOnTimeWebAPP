export class ClientContact {
  public id: number;
  public clientId: number;
  public firstname: string;
  public lastname: string;
  public phone: string;
  public mobile: string;
  public afterhours: string;
  public emailAddress: string;
  public comment: string;
  public contactType: string;
  public formattedMobile: string;
  public formattedPhone: string;
  public fullName: string;
  public onlineAccess: boolean;
  public password: string;
  public passwordRaw: string;
  public formattedAfterhours: string;

  public clientJobId?: number;
  public jobContactType?: string;
  public onlineAccessThisJob?: boolean;

  public stakeholder: boolean;
}




