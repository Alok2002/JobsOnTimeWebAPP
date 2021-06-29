export class JobInvoice {
  public id: number;
  public clientJobId: number;
  public itemDescription: string;
  //public itemDescriptionObj: {id: string, value: string};
  public itemQuotedAmount: number;
  public itemQuotedQty: number;
  public itemActualAmount: number;
  public itemActualQty: number;
  public itemTaxCode: string;
  public incentivePaid: number;
  public itemOrder: number;
  // public invoiceNumber: string;
}
