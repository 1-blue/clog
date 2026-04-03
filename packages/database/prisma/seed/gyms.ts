import type {
  DayType,
  Gym,
  GymFacilityType,
  GymMembershipBrand,
  MembershipPlanCode,
  PrismaClient,
} from "@prisma/client";

interface IGymSeed {
  key: string;
  name: string;
  address: string;
  region: string;
  phone: string;
  latitude: number;
  longitude: number;
  visitorCapacity: number;
  description: string;
  website?: string;
  instagramId?: string;
  thumbnailUrl?: string;
  priceImageUrl?: string;
  /** 시드용 구 가격표 → GymMembershipPlan 행으로 변환 */
  legacyPrices: {
    daily: number;
    monthly: number;
    threeMonths: number;
    tenSession: number;
    /** 6개월 정기권 — 없으면 PERIOD_6M 행을 만들지 않음 */
    sixMonths?: number;
    /** 12개월 정기권 — 없으면 PERIOD_12M 행을 만들지 않음 */
    twelveMonths?: number;
  };
  facilities: GymFacilityType[];
  notice?: string;
}

interface IOpenHourSeed {
  dayType: DayType;
  open: string;
  close: string;
}

const GYMS_DATA: IGymSeed[] = [
  {
    key: "theclimb_yeonnam",
    name: "더클라임 연남점",
    address: "서울 마포구 양화로 186 LC타워 3층",
    region: "SEOUL",
    phone: "02-2088-5071",
    latitude: 37.5576684824211,
    longitude: 126.92589313527,
    visitorCapacity: 60,
    description:
      "홍대입구역 4·8번 출구 도보 3분\n3개 섹터(툇마루·연남·신촌)\n\n더클라임 13개 지점 통합 회원권",
    website: "http://theclimb.co.kr",
    instagramId: "theclimb_yeonnam",
    thumbnailUrl:
      "https://climbing-log.s3.ap-northeast-2.amazonaws.com/seed/%E1%84%83%E1%85%A5%E1%84%8F%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%86%B7_%E1%84%8B%E1%85%A7%E1%86%AB%E1%84%82%E1%85%A1%E1%86%B7.jpeg",
    priceImageUrl:
      "https://climbing-log.s3.ap-northeast-2.amazonaws.com/seed/%E1%84%83%E1%85%A5%E1%84%8F%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%86%B7_%E1%84%80%E1%85%A1%E1%84%80%E1%85%A7%E1%86%A8%E1%84%91%E1%85%AD.png",
    legacyPrices: {
      daily: 22000,
      monthly: 140000,
      threeMonths: 330000,
      tenSession: 170000,
    },
    facilities: ["SHOWER", "LOCKER", "REST_AREA", "TRAINING"],
  },
  {
    key: "theclimb_b_hongdae",
    name: "더클라임 홍대B점",
    address: "서울 마포구 양화로 125 경남관광빌딩 B동",
    region: "SEOUL",
    phone: "02-332-5014",
    latitude: 37.5547493986687,
    longitude: 126.920309389675,
    visitorCapacity: 60,
    description:
      "홍대입구역 1번 출구 도보 5분\n합정역 2번 출구 도보 7분\n\n경남관광빌딩 스타벅스 리저브 건물 2층\n\n더클라임 13개 지점 통합 회원권",
    website: "http://theclimb.co.kr",
    instagramId: "theclimb_b_hongdae",
    thumbnailUrl:
      "https://climbing-log.s3.ap-northeast-2.amazonaws.com/seed/%E1%84%83%E1%85%A5%E1%84%8F%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%86%B7_%E1%84%92%E1%85%A9%E1%86%BC%E1%84%83%E1%85%A2B.jpeg",
    priceImageUrl:
      "https://climbing-log.s3.ap-northeast-2.amazonaws.com/seed/%E1%84%83%E1%85%A5%E1%84%8F%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%86%B7_%E1%84%80%E1%85%A1%E1%84%80%E1%85%A7%E1%86%A8%E1%84%91%E1%85%AD.pngg",
    legacyPrices: {
      daily: 22000,
      monthly: 140000,
      threeMonths: 330000,
      tenSession: 170000,
    },
    facilities: ["SHOWER", "LOCKER", "REST_AREA", "TRAINING"],
  },
  {
    key: "theclimb_ilsan",
    name: "더클라임 일산점",
    address: "경기 고양시 일산동구 중앙로 1160 5층 더클라임",
    region: "GYEONGGI",
    phone: "031-905-5014",
    latitude: 37.6509174810735,
    longitude: 126.778893109192,
    visitorCapacity: 80,
    description: "더클라임 13개 지점 통합 회원권",
    website: "http://theclimb.co.kr",
    instagramId: "theclimb_ilsan",
    thumbnailUrl:
      "https://climbing-log.s3.ap-northeast-2.amazonaws.com/seed/%E1%84%83%E1%85%A5%E1%84%8F%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%86%B7_%E1%84%8B%E1%85%B5%E1%86%AF%E1%84%89%E1%85%A1%E1%86%AB.jpeg",
    priceImageUrl:
      "https://climbing-log.s3.ap-northeast-2.amazonaws.com/seed/%E1%84%83%E1%85%A5%E1%84%8F%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%86%B7_%E1%84%80%E1%85%A1%E1%84%80%E1%85%A7%E1%86%A8%E1%84%91%E1%85%AD.png",
    legacyPrices: {
      daily: 22000,
      monthly: 140000,
      threeMonths: 330000,
      tenSession: 170000,
    },
    facilities: ["PARKING", "SHOWER", "LOCKER", "REST_AREA", "TRAINING"],
  },
  {
    key: "theclimb_magok",
    name: "더클라임 마곡점",
    address: "서울 강서구 마곡동로 62 마곡사이언스타워 7층",
    region: "SEOUL",
    phone: "02-2668-5014",
    latitude: 37.5605537644679,
    longitude: 126.833890184435,
    visitorCapacity: 60,
    description:
      "5호선 발산역 9번 출구에서 도보 5분\n5호선 마곡역 2번 출구에서 도보 10분\n9호선 마곡나루역 2번 출구에서 도보 15분\n버스 정류장 발산역 16-017에서 도보 5분\n\n더클라임 13개 지점 통합 회원권",
    website: "http://theclimb.co.kr",
    instagramId: "theclimb_magok",
    thumbnailUrl:
      "https://climbing-log.s3.ap-northeast-2.amazonaws.com/seed/%E1%84%83%E1%85%A5%E1%84%8F%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%86%B7_%E1%84%86%E1%85%A1%E1%84%80%E1%85%A9%E1%86%A8.jpeg",
    priceImageUrl:
      "https://climbing-log.s3.ap-northeast-2.amazonaws.com/seed/%E1%84%83%E1%85%A5%E1%84%8F%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%86%B7_%E1%84%80%E1%85%A1%E1%84%80%E1%85%A7%E1%86%A8%E1%84%91%E1%85%AD.png",
    legacyPrices: {
      daily: 22000,
      monthly: 140000,
      threeMonths: 330000,
      tenSession: 170000,
    },
    facilities: ["PARKING", "SHOWER", "LOCKER", "REST_AREA", "TRAINING"],
  },
  {
    key: "theclimb_yangjae",
    name: "더클라임 양재점",
    address: "서울 강남구 남부순환로 2615 지하1층",
    region: "SEOUL",
    phone: "02-576-8821",
    latitude: 37.4851852937745,
    longitude: 127.035883711966,
    visitorCapacity: 80,
    description:
      "3호선 양재역 4번 출구에서 직진 (도보 2분 거리)\n\n더클라임 13개 지점 통합 회원권",
    website: "http://theclimb.co.kr",
    instagramId: "theclimb_yangjae",
    thumbnailUrl:
      "https://climbing-log.s3.ap-northeast-2.amazonaws.com/seed/%E1%84%83%E1%85%A5%E1%84%8F%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%86%B7_%E1%84%8B%E1%85%A3%E1%86%BC%E1%84%8C%E1%85%A2.jpeg",
    priceImageUrl:
      "https://climbing-log.s3.ap-northeast-2.amazonaws.com/seed/%E1%84%83%E1%85%A5%E1%84%8F%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%86%B7_%E1%84%80%E1%85%A1%E1%84%80%E1%85%A7%E1%86%A8%E1%84%91%E1%85%AD.png",
    legacyPrices: {
      daily: 22000,
      monthly: 140000,
      threeMonths: 330000,
      tenSession: 170000,
    },
    facilities: ["PARKING", "SHOWER", "LOCKER", "REST_AREA", "TRAINING"],
  },
  {
    key: "theclimb_sillim",
    name: "더클라임 신림점",
    address: "서울 관악구 신원로 35 삼모더프라임타워 5층",
    region: "SEOUL",
    phone: "02-877-8821",
    latitude: 37.4823122359729,
    longitude: 126.929023376476,
    visitorCapacity: 70,
    description:
      "신림역 2호선 3번 출구 3분 거리\n\n더클라임 13개 지점 통합 회원권",
    website: "http://theclimb.co.kr",
    instagramId: "theclimb_sillim",
    thumbnailUrl:
      "https://climbing-log.s3.ap-northeast-2.amazonaws.com/seed/%E1%84%83%E1%85%A5%E1%84%8F%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%86%B7_%E1%84%89%E1%85%B5%E1%86%AB%E1%84%85%E1%85%B5%E1%86%B7.jpeg",
    priceImageUrl:
      "https://climbing-log.s3.ap-northeast-2.amazonaws.com/seed/%E1%84%83%E1%85%A5%E1%84%8F%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%86%B7_%E1%84%80%E1%85%A1%E1%84%80%E1%85%A7%E1%86%A8%E1%84%91%E1%85%AD.png",
    legacyPrices: {
      daily: 22000,
      monthly: 140000,
      threeMonths: 330000,
      tenSession: 170000,
    },
    facilities: ["SHOWER", "LOCKER", "REST_AREA", "TRAINING"],
  },
  {
    key: "theclimb_gangnam",
    name: "더클라임 강남점",
    address: "서울 강남구 테헤란로8길 21 화인강남빌딩 B1층",
    region: "SEOUL",
    phone: "02-566-8821",
    latitude: 37.4975931910405,
    longitude: 127.032001186611,
    visitorCapacity: 60,
    description:
      "찾아가는길\n강남역 1,2,3번출구 5분거리에 위치해있습니다.\n주차 : 건물 내 지하 주차장 주차 가능 30분 할인권 적용 가능(이후 10분당 1,000원)\n\n더클라임 13개 지점 통합 회원권",
    website: "http://theclimb.co.kr",
    instagramId: "theclimb_gangnam",
    thumbnailUrl:
      "https://climbing-log.s3.ap-northeast-2.amazonaws.com/seed/%E1%84%83%E1%85%A5%E1%84%8F%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%86%B7_%E1%84%80%E1%85%A1%E1%86%BC%E1%84%82%E1%85%A1%E1%86%B7.jpeg",
    priceImageUrl:
      "https://climbing-log.s3.ap-northeast-2.amazonaws.com/seed/%E1%84%83%E1%85%A5%E1%84%8F%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%86%B7_%E1%84%80%E1%85%A1%E1%84%80%E1%85%A7%E1%86%A8%E1%84%91%E1%85%AD.png",
    legacyPrices: {
      daily: 22000,
      monthly: 140000,
      threeMonths: 330000,
      tenSession: 170000,
    },
    facilities: ["SHOWER", "LOCKER", "REST_AREA", "TRAINING"],
  },
  {
    key: "theclimb_sadang",
    name: "더클라임 사당점",
    address: "서울 관악구 과천대로 939 지층 B201호",
    region: "SEOUL",
    phone: "02-585-8821",
    latitude: 37.4743771732195,
    longitude: 126.981430242321,
    visitorCapacity: 60,
    description:
      "지하철 사당역 4호선 4번출구 도보 1분거리\n\n더클라임 13개 지점 통합 회원권",
    website: "http://theclimb.co.kr",
    instagramId: "theclimb_sadang",
    thumbnailUrl:
      "https://climbing-log.s3.ap-northeast-2.amazonaws.com/seed/%E1%84%83%E1%85%A5%E1%84%8F%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%86%B7_%E1%84%89%E1%85%A1%E1%84%83%E1%85%A1%E1%86%BC.jpeg",
    priceImageUrl:
      "https://climbing-log.s3.ap-northeast-2.amazonaws.com/seed/%E1%84%83%E1%85%A5%E1%84%8F%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%86%B7_%E1%84%80%E1%85%A1%E1%84%80%E1%85%A7%E1%86%A8%E1%84%91%E1%85%AD.png",
    legacyPrices: {
      daily: 22000,
      monthly: 140000,
      threeMonths: 330000,
      tenSession: 170000,
    },
    facilities: ["SHOWER", "LOCKER", "REST_AREA", "TRAINING"],
  },
  {
    key: "theclimb_sinsa",
    name: "더클라임 신사점",
    address: "서울 강남구 압구정로2길 6 지하2층",
    region: "SEOUL",
    phone: "02-549-8821",
    latitude: 37.5210863385776,
    longitude: 127.019138224359,
    visitorCapacity: 60,
    description:
      "지하철 신사역 3호선 6번출구 도보 9분거리\n\n더클라임 13개 지점 통합 회원권",
    website: "http://theclimb.co.kr",
    instagramId: "theclimb_sinsa",
    thumbnailUrl:
      "https://climbing-log.s3.ap-northeast-2.amazonaws.com/seed/%E1%84%83%E1%85%A5%E1%84%8F%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%86%B7_%E1%84%89%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A1.jpeg",
    priceImageUrl:
      "https://climbing-log.s3.ap-northeast-2.amazonaws.com/seed/%E1%84%83%E1%85%A5%E1%84%8F%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%86%B7_%E1%84%80%E1%85%A1%E1%84%80%E1%85%A7%E1%86%A8%E1%84%91%E1%85%AD.png",
    legacyPrices: {
      daily: 22000,
      monthly: 140000,
      threeMonths: 330000,
      tenSession: 170000,
    },
    facilities: ["SHOWER", "LOCKER", "REST_AREA", "TRAINING"],
  },
  {
    key: "theclimb_nonhyeon",
    name: "더클라임 논현점",
    address: "서울 서초구 강남대로 519 지하1층",
    region: "SEOUL",
    phone: "02-545-5014",
    latitude: 37.5082880328998,
    longitude: 127.022205905271,
    visitorCapacity: 60,
    description:
      "논현역 4번출구 2분거리 및 신논현역2번출구 6분거리\n\n더클라임 13개 지점 통합 회원권",
    website: "http://theclimb.co.kr",
    instagramId: "theclimb_nonhyeon",
    thumbnailUrl:
      "https://climbing-log.s3.ap-northeast-2.amazonaws.com/seed/%E1%84%83%E1%85%A5%E1%84%8F%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%86%B7_%E1%84%82%E1%85%A9%E1%86%AB%E1%84%92%E1%85%A7%E1%86%AB.jpeg",
    priceImageUrl:
      "https://climbing-log.s3.ap-northeast-2.amazonaws.com/seed/%E1%84%83%E1%85%A5%E1%84%8F%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%86%B7_%E1%84%80%E1%85%A1%E1%84%80%E1%85%A7%E1%86%A8%E1%84%91%E1%85%AD.png",
    legacyPrices: {
      daily: 22000,
      monthly: 140000,
      threeMonths: 330000,
      tenSession: 170000,
    },
    facilities: ["SHOWER", "LOCKER", "REST_AREA", "TRAINING"],
  },
  {
    key: "theclimb_mullae",
    name: "더클라임 문래점",
    address: "서울 영등포구 당산로 63 1동",
    region: "SEOUL",
    phone: "02-3667-5014",
    latitude: 37.5205582802612,
    longitude: 126.895001322291,
    visitorCapacity: 100,
    description:
      "문래역[2호선] 3번 출구 도보 2분거리\n영등포구청 [5호선] 6번 출구 도보 7분거리\n\n더클라임 13개 지점 통합 회원권",
    website: "http://theclimb.co.kr",
    instagramId: "theclimb_mullae",
    thumbnailUrl:
      "https://climbing-log.s3.ap-northeast-2.amazonaws.com/seed/%E1%84%83%E1%85%A5%E1%84%8F%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%86%B7_%E1%84%86%E1%85%AE%E1%86%AB%E1%84%85%E1%85%A2.jpeg",
    priceImageUrl:
      "https://climbing-log.s3.ap-northeast-2.amazonaws.com/seed/%E1%84%83%E1%85%A5%E1%84%8F%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%86%B7_%E1%84%80%E1%85%A1%E1%84%80%E1%85%A7%E1%86%A8%E1%84%91%E1%85%AD.png",
    legacyPrices: {
      daily: 22000,
      monthly: 140000,
      threeMonths: 330000,
      tenSession: 170000,
    },
    facilities: ["PARKING", "SHOWER", "LOCKER", "REST_AREA", "TRAINING"],
  },
  {
    key: "theclimb_isu",
    name: "더클라임 이수점",
    address: "서울 동작구 동작대로 59 지하1층",
    region: "SEOUL",
    phone: "02-588-5014",
    latitude: 37.4820109847453,
    longitude: 126.981487484949,
    visitorCapacity: 60,
    description:
      "4호선 이수역 7번출구 도보4분\n4호선 사당역 10번출구 도보5분\n\n더클라임 13개 지점 통합 회원권",
    website: "http://theclimb.co.kr",
    instagramId: "theclimb_isu",
    thumbnailUrl:
      "https://climbing-log.s3.ap-northeast-2.amazonaws.com/seed/%E1%84%83%E1%85%A5%E1%84%8F%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%86%B7_%E1%84%8B%E1%85%B5%E1%84%89%E1%85%AE.jpeg",
    priceImageUrl:
      "https://climbing-log.s3.ap-northeast-2.amazonaws.com/seed/%E1%84%83%E1%85%A5%E1%84%8F%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%86%B7_%E1%84%80%E1%85%A1%E1%84%80%E1%85%A7%E1%86%A8%E1%84%91%E1%85%AD.png",
    legacyPrices: {
      daily: 22000,
      monthly: 140000,
      threeMonths: 330000,
      tenSession: 170000,
    },
    facilities: ["SHOWER", "LOCKER", "REST_AREA", "TRAINING"],
  },
  {
    key: "theclimb_seongsu",
    name: "더클라임 성수점",
    address: "서울 성동구 아차산로17길 49 생각공장 데시앙플렉스 B1층",
    region: "SEOUL",
    phone: "02-499-5014",
    latitude: 37.5467683738173,
    longitude: 127.065279307819,
    visitorCapacity: 60,
    description:
      "2호선 성수역,건대입구역 2번출구 도보 15분\n7호선 어린이대공원역 4번출구 도보 13분\n\n더클라임 13개 지점 통합 회원권",
    website: "http://theclimb.co.kr",
    instagramId: "theclimb_seongsu",
    thumbnailUrl:
      "https://climbing-log.s3.ap-northeast-2.amazonaws.com/seed/%E1%84%83%E1%85%A5%E1%84%8F%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%86%B7_%E1%84%89%E1%85%A5%E1%86%BC%E1%84%89%E1%85%AE.jpeg",
    priceImageUrl:
      "https://climbing-log.s3.ap-northeast-2.amazonaws.com/seed/%E1%84%83%E1%85%A5%E1%84%8F%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%86%B7_%E1%84%80%E1%85%A1%E1%84%80%E1%85%A7%E1%86%A8%E1%84%91%E1%85%AD.png",
    legacyPrices: {
      daily: 22000,
      monthly: 140000,
      threeMonths: 330000,
      tenSession: 170000,
    },
    facilities: ["SHOWER", "LOCKER", "REST_AREA", "TRAINING"],
  },
  // 서울숲클라이밍
  {
    key: "seoulforest_jongno",
    name: "서울숲클라이밍 종로점",
    address: "서울 종로구 수표로 96 지하1층",
    region: "SEOUL",
    phone: "010-3289-2705",
    latitude: 37.5697050231621,
    longitude: 126.99002424417,
    visitorCapacity: 80,
    description:
      "찾아가는길\n종로3가역 15번 출구에서 도보 3분\n* 건물 입구를 바라보고 오른편에 서울숲클라이밍으로 연결되는 계단 입구가 따로 있습니다.\n* 엘리베이터 이용 시, 4호기 엘리베이터만 이용 가능합니다.\n\n서울숲클라이밍 4개 지점 통합 회원권",
    instagramId: "seoulforest_jongro",
    thumbnailUrl:
      "https://climbing-log.s3.ap-northeast-2.amazonaws.com/seed/%E1%84%89%E1%85%A5%E1%84%8B%E1%85%AE%E1%86%AF%E1%84%89%E1%85%AE%E1%87%81%E1%84%8F%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%86%BC_%E1%84%8C%E1%85%A9%E1%86%BC%E1%84%85%E1%85%A9.jpeg",
    priceImageUrl:
      "https://climbing-log.s3.ap-northeast-2.amazonaws.com/seed/%E1%84%89%E1%85%A5%E1%84%8B%E1%85%AE%E1%86%AF%E1%84%89%E1%85%AE%E1%87%81%E1%84%8F%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%86%BC_%E1%84%80%E1%85%A1%E1%84%80%E1%85%A7%E1%86%A8%E1%84%91%E1%85%AD.png",
    legacyPrices: {
      daily: 20000,
      monthly: 130000,
      threeMonths: 330000,
      tenSession: 170000,
    },
    facilities: ["SHOWER", "LOCKER", "REST_AREA"],
  },
  {
    key: "seoulforest_jamsil",
    name: "서울숲클라이밍 잠실점",
    address: "서울 송파구 백제고분로7길 49 지하1층",
    region: "SEOUL",
    phone: "010-7710-2703",
    latitude: 37.510948520197,
    longitude: 127.084336791957,
    visitorCapacity: 60,
    description:
      "잠실새내역 4번출구 버스정류장 도보 2분\n잠실새내역 3번출구 도보 4분\n\n서울숲클라이밍 4개 지점 통합 회원권",
    instagramId: "seoulforest_climbing",
    thumbnailUrl:
      "https://climbing-log.s3.ap-northeast-2.amazonaws.com/seed/%E1%84%89%E1%85%A5%E1%84%8B%E1%85%AE%E1%86%AF%E1%84%89%E1%85%AE%E1%87%81%E1%84%8F%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%86%BC_%E1%84%8C%E1%85%A1%E1%86%B7%E1%84%89%E1%85%B5%E1%86%AF.jpeg",
    priceImageUrl:
      "https://climbing-log.s3.ap-northeast-2.amazonaws.com/seed/%E1%84%89%E1%85%A5%E1%84%8B%E1%85%AE%E1%86%AF%E1%84%89%E1%85%AE%E1%87%81%E1%84%8F%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%86%BC_%E1%84%80%E1%85%A1%E1%84%80%E1%85%A7%E1%86%A8%E1%84%91%E1%85%AD.pngg",
    legacyPrices: {
      daily: 20000,
      monthly: 130000,
      threeMonths: 330000,
      tenSession: 170000,
    },
    facilities: ["SHOWER", "LOCKER", "REST_AREA"],
  },
  {
    key: "seoulforest_yeongdeungpo",
    name: "서울숲클라이밍 영등포점",
    address: "서울 영등포구 문래로 164 1층",
    region: "SEOUL",
    phone: "010-6686-2700",
    latitude: 37.5177939016069,
    longitude: 126.900076883603,
    visitorCapacity: 60,
    description:
      "문래역 5번 출구로 나와 400m 직진 SK리더스뷰 1층 서울숲클라이밍\n규수당 카페 맞은편 건물 1층에 위치해있습니다.\n\n서울숲클라이밍 4개 지점 통합 회원권",
    instagramId: "seoulforest_climbing",
    thumbnailUrl:
      "https://climbing-log.s3.ap-northeast-2.amazonaws.com/seed/%E1%84%89%E1%85%A5%E1%84%8B%E1%85%AE%E1%86%AF%E1%84%89%E1%85%AE%E1%87%81%E1%84%8F%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%86%BC_%E1%84%8B%E1%85%A7%E1%86%BC%E1%84%83%E1%85%B3%E1%86%BC%E1%84%91%E1%85%A9.jpeg",
    priceImageUrl:
      "https://climbing-log.s3.ap-northeast-2.amazonaws.com/seed/%E1%84%89%E1%85%A5%E1%84%8B%E1%85%AE%E1%86%AF%E1%84%89%E1%85%AE%E1%87%81%E1%84%8F%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%86%BC_%E1%84%80%E1%85%A1%E1%84%80%E1%85%A7%E1%86%A8%E1%84%91%E1%85%AD.png",
    legacyPrices: {
      daily: 20000,
      monthly: 130000,
      threeMonths: 330000,
      tenSession: 170000,
    },
    facilities: ["PARKING", "SHOWER", "LOCKER", "REST_AREA"],
  },
  {
    key: "seoulforest_guro",
    name: "서울숲클라이밍 구로점",
    address: "서울 구로구 디지털로 300 지하1층",
    region: "SEOUL",
    phone: "010-3374-2704",
    latitude: 37.4849270383011,
    longitude: 126.896538036905,
    visitorCapacity: 90,
    description: "서울숲클라이밍 4개 지점 통합 회원권",
    instagramId: "seoulforest_climbing",
    thumbnailUrl:
      "https://climbing-log.s3.ap-northeast-2.amazonaws.com/seed/%E1%84%89%E1%85%A5%E1%84%8B%E1%85%AE%E1%86%AF%E1%84%89%E1%85%AE%E1%87%81%E1%84%8F%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%86%BC_%E1%84%80%E1%85%AE%E1%84%85%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%B7.png",
    priceImageUrl:
      "https://climbing-log.s3.ap-northeast-2.amazonaws.com/seed/%E1%84%89%E1%85%A5%E1%84%8B%E1%85%AE%E1%86%AF%E1%84%89%E1%85%AE%E1%87%81%E1%84%8F%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%86%BC_%E1%84%80%E1%85%A1%E1%84%80%E1%85%A7%E1%86%A8%E1%84%91%E1%85%AD.png",
    legacyPrices: {
      daily: 20000,
      monthly: 130000,
      threeMonths: 330000,
      tenSession: 170000,
    },
    facilities: ["PARKING", "SHOWER", "LOCKER", "REST_AREA"],
  },
  // 클라이밍파크
  {
    key: "climbingpark_gangnam",
    name: "클라이밍파크 강남점",
    address: "서울 강남구 강남대로 364 지하1층",
    region: "SEOUL",
    phone: "0507-1391-4662",
    latitude: 37.4955498697675,
    longitude: 127.029293901519,
    visitorCapacity: 70,
    description:
      "강남역 4번출구 바로 앞에 있는 미왕빌딩 지하1층에 있습니다.\n건물 안으로 들어올 필요 없이 건물 외부에(건물 입구를 바라보고 좌측) 있는 엘리베이터를 이용해서 지하1층으로 내려오면 됩니다\n\n클라이밍파크 5개 지점 통합 회원권",
    instagramId: "climbingpark_gangnam",
    thumbnailUrl:
      "https://climbing-log.s3.ap-northeast-2.amazonaws.com/seed/%E1%84%8F%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%86%BC%E1%84%91%E1%85%A1%E1%84%8F%E1%85%B3_%E1%84%80%E1%85%A1%E1%86%BC%E1%84%82%E1%85%A1%E1%86%B7.jpeg",
    priceImageUrl:
      "https://climbing-log.s3.ap-northeast-2.amazonaws.com/seed/%E1%84%8F%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%86%BC%E1%84%91%E1%85%A1%E1%84%8F%E1%85%B3_%E1%84%80%E1%85%A1%E1%84%80%E1%85%A7%E1%86%A8%E1%84%91%E1%85%AD.jpegg",
    legacyPrices: {
      daily: 22000,
      monthly: 130000,
      threeMonths: 330000,
      tenSession: 170000,
    },
    facilities: ["SHOWER", "LOCKER", "REST_AREA", "TRAINING"],
  },
  {
    key: "climbingpark_sinnonhyeon",
    name: "클라이밍파크 신논현점",
    address: "서울 강남구 강남대로 468 지하3층",
    region: "SEOUL",
    phone: "0507-1362-4662",
    latitude: 37.5041557043851,
    longitude: 127.025145513654,
    visitorCapacity: 60,
    description:
      "신논현역 5번출구에서 다섯걸음\n\n클라이밍파크 5개 지점 통합 회원권",
    instagramId: "climbingpark_sinnonhyeon",
    thumbnailUrl:
      "https://climbing-log.s3.ap-northeast-2.amazonaws.com/seed/%E1%84%8F%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%86%BC%E1%84%91%E1%85%A1%E1%84%8F%E1%85%B3_%E1%84%89%E1%85%B5%E1%86%AB%E1%84%82%E1%85%A9%E1%86%AB%E1%84%92%E1%85%A7%E1%86%AB.jpeg",
    priceImageUrl:
      "https://climbing-log.s3.ap-northeast-2.amazonaws.com/seed/%E1%84%8F%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%86%BC%E1%84%91%E1%85%A1%E1%84%8F%E1%85%B3_%E1%84%80%E1%85%A1%E1%84%80%E1%85%A7%E1%86%A8%E1%84%91%E1%85%AD.jpeg",
    legacyPrices: {
      daily: 22000,
      monthly: 130000,
      threeMonths: 330000,
      tenSession: 170000,
    },
    facilities: ["SHOWER", "LOCKER", "REST_AREA", "TRAINING"],
  },
  {
    key: "climbingpark_hanti",
    name: "클라이밍파크 한티점",
    address: "서울 강남구 선릉로 324 SH타워 지하3층",
    region: "SEOUL",
    phone: "0507-1340-4662",
    latitude: 37.4985303841214,
    longitude: 127.052094163626,
    visitorCapacity: 60,
    description:
      "지하철 분당선 한티역에 내려서 1번출구로 나오셔서 건물들을 바라보면 SH타워가 보입니다.\n1번출구에서 2분 정도 걸으면 클라이밍파크 간판이 보여요.\n\n클라이밍파크 5개 지점 통합 회원권",
    instagramId: "climbing_park_hanti",
    thumbnailUrl:
      "https://climbing-log.s3.ap-northeast-2.amazonaws.com/seed/%E1%84%8F%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%86%BC%E1%84%91%E1%85%A1%E1%84%8F%E1%85%B3_%E1%84%92%E1%85%A1%E1%86%AB%E1%84%90%E1%85%B5.jpeg",
    priceImageUrl:
      "https://climbing-log.s3.ap-northeast-2.amazonaws.com/seed/%E1%84%8F%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%86%BC%E1%84%91%E1%85%A1%E1%84%8F%E1%85%B3_%E1%84%80%E1%85%A1%E1%84%80%E1%85%A7%E1%86%A8%E1%84%91%E1%85%AD.jpeg",
    legacyPrices: {
      daily: 22000,
      monthly: 130000,
      threeMonths: 330000,
      tenSession: 170000,
    },
    facilities: ["SHOWER", "LOCKER", "REST_AREA", "TRAINING"],
  },
  {
    key: "climbingpark_seongsu",
    name: "클라이밍파크 성수점",
    address: "서울 성동구 연무장13길 7 매니아빌딩",
    region: "SEOUL",
    phone: "0507-1322-4662",
    latitude: 37.5423065177285,
    longitude: 127.058068446213,
    visitorCapacity: 60,
    description:
      "성수역 3번출구에서 4분 거리에 위치\n\n클라이밍파크 5개 지점 통합 회원권",
    instagramId: "climbingpark_seongsu",
    thumbnailUrl:
      "https://climbing-log.s3.ap-northeast-2.amazonaws.com/seed/%E1%84%8F%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%86%BC%E1%84%91%E1%85%A1%E1%84%8F%E1%85%B3_%E1%84%89%E1%85%A5%E1%86%BC%E1%84%89%E1%85%AE.jpeg",
    priceImageUrl:
      "https://climbing-log.s3.ap-northeast-2.amazonaws.com/seed/%E1%84%8F%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%86%BC%E1%84%91%E1%85%A1%E1%84%8F%E1%85%B3_%E1%84%80%E1%85%A1%E1%84%80%E1%85%A7%E1%86%A8%E1%84%91%E1%85%AD.jpeg",
    legacyPrices: {
      daily: 22000,
      monthly: 130000,
      threeMonths: 330000,
      tenSession: 170000,
    },
    facilities: ["SHOWER", "LOCKER", "REST_AREA", "TRAINING"],
  },
  {
    key: "climbingpark_jongno",
    name: "클라이밍파크 종로점",
    address: "서울 종로구 종로 199 한일빌딩 지하2층",
    region: "SEOUL",
    phone: "0507-1358-4662",
    latitude: 37.5714335534085,
    longitude: 126.999746324303,
    visitorCapacity: 80,
    description:
      "1.지하철 1호선 종로5가역 하차후 1번 출구로 나와서 2분 정도 직진\n2.지하철 1호선 종로5가역 지하쇼핑센터 13번 출구로 나와서 3미터 직진\n국민은행 건물 주차장 큰 대로변 입구쪽 옆에 엘리베이터 및 지하로 내려가는 계단 입구 있습니다. ( 새종로약국 정면으로 바라보며 왼쪽 )\n\n클라이밍파크 5개 지점 통합 회원권",
    instagramId: "climbing_park_jongro",
    thumbnailUrl:
      "https://climbing-log.s3.ap-northeast-2.amazonaws.com/seed/%E1%84%8F%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%86%BC%E1%84%91%E1%85%A1%E1%84%8F%E1%85%B3_%E1%84%8C%E1%85%A9%E1%86%BC%E1%84%85%E1%85%A9.jpeg",
    priceImageUrl:
      "https://climbing-log.s3.ap-northeast-2.amazonaws.com/seed/%E1%84%8F%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%86%BC%E1%84%91%E1%85%A1%E1%84%8F%E1%85%B3_%E1%84%80%E1%85%A1%E1%84%80%E1%85%A7%E1%86%A8%E1%84%91%E1%85%AD.jpeg",
    legacyPrices: {
      daily: 22000,
      monthly: 130000,
      threeMonths: 330000,
      tenSession: 170000,
    },
    facilities: ["SHOWER", "LOCKER", "REST_AREA", "TRAINING"],
  },
];

