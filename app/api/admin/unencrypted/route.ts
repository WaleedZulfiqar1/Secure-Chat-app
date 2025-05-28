import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import { USER_ROLES, ENCRYPTION_METHODS } from "@/lib/constants";

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.role !== USER_ROLES.ADMIN) {
      return NextResponse.json(
        { message: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db();
    
    // Find unencrypted messages
    const messages = await db.collection("messages")
      .find({ encryptionMethod: ENCRYPTION_METHODS.NONE })
      .sort({ createdAt: -1 })
      .toArray();
    
    // Get user details for each message
    const messagesWithUserDetails = await Promise.all(
      messages.map(async (message) => {
        const sender = await db.collection("users").findOne(
          { _id: new ObjectId(message.senderId) },
          { projection: { username: 1 } }
        );
        
        const receiver = await db.collection("users").findOne(
          { _id: new ObjectId(message.receiverId) },
          { projection: { username: 1 } }
        );
        
        return {
          ...message,
          senderName: sender?.username || "Unknown",
          receiverName: receiver?.username || "Unknown",
        };
      })
    );
    
    return NextResponse.json({ messages: messagesWithUserDetails });
  } catch (error) {
    console.error("Error fetching unencrypted messages:", error);
    return NextResponse.json(
      { message: "Failed to fetch unencrypted messages" },
      { status: 500 }
    );
  }
}