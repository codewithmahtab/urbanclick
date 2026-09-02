import type { Metadata } from "next";
import { Inter, Poppins, Fredoka } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fredoka",
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://next-shop.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Next Shop — Online Shopping for Electronics, Fashion & More",
    template: "%s | Next Shop",
  },
  description:
    "Next Shop is your one-stop online marketplace for electronics, fashion, home & kitchen, beauty, sports, and more. Discover great deals with fast delivery.",
  keywords: [
    "online shopping",
    "ecommerce",
    "electronics",
    "fashion",
    "home kitchen",
    "beauty",
    "sports",
    "next shop",
  ],
  authors: [{ name: "Next Shop" }],
  creator: "Next Shop",
  publisher: "Next Shop",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BASE_URL,
    siteName: "Next Shop",
    title: "Next Shop — Online Shopping for Electronics, Fashion & More",
    description:
      "Next Shop is your one-stop online marketplace. Discover great deals across electronics, fashion, home & kitchen, beauty, and more.",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Next Shop",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Next Shop — Online Shopping for Electronics, Fashion & More",
    description:
      "Discover great deals on electronics, fashion, home & kitchen, and more at Next Shop.",
    images: ["/og-default.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} ${fredoka.variable} dark`}>
      <body className="min-h-full flex flex-col font-poppins">{children}</body>
    </html>
  );
}