const OPEN_HOURS: Record<string, IOpenHourSeed[]> = {
  theclimb_yeonnam: [
    { dayType: "MON", open: "07:30", close: "24:00" },
    { dayType: "TUE", open: "07:30", close: "24:00" },
    { dayType: "WED", open: "07:30", close: "24:00" },
    { dayType: "THU", open: "07:30", close: "24:00" },
    { dayType: "FRI", open: "07:30", close: "24:00" },
    { dayType: "SAT", open: "08:00", close: "22:00" },
    { dayType: "SUN", open: "08:00", close: "22:00" },
  ],
  theclimb_b_hongdae: [
    { dayType: "MON", open: "10:00", close: "23:00" },
    { dayType: "TUE", open: "10:00", close: "23:00" },
    { dayType: "WED", open: "10:00", close: "23:00" },
    { dayType: "THU", open: "10:00", close: "23:00" },
    { dayType: "FRI", open: "10:00", close: "23:00" },
    { dayType: "SAT", open: "08:00", close: "22:00" },
    { dayType: "SUN", open: "08:00", close: "22:00" },
  ],
  theclimb_ilsan: [
    { dayType: "MON", open: "08:30", close: "24:00" },
    { dayType: "TUE", open: "08:30", close: "24:00" },
    { dayType: "WED", open: "08:30", close: "24:00" },
    { dayType: "THU", open: "08:30", close: "24:00" },
    { dayType: "FRI", open: "08:30", close: "24:00" },
    { dayType: "SAT", open: "08:00", close: "22:00" },
    { dayType: "SUN", open: "08:00", close: "22:00" },
  ],
  theclimb_magok: [
    { dayType: "MON", open: "09:30", close: "23:30" },
    { dayType: "TUE", open: "09:30", close: "23:30" },
    { dayType: "WED", open: "09:30", close: "23:30" },
    { dayType: "THU", open: "09:30", close: "23:30" },
    { dayType: "FRI", open: "09:30", close: "23:30" },
    { dayType: "SAT", open: "08:00", close: "22:00" },
    { dayType: "SUN", open: "08:00", close: "22:00" },
  ],
  theclimb_yangjae: [
    { dayType: "MON", open: "08:30", close: "24:00" },
    { dayType: "TUE", open: "08:30", close: "24:00" },
    { dayType: "WED", open: "08:30", close: "24:00" },
    { dayType: "THU", open: "08:30", close: "24:00" },
    { dayType: "FRI", open: "08:30", close: "24:00" },
    { dayType: "SAT", open: "08:00", close: "22:00" },
    { dayType: "SUN", open: "08:00", close: "22:00" },
  ],
  theclimb_sillim: [
    { dayType: "MON", open: "07:30", close: "24:00" },
    { dayType: "TUE", open: "07:30", close: "24:00" },
    { dayType: "WED", open: "07:30", close: "24:00" },
    { dayType: "THU", open: "07:30", close: "24:00" },
    { dayType: "FRI", open: "07:30", close: "24:00" },
    { dayType: "SAT", open: "07:30", close: "22:00" },
    { dayType: "SUN", open: "08:00", close: "22:00" },
  ],
  theclimb_gangnam: [
    { dayType: "MON", open: "09:30", close: "23:30" },
    { dayType: "TUE", open: "09:30", close: "23:30" },
    { dayType: "WED", open: "09:30", close: "23:30" },
    { dayType: "THU", open: "09:30", close: "23:30" },
    { dayType: "FRI", open: "09:30", close: "23:30" },
    { dayType: "SAT", open: "10:00", close: "20:00" },
    { dayType: "SUN", open: "10:00", close: "20:00" },
  ],
  theclimb_sadang: [
    { dayType: "MON", open: "09:30", close: "23:30" },
    { dayType: "TUE", open: "09:30", close: "23:30" },
    { dayType: "WED", open: "09:30", close: "23:30" },
    { dayType: "THU", open: "09:30", close: "23:30" },
    { dayType: "FRI", open: "09:30", close: "23:30" },
    { dayType: "SAT", open: "08:00", close: "22:00" },
    { dayType: "SUN", open: "08:00", close: "22:00" },
  ],
  theclimb_sinsa: [
    { dayType: "MON", open: "12:00", close: "23:00" },
    { dayType: "TUE", open: "12:00", close: "23:00" },
    { dayType: "WED", open: "12:00", close: "23:00" },
    { dayType: "THU", open: "12:00", close: "23:00" },
    { dayType: "FRI", open: "12:00", close: "23:00" },
    { dayType: "SAT", open: "10:00", close: "22:00" },
    { dayType: "SUN", open: "10:00", close: "20:00" },
  ],
  theclimb_nonhyeon: [
    { dayType: "MON", open: "09:30", close: "23:30" },
    { dayType: "TUE", open: "09:30", close: "23:30" },
    { dayType: "WED", open: "09:30", close: "23:30" },
    { dayType: "THU", open: "09:30", close: "23:30" },
    { dayType: "FRI", open: "09:30", close: "23:30" },
    { dayType: "SAT", open: "08:00", close: "22:00" },
    { dayType: "SUN", open: "08:00", close: "22:00" },
  ],
  theclimb_mullae: [
    { dayType: "MON", open: "07:30", close: "24:00" },
    { dayType: "TUE", open: "07:30", close: "24:00" },
    { dayType: "WED", open: "07:30", close: "24:00" },
    { dayType: "THU", open: "07:30", close: "24:00" },
    { dayType: "FRI", open: "07:30", close: "24:00" },
    { dayType: "SAT", open: "08:00", close: "22:00" },
    { dayType: "SUN", open: "08:00", close: "22:00" },
  ],
  theclimb_isu: [
    { dayType: "MON", open: "09:30", close: "23:30" },
    { dayType: "TUE", open: "09:30", close: "23:30" },
    { dayType: "WED", open: "09:30", close: "23:30" },
    { dayType: "THU", open: "09:30", close: "23:30" },
    { dayType: "FRI", open: "09:30", close: "23:30" },
    { dayType: "SAT", open: "08:00", close: "22:00" },
    { dayType: "SUN", open: "08:00", close: "22:00" },
  ],
  theclimb_seongsu: [
    { dayType: "MON", open: "09:30", close: "23:30" },
    { dayType: "TUE", open: "09:30", close: "23:30" },
    { dayType: "WED", open: "09:30", close: "23:30" },
    { dayType: "THU", open: "09:30", close: "23:30" },
    { dayType: "FRI", open: "09:30", close: "23:30" },
    { dayType: "SAT", open: "08:00", close: "22:00" },
    { dayType: "SUN", open: "08:00", close: "22:00" },
  ],
  seoulforest_jongno: [
    { dayType: "MON", open: "09:00", close: "23:00" },
    { dayType: "TUE", open: "09:00", close: "23:00" },
    { dayType: "WED", open: "09:00", close: "23:00" },
    { dayType: "THU", open: "09:00", close: "23:00" },
    { dayType: "FRI", open: "09:00", close: "23:00" },
    { dayType: "SAT", open: "09:00", close: "20:00" },
    { dayType: "SUN", open: "09:00", close: "21:00" },
  ],
  seoulforest_jamsil: [
    { dayType: "MON", open: "10:00", close: "23:00" },
    { dayType: "TUE", open: "10:00", close: "23:00" },
    { dayType: "WED", open: "10:00", close: "23:00" },
    { dayType: "THU", open: "10:00", close: "23:00" },
    { dayType: "FRI", open: "10:00", close: "23:00" },
    { dayType: "SAT", open: "10:00", close: "21:00" },
    { dayType: "SUN", open: "10:00", close: "21:00" },
  ],
  seoulforest_yeongdeungpo: [
    { dayType: "MON", open: "10:00", close: "23:00" },
    { dayType: "TUE", open: "10:00", close: "23:00" },
    { dayType: "WED", open: "10:00", close: "23:00" },
    { dayType: "THU", open: "10:00", close: "23:00" },
    { dayType: "FRI", open: "10:00", close: "23:00" },
    { dayType: "SAT", open: "09:00", close: "21:00" },
    { dayType: "SUN", open: "09:00", close: "21:00" },
  ],
  seoulforest_guro: [
    { dayType: "MON", open: "10:00", close: "23:00" },
    { dayType: "TUE", open: "10:00", close: "23:00" },
    { dayType: "WED", open: "10:00", close: "23:00" },
    { dayType: "THU", open: "10:00", close: "23:00" },
    { dayType: "FRI", open: "10:00", close: "23:00" },
    { dayType: "SAT", open: "09:00", close: "21:00" },
    { dayType: "SUN", open: "09:00", close: "21:00" },
  ],
  climbingpark_gangnam: [
    { dayType: "MON", open: "07:00", close: "23:00" },
    { dayType: "TUE", open: "07:00", close: "23:00" },
    { dayType: "WED", open: "07:00", close: "23:00" },
    { dayType: "THU", open: "07:00", close: "23:00" },
    { dayType: "FRI", open: "07:00", close: "23:00" },
    { dayType: "SAT", open: "10:00", close: "21:00" },
    { dayType: "SUN", open: "10:00", close: "21:00" },
  ],
  climbingpark_sinnonhyeon: [
    { dayType: "MON", open: "10:00", close: "23:00" },
    { dayType: "TUE", open: "10:00", close: "23:00" },
    { dayType: "WED", open: "10:00", close: "23:00" },
    { dayType: "THU", open: "10:00", close: "23:00" },
    { dayType: "FRI", open: "10:00", close: "23:00" },
    { dayType: "SAT", open: "10:00", close: "20:00" },
    { dayType: "SUN", open: "10:00", close: "20:00" },
  ],
  climbingpark_hanti: [
    { dayType: "MON", open: "10:00", close: "23:00" },
    { dayType: "TUE", open: "10:00", close: "23:00" },
    { dayType: "WED", open: "10:00", close: "23:00" },
    { dayType: "THU", open: "10:00", close: "23:00" },
    { dayType: "FRI", open: "10:00", close: "23:00" },
    { dayType: "SAT", open: "10:00", close: "20:00" },
    { dayType: "SUN", open: "10:00", close: "20:00" },
  ],
  climbingpark_seongsu: [
    { dayType: "MON", open: "10:00", close: "23:00" },
    { dayType: "TUE", open: "10:00", close: "23:00" },
    { dayType: "WED", open: "10:00", close: "23:00" },
    { dayType: "THU", open: "10:00", close: "23:00" },
    { dayType: "FRI", open: "10:00", close: "23:00" },
    { dayType: "SAT", open: "10:00", close: "21:00" },
    { dayType: "SUN", open: "10:00", close: "21:00" },
  ],
  climbingpark_jongno: [
    { dayType: "MON", open: "10:00", close: "23:00" },
    { dayType: "TUE", open: "10:00", close: "23:00" },
    { dayType: "WED", open: "10:00", close: "23:00" },
    { dayType: "THU", open: "10:00", close: "23:00" },
    { dayType: "FRI", open: "10:00", close: "23:00" },
    { dayType: "SAT", open: "10:00", close: "21:00" },
    { dayType: "SUN", open: "10:00", close: "21:00" },
  ],
};

