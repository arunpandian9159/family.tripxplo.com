import type { Metadata } from "next";
import { NEXT_PUBLIC_IMAGE_URL } from "@/app/utils/constants/apiUrls";
import connectDB from "@/lib/db";
import Package from "@/lib/models/Package";

interface Props {
  params: Promise<{ packageid: string }>;
  children: React.ReactNode;
}

// Package data interface for type safety
interface PackageData {
  packageId?: string;
  slug?: string;
  packageName?: string;
  packageImg?: string[];
  noOfDays?: number;
  noOfNight?: number;
  destination?: Array<{ destinationName?: string }>;
  activity?: Array<{ day: number; event?: Array<unknown> }>;
}

// Helper function to detect if identifier is a Package ID or slug
// Package IDs are typically uppercase like: "PACK-123-3D4N2A" or "WB-GOA-5D4N2A"
// Slugs are lowercase with hyphens like: "goa-beach-holiday-package"
function isPackageId(identifier: string): boolean {
  // If it contains any lowercase letters, it's likely a slug
  if (/[a-z]/.test(identifier)) {
    return false;
  }
  // Package ID patterns: uppercase letters, numbers, and hyphens
  return (
    /^[A-Z0-9]+-[A-Z0-9]+-\d+D\d+N\d+A$/.test(identifier) ||
    /^[A-Z][A-Z0-9-]+$/.test(identifier)
  );
}

// Fetch package data directly from database for metadata generation
// This avoids the issue of making HTTP requests to itself during server-side rendering
async function fetchPackageData(slugOrId: string): Promise<PackageData | null> {
  try {
    await connectDB();

    let pkg = null;

    // Try to find by slug first if it looks like a slug
    if (!isPackageId(slugOrId)) {
      pkg = await Package.findOne({ slug: slugOrId })
        .select(
          "packageId slug packageName packageImg noOfDays noOfNight activity",
        )
        .lean();
    }

    // If not found by slug, try by packageId
    if (!pkg) {
      pkg = await Package.findOne({ packageId: slugOrId })
        .select(
          "packageId slug packageName packageImg noOfDays noOfNight activity",
        )
        .lean();
    }

    if (!pkg) {
      console.log("[Activities Metadata] Package not found for:", slugOrId);
      return null;
    }

    console.log("[Activities Metadata] Package found:", pkg.packageName);

    return {
      packageId: pkg.packageId,
      slug: pkg.slug,
      packageName: pkg.packageName,
      packageImg: pkg.packageImg,
      noOfDays: pkg.noOfDays,
      noOfNight: pkg.noOfNight,
      destination: [], // We don't need destination for metadata title/description
      activity: pkg.activity,
    };
  } catch (error) {
    console.error("[Activities Metadata] Error fetching package:", error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { packageid } = await params;
  const pkg = await fetchPackageData(packageid);

  if (!pkg) {
    return {
      title: "Itinerary Not Found | TripXplo",
      description: "The requested itinerary could not be found.",
    };
  }

  // Use slug if available, otherwise use packageId for canonical URL
  const identifier = pkg.slug || pkg.packageId || packageid;
  const canonicalUrl = `https://www.tripxplo.com/package/${identifier}/activities`;

  // Get the site base URL for absolute URLs - same logic as fetchPackageData
  let siteUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!siteUrl && process.env.VERCEL_URL) {
    siteUrl = `https://${process.env.VERCEL_URL}`;
  }
  if (!siteUrl) {
    siteUrl = "https://tripxplo.vercel.app";
  }

  // Default OG image fallback (uses existing TripXplo hero image)
  const defaultOgImage = `${siteUrl}/home.png`;

  // Get first image for Open Graph - ensure absolute URL
  let ogImage = defaultOgImage;
  if (pkg.packageImg?.[0]) {
    const imgPath = pkg.packageImg[0];
    // If image already has full URL, use it directly
    if (imgPath.startsWith("http")) {
      ogImage = imgPath;
    } else {
      ogImage = `${NEXT_PUBLIC_IMAGE_URL}${imgPath}`;
    }
  }

  console.log("[Activities Metadata] OG Image URL:", ogImage);

  // Build destination string for description
  const destinations =
    pkg.destination
      ?.map((d) => d.destinationName)
      .filter(Boolean)
      .join(", ") || "";

  const packageName = pkg.packageName || "Holiday Package";
  const noOfDays = pkg.noOfDays || 0;
  const totalActivities =
    pkg.activity?.reduce((acc, day) => acc + (day?.event?.length || 0), 0) || 0;

  const description = `Explore the full itinerary for ${packageName}. ${noOfDays} days${totalActivities > 0 ? `, ${totalActivities} activities` : ""}${destinations ? ` covering ${destinations}` : ""}. Plan your perfect trip with TripXplo!`;

  return {
    title: `${packageName} - Itinerary | TripXplo`,
    description: description.slice(0, 160),
    keywords: `${packageName}, itinerary, travel plan, ${destinations}, tour activities, TripXplo`,
    openGraph: {
      type: "website",
      url: canonicalUrl,
      title: `${packageName} - Full Itinerary`,
      description: description.slice(0, 160),
      siteName: "TripXplo",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${packageName} Itinerary`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${packageName} - Itinerary`,
      description: description.slice(0, 160),
      images: [ogImage],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default function ActivitiesLayout({ children }: Props) {
  return <>{children}</>;
}
