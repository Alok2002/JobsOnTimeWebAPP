export const FilterColors: Array<{ text: string, style: string, value: number }> = [
    { 'text': '', 'style': '', 'value': 0 },
    { 'text': 'Red', 'style': 'red', 'value': 1 },
    { 'text': 'Green', 'style': 'green', 'value': 2 },
    { 'text': 'Orange', 'style': 'orange', 'value': 3 },
    { 'text': 'Blue', 'style': 'blue', 'value': 4 },
    { 'text': 'Black', 'style': 'black', 'value': 5 },
    { 'text': 'Yellow', 'style': 'yellow', 'value': 6 },
    { 'text': 'Purple', 'style': 'purple', 'value': 7 },
];

export const SecurityRights = {
    RemoteLogin: "RLI",
    ExportAllResults: "EXP",
    ExportRespondents: "EXR",
    ClientExternalNotes: "CEN",
    ClientAdmin: "CLI",
    JobAdmin: "JOB",
    Invoicing: "INV",
    Quoting: "QTE",
    Incentives: "ICV",
    StaffMYOBAccess: "MYOB",
    SessionRecruitmentReport: "SRRPT",
    JobRecruitmentReport: "JRRPT",
    PMJobSummaryReport: "JSRPT",
    PMJobDetailReport: "JDRPT",
    JobOrderReport: "JORPT",
    StaffKPIReport: "SKRPT",
    StaffAttendanceReport: "SARPT",
    StaffPayrollReport: "SPKRPT",
    RespondentAdmin: "RES",
    BankingAdmin: "BNK",
    RespondentPassword: "RSP",
    UserAdmin: "USR",
    ReferenceDataAdmin: "REF",
    ConfigurationAdmin: "CFG",
    PrivateListAdmin: "LST",
    ResearchMeLicence: "RME",
    Tickets: "TKT",
    EmailTemplateAdmin: "ETA",
    EmailSenderAdmin: "ESA",
    LoginAuditAdmin: "LAA",
    SalesReport: "SLRPT",
    MemberPointReport: "MPRPT",
    RosterJobAllocation: "RJA",
    ManageGlobalQueries: "MGQ",
    IncentiveReport: "INCRPT",
    SearchEvents: "SEV",
    ManageStaffAttendance: "MSA",
    SurveyMapReference: "SMR",
    ManageSurveyLibraryQuestions: "MSLQ",
    DeveloperTools: "DVT"
};

export const SecurityRightsExportError = "You don't have permission to export results.<br>Please contact system administrator.";