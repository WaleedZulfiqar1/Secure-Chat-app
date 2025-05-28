import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import DashboardLayout from "@/components/layout/Dashboard";
import PerformanceChart from "@/components/PerformanceChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import clientPromise from "@/lib/mongodb";
import { EncryptionStat } from "@/types";
import { ENCRYPTION_METHODS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Performance Metrics - SecureChat",
  description: "Compare encryption method performance",
};

async function getEncryptionStats(userId: string): Promise<EncryptionStat[]> {
  const client = await clientPromise;
  const db = client.db();
  
  // Get encryption stats for the current user
  const stats = await db.collection("encryptionStats")
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray();
  
  return stats;
}

export default async function PerformancePage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/login");
  }
  
  const stats = await getEncryptionStats(user._id.toString());
  
  const getTotalMessages = (method: string) => {
    return stats.filter(stat => stat.method === method).length;
  };
  
  const getAverageTime = (method: string, timeType: 'encryptionTime' | 'decryptionTime') => {
    const methodStats = stats.filter(stat => stat.method === method);
    if (methodStats.length === 0) return 0;
    
    const totalTime = methodStats.reduce((sum, stat) => sum + stat[timeType], 0);
    return totalTime / methodStats.length;
  };
  
  const summaryStats = [
    {
      title: "AES",
      totalMessages: getTotalMessages(ENCRYPTION_METHODS.AES),
      avgEncryptionTime: getAverageTime(ENCRYPTION_METHODS.AES, 'encryptionTime'),
      avgDecryptionTime: getAverageTime(ENCRYPTION_METHODS.AES, 'decryptionTime'),
      color: "border-blue-300 text-blue-500",
    },
    {
      title: "Triple DES",
      totalMessages: getTotalMessages(ENCRYPTION_METHODS.TRIPLE_DES),
      avgEncryptionTime: getAverageTime(ENCRYPTION_METHODS.TRIPLE_DES, 'encryptionTime'),
      avgDecryptionTime: getAverageTime(ENCRYPTION_METHODS.TRIPLE_DES, 'decryptionTime'),
      color: "border-green-300 text-green-500",
    },
    {
      title: "RSA",
      totalMessages: getTotalMessages(ENCRYPTION_METHODS.RSA),
      avgEncryptionTime: getAverageTime(ENCRYPTION_METHODS.RSA, 'encryptionTime'),
      avgDecryptionTime: getAverageTime(ENCRYPTION_METHODS.RSA, 'decryptionTime'),
      color: "border-purple-300 text-purple-500",
    },
  ];

  return (
    <DashboardLayout user={user}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance Metrics</h1>
          <p className="text-muted-foreground mt-2">
            Compare encryption methods based on speed and efficiency
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          {summaryStats.map((stat) => (
            <Card key={stat.title} className={`border-l-4 ${stat.color}`}>
              <CardHeader className="pb-2">
                <CardTitle>{stat.title}</CardTitle>
                <CardDescription>Performance summary</CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-muted-foreground">Messages:</dt>
                    <dd className="text-sm font-semibold">{stat.totalMessages}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-muted-foreground">Avg Encryption:</dt>
                    <dd className="text-sm font-semibold">{stat.avgEncryptionTime.toFixed(2)} ms</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-muted-foreground">Avg Decryption:</dt>
                    <dd className="text-sm font-semibold">{stat.avgDecryptionTime.toFixed(2)} ms</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <PerformanceChart stats={stats} />
        
        <Card>
          <CardHeader>
            <CardTitle>Security vs. Performance</CardTitle>
            <CardDescription>
              Understanding the trade-offs between security and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">
              Encryption methods balance security and performance differently. While stronger encryption provides better security, it often comes with performance costs:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li><span className="font-semibold">AES</span> offers the best balance between security and performance, making it the most widely used standard for general data encryption.</li>
              <li><span className="font-semibold">Triple DES</span> is more computationally intensive than AES but provides strong security for legacy systems.</li>
              <li><span className="font-semibold">RSA</span> provides excellent security through asymmetric encryption but requires significantly more computational resources, especially for larger key sizes.</li>
            </ul>
            <p className="text-sm mt-4">
              Choose your encryption method based on your specific security requirements and performance constraints.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}