export class Sms {
  public jobId: number;
  public groupId: number;
  public addToElectronicDocuments: boolean;
  public recipients: string;
  public recipientsList: Array<{ display: string, value: string }>;
  public subject: string;
  public body: string;
  public respondentIds: Array<number>;
  public fromUsername: string;
  public voiceMessage: string;
  public provider: string;
  public isUpdateLink: boolean;
}
