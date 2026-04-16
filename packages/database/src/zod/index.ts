import { z } from 'zod';
import { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// JSON
//------------------------------------------------------

export type NullableJsonInput = Prisma.JsonValue | null | 'JsonNull' | 'DbNull' | Prisma.NullTypes.DbNull | Prisma.NullTypes.JsonNull;

export const transformJsonNull = (v?: NullableJsonInput) => {
  if (!v || v === 'DbNull') return Prisma.NullTypes.DbNull;
  if (v === 'JsonNull') return Prisma.NullTypes.JsonNull;
  return v;
};

export const JsonValueSchema: z.ZodType<Prisma.JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.literal(null),
    z.record(z.string(), z.lazy(() => JsonValueSchema.optional())),
    z.array(z.lazy(() => JsonValueSchema)),
  ])
);

export type JsonValueType = z.infer<typeof JsonValueSchema>;

export const NullableJsonValue = z
  .union([JsonValueSchema, z.literal('DbNull'), z.literal('JsonNull')])
  .nullable()
  .transform((v) => transformJsonNull(v));

export type NullableJsonValueType = z.infer<typeof NullableJsonValue>;

export const InputJsonValueSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.object({ toJSON: z.any() }),
    z.record(z.string(), z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
    z.array(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
  ])
);

export type InputJsonValueType = z.infer<typeof InputJsonValueSchema>;


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','name','email','emailVerified','image','nickname','bio','profileImage','coverImage','instagramId','youtubeUrl','maxDifficulty','homeGymId','role','checkInAutoDurationMinutes','pushNotificationsEnabled','createdAt','updatedAt']);

export const UserPushDeviceScalarFieldEnumSchema = z.enum(['id','userId','expoPushToken','platform','createdAt','updatedAt']);

export const ApiErrorLogScalarFieldEnumSchema = z.enum(['id','createdAt','method','path','endpoint','errorLog','userId','httpStatus','clientMessage','errorName','traceId']);

export const AccountScalarFieldEnumSchema = z.enum(['id','userId','type','provider','providerAccountId','refresh_token','access_token','expires_at','token_type','scope','id_token','session_state']);

export const SessionScalarFieldEnumSchema = z.enum(['id','sessionToken','userId','expires']);

export const VerificationTokenScalarFieldEnumSchema = z.enum(['identifier','token','expires']);

export const FollowScalarFieldEnumSchema = z.enum(['id','followerId','followingId','createdAt']);

export const GymScalarFieldEnumSchema = z.enum(['id','name','address','region','phone','notice','congestion','visitorCount','visitorCapacity','latitude','longitude','description','website','settingScheduleMemo','coverImageUrl','logoImageUrl','difficultyImageUrl','instagramId','avgRating','reviewCount','createdAt','updatedAt','membershipBrand','isClosed','closedAt','closedReason','facilities']);

export const GymMembershipPlanScalarFieldEnumSchema = z.enum(['id','gymId','code','priceWon','sortOrder','isActive','createdAt','updatedAt']);

export const UserMembershipScalarFieldEnumSchema = z.enum(['id','userId','gymId','planId','startedAt','remainingUses','note','createdAt','updatedAt']);

export const MembershipPauseScalarFieldEnumSchema = z.enum(['id','userMembershipId','startDate','endDate','createdAt','updatedAt']);

export const GymCheckInScalarFieldEnumSchema = z.enum(['id','userId','gymId','startedAt','endsAt','endedAt']);

export const GymImageScalarFieldEnumSchema = z.enum(['id','gymId','url','order','createdAt']);

export const GymOpenHourScalarFieldEnumSchema = z.enum(['id','gymId','dayType','open','close']);

export const GymDifficultyColorScalarFieldEnumSchema = z.enum(['id','gymId','difficulty','color','label','order']);

export const GymBookmarkScalarFieldEnumSchema = z.enum(['id','userId','gymId','createdAt']);

export const GymReviewScalarFieldEnumSchema = z.enum(['id','userId','gymId','rating','content','perceivedDifficulty','features','createdAt','updatedAt','imageUrls']);

