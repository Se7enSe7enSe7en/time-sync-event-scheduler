import { serverSupabaseUser } from "#supabase/server";
import type { H3Event } from "h3";

// ============================================================
// WHAT: Shared auth extraction utility
// WHY:  Every API handler currently duplicates the same 6 lines
//       of auth code. This extracts it into a reusable helper.
//
// USAGE (in any API handler):
//   const { userId, email } = await requireAuth(event);
//
// RETURNS: { userId: string, email: string }
// THROWS:  401 if not authenticated
// ============================================================

export async function requireAuth(event: H3Event) {
  const user = await serverSupabaseUser(event);
  const userId = user?.sub;
  const email = user?.email;

  if (!userId || !email) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  return { userId, email };
}
