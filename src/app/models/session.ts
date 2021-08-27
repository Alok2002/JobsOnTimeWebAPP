import { Incentive } from './incentive';
import { JobContact } from './jobcontact';
import { SessionContact } from './sessioncontact';
import { SessionVenue } from './sessionvenue';

export class Session {
  /*public id: number;
  public dateTime: number;
  public name: string;
  public location: string;
  public incentive: string;
  public duration: string;
  public clientJobId: number;
  public time: string;
  public other: string;
  public locationPhoneEmail: string;
  public locationPhone: string;
  public groupType: string;
  public incentiveType: string;
  public clientContactName: string;
  public clientContactDaytime: string;
  public clientContactEmail: string;
  public clientContactAfterHours: string;
  public researchersName: string;
  public researchersContactAfterHours: string;*/

  public id: number;
  public dateTime: any;
  public name: string;
  public location: string;
  public duration: string;
  public clientJobId: number;
  public time: string;
  public groupType: string;
  public respondentsRequired: number;
  public numberNeeded: number;
  public validationReportReceived: boolean;
  public jobName: string;
  public jobNumber: string;
  public clientName: string;
  public projectManagerUsername: string;
  public projectManagerName: string;
  public numberOfQualifiedRespondents: number;
  public numberOfConfirmedRespondents: number;
  public afterHourSession: boolean;
  public doNotReconfirm: boolean;
  public clientId: number;
  public clientVenueId: number;
  public other: string;
  public validationReportSent: boolean;

  public clientJobGroupContact: Array<SessionContact>;
  public clientJobGroupVenue: Array<SessionVenue>;
  public clientJobGroupIncentives: Array<{ clientJobGroupId: number, clientJobIncentiveId: number, clientJobIncentives: Incentive }>;
  public clientJobGroupTime: Array<{ id: number, clientJobGroupId: number, formattedGroupTime: string }>;

  public numberOfFinalConfirmedRespondents: number;
  public numberOfSmsConfirmedRespondents: number;
  public numberOfEmailConfirmedRespondents: number;

  public hasHomeworkTask: boolean;
  public venueInstructions: string;
  public redirectionLink: string;
  public redirectionLinkDisqualified: string;
  public redirectionLinkQuotaFull: string;

  public copyGroupId: number;
  public addVenueInstructions: string;
  public confirmationEmail: string;
  public sessionRequirements: string;
  public arrivalInformation: string;
  public incentiveInfo: string;
  public respEvent: Array<any>;

  public sessionNumber: number;
}
