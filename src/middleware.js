import { NextResponse } from "next/server";

// NOTE: Middleware server pe chalta hai, isliye localStorage access nahi kar
// sakta. Isliye token cookie mein bhi save hota hai (AuthContext dekho).
export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isPublicPath = pathname === "/login";

  // Agar user logged out hai aur protected page kholne ki koshish kar raha
  // hai -> login page pe bhejo.
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Agar user already logged in hai aur login page pe jaane ki koshish kare
  // -> use products list pe bhej do.
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/products", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};