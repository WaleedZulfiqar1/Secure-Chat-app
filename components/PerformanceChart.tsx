"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ENCRYPTION_METHODS, EncryptionMethod } from "@/lib/constants";
import { EncryptionStat } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PerformanceChartProps {
  stats: EncryptionStat[];
}

type TimeMetric = "encryptionTime" | "decryptionTime";
type DataView = "comparison" | "individual";

export default function PerformanceChart({ stats }: PerformanceChartProps) {
  const [timeMetric, setTimeMetric] = useState<TimeMetric>("encryptionTime");
  const [dataView, setDataView] = useState<DataView>("comparison");
  
  const getMethodStats = (method: EncryptionMethod) => {
    return stats.filter(stat => stat.method === method);
  };
  
  const getAverageTime = (method: EncryptionMethod, metric: TimeMetric) => {
    const methodStats = getMethodStats(method);
    if (methodStats.length === 0) return 0;
    
    const total = methodStats.reduce((sum, stat) => sum + stat[metric], 0);
    return total / methodStats.length;
  };
  
  const comparisonData = [
    {
      name: "Average Time (ms)",
      AES: getAverageTime(ENCRYPTION_METHODS.AES, timeMetric),
      "3DES": getAverageTime(ENCRYPTION_METHODS.TRIPLE_DES, timeMetric),
      RSA: getAverageTime(ENCRYPTION_METHODS.RSA, timeMetric),
    },
  ];
  
  const getIndividualMethodData = (method: EncryptionMethod) => {
    return getMethodStats(method).map(stat => ({
      messageLength: stat.messageLength,
      [timeMetric]: stat[timeMetric],
    }));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Encryption Performance Metrics</CardTitle>
        <CardDescription>
          Compare the performance of different encryption methods
        </CardDescription>
        <div className="flex items-center justify-between">
          <Select
            value={timeMetric}
            onValueChange={(value) => setTimeMetric(value as TimeMetric)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="encryptionTime">Encryption Time</SelectItem>
              <SelectItem value="decryptionTime">Decryption Time</SelectItem>
            </SelectContent>
          </Select>
          
          <Tabs
            value={dataView}
            onValueChange={(value) => setDataView(value as DataView)}
            className="w-[300px]"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="comparison">Comparison</TabsTrigger>
              <TabsTrigger value="individual">Individual</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          {dataView === "comparison" ? (
            <ResponsiveContainer width="100%\" height="100%">
              <BarChart
                data={comparisonData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value.toFixed(2)} ms`, timeMetric === "encryptionTime" ? "Encryption Time" : "Decryption Time"]} />
                <Legend />
                <Bar dataKey="AES" fill="hsl(var(--chart-1))" />
                <Bar dataKey="3DES" fill="hsl(var(--chart-2))" />
                <Bar dataKey="RSA" fill="hsl(var(--chart-3))" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Tabs defaultValue={ENCRYPTION_METHODS.AES}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value={ENCRYPTION_METHODS.AES}>AES</TabsTrigger>
                <TabsTrigger value={ENCRYPTION_METHODS.TRIPLE_DES}>3DES</TabsTrigger>
                <TabsTrigger value={ENCRYPTION_METHODS.RSA}>RSA</TabsTrigger>
              </TabsList>
              
              <TabsContent value={ENCRYPTION_METHODS.AES}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={getIndividualMethodData(ENCRYPTION_METHODS.AES)}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="messageLength" label={{ value: "Message Length (chars)", position: "insideBottom", offset: -5 }} />
                    <YAxis label={{ value: "Time (ms)", angle: -90, position: "insideLeft" }} />
                    <Tooltip formatter={(value) => [`${value.toFixed(2)} ms`, timeMetric === "encryptionTime" ? "Encryption Time" : "Decryption Time"]} />
                    <Bar dataKey={timeMetric} fill="hsl(var(--chart-1))" />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value={ENCRYPTION_METHODS.TRIPLE_DES}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={getIndividualMethodData(ENCRYPTION_METHODS.TRIPLE_DES)}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="messageLength" label={{ value: "Message Length (chars)", position: "insideBottom", offset: -5 }} />
                    <YAxis label={{ value: "Time (ms)", angle: -90, position: "insideLeft" }} />
                    <Tooltip formatter={(value) => [`${value.toFixed(2)} ms`, timeMetric === "encryptionTime" ? "Encryption Time" : "Decryption Time"]} />
                    <Bar dataKey={timeMetric} fill="hsl(var(--chart-2))" />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value={ENCRYPTION_METHODS.RSA}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={getIndividualMethodData(ENCRYPTION_METHODS.RSA)}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="messageLength" label={{ value: "Message Length (chars)", position: "insideBottom", offset: -5 }} />
                    <YAxis label={{ value: "Time (ms)", angle: -90, position: "insideLeft" }} />
                    <Tooltip formatter={(value) => [`${value.toFixed(2)} ms`, timeMetric === "encryptionTime" ? "Encryption Time" : "Decryption Time"]} />
                    <Bar dataKey={timeMetric} fill="hsl(var(--chart-3))" />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </CardContent>
    </Card>
  );
}