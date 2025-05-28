"use client";

import { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import { User } from "@/types";
import { USER_ROLES } from "@/lib/constants";

interface DashboardLayoutProps {
  children: ReactNode;
  user?: User | null;
}

export default function DashboardLayout({ children, user }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar 
        isLoggedIn={!!user} 
        isAdmin={user?.role === USER_ROLES.ADMIN}
        username={user?.username}
      />
      <main className="flex-1 container py-6">{children}</main>
    </div>
  );
}