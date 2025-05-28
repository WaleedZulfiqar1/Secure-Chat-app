import Link from "next/link";
import { Metadata } from "next";
import LoginForm from "@/components/LoginForm";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Login - SecureChat",
  description: "Sign in to your SecureChat account",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="flex items-center">
            <ShieldCheck className="h-8 w-8 mr-2" />
            <span className="text-2xl font-bold">SecureChat</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold tracking-tight">
            Sign in to your account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your credentials to access your secure communications
          </p>
        </div>
        
        <div className="bg-card border rounded-lg p-8 shadow-sm">
          <LoginForm />
          
          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-primary hover:text-primary/90"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
        
        <div className="text-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}