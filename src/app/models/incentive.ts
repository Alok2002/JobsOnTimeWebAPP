export class Incentive {
  public id: number;
  public clientJobId: number;
  public incentiveAmount: string;
  public incentiveType: string;
  public incentiveCriteria: string;
  public duration: string;
  public description: string;
  public formattedDuration: string;
  public notes: string;
  public selected: boolean;
  public invoiceItemId: number;
  public autoPay: boolean;
}