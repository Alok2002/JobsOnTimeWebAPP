export class TrackingJob {
    public id: number;
    public jobApprovedNo: string;
   /* public jobBreadcrumbDetails: string;
    public jobDetailsForList: string;
    public jobMainContactCount: number;
    public jobMainContactEmail: string;
    public jobMainContactFirstName: string;
    public jobMainContactName: string;
    public jobMainContactPhone: string;*/
    public jobName: string;
    public jobNumber: string;
    public jobNumberAndName: string;
    public jobNumberAndNameLink: string;
    public jobStatus: string;
    //public jobSubject: string;
    //public jobTopic: string;
    public jobType: string;
    public clientId: number;

    constructor(tjob: TrackingJob) {
        this.id = tjob.id;
        this.jobApprovedNo = tjob.jobApprovedNo;
        // this.jobBreadcrumbDetails = tjob.jobBreadcrumbDetails;
        // this.jobDetailsForList = tjob.jobDetailsForList;
        // this.jobMainContactCount = tjob.jobMainContactCount;
        // this.jobMainContactEmail = tjob.jobMainContactEmail;
        // this.jobMainContactFirstName = tjob.jobMainContactFirstName;
        // this.jobMainContactName = tjob.jobMainContactName;
        // this.jobMainContactPhone = tjob.jobMainContactPhone;
        this.jobName = tjob.jobName;
        this.jobNumber = tjob.jobNumber;
        this.jobNumberAndName = tjob.jobNumberAndName;
        this.jobNumberAndNameLink = tjob.jobNumberAndNameLink;
        this.jobStatus = tjob.jobStatus;
        // this.jobSubject = tjob.jobSubject;
        // this.jobTopic = tjob.jobTopic;
        this.jobType = tjob.jobType;
        this.clientId = tjob.clientId;
    }
}