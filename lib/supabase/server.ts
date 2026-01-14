import { cookies } from "next/headers";
import { createServerClient, type SetAllCookies } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

import { getPublicEnv } from "@/lib/env.public";
import { getSupabaseServiceRoleEnv } from "@/lib/env.server";

export async function createSupabaseServerClient() {
  const publicEnv = getPublicEnv();
  const cookieStore = await cookies();

  return createServerClient(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: Parameters<SetAllCookies>[0]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        }
      }
    }
  );
}

export function createSupabaseAdminClient() {
  const publicEnv = getPublicEnv();
  const serverEnv = getSupabaseServiceRoleEnv();
  return createClient(publicEnv.NEXT_PUBLIC_SUPABASE_URL, serverEnv.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
  });
}
