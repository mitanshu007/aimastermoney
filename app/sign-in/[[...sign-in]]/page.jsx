import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-slate-50 px-4 py-12">
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-blue-200/50 blur-3xl" />
      <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-violet-200/50 blur-3xl" />
      <div className="relative">
        <SignIn
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
          forceRedirectUrl="/dashboard"
          appearance={{
            elements: {
              card: "rounded-3xl border border-slate-200 shadow-2xl shadow-slate-900/10",
              headerTitle: "font-black tracking-tight",
              headerSubtitle: "text-slate-500",
              formButtonPrimary: "bg-slate-950 hover:bg-slate-800",
              footerActionLink: "text-blue-600 hover:text-blue-700",
            },
          }}
        />
      </div>
    </main>
  );
}
