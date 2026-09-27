import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@components/header";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Welth — Intelligent Personal Finance",
  description: "Track money, understand spending, and make better financial decisions with Welth.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClerkProvider>
          <Header />
          <main className="min-h-screen pt-16">{children}</main>
        </ClerkProvider>
      </body>
    </html>
  );
}
