import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import { getCurrentUser } from "@/lib/auth";
import DashboardLayout from "@/components/layout/Dashboard";
import clientPromise from "@/lib/mongodb";
import { ChatPartner, Message, User } from "@/types";
import ChatPartnerList from "@/components/ChatPartnerList";
import ChatConversation from "@/components/ChatConversation";
import ChatInput from "@/components/ChatInput";

export const metadata: Metadata = {
  title: "Chat Conversation - SecureChat",
  description: "Secure conversation with encryption",
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

async function getMessages(userId: string, partnerId: string): Promise<Message[]> {
  const client = await clientPromise;
  const db = client.db();
  
  // Get messages between current user and partner
  const messages = await db.collection("messages")
    .find({
      $or: [
        { senderId: userId, receiverId: partnerId },
        { senderId: partnerId, receiverId: userId },
      ],
    })
    .sort({ createdAt: 1 })
    .toArray();
  
  return messages;
}

async function getPartnerDetails(partnerId: string): Promise<User | null> {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const partner = await db.collection("users").findOne(
      { _id: new ObjectId(partnerId) },
      { projection: { password: 0 } }
    );
    
    return partner;
  } catch (error) {
    console.error("Error fetching partner details:", error);
    return null;
  }
}

export default async function ChatConversationPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/login");
  }
  
  const partner = await getPartnerDetails(params.id);
  
  if (!partner) {
    notFound();
  }
  
  const partners = await getChatPartners(user._id.toString());
  const messages = await getMessages(user._id.toString(), params.id);

  return (
    <DashboardLayout user={user}>
      <div className="h-[calc(100vh-8rem)] flex flex-col">
        <div className="mb-4">
          <h1 className="text-3xl font-bold tracking-tight">Conversation with {partner.username}</h1>
          <p className="text-muted-foreground mt-1">
            Choose your encryption method for secure communication
          </p>
        </div>
        
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 h-full overflow-hidden rounded-lg border">
          <div className="md:col-span-1 h-full">
            <ChatPartnerList partners={partners} />
          </div>
          <div className="md:col-span-2 h-full flex flex-col">
            <div className="border-b p-4 flex items-center">
              <div>
                <h2 className="font-semibold">{partner.username}</h2>
                <p className="text-xs text-muted-foreground">Click on encrypted messages to decrypt them</p>
              </div>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <ChatConversation
                messages={messages}
                currentUserId={user._id.toString()}
                currentUserPrivateKey={user.rsaPrivateKey}
                partnerPublicKey={partner.rsaPublicKey}
              />
            </div>
            
            <ChatInput
              onSendMessage={async () => {}}
              partnerPublicKey={partner.rsaPublicKey}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}