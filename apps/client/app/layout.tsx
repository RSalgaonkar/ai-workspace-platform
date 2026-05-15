import type { Metadata } from "next";

import "./globals.css";

import QueryProvider from "@/components/providers/query-provider";
import ToastProvider from "@/components/providers/toast-provider";
import AuthProvider from "@/components/providers/auth-provider";
import ThemeProvider from "@/components/providers/theme-provider";
import ErrorBoundary from "@/components/common/error-boundary";
import SocketProvider from "@/components/providers/socket-provider";

export const metadata: Metadata = {
  title: "AI Workspace Platform",
  description: "Collaborative AI Workspace"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <ErrorBoundary>
            <QueryProvider>
              <AuthProvider>
                <ToastProvider />
                  <SocketProvider>
                    {children}
                  </SocketProvider>                
              </AuthProvider>
            </QueryProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
