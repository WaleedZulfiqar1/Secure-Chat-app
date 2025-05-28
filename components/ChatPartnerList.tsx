"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Plus, User } from "lucide-react";
import { ChatPartner } from "@/types";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ChatPartnerListProps {
  partners: ChatPartner[];
}

export default function ChatPartnerList({ partners }: ChatPartnerListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [newUserDialog, setNewUserDialog] = useState(false);
  const pathname = usePathname();
  
  const filteredPartners = partners.filter((partner) =>
    partner.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="h-full flex flex-col border-r">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search conversations..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredPartners.length > 0 ? (
            filteredPartners.map((partner) => (
              <Link href={`/chat/${partner._id}`} key={partner._id}>
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-secondary/80 transition-colors",
                    pathname === `/chat/${partner._id}` && "bg-secondary"
                  )}
                >
                  <Avatar>
                    <AvatarFallback>
                      {getInitials(partner.username)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{partner.username}</p>
                    {partner.lastMessage && (
                      <p className="text-xs text-muted-foreground truncate">
                        {partner.lastMessage.content}
                      </p>
                    )}
                  </div>
                  {partner.unreadCount && partner.unreadCount > 0 ? (
                    <div className="bg-primary text-primary-foreground text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                      {partner.unreadCount}
                    </div>
                  ) : null}
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center text-muted-foreground p-4">
              No conversations found
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t">
        <Dialog open={newUserDialog} onOpenChange={setNewUserDialog}>
          <DialogTrigger asChild>
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              New Conversation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Start a new conversation</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="relative">
                <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Enter username..."
                  className="pl-8"
                />
              </div>
              <Button className="w-full">
                Start Conversation
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}