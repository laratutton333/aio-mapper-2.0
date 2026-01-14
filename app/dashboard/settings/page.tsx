import Link from "next/link";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
  return (
    <>
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Phase 1 configuration lives in prompt templates.
        </p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Prompt Templates</CardTitle>
            <CardDescription>
              Manage the fixed prompt library used by audits.
            </CardDescription>
          </CardHeader>
          <div className="px-4 pb-4">
            <Link className="text-sm text-blue-600 hover:underline dark:text-blue-400" href="/prompts">
              Go to `/prompts`
            </Link>
          </div>
        </Card>
      </div>
    </>
  );
}

