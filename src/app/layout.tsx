import "~/styles/globals.css";

import { cookies } from "next/headers";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata = {
  title: "HarmonyHub - AI-Assisted Music Education",
  description: "Personalized music education with AI-generated exercises",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased">
        <TRPCReactProvider>
          <div className="relative flex min-h-screen flex-col">
            <header className="bg-primary py-4">
              <div className="container mx-auto flex items-center justify-between px-4">
                <h1 className="text-2xl font-bold text-white">HarmonyHub</h1>
                <nav className="space-x-4">
                  <a href="/" className="text-white hover:text-white/80">Home</a>
                  <a href="/exercise-generator" className="text-white hover:text-white/80">Exercises</a>
                  <a href="/ai-tools" className="text-white hover:text-white/80">AI Tools</a>
                  <a href="/xml-demo" className="text-white hover:text-white/80">XML Schema</a>
                  <a href="/about" className="text-white hover:text-white/80">About</a>
                </nav>
              </div>
            </header>
            <div className="flex-1">
              {children}
            </div>
          </div>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
