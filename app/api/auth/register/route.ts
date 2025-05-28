import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";
import { USER_ROLES } from "@/lib/constants";
import { generateRSAKeyPair } from "@/lib/encryption/rsa";

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();
    
    // Basic validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection("users");
    
    // Check if user already exists
    const existingUser = await usersCollection.findOne({
      $or: [{ email }, { username }],
    });
    
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Generate RSA key pair for secure messaging
    const keyPair = generateRSAKeyPair();
    
    // Create new user
    const newUser = {
      username,
      email,
      password: hashedPassword,
      role: USER_ROLES.USER, // Default role
      createdAt: new Date(),
      rsaPublicKey: keyPair.publicKey,
      rsaPrivateKey: keyPair.privateKey,
    };
    
    await usersCollection.insertOne(newUser);
    
    // Don't send back password or private key in response
    const { password: _, rsaPrivateKey: __, ...userWithoutSensitiveInfo } = newUser;
    
    return NextResponse.json(
      { message: "User registered successfully", user: userWithoutSensitiveInfo },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "An error occurred during registration" },
      { status: 500 }
    );
  }
}