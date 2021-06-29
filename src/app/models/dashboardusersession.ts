export class DashboardUserSession {
  public id: number;
  public clientId: number;
  public clientName: string;
  public jobId: number;
  public jobName: string;
  public jobStatus: string;
  public difficultyStatus: string;
  public jobNumber: string;
  public projectManager: string;
  public recruiter1: string;
  public recruiter2: string;
  public sessionId: number;
  public sessionName: string;
  public sessionDate: string;
  public requiredforSession: number;
  public qualifiedforSession: number;
  public needForSession: number;
  public confirmed: number;
  public confirmationEmailSent: number;
  public confirmationSmsSent: number;
  public validationReportSent: boolean;

  public requiredforJob: number;
  public qualifiedforJob: number;
  public needForJob: number;

  public recruiter1User: {fullName: string};
  public projectManagerUser: {fullName: string};
}
