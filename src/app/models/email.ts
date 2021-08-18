import {Client} from "./client";
import {Job} from "./job";
import {Session} from "./session";
import {Incentive} from "./incentive";

export class Email {
  public addToElectronicDocuments: boolean;
  public recipients: string;
  public bccRecipients: string;
  public blindRecipients: string;
  public subject: string;
  public body: string;
  public type: string;
  public jobIdForQuoteEmail: number;
  public failedRecipients: Array<string>;
  public isUpdateLink: boolean;
  public isClientEmail: boolean;
  public isGroupConfirmationEmail: string;
  public serverAttachmentFiles: string;
  public sendBlind: boolean;
  public respondentIds: Array<number>;
  public fromUsername: string;
  public attachmentFile1: string;
  public attachmentFile2: string;
  public attachmentFile3: string;
  public respondents: string;
  public fromId: number;
  public from: number;
  public fromList: Array<{id: number, name: string, emailAddress: string}>;
  public templateId: number;
  public clientId: number;
  public client: Client;
  public jobId: number;
  public job: Job;
  public groupId: number;
  public group: Session;
  public incentiveId: number;
  public incentive: Incentive;

  public recipientsList: Array<{display: string, value: string}>;
  public bccRecipientsList: Array<{display: string, value: string}>;

  public isAttachCalendarEvent: boolean;
}
