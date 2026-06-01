import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Live Spotlight Leaderboard",
  description: "Monthly Karaoke Competition",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0a061f] text-white m-0 p-0">
        {children}
      </body>
    </html>
  );
}