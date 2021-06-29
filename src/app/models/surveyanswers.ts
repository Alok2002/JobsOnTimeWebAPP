export class SurveyAnswers {
  public id: number;
  public questionId: number;
  public respondentId: number;
  public answer: string;
  public otherText: string;
  public otherSpecify: string;
  public surveyId: number;
  public order?: number;
}
