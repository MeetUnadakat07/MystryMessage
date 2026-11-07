import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
    const token = await getToken({ req: request });
    const url = request.nextUrl.clone(); // Cloned for safe URL mutations

    // Define public paths where authenticated users shouldn't go
    const isPublicAuthPage =
        url.pathname.startsWith("/sign-in") ||
        url.pathname.startsWith("/sign-up") ||
        url.pathname.startsWith("/verify") ||
        url.pathname === "/"; // Exact match only to avoid infinite loops

    if (token) {
        // If logged in, don't let them visit sign-in/up pages; send them to dashboard
        if (isPublicAuthPage) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        // Let them proceed to their destination (like /dashboard/*)
        return NextResponse.next();
    }

    // If NOT logged in and trying to access a protected page
    if (!isPublicAuthPage) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // Otherwise, allow access to public pages
    return NextResponse.next();
}

export const config = {
    // Make sure all routes start with a leading slash
    matcher: [
        "/",
        "/sign-in",
        "/sign-up",
        "/verify/:path*",
        "/dashboard/:path*",
    ],
};
