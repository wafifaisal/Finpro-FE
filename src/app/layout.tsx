import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SessionProvider } from "@/context/sessionProvider";

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
  openGraph: {
    title: "Sewa Properti Eksklusif & Nyaman di Nginepin",
    description:
      "Temukan properti terbaik untuk disewa di Nginepin. Nikmati layanan profesional, harga kompetitif, dan pilihan properti yang sesuai dengan kebutuhan Anda.",
    url: process.env.NEXT_PUBLIC_BASE_URL_FE,
    siteName: "Nginepin",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "https://res.cloudinary.com/dkyco4yqp/image/upload/v1740597956/logo_nosrkr.png",
        width: 1200,
        height: 630,
        alt: "Nginepin Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Nginepin",
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
      </body>
    </html>
  );
}
