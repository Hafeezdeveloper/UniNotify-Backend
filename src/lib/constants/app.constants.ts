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

export enum RoleEnum {
  PARTICIPANT = 'participant',
  PROVIDER = 'provider',
  COMPANY = 'company',
  EMPLOYEE = 'employee',
}

export const { PARTICIPANT, PROVIDER, COMPANY, EMPLOYEE } = RoleEnum;

export enum AudienceRoleEnum {
  PARTICIPANT = 'participant',
  PROVIDER = 'provider',
  BOTH = 'both',
}

export const { BOTH } = AudienceRoleEnum;
export const OPERATOR = 'operator';

export enum StatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  DELETED = 'deleted',
  DEACTIVATED = 'deactivated',
  DECLINED = 'declined',
  AWAY = 'away',
}

export const { ACTIVE, INACTIVE, PENDING, DEACTIVATED, DECLINED, AWAY } =
  StatusEnum;

export enum PropertyStatusEnum {
  APPROVED = 'approved',
  DECLINED = 'declined',
  IN_REVIEW = 'in_review',
  OCCUPIED = 'occupied',
}

export const { OCCUPIED } = PropertyStatusEnum;

export enum JobStatusEnum {
  PENDING = 'pending',
  APPROVED = 'approved',
  ACTIVE = 'active',
  DECLINED = 'declined',
  ONBOARD = 'onboard',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  DISPUTED = 'disputed',
}

export const { DISPUTED } = JobStatusEnum;

export enum OnboardStatusEnum {
  QUOTATION = 'quotation',
  AGREEMENT = 'agreement',
  ONBOARD = 'onboard',
  PENDING = 'pending',
  APPROVED = 'approved'
}

// export const { ONBOARD } = OnboardStatusEnum;

export enum ManageSubscriptionEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum ApplicationStatusEnum {
  APPLIED = 'applied',
  SHORTLISTED = 'shortlisted',
  DECLINED = 'declined',
  ACCEPTED = 'accepted',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export const { APPLIED, SHORTLISTED, ACCEPTED, CANCELLED, COMPLETED } =
  ApplicationStatusEnum;


export enum ApprovalStageEnum {
  QUOTE_REQUESTED = 'Quotation requested',
  QUOTE_RECEIVED = 'Quotation received',
  AGREEMENT_REQUESTED = 'Service agreement requested',
  AGREEMENT_RECEIVED = 'Service agreement received',
  ONBOARDED_REQUESTED = 'Onboarded request',
  ONBOARDED_RECIEVED = 'Onboarded received',
}

export const { QUOTE_REQUESTED, QUOTE_RECEIVED, AGREEMENT_REQUESTED, AGREEMENT_RECEIVED, ONBOARDED_REQUESTED, ONBOARDED_RECIEVED } =
  ApprovalStageEnum;


export enum RecurringTypeEnum {
  WEEKLY = 'weekly',
  FORTNIGHT = 'fortnight',
  TWENTYONEDAYS = 'twentyonedays',
  MONTHLY = 'monthly'
}

export enum ClientTypeNotiEnum {
  RISK_NOTIFICATION = 'riskNotification',
  GENERAL_NOTI = 'generalNotification',
  CARE_NOTES = 'careNotes',
}

export enum ClientGoalsEnum {
  IN_PROGRESS = 'in-progress',
  ACHEIVED = 'acheived',
}

export const { WEEKLY, FORTNIGHT, TWENTYONEDAYS, MONTHLY } =
  RecurringTypeEnum;

export enum jobLogCategoryEnum {
  DISPUTE = 'dispute',
  RATING = 'rating',
  INFO = 'info',
  REASON = 'reason',
  QUOTATION = 'quotation',
  AGREEMENT = 'agreement',
  ONBOARD = 'onboard',
  SHIFT = 'shift',

  // For ShortList Job
  SHORTLIST = "shortlist",
  APPLIED = "applied"
}

export const { RATING, INFO, REASON, } = jobLogCategoryEnum;

export enum shiftLogCategoryEnum {
  DISPUTE = 'dispute',
  RATING = 'rating',
  INFO = 'info',
  REASON = 'reason',
  QUOTATION = 'quotation',
  AGREEMENT = 'agreement',
  ONBOARD = 'onboard',
  SHIFT = 'shift',

