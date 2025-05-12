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
              <div className="container mx-auto px-4">
                <h1 className="text-2xl font-bold text-white">HarmonyHub</h1>
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
