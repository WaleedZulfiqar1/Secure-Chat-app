"use client";

import { useState } from "react";
import { Check, Lock, Shield, ShieldAlert } from "lucide-react";
import { ENCRYPTION_METHODS, EncryptionMethod } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type EncryptionOption = {
  value: EncryptionMethod;
  label: string;
  icon: React.ReactNode;
  description: string;
  color: string;
};

const encryptionOptions: EncryptionOption[] = [
  {
    value: ENCRYPTION_METHODS.NONE,
    label: "None",
    icon: <ShieldAlert className="h-5 w-5" />,
    description: "No encryption. Messages are sent as plain text and are vulnerable to interception.",
    color: "border-gray-300 text-gray-500 hover:border-gray-400",
  },
  {
    value: ENCRYPTION_METHODS.AES,
    label: "AES",
    icon: <Lock className="h-5 w-5" />,
    description: "Advanced Encryption Standard. Fast and secure symmetric encryption.",
    color: "border-blue-300 text-blue-500 hover:border-blue-400",
  },
  {
    value: ENCRYPTION_METHODS.TRIPLE_DES,
    label: "3DES",
    icon: <Lock className="h-5 w-5" />,
    description: "Triple Data Encryption Standard. A symmetric block cipher that applies DES three times.",
    color: "border-green-300 text-green-500 hover:border-green-400",
  },
  {
    value: ENCRYPTION_METHODS.RSA,
    label: "RSA",
    icon: <Shield className="h-5 w-5" />,
    description: "Rivest-Shamir-Adleman. An asymmetric encryption algorithm using public/private key pairs.",
    color: "border-purple-300 text-purple-500 hover:border-purple-400",
  },
];

interface EncryptionSelectorProps {
  value: EncryptionMethod;
  onChange: (value: EncryptionMethod) => void;
}

export default function EncryptionSelector({ value, onChange }: EncryptionSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <TooltipProvider>
        {encryptionOptions.map((option) => (
          <Tooltip key={option.value}>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => onChange(option.value)}
                className={cn(
                  "flex items-center gap-2 rounded-md border px-3 py-2 transition-all",
                  option.color,
                  value === option.value ? "ring-2 ring-offset-2" : ""
                )}
              >
                {option.icon}
                <span>{option.label}</span>
                {value === option.value && (
                  <Check className="ml-1 h-4 w-4" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              <p>{option.description}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
}