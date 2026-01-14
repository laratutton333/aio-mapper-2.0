import { DashboardSettingsPage } from "@/components/dashboard/settings-page";

type SearchParams = Record<string, string | string[] | undefined>;

// TODO(nextjs): Revert searchParams typing to `{ searchParams: SearchParams }`
// once Next.js PageProps no longer requires Promise-wrapped searchParams.
// This is a temporary workaround for a Next.js 15.x typing regression.
export default async function DashboardSettingsRoute({
  searchParams
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const demoMode = resolvedSearchParams.demo === "true";
  return <DashboardSettingsPage demoMode={demoMode} />;
}

