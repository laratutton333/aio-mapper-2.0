import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-4xl font-semibold tracking-tight">Sign in</h1>
      <p className="mt-4 text-sm text-slate-300">
        Placeholder sign-in page during UI porting. Wire this to Supabase Auth when ready.
      </p>
      <div className="mt-6 text-sm text-slate-300">
        Need an account?{" "}
        <Link href="/account" className="text-blue-400 hover:underline">
          Create one →
        </Link>
      </div>
    </div>
  );
}

