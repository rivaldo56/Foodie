export default function AuthPage() {
  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input type="email" className="mt-1 w-full rounded border px-3 py-2" placeholder="you@example.com" />
        </div>
        <button className="w-full rounded bg-black px-4 py-2 text-white">Continue</button>
      </form>
      <button className="w-full rounded border border-black px-4 py-2">Continue with Google</button>
      <p className="text-sm text-gray-600">Passwordless and Google sign-in will be wired via Supabase Auth.</p>
    </div>
  );
}
