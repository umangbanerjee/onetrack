import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { clerkAppearance } from "@/lib/clerk";

export default function SignUpPage() {
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
          Create an account to track your job search
        </p>
      </div>

      <SignUp
        appearance={clerkAppearance}
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
      />
    </div>
  );
}
