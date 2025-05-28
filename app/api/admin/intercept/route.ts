import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import { USER_ROLES } from "@/lib/constants";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.role !== USER_ROLES.ADMIN) {
      return NextResponse.json(
        { message: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }
    
    const { messageId } = await request.json();
    
    if (!messageId) {
      return NextResponse.json(
        { message: "Message ID is required" },
        { status: 400 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db();
    
    // Mark message as intercepted
    await db.collection("messages").updateOne(
      { _id: new ObjectId(messageId) },
      { $set: { isIntercepted: true } }
    );
    
    return NextResponse.json({ message: "Message intercepted successfully" });
  } catch (error) {
    console.error("Error intercepting message:", error);
    return NextResponse.json(
      { message: "Failed to intercept message" },
      { status: 500 }
    );
  }
}