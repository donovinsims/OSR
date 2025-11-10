import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

/**
 * Check if a user email matches the admin email
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  if (!adminEmail) {
    console.warn('NEXT_PUBLIC_ADMIN_EMAIL environment variable is not set');
    return false;
  }
  
  return email.toLowerCase() === adminEmail.toLowerCase();
}

/**
 * Check if the current authenticated user is an admin (for API routes)
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });
    
    if (!session?.user?.email) {
      return false;
    }
    
    return isAdminEmail(session.user.email);
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

/**
 * Get current user session and check if admin (for API routes)
 * @deprecated Use isAdmin() instead
 */
export async function requireAdmin(request?: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  
  if (!session?.user) {
    return { authorized: false, user: null };
  }
  
  const isUserAdmin = isAdminEmail(session.user.email);
  
  return {
    authorized: isUserAdmin,
    user: session.user
  };
}