/** 구 시드 가격 → 요금표 템플릿(활성). 6·12개월은 `legacyPrices`에 값이 있을 때만 행 생성 */
const buildMembershipPlanRows = (
  gymId: string,
  p: IGymSeed["legacyPrices"],
): Array<{
  gymId: string;
  code: MembershipPlanCode;
  priceWon: number;
  sortOrder: number;
}> => {
  const rows: Array<{
    gymId: string;
    code: MembershipPlanCode;
    priceWon: number;
    sortOrder: number;
  }> = [
    { gymId, code: "COUNT_DAY", priceWon: p.daily, sortOrder: 0 },
    { gymId, code: "COUNT_3", priceWon: Math.round(p.daily * 2.5), sortOrder: 1 },
    { gymId, code: "COUNT_5", priceWon: Math.round(p.daily * 4), sortOrder: 2 },
    { gymId, code: "COUNT_10", priceWon: p.tenSession, sortOrder: 3 },
    { gymId, code: "PERIOD_1M", priceWon: p.monthly, sortOrder: 10 },
    { gymId, code: "PERIOD_3M", priceWon: p.threeMonths, sortOrder: 11 },
  ];
  if (typeof p.sixMonths === "number") {
    rows.push({ gymId, code: "PERIOD_6M", priceWon: p.sixMonths, sortOrder: 12 });
  }
  if (typeof p.twelveMonths === "number") {
    rows.push({
      gymId,
      code: "PERIOD_12M",
      priceWon: p.twelveMonths,
      sortOrder: 13,
    });
  }
  return rows;
};

