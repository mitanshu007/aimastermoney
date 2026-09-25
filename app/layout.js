import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@components/header";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "WELTH",
  description: "Your final stop for Finance platform",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className}`}>
          {/* Header */}
          <Header />
          
          {/* Add padding-top to account for fixed header */}
          <main className="min-h-screen pt-16">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
