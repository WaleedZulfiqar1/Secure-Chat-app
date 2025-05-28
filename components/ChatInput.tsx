"use client";

import { useState } from "react";
import { Send, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import EncryptionSelector from "@/components/EncryptionSelector";
import { ENCRYPTION_METHODS, EncryptionMethod } from "@/lib/constants";
import { aesEncrypt } from "@/lib/encryption/aes";
import { tripleDesEncrypt } from "@/lib/encryption/tripledes";
import { rsaEncrypt } from "@/lib/encryption/rsa";

interface ChatInputProps {
  onSendMessage: (
    content: string, 
    encryptionMethod: EncryptionMethod, 
    encryptedContent?: string,
    encryptionTime?: number
  ) => void;
  partnerPublicKey?: string;
}

export default function ChatInput({ onSendMessage, partnerPublicKey }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [encryptionMethod, setEncryptionMethod] = useState<EncryptionMethod>(ENCRYPTION_METHODS.NONE);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim() || isSending) return;
    
    setIsSending(true);
    
    try {
      let encryptedContent: string | undefined;
      let encryptionTime: number | undefined;
      
      // Encrypt message if encryption method is selected
      if (encryptionMethod === ENCRYPTION_METHODS.AES) {
        // For simplicity, we're using a fixed key in this demo
        // In a real app, this would be securely exchanged and stored
        const secretKey = "your-secret-key";
        const result = aesEncrypt(message, secretKey);
        encryptedContent = result.ciphertext;
        encryptionTime = result.time;
      } else if (encryptionMethod === ENCRYPTION_METHODS.TRIPLE_DES) {
        // For simplicity, we're using a fixed key in this demo
        const secretKey = "your-triple-des-key";
        const result = tripleDesEncrypt(message, secretKey);
        encryptedContent = result.ciphertext;
        encryptionTime = result.time;
      } else if (encryptionMethod === ENCRYPTION_METHODS.RSA) {
        if (!partnerPublicKey) {
          console.error("Public key not available for RSA encryption");
          return;
        }
        const result = rsaEncrypt(message, partnerPublicKey);
        encryptedContent = result.ciphertext;
        encryptionTime = result.time;
      }
      
      // Send message to parent component
      onSendMessage(message, encryptionMethod, encryptedContent, encryptionTime);
      
      // Clear input
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t p-4 space-y-4">
      <EncryptionSelector 
        value={encryptionMethod} 
        onChange={setEncryptionMethod} 
      />
      
      <div className="flex items-end gap-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="resize-none min-h-[80px]"
        />
        <Button 
          onClick={handleSubmit}
          disabled={!message.trim() || isSending}
          size="icon"
          className="h-10 w-10"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      
      {encryptionMethod !== ENCRYPTION_METHODS.NONE && (
        <div className="text-xs flex items-center text-muted-foreground">
          <Lock className="h-3 w-3 mr-1" />
          <span>
            Messages are encrypted with {encryptionMethod.toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
}