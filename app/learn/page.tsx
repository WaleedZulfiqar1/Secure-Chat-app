import { Metadata } from "next";
import DashboardLayout from "@/components/layout/Dashboard";
import { getCurrentUser } from "@/lib/auth";
import EducationalCard from "@/components/EducationalCard";

export const metadata: Metadata = {
  title: "Learn - SecureChat",
  description: "Learn about encryption methods and security",
};

export default async function LearnPage() {
  const user = await getCurrentUser();
  
  const educationalContent = [
    {
      title: "AES Encryption",
      description: "Advanced Encryption Standard",
      content: "AES (Advanced Encryption Standard) is a symmetric encryption algorithm that has become the industry standard for securing sensitive data. Developed by Belgian cryptographers Joan Daemen and Vincent Rijmen, AES was selected by the U.S. National Institute of Standards and Technology (NIST) in 2001.\n\nKey features of AES include:\n• Symmetric key algorithm (same key for encryption and decryption)\n• Block cipher that processes data in fixed 128-bit blocks\n• Supports key lengths of 128, 192, and 256 bits\n• Fast performance in both software and hardware\n• Resistant to all known attacks when properly implemented",
      icon: "aes",
      learnMoreLink: "https://en.wikipedia.org/wiki/Advanced_Encryption_Standard",
    },
    {
      title: "Triple DES",
      description: "Triple Data Encryption Standard",
      content: "Triple DES (3DES) is a symmetric encryption algorithm that applies the Data Encryption Standard (DES) cipher algorithm three times to each data block. Developed in the late 1970s, it was designed to overcome the vulnerabilities of the original DES algorithm while maintaining backward compatibility.\n\nKey features of Triple DES include:\n• Applies DES three times with different keys\n• Effectively increases the key length to 168 bits (with 112 bits of security)\n• Slower than AES but more secure than standard DES\n• Still used in legacy systems and financial services\n• Gradually being phased out in favor of AES",
      icon: "tripledes",
      learnMoreLink: "https://en.wikipedia.org/wiki/Triple_DES",
    },
    {
      title: "RSA Encryption",
      description: "Rivest-Shamir-Adleman public key cryptosystem",
      content: "RSA is an asymmetric encryption algorithm based on the mathematical difficulty of factoring large prime numbers. Invented by Ron Rivest, Adi Shamir, and Leonard Adleman in 1977, it revolutionized cryptography by introducing the concept of public key encryption.\n\nKey features of RSA include:\n• Asymmetric algorithm with distinct public and private keys\n• Public key for encryption, private key for decryption\n• Supports digital signatures and key exchange\n• Widely used for secure communications and online transactions\n• Requires longer key lengths (2048+ bits) for security\n• Computationally intensive compared to symmetric algorithms",
      icon: "rsa",
      learnMoreLink: "https://en.wikipedia.org/wiki/RSA_(cryptosystem)",
    },
    {
      title: "Man-in-the-Middle Attacks",
      description: "Understanding MITM attack vulnerabilities",
      content: "A Man-in-the-Middle (MITM) attack occurs when an attacker secretly intercepts and possibly alters communications between two parties who believe they are directly communicating with each other. This attack exploits the absence of mutual authentication.\n\nKey aspects of MITM attacks:\n• Attacker positions themselves between sender and receiver\n• Can read, insert, and modify data in intercepted communications\n• Common in unsecured Wi-Fi networks and compromised routers\n• Can be mitigated through strong encryption and certificate validation\n• Encrypted messages remain protected even if intercepted\n• Demonstrates the critical importance of end-to-end encryption",
      icon: "attack",
      learnMoreLink: "https://en.wikipedia.org/wiki/Man-in-the-middle_attack",
    },
  ];

  return (
    <DashboardLayout user={user}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Learn About Encryption</h1>
          <p className="text-muted-foreground mt-2">
            Understand the different encryption methods and security concepts
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {educationalContent.map((content, index) => (
            <EducationalCard
              key={index}
              title={content.title}
              description={content.description}
              content={content.content}
              icon={content.icon as any}
              learnMoreLink={content.learnMoreLink}
            />
          ))}
        </div>
        
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Comparing Encryption Methods</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted border-b">
                  <th className="p-2 text-left">Feature</th>
                  <th className="p-2 text-left">AES</th>
                  <th className="p-2 text-left">Triple DES</th>
                  <th className="p-2 text-left">RSA</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2 font-medium">Type</td>
                  <td className="p-2">Symmetric</td>
                  <td className="p-2">Symmetric</td>
                  <td className="p-2">Asymmetric</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-medium">Key Length</td>
                  <td className="p-2">128, 192, or 256 bits</td>
                  <td className="p-2">168 bits (effective)</td>
                  <td className="p-2">2048+ bits</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-medium">Speed</td>
                  <td className="p-2">Fast</td>
                  <td className="p-2">Slower than AES</td>
                  <td className="p-2">Much slower than symmetric</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-medium">Security</td>
                  <td className="p-2">Very High</td>
                  <td className="p-2">High</td>
                  <td className="p-2">Very High (with proper key length)</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-medium">Use Cases</td>
                  <td className="p-2">Data encryption, VPNs</td>
                  <td className="p-2">Legacy systems, financial data</td>
                  <td className="p-2">Key exchange, digital signatures</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Key Distribution</td>
                  <td className="p-2">Requires secure channel</td>
                  <td className="p-2">Requires secure channel</td>
                  <td className="p-2">Public key can be distributed openly</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}