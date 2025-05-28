import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import DashboardLayout from "@/components/layout/Dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, BarChart2, BookOpen, User, ShieldAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard - SecureChat",
  description: "SecureChat user dashboard",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/login");
  }
  
  const dashboardItems = [
    {
      title: "Secure Chat",
      description: "Start secure conversations with end-to-end encryption",
      icon: <MessageSquare className="h-8 w-8 text-blue-500" />,
      href: "/chat",
      color: "border-blue-200 hover:border-blue-300 bg-blue-50/50 dark:bg-blue-900/20",
    },
    {
      title: "Performance Metrics",
      description: "Compare encryption methods with visual analytics",
      icon: <BarChart2 className="h-8 w-8 text-green-500" />,
      href: "/performance",
      color: "border-green-200 hover:border-green-300 bg-green-50/50 dark:bg-green-900/20",
    },
    {
      title: "Learn",
      description: "Educational resources on encryption and security",
      icon: <BookOpen className="h-8 w-8 text-purple-500" />,
      href: "/learn",
      color: "border-purple-200 hover:border-purple-300 bg-purple-50/50 dark:bg-purple-900/20",
    },
    {
      title: "Profile",
      description: "Manage your account and security settings",
      icon: <User className="h-8 w-8 text-orange-500" />,
      href: "/profile",
      color: "border-orange-200 hover:border-orange-300 bg-orange-50/50 dark:bg-orange-900/20",
    },
  ];
  
  // Add admin panel item for admin users
  if (user.role === "admin") {
    dashboardItems.push({
      title: "Admin Panel",
      description: "Access logs and perform MITM attack demonstrations",
      icon: <ShieldAlert className="h-8 w-8 text-red-500" />,
      href: "/admin",
      color: "border-red-200 hover:border-red-300 bg-red-50/50 dark:bg-red-900/20",
    });
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {user.username}!</h1>
          <p className="text-muted-foreground mt-2">
            Explore the secure communication suite and learn about encryption
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {dashboardItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Card className={`transition-all duration-200 hover:shadow-md border-2 ${item.color}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>{item.title}</CardTitle>
                    {item.icon}
                  </div>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-primary">Click to access</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}