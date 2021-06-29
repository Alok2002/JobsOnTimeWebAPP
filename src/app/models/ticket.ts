export class Ticket {
    public id: number;
    public summary: string;
    public description;
    public createdDate: string;
    public status: string;
    public createdByStaff: string;
    public assignedByStaff: string;
    public assignedToStaff: string;
    public module: string;
    public type: string;
    public events: string;
    public ticketImageUrls: string;
    public priority: string;
    public requiredEffect: string;
    public lastChangedDate: string;
    public formattedCreatedDate: string;
    public formattedLastChangedDate: string;
    public estimDevDuration: string;
    public actualDevDuration: string;
    public estimTestDuration: string;
    public actualTestDuration: string;
    public ticketType: string;
    public designTask: string;
    public developmentTask: string;
    public completedTask: string;
}
