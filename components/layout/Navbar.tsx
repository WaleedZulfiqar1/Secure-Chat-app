"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ShieldCheck, Menu, X, MessageSquare, BarChart2, BookOpen, ShieldAlert, LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface NavbarProps {
  isLoggedIn?: boolean;
  isAdmin?: boolean;
  username?: string;
}

const mainNavItems = [
  {
    title: "Chat",
    href: "/chat",
    icon: <MessageSquare className="h-4 w-4 mr-2" />,
  },
  {
    title: "Performance",
    href: "/performance",
    icon: <BarChart2 className="h-4 w-4 mr-2" />,
  },
  {
    title: "Learn",
    href: "/learn",
    icon: <BookOpen className="h-4 w-4 mr-2" />,
  },
];

const adminNavItems = [
  {
    title: "Admin Panel",
    href: "/admin",
    icon: <ShieldAlert className="h-4 w-4 mr-2" />,
  },
];

export default function Navbar({ isLoggedIn = false, isAdmin = false, username }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center mr-6">
          <ShieldCheck className="h-6 w-6 mr-2" />
          <span className="font-bold">SecureChat</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6 text-sm">
          {mainNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center transition-colors hover:text-foreground/80",
                pathname?.startsWith(item.href)
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
          
          {isAdmin && adminNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center transition-colors hover:text-foreground/80",
                pathname?.startsWith(item.href)
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </div>
        
        <div className="flex-1"></div>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost\" className="relative h-8 w-8 rounded-full">
                  <div className="flex items-center justify-center h-full w-full text-xs font-bold">
                    {username?.slice(0, 2).toUpperCase() || "U"}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
          
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <Link href="/" className="flex items-center mb-8" onClick={() => setOpen(false)}>
                <ShieldCheck className="h-6 w-6 mr-2" />
                <span className="font-bold">SecureChat</span>
              </Link>
              
              <nav className="flex flex-col gap-4">
                {mainNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center py-2 text-base transition-colors hover:text-foreground/80",
                      pathname?.startsWith(item.href)
                        ? "text-foreground"
                        : "text-foreground/60"
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {item.icon}
                    {item.title}
                  </Link>
                ))}
                
                {isAdmin && adminNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center py-2 text-base transition-colors hover:text-foreground/80",
                      pathname?.startsWith(item.href)
                        ? "text-foreground"
                        : "text-foreground/60"
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {item.icon}
                    {item.title}
                  </Link>
                ))}
                
                {isLoggedIn && (
                  <Button variant="outline" onClick={handleLogout} className="mt-4">
                    <LogOut className="h-4 w-4 mr-2" />
                    Log out
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}