import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "TripXplo 2026 Smart Leave Calendar - Turn 13 Leaves into 63 Days of Travel",
  description:
    "Plan your 2026 vacations smartly! Discover how to maximize your holidays with Tamil Nadu & Indian public holidays. Download our free calendar and get 63 days off using just 13 leaves.",
  keywords:
    "holiday calendar, leave planner, 2026 holidays, Tamil Nadu holidays, Indian holidays, vacation planning, TripXplo, smart leave planning, long weekends",
  openGraph: {
    type: "website",
    url: "https://www.tripxplo.com/holiday-hack",
    title:
      "TripXplo 2026 Smart Leave Calendar - Turn 13 Leaves into 63 Days of Travel ✈️",
    description:
      "Plan your 2026 vacations smartly! Get 63 days off using just 13 leaves. Download our free calendar with Tamil Nadu & Indian holidays.",
    siteName: "TripXplo",
    images: [
      {
        url: "https://www.tripxplo.com/holiday-hack-og.png",
        width: 1200,
        height: 630,
        alt: "TripXplo 2026 Smart Leave Calendar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TripXplo 2026 Smart Leave Calendar - 13 Leaves → 63 Days!",
    description:
      "Plan your 2026 vacations smartly! Get 63 days off using just 13 leaves. Download our free calendar now.",
    images: ["https://www.tripxplo.com/holiday-hack-og.png"],
  },
  alternates: {
    canonical: "https://www.tripxplo.com/holiday-hack",
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

export default function HolidayHackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
