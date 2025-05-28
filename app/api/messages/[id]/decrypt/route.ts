import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const messageId = params.id;
    const { decryptionTime } = await request.json();
    
    const client = await clientPromise;
    const db = client.db();
    
    // Find the message
    const message = await db.collection("messages").findOne({
      _id: new ObjectId(messageId),
    });
    
    if (!message) {
      return NextResponse.json(
        { message: "Message not found" },
        { status: 404 }
      );
    }
    
    // Verify user is either sender or receiver
    if (
      message.senderId !== user._id.toString() &&
      message.receiverId !== user._id.toString()
    ) {
      return NextResponse.json(
        { message: "Unauthorized to decrypt this message" },
        { status: 403 }
      );
    }
    
    // Update message with decryption time
    await db.collection("messages").updateOne(
      { _id: new ObjectId(messageId) },
      { $set: { decryptionTime } }
    );
    
    // Update encryption stats with decryption time
    if (message.encryptionMethod !== "none") {
      await db.collection("encryptionStats").updateOne(
        {
          userId: user._id.toString(),
          method: message.encryptionMethod,
          encryptionTime: message.encryptionTime,
        },
        { $set: { decryptionTime } }
      );
    }
    
    return NextResponse.json({ message: "Decryption time recorded" });
  } catch (error) {
    console.error("Error recording decryption time:", error);
    return NextResponse.json(
      { message: "Failed to record decryption time" },
      { status: 500 }
    );
  }
}