import {ClientContact} from './clientcontact';
import {Incentive} from './incentive';
import {Venue} from './venue';

export class Job {
  /*public id: number;
  public clientId: number;
  public name: string;
  public jobName: string;
  public date: string;
  public location: string;
  public locationPhone: string;
  public jobNumber: number;
  public jobSubject: string;
  public contact: string;
  public contactEmail: string;
  public contactAfterHours: string;
  public researchersName: string;
  public researchersContactAfterHours: string;
  public validationReportReceived: boolean;
  public contactPhone: string;
  public other: string;
  public assistantProjectManager: string;
  public projectManagerUsername: string;
  public jobTopic: string;
  public incentive: string;
  public duration: string;
  public incentiveType: string;
  public jobStatus: string;
  public jobType: string;
  public firstSessionDate: string;
  public respondentsRequired: string;
  public importantJobNotes: string;
  public dateAllocatedToRecruitment: string;
  public projectReceivedDate: string;*/

  public id: number;
  public clientId: number;
  public clientName: string;
  public jobNumber: string;
  public jobName: string;
  public jobType: string;
  public jobSubject: string;
  public jobStatus: string;
  public projectManagerUsername: string;
  public assistantProjectManager: string;
  public respondentsRequired: number;
  public importantJobNotes: string;
  public dateAllocatedToRecruitment: any;
  public projectReceivedDate: string;
  public showInClientPortal: boolean;
  public invoiceContact: number;
  public invoiceClient: number;
  public invoiceStatus: string;
  public invoiceNotes: string;
  public quoteNumber: string;
  public quoteStatus: string;
  public invoiceNumber: string;
  public clientPO: string;
  public quoteNotes: string;
  public dateReceived: any;
  public dateQuoted: any;
  public invoiceSent: any;
  public quotedBy: string;

  public recruiter1: string;
  public recruiter2: string;
  public difficultyStatus: string;
  public jobApprovedNo: number;
  public dateJobApproved: any;

  public inviteDate: string;
  public inviteTime: string;
  public inviteLocation: string;
  public inviteJobDescription: string;
  public inviteDetailedDescription: string;
  public surveyDuration: string;
  public studyDetails: string;
  public homeworkTask: string;

  public jobTopic:string;
  public other:string;
  public sourceType:string;
  public inviteJobType:string;
  public firstSessionDate:string;
  public lastSessionDate:string;
  public validationReportReceivedCalculated:boolean;
  public sessionCount:number;
  public signedOffByUsername:string;
  public listenCallRecording:boolean;

  public expectedFirstSessionDate: any;
  public expectedLastSessionDate: any;
  public jobBreadcrumbDetails: string;
  public showMyobButton: boolean;
  public sessionType: string;
  public numberOfQualifiedRespondents: number;
  public actualRespondentsRequired: number;
  public dateLastModified: string;

  public clientJobContact: Array<ClientContact>;
  public clientJobIncentives: Array<Incentive>;
  public clientJobVenue: Array<Venue>;

  public invoicePushedToMyob: boolean;
  public contactCount: number;
  public incentiveCount: number;
  public venueCount: number;

  public jobNumberAndName: string;
  public projectManagerUser: {fullName: string};
  public quotedByUser: {fullName: string};
  public signedOffByUser: {fullName: string};

  public hasHomeworkTask: boolean;
  public clientPoRequired: boolean;
  public inviteImageUrl: boolean;
  public clientSurveyLink: string;
  public autoForward: boolean;

  public preQualCompleteMsg: string;
  public preQualButtonText: string;

  public internalQuoteNotes: string;
  public quoteFollowUpDate: any;
  public quoteFollowedUp: boolean;

  public qualJob: boolean;
  public quantJob: boolean;
}
