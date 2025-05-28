import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Lock, ArrowRight, MessageSquare, BarChart2, ShieldAlert, BookOpen } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center">
            <ShieldCheck className="h-6 w-6 mr-2" />
            <span className="font-bold">SecureChat</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/learn" className="text-foreground/60 hover:text-foreground/80 transition-colors">
              Learn
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Sign Up</Button>
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-1">
        <section className="py-20 md:py-32 bg-gradient-to-b from-background to-secondary/20">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Secure Communication Suite
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Experience and learn about encryption methods in real-time. Compare AES, Triple DES, and RSA while chatting securely.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/register">
                    <Button className="w-full sm:w-auto">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/learn">
                    <Button variant="outline" className="w-full sm:w-auto">
                      Learn About Encryption
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative lg:pl-12">
                <div className="bg-card/50 border rounded-lg p-8 backdrop-blur-sm">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Encryption Methods</h3>
                      <Lock className="h-5 w-5 text-primary" />
                    </div>
                    <div className="grid gap-4">
                      <div className="flex items-center gap-2 p-2 rounded-md bg-blue-100/10 border border-blue-300/20">
                        <div className="bg-blue-100 dark:bg-blue-900/50 rounded-full p-1.5">
                          <Lock className="h-4 w-4 text-blue-500" />
                        </div>
                        <span className="font-medium">AES Encryption</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-md bg-green-100/10 border border-green-300/20">
                        <div className="bg-green-100 dark:bg-green-900/50 rounded-full p-1.5">
                          <Lock className="h-4 w-4 text-green-500" />
                        </div>
                        <span className="font-medium">Triple DES Encryption</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-md bg-purple-100/10 border border-purple-300/20">
                        <div className="bg-purple-100 dark:bg-purple-900/50 rounded-full p-1.5">
                          <ShieldCheck className="h-4 w-4 text-purple-500" />
                        </div>
                        <span className="font-medium">RSA Encryption</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-12 md:py-20">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Key Features</h2>
              <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
                Explore our comprehensive suite of secure communication tools
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 bg-card border rounded-lg">
                <div className="bg-primary/10 rounded-full p-3 mb-4">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Secure Messaging</h3>
                <p className="text-muted-foreground">
                  Exchange messages with end-to-end encryption using AES, Triple DES, or RSA algorithms.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-card border rounded-lg">
                <div className="bg-primary/10 rounded-full p-3 mb-4">
                  <BarChart2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Performance Analysis</h3>
                <p className="text-muted-foreground">
                  Compare encryption methods with real-time performance metrics and visualizations.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-card border rounded-lg">
                <div className="bg-primary/10 rounded-full p-3 mb-4">
                  <ShieldAlert className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">MITM Attack Demo</h3>
                <p className="text-muted-foreground">
                  Understand the vulnerability of unencrypted communications through a Man-in-the-Middle attack demonstration.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-card border rounded-lg">
                <div className="bg-primary/10 rounded-full p-3 mb-4">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Multiple Encryption Methods</h3>
                <p className="text-muted-foreground">
                  Choose between AES, Triple DES, and RSA encryption for each message you send.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-card border rounded-lg">
                <div className="bg-primary/10 rounded-full p-3 mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Educational Resources</h3>
                <p className="text-muted-foreground">
                  Learn about encryption methods, their advantages, and vulnerabilities through comprehensive resources.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-card border rounded-lg">
                <div className="bg-primary/10 rounded-full p-3 mb-4">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Admin Panel</h3>
                <p className="text-muted-foreground">
                  Access logs of unencrypted messages and demonstrate the security of encrypted communications.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t py-6 md:py-8">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center">
              <ShieldCheck className="h-5 w-5 mr-2" />
              <span className="font-semibold">SecureChat</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 SecureChat. All rights reserved. For educational purposes only.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}