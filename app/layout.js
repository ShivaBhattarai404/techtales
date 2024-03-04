import { Inter } from "next/font/google";
import "@/public/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TechTales",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div id="notification" />
        <div id="backdrop" />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
