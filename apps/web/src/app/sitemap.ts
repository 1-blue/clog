import { MetadataRoute } from "next";

import { prisma } from "@clog/db";

import { DEFAULT_SITEMAP, ISitemap, ROUTES } from "#web/constants";

const baseUrl = () =>
  (process.env.NEXT_PUBLIC_CLIENT_URL ?? "https://clog.story-dict.com").replace(
    /\/$/,
    "",
  );

const toSitemapEntry = (
  path: string,
  { priority, changefreq, lastModified }: ISitemap = DEFAULT_SITEMAP,
): MetadataRoute.Sitemap[number] => ({
  url: `${baseUrl()}${path.startsWith("/") ? path : `/${path}`}`,
  lastModified: lastModified ?? new Date(DEFAULT_SITEMAP.lastModified),
  changeFrequency: changefreq ?? DEFAULT_SITEMAP.changefreq,
  priority: priority ?? DEFAULT_SITEMAP.priority,
});

/** 공개·색인 대상 정적 라우트 (로그인 전용·작성 화면은 제외) */
const getStaticRoutes = (): MetadataRoute.Sitemap => [
  toSitemapEntry(ROUTES.HOME.path, {
    priority: 1,
    changefreq: "daily" as const,
    lastModified: new Date().toISOString(),
  }),
  toSitemapEntry(ROUTES.GYMS.path, {
    priority: 0.9,
    changefreq: "daily" as const,
    lastModified: new Date().toISOString(),
  }),
  toSitemapEntry(ROUTES.COMMUNITY.path, {
    priority: 0.9,
    changefreq: "daily" as const,
    lastModified: new Date().toISOString(),
  }),
];

const getGymDetailRoutes = async (): Promise<MetadataRoute.Sitemap> => {
  const gyms = await prisma.gym.findMany({
    select: { id: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });

  return gyms.map((g) =>
    toSitemapEntry(ROUTES.GYMS.DETAIL.path(g.id), {
      priority: 0.8,
      changefreq: "weekly",
      lastModified: g.updatedAt.toISOString(),
    }),
  );
};

const getCommunityPostRoutes = async (): Promise<MetadataRoute.Sitemap> => {
  const posts = await prisma.post.findMany({
    select: { id: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });

  return posts.map((p) =>
    toSitemapEntry(ROUTES.COMMUNITY.DETAIL.path(p.id), {
      priority: 0.7,
      changefreq: "weekly",
      lastModified: p.updatedAt.toISOString(),
    }),
  );
};

/** DB 반영 주기 (초) — 요청마다 Prisma 호출 완화 */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = getStaticRoutes();

  try {
    const [gymRoutes, postRoutes] = await Promise.all([
      getGymDetailRoutes(),
      getCommunityPostRoutes(),
    ]);

    return [...staticRoutes, ...gymRoutes, ...postRoutes];
  } catch (error) {
    console.error("🚫 사이트맵 생성 실패 (정적 라우트만 반환) >> ", error);
    return staticRoutes;
  }
}
