import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
 
export async function middleware(request: NextRequest) {
	const session = await auth.api.getSession({
		headers: await headers()
	})
 
	// Check if accessing admin routes
	if (request.nextUrl.pathname.startsWith('/admin')) {
		// Must be logged in
		if (!session?.user) {
			return NextResponse.redirect(new URL("/login?redirect=/admin", request.url));
		}
		
		// Must be admin
		const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
		if (!adminEmail || session.user.email?.toLowerCase() !== adminEmail.toLowerCase()) {
			return NextResponse.redirect(new URL("/?error=unauthorized", request.url));
		}
		
		return NextResponse.next();
	}
	
	// Check if accessing submit route
	if (request.nextUrl.pathname.startsWith('/submit')) {
		if(!session) {
			return NextResponse.redirect(new URL("/login?redirect=/submit", request.url));
		}
	}
 
	return NextResponse.next();
}
 
export const config = {
  runtime: "nodejs",
  matcher: ["/submit", "/admin/:path*"], // Apply middleware to specific routes
};