/** URL 타입 추출 유틸리티 */
type ExtractUrl<T> = T extends { url: infer U }
  ? U extends string
    ? U
    : U extends (...args: never[]) => string
      ? ReturnType<U>
      : never
  : T extends Record<string, unknown>
    ? {
        [K in keyof T]: ExtractUrl<T[K]>;
      }[keyof T]
    : never;

/** 라우트 키 추출 유틸리티 */
type ExtractRouteKeys<T, Prefix extends string = ""> = {
  [K in keyof T]: K extends string
    ? T[K] extends { url: unknown }
      ? Prefix extends ""
        ? K | ExtractRouteKeys<T[K], K>
        : `${Prefix}.${K}` | ExtractRouteKeys<T[K], `${Prefix}.${K}`>
      : T[K] extends Record<string, unknown>
        ? ExtractRouteKeys<T[K], Prefix extends "" ? K : `${Prefix}.${K}`>
        : never
    : never;
}[keyof T] extends infer U
  ? U extends string
    ? U
    : never
  : never;

/** 라우트 경로 타입 */
export type RoutePath = ExtractUrl<typeof routes>;

/** 라우트 키 타입 */
export type RouteKey = ExtractRouteKeys<typeof routes>;

export const routes = {
  admin: {
    label: `관리자`,
    url: `/admin`,

    community: {
      label: `관리자 커뮤니티 관리`,
      url: `/admin/community`,
    },
    contact: {
      label: `관리자 문의 관리`,
      url: `/admin/contact`,
    },
    gyms: {
      label: `관리자 암장 관리`,
      url: `/admin/gyms`,
    },
    users: {
      label: `관리자 유저 관리`,
      url: `/admin/users`,
    },
  },

  login: {
    label: `로그인`,
    url: `/login`,
  },
  signup: {
    label: `회원가입`,
    url: `/signup`,
  },

  home: {
    label: `메인 페이지`,
    url: `/`,
  },

  community: {
    label: `커뮤니티`,
    url: `/community`,

    detail: {
      label: `커뮤니티 상세`,
      url: (communityId: string) => `/community/${communityId}`,
    },
    create: {
      label: `커뮤니티 생성`,
      url: `/community/create`,
    },
    edit: {
      label: `커뮤니티 수정`,
      url: (communityId: string) => `/community/${communityId}/edit`,
    },
  },

  contact: {
    label: `문의`,
    url: `/contact`,
    create: {
      label: `문의 생성`,
      url: `/contact/create`,
    },
    edit: {
      label: `문의 수정`,
      url: (contactId: string) => `/contact/${contactId}/edit`,
    },
  },

  crowd: {
    label: `실시간 혼잡도`,
    url: `/crowd`,
  },

  gyms: {
    label: `암장`,
    url: `/gyms`,
    detail: {
      label: `암장 상세`,
      url: (gymId: string) => `/gyms/${gymId}`,
    },
    edit: {
      label: `암장 수정 요청`,
      url: (gymId: string) => `/gyms/${gymId}/edit`,
    },
  },

  passes: {
    label: `회원권 관리`,
    url: `/passes`,
  },

  profile: {
    label: `프로필`,
    url: `/profile`,

    edit: {
      label: `프로필 수정`,
      url: `/profile/edit`,
    },
  },

  records: {
    label: `기록`,
    url: `/records`,

    detail: {
      label: `기록 상세`,
      url: (recordId: string) => `/records/${recordId}`,
    },
    create: {
      label: `기록 생성`,
      url: `/records/create`,
    },
    edit: {
      label: `기록 수정`,
      url: (recordId: string) => `/records/${recordId}/edit`,
    },
  },

  settings: {
    label: `설정`,
    url: `/settings`,
  },

  stats: {
    label: `통계`,
    url: `/stats`,
  },

  info: {
    climbing: {
      label: `실내 클라이밍 가이드`,
      url: `/info/climbing`,
    },
    grades: {
      label: `난이도 가이드`,
      url: `/info/grades`,
    },
  },
} as const;
