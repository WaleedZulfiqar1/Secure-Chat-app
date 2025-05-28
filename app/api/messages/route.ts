import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import { ENCRYPTION_METHODS } from "@/lib/constants";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const partnerId = searchParams.get("partnerId");
    
    if (!partnerId) {
      return NextResponse.json(
        { message: "Partner ID is required" },
        { status: 400 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db();
    
    // Get messages between current user and partner
    const messages = await db.collection("messages")
      .find({
        $or: [
          { senderId: user._id.toString(), receiverId: partnerId },
          { senderId: partnerId, receiverId: user._id.toString() },
        ],
      })
      .sort({ createdAt: 1 })
      .toArray();
    
    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { message: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const { content, receiverId, encryptionMethod, encryptedContent, encryptionTime } = await request.json();
    
    if (!content || !receiverId) {
      return NextResponse.json(
        { message: "Content and receiver ID are required" },
        { status: 400 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db();
    
    // Create new message
    const newMessage = {
      content,
      encryptedContent: encryptedContent || content, // If not encrypted, store plain content
      senderId: user._id.toString(),
      receiverId,
      encryptionMethod: encryptionMethod || ENCRYPTION_METHODS.NONE,
      encryptionTime,
      createdAt: new Date(),
    };
    
    const result = await db.collection("messages").insertOne(newMessage);
    
    // If using encryption, store statistics
    if (encryptionMethod !== ENCRYPTION_METHODS.NONE && encryptionTime) {
      await db.collection("encryptionStats").insertOne({
        method: encryptionMethod,
        messageLength: content.length,
        encryptionTime,
        decryptionTime: 0, // Will be updated when message is decrypted
        userId: user._id.toString(),
        createdAt: new Date(),
      });
    }
    
    return NextResponse.json({ 
      message: "Message sent successfully",
      messageId: result.insertedId
    }, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { message: "Failed to send message" },
      { status: 500 }
    );
  }
}