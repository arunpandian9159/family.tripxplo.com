export interface Holiday {
  name: string;
  type: "public" | "religious";
  states?: string[];
}

export const indianHolidays: Record<string, Holiday> = {
  // December
  "2025-12-25": { name: "Christmas", type: "public" },

  // 2026

  // January
  "2026-01-01": { name: "New Year's Day", type: "public" },
  "2026-01-14": { name: "Pongal", type: "religious" },
  "2026-01-26": { name: "Republic Day", type: "public" },
  "2026-01-30": { name: "Vasant Panchami", type: "religious" },

  // February
  "2026-02-17": { name: "Maha Shivaratri", type: "religious" },
  "2026-02-19": {
    name: "Shivaji Jayanti",
    type: "public",
    states: ["Maharashtra"],
  },

  // March
  "2026-03-05": { name: "Holika Dahan", type: "religious" },
  "2026-03-06": { name: "Holi", type: "public" },
  "2026-03-29": { name: "Rama Navami", type: "religious" },

  // April
  "2026-04-03": { name: "Good Friday", type: "public" },
  "2026-04-05": { name: "Easter Sunday", type: "religious" },
  "2026-04-14": { name: "Tamil New Year", type: "public" },
  "2026-04-15": { name: "Vishu", type: "religious", states: ["Kerala"] },

  // May
  "2026-05-01": { name: "Labor Day", type: "public" },

  // June
  "2026-06-18": { name: "Muharram", type: "public" },
  "2026-06-21": { name: "Rath Yatra", type: "religious", states: ["Odisha"] },

  // August
  "2026-08-15": { name: "Independence Day", type: "public" },
  "2026-08-26": { name: "Ganesh Chaturthi", type: "religious" },
  "2026-08-28": { name: "Raksha Bandhan", type: "religious" },

  // September
  "2026-09-05": { name: "Janmashtami", type: "religious" },

  // October
  "2026-10-02": { name: "Gandhi Jayanti", type: "public" },
  "2026-10-21": { name: "Dussehra", type: "public" },

  // November
  "2026-11-09": { name: "Diwali", type: "public" },
  "2026-11-10": { name: "Govardhan Puja", type: "religious" },
  "2026-11-11": { name: "Bhai Dooj", type: "religious" },
  "2026-11-24": { name: "Guru Nanak Jayanti", type: "public" },

  // December
  "2026-12-25": { name: "Christmas", type: "public" },
  // January
  "2027-01-01": { name: "New Year's Day", type: "public" },
  "2027-01-14": { name: "Pongal", type: "religious" },
  "2027-01-26": { name: "Republic Day", type: "public" },

  // February
  "2027-02-18": { name: "Vasant Panchami", type: "religious" },
  "2027-02-19": {
    name: "Shivaji Jayanti",
    type: "public",
    states: ["Maharashtra"],
  },

  // March
  "2027-03-07": { name: "Maha Shivaratri", type: "religious" },
  "2027-03-24": { name: "Holika Dahan", type: "religious" },
  "2027-03-25": { name: "Holi", type: "public" },
  "2027-03-26": { name: "Good Friday", type: "public" },
  "2027-03-28": { name: "Easter Sunday", type: "religious" },

  // April
  "2027-04-14": { name: "Tamil New Year", type: "public" },
  "2027-04-15": { name: "Vishu", type: "religious", states: ["Kerala"] },
  "2027-04-17": { name: "Rama Navami", type: "religious" },

  // May
  "2027-05-01": { name: "Labor Day", type: "public" },

  // June
  "2027-06-08": { name: "Muharram", type: "public" },

  // July
  "2027-07-10": { name: "Rath Yatra", type: "religious", states: ["Odisha"] },

  // August
  "2027-08-15": { name: "Independence Day", type: "public" },
  "2027-08-18": { name: "Raksha Bandhan", type: "religious" },
  "2027-08-25": { name: "Janmashtami", type: "religious" },

  // September
  "2027-09-14": { name: "Ganesh Chaturthi", type: "religious" },

  // October
  "2027-10-02": { name: "Gandhi Jayanti", type: "public" },
  "2027-10-10": { name: "Dussehra", type: "public" },
  "2027-10-29": { name: "Diwali", type: "public" },
  "2027-10-30": { name: "Govardhan Puja", type: "religious" },
  "2027-10-31": { name: "Bhai Dooj", type: "religious" },

  // November
  "2027-11-13": { name: "Guru Nanak Jayanti", type: "public" },

  // December
  "2027-12-25": { name: "Christmas", type: "public" },

  // January
  "2028-01-01": { name: "New Year's Day", type: "public" },
  "2028-01-14": { name: "Pongal", type: "religious", states: ["Tamil Nadu"] },
  "2028-01-15": { name: "Makar Sankranti", type: "religious" },
  "2028-01-26": { name: "Republic Day", type: "public" },

  // February
  "2028-02-07": { name: "Vasant Panchami", type: "religious" },
  "2028-02-19": {
    name: "Shivaji Jayanti",
    type: "public",
    states: ["Maharashtra"],
  },
  "2028-02-24": { name: "Maha Shivaratri", type: "religious" },

  // March
  "2028-03-12": { name: "Holika Dahan", type: "religious" },
  "2028-03-13": { name: "Holi", type: "public" },

  // April
  "2028-04-05": { name: "Rama Navami", type: "religious" },
  "2028-04-14": { name: "Tamil New Year", type: "public" },
  "2028-04-16": { name: "Easter Sunday", type: "religious" },

  // May
  "2028-05-01": { name: "Labor Day", type: "public" },
  "2028-05-27": { name: "Muharram", type: "public" },

  // June
  "2028-06-28": { name: "Rath Yatra", type: "religious", states: ["Odisha"] },

  // August
  "2028-08-05": { name: "Raksha Bandhan", type: "religious" },
  "2028-08-14": { name: "Janmashtami", type: "religious" },
  "2028-08-15": { name: "Independence Day", type: "public" },

  // September
  "2028-09-02": { name: "Ganesh Chaturthi", type: "religious" },
  "2028-09-29": { name: "Dussehra", type: "public" },

  // October
  "2028-10-02": { name: "Gandhi Jayanti", type: "public" },
  "2028-10-17": { name: "Diwali", type: "public" },
  "2028-10-18": { name: "Govardhan Puja", type: "religious" },
  "2028-10-19": { name: "Bhai Dooj", type: "religious" },

  // November
  "2028-11-01": { name: "Guru Nanak Jayanti", type: "public" },

  // December
  "2028-12-25": { name: "Christmas", type: "public" },
};
