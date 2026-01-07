/**
 * Generate dynamic share message for WhatsApp with emojis
 * based on package destination and theme
 */

// Destination emoji mappings
const destinationEmojis: Record<string, { emoji: string; feature: string }> = {
  manali: { emoji: "🏔️❄️", feature: "Snow + Mountains" },
  kashmir: { emoji: "🏔️❄️🌸", feature: "Paradise on Earth" },
  shimla: { emoji: "🏔️❄️🌲", feature: "Queen of Hills" },
  ladakh: { emoji: "🏔️🏍️", feature: "Adventure + Landscapes" },
  ooty: { emoji: "🌿🌄☕", feature: "Tea Gardens + Hills" },
  munnar: { emoji: "🌿🍃☕", feature: "Green Hills + Tea" },
  kodaikanal: { emoji: "🌲🌄✨", feature: "Misty Mountains" },
  kerala: { emoji: "🌴🚣✨", feature: "Backwaters + Nature" },
  goa: { emoji: "🏖️🌊🎉", feature: "Beach + Party" },
  andaman: { emoji: "🏝️🐚🌊", feature: "Island + Beach" },
  bali: { emoji: "🌺🏝️✨", feature: "Tropical Paradise" },
  maldives: { emoji: "🏝️🐚💙", feature: "Island + Luxury" },
  dubai: { emoji: "🏙️✨🌟", feature: "Luxury + Shopping" },
  singapore: { emoji: "🏙️🌃✨", feature: "Modern + Vibrant" },
  thailand: { emoji: "🏝️🌺🎉", feature: "Beach + Culture" },
  vietnam: { emoji: "🌏🍜✨", feature: "Culture + Nature" },
  rajasthan: { emoji: "🏰👑🐪", feature: "Royal + Heritage" },
  jaipur: { emoji: "🏰🌸👑", feature: "Pink City + Royalty" },
  udaipur: { emoji: "🏰💙✨", feature: "Lake City + Romance" },
  darjeeling: { emoji: "🍃🚂🏔️", feature: "Tea + Toy Train" },
  sikkim: { emoji: "🏔️🌸✨", feature: "Mountains + Peace" },
  meghalaya: { emoji: "🌧️🌿💚", feature: "Living Bridges + Waterfalls" },
  rishikesh: { emoji: "🧘‍♂️🏞️✨", feature: "Yoga + Adventure" },
  varanasi: { emoji: "🪔🛕✨", feature: "Spiritual + Heritage" },
  agra: { emoji: "🕌💕✨", feature: "Taj Mahal + Love" },
};

// Theme emoji mappings
const themeEmojis: Record<string, { emoji: string; tagline: string }> = {
  honeymoon: { emoji: "💑💒", tagline: "Romance + Memories" },
  couple: { emoji: "💕❤️", tagline: "Love + Getaway" },
  romantic: { emoji: "💑✨", tagline: "Romance + Magic" },
  family: { emoji: "👨‍👩‍👧‍👦🎊", tagline: "Fun + Bonding" },
  friends: { emoji: "🎉👯", tagline: "Adventure + Fun" },
  adventure: { emoji: "🧗‍♂️🏄‍♂️", tagline: "Thrill + Explore" },
  spiritual: { emoji: "🙏🪔", tagline: "Peace + Devotion" },
  pilgrimage: { emoji: "🛕🙏", tagline: "Faith + Journey" },
  wildlife: { emoji: "🐅🌿", tagline: "Safari + Nature" },
  beach: { emoji: "🏖️🌊", tagline: "Sun + Sand" },
  hill: { emoji: "🏔️🌄", tagline: "Mountains + Serenity" },
  luxury: { emoji: "👑✨", tagline: "Premium + Comfort" },
  budget: { emoji: "💰✨", tagline: "Value + Experience" },
  weekend: { emoji: "🗓️✨", tagline: "Quick + Refreshing" },
  group: { emoji: "👥🎉", tagline: "Together + Fun" },
};

/**
 * Extract destination from package name
 */
