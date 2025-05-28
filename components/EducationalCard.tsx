"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Shield, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface EducationalCardProps {
  title: string;
  description: string;
  content: string;
  icon: "aes" | "tripledes" | "rsa" | "attack";
  learnMoreLink?: string;
}

export default function EducationalCard({
  title,
  description,
  content,
  icon,
  learnMoreLink,
}: EducationalCardProps) {
  const getIcon = () => {
    switch (icon) {
      case "aes":
        return <Lock className="h-6 w-6 text-blue-500" />;
      case "tripledes":
        return <Lock className="h-6 w-6 text-green-500" />;
      case "rsa":
        return <Shield className="h-6 w-6 text-purple-500" />;
      case "attack":
        return <ShieldAlert className="h-6 w-6 text-red-500" />;
      default:
        return null;
    }
  };

  const getHeaderClass = () => {
    switch (icon) {
      case "aes":
        return "border-b-blue-500";
      case "tripledes":
        return "border-b-green-500";
      case "rsa":
        return "border-b-purple-500";
      case "attack":
        return "border-b-red-500";
      default:
        return "";
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className={cn("border-b-2", getHeaderClass())}>
        <div className="flex items-center gap-2">
          {getIcon()}
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 flex-1">
        <div className="text-sm">{content}</div>
      </CardContent>
      {learnMoreLink && (
        <CardFooter>
          <Button
            variant="outline"
            asChild
            className="w-full"
          >
            <a href={learnMoreLink} target="_blank" rel="noopener noreferrer">
              Learn More
            </a>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}