import {JobRes} from "./jobres";

export class JobRespondent {
  public id: number;
  public resId: number;
  public userName: string;
  public userFullName: string;
  public respondentFullName: string;
  public eventDescription: string;
  public eventNotes: string;
  public eventDate: string;
  public jobGroupId: number;
  public inDepthTime: string;
  public attendeeDocumentComment: string;
  public jobId: number;
  public respondentConfirmed: string;
  public incentive: string;
  public numberOfPoints: string;
  public res: JobRes;

  public businessRego: boolean;
  public disabilityRego: boolean;
  public respondentEmail: string;
  public respondentMobile: string;
  public respondentFormattedMobile: string;

  public doNotCall: boolean;
  public hasAccent: boolean;
  public oneOffRespondent: boolean;
  public keenRespondent: boolean;

  public paymentSent: boolean;
  public confirmationSMSSentDate: string;
  public confirmationEmailSentDate: string;
}
