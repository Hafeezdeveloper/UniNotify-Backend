export const OTPExpiry = '5m';
export const LAST_MESSAGE_TIME = 12 * 60 * 60 * 1000;
interface ValidationMessages {
    str: string;
    num: string;
    bool: string;
    oid: string;
    req: string;
    min: string;
    max: string;
    date: string;
    email: string;
    invalid: string;
    invalidPassword: string;
}
export const PROFILE_PREFIX = 'profile';

export const COVER_PREFIX = 'cover';
export const documentPrefix = 'document-';
export const approved = 'approved';
export const info = 'info';
export const reason = 'reason';
export const heart = 'heart';
export const MAXIMUM = 'maximum';
export const REPORT = 'report';
export const DISPUTE_MARK = 'dispute';

export enum genderEnum {
    FEMALE = 'female',
    MALE = 'male',
    OTHER = 'other',
}
export const { FEMALE, MALE, OTHER } = genderEnum;


export enum roleEnum {
    STUDENT = 'student', ///
    TEACHER = 'teacher', ///
    ADMIN = 'admin', ///
}
export const { STUDENT, TEACHER, ADMIN } = roleEnum

export enum UserStatusEnum {
    ACTIVE = 'active',
    VERIFIRED = 'verified',
    UN_VERIFIRED = 'unverified',
    REMOVED = 'removed',
    AWAY = 'away',
    PENDING = 'pending',
}

export const vMsg: ValidationMessages = {
    str: 'Value must be a string.',
    num: 'Value must be a number.',
    bool: 'Value must be a boolean',
    oid: 'Value must be an ObjectId',
    req: 'Value is required.',
    min: 'Value must be at least {#limit} characters long.',
    max: 'Value must be at most {#limit} characters long.',
    date: 'Date must be in ISO format.',
    email: 'Invalid email format.',
    invalid: 'Value is invalid.',
    invalidPassword:
        'Password must contain one lowercase letter, one uppercase letter, one numeric character, and one special character',
};


export const emailSub = {
    sendVerificationLink: 'Verification',
    resetPassword: 'resetPassword',

};

export const emailTemplates = {

    sendVerificationLink: 'sendVerificationLink',
    resetPassword: 'resetPassword',
};