export const ClimbingSessionScalarFieldEnumSchema = z.enum(['id','userId','gymId','date','startTime','endTime','memo','isPublic','createdAt','updatedAt','imageUrls','userMembershipId','gymCheckInId']);

export const ClimbingRouteScalarFieldEnumSchema = z.enum(['id','sessionId','difficulty','result','attempts','perceivedDifficulty','memo','order','createdAt']);

export const PostScalarFieldEnumSchema = z.enum(['id','authorId','category','title','content','viewCount','likeCount','commentCount','createdAt','updatedAt','imageUrls','tags']);

export const PostLikeScalarFieldEnumSchema = z.enum(['id','postId','userId','createdAt']);

export const PostBookmarkScalarFieldEnumSchema = z.enum(['id','postId','userId','createdAt']);

export const PostCommentScalarFieldEnumSchema = z.enum(['id','postId','authorId','parentId','content','createdAt','updatedAt']);

export const NotificationScalarFieldEnumSchema = z.enum(['id','userId','type','title','message','isRead','link','commentId','createdAt']);

export const AdminAuditLogScalarFieldEnumSchema = z.enum(['id','actorId','action','targetType','targetId','targetLabel','before','after','note','requestMeta','createdAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const NullableJsonNullValueInputSchema: z.ZodType<Prisma.NullableJsonNullValueInput> = z.enum(['DbNull','JsonNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.DbNull : value);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const JsonNullValueFilterSchema: z.ZodType<Prisma.JsonNullValueFilter> = z.enum(['DbNull','JsonNull','AnyNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.DbNull : value === 'AnyNull' ? Prisma.AnyNull : value);

export const ProviderSchema = z.enum(['KAKAO','GOOGLE']);

export type ProviderType = `${z.infer<typeof ProviderSchema>}`

export const RoleSchema = z.enum(['ADMIN','MANAGER','GUEST']);

export type RoleType = `${z.infer<typeof RoleSchema>}`

export const RegionSchema = z.enum(['SEOUL','GYEONGGI','INCHEON','BUSAN']);

export type RegionType = `${z.infer<typeof RegionSchema>}`

export const DifficultySchema = z.enum(['V0','V1','V2','V3','V4','V5','V6','V7','V8','V9','V10']);

export type DifficultyType = `${z.infer<typeof DifficultySchema>}`

export const DayTypeSchema = z.enum(['MON','TUE','WED','THU','FRI','SAT','SUN']);

export type DayTypeType = `${z.infer<typeof DayTypeSchema>}`

export const GymFacilityTypeSchema = z.enum(['PARKING','SHOWER','LOCKER','REST_AREA','TRAINING']);

export type GymFacilityTypeType = `${z.infer<typeof GymFacilityTypeSchema>}`

export const GymReviewFeatureSchema = z.enum(['COOL_AIR','WIDE_STRETCH','VARIOUS_LEVEL','KIND_STAFF','EASY_PARKING','SHOWER_ROOM','CLEAN_FACILITY','GOOD_VENT']);

export type GymReviewFeatureType = `${z.infer<typeof GymReviewFeatureSchema>}`

export const GymPerceivedDifficultySchema = z.enum(['EASY','EASY_NORMAL','NORMAL','NORMAL_HARD','HARD']);

export type GymPerceivedDifficultyType = `${z.infer<typeof GymPerceivedDifficultySchema>}`

export const ClimbingAttemptResultSchema = z.enum(['SEND','ATTEMPT','FLASH','ONSIGHT']);

export type ClimbingAttemptResultType = `${z.infer<typeof ClimbingAttemptResultSchema>}`

export const PostCategorySchema = z.enum(['FREE','TIPS','REVIEW','MEETUP','GEAR']);

export type PostCategoryType = `${z.infer<typeof PostCategorySchema>}`

export const NotificationTypeSchema = z.enum(['COMMENT','POST_COMMENT','COMMENT_REPLY','LIKE','FOLLOW','SYSTEM','GYM_UPDATE','AUTO_CHECKOUT']);

export type NotificationTypeType = `${z.infer<typeof NotificationTypeSchema>}`

export const MembershipPlanCodeSchema = z.enum(['PERIOD_1M','PERIOD_3M','PERIOD_6M','PERIOD_12M','COUNT_DAY','COUNT_3','COUNT_5','COUNT_10']);

export type MembershipPlanCodeType = `${z.infer<typeof MembershipPlanCodeSchema>}`

export const GymMembershipBrandSchema = z.enum(['THE_CLIMB','SEOULFOREST','CLIMBINGPARK','SONCLIMB','PEAKERS','WAVEROCK','CLIMB_US','DAMJANG','B_BLOC','ALLEZ','STANDALONE']);

export type GymMembershipBrandType = `${z.infer<typeof GymMembershipBrandSchema>}`

export const PushPlatformSchema = z.enum(['ANDROID']);

export type PushPlatformType = `${z.infer<typeof PushPlatformSchema>}`

export const AdminAuditActionSchema = z.enum(['CREATE','UPDATE','DELETE','CLOSE','REOPEN','ROLE_CHANGE']);

export type AdminAuditActionType = `${z.infer<typeof AdminAuditActionSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

/**
 * 유저
 */
export const UserSchema = z.object({
  /**
   * 최고 난이도
   */
  maxDifficulty: DifficultySchema.nullable(),
  /**
   * 유저 권한
   */
  role: RoleSchema,
  /**
   * 유저 고유 ID
   */
  id: z.uuid(),
  /**
   * NextAuth OAuth 표시 이름
   */
  name: z.string().nullable(),
  /**
   * 이메일
   */
  email: z.string(),
  /**
   * 이메일 인증 시각 (NextAuth)
   */
  emailVerified: z.coerce.date().nullable(),
  /**
   * OAuth 프로필 이미지 URL (NextAuth)
   */
  image: z.string().nullable(),
  /**
   * 닉네임 (신규 가입 시 어댑터 생성 직후 `createUser` 이벤트에서 채움)
   */
  nickname: z.string(),
  /**
   * 자기소개
   */
  bio: z.string().nullable(),
  /**
   * 프로필 이미지 URL
   */
  profileImage: z.string().nullable(),
  /**
   * 커버 이미지 URL
   */
  coverImage: z.string().nullable(),
  /**
   * 인스타그램 아이디
   */
  instagramId: z.string().nullable(),
  /**
   * 유튜브 URL
   */
  youtubeUrl: z.string().nullable(),
  /**
   * 홈짐 ID
   */
  homeGymId: z.string().nullable(),
  /**
   * 체크인 후 자동 체크아웃까지 시간(분). 기본 240(4시간)
   */
  checkInAutoDurationMinutes: z.number().int(),
  /**
   * 푸시 알림 수신 허용 (서버 발송 기준)
   */
  pushNotificationsEnabled: z.boolean(),
  /**
   * 생성일
   */
  createdAt: z.coerce.date(),
  /**
   * 수정일
   */
  updatedAt: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// USER PUSH DEVICE SCHEMA
/////////////////////////////////////////

/**
 * 사용자별 Expo 푸시 토큰 (기기 단위)
 */
export const UserPushDeviceSchema = z.object({
  /**
   * 플랫폼
   */
  platform: PushPlatformSchema,
  /**
   * 레코드 ID
   */
  id: z.uuid(),
  /**
   * 유저 ID
   */
  userId: z.string(),
  /**
   * Expo Push Token (ExponentPushToken[...])
   */
  expoPushToken: z.string(),
  /**
   * 생성일
   */
  createdAt: z.coerce.date(),
  /**
   * 수정일
   */
  updatedAt: z.coerce.date(),
})

export type UserPushDevice = z.infer<typeof UserPushDeviceSchema>

/////////////////////////////////////////
// API ERROR LOG SCHEMA
/////////////////////////////////////////

/**
 * API Route Handler에서 catch된 오류 로그
 */
export const ApiErrorLogSchema = z.object({
  /**
   * 로그 ID
   */
  id: z.uuid(),
  /**
   * 발생 시각
   */
  createdAt: z.coerce.date(),
  /**
   * HTTP 메서드
   */
  method: z.string(),
  /**
   * URL pathname (쿼리 제외)
   */
  path: z.string(),
  /**
   * method + path 요약
   */
  endpoint: z.string(),
  /**
   * 메시지·스택 등 상세
   */
  errorLog: z.string(),
  /**
   * 로그인 유저 ID (비로그인 null)
   */
  userId: z.string().nullable(),
  /**
   * 클라이언트에 반환한 HTTP 상태
   */
  httpStatus: z.number().int().nullable(),
  /**
   * 클라이언트 토스트 문구
   */
  clientMessage: z.string().nullable(),
  /**
   * Error.name 등
   */
  errorName: z.string().nullable(),
  /**
   * x-trace-id / x-request-id 또는 생성 UUID
   */
  traceId: z.string().nullable(),
})

export type ApiErrorLog = z.infer<typeof ApiErrorLogSchema>

/////////////////////////////////////////
// ACCOUNT SCHEMA
/////////////////////////////////////////

/**
 * OAuth 계정 (NextAuth Prisma Adapter)
 */
export const AccountSchema = z.object({
  id: z.uuid(),
  userId: z.string(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().nullable(),
  access_token: z.string().nullable(),
  expires_at: z.number().int().nullable(),
  token_type: z.string().nullable(),
  scope: z.string().nullable(),
  id_token: z.string().nullable(),
  session_state: z.string().nullable(),
})

export type Account = z.infer<typeof AccountSchema>

/////////////////////////////////////////
// SESSION SCHEMA
/////////////////////////////////////////

/**
 * NextAuth DB 세션
 */
export const SessionSchema = z.object({
  id: z.uuid(),
  sessionToken: z.string(),
  userId: z.string(),
  expires: z.coerce.date(),
})

export type Session = z.infer<typeof SessionSchema>

/////////////////////////////////////////
// VERIFICATION TOKEN SCHEMA
/////////////////////////////////////////

/**
 * NextAuth 이메일 로그인 등 검증 토큰
 */
export const VerificationTokenSchema = z.object({
  identifier: z.string(),
  token: z.string(),
  expires: z.coerce.date(),
})

export type VerificationToken = z.infer<typeof VerificationTokenSchema>

/////////////////////////////////////////
// FOLLOW SCHEMA
/////////////////////////////////////////

/**
 * 팔로우 관계
 */
export const FollowSchema = z.object({
  /**
   * 팔로우 고유 ID
   */
  id: z.uuid(),
  /**
   * 팔로우하는 유저 ID
   */
  followerId: z.string(),
  /**
   * 팔로우 대상 유저 ID
   */
  followingId: z.string(),
  /**
   * 생성일
   */
  createdAt: z.coerce.date(),
})

export type Follow = z.infer<typeof FollowSchema>

/////////////////////////////////////////
// GYM SCHEMA
/////////////////////////////////////////

/**
 * 암장
 */
export const GymSchema = z.object({
  /**
   * 지역
   */
  region: RegionSchema,
  /**
   * 회원권 브랜드(체인). STANDALONE은 구매 지점과 세션 지점이 같아야 함
   */
  membershipBrand: GymMembershipBrandSchema,
  /**
   * 시설 목록
   */
  facilities: GymFacilityTypeSchema.array(),
  /**
   * 암장 고유 ID
   */
  id: z.uuid(),
  /**
   * 암장 이름
   */
  name: z.string(),
  /**
   * 주소
   */
  address: z.string(),
  /**
   * 전화번호
   */
  phone: z.string(),
  /**
   * 영업시간 공지 (예: "명절 당일 휴무")
   */
  notice: z.string().nullable(),
  /**
   * 현재 혼잡도 (0~100)
   */
  congestion: z.number().int(),
  /**
   * 현재 추정 이용 인원 (실시간 표시용)
   */
  visitorCount: z.number().int(),
  /**
   * 수용 인원 (혼잡도 카드 분모)
   */
  visitorCapacity: z.number().int(),
  /**
   * 위도
   */
  latitude: z.number(),
  /**
   * 경도
   */
  longitude: z.number(),
  /**
   * 설명
   */
  description: z.string(),
  /**
   * 웹사이트 URL
   */
  website: z.string().nullable(),
  /**
   * 세팅 주기·일정 안내 자유 텍스트 (예: "매주 월·목 세팅", "격주 화요일")
   */
  settingScheduleMemo: z.string().nullable(),
  /**
   * 목록·히어로용 커버 이미지 URL
   */
  coverImageUrl: z.string(),
  /**
   * 로고 이미지 URL
   */
  logoImageUrl: z.string(),
  /**
   * 난이도표 이미지 URL (체인 기본값·지점별 오버라이드)
   */
  difficultyImageUrl: z.string().nullable(),
  /**
   * 인스타그램 아이디
   */
  instagramId: z.string().nullable(),
  /**
   * 평균 평점
   */
  avgRating: z.number(),
  /**
   * 리뷰 수
   */
  reviewCount: z.number().int(),
  /**
   * 생성일
   */
  createdAt: z.coerce.date(),
  /**
   * 수정일
   */
  updatedAt: z.coerce.date(),
  /**
   * 폐업 여부 (소프트 상태). true 이면 쓰기(체크인/리뷰/세션) 차단, 조회는 허용
   */
  isClosed: z.boolean(),
  /**
   * 폐업 처리 시각 (null이면 운영 중)
   */
  closedAt: z.coerce.date().nullable(),
  /**
   * 폐업 사유 (관리자 메모)
   */
  closedReason: z.string().nullable(),
})

export type Gym = z.infer<typeof GymSchema>

/////////////////////////////////////////
// GYM MEMBERSHIP PLAN SCHEMA
/////////////////////////////////////////

/**
 * 암장별 회원권 요금표 템플릿
 */
export const GymMembershipPlanSchema = z.object({
  /**
   * 상품 코드
   */
  code: MembershipPlanCodeSchema,
  /**
   * 요금표 행 ID
   */
  id: z.uuid(),
  /**
   * 암장 ID
   */
  gymId: z.string(),
  /**
   * 가격(원)
   */
  priceWon: z.number().int(),
  /**
   * 표시 순서
   */
  sortOrder: z.number().int(),
  /**
   * 노출 여부
   */
  isActive: z.boolean(),
  /**
   * 생성일
   */
  createdAt: z.coerce.date(),
  /**
   * 수정일
   */
  updatedAt: z.coerce.date(),
})

export type GymMembershipPlan = z.infer<typeof GymMembershipPlanSchema>

/////////////////////////////////////////
// USER MEMBERSHIP SCHEMA
/////////////////////////////////////////

/**
 * 유저 보유 회원권
 */
export const UserMembershipSchema = z.object({
  /**
   * 보유 회원권 ID
   */
  id: z.uuid(),
  /**
   * 유저 ID
   */
  userId: z.string(),
  /**
   * 암장 ID
   */
  gymId: z.string(),
  /**
   * 요금표(플랜) ID
   */
  planId: z.string(),
  /**
   * 시작일 (서울 기준 해당일 00:00:00 UTC 등 고정 규칙으로 저장)
   */
  startedAt: z.coerce.date(),
  /**
   * 횟수권 잔여 (정기권은 null)
   */
  remainingUses: z.number().int().nullable(),
  /**
   * 메모
   */
  note: z.string().nullable(),
  /**
   * 생성일
   */
  createdAt: z.coerce.date(),
  /**
   * 수정일
   */
  updatedAt: z.coerce.date(),
})

export type UserMembership = z.infer<typeof UserMembershipSchema>

/////////////////////////////////////////
// MEMBERSHIP PAUSE SCHEMA
/////////////////////////////////////////

/**
 * 회원권 일시정지 (일 단위, 시작~종료일 포함)
 */
export const MembershipPauseSchema = z.object({
  /**
   * 일시정지 ID
   */
  id: z.uuid(),
  /**
   * 보유 회원권 ID
   */
  userMembershipId: z.string(),
  /**
   * 시작일
   */
  startDate: z.coerce.date(),
  /**
   * 종료일 (시작일과 같을 수 있음, 양끝 포함)
   */
  endDate: z.coerce.date(),
  /**
   * 생성일
   */
  createdAt: z.coerce.date(),
  /**
   * 수정일
   */
  updatedAt: z.coerce.date(),
})

export type MembershipPause = z.infer<typeof MembershipPauseSchema>

/////////////////////////////////////////
// GYM CHECK IN SCHEMA
/////////////////////////////////////////

/**
 * 암장 체크인 (자동 체크아웃: endsAt 경과 시 비활성)
 */
export const GymCheckInSchema = z.object({
  /**
   * 체크인 고유 ID
   */
  id: z.uuid(),
  /**
   * 유저 ID
   */
  userId: z.string(),
  /**
   * 암장 ID
   */
  gymId: z.string(),
  /**
   * 체크인 시각
   */
  startedAt: z.coerce.date(),
  /**
   * 자동 체크아웃 예정 시각
   */
  endsAt: z.coerce.date(),
  /**
   * 수동 체크아웃 또는 정리 시각 (null이면 아직 활성 후보)
   */
  endedAt: z.coerce.date().nullable(),
})

export type GymCheckIn = z.infer<typeof GymCheckInSchema>

/////////////////////////////////////////
// GYM IMAGE SCHEMA
/////////////////////////////////////////

/**
 * 암장 이미지
 */
export const GymImageSchema = z.object({
  /**
   * 이미지 고유 ID
   */
  id: z.uuid(),
  /**
   * 암장 ID
   */
  gymId: z.string(),
  /**
   * 이미지 URL
   */
  url: z.string(),
  /**
   * 순서
   */
  order: z.number().int(),
  /**
   * 생성일
   */
  createdAt: z.coerce.date(),
})

export type GymImage = z.infer<typeof GymImageSchema>

/////////////////////////////////////////
// GYM OPEN HOUR SCHEMA
/////////////////////////////////////////

/**
 * 암장 영업시간
 */
export const GymOpenHourSchema = z.object({
  /**
   * 요일
   */
  dayType: DayTypeSchema,
  /**
   * 고유 ID
   */
  id: z.uuid(),
  /**
   * 암장 ID
   */
  gymId: z.string(),
  /**
   * 오픈 시간 "HH:mm"
   */
  open: z.string(),
  /**
   * 마감 시간 "HH:mm"
   */
  close: z.string(),
})

export type GymOpenHour = z.infer<typeof GymOpenHourSchema>

/////////////////////////////////////////
// GYM DIFFICULTY COLOR SCHEMA
/////////////////////////////////////////

/**
 * 암장별 난이도 색상 매핑
 */
export const GymDifficultyColorSchema = z.object({
  /**
   * 난이도
   */
  difficulty: DifficultySchema,
  /**
   * 고유 ID
   */
  id: z.uuid(),
  /**
   * 암장 ID
   */
  gymId: z.string(),
  /**
   * HEX 색상 코드 (예: "#E05555")
   */
  color: z.string(),
  /**
   * 암장 자체 명칭 (예: "빨강", "레드")
   */
  label: z.string(),
  /**
   * 표시 순서
   */
  order: z.number().int(),
})

export type GymDifficultyColor = z.infer<typeof GymDifficultyColorSchema>

/////////////////////////////////////////
// GYM BOOKMARK SCHEMA
/////////////////////////////////////////

/**
 * 즐겨찾는 암장
 */
export const GymBookmarkSchema = z.object({
  /**
   * 고유 ID
   */
  id: z.uuid(),
  /**
   * 유저 ID
   */
  userId: z.string(),
  /**
   * 암장 ID
   */
  gymId: z.string(),
  /**
   * 생성일
   */
  createdAt: z.coerce.date(),
})

export type GymBookmark = z.infer<typeof GymBookmarkSchema>

/////////////////////////////////////////
// GYM REVIEW SCHEMA
/////////////////////////////////////////

/**
 * 암장 리뷰
 */
export const GymReviewSchema = z.object({
  /**
   * 체감 난이도
   */
  perceivedDifficulty: GymPerceivedDifficultySchema.nullable(),
  /**
   * 리뷰 특징 (enum 배열)
   */
  features: GymReviewFeatureSchema.array(),
  /**
   * 리뷰 고유 ID
   */
  id: z.uuid(),
  /**
   * 유저 ID
   */
  userId: z.string(),
  /**
   * 암장 ID
   */
  gymId: z.string(),
  /**
   * 평점 (1~5)
   */
  rating: z.number().int(),
  /**
   * 리뷰 내용
   */
  content: z.string(),
  /**
   * 생성일
   */
  createdAt: z.coerce.date(),
  /**
   * 수정일
   */
  updatedAt: z.coerce.date(),
  /**
   * 이미지 URL 목록
   */
  imageUrls: z.string().array(),
})

export type GymReview = z.infer<typeof GymReviewSchema>

/////////////////////////////////////////
// CLIMBING SESSION SCHEMA
/////////////////////////////////////////

/**
 * 클라이밍 세션
 */
export const ClimbingSessionSchema = z.object({
  /**
   * 세션 고유 ID
   */
  id: z.uuid(),
  /**
   * 유저 ID
   */
  userId: z.string(),
  /**
   * 암장 ID
   */
  gymId: z.string(),
  /**
   * 세션 날짜
   */
  date: z.coerce.date(),
  /**
   * 시작 시간
   */
  startTime: z.coerce.date().nullable(),
  /**
   * 종료 시간
   */
  endTime: z.coerce.date().nullable(),
  /**
   * 메모
   */
  memo: z.string().nullable(),
  /**
   * 공개 여부
   */
  isPublic: z.boolean(),
  /**
   * 생성일
   */
  createdAt: z.coerce.date(),
  /**
   * 수정일
   */
  updatedAt: z.coerce.date(),
  /**
   * 세션 이미지 URL 목록
   */
  imageUrls: z.string().array(),
  /**
   * 연결 회원권 (선택)
   */
  userMembershipId: z.string().nullable(),
  /**
   * 연결된 암장 체크인 (동일 체크인에 세션 1건)
   */
  gymCheckInId: z.string().nullable(),
})

export type ClimbingSession = z.infer<typeof ClimbingSessionSchema>

/////////////////////////////////////////
// CLIMBING ROUTE SCHEMA
/////////////////////////////////////////

/**
 * 클라이밍 루트 기록
 */
export const ClimbingRouteSchema = z.object({
  /**
   * 난이도
   */
  difficulty: DifficultySchema,
  /**
   * 시도 결과
   */
  result: ClimbingAttemptResultSchema,
  /**
   * 체감 난이도
   */
  perceivedDifficulty: GymPerceivedDifficultySchema.nullable(),
  /**
   * 루트 고유 ID
   */
  id: z.uuid(),
  /**
   * 세션 ID
   */
  sessionId: z.string(),
  /**
   * 시도 횟수
   */
  attempts: z.number().int(),
  /**
   * 메모
   */
  memo: z.string().nullable(),
  /**
   * 순서
   */
  order: z.number().int(),
  /**
   * 생성일
   */
  createdAt: z.coerce.date(),
})

export type ClimbingRoute = z.infer<typeof ClimbingRouteSchema>

/////////////////////////////////////////
// POST SCHEMA
/////////////////////////////////////////

/**
 * 커뮤니티 게시글
 */
export const PostSchema = z.object({
  /**
   * 카테고리
   */
  category: PostCategorySchema,
  /**
   * 게시글 고유 ID
   */
  id: z.uuid(),
  /**
   * 작성자 ID
   */
  authorId: z.string(),
  /**
   * 제목
   */
  title: z.string(),
  /**
   * 본문
   */
  content: z.string(),
  /**
   * 조회수
   */
  viewCount: z.number().int(),
  /**
   * 좋아요 수
   */
  likeCount: z.number().int(),
  /**
   * 댓글 수
   */
  commentCount: z.number().int(),
  /**
   * 생성일
   */
  createdAt: z.coerce.date(),
  /**
   * 수정일
   */
  updatedAt: z.coerce.date(),
  /**
   * 이미지 URL 목록
   */
  imageUrls: z.string().array(),
  /**
   * 태그 목록
   */
  tags: z.string().array(),
})

export type Post = z.infer<typeof PostSchema>

/////////////////////////////////////////
// POST LIKE SCHEMA
/////////////////////////////////////////

/**
 * 게시글 좋아요
 */
export const PostLikeSchema = z.object({
  /**
   * 좋아요 고유 ID
   */
  id: z.uuid(),
  /**
   * 게시글 ID
   */
  postId: z.string(),
  /**
   * 유저 ID
   */
  userId: z.string(),
  /**
   * 생성일
   */
  createdAt: z.coerce.date(),
})

export type PostLike = z.infer<typeof PostLikeSchema>

/////////////////////////////////////////
// POST BOOKMARK SCHEMA
/////////////////////////////////////////

/**
 * 게시글 북마크
 */
export const PostBookmarkSchema = z.object({
  /**
   * 북마크 고유 ID
   */
  id: z.uuid(),
  /**
   * 게시글 ID
   */
  postId: z.string(),
  /**
   * 유저 ID
   */
  userId: z.string(),
  /**
   * 생성일
   */
  createdAt: z.coerce.date(),
})

export type PostBookmark = z.infer<typeof PostBookmarkSchema>

/////////////////////////////////////////
// POST COMMENT SCHEMA
/////////////////////////////////////////

/**
 * 게시글 댓글
 */
export const PostCommentSchema = z.object({
  /**
   * 댓글 고유 ID
   */
  id: z.uuid(),
  /**
   * 게시글 ID
   */
  postId: z.string(),
  /**
   * 작성자 ID
   */
  authorId: z.string(),
  /**
   * 부모 댓글 ID (대댓글)
   */
  parentId: z.string().nullable(),
  /**
   * 댓글 내용
   */
  content: z.string(),
  /**
   * 생성일
   */
  createdAt: z.coerce.date(),
  /**
   * 수정일
   */
  updatedAt: z.coerce.date(),
})

export type PostComment = z.infer<typeof PostCommentSchema>

/////////////////////////////////////////
// NOTIFICATION SCHEMA
/////////////////////////////////////////

/**
 * 알림
 */
export const NotificationSchema = z.object({
  /**
   * 알림 타입
   */
  type: NotificationTypeSchema,
  /**
   * 알림 고유 ID
   */
  id: z.uuid(),
  /**
   * 수신자 ID
   */
  userId: z.string(),
  /**
   * 알림 제목
   */
  title: z.string(),
  /**
   * 알림 내용
   */
  message: z.string(),
  /**
   * 읽음 여부
   */
  isRead: z.boolean(),
  /**
   * 관련 링크
   */
  link: z.string().nullable(),
  /**
   * 연관 댓글 (POST_COMMENT / COMMENT_REPLY — 댓글 삭제 시 알림도 삭제)
   */
  commentId: z.string().nullable(),
  /**
   * 생성일
   */
  createdAt: z.coerce.date(),
})

export type Notification = z.infer<typeof NotificationSchema>

/////////////////////////////////////////
// ADMIN AUDIT LOG SCHEMA
/////////////////////////////////////////

/**
 * 어드민 변경 감사 로그 — 모든 어드민 mutation 은 트랜잭션 내부에서 이 로그와 함께 기록
 */
export const AdminAuditLogSchema = z.object({
  /**
   * 액션
   */
  action: AdminAuditActionSchema,
  /**
   * 로그 ID
   */
  id: z.uuid(),
  /**
   * 수행 어드민 ID
   */
  actorId: z.string(),
  /**
   * 대상 엔티티명 (예: "Gym", "User", "Post")
   */
  targetType: z.string(),
  /**
   * 대상 레코드 ID (UUID 아닐 수도 있어 String)
   */
  targetId: z.string(),
  /**
   * 대상 요약 라벨 (예: 암장 이름, 유저 닉네임)
   */
  targetLabel: z.string().nullable(),
  /**
   * 변경 전 값 (CREATE 시 null)
   */
  before: JsonValueSchema.nullable(),
  /**
   * 변경 후 값 (DELETE 시 null)
   */
  after: JsonValueSchema.nullable(),
  /**
   * 자유 메모 (관리자 입력 가능, 폐업 사유 등)
   */
  note: z.string().nullable(),
  /**
   * 요청 메타 (user-agent, ip, traceId 등)
   */
  requestMeta: JsonValueSchema.nullable(),
  /**
   * 생성일
   */
  createdAt: z.coerce.date(),
})

export type AdminAuditLog = z.infer<typeof AdminAuditLogSchema>
