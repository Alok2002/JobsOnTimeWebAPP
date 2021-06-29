import { SurveyQuestions } from "./surveyquestions";

export class Survey {
  public id: number;
  public clientJobGroupId: number;
  public expiryDate: any;
  public title: string;
  public description: string;
  public clientJobId: number;
  public isScreener: boolean;
  public completionSuccessPoints: number;
  public completionDisqualifiedPoints: number;
  public maxSuccessRequired: number;
  public closed: boolean;
  public version: number;
  public publicURL: string;

  public clientJobSurveyQuestions: Array<SurveyQuestions>;
}
