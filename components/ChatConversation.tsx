"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Message } from "@/types";
import MessageBubble from "@/components/MessageBubble";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { aesDecrypt } from "@/lib/encryption/aes";
import { tripleDesDecrypt } from "@/lib/encryption/tripledes";
import { rsaDecrypt } from "@/lib/encryption/rsa";
import { ENCRYPTION_METHODS } from "@/lib/constants";

interface ChatConversationProps {
  messages: Message[];
  currentUserId: string;
  currentUserPrivateKey?: string;
  isLoading?: boolean;
  partnerPublicKey?: string;
}

export default function ChatConversation({
  messages,
  currentUserId,
  currentUserPrivateKey,
  isLoading = false,
  partnerPublicKey,
}: ChatConversationProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [decryptedMessages, setDecryptedMessages] = useState<Record<string, boolean>>({});

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleDecrypt = async (message: Message) => {
    if (!message._id) return;
    
    try {
      let decryptResult = { plaintext: "", time: 0 };
      
      if (message.encryptionMethod === ENCRYPTION_METHODS.AES) {
        // For simplicity, we're using a fixed key in this demo
        // In a real app, this would be securely exchanged and stored
        const secretKey = "your-secret-key";
        decryptResult = aesDecrypt(message.encryptedContent || "", secretKey);
      } else if (message.encryptionMethod === ENCRYPTION_METHODS.TRIPLE_DES) {
        // For simplicity, we're using a fixed key in this demo
        const secretKey = "your-triple-des-key";
        decryptResult = tripleDesDecrypt(message.encryptedContent || "", secretKey);
      } else if (message.encryptionMethod === ENCRYPTION_METHODS.RSA) {
        if (!currentUserPrivateKey) {
          console.error("Private key not available for RSA decryption");
          return;
        }
        decryptResult = rsaDecrypt(message.encryptedContent || "", currentUserPrivateKey);
      }
      
      // Update message with decryption time
      await fetch(`/api/messages/${message._id}/decrypt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decryptionTime: decryptResult.time,
        }),
      });
      
      // Mark message as decrypted locally
      setDecryptedMessages(prev => ({
        ...prev,
        [message._id as string]: true
      }));
      
      // Refresh data
      router.refresh();
    } catch (error) {
      console.error("Error decrypting message:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-4 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
            <Skeleton className="h-[100px] w-[300px] rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <ScrollArea className="h-[500px] p-4">
      <div className="flex flex-col space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground p-4">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message._id}
              message={message}
              isCurrentUser={message.senderId === currentUserId}
              onDecrypt={() => handleDecrypt(message)}
              isDecrypted={message._id ? decryptedMessages[message._id] : false}
            />
          ))
        )}
        <div ref={scrollRef} />
      </div>
    </ScrollArea>
  );
}