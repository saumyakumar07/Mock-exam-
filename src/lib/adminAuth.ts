import { cookies } from "next/headers";

export const ADMIN_COOKIE = "examprep_admin";

export async function isAdminAuthed(): Promise<boolean> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE)?.value === password;
}

export function isAdminConfigured(): boolean {
  return !!process.env.ADMIN_PASSWORD;
}