function extractDestination(packageName: string): { name: string; emoji: string; feature: string } | null {
  const lowerName = packageName.toLowerCase();

  for (const [destination, data] of Object.entries(destinationEmojis)) {
    if (lowerName.includes(destination)) {
      return {
        name: destination.charAt(0).toUpperCase() + destination.slice(1),
        ...data,
      };
    }
  }
  return null;
}

/**
 * Extract theme from package name
 */
function extractTheme(packageName: string): { name: string; emoji: string; tagline: string } | null {
  const lowerName = packageName.toLowerCase();

  for (const [theme, data] of Object.entries(themeEmojis)) {
    if (lowerName.includes(theme)) {
      return {
        name: theme.charAt(0).toUpperCase() + theme.slice(1),
        ...data,
      };
    }
  }
  return null;
}

/**
 * Extract duration (nights/days) from package name
 */
function extractDuration(packageName: string): { nights: number; days: number } | null {
  // Match patterns like "4N", "4N5D", "4N/5D", "4 Nights", etc.
  const nightMatch = packageName.match(/(\d+)\s*[Nn](?:ight)?s?/i);
  const dayMatch = packageName.match(/(\d+)\s*[Dd](?:ay)?s?/i);

  if (nightMatch) {
    const nights = parseInt(nightMatch[1], 10);
    const days = dayMatch ? parseInt(dayMatch[1], 10) : nights + 1;
    return { nights, days };
  }

  return null;
}

export interface ShareMessageOptions {
  packageName: string;
  location?: string;
  url: string;
  price?: number;
  date?: string;
}

/**
 * Generate a formatted share message for WhatsApp
 * Uses WhatsApp markdown: *bold* for emphasis
 */
export function generateShareMessage(options: ShareMessageOptions): string {
  const { packageName, location, url } = options;

  const destination = extractDestination(packageName) || (location ? extractDestination(location) : null);
  const theme = extractTheme(packageName);
  const duration = extractDuration(packageName);

  // Build the header with emojis based on destination/theme
  const headerEmoji = destination?.emoji?.charAt(0) || theme?.emoji?.charAt(0) || "✈️";
  let header = `${headerEmoji} *`;
  if (destination) {
    header += destination.name.toUpperCase();
    if (theme) {
      header += ` ${theme.name.toUpperCase()}`;
    } else {
      header += " TRIP";
    }
  } else if (theme) {
    header += `${theme.name.toUpperCase()} PACKAGE`;
  } else {
    header += "YOUR DREAM TRIP";
  }
  header += `* ${headerEmoji}`;

  // Build the message lines
  const lines: string[] = [header, ""];

  // Duration line - bold
  if (duration) {
    lines.push(`🗓️ *${duration.nights}N / ${duration.days}D*`);
  }

  // Feature/highlight line
  if (destination || theme) {
    const feature = destination?.feature || theme?.tagline || "Amazing Experience";
    lines.push(`✨ ${feature}`);
  }

  // Standard inclusions with emojis
  lines.push("🏨 Premium Hotels");
  lines.push("🚗 Comfortable Transfers");
  lines.push("🍽️ Meals Included");
  lines.push("");

  // Call to action - bold and catchy
  lines.push("💰 *Best Price Guaranteed!*");
  lines.push("");
  lines.push("📲 *Book Now* 👇");
  lines.push(url);

  return lines.join("\n");
}

/**
 * Generate title for Web Share API
 */
export function generateShareTitle(packageName: string): string {
  const destination = extractDestination(packageName);
  const theme = extractTheme(packageName);

  if (destination && theme) {
    return `${destination.name} ${theme.name} Package`;
  } else if (destination) {
    return `${destination.name} Travel Package`;
  } else if (theme) {
    return `${theme.name} Package`;
  }

  return packageName;
}

/**
 * Generate share message for Activity/Itinerary page
 */
export function generateActivityShareMessage(url: string): string {
  return `Kindly check the Detail Full Itinerary of your upcoming trip\n\n${url}`;
}
