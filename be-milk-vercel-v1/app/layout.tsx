import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bé Milk • Nhật ký chăm ngoan",
  description: "Ứng dụng nhiệm vụ, sao thưởng và niềm vui mỗi ngày của bé Milk.",
  manifest: "/manifest.json",
  themeColor: "#fff3f8"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body>{children}</body></html>;
}
