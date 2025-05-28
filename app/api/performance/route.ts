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
    
    // Get encryption stats for the current user
    const stats = await db.collection("encryptionStats")
      .find({ userId: user._id.toString() })
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Error fetching performance stats:", error);
    return NextResponse.json(
      { message: "Failed to fetch performance stats" },
      { status: 500 }
    );
  }
}