export async function seedGyms(
  prisma: PrismaClient,
): Promise<Record<string, Gym>> {
  const gymMap: Record<string, Gym> = {};

  const THECLIMB_PRICE_IMAGE_URL =
    "https://climbing-log.s3.ap-northeast-2.amazonaws.com/seed/%E1%84%83%E1%85%A5%E1%84%8F%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%86%B7_%E1%84%80%E1%85%A1%E1%84%80%E1%85%A7%E1%86%A8%E1%84%91%E1%85%AD.png";
  const SEOULFOREST_PRICE_IMAGE_URL =
    "https://climbing-log.s3.ap-northeast-2.amazonaws.com/seed/%E1%84%89%E1%85%A5%E1%84%8B%E1%85%AE%E1%86%AF%E1%84%89%E1%85%AE%E1%87%81%E1%84%8F%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%86%BC_%E1%84%80%E1%85%A1%E1%84%80%E1%85%A7%E1%86%A8%E1%84%91%E1%85%AD.png";
  const CLIMBINGPARK_PRICE_IMAGE_URL =
    "https://climbing-log.s3.ap-northeast-2.amazonaws.com/seed/%E1%84%8F%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%86%BC%E1%84%91%E1%85%A1%E1%84%8F%E1%85%B3_%E1%84%80%E1%85%A1%E1%84%80%E1%85%A7%E1%86%A8%E1%84%91%E1%85%AD.jpeg";

  const priceImageUrlFromKey = (key: string) => {
    if (key.startsWith("theclimb_")) return THECLIMB_PRICE_IMAGE_URL;
    if (key.startsWith("seoulforest_")) return SEOULFOREST_PRICE_IMAGE_URL;
    if (key.startsWith("climbingpark_")) return CLIMBINGPARK_PRICE_IMAGE_URL;
    return null;
  };

  const membershipBrandFromKey = (key: string): GymMembershipBrand => {
    if (key.startsWith("theclimb_")) return "THE_CLIMB";
    if (key.startsWith("seoulforest_")) return "SEOULFOREST";
    if (key.startsWith("climbingpark_")) return "CLIMBINGPARK";
    return "STANDALONE";
  };

  for (const gymData of GYMS_DATA) {
    const { key, ...rest } = gymData;
    const gym = await prisma.gym.create({
      data: {
        name: rest.name,
        address: rest.address,
        region: rest.region as never,
        phone: rest.phone,
        latitude: rest.latitude,
        longitude: rest.longitude,
        visitorCapacity: rest.visitorCapacity,
        description: rest.description,
        website: rest.website,
        instagramId: rest.instagramId,
        thumbnailUrl: rest.thumbnailUrl,
        notice: rest.notice,
        facilities: rest.facilities,
        avgRating: 0,
        reviewCount: 0,
        membershipBrand: membershipBrandFromKey(key),
      },
    });

    await prisma.gymMembershipPlan.createMany({
      data: buildMembershipPlanRows(gym.id, rest.legacyPrices),
    });

    // 가격표(또는 대체 이미지) 1장 필수 생성: 화면에서 images가 빈 배열이면 안 됨
    const imageUrl =
      priceImageUrlFromKey(key) ??
      rest.priceImageUrl ??
      rest.thumbnailUrl ??
      null;
    if (imageUrl) {
      await prisma.gymImage.create({
        data: {
          gymId: gym.id,
          url: imageUrl,
          order: 0,
        },
      });
    }

    const hours = OPEN_HOURS[key];
    if (hours) {
      await prisma.gymOpenHour.createMany({
        data: hours.map(({ dayType, open, close }) => ({
          gymId: gym.id,
          dayType,
          open,
          close,
        })),
      });
    }

    gymMap[key] = gym;
  }

  console.log(`  ✅ ${Object.keys(gymMap).length}개의 암장 생성`);
  return gymMap;
}
