import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const plan =
    typeof user?.user_metadata?.plan === "string"
      ? user.user_metadata.plan
      : typeof user?.app_metadata?.plan === "string"
        ? user.app_metadata.plan
        : null;

  return (
    <DashboardShell userEmail={user?.email ?? null} plan={plan}>
      {children}
    </DashboardShell>
  );
}
