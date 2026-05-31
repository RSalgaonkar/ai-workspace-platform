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
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-950 focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
        >
          Skip to main content
        </a>
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
