import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/** 인증이 필요한 경로 패턴 */
const AUTH_ROUTES = [
  "/my",
  "/records",
  "/statistics",
  "/notifications",
  "/community/create",
  "/community/edit",
];

/** /gyms/:gymId/review 및 하위 (작성·수정) */
const isGymReviewAuthRoute = (pathname: string) =>
  /^\/gyms\/[^/]+\/review(\/.*)?$/.test(pathname);

const isAuthRoute = (pathname: string) => {
  if (isGymReviewAuthRoute(pathname)) return true;
  return AUTH_ROUTES.some((route) => {
    if (route.includes("*")) {
      const regex = new RegExp(`^${route.replace(/\*/g, "[^/]+")}$`);
      return regex.test(pathname);
    }
    return pathname === route || pathname.startsWith(`${route}/`);
  });
};

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  if (isAuthRoute(pathname) && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
