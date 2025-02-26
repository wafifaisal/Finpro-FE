import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SessionProvider } from "@/context/sessionProvider";
import Footer from "@/components/main/footer/footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    template: "Nginepin : %s",
    default: "Sewa Properti Eksklusif & Nyaman di Nginepin",
  },
  description:
    "Temukan properti terbaik untuk disewa di Nginepin. Nikmati layanan profesional, harga kompetitif, dan pilihan rumah, apartemen, vila, serta properti lainnya yang siap memenuhi kebutuhan Anda.",
  icons: {
    icon: "https://res.cloudinary.com/dkyco4yqp/image/upload/v1740597956/logo_nosrkr.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>{children}</SessionProvider>
        <Footer />
      </body>
    </html>
  );
}
