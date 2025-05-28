import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function getCurrentUser() {
  try {
    const token = cookies().get("token")?.value;
    
    if (!token) {
      return null;
    }
    
    const decoded = verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
      role: string;
    };
    
    const client = await clientPromise;
    const db = client.db();
    
    const user = await db.collection("users").findOne({
      _id: new ObjectId(decoded.userId),
    });
    
    if (!user) {
      return null;
    }
    
    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}