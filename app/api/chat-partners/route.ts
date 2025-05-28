import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db();
    
    // Find all users except current user
    const partners = await db.collection("users")
      .find({ _id: { $ne: user._id } })
      .project({ password: 0, rsaPrivateKey: 0 }) // Exclude sensitive data
      .toArray();
    
    // Get last message for each partner
    const partnerDetails = await Promise.all(
      partners.map(async (partner) => {
        const lastMessage = await db.collection("messages")
          .find({
            $or: [
              { senderId: user._id.toString(), receiverId: partner._id.toString() },
              { senderId: partner._id.toString(), receiverId: user._id.toString() },
            ],
          })
          .sort({ createdAt: -1 })
          .limit(1)
          .toArray();
        
        // Count unread messages
        const unreadCount = await db.collection("messages")
          .countDocuments({
            senderId: partner._id.toString(),
            receiverId: user._id.toString(),
            read: { $ne: true },
          });
        
        return {
          _id: partner._id.toString(),
          username: partner.username,
          lastMessage: lastMessage.length > 0 ? lastMessage[0] : null,
          unreadCount,
        };
      })
    );
    
    return NextResponse.json({ partners: partnerDetails });
  } catch (error) {
    console.error("Error fetching chat partners:", error);
    return NextResponse.json(
      { message: "Failed to fetch chat partners" },
      { status: 500 }
    );
  }
}