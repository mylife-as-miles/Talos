import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Talos",
  description: "Self-healing AI developer operations for Splunk."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
