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
}