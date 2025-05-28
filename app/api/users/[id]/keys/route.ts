import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
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
    
    const userId = params.id;
    
    const client = await clientPromise;
    const db = client.db();
    
    // Get user's public key
    const targetUser = await db.collection("users").findOne(
      { _id: new ObjectId(userId) },
      { projection: { rsaPublicKey: 1 } }
    );
    
    if (!targetUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      publicKey: targetUser.rsaPublicKey,
    });
  } catch (error) {
    console.error("Error fetching user keys:", error);
    return NextResponse.json(
      { message: "Failed to fetch user keys" },
      { status: 500 }
    );
  }
}