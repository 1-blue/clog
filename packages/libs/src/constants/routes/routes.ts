/** 접근 권한 타입 */
export type RouteAccess = "public" | "auth" | "guest" | "admin";

export const routes = {
  // ============================================================ 관리자 접근 가능한 페이지 ============================================================
  /** ============================== 관리자 대시보드 ============================== */
  admin: {
    label: `관리자 대시보드`,
    url: `/admin`,
    access: "admin",

    community: {
      label: `관리자 커뮤니티 관리`,
      url: `/admin/community`,
      access: "admin",
    },
    inquiry: {
      label: `관리자 문의 관리`,
      url: `/admin/inquiry`,
      access: "admin",
    },
    gym: {
      label: `관리자 암장 관리`,
      url: `/admin/gym`,
      access: "admin",
    },
    user: {
      label: `관리자 유저 관리`,
      url: `/admin/user`,
      access: "admin",
    },
  },

  // ============================================================ 로그인 접근 가능한 페이지 ============================================================

  /** ============================== 클라이밍 기록 관련 ============================== */
  record: {
    label: `클라이밍 기록`,
    url: `/record`,
    access: "auth",

    detail: {
      label: `클라이밍 기록 상세`,
      url: (recordId: string) => `/record/${recordId}`,
      access: "auth",
    },
    create: {
      label: `클라이밍 기록 생성`,
      url: `/record/create`,
      access: "auth",
    },
    edit: {
      label: `클라이밍 기록 수정`,
      url: (recordId: string) => `/record/${recordId}/edit`,
      access: "auth",
    },
  },

  /** ============================== 문의 관련 ============================== */
  inquiry: {
    label: `문의`,
    url: `/inquiry`,
    access: "auth",
    detail: {
      label: `문의 상세`,
      url: (inquiryId: string) => `/inquiry/${inquiryId}`,
      access: "auth",
    },
    create: {
      label: `문의 생성`,
      url: `/inquiry/create`,
      access: "auth",
    },
    edit: {
      label: `문의 수정`,
      url: (inquiryId: string) => `/inquiry/${inquiryId}/edit`,
      access: "auth",
    },
  },

  /** ============================== 프로필 관련 ============================== */
  profile: {
    label: `프로필`,
    url: `/profile`,
    access: "auth",
    edit: {
      label: `프로필 수정`,
      url: `/profile/edit`,
      access: "auth",
    },

    /** ============================== 회원권 관련 ============================== */
    pass: {
      label: `회원권 관리`,
      url: `/profile/pass`,
      access: "auth",
      create: {
        label: `회원권 생성`,
        url: `/profile/pass/create`,
        access: "auth",
      },
      edit: {
        label: `회원권 수정`,
        url: (passId: string) => `/profile/pass/${passId}/edit`,
        access: "auth",
      },
    },

    /** ============================== 설정 관련 ============================== */
    setting: {
      label: `설정`,
      url: `/profile/setting`,
      access: "auth",
    },
  },

  // ============================================================ 비로그인 접근 가능한 페이지 ============================================================

  /** ============================== 로그인 관련 ============================== */
  login: {
    label: `로그인`,
    url: `/login`,
    access: "guest",
  },

  // ============================================================ 누구나 접근 가능한 페이지 ============================================================

  /** ============================== 메인 페이지 ============================== */
  home: {
    label: `메인 페이지`,
    url: `/`,
    access: "public",
  },

  /** ============================== 가이드 관련 ============================== */
  guide: {
    climbing: {
      label: `실내 클라이밍 가이드`,
      url: `/guide/climbing`,
      access: "public",
    },
    grade: {
      label: `난이도 가이드`,
      url: `/guide/grade`,
      access: "public",
    },
  },

  /** ============================== 커뮤니티 관련 ============================== */
  community: {
    label: `커뮤니티`,
    url: `/community`,
    access: "public",

    detail: {
      label: `커뮤니티 상세`,
      url: (communityId: string) => `/community/${communityId}`,
      access: "public",
    },
    create: {
      label: `커뮤니티 생성`,
      url: `/community/create`,
      access: "auth",
    },
    edit: {
      label: `커뮤니티 수정`,
      url: (communityId: string) => `/community/${communityId}/edit`,
      access: "auth",
    },
  },

  /** ============================== 실시간 혼잡도 관련 ============================== */
  crowd: {
    label: `실시간 혼잡도`,
    url: `/crowd`,
    access: "public",
  },

  /** ============================== 암장 관련 ============================== */
  gym: {
    label: `암장`,
    url: `/gym`,
    access: "public",
    detail: {
      label: `암장 상세`,
      url: (gymId: string) => `/gym/${gymId}`,
      access: "public",
    },
    create: {
      label: `암장 생성`,
      url: `/gym/create`,
      access: "auth",
    },
    edit: {
      label: `암장 수정 요청`,
      url: (gymId: string) => `/gym/${gymId}/edit`,
      access: "auth",
    },
  },

  /** ============================== 통계 관련 ============================== */
  stats: {
    label: `통계`,
    url: `/stats`,
    access: "auth",
  },
} as const;
