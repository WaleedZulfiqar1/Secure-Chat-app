import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { USER_ROLES } from "@/lib/constants";
import DashboardLayout from "@/components/layout/Dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldAlert, MessageSquare, Clock, User, ArrowRightLeft } from "lucide-react";
import { Message } from "@/types";
import clientPromise from "@/lib/mongodb";

export const metadata: Metadata = {
  title: "Admin Panel - SecureChat",
  description: "SecureChat administration panel",
};

async function getUnencryptedMessages(): Promise<any[]> {
  const client = await clientPromise;
  const db = client.db();
  
  // Find unencrypted messages
  const messages = await db.collection("messages")
    .find({ encryptionMethod: "none" })
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
  
  return messagesWithUserDetails;
}

export default async function AdminPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/login");
  }
  
  if (user.role !== USER_ROLES.ADMIN) {
    redirect("/dashboard");
  }
  
  const unencryptedMessages = await getUnencryptedMessages();

  return (
    <DashboardLayout user={user}>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
            <p className="text-muted-foreground mt-2">
              Monitor system activity and demonstrate Man-in-the-Middle attacks
            </p>
          </div>
          <div className="flex items-center gap-2 bg-destructive/10 text-destructive px-3 py-1 rounded-md">
            <ShieldAlert className="h-5 w-5" />
            <span className="font-medium">Admin Access</span>
          </div>
        </div>
        
        <Tabs defaultValue="unencrypted" className="space-y-4">
          <TabsList>
            <TabsTrigger value="unencrypted">Unencrypted Messages</TabsTrigger>
            <TabsTrigger value="mitm">MITM Demonstration</TabsTrigger>
            <TabsTrigger value="stats">System Statistics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="unencrypted" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Unencrypted Messages</CardTitle>
                <CardDescription>
                  View all unencrypted messages that are vulnerable to interception
                </CardDescription>
              </CardHeader>
              <CardContent>
                {unencryptedMessages.length > 0 ? (
                  <div className="space-y-4">
                    {unencryptedMessages.map((message) => (
                      <div key={message._id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{message.senderName}</span>
                            <ArrowRightLeft className="h-3 w-3 text-muted-foreground mx-1" />
                            <span className="font-medium">{message.receiverName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>
                              {new Date(message.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="bg-muted/30 p-3 rounded-md">
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <div className="mt-2 flex justify-end">
                          <div className="flex items-center gap-1 text-xs text-red-500">
                            <ShieldAlert className="h-3 w-3" />
                            <span>Unencrypted - Vulnerable to MITM attack</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>No unencrypted messages found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="mitm" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Man-in-the-Middle Attack Demonstration</CardTitle>
                <CardDescription>
                  Demonstrate how unencrypted messages can be intercepted
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-card border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">What is a MITM Attack?</h3>
                    <p className="text-sm">
                      A Man-in-the-Middle (MITM) attack occurs when an attacker secretly intercepts 
                      communications between two parties who believe they are directly communicating 
                      with each other. This application demonstrates how unencrypted messages can be 
                      easily intercepted and read, while encrypted messages remain secure.
                    </p>
                  </div>
                  
                  <div className="bg-card border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Demonstration</h3>
                    <p className="text-sm mb-4">
                      The admin panel allows you to intercept messages sent between users. 
                      Here's how this works:
                    </p>
                    <ol className="list-decimal pl-5 space-y-2 text-sm">
                      <li>Unencrypted messages are fully visible in the admin panel</li>
                      <li>Encrypted messages show only the encrypted ciphertext</li>
                      <li>The admin cannot decrypt messages without the proper keys</li>
                      <li>This simulates a real-world MITM attack scenario</li>
                    </ol>
                  </div>
                  
                  {unencryptedMessages.length > 0 && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                      <h3 className="font-semibold text-red-600 dark:text-red-400 flex items-center gap-2 mb-2">
                        <ShieldAlert className="h-4 w-4" />
                        Vulnerable Messages Detected
                      </h3>
                      <p className="text-sm">
                        There are currently {unencryptedMessages.length} unencrypted messages in the system 
                        that are vulnerable to interception. View them in the Unencrypted Messages tab.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="stats" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Statistics</CardTitle>
                <CardDescription>
                  Overview of system usage and security metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="bg-card border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Message Security</h3>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Unencrypted Messages:</span>
                        <span className="font-medium">{unencryptedMessages.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Encrypted Messages:</span>
                        <span className="font-medium">Coming soon</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Security Ratio:</span>
                        <span className="font-medium">Coming soon</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-card border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">User Activity</h3>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Total Users:</span>
                        <span className="font-medium">Coming soon</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Active Users (24h):</span>
                        <span className="font-medium">Coming soon</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Messages (24h):</span>
                        <span className="font-medium">Coming soon</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}