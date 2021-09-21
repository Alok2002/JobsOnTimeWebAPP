export class User {
    public id: number;
    public fullName: string;
    public firstName: string;
    public lastName: string;
    public username: string;
    public directLine: string;
    public mobile: string;
    public extension: string;
    public officeEmail: string;
    public personalEmail: string;
    public employeeType: string;
    public formattedDateofBirth: string;
    public dateofBirth: any;
    public formattedPhone: string;
    public formattedMobile: string;
    public emailAddress: string;
    public passwordRaw: string;
    public newUser: boolean;

    public securityRightsGranted: string;
    public security_ARPT: boolean;
    public security_BNK: boolean;
    public security_CFG: boolean;
    public security_CLN: boolean;
    public security_EXP: boolean;
    public security_EXR: boolean;
    public security_ICV: boolean;
    public security_INV: boolean;
    public security_KRPT: boolean;
    public security_LST: boolean;
    public security_SEV: boolean;
    public security_MRPT: boolean;
    public security_MYOB: boolean;
    public security_RJA: boolean;
    public security_SMR: boolean;
    public security_ORPT: boolean;
    public security_QTE: boolean;
    public security_REF: boolean;
    public security_RES: boolean;
    public security_RLI: boolean;
    public security_RME: boolean;
    public security_RPT: boolean;
    public security_RSP: boolean;
    public security_SRPT: boolean;
    public security_TKT: boolean;
    public security_USR: boolean;
    public security_CLI: boolean;
    public security_CEN: boolean;

    public security_SRRPT: boolean;
    public security_JRRPT: boolean;
    public security_JSRPT: boolean;
    public security_JDRPT: boolean;
    public security_JORPT: boolean;
    public security_SKRPT: boolean;
    public security_SARPT: boolean;
    public security_SPKRPT: boolean;
    public security_INCRPT: boolean;
    public security_JOB: boolean;

    public security_ETA: boolean;
    public security_ESA: boolean;
    public security_LAA: boolean;
    public security_MGQ: boolean;

    public security_SLRPT: boolean;
    public security_MPRPT: boolean;
    public security_MSA: boolean;
    public security_MSLQ: boolean;
    public security_DVT: boolean;

    public employeePosition: string;
    public inactive: boolean;
    public skip2FA: boolean;
    public enable2FA: boolean;
}

export class ReferFriend {
    public yourEmail: string;
    public friendEmail1: string;
    public friendEmail2: string;
    public friendEmail3: string;
    public message: string;
    public referrer: string;
}