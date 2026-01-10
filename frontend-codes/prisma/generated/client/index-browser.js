
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  emailVerified: 'emailVerified',
  image: 'image',
  bio: 'bio',
  website: 'website',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  role: 'role',
  banned: 'banned',
  banReason: 'banReason',
  banExpires: 'banExpires'
};

exports.Prisma.SessionScalarFieldEnum = {
  id: 'id',
  expiresAt: 'expiresAt',
  token: 'token',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  userId: 'userId',
  impersonatedBy: 'impersonatedBy'
};

exports.Prisma.AccountScalarFieldEnum = {
  id: 'id',
  accountId: 'accountId',
  providerId: 'providerId',
  userId: 'userId',
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  idToken: 'idToken',
  accessTokenExpiresAt: 'accessTokenExpiresAt',
  refreshTokenExpiresAt: 'refreshTokenExpiresAt',
  scope: 'scope',
  password: 'password',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.VerificationScalarFieldEnum = {
  id: 'id',
  identifier: 'identifier',
  value: 'value',
  expiresAt: 'expiresAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CourseScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  fileKey: 'fileKey',
  price: 'price',
  originalPrice: 'originalPrice',
  registrationFee: 'registrationFee',
  duration: 'duration',
  level: 'level',
  category: 'category',
  shortdescription: 'shortdescription',
  slug: 'slug',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  userId: 'userId'
};

exports.Prisma.CourseReviewScalarFieldEnum = {
  id: 'id',
  rating: 'rating',
  comment: 'comment',
  userId: 'userId',
  courseId: 'courseId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ModuleScalarFieldEnum = {
  id: 'id',
  title: 'title',
  position: 'position',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  courseId: 'courseId'
};

exports.Prisma.LessonScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  thumbnailKey: 'thumbnailKey',
  videoKey: 'videoKey',
  position: 'position',
  type: 'type',
  content: 'content',
  duration: 'duration',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  moduleId: 'moduleId',
  documentKey: 'documentKey',
  quizConfig: 'quizConfig'
};

exports.Prisma.AttachmentScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  type: 'type',
  url: 'url',
  fileSize: 'fileSize',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  lessonId: 'lessonId'
};

exports.Prisma.EnrollmentScalarFieldEnum = {
  id: 'id',
  enrolledAt: 'enrolledAt',
  completedAt: 'completedAt',
  progress: 'progress',
  userId: 'userId',
  courseId: 'courseId',
  paymentReference: 'paymentReference',
  paymentStatus: 'paymentStatus',
  paymentAmount: 'paymentAmount',
  paidAt: 'paidAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  paymentId: 'paymentId'
};

exports.Prisma.LessonProgressScalarFieldEnum = {
  id: 'id',
  completed: 'completed',
  completedAt: 'completedAt',
  currentTime: 'currentTime',
  userId: 'userId',
  lessonId: 'lessonId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  score: 'score'
};

exports.Prisma.PaymentScalarFieldEnum = {
  id: 'id',
  reference: 'reference',
  amount: 'amount',
  currency: 'currency',
  status: 'status',
  paymentMethod: 'paymentMethod',
  metadata: 'metadata',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  userId: 'userId',
  courseId: 'courseId'
};

exports.Prisma.AchievementScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  icon: 'icon',
  category: 'category',
  points: 'points',
  rarity: 'rarity',
  isSecret: 'isSecret',
  steps: 'steps',
  maxProgress: 'maxProgress',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserAchievementScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  achievementId: 'achievementId',
  unlockedAt: 'unlockedAt',
  progress: 'progress',
  isUnlocked: 'isUnlocked'
};

exports.Prisma.WishlistScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  courseId: 'courseId',
  createdAt: 'createdAt'
};

exports.Prisma.EventScalarFieldEnum = {
  id: 'id',
  title: 'title',
  shortdescription: 'shortdescription',
  description: 'description',
  startdate: 'startdate',
  enddate: 'enddate',
  imageKey: 'imageKey',
  venue: 'venue',
  url: 'url',
  eventCategory: 'eventCategory',
  isOnline: 'isOnline',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  userId: 'userId'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.CourseLevel = exports.$Enums.CourseLevel = {
  Beginner: 'Beginner',
  Intermediate: 'Intermediate',
  Advanced: 'Advanced'
};

exports.CourseStatus = exports.$Enums.CourseStatus = {
  Draft: 'Draft',
  InReview: 'InReview',
  Published: 'Published',
  Archived: 'Archived'
};

exports.LessonType = exports.$Enums.LessonType = {
  Video: 'Video',
  Document: 'Document',
  Notebook: 'Notebook',
  Quiz: 'Quiz',
  Resource: 'Resource'
};

exports.PaymentStatus = exports.$Enums.PaymentStatus = {
  Pending: 'Pending',
  Completed: 'Completed',
  Failed: 'Failed',
  Refunded: 'Refunded'
};

exports.EventVenue = exports.$Enums.EventVenue = {
  NextHive: 'NextHive',
  GoogleMeet: 'GoogleMeet',
  Zoom: 'Zoom',
  MicrosoftTeams: 'MicrosoftTeams',
  Offline: 'Offline',
  Hybrid: 'Hybrid'
};

exports.EventCategory = exports.$Enums.EventCategory = {
  Hackathon: 'Hackathon',
  Webinar: 'Webinar',
  BrainstormingSession: 'BrainstormingSession',
  NetworkingEvent: 'NetworkingEvent',
  PanelDiscussion: 'PanelDiscussion',
  QandASession: 'QandASession',
  Workshop: 'Workshop',
  Meetup: 'Meetup',
  Tutorial: 'Tutorial',
  Lecture: 'Lecture',
  StudyGroup: 'StudyGroup',
  Roundtable: 'Roundtable',
  DemoDay: 'DemoDay',
  OfficeHours: 'OfficeHours',
  Competition: 'Competition',
  FiresideChat: 'FiresideChat',
  CertificationCourse: 'CertificationCourse',
  Bootcamp: 'Bootcamp'
};

exports.Prisma.ModelName = {
  User: 'User',
  Session: 'Session',
  Account: 'Account',
  Verification: 'Verification',
  Course: 'Course',
  CourseReview: 'CourseReview',
  Module: 'Module',
  Lesson: 'Lesson',
  Attachment: 'Attachment',
  Enrollment: 'Enrollment',
  LessonProgress: 'LessonProgress',
  Payment: 'Payment',
  Achievement: 'Achievement',
  UserAchievement: 'UserAchievement',
  Wishlist: 'Wishlist',
  Event: 'Event'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
