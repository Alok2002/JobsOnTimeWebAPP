import { SurveyQuestionOption } from "./surveyquestionoption";
import { SurveyAnswers } from "./surveyanswers";

export class SurveyQuestions {
  //public questionName: string;
  //public questionType: string;
  public questionLabel: string;
  //public questionOptions: Array<object>;
  public questionOrder: number;
  public iconclass: string;
  public answer: string;
  public option: boolean;
  public staffNotes: string;

  public id: number;
  public clientJobGroupSurveyId: number;
  public questionNumber: number;
  public answerType: string;
  public questionText: string;
  public questionTextClean: string;
  public isMandatory: boolean;
  public randomize: boolean;
  public inactive: boolean;
  public minNumAnswers: number;
  public maxNumAnswers: number;
  public enforceMinMax: boolean;
  public internalText: string;
  public matrixHorizontalOptions: string;
  public mediaUrl: string;
  public otherOptionText: string;

  //public questionOptions: Array<SurveyQuestionOption>;
  public clientJobSurveyQuestionOption: Array<SurveyQuestionOption>;
  public matrixChoiceArray: Array<{ optionName: string, questionId: number }>;
  public clientJobSurveyAnswers: Array<SurveyAnswers>;
  public isMedia: boolean;
  public answerTypeToolTip: string;
  public disability: boolean;

  public mappingEntity: string;
  public profilePopulateAlert: string;
  public goToQuestionNum: number;
  public randomizeOptions: boolean;
  public isTemplate: boolean;
}
