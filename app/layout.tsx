import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "./store/provider";
import TanStackProvider from "./providers/ReactQueryProvider";
import { ToastProvider } from "./providers/Toaster";
import { Providers } from "./providers/SessionProvider";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import GlobalHeader from "@/components/shared/GlobalHeader";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#FF5F5F",
};

export const metadata: Metadata = {
  title: "TripXplo | Customized Tour Packages for Your Dream Vacation",
  description:
    "Plan your dream vacation with TripXplo. Explore customized tour packages for domestic and international destinations. Easy booking and best rates guaranteed!",
  keywords:
    "Customized tour packages, domestic holidays, international holidays, travel packages, vacation planning, TripXplo, travel",
  openGraph: {
    type: "website",
    url: "https://tripxplo.com/",
    title: "TripXplo | Customized Tour Packages for Your Dream Vacation",
    description:
      "Plan your dream vacation with TripXplo. Explore customized tour packages for domestic and international destinations.",
    siteName: "TripXplo",
  },
  twitter: {
    card: "summary_large_image",
    title: "TripXplo | Customized Tour Packages",
    description:
      "Plan your dream vacation with TripXplo. Explore customized tour packages for domestic and international destinations.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={jakarta.variable}>
      <body className="font-sans antialiased">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-M8SQMRKQ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="GTM"
          />
        </noscript>

        <Providers>
          <TanStackProvider>
            <ReduxProvider>
              <ToastProvider />
              <GlobalHeader />
              <div className="min-h-screen flex flex-col">{children}</div>
            </ReduxProvider>
          </TanStackProvider>
        </Providers>

        <GoogleAnalytics gaId="G-THRVS4Q1EQ" />
        <GoogleTagManager gtmId="GTM-M8SQMRKQ" />
      </body>
    </html>
  );
}
