import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { SearchProvider } from "@/context/SearchContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TripXplo Family - Your Family Adventure, Planned & Paid Your Way",
  description:
    "Experience hassle-free family vacations with TripXplo's Family Prepaid EMI Packages. Discover, relax, and create lasting memories with flexible payment options.",
  keywords: [
    "family vacation",
    "EMI packages",
    "travel EMI",
    "family trips",
    "prepaid travel",
    "TripXplo",
    "holiday packages",
  ],
  authors: [{ name: "TripXplo" }],
  openGraph: {
    title: "TripXplo Family - Your Family Adventure, Planned & Paid Your Way",
    description:
      "Experience hassle-free family vacations with TripXplo's Family Prepaid EMI Packages.",
    type: "website",
    locale: "en_IN",
    siteName: "TripXplo Family",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className={`${inter.variable} ${poppins.variable} antialiased`}>
        <AuthProvider>
          <SearchProvider>{children}</SearchProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
