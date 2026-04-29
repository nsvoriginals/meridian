import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Life OS",
  description: "Personal learning and habit management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-[#0a0a0a] text-white/85">
        <Sidebar />
        <main className="ml-64 min-h-screen">
          <div className="px-8 py-10">{children}</div>
        </main>
      </body>
    </html>
  );
}