  // For ShortList Job
  SHORTLIST = "shortlist",
  APPLIED = "applied"
}

export const {  } = shiftLogCategoryEnum;

export enum jobDisputeEnum {
  PENDING = 'pending',
  ONGOING = 'ongoing',
  RESOLVED = 'resolved',
}

// export const { ONGOING, PENDING, RESOLVED } = jobDisputeEnum

export enum connectStatusEnum {
  CONNECTED = 'connected',
  PENDING = 'pending',
}

export enum networkStatusEnum {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export enum discussionStatusEnum {
  APPROVED = 'approved',
  PENDING = 'pending',
  DECLINED = 'declined',
  AWAY = 'away',
}
export const { APPROVED } = discussionStatusEnum;

export enum genderEnum {
  FEMALE = 'female',
  MALE = 'male',
  OTHER = 'other',
}
export const { FEMALE, MALE, OTHER } = genderEnum;

export enum AudienceGenderEnum {
  FEMALE = 'female',
  MALE = 'male',
  ALL = 'all',
  OTHER = 'other',
}

export enum feedTypeEnum {
  POST = 'post',
  DISCUSSION = 'discussion',
}
export const { POST, DISCUSSION } = feedTypeEnum;

export enum CONTENT_TYPE_ENUM {
  POST = 'post',
  COMMENT = 'comment',
  THREAD = 'thread',
}

export const { COMMENT, THREAD } = CONTENT_TYPE_ENUM;

export enum SORT_BY {
  ASC = 'asc',
  DESC = 'desc',
}

export const { ASC, DESC } = SORT_BY;
export const RESOLVED = 'resolved';
export const ONGOING = 'ongoing';
export const CANCEL = 'cancel';
export const CONTRACTOR = 'contractor';
export const CREATOR = 'creator';

export const UNAUTHORIZED = 'unauthorized';
export const ONBOARD = 'onboard';

export const FORMVALIDATIONS = 'formValidations';
export const USER_NOT_FOUND = 'User not found';
export const SERVERERROR = 'An unknown error occured';
export const FREEUSERERROR = 'An unknown error occured';
export const TOP = 'top';
export const SUPER_ADMIN = 'superAdmin';
export const ADMIN = 'admin';
export const CONNECTED = 'connected';
export const DEFAULT_PROFILE_IMAGE_PATH =
  'https://ndisync-images.s3.ap-southeast-2.amazonaws.com/feed-1065-1726232189595.png';
export const DEFAULT_COVER_IMAGE_PATH =
  'https://ndisync-images.s3.ap-southeast-2.amazonaws.com/cover-8533-1726232047857.png';
export const ADMIN_LOGO =
  'https://ndisync-images.s3.ap-southeast-2.amazonaws.com/feed-4459-1726232231459.png';
export const ALERT_LOGO =
  'https://ndisync-images.s3.ap-southeast-2.amazonaws.com/profile-8798-1726231783704.png';
export const MAX_ACTIVE_SESSIONS = 4;
export const MAX_MOBILE_SESSIONS = 1;

export enum privacyEnum {
  ANYONE = 'anyone',
  MYCONNECTIONS = 'myConnections',
}

export const { ANYONE, MYCONNECTIONS } = privacyEnum;
export const EDITOR = 'editor';

export const ADMIN_ROLES = [SUPER_ADMIN, ADMIN, OPERATOR, EDITOR];

export enum ACTIVITY_CATEGORIES {
  POSTS = 'posts',
  PROFILE = 'profile',
  JOBS = 'jobs',
  CONNECTIONS = 'connections',
  SEARCH = 'search',
  SUBSCRIPTIONS = 'subscriptions',
  MESSAGES = 'messages',
  DISCUSSIONS = 'discussions',
  PROPERTY = 'property',
  NETWORK = 'network',
  COMPANY = 'company',
  QUOTATION = 'quotation',
  AGREEMENT = 'agreement',
  ONBOARD = 'onboard',
  SHIFT = 'shift',
  STAFF = 'staff',
}

export enum requestTypeEnum {
  RESCHEDULE = 'reschedule',
  COMPLETE = 'complete',
  QUOTATION = 'quotation',
  AGREEMENT = 'agreement',
  ONBOARD = 'onboard',
}

export const { RESCHEDULE, COMPLETE, QUOTATION, AGREEMENT } = requestTypeEnum;

export enum requestLogEnum {
  REQUESTED = 'requested',
  REJECTED = 'rejected',
  ACCEPTED = 'accepted',
}

export const { REQUESTED, REJECTED } = requestLogEnum;

export const {
  POSTS,
  PROFILE,
  JOBS,
  CONNECTIONS,
  SEARCH,
  SUBSCRIPTIONS,
  MESSAGES,
  DISCUSSIONS,
} = ACTIVITY_CATEGORIES;

export enum REPORT_STATUS_ENUM {
  PENDING = 'pending',
  RESOLVED = 'resolved',
}

export const SERVICES = 'services';
export const LINK = 'link';
export const RESET = 'reset';

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

export const TODAY = 'today';
export const YESTERDAY = 'yesterday';
export const THREE_DAYS = 'threedays';
export const SEVEN_DAYS = 'sevendays';
export const THIRTY_DAYS = 'thirtydays';

export enum roleCategoryEnum {
  COMPANY = 'company', ////company
  ALLIED_HEALTH_PROFESSIONAL = 'allied health professional', /////provider roless
  INDEPENDENT_SUPPORT_WORKER = 'independent support worker',
  PLAN_MANAGER = 'plan manager',
  SUPPORT_COORDINATOR = 'support coordinator', /////
  PLAN_MANAGED = 'plan managed', ////participant roles
  SELF_MANAGED = 'self managed',
  AGENCY_MANAGED = 'agency managed', ///
}

export const {
  ALLIED_HEALTH_PROFESSIONAL,
  INDEPENDENT_SUPPORT_WORKER,
  PLAN_MANAGER,
  SUPPORT_COORDINATOR,
  PLAN_MANAGED,
  SELF_MANAGED,
  AGENCY_MANAGED,
} = roleCategoryEnum;

export enum reactionEnum {
  LIKE = 'like',
  HEART = 'heart',
}
export const { LIKE, HEART } = reactionEnum;

export enum postStatusEnum {
  ACTIVE = 'active',
  REMOVED = 'removed',
  AWAY = 'away',
}

export enum companyStatusEnum {
  ACTIVE = 'active',
  PENDING = 'pending',
  DECLINED = 'declined',
  INACTIVE = 'inactive'
}

export enum assistanceTypeEnum {
  SIL = 'sil',
  SDA = 'sda',
}

export const { SIL, SDA } = assistanceTypeEnum;

export enum propertyTypeEnum {
  HOUSE = 'house',
  ROOM = 'room',
}

export const { HOUSE, ROOM } = propertyTypeEnum;

export enum REPORT_SUBJECT_ENUM {
  HARASSMENT = 'harassment',
  FRAUD_OR_SCAM = 'fraud or scam',
  SPAM = 'spam',
  MISINFORMATION = 'misinformation',
  HATEFUL_SPEECH = 'hateful speech',
  THREATS_OR_VIOLENCE = 'threats or violence',
  SELF_HARM = 'self-harm',
  GRAPHIC_CONTENT = 'graphic content',
  SEXUAL_CONTENT = 'sexual content',
  FAKE_ACCOUNT = 'fake account',
  HACKED_ACCOUNT = 'hacked account',
  CHILD_EXPLOITATION = 'child exploitation',
  ILLEGAL_SERVICES = 'illegal services',
  INFRINGEMENT = 'infringement',
}

export const {
  HARASSMENT,
  FRAUD_OR_SCAM,
  SPAM,
  MISINFORMATION,
  HATEFUL_SPEECH,
  THREATS_OR_VIOLENCE,
  SELF_HARM,
  GRAPHIC_CONTENT,
  SEXUAL_CONTENT,
  FAKE_ACCOUNT,
  HACKED_ACCOUNT,
  CHILD_EXPLOITATION,
  ILLEGAL_SERVICES,
  INFRINGEMENT,
} = REPORT_SUBJECT_ENUM;

export enum feedbackEnum {
  CUSTOMER_SERVICE = 'customer_service',
  LOW_QUALITY = 'low_quality',
  MISSING_FEATURES = 'missing_features',
  OTHER = 'other',
  SWICTHED_SERVICE = 'switched_service',
  TOO_COMPLEX = 'too_complex',
  TOO_EXPENSIVE = 'too_expensive',
  UNUSED = 'unused',
}
export enum FeedBackResponseEnum {
  customer_service = 'Customer Service was less than expected',
  low_quality = 'Quality was less than expected',
  missing_features = 'Some features are missing',
  other = 'Other reason',
  too_complex = 'Ease of use was less than expected',
  switched_service = "I'm switching to a different service",
  too_expensive = "It's too expensive",
  unused = "I don't use the service enough",
}

export const {
  CUSTOMER_SERVICE,
  LOW_QUALITY,
  MISSING_FEATURES,
  SWICTHED_SERVICE,
  TOO_COMPLEX,
  TOO_EXPENSIVE,
  UNUSED,
} = feedbackEnum;

export enum NOTIFICATION_TYPE_ENUM {
  NEW_MESSAGE = 'newMessage',
  ANNOUNCEMENTS = 'announcements',
  JOB_POSTING = 'jobPosting',
  JOB_STATUS_UPDATE = 'statusUpdate',
  CONNECTION_REQUESTS = 'connectionRequests',
  CONNECTION_ACCEPTANCE = 'connectionAcceptance',
  UPCOMING_APPOINTMENT = 'upcomingAppointment',
  CHANGED_APPOINTMENTS = 'changedAppointments',
  PROMOTIONS = 'promotions',
  FEATURE = 'feature',
  FEEDBACK_REQUESTS = 'feedbackRequests',
  RENEWAL = 'renewal',
  PAYMENT_TRANSACTIONS = 'paymentTransactions',
  NETWORK_REQUESTS = 'networkRequests',
  NETWORK_ACCEPTANCE = 'networkAcceptance',
  NETWORK_REJECTED = 'networkRejected',
  COMPANY_REQUEST = 'companyRequest',
  COMPANY_ACTIVE = 'companyActive',
  COMPANY_REJECTED = 'companyRejected',
  JOB_NETWORK_REMOVE = 'JobNetworkRemove',
  SHIFT = 'shift',
  INCIDENT_REPORT = 'incidentReport',
  SHIFT_NOTE = 'shiftNote',
}

export const {
  NEW_MESSAGE,
  ANNOUNCEMENTS,
  JOB_POSTING,
  JOB_STATUS_UPDATE,
  CONNECTION_REQUESTS,
  CONNECTION_ACCEPTANCE,
  NETWORK_REQUESTS,
  UPCOMING_APPOINTMENT,
  CHANGED_APPOINTMENTS,
  PROMOTIONS,
  FEATURE,
  FEEDBACK_REQUESTS,
  RENEWAL,
  PAYMENT_TRANSACTIONS,
  COMPANY_REQUEST,
  COMPANY_ACTIVE,
  COMPANY_REJECTED,
} = NOTIFICATION_TYPE_ENUM;

export enum NOTIFICATION_ROUTING_ENUM {
  VIEWER = 'profile-viewer',
  CHAT = 'chat',
  CONNECTION = 'profile',
  NEWS_FEED = 'news-feed',
  DISCUSSION = 'discussion',
  APPLICATION = 'job-application',
  DISPUTE = 'job-dispute',
  DISPUTE_POSTED_PENDING = 'posted-pending',
  DISPUTE_POSTED_ONGOING = 'posted-ongoing',
  DISPUTE_APPLIED_PENDING = 'applied-pending',
  DISPUTE_APPLIED_ONGOING = 'applied-ongoing',
  DISPUTE_POSTED_RESOLVED = 'posted-resolved',
  DISPUTE_APPLIED_RESOLVED = 'applied-resolved',
  JOB_DETAIL = 'job-detail',
  MY_JOB = 'my-job',
  PUBLIC_JOB = 'public-job',
  JOB_OPENED = 'job-opened',
  JOB_APPLIED = 'job-applied',
  JOB_DECLINED = 'job-declined',
  UNDER_REVIEW = 'job-in-review',
  PROPERTY_APPROVED = 'property_approved',
  PROPERTY_DECLINED = 'property_declined',
  ADS = 'ads',
  NETWORK = 'my_network',
  COMPANY_REQUEST = 'COMPANY_REQUEST',
  COMPANY_ACTIVE = 'COMPANY_ACTIVE',
  COMPANY_REJECTED = 'COMPANY_REJECTED',
  JOB_NETWORK_REMOVE = 'Job_Network_Remove',
  QUOTATION = 'quotation',
  COMPANY_LEAVE = 'company_leave',
  COORDINATION_HUB = 'coordination_hub',
  SHIFT = 'shift',
  PLAN_MANAGER_SHARED_JOB = 'plan_manager_shared_job'
}

export const {
  VIEWER,
  CHAT,
  CONNECTION,
  NEWS_FEED,
  APPLICATION,
  DISPUTE,
  JOB_DETAIL,
  JOB_OPENED,
  UNDER_REVIEW,
  NETWORK,
  PLAN_MANAGER_SHARED_JOB,
  SHIFT
} = NOTIFICATION_ROUTING_ENUM;

export const emailSub = {
  applicationAccepted: 'Application Accepted for Job Opportunity',
  applicationShortlisted:
    'Congratulations! Your Application has been Shortlisted',
  newApplications: 'New Job Application Received',
  jobPostCreated: 'Your Job Post Has Been Created',
  jobPostDeclined: 'Your Job Post Has Been Declined',
  jobPostApproved: 'Your Job Post Has Been Approved',
  termsAndConditions: 'Terms And Conditions',
  twoFactorAuthentication: 'Two Factor Authentication',
  resetPassword: 'Forget Password',
  reviewReceived: 'New Job Review',
  rescheduleRequestDeclined: 'Reschedule Request Declined',
  jobLogRequest: 'Request For Job Rescheduling',
  rescheduleRequestAccepted: 'Reschedule Request Accepted',
  sendVerificationLink: 'Verification',
  externalLink: 'External User',
  welcomeEmail: 'Welcome',
  followUpEmail: 'Follow Up Email',
  paymentConfirmation: 'Subscription Confirmation',
  subscriptionCancelled: 'Subscription Cancelled',
  renewalCancelled: 'Renewal Cancelled',
  contactForm: 'Contact Form',
  feedbackReceived: 'New Feedback Received',
  earlyBirdRegistration: 'Early Registration',
  newsLetterSubscription: 'NewsLetter Subscription',
  updateEmail: 'Change Email Request',
  shareJobEmail: "Invite For Job"
};

export const emailTemplates = {
  applicationAccepted: 'applicationAccepted',
  applicationShortlisted: 'applicationShortlisted',
  newApplications: 'newApplications',
  jobPostCreated: 'jobPostCreated',
  jobPostDeclined: 'jobPostDeclined',
  jobPostApproved: 'jobPostApproved',
  termsAndConditions: 'termsAndConditions',
  twoFactorAuthentication: 'twoFactorAuthentication',
  resetPassword: 'resetPassword',
  reviewReceived: 'reviewReceived',
  rescheduleRequestDeclined: 'rescheduleRequestDeclined',
  jobLogRequest: 'jobLogRequest',
  rescheduleRequestAccepted: 'rescheduleRequestAccepted',
  sendVerificationLink: 'sendVerificationLink',
  externalLink: 'externalLink',
  welcomeEmail: 'welcomeEmail',
  bulkEmail: 'bulkEmail',
  followUpEmail: 'followUpEmail',
  paymentConfirmation: 'paymentConfirmation',
  subscriptionCancelled: 'subscriptionCancelled',
  renewalCancelled: 'renewalCancelled',
  contactForm: 'contactForm',
  feedback: 'feedback',
  earlyBirdRegistration: 'earlyBirdRegistration',
  newsLetterSubscription: 'newsLetterSubscription',
  updateEmail: 'updateEmail',
  shareJobEmail: "inviteforJob"
};

export enum SOCKET_EVENTS {
  NOTIFICATION = 'notification',
  CONNECTION_UPDATE = 'connectionUpdate',
  NETWORK_UPDATE = 'networkUpdate',
  RECEIVE_MESSAGE = 'receiveMessage',
  NEW_CONVERSATION = 'newConversation',
  MESSAGE_RECEIVED = 'messageReceived',
  CONVERSATION = 'conversation',
  USER_STATUS = 'userStatus',
  ADMIN_STATS = 'adminStats',
  USER_UPDATE = 'userUpdate',
  NEW_REVIEW = 'newReview',
  NEW_CONNECTION = 'newConnection',
  NEW_NETWORK = 'newNetwork',
  CALL = 'call',
  PROFILE_PROMOTION = 'profile_promotion',
}

export const {
  NOTIFICATION,
  CONNECTION_UPDATE,
  RECEIVE_MESSAGE,
  NEW_CONVERSATION,
  NETWORK_UPDATE,
} = SOCKET_EVENTS;

export enum JOBACESSENUM {
  VIEW = 'view',
  EDITOR = 'editor',
  REMOVE = "remove"
}

export enum JOBACESSEUPDATENUM {
  VIEW = 'view',
  EDITOR = 'editor',
  REMOVE = "remove"
}

export enum adObjectiveEnum {
  CONNECTS = 'connects',
  VIEWS = 'views',
  ENQUIRY = 'enquiry',
  ENGAGEMENTS = 'engagements',
}

export enum promotionStatusEnum {
  ACTIVE = 'active',
  IN_REVIEW = 'in-review',
  COMPLETED = 'completed',
  PAUSED = 'paused',
  DECLINED = 'declined',
}

export const { IN_REVIEW, PAUSED } = promotionStatusEnum;
export const CALL = 'call';

export enum refTypeEnum {
  POST = 'post',
  PROFILE = 'profile',
  PROPERTY = 'property',
}
export const { PROPERTY } = refTypeEnum;

export const { VIEWS, ENQUIRY, CONNECTS, ENGAGEMENTS } = adObjectiveEnum;


export enum recurrenceEnum {
  WEEKLY = 'weekly',
  MONTHLY = 'monthly'
}


export enum repeatEveryEnum {
  ONE =  1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
  SIX = 6,
  SEVEN = 7
}


export enum shiftTypeEnum {
  ACTIVE = 'active',
  UPCOMING = 'upcoming',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  cancelled = 'cancelled'
}


export enum SocialStatusEnum {
  ACTIVE = 'active',
  REMOVED = 'removed',
}
export const { REMOVED } = SocialStatusEnum;

export const ALL = 'all';
export const MY = 'my';
export const SUCCESS = 'success';


export enum JobFrequencyTiming {
  OFF_ACTIVITY = 'Once-off activity',
  ON_GOINIG = 'Ongoing shift',
}
export const { OFF_ACTIVITY } = JobFrequencyTiming;

export enum HoursPerWeekEnum {
  ONE_TO_TEN = '1-10',
  TEN_TO_TWENTYFIVE = '10-25',
  WENTYFIVE_TO_FOURTY = '25-40',
  FOURTY = '40',
}
export const { ONE_TO_TEN } = HoursPerWeekEnum;

export enum RequireSupportEnum {
  FLEXSIBLE = 'flexible',
  DAYS_AND_TIME = 'Approximate days and timing',
}
export const { FLEXSIBLE } = RequireSupportEnum;

export enum JobTimeEnum {
  MORNING = 'Morning',
  AFTERNOON = 'Afternoon',
  EVENING = 'Evening',
}
export const { MORNING } = JobTimeEnum;

export enum FundingTypeENUM {
  INDIVIDUAL = "individual",
  GROUP = "group"
}

export enum FundingSourceENUM {
  INDIVIDUAL = "cash",
  NDIS = "nids",
  PLAN = "plan",
  SELF = "self"
}

export enum Privilege {
  // Self = "self",
  View = "view",
  Edit = "edit",
  ReadWrite = "read/write"
}

export enum Metrics {
  // driverLicenceC = "Driver Licence C",
  // driverLicenceLR = "Driver Licence L R",
  // driverLicencesInternational = "Driver Licence International",
  // visaDocumentation = "visa Documentation",
  // vechileRegistration = "Vechile Registration",
  // comprehensiveVechileInsurance = "Comprehensive Vechile Insurance",
  metric = "Metrics",
  compliances = "Compliances",
  educationAnd = "Education and Qualifications",
  extraTraning = "Extra Traning",
}

export enum JobDocsTypeEnum {
  Job_Related = "Job related",
  providerDocs = "Provider Document",

}

export enum DocumentTypes {
  document = "Document",
  certificate = "Certificates",
}