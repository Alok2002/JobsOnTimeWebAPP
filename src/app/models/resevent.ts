export class ResEvent {
    public jobId: number;
    public groupId: number;
    public incentiveId: number;
    public incentive: string;
    public respondentIdsString: any;
    public event: string;
    public attendeeDocumentComment: string;
    public notes: string;
    public inDepthTime: string;
    public sendConfirmationEmail: boolean;
    public sendConfirmationSMS: boolean;
    public sendNoShowEmail: boolean;
    public sendSurveyInviteEmail: boolean;
    public sendSurveyInviteSMS: boolean;
    public performScreeningImmediately: boolean;
    public performSurveyImmediately: boolean;
    public removeFromOtherGroups: boolean = true;
    public numberOfPoints: boolean;
}
