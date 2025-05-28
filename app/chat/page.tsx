import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import DashboardLayout from "@/components/layout/Dashboard";
import clientPromise from "@/lib/mongodb";
import { ChatPartner } from "@/types";
import ChatPartnerList from "@/components/ChatPartnerList";

export const metadata: Metadata = {
  title: "Chat - SecureChat",
  description: "Secure communications with encryption",
};

async function getChatPartners(userId: string): Promise<ChatPartner[]> {
  const client = await clientPromise;
  const db = client.db();
  
  // Find all users except current user
  const partners = await db.collection("users")
    .find({ _id: { $ne: userId } })
    .project({ password: 0, rsaPrivateKey: 0 })
    .toArray();
  
  // Get last message for each partner
  const partnerDetails = await Promise.all(
    partners.map(async (partner) => {
      const lastMessage = await db.collection("messages")
        .find({
          $or: [
            { senderId: userId, receiverId: partner._id.toString() },
            { senderId: partner._id.toString(), receiverId: userId },
          ],
        })
        .sort({ createdAt: -1 })
        .limit(1)
        .toArray();
      
      // Count unread messages
      const unreadCount = await db.collection("messages")
        .countDocuments({
          senderId: partner._id.toString(),
          receiverId: userId,
          read: { $ne: true },
        });
      
      return {
        _id: partner._id.toString(),
        username: partner.username,
        lastMessage: lastMessage.length > 0 ? lastMessage[0] : undefined,
        unreadCount,
      };
    })
  );
  
  return partnerDetails;
}

export default async function ChatPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/login");
  }
  
  const partners = await getChatPartners(user._id.toString());

  return (
    <DashboardLayout user={user}>
      <div className="h-[calc(100vh-8rem)] flex flex-col">
        <div className="mb-4">
          <h1 className="text-3xl font-bold tracking-tight">Secure Chat</h1>
          <p className="text-muted-foreground mt-1">
            Start a conversation with end-to-end encryption
          </p>
        </div>
        
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 h-full overflow-hidden rounded-lg border">
          <div className="md:col-span-1 h-full">
            <ChatPartnerList partners={partners} />
          </div>
          <div className="hidden md:block md:col-span-2 h-full bg-muted/20 flex items-center justify-center p-4">
            <div className="text-center max-w-md mx-auto space-y-4">
              <h2 className="text-xl font-semibold">Select a conversation</h2>
              <p className="text-muted-foreground">
                Choose a contact from the list to start chatting securely.
                You can select different encryption methods for each message.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}