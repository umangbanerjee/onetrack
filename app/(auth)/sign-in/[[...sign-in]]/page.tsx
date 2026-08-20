import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { clerkAppearance } from "@/lib/clerk";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-mono flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-primary selection:text-primary-foreground">
      {/* Brand Header */}
      <div className="mb-6 flex flex-col items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-bold text-sm bg-primary text-primary-foreground px-2 py-0.5 rounded-sm tracking-wider">
            ONETRACK
          </span>
          <span className="text-xs text-muted-foreground">
            [v1.0]
          </span>
        </Link>
        <p className="text-xs text-muted-foreground text-center">
          Sign in to your application tracking workspace
        </p>
      </div>

      <SignIn
        appearance={clerkAppearance}
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
      />
    </div>
  );
}
