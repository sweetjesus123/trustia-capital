import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.trustiacapital.com"),
  applicationName: "Trustia Capital",
  title: {
    default: "Trustia Capital — Private Client Portal",
    template: "%s | Trustia Capital",
  },
  description:
    "Trustia Capital is a private wealth and lending platform. Manage your portfolio, access capital, and track yield — securely.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.trustiacapital.com",
    siteName: "Trustia Capital",
    title: "Trustia Capital — Private Client Portal",
    description:
      "Trustia Capital is a private wealth and lending platform. Manage your portfolio, access capital, and track yield — securely.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Trustia Capital — Private Client Portal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trustia Capital — Private Client Portal",
    description:
      "Trustia Capital is a private wealth and lending platform. Manage your portfolio, access capital, and track yield — securely.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
};
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col">
        {children}
        <Footer />
      </body>
    </html>
  );
}
