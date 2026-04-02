export const ROUTES = {
  /** =============================================== 외부링크 =============================================== */
  EXTERNAL_LINKS: {
    /** 개인정보 처리방침 */
    PRIVACY_POLICY: {
      path: "https://thrilling-mapusaurus-f24.notion.site/335b6aeed4018009a210ebf7732dc9fd?source=copy_link",
      label: "개인정보 처리방침",
    },
    /** 서비스 이용약관 */
    TERMS_OF_SERVICE: {
      path: "https://thrilling-mapusaurus-f24.notion.site/335b6aeed401802da749f0dd74d544b9?source=copy_link",
      label: "서비스 이용약관",
    },
  },

  /** =============================================== 홈 =============================================== */
  HOME: {
    path: "/",
    label: "홈",
  },

  /** =============================================== 로그인 =============================================== */
  LOGIN: {
    path: "/login",
    label: "로그인",
  },

  /** =============================================== 암장 =============================================== */
  GYMS: {
    path: "/gyms",
    label: "암장",
    /** 암장 > 암장 상세 */
    DETAIL: {
      path: (gymId: string) => `/gyms/${gymId}`,
      label: "암장 상세",
      /** 암장 > 암장 상세 > 리뷰 작성 */
      REVIEW: {
        CREATE: {
          path: (gymId: string) => `/gyms/${gymId}/review/create`,
          label: "리뷰 작성",
        },
        EDIT: {
          path: (gymId: string, reviewId: string) =>
            `/gyms/${gymId}/review/edit/${reviewId}`,
          label: "리뷰 수정",
        },
      },
    },
  },

  /** =============================================== 커뮤니티 =============================================== */
  COMMUNITY: {
    path: "/community",
    label: "커뮤니티",
    /** 커뮤니티 > 게시글 상세 */
    DETAIL: {
      path: (postId: string) => `/community/${postId}`,
      label: "게시글 상세",
    },
    /** 커뮤니티 > 게시글 작성 */
    CREATE: {
      path: "/community/create",
      label: "게시글 작성",
    },
    /** 커뮤니티 > 게시글 수정 */
    EDIT: {
      path: (postId: string) => `/community/edit/${postId}`,
      label: "게시글 수정",
    },
  },

  /** =============================================== 기록 =============================================== */
  /** 통계 (하단 탭 외 진입) */
  STATISTICS: {
    path: "/statistics",
    label: "통계",
  },

  RECORDS: {
    path: "/records",
    label: "기록",
    /** 기록 > 기록 추가 */
    NEW: {
      path: "/records/new",
      label: "기록 추가",
    },
    /** 기록 > 기록 상세 */
    DETAIL: {
      path: (recordId: string) => `/records/${recordId}`,
      label: "기록 상세",
      /** 기록 > 기록 상세 > 기록 수정 */
      EDIT: {
        path: (recordId: string) => `/records/${recordId}/edit`,
        label: "기록 수정",
      },
    },
  },

  /** =============================================== 마이페이지 =============================================== */
  MY: {
    path: "/my",
    label: "마이페이지",
    /** 마이페이지 > 프로필 수정 */
    PROFILE_EDIT: {
      path: "/my/profile/edit",
      label: "프로필 수정",
    },
    /** 마이페이지 > 설정 */
    SETTINGS: {
      path: "/my/settings",
      label: "설정",
    },
  },

  /** =============================================== 유저 =============================================== */
  USERS: {
    label: "유저",
    /** 유저 > 프로필 */
    PROFILE: {
      path: (userId: string) => `/users/${userId}`,
      label: "프로필",
    },
  },

  /** =============================================== 알림 =============================================== */
  NOTIFICATIONS: {
    path: "/notifications",
    label: "알림",
  },
} as const;
