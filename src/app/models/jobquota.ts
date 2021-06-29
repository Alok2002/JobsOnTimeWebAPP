export class JobQuota {
  public id: number;
  public description: string;
  //public descriptionObj: { id: string, value: string };
  public jobGroupId: number;
  public positions: number;
  public remainingPositions: number;
  public jobId: number;
  public isSurvey: boolean;
  public isScreener: boolean;
  public isAllSessions: boolean;

  public surveyQuotaRequired: number;
  public surveyQuotaQualified: number;
  public screenerQuotaRequired: number;
  public screenerQuotaQualified: number;
  public closeSurvey: boolean;
}



