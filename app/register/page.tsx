import Link from "next/link";
import { Metadata } from "next";
import RegisterForm from "@/components/RegisterForm";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Register - SecureChat",
  description: "Create a new SecureChat account",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="flex items-center">
            <ShieldCheck className="h-8 w-8 mr-2" />
            <span className="text-2xl font-bold">SecureChat</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold tracking-tight">
            Create an account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Join SecureChat to experience secure communications
          </p>
        </div>
        
        <div className="bg-card border rounded-lg p-8 shadow-sm">
          <RegisterForm />
          
          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:text-primary/90"
              >
                Sign in
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