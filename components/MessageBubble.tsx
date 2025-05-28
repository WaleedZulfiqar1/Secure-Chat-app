"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Lock, Unlock, Clock, Shield, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { Message } from "@/types";
import { ENCRYPTION_COLORS, ENCRYPTION_METHODS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  onDecrypt?: () => void;
  isDecrypted?: boolean;
}

export default function MessageBubble({ 
  message, 
  isCurrentUser, 
  onDecrypt,
  isDecrypted = false
}: MessageBubbleProps) {
  const [showEncrypted, setShowEncrypted] = useState(!isDecrypted);
  
  const formattedTime = message.createdAt ? 
    formatDistanceToNow(new Date(message.createdAt), { addSuffix: true }) : 
    '';
  
  const getEncryptionIcon = () => {
    switch (message.encryptionMethod) {
      case ENCRYPTION_METHODS.NONE:
        return <ShieldAlert className="h-4 w-4 text-gray-400" />;
      case ENCRYPTION_METHODS.AES:
        return <Lock className="h-4 w-4 text-blue-500" />;
      case ENCRYPTION_METHODS.TRIPLE_DES:
        return <Lock className="h-4 w-4 text-green-500" />;
      case ENCRYPTION_METHODS.RSA:
        return <Shield className="h-4 w-4 text-purple-500" />;
      default:
        return null;
    }
  };

  const handleToggleView = () => {
    if (message.encryptionMethod === ENCRYPTION_METHODS.NONE) return;
    
    if (showEncrypted && onDecrypt) {
      onDecrypt();
    }
    
    setShowEncrypted(!showEncrypted);
  };

  const messageContent = showEncrypted ? 
    (message.encryptedContent || message.content) : 
    message.content;

  return (
    <div className={cn(
      "flex w-full max-w-md",
      isCurrentUser ? "ml-auto justify-end" : "mr-auto justify-start"
    )}>
      <div className={cn(
        "rounded-lg px-4 py-2 max-w-[80%]",
        isCurrentUser ? 
          "bg-primary text-primary-foreground rounded-br-none" : 
          "bg-muted text-foreground rounded-bl-none"
      )}>
        <div className="flex items-center space-x-2 mb-1">
          {getEncryptionIcon()}
          <span className={cn(
            "text-xs font-medium",
            ENCRYPTION_COLORS[message.encryptionMethod]
          )}>
            {message.encryptionMethod !== ENCRYPTION_METHODS.NONE ? 
              message.encryptionMethod.toUpperCase() : 
              "UNENCRYPTED"}
          </span>
          
          {message.isIntercepted && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-red-500 text-xs font-medium flex items-center">
                    <ShieldAlert className="h-3 w-3 mr-1" />
                    INTERCEPTED
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>This message was intercepted by an admin</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        
        <p className="text-sm whitespace-pre-wrap break-words">
          {messageContent}
        </p>
        
        <div className="flex items-center justify-between mt-1 text-xs opacity-70">
          <span>{formattedTime}</span>
          
          {message.encryptionMethod !== ENCRYPTION_METHODS.NONE && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-1 text-xs"
              onClick={handleToggleView}
            >
              {showEncrypted ? (
                <span className="flex items-center">
                  <Unlock className="h-3 w-3 mr-1" /> Decrypt
                </span>
              ) : (
                <span className="flex items-center">
                  <Lock className="h-3 w-3 mr-1" /> Encrypted
                </span>
              )}
            </Button>
          )}
          
          {(message.encryptionTime || message.decryptionTime) && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {message.encryptionTime?.toFixed(2) || 0}ms
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <div className="text-xs">
                    <p>Encryption: {message.encryptionTime?.toFixed(2) || 0}ms</p>
                    <p>Decryption: {message.decryptionTime?.toFixed(2) || 0}ms</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </div>
  );
}