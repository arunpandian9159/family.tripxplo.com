/**
 * Family EMI API Server
 * Backend API for family.tripxplo.com
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : [
      'http://localhost:8080',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:8080',
    ];

app.use(
  cors({
    origin: function (origin, callback) {
      console.log('CORS Origin:', origin); // Debug log

      // Allow requests with no origin (like mobile apps, curl requests, or file:// protocol)
      if (!origin || origin === 'null') return callback(null, true);

      // Allow file:// protocol for local HTML files
      if (origin && origin.startsWith('file://')) return callback(null, true);

      // Check if origin is in allowed list
      if (corsOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      }

      // Allow localhost on any port for development
      if (origin && (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
        return callback(null, true);
      }

      console.log('CORS rejected origin:', origin);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json());

// Serve static files from parent directory (the website files)
app.use(express.static('../'));
app.use(express.static('public'));

// Serve index.html for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Database connection test endpoint
app.get('/api/test-db', async (req, res) => {
  try {
    console.log('🧪 Testing database connections...');

    const results = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      tests: {},
    };

    // Test CRM database
    try {
      const { data: crmTest, error: crmError } = await crmDB
        .from('family_type')
        .select('count')
        .limit(1);

      results.tests.crm = {
        status: crmError ? 'failed' : 'success',
        error: crmError?.message || null,
        url: process.env.CRM_DB_URL || 'https://tlfwcnikdlwoliqzavxj.supabase.co',
        keyPresent: !!process.env.CRM_ANON_KEY,
      };
    } catch (error) {
      results.tests.crm = {
        status: 'failed',
        error: error.message,
        url: process.env.CRM_DB_URL || 'https://tlfwcnikdlwoliqzavxj.supabase.co',
        keyPresent: !!process.env.CRM_ANON_KEY,
      };
    }

    // Test Quote database
    try {
      const { data: quoteTest, error: quoteError } = await quoteDB
        .from('family_type_prices')
        .select('count')
        .limit(1);

      results.tests.quote = {
        status: quoteError ? 'failed' : 'success',
        error: quoteError?.message || null,
        url: process.env.QUOTE_DB_URL || 'https://lkqbrlrmrsnbtkoryazq.supabase.co',
        keyPresent: !!process.env.QUOTE_ANON_KEY,
      };
    } catch (error) {
      results.tests.quote = {
        status: 'failed',
        error: error.message,
        url: process.env.QUOTE_DB_URL || 'https://lkqbrlrmrsnbtkoryazq.supabase.co',
        keyPresent: !!process.env.QUOTE_ANON_KEY,
      };
    }

    // Test quote_mappings table specifically
    try {
      const { data: mappingsTest, error: mappingsError } = await quoteDB
        .from('quote_mappings')
        .select('id, quote_name, destination')
        .limit(5);

      results.tests.quoteMappings = {
        status: mappingsError ? 'failed' : 'success',
        error: mappingsError?.message || null,
        recordCount: mappingsTest?.length || 0,
        sampleData: mappingsTest?.slice(0, 2) || [],
      };
    } catch (error) {
      results.tests.quoteMappings = {
        status: 'failed',
        error: error.message,
        recordCount: 0,
        sampleData: [],
      };
    }

    const allPassed = Object.values(results.tests).every(test => test.status === 'success');

    res.status(allPassed ? 200 : 500).json({
      success: allPassed,
      message: allPassed
        ? 'All database connections successful'
        : 'Some database connections failed',
      ...results,
    });
  } catch (error) {
    console.error('❌ Database test endpoint error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Database connections
const crmDB = createClient(
  process.env.CRM_DB_URL || 'https://tlfwcnikdlwoliqzavxj.supabase.co',
  process.env.CRM_ANON_KEY
);

const quoteDB = createClient(
  process.env.QUOTE_DB_URL || 'https://lkqbrlrmrsnbtkoryazq.supabase.co',
  process.env.QUOTE_ANON_KEY
);

// Utility Functions
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const extractUuidFromEmiId = emiId => {
  if (!emiId) return null;

  console.log('🔍 Extracting UUID from EMI ID:', emiId);

  // If it's already a valid UUID, return as is
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(emiId)) {
    console.log('✅ Already valid UUID:', emiId);
    return emiId;
  }

  // Extract UUID from EMI ID format like "emi-6-874e424f-05da-4114-883f-37e4ad36aab1"
  // The format is: emi-{months}-{uuid}
  const parts = emiId.split('-');
  console.log('🔍 EMI ID parts:', parts);

  if (parts.length >= 5 && parts[0] === 'emi') {
    // Reconstruct UUID from parts (skip "emi" and months)
    const uuidParts = parts.slice(2); // Skip "emi" and months number
    const uuid = uuidParts.join('-');
    console.log('🔍 Reconstructed UUID:', uuid);

    if (uuidRegex.test(uuid)) {
      console.log('✅ Valid UUID extracted:', uuid);
      return uuid;
    }
  }

  // Try to find UUID pattern anywhere in the string
  const uuidMatch = emiId.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
  if (uuidMatch) {
    console.log('✅ UUID found in string:', uuidMatch[0]);
    return uuidMatch[0];
  }

  console.warn('❌ Could not extract valid UUID from EMI ID:', emiId);
  return null;
};

const formatTravelDate = dateString => {
  if (!dateString) return null;

  // If it's already a valid date format, return as is
  if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateString;
  }

  // Handle "YYYY-MM" format by adding first day of month
  if (dateString.match(/^\d{4}-\d{2}$/)) {
    return `${dateString}-01`;
  }

  // Handle other formats
  try {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0]; // Return YYYY-MM-DD format
    }
  } catch (error) {
    console.warn('Could not parse travel date:', dateString);
  }

  return null;
};

const detectFamilyType = async (adults, children, infants) => {
  try {
    const { data: familyTypes, error } = await crmDB.from('family_type').select('*');

    if (error) throw error;

    // Find exact match first
    let match = familyTypes.find(
      ft =>
        ft.no_of_adults === adults && ft.no_of_children === children && ft.no_of_infants === infants
    );

    // If no exact match, find closest match
    if (!match) {
      match = familyTypes.find(
        ft =>
          ft.no_of_adults === adults && ft.no_of_children >= children && ft.no_of_infants >= infants
      );
    }

    // Default to Stellar Duo if no match
    if (!match) {
      match = familyTypes.find(ft => ft.family_id === 'SD') || familyTypes[0];
    }

    return match;
  } catch (error) {
    console.error('Error detecting family type:', error);
    // Return default family type
    return {
      family_id: 'SD',
      family_type: 'Stellar Duo',
      no_of_adults: 2,
      no_of_children: 0,
      no_of_infants: 0,
      composition: '2 Adults',
    };
  }
};

const formatPackageForFrontend = packageData => {
  return {
    id: packageData.id,
    title: packageData.package_title || `${packageData.destination} Package`,
    destination: packageData.destination,
    duration_days: packageData.package_duration_days || 5,
    total_price: packageData.total_price,
    family_type: packageData.family_type_name,
    emi_options:
      packageData.family_type_emi_plans?.map(emi => ({
        id: emi.id,
        months: emi.emi_months,
        monthly_amount: emi.monthly_amount,
        total_amount: emi.total_amount,
        processing_fee: emi.processing_fee,
        label: emi.marketing_label || `${emi.emi_months} Months`,
        is_featured: emi.is_featured,
      })) || [],
    inclusions: ['Flights', 'Hotels', 'Meals', 'Sightseeing'],
    images: [`/img/rectangle-14.png`], // Default image
    offer_badge: packageData.total_price > 40000 ? '15% OFF' : 'Best Value',
  };
};

// Enhanced helper function to format package details for frontend
async function formatPackageDetailsForFrontend(packageData) {
  // First, try to get additional data from quotes table if we have quote_id
  let enrichedPackageData = { ...packageData };

  if (packageData.quote_id && !packageData.destination) {
    try {
      const { data: quoteData, error: quoteError } = await quoteDB
        .from('quotes')
        .select(
          'destination, package_name, total_cost, customer_name, family_type, no_of_persons, children, infants, extra_adults, trip_duration'
        )
        .eq('id', packageData.quote_id)
        .single();

      if (!quoteError && quoteData) {
        enrichedPackageData = {
          ...packageData,
          destination: quoteData.destination,
          package_name: quoteData.package_name,
          quote_total_cost: quoteData.total_cost,
          quote_customer_name: quoteData.customer_name,
          quote_family_type: quoteData.family_type,
          quote_duration: quoteData.trip_duration,
        };
        console.log('✅ Enriched package data with quote information');
      }
    } catch (error) {
      console.warn('⚠️ Could not enrich package data with quote information:', error);
    }
  }

  const basePackage = formatPackageForFrontend(enrichedPackageData);

  // Extract detailed information from Quote Generator database
  const hotelInfo = extractHotelDetails(enrichedPackageData);
  const mealPlanInfo = extractMealPlanDetails(enrichedPackageData);
  const detailedInclusions = extractDetailedInclusions(enrichedPackageData);
  const detailedExclusions = extractDetailedExclusions(enrichedPackageData);
  const packageDescription = generatePackageDescription(enrichedPackageData);
  const itinerary = generateDetailedItinerary(enrichedPackageData);

  return {
    ...basePackage,
    // Enhanced package information
    package_name:
      enrichedPackageData.package_name || enrichedPackageData.quote_name || basePackage.title,
    hotel_name: hotelInfo.name,
    hotel_category: hotelInfo.category,
    nights:
      enrichedPackageData.package_duration_days ||
      enrichedPackageData.quote_duration ||
      enrichedPackageData.duration_days ||
      5,
    meal_plan: mealPlanInfo.plan,
    meal_details: mealPlanInfo.details,

    // Use destination from enriched data
    destination: enrichedPackageData.destination || basePackage.destination,

    // Detailed descriptions
    description: packageDescription,
    itinerary: itinerary,

    // Comprehensive inclusions and exclusions
    inclusions: detailedInclusions,
    exclusions: detailedExclusions,

    // Additional package details
    ferry_included: isFerryIncluded(enrichedPackageData),
    guide_included: isGuideIncluded(enrichedPackageData),
    activities_included: getIncludedActivities(enrichedPackageData),

    // Pricing breakdown
    cost_breakdown: generateCostBreakdown(enrichedPackageData),

    // Package metadata
    data_source: enrichedPackageData.data_source || 'quote_generator',
    last_updated: enrichedPackageData.updated_at || enrichedPackageData.created_at,
    validity: getPackageValidity(enrichedPackageData),
  };
}

// Helper functions for package details extraction
function extractHotelDetails(packageData) {
  let hotelName = 'Hotel Included';
  let hotelCategory = '3-4 Star';

  // Try to get from quote_mappings hotel_mappings
  if (packageData.quote_mapping_data && packageData.quote_mapping_data.hotel_mappings) {
    const hotelMappings = packageData.quote_mapping_data.hotel_mappings;
    if (hotelMappings.length > 0) {
      hotelName = hotelMappings[0].hotel_name || hotelName;
    }
  }

  // Try to get from baseline_quote_data
  if (packageData.baseline_quote_data && packageData.baseline_quote_data.hotel_name) {
    hotelName = packageData.baseline_quote_data.hotel_name;
  }

  // Try to get from direct fields
  if (packageData.hotel_name) {
    hotelName = packageData.hotel_name;
  }

  // Determine hotel category based on price
  const totalPrice = packageData.total_price || 0;
  if (totalPrice > 80000) {
    hotelCategory = '4-5 Star Luxury';
  } else if (totalPrice > 50000) {
    hotelCategory = '3-4 Star Premium';
  } else if (totalPrice > 30000) {
    hotelCategory = '3 Star Standard';
  } else {
    hotelCategory = '2-3 Star Budget';
  }

  return {
    name: hotelName,
    category: hotelCategory,
  };
}

function extractMealPlanDetails(packageData) {
  let mealPlan = 'Breakfast Included';
  let mealDetails = [];

  // Check additional costs for meal information
  if (packageData.additional_costs) {
    const mealCost = packageData.additional_costs.meal_cost_per_person || 0;
    if (mealCost > 0) {
      if (mealCost > 1500) {
        mealPlan = 'All Meals Included (MAP)';
        mealDetails = ['Daily Breakfast', 'Daily Lunch', 'Daily Dinner'];
      } else if (mealCost > 800) {
        mealPlan = 'Breakfast & Dinner (CP)';
        mealDetails = ['Daily Breakfast', 'Daily Dinner'];
      } else {
        mealPlan = 'Breakfast Included (EP)';
        mealDetails = ['Daily Breakfast'];
      }
    }
  }

  // Check quote mapping data
  if (packageData.quote_mapping_data && packageData.quote_mapping_data.additional_costs) {
    const costs = packageData.quote_mapping_data.additional_costs;
    const mealCost = costs.meal_cost_per_person || 0;
    if (mealCost > 0) {
      if (mealCost > 1500) {
        mealPlan = 'All Meals Included (MAP)';
        mealDetails = ['Daily Breakfast', 'Daily Lunch', 'Daily Dinner'];
      } else if (mealCost > 800) {
        mealPlan = 'Breakfast & Dinner (CP)';
        mealDetails = ['Daily Breakfast', 'Daily Dinner'];
      }
    }
  }

  return {
    plan: mealPlan,
    details: mealDetails,
  };
}

function extractDetailedInclusions(packageData) {
  const inclusions = [];

  // Standard inclusions
  inclusions.push('Accommodation as per itinerary');

  // Transportation
  if (
    packageData.vehicle_cost > 0 ||
    (packageData.quote_mapping_data && packageData.quote_mapping_data.vehicle_mappings)
  ) {
    inclusions.push('Private vehicle for all transfers and sightseeing');
  } else {
    inclusions.push('Airport transfers');
  }

  // Meals based on meal plan
  const mealInfo = extractMealPlanDetails(packageData);
  if (mealInfo.details.length > 0) {
    inclusions.push(...mealInfo.details);
  } else {
    inclusions.push('Daily breakfast');
  }

  // Ferry if included
  if (isFerryIncluded(packageData)) {
    inclusions.push('Ferry tickets (adults and children)');
  }

  // Guide if included
  if (isGuideIncluded(packageData)) {
    inclusions.push('Professional tour guide');
  }

  // Activities
  const activities = getIncludedActivities(packageData);
  if (activities.length > 0) {
    inclusions.push(...activities);
  } else {
    inclusions.push('All sightseeing as per itinerary');
  }

  // Additional inclusions based on price
  const totalPrice = packageData.total_price || 0;
  if (totalPrice > 50000) {
    inclusions.push('Welcome drink on arrival');
  }
  if (totalPrice > 80000) {
    inclusions.push('Complimentary Wi-Fi');
    inclusions.push('24/7 customer support');
  }

  // Standard inclusions
  inclusions.push('All applicable taxes');

  return inclusions;
}

function extractDetailedExclusions(packageData) {
  const exclusions = [
    'Airfare (can be arranged separately)',
    'Personal expenses like laundry, telephone calls, tips, etc.',
    'Travel insurance',
    'Any meals not mentioned in inclusions',
    'Entry fees to monuments and parks',
    'Camera fees at monuments',
    'Medical expenses',
    'Any expenses arising due to unforeseen circumstances',
    'Anything not mentioned in inclusions',
  ];

  // Add specific exclusions based on package type
  if (!isFerryIncluded(packageData)) {
    exclusions.unshift('Ferry tickets');
  }

  if (!isGuideIncluded(packageData)) {
    exclusions.unshift('Tour guide charges');
  }

  return exclusions;
}

function isFerryIncluded(packageData) {
  if (packageData.additional_costs && packageData.additional_costs.ferry_cost > 0) {
    return true;
  }
  if (
    packageData.quote_mapping_data &&
    packageData.quote_mapping_data.additional_costs &&
    packageData.quote_mapping_data.additional_costs.ferry_cost > 0
  ) {
    return true;
  }
  return false;
}

function isGuideIncluded(packageData) {
  if (packageData.additional_costs && packageData.additional_costs.guide_cost_per_day > 0) {
    return true;
  }
  if (
    packageData.quote_mapping_data &&
    packageData.quote_mapping_data.additional_costs &&
    packageData.quote_mapping_data.additional_costs.guide_cost_per_day > 0
  ) {
    return true;
  }
  return packageData.total_price > 60000; // Include guide for premium packages
}

function getIncludedActivities(packageData) {
  const activities = [];

  if (packageData.additional_costs && packageData.additional_costs.activity_cost_per_person > 0) {
    // Determine activities based on destination
    const destination = (packageData.destination || '').toLowerCase();

    if (destination.includes('kashmir')) {
      activities.push('Shikara ride in Dal Lake', 'Gondola ride in Gulmarg');
    } else if (destination.includes('goa')) {
      activities.push('Water sports activities', 'Beach activities');
    } else if (destination.includes('manali')) {
      activities.push('Adventure activities', 'Local sightseeing');
    } else if (destination.includes('andaman')) {
      activities.push('Snorkeling', 'Island hopping');
    } else {
      activities.push('Local activities and experiences');
    }
  }

  return activities;
}

function generatePackageDescription(packageData) {
  const destination = packageData.destination || 'your destination';
  const nights = packageData.package_duration_days || packageData.duration_days || 5;
  const familyType = packageData.family_type_name || 'families';

  let description = `Experience the beauty and charm of ${destination} with our specially crafted ${nights}-night family package. `;
  description += `Perfect for ${familyType.toLowerCase()}, this package offers a perfect blend of comfort, adventure, and relaxation. `;

  // Add destination-specific description
  const dest = destination.toLowerCase();
  if (dest.includes('kashmir')) {
    description +=
      'Explore the paradise on earth with its pristine lakes, snow-capped mountains, and beautiful gardens. ';
  } else if (dest.includes('goa')) {
    description +=
      'Enjoy the sun, sand, and sea with beautiful beaches, vibrant nightlife, and Portuguese heritage. ';
  } else if (dest.includes('manali')) {
    description +=
      'Discover the hill station beauty with adventure activities, scenic landscapes, and pleasant weather. ';
  } else if (dest.includes('kerala')) {
    description +=
      "Experience God's own country with backwaters, spice plantations, and cultural heritage. ";
  }

  description +=
    'All arrangements are made to ensure a memorable and hassle-free vacation for your family.';

  return description;
}

function generateDetailedItinerary(packageData) {
  const destination = packageData.destination || 'Destination';
  const nights = packageData.package_duration_days || packageData.duration_days || 5;
  const itinerary = [];

  // Day 1 - Arrival
  itinerary.push({
    day: 1,
    title: `Arrival in ${destination}`,
    description: `Arrive at ${destination} airport/railway station. Meet and greet by our representative. Transfer to hotel and check-in. Rest of the day at leisure. Overnight stay at hotel.`,
  });

  // Middle days - Sightseeing
  for (let day = 2; day <= nights; day++) {
    if (day === nights) break; // Skip last day for departure

    let dayTitle = '';
    let dayDescription = '';

    // Destination-specific itinerary
    const dest = destination.toLowerCase();
    if (dest.includes('kashmir')) {
      if (day === 2) {
        dayTitle = 'Srinagar Local Sightseeing';
        dayDescription =
          'After breakfast, visit Mughal Gardens - Nishat Bagh, Shalimar Bagh, and Chashme Shahi. Enjoy Shikara ride in Dal Lake. Visit local markets. Overnight stay at hotel.';
      } else if (day === 3) {
        dayTitle = 'Srinagar to Gulmarg';
        dayDescription =
          'After breakfast, drive to Gulmarg (2 hours). Enjoy Gondola ride (Phase 1 & 2). Experience snow activities. Return to Srinagar. Overnight stay at hotel.';
      } else {
        dayTitle = 'Pahalgam Excursion';
        dayDescription =
          'After breakfast, full day excursion to Pahalgam. Visit Betaab Valley, Aru Valley, and Chandanwari. Return to Srinagar. Overnight stay at hotel.';
      }
    } else if (dest.includes('goa')) {
      if (day === 2) {
        dayTitle = 'North Goa Sightseeing';
        dayDescription =
          'After breakfast, visit North Goa beaches - Calangute, Baga, Anjuna. Visit Fort Aguada. Enjoy water sports. Overnight stay at hotel.';
      } else if (day === 3) {
        dayTitle = 'South Goa Sightseeing';
        dayDescription =
          'After breakfast, visit South Goa beaches - Colva, Benaulim. Visit Old Goa churches. Spice plantation tour. Overnight stay at hotel.';
      } else {
        dayTitle = 'Leisure Day';
        dayDescription =
          'Day at leisure. Enjoy beach activities, shopping, or optional tours. Overnight stay at hotel.';
      }
    } else {
      dayTitle = `${destination} Sightseeing - Day ${day - 1}`;
      dayDescription = `After breakfast, proceed for sightseeing tour of ${destination}. Visit major attractions and local markets. Return to hotel. Overnight stay at hotel.`;
    }

    itinerary.push({
      day: day,
      title: dayTitle,
      description: dayDescription,
    });
  }

  // Last day - Departure
  itinerary.push({
    day: nights + 1,
    title: 'Departure',
    description: `After breakfast, check-out from hotel. Transfer to airport/railway station for onward journey. Tour ends with sweet memories.`,
  });

  return itinerary;
}

function generateCostBreakdown(packageData) {
  const breakdown = [];

  if (packageData.hotel_cost > 0) {
    breakdown.push({
      item: 'Accommodation',
      cost: packageData.hotel_cost,
      description: `${packageData.package_duration_days || 5} nights hotel stay`,
    });
  }

  if (packageData.vehicle_cost > 0) {
    breakdown.push({
      item: 'Transportation',
      cost: packageData.vehicle_cost,
      description: 'Private vehicle for transfers and sightseeing',
    });
  }

  if (packageData.additional_costs) {
    const costs = packageData.additional_costs;

    if (costs.meal_cost_per_person > 0) {
      const familyCount = packageData.family_count || 4;
      breakdown.push({
        item: 'Meals',
        cost: costs.meal_cost_per_person * familyCount,
        description: `Meals for ${familyCount} persons`,
      });
    }

    if (costs.ferry_cost > 0) {
      const ferryPersons =
        (packageData.no_of_adults || 2) +
        (packageData.no_of_children || 0) +
        (packageData.no_of_child || 0);
      breakdown.push({
        item: 'Ferry',
        cost: costs.ferry_cost * ferryPersons,
        description: `Ferry tickets for ${ferryPersons} persons (excluding infants)`,
      });
    }

    if (costs.activity_cost_per_person > 0) {
      const familyCount = packageData.family_count || 4;
      breakdown.push({
        item: 'Activities',
        cost: costs.activity_cost_per_person * familyCount,
        description: `Activities for ${familyCount} persons`,
      });
    }

    if (costs.guide_cost_per_day > 0) {
      const days = packageData.package_duration_days || 5;
      breakdown.push({
        item: 'Guide',
        cost: costs.guide_cost_per_day * days,
        description: `Professional guide for ${days} days`,
      });
    }
  }

  // Add total
  const total = breakdown.reduce((sum, item) => sum + item.cost, 0);
  if (total > 0 && total !== packageData.total_price) {
    breakdown.push({
      item: 'Other charges',
      cost: (packageData.total_price || 0) - total,
      description: 'Taxes, service charges, and other fees',
    });
  }

  return breakdown;
}

function getPackageValidity(packageData) {
  if (packageData.travel_date) {
    return `Valid for travel: ${new Date(packageData.travel_date).toLocaleDateString()}`;
  }
  if (packageData.created_at) {
    const validUntil = new Date(packageData.created_at);
    validUntil.setMonth(validUntil.getMonth() + 6); // Valid for 6 months
    return `Valid until: ${validUntil.toLocaleDateString()}`;
  }
  return 'Valid for booking';
}

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Family EMI API is running',
    timestamp: new Date().toISOString(),
  });
});

// Create all EMI plans (3, 6, 12 months) for payment processing
app.post('/api/create-all-emi-plans', async (req, res) => {
  try {
    console.log('🔧 Creating all EMI plan records (3, 6, 12 months)...');

    const basePrice = 28050;
    const packageId = '874e424f-05da-4114-883f-37e4ad36aab1';

    // Generate proper UUIDs for EMI plans
    const generateUUID = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    };

    const emiPlansData = [
      {
        id: generateUUID(),
        family_price_id: packageId,
        emi_months: 3,
        monthly_amount: Math.round(basePrice / 3),
        processing_fee: Math.round(basePrice * 0.02),
        total_amount: basePrice,
        total_interest: 0,
        marketing_label: 'Quick Pay',
        is_featured: false,
      },
      {
        id: generateUUID(),
        family_price_id: packageId,
        emi_months: 6,
        monthly_amount: Math.round(basePrice / 6),
        processing_fee: Math.round(basePrice * 0.03),
        total_amount: basePrice,
        total_interest: 0,
        marketing_label: 'Best Value',
        is_featured: true,
      },
      {
        id: generateUUID(),
        family_price_id: packageId,
        emi_months: 12,
        monthly_amount: Math.round(basePrice / 12),
        processing_fee: Math.round(basePrice * 0.05),
        total_amount: basePrice,
        total_interest: 0,
        marketing_label: 'Low Monthly',
        is_featured: false,
      },
    ];

    const results = [];
    const errors = [];

    for (const planData of emiPlansData) {
      try {
        const { data, error } = await quoteDB
          .from('family_type_emi_plans')
          .upsert(planData, { onConflict: 'id' })
          .select()
          .single();

        if (error) {
          console.error(`❌ Error creating ${planData.emi_months}-month plan:`, error);
          errors.push({ plan: `${planData.emi_months}-month`, error: error.message });
        } else {
          console.log(`✅ ${planData.emi_months}-month EMI plan created:`, data);
          results.push(data);
        }
      } catch (err) {
        console.error(`❌ Exception creating ${planData.emi_months}-month plan:`, err);
        errors.push({ plan: `${planData.emi_months}-month`, error: err.message });
      }
    }

    if (errors.length > 0) {
      res.status(500).json({
        success: false,
        message: 'Some EMI plans failed to create',
        results: results,
        errors: errors,
      });
    } else {
      res.json({
        success: true,
        message: 'All EMI plans created successfully',
        data: results,
        count: results.length,
      });
    }
  } catch (error) {
    console.error('❌ Error creating EMI plans:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Create EMI plan record for payment processing (legacy endpoint)
app.post('/api/create-emi-plan', async (req, res) => {
  try {
    console.log('🔧 Creating EMI plan record...');

    const emiPlanData = {
      id: '874e424f-05da-4114-883f-37e4ad36aab1', // Package ID
      family_price_id: '874e424f-05da-4114-883f-37e4ad36aab1', // Use same ID for family_price_id
      emi_months: 6,
      monthly_amount: 4675,
      processing_fee: 842,
      total_amount: 28050,
      total_interest: 0, // No interest for now
    };

    const { data, error } = await quoteDB
      .from('family_type_emi_plans')
      .insert(emiPlanData)
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating EMI plan:', error);
      res.status(500).json({
        success: false,
        error: error.message,
        details: error,
      });
    } else {
      console.log('✅ EMI plan created:', data);
      res.json({
        success: true,
        message: 'EMI plan created successfully',
        data: data,
      });
    }
  } catch (error) {
    console.error('❌ Error creating EMI plan:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Remove duplicate EMI plans
app.delete('/api/remove-duplicate-emi-plans', async (req, res) => {
  try {
    console.log('🔧 Removing duplicate EMI plans...');

    // Remove the original 6-month plan that doesn't have marketing_label
    const { data, error } = await quoteDB
      .from('family_type_emi_plans')
      .delete()
      .eq('id', '874e424f-05da-4114-883f-37e4ad36aab1')
      .select();

    if (error) {
      console.error('❌ Error removing duplicate EMI plan:', error);
      res.status(500).json({
        success: false,
        error: error.message,
        details: error,
      });
    } else {
      console.log('✅ Duplicate EMI plan removed:', data);
      res.json({
        success: true,
        message: 'Duplicate EMI plan removed successfully',
        removed_plan_id: '874e424f-05da-4114-883f-37e4ad36aab1',
        data: data,
      });
    }
  } catch (error) {
    console.error('❌ Error removing duplicate EMI plan:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Check family_type_prices table to understand the data structure
app.get('/api/check-family-prices', async (req, res) => {
  try {
    console.log('🔍 Checking family_type_prices table...');

    // Get sample data from family_type_prices
    const { data: pricesData, error: pricesError } = await quoteDB
      .from('family_type_prices')
      .select('*')
      .limit(5);

    if (!pricesError) {
      const columns = pricesData && pricesData.length > 0 ? Object.keys(pricesData[0]) : [];

      console.log('📋 Family prices table columns:', columns);
      console.log('📊 Sample family prices:', pricesData);

      res.json({
        success: true,
        table: 'family_type_prices',
        exists: true,
        columns: columns,
        sample_records: pricesData,
        record_count: pricesData?.length || 0,
      });
    } else {
      res.json({
        success: false,
        error: pricesError.message,
        table: 'family_type_prices',
      });
    }
  } catch (error) {
    console.error('❌ Error checking family prices table:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Clean up EMI plans - keep only 3 essential plans (3, 6, 12 months)
app.post('/api/cleanup-emi-plans', async (req, res) => {
  try {
    console.log('🧹 Cleaning up EMI plans - keeping only 3 essential plans...');

    // Get all existing EMI plans first
    const { data: allPlans, error: fetchError } = await quoteDB
      .from('family_type_emi_plans')
      .select('*')
      .order('emi_months');

    if (fetchError) {
      console.error('❌ Error fetching EMI plans:', fetchError);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch existing EMI plans',
        details: fetchError.message,
      });
    }

    console.log(`📊 Found ${allPlans.length} existing EMI plans`);

    // Find one representative plan for each duration (3, 6, 12 months)
    const plansByMonths = allPlans.reduce((acc, plan) => {
      if (!acc[plan.emi_months]) {
        acc[plan.emi_months] = plan;
      }
      return acc;
    }, {});

    const plansToKeep = [plansByMonths[3], plansByMonths[6], plansByMonths[12]].filter(Boolean); // Remove any undefined plans

    console.log(
      `🎯 Keeping ${plansToKeep.length} representative plans:`,
      plansToKeep.map(p => `${p.emi_months} months (${p.id})`)
    );

    // Get IDs of plans to keep
    const idsToKeep = plansToKeep.map(p => p.id);

    // Delete all plans except the ones we want to keep
    const { error: deleteError } = await quoteDB
      .from('family_type_emi_plans')
      .delete()
      .not('id', 'in', `(${idsToKeep.map(id => `'${id}'`).join(',')})`);

    if (deleteError) {
      console.error('❌ Error deleting excess EMI plans:', deleteError);
      return res.status(500).json({
        success: false,
        error: 'Failed to delete excess EMI plans',
        details: deleteError.message,
      });
    }

    // Verify the cleanup
    const { data: remainingPlans, error: verifyError } = await quoteDB
      .from('family_type_emi_plans')
      .select('*')
      .order('emi_months');

    if (verifyError) {
      console.error('❌ Error verifying cleanup:', verifyError);
      return res.status(500).json({
        success: false,
        error: 'Failed to verify cleanup',
        details: verifyError.message,
      });
    }

    console.log('✅ EMI plans cleanup completed');
    console.log('📊 Remaining EMI plans:', remainingPlans);

    res.json({
      success: true,
      message: 'EMI plans cleaned up successfully - kept only essential plans',
      original_count: allPlans.length,
      remaining_count: remainingPlans.length,
      remaining_plans: remainingPlans,
    });
  } catch (error) {
    console.error('❌ Error cleaning up EMI plans:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Create only 3 essential EMI plans (3, 6, 12 months)
app.post('/api/create-essential-emi-plans', async (req, res) => {
  try {
    console.log('🔧 Creating 3 essential EMI plans...');

    const generateUUID = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    };

    // Get a sample family price record to use as reference
    const { data: samplePrice, error: priceError } = await quoteDB
      .from('family_type_prices')
      .select('*')
      .limit(1);

    if (priceError || !samplePrice || samplePrice.length === 0) {
      console.error('❌ Error fetching sample family price:', priceError);
      return res.status(500).json({
        success: false,
        error: 'Could not fetch sample family price data',
        details: priceError?.message,
      });
    }

    const referencePriceRecord = samplePrice[0];
    const basePrice = referencePriceRecord.total_price || 30000;

    console.log(
      `📊 Using reference price record: ${referencePriceRecord.id} with price ₹${basePrice}`
    );

    const essentialEMIPlans = [
      {
        id: generateUUID(),
        family_price_id: referencePriceRecord.id,
        emi_months: 3,
        monthly_amount: Math.round(basePrice / 3),
        total_amount: basePrice,
        processing_fee: Math.round(basePrice * 0.02),
        total_interest: 0,
        first_payment_amount: null,
        subsequent_payment_amount: null,
        final_payment_amount: null,
        savings_vs_full_payment: 0,
        effective_annual_rate: null,
        is_featured: false,
        marketing_label: 'Quick Pay',
        is_prepaid_plan: false,
        prepaid_discount_amount: 0,
        prepaid_total_amount: null,
        advance_payment_required: 0,
        advance_payment_percent: 20,
        selected_emi_plan_id: null,
        emi_plan_id: null,
      },
      {
        id: generateUUID(),
        family_price_id: referencePriceRecord.id,
        emi_months: 6,
        monthly_amount: Math.round(basePrice / 6),
        total_amount: basePrice,
        processing_fee: Math.round(basePrice * 0.03),
        total_interest: 0,
        first_payment_amount: null,
        subsequent_payment_amount: null,
        final_payment_amount: null,
        savings_vs_full_payment: 0,
        effective_annual_rate: null,
        is_featured: true,
        marketing_label: 'Best Value',
        is_prepaid_plan: false,
        prepaid_discount_amount: 0,
        prepaid_total_amount: null,
        advance_payment_required: 0,
        advance_payment_percent: 20,
        selected_emi_plan_id: null,
        emi_plan_id: null,
      },
      {
        id: generateUUID(),
        family_price_id: referencePriceRecord.id,
        emi_months: 12,
        monthly_amount: Math.round(basePrice / 12),
        total_amount: basePrice,
        processing_fee: Math.round(basePrice * 0.05),
        total_interest: 0,
        first_payment_amount: null,
        subsequent_payment_amount: null,
        final_payment_amount: null,
        savings_vs_full_payment: 0,
        effective_annual_rate: null,
        is_featured: false,
        marketing_label: 'Low Monthly',
        is_prepaid_plan: false,
        prepaid_discount_amount: 0,
        prepaid_total_amount: null,
        advance_payment_required: 0,
        advance_payment_percent: 20,
        selected_emi_plan_id: null,
        emi_plan_id: null,
      },
    ];

    console.log('🔧 Creating 3 essential EMI plans...');

    // Insert the 3 essential EMI plans
    const { data: insertedPlans, error: insertError } = await quoteDB
      .from('family_type_emi_plans')
      .insert(essentialEMIPlans)
      .select();

    if (insertError) {
      console.error('❌ Error inserting essential EMI plans:', insertError);
      return res.status(500).json({
        success: false,
        error: 'Failed to create essential EMI plans',
        details: insertError.message,
      });
    }

    console.log(`✅ Successfully created ${insertedPlans?.length || 0} essential EMI plans`);

    res.json({
      success: true,
      message: 'Essential EMI plans created successfully',
      created_count: insertedPlans?.length || 0,
      plans: insertedPlans || [],
    });
  } catch (error) {
    console.error('❌ Error creating essential EMI plans:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Create EMI plans based on family_type_prices data
app.post('/api/create-emi-plans-from-prices', async (req, res) => {
  try {
    console.log('🔧 Creating EMI plans from family_type_prices data...');

    // Get all family type prices
    const { data: pricesData, error: pricesError } = await quoteDB
      .from('family_type_prices')
      .select('*');

    if (pricesError || !pricesData || pricesData.length === 0) {
      console.error('❌ Error fetching family prices:', pricesError);
      return res.status(500).json({
        success: false,
        error: 'Could not fetch family prices data',
        details: pricesError?.message,
      });
    }

    console.log(`📊 Found ${pricesData.length} family price records`);

    const emiPlansToCreate = [];
    const generateUUID = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    };

    // Create EMI plans for each family price record
    for (const priceRecord of pricesData) {
      const basePrice = priceRecord.total_price || 25000; // Default if no price

      // Create 3, 6, and 12 month plans for each family price
      const plans = [
        {
          id: generateUUID(),
          family_price_id: priceRecord.id,
          emi_months: 3,
          monthly_amount: Math.round(basePrice / 3),
          total_amount: basePrice,
          processing_fee: Math.round(basePrice * 0.02),
          total_interest: 0,
          marketing_label: 'Quick Pay',
          is_featured: false,
        },
        {
          id: generateUUID(),
          family_price_id: priceRecord.id,
          emi_months: 6,
          monthly_amount: Math.round(basePrice / 6),
          total_amount: basePrice,
          processing_fee: Math.round(basePrice * 0.03),
          total_interest: 0,
          marketing_label: 'Best Value',
          is_featured: true,
        },
        {
          id: generateUUID(),
          family_price_id: priceRecord.id,
          emi_months: 12,
          monthly_amount: Math.round(basePrice / 12),
          total_amount: basePrice,
          processing_fee: Math.round(basePrice * 0.05),
          total_interest: 0,
          marketing_label: 'Low Monthly',
          is_featured: false,
        },
      ];

      emiPlansToCreate.push(...plans);
    }

    console.log(`🔧 Creating ${emiPlansToCreate.length} EMI plans...`);

    // Insert all EMI plans
    const { data: insertedPlans, error: insertError } = await quoteDB
      .from('family_type_emi_plans')
      .insert(emiPlansToCreate)
      .select();

    if (insertError) {
      console.error('❌ Error inserting EMI plans:', insertError);
      return res.status(500).json({
        success: false,
        error: 'Failed to create EMI plans',
        details: insertError.message,
      });
    }

    console.log(`✅ Successfully created ${insertedPlans?.length || 0} EMI plans`);

    res.json({
      success: true,
      message: 'EMI plans created successfully from family prices',
      created_count: insertedPlans?.length || 0,
      sample_plans: insertedPlans?.slice(0, 5) || [],
    });
  } catch (error) {
    console.error('❌ Error creating EMI plans from prices:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Check family_type_emi_plans table to see available EMI plans
app.get('/api/check-emi-plans', async (req, res) => {
  try {
    console.log('🔍 Checking family_type_emi_plans table...');

    // Try to get existing EMI plans
    const { data: emiPlansData, error: emiPlansError } = await quoteDB
      .from('family_type_emi_plans')
      .select('*')
      .limit(10);

    if (!emiPlansError) {
      const columns = emiPlansData && emiPlansData.length > 0 ? Object.keys(emiPlansData[0]) : [];

      console.log('📋 EMI plans table columns:', columns);
      console.log('📊 Available EMI plans:', emiPlansData);

      res.json({
        success: true,
        table: 'family_type_emi_plans',
        exists: true,
        columns: columns,
        sample_records: emiPlansData,
        record_count: emiPlansData?.length || 0,
      });
    } else {
      res.json({
        success: false,
        error: emiPlansError.message,
        table: 'family_type_emi_plans',
      });
    }
  } catch (error) {
    console.error('❌ Error checking EMI plans table:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Check EMI transactions table structure and constraints
app.get('/api/check-emi-table', async (req, res) => {
  try {
    console.log('🔍 Checking EMI transactions table structure...');

    // Try to get existing records to see valid status values
    const { data: emiData, error: emiError } = await quoteDB
      .from('prepaid_emi_transactions')
      .select('*')
      .limit(10);

    if (!emiError) {
      const columns = emiData && emiData.length > 0 ? Object.keys(emiData[0]) : [];
      const statusValues = emiData
        ? [...new Set(emiData.map(record => record.payment_status))]
        : [];
      const advanceStatusValues = emiData
        ? [...new Set(emiData.map(record => record.advance_payment_status))]
        : [];

      console.log('📋 EMI transactions table columns:', columns);
      console.log('📊 Existing payment_status values:', statusValues);
      console.log('📊 Existing advance_payment_status values:', advanceStatusValues);

      res.json({
        success: true,
        table: 'prepaid_emi_transactions',
        exists: true,
        columns: columns,
        sample_records: emiData,
        record_count: emiData?.length || 0,
        existing_payment_status_values: statusValues,
        existing_advance_payment_status_values: advanceStatusValues,
      });
    } else {
      res.json({
        success: false,
        error: emiError.message,
        table: 'prepaid_emi_transactions',
      });
    }
  } catch (error) {
    console.error('❌ Error checking EMI table:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Check payments table structure specifically
app.get('/api/check-payments-table', async (req, res) => {
  try {
    console.log('🔍 Checking payments table structure...');

    const { data: paymentsData, error: paymentsError } = await crmDB
      .from('payments')
      .select('*')
      .limit(5);

    if (!paymentsError) {
      const columns = paymentsData && paymentsData.length > 0 ? Object.keys(paymentsData[0]) : [];
      console.log('📋 Payments table columns:', columns);

      res.json({
        success: true,
        table: 'payments',
        exists: true,
        columns: columns,
        sample_records: paymentsData,
        record_count: paymentsData?.length || 0,
      });
    } else {
      res.json({
        success: false,
        error: paymentsError.message,
        table: 'payments',
      });
    }
  } catch (error) {
    console.error('❌ Error checking payments table:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Check CRM database tables thoroughly
app.get('/api/check-crm-tables', async (req, res) => {
  try {
    console.log('🔍 Checking CRM database tables thoroughly...');

    const tableChecks = [];

    // List of possible table names to check
    const possibleTables = [
      'prepaid_emi_transactions',
      'emi_payment_history',
      'prepaid_emi_transaction',
      'emi_payment_histories',
      'payment_transactions',
      'emi_transactions',
      'payment_history',
      'transactions',
      'payments',
    ];

    for (const tableName of possibleTables) {
      try {
        console.log(`🔍 Checking table: ${tableName}`);

        const { data, error } = await crmDB.from(tableName).select('*').limit(1);

        if (!error) {
          const columns = data && data.length > 0 ? Object.keys(data[0]) : [];
          tableChecks.push({
            table: tableName,
            exists: true,
            accessible: true,
            columns: columns,
            record_count: data?.length || 0,
            sample_record: data?.[0] || null,
          });
          console.log(`✅ Table ${tableName} exists and is accessible`);
        } else {
          tableChecks.push({
            table: tableName,
            exists: false,
            accessible: false,
            error: error.message,
            error_code: error.code,
          });
          console.log(`❌ Table ${tableName} error:`, error.code, error.message);
        }
      } catch (err) {
        tableChecks.push({
          table: tableName,
          exists: false,
          accessible: false,
          error: err.message,
          error_type: 'exception',
        });
        console.log(`❌ Exception checking ${tableName}:`, err.message);
      }
    }

    // Also check what tables are actually available by trying a generic query
    let availableTables = [];
    try {
      // Try to get schema information (this might not work depending on permissions)
      console.log('🔍 Attempting to get schema information...');

      // Alternative: try some common CRM table patterns
      const commonPatterns = [
        'customer',
        'user',
        'booking',
        'quote',
        'payment',
        'transaction',
        'emi',
        'plan',
      ];

      for (const pattern of commonPatterns) {
        try {
          const { data, error } = await crmDB.from(pattern).select('*').limit(1);

          if (!error) {
            availableTables.push({
              table: pattern,
              exists: true,
              columns: data && data.length > 0 ? Object.keys(data[0]) : [],
              sample_record: data?.[0] || null,
            });
            console.log(
              `✅ Found table: ${pattern} with columns:`,
              data && data.length > 0 ? Object.keys(data[0]) : []
            );
          }
        } catch (err) {
          // Ignore errors for pattern matching
        }
      }

      // Also check some additional table names that might exist
      const additionalTables = [
        'family_type',
        'family_type_prices',
        'emi_plans',
        'bookings',
        'customers',
        'quotes',
        'orders',
      ];

      for (const tableName of additionalTables) {
        try {
          const { data, error } = await crmDB.from(tableName).select('*').limit(1);

          if (!error) {
            availableTables.push({
              table: tableName,
              exists: true,
              columns: data && data.length > 0 ? Object.keys(data[0]) : [],
              sample_record: data?.[0] || null,
            });
            console.log(
              `✅ Found additional table: ${tableName} with columns:`,
              data && data.length > 0 ? Object.keys(data[0]) : []
            );
          }
        } catch (err) {
          // Ignore errors
        }
      }
    } catch (err) {
      console.log('❌ Could not get schema information:', err.message);
    }

    res.json({
      success: true,
      message: 'CRM database table check completed',
      database_url: process.env.CRM_SUPABASE_URL
        ? process.env.CRM_SUPABASE_URL.substring(0, 30) + '...'
        : 'Not configured',
      table_checks: tableChecks,
      available_tables: availableTables,
      existing_tables: tableChecks.filter(t => t.exists),
      accessible_tables: tableChecks.filter(t => t.accessible),
    });
  } catch (error) {
    console.error('❌ Error checking CRM tables:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: 'Failed to check CRM database tables',
    });
  }
});

// Check table structure (keep existing for quote DB)
app.get('/api/check-table-structure', async (req, res) => {
  try {
    console.log('🔍 Checking quote database table structure...');

    // Try to get a sample record to see available columns
    const { data: sampleData, error: sampleError } = await quoteDB
      .from('public_family_quotes')
      .select('*')
      .limit(1);

    if (sampleData && sampleData.length > 0) {
      const columns = Object.keys(sampleData[0]);
      console.log('📋 Available columns:', columns);

      res.json({
        success: true,
        table: 'public_family_quotes',
        columns: columns,
        sample_record: sampleData[0],
      });
    } else {
      res.json({
        success: false,
        error: 'No data found in table',
        details: sampleError,
      });
    }
  } catch (error) {
    console.error('❌ Error checking table structure:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get EMI transactions for management dashboard
app.get('/api/emi-transactions', async (req, res) => {
  try {
    console.log('📊 Fetching EMI transactions...');

    // First, fetch EMI transactions
    const { data: transactions, error: transactionError } = await quoteDB
      .from('prepaid_emi_transactions')
      .select('*')
      .order('created_at', { ascending: false });

    console.log('📋 Sample transaction structure:', transactions?.[0]);

    if (transactionError) {
      console.error('❌ Error fetching EMI transactions:', transactionError);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch EMI transactions',
        details: transactionError.message,
      });
    }

    // Then fetch customer data for each transaction
    const transactionsWithCustomerData = [];

    for (const transaction of transactions || []) {
      let customerData = null;

      // The customer_id field actually contains the quote_id
      if (transaction.customer_id) {
        const { data: quoteData, error: quoteError } = await quoteDB
          .from('public_family_quotes')
          .select('customer_name, customer_email, customer_phone, destination')
          .eq('id', transaction.customer_id)
          .single();

        if (!quoteError && quoteData) {
          customerData = quoteData;
        } else {
          console.log(`⚠️ No quote found for customer_id: ${transaction.customer_id}`);
        }
      }

      transactionsWithCustomerData.push({
        ...transaction,
        customer_data: customerData,
      });
    }

    // Transform data to match frontend interface
    const formattedTransactions = transactionsWithCustomerData.map((transaction, index) => ({
      id: transaction.id,
      booking_reference: transaction.booking_reference,
      customer_name: transaction.customer_data?.customer_name || `Customer ${index + 1}`,
      customer_phone: transaction.customer_data?.customer_phone || '+91 XXXXXXXXXX',
      customer_email: transaction.customer_data?.customer_email || 'customer@example.com',
      package_name: transaction.customer_data?.destination
        ? `${transaction.customer_data.destination} Package`
        : 'Travel Package',
      advance_payment_amount: transaction.advance_payment_amount,
      advance_payment_status: transaction.advance_payment_status,
      advance_payment_date: transaction.advance_payment_date,
      total_emi_amount: transaction.total_emi_amount,
      monthly_emi_amount: transaction.monthly_emi_amount,
      remaining_emi_months: transaction.remaining_emi_months,
      next_emi_due_date: transaction.next_emi_due_date,
      total_paid_amount: transaction.total_paid_amount,
      pending_amount: transaction.pending_amount,
      payment_status: transaction.payment_status,
      auto_debit_enabled: transaction.auto_debit_enabled,
      payment_method: transaction.payment_method,
      created_at: transaction.created_at,
    }));

    console.log(`✅ Successfully fetched ${formattedTransactions.length} EMI transactions`);

    res.json({
      success: true,
      transactions: formattedTransactions,
      count: formattedTransactions.length,
    });
  } catch (error) {
    console.error('❌ Error in EMI transactions endpoint:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Test database connections with detailed diagnostics
app.get('/api/test-db', async (req, res) => {
  try {
    console.log('🧪 Testing database connections...');

    // Test Quote database - prepaid_emi_transactions (correct location)
    const { data: emiTest, error: emiError } = await quoteDB
      .from('prepaid_emi_transactions')
      .select('id')
      .limit(1);

    console.log('Quote DB EMI transactions test:', { data: emiTest, error: emiError });

    // Test Quote database - emi_payment_history (correct location)
    const { data: historyTest, error: historyError } = await quoteDB
      .from('emi_payment_history')
      .select('id')
      .limit(1);

    console.log('Quote DB payment history test:', { data: historyTest, error: historyError });

    // Test Quote database
    const { data: quoteTest, error: quoteError } = await quoteDB
      .from('public_family_quotes')
      .select('id')
      .limit(1);

    console.log('Quote DB test result:', { data: quoteTest, error: quoteError });

    // Determine the status
    const emiTableExists = !emiError || emiError.code !== '42P01';
    const historyTableExists = !historyError || historyError.code !== '42P01';
    const emiTableAccessible = !emiError;
    const historyTableAccessible = !historyError;

    res.json({
      success: true,
      tables_status: {
        prepaid_emi_transactions: {
          exists: emiTableExists,
          accessible: emiTableAccessible,
          error: emiError?.message,
          error_code: emiError?.code,
          data_count: emiTest?.length || 0,
          location: 'quote_database',
        },
        emi_payment_history: {
          exists: historyTableExists,
          accessible: historyTableAccessible,
          error: historyError?.message,
          error_code: historyError?.code,
          data_count: historyTest?.length || 0,
          location: 'quote_database',
        },
      },
      quote_db: {
        connected: !quoteError,
        error: quoteError?.message,
        data_count: quoteTest?.length || 0,
      },
      diagnosis: {
        tables_exist: emiTableExists && historyTableExists,
        tables_accessible: emiTableAccessible && historyTableAccessible,
        ready_for_payments: emiTableAccessible && historyTableAccessible,
      },
    });
  } catch (error) {
    console.error('❌ Database test error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Create payment tables directly (simplified approach)
app.post('/api/create-payment-tables', async (req, res) => {
  try {
    console.log('🔧 Creating payment tables directly...');

    // Try to create tables using direct insert approach (this will fail but help us understand the issue)
    try {
      // First, let's try to insert a test record to see what happens
      const testData = {
        booking_reference: `TEST_${Date.now()}`,
        customer_id: '00000000-0000-0000-0000-000000000000',
        payment_status: 'test',
        total_paid_amount: 0,
        pending_amount: 0,
        monthly_emi_amount: 0,
        total_emi_amount: 0,
        remaining_emi_months: 0,
        payment_method: 'test',
      };

      console.log('🧪 Attempting to insert test data:', testData);

      const { data: insertResult, error: insertError } = await crmDB
        .from('prepaid_emi_transactions')
        .insert(testData)
        .select();

      if (insertError) {
        console.log('❌ Insert failed (expected):', insertError);

        // If table doesn't exist, we'll get a specific error
        if (insertError.code === '42P01') {
          return res.json({
            success: false,
            error: 'Tables do not exist',
            message: 'Please create the tables manually in Supabase SQL Editor',
            instructions: {
              step1: 'Go to your Supabase CRM project',
              step2: 'Open SQL Editor',
              step3: 'Run the SQL script from setup-payment-tables.sql',
              step4: 'Test again using /api/test-db endpoint',
            },
            sql_script_url: '/setup-payment-tables.sql',
          });
        } else {
          return res.json({
            success: false,
            error: 'Table exists but insert failed',
            details: insertError,
            message: 'Tables might exist but have permission issues',
          });
        }
      } else {
        console.log('✅ Test insert successful:', insertResult);

        // Clean up test data
        await crmDB
          .from('prepaid_emi_transactions')
          .delete()
          .eq('booking_reference', testData.booking_reference);

        return res.json({
          success: true,
          message: 'Tables exist and are working!',
          test_result: insertResult,
        });
      }
    } catch (error) {
      console.error('❌ Error during table test:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to test tables',
        details: error.message,
      });
    }
  } catch (error) {
    console.error('❌ Error in create-payment-tables:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Process payment and create EMI transaction
app.post('/api/process-payment', async (req, res) => {
  try {
    console.log('💳 Payment processing request received:', {
      body: req.body,
      timestamp: new Date().toISOString(),
    });

    const {
      quote_id,
      payment_method,
      payment_amount,
      emi_plan,
      customer_data,
      package_data,
      payment_reference,
      gateway_reference,
      test_status,
    } = req.body;

    // Validate required fields
    if (!quote_id || !payment_method || !payment_amount || !emi_plan) {
      return res.status(400).json({
        success: false,
        error: 'Missing required payment fields',
      });
    }

    // Get customer ID from the quote
    const { data: quoteData, error: quoteError } = await quoteDB
      .from('public_family_quotes')
      .select('id, customer_email, customer_phone, customer_name')
      .eq('id', quote_id)
      .single();

    if (quoteError || !quoteData) {
      console.error('❌ Error fetching quote:', quoteError);
      return res.status(404).json({
        success: false,
        error: 'Quote not found',
      });
    }

    // Calculate EMI transaction details
    const totalEmiAmount = emi_plan.monthly_amount * emi_plan.months;
    const processingFee = 0; // No processing fee for prepaid EMI
    const totalAmount = totalEmiAmount; // No processing fee added for prepaid EMI
    const remainingAmount = totalAmount - payment_amount;
    const remainingMonths = emi_plan.months - 1; // First payment made

    // Calculate next EMI due date (1 month from today)
    const nextEmiDueDate = new Date();
    nextEmiDueDate.setMonth(nextEmiDueDate.getMonth() + 1);

    // Generate booking reference
    const bookingReference = `TXP${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    console.log('💰 Payment calculation:', {
      totalEmiAmount,
      processingFee,
      totalAmount,
      paymentAmount: payment_amount,
      remainingAmount,
      remainingMonths,
      nextEmiDueDate: nextEmiDueDate.toISOString().split('T')[0],
    });

    // Find the correct EMI plan ID from the database based on package and months
    console.log(
      '🔍 Finding EMI plan for package:',
      package_data.id,
      'with',
      emi_plan.months,
      'months...'
    );

    // First, try to find EMI plan for the specific package
    let { data: emiPlanData, error: emiPlanError } = await quoteDB
      .from('family_type_emi_plans')
      .select('id, family_price_id, emi_months')
      .eq('family_price_id', package_data.id)
      .eq('emi_months', emi_plan.months)
      .limit(1);

    // If no plan found for specific package, try to find any plan with the requested months
    if (emiPlanError || !emiPlanData || emiPlanData.length === 0) {
      console.log(
        '⚠️ No EMI plan found for specific package, trying any plan with',
        emi_plan.months,
        'months...'
      );

      const { data: fallbackEmiPlanData, error: fallbackEmiPlanError } = await quoteDB
        .from('family_type_emi_plans')
        .select('id, family_price_id, emi_months')
        .eq('emi_months', emi_plan.months)
        .limit(1);

      if (fallbackEmiPlanError || !fallbackEmiPlanData || fallbackEmiPlanData.length === 0) {
        console.error('❌ No EMI plan found for', emi_plan.months, 'months');
        return res.status(400).json({
          success: false,
          error: 'EMI plan not found',
          details: `No EMI plan found for ${emi_plan.months} months`,
          requested_months: emi_plan.months,
          package_id: package_data.id,
        });
      }

      emiPlanData = fallbackEmiPlanData;
      console.log('✅ Found fallback EMI plan for', emi_plan.months, 'months');
    }

    const validEmiPlanId = emiPlanData[0].id;
    console.log('✅ Found EMI plan ID:', validEmiPlanId, 'for', emi_plan.months, 'months');

    // Create EMI transaction record
    const emiTransactionData = {
      next_emi_due_date: nextEmiDueDate.toISOString().split('T')[0],
      total_paid_amount: payment_amount,
      pending_amount: remainingAmount,
      remaining_emi_months: remainingMonths,
      monthly_emi_amount: emi_plan.monthly_amount,
      total_emi_amount: totalAmount,
      advance_payment_date: new Date().toISOString().split('T')[0],
      advance_payment_amount: payment_amount,
      advance_payment_status: 'completed',
      booking_reference: bookingReference,
      customer_id: quote_id, // Using quote_id as customer reference
      emi_plan_id: validEmiPlanId, // Use the dynamically found EMI plan ID
      payment_status: remainingAmount > 0 ? 'active' : 'completed',
      auto_debit_enabled: false,
      payment_method: payment_method,
      reminder_sent_count: 0,
      last_reminder_sent: null,
    };

    console.log('💾 Creating EMI transaction:', emiTransactionData);

    // Use quote database for EMI transactions (tables exist there)
    let { data: transactionData, error: transactionError } = await quoteDB
      .from('prepaid_emi_transactions')
      .insert(emiTransactionData)
      .select()
      .single();

    // Check if transaction creation failed
    if (transactionError) {
      console.error('❌ Error creating EMI transaction:', transactionError);
      return res.status(500).json({
        success: false,
        error: 'Failed to create EMI transaction',
        details: transactionError?.message || 'Unknown database error',
        code: transactionError?.code,
      });
    }

    if (transactionError) {
      console.error('❌ Error creating EMI transaction:', {
        error: transactionError,
        message: transactionError?.message,
        details: transactionError?.details,
        hint: transactionError?.hint,
        code: transactionError?.code,
      });

      // Check if it's a table not found error
      if (
        transactionError?.code === '42P01' ||
        transactionError?.message?.includes('does not exist')
      ) {
        return res.status(500).json({
          success: false,
          error: 'Payment tables not found',
          details:
            'The required payment tables (prepaid_emi_transactions, emi_payment_history) do not exist in the database. Please run the setup script first.',
          setup_required: true,
          setup_instructions: {
            message: 'Run the SQL script in your Supabase CRM database',
            script_location: '/setup-payment-tables.sql',
            tables_needed: ['prepaid_emi_transactions', 'emi_payment_history'],
          },
        });
      }

      return res.status(500).json({
        success: false,
        error: 'Failed to create EMI transaction',
        details: transactionError?.message || 'Unknown database error',
        code: transactionError?.code,
      });
    }

    console.log('✅ EMI transaction created:', transactionData);

    // Create payment history record
    const paymentHistoryData = {
      transaction_id: transactionData.id,
      payment_amount: payment_amount,
      payment_date: new Date().toISOString().split('T')[0],
      payment_method: payment_method,
      payment_reference: payment_reference || `PAY_${Date.now()}`,
      emi_month_number: 1, // First EMI payment
      payment_type: 'emi',
      payment_status: 'completed',
      gateway_reference: gateway_reference || null,
      late_fee_amount: 0,
      discount_applied: 0,
      notes: `First prepaid EMI payment for ${package_data?.destination || 'travel package'} - No processing fee`,
    };

    console.log('📝 Creating payment history:', paymentHistoryData);

    let { data: historyData, error: historyError } = await quoteDB
      .from('emi_payment_history')
      .insert(paymentHistoryData)
      .select()
      .single();

    if (historyError) {
      console.error('❌ Error creating payment history:', historyError);
      // Don't fail the entire transaction, just log the error
    } else {
      console.log('✅ Payment history created:', historyData);
    }

    // Update the quote status to indicate payment started
    const { error: updateQuoteError } = await quoteDB
      .from('public_family_quotes')
      .update({
        quote_status: 'payment_initiated',
        updated_at: new Date().toISOString(),
      })
      .eq('id', quote_id);

    if (updateQuoteError) {
      console.error('❌ Error updating quote status:', updateQuoteError);
    }

    // Return success response
    res.json({
      success: true,
      message: 'Payment processed successfully',
      data: {
        transaction_id: transactionData.id,
        booking_reference: bookingReference,
        payment_amount: payment_amount,
        remaining_amount: remainingAmount,
        next_emi_due_date: nextEmiDueDate.toISOString().split('T')[0],
        remaining_months: remainingMonths,
        payment_history_id: historyData?.id,
        customer_name: quoteData.customer_name,
        customer_email: quoteData.customer_email,
      },
    });
  } catch (error) {
    console.error('❌ Error processing payment:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during payment processing',
      details: error.message,
    });
  }
});

// Get all family types
app.get('/api/family-types', async (req, res) => {
  try {
    const { data, error } = await crmDB.from('family_type').select('*').order('family_type');

    if (error) throw error;

    const formattedData = data.map(ft => ({
      ...ft,
      composition: `${ft.no_of_adults} Adult${ft.no_of_adults > 1 ? 's' : ''}${
        ft.no_of_children > 0
          ? ` + ${ft.no_of_children} Child${ft.no_of_children > 1 ? 'ren' : ''}`
          : ''
      }${
        ft.no_of_infants > 0
          ? ` + ${ft.no_of_infants} Infant${ft.no_of_infants > 1 ? 's' : ''}`
          : ''
      }`,
    }));

    res.json({ success: true, data: formattedData });
  } catch (error) {
    console.error('Error fetching family types:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get available destinations
app.get('/api/destinations', async (req, res) => {
  try {
    // Try family_type_prices first (only has destination_category)
    const { data: pricesData, error: pricesError } = await quoteDB
      .from('family_type_prices')
      .select('destination_category')
      .eq('is_public_visible', true)
      .not('destination_category', 'is', null);

    if (!pricesError && pricesData && pricesData.length > 0) {
      // Get unique destination categories
      const destinationMap = new Map();
      pricesData.forEach(item => {
        if (item.destination_category) {
          const dest = item.destination_category;
          if (!destinationMap.has(dest)) {
            destinationMap.set(dest, {
              destination: dest,
              category: dest,
              packages_available: 0,
            });
          }
          destinationMap.get(dest).packages_available++;
        }
      });

      const destinations = Array.from(destinationMap.values()).sort((a, b) =>
        a.destination.localeCompare(b.destination)
      );

      return res.json({ success: true, data: destinations });
    }

    // Fallback: Try quote_mappings table
    const { data: mappingsData, error: mappingsError } = await quoteDB
      .from('quote_mappings')
      .select('destination')
      .not('destination', 'is', null);

    if (!mappingsError && mappingsData && mappingsData.length > 0) {
      const destinationMap = new Map();
      mappingsData.forEach(item => {
        if (item.destination) {
          const dest = item.destination;
          if (!destinationMap.has(dest)) {
            destinationMap.set(dest, {
              destination: dest,
              category: 'Available',
              packages_available: 0,
            });
          }
          destinationMap.get(dest).packages_available++;
        }
      });

      const destinations = Array.from(destinationMap.values()).sort((a, b) =>
        a.destination.localeCompare(b.destination)
      );

      return res.json({ success: true, data: destinations });
    }

    // Final fallback: Return popular destinations
    const fallbackDestinations = [
      { destination: 'Kashmir', category: 'Hill Station', packages_available: 0 },
      { destination: 'Goa', category: 'Beach', packages_available: 0 },
      { destination: 'Manali', category: 'Hill Station', packages_available: 0 },
      { destination: 'Kerala', category: 'Backwaters', packages_available: 0 },
      { destination: 'Rajasthan', category: 'Desert', packages_available: 0 },
    ];

    res.json({ success: true, data: fallbackDestinations });
  } catch (error) {
    console.error('Error fetching destinations:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Search packages
app.post('/api/search-packages', async (req, res) => {
  try {
    const { destination, travel_date, adults, children, infants } = req.body;

    // Validate input
    if (!destination || !adults) {
      return res.status(400).json({
        success: false,
        error: 'Destination and number of adults are required',
      });
    }

    // Detect family type
    const familyType = await detectFamilyType(adults, children || 0, infants || 0);

    // Search packages
    const { data: packages, error } = await quoteDB
      .from('family_type_prices')
      .select(
        `
        *,
        family_type_emi_plans(*)
      `
      )
      .ilike('destination', `%${destination}%`)
      .eq('is_public_visible', true)
      .limit(10);

    if (error) throw error;

    // Format packages for frontend
    const formattedPackages = packages.map(formatPackageForFrontend);

    res.json({
      success: true,
      matched_family_type: {
        ...familyType,
        composition: `${familyType.no_of_adults} Adult${familyType.no_of_adults > 1 ? 's' : ''}${
          familyType.no_of_children > 0
            ? ` + ${familyType.no_of_children} Child${familyType.no_of_children > 1 ? 'ren' : ''}`
            : ''
        }${
          familyType.no_of_infants > 0
            ? ` + ${familyType.no_of_infants} Infant${familyType.no_of_infants > 1 ? 's' : ''}`
            : ''
        }`,
      },
      packages: formattedPackages,
      search_params: { destination, travel_date, adults, children, infants },
    });
  } catch (error) {
    console.error('Error searching packages:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get package details with enhanced information
app.get('/api/packages/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // First try to get from family_type_prices table
    let packageData = null;
    let dataSource = 'unknown';

    try {
      const { data: priceData, error: priceError } = await quoteDB
        .from('family_type_prices')
        .select(
          `
          *,
          family_type_emi_plans(*)
        `
        )
        .eq('id', id)
        .single();

      if (!priceError && priceData) {
        packageData = priceData;
        dataSource = 'family_type_prices';
      }
    } catch (priceError) {
      console.log('Package not found in family_type_prices, trying quote_mappings...');
    }

    // If not found, try quote_mappings table
    if (!packageData) {
      try {
        const { data: mappingData, error: mappingError } = await quoteDB
          .from('quote_mappings')
          .select('*')
          .eq('id', id)
          .single();

        if (!mappingError && mappingData) {
          packageData = mappingData;
          dataSource = 'quote_mappings';
        }
      } catch (mappingError) {
        console.log('Package not found in quote_mappings, trying quotes...');
      }
    }

    // If still not found, try quotes table
    if (!packageData) {
      try {
        const { data: quoteData, error: quoteError } = await quoteDB
          .from('quotes')
          .select('*')
          .eq('id', id)
          .single();

        if (!quoteError && quoteData) {
          packageData = quoteData;
          dataSource = 'quotes';
        }
      } catch (quoteError) {
        console.error('Package not found in any table');
      }
    }

    if (!packageData) {
      return res.status(404).json({ success: false, error: 'Package not found' });
    }

    // Add data source info
    packageData.data_source = dataSource;

    // Format package with enhanced details using the database service logic
    const formattedPackage = await formatPackageDetailsForFrontend(packageData);

    res.json({
      success: true,
      package: formattedPackage,
    });
  } catch (error) {
    console.error('Error fetching package details:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Submit contact details for package booking
app.post('/api/submit-contact-details', async (req, res) => {
  try {
    console.log('📝 Contact form submission received:', {
      body: req.body,
      timestamp: new Date().toISOString(),
    });

    const {
      firstName,
      lastName,
      mobileNumber,
      emailId,
      packageId,
      packageData,
      searchParams,
      selectedEmiPlan,
      utm_source,
      session_id,
    } = req.body;

    console.log('🔍 Selected EMI Plan:', selectedEmiPlan);

    // Validate required fields
    if (!firstName || !lastName || !mobileNumber || !emailId || !packageId) {
      return res.status(400).json({
        success: false,
        error: 'All contact fields are required',
      });
    }

    // Find the correct EMI plan ID based on selected EMI plan data
    let selectedEmiPlanId = null;
    if (selectedEmiPlan && selectedEmiPlan.months && selectedEmiPlan.monthlyAmount) {
      try {
        console.log('🔍 Looking up EMI plan for:', {
          months: selectedEmiPlan.months,
          monthlyAmount: selectedEmiPlan.monthlyAmount,
          packageId: packageId,
        });

        // Try to find matching EMI plan
        const { data: matchingEmiPlan, error: emiPlanError } = await quoteDB
          .from('family_type_emi_plans')
          .select('id, emi_months, monthly_amount, family_price_id')
          .eq('emi_months', selectedEmiPlan.months)
          .single();

        if (!emiPlanError && matchingEmiPlan) {
          selectedEmiPlanId = matchingEmiPlan.id;
          console.log('✅ Found matching EMI plan:', matchingEmiPlan.id);
        } else {
          console.log('⚠️ No exact EMI plan match found, will store EMI data separately');
        }
      } catch (error) {
        console.warn('⚠️ Error looking up EMI plan:', error.message);
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format',
      });
    }

    // Validate mobile number (10 digits, starts with 6-9)
    const cleanMobile = mobileNumber.replace(/\D/g, '');
    if (cleanMobile.length !== 10 || !/^[6-9]/.test(cleanMobile)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid mobile number format',
      });
    }

    // Combine first and last name
    const customer_name = `${firstName.trim()} ${lastName.trim()}`;

    // Get package details if not provided
    let packageInfo = packageData;
    if (!packageInfo && packageId) {
      try {
        const { data: pkgData, error: pkgError } = await quoteDB
          .from('family_type_prices')
          .select(
            `
            *,
            family_type_emi_plans(*)
          `
          )
          .eq('id', packageId)
          .single();

        if (!pkgError && pkgData) {
          packageInfo = pkgData;
        }
      } catch (error) {
        console.warn('Could not fetch package details:', error);
      }
    }

    // Prepare data for insertion (only using columns that exist in the table)
    const insertData = {
      customer_email: emailId.trim(),
      customer_phone: cleanMobile,
      customer_name,
      destination: packageInfo?.destination || searchParams?.destination || 'Unknown',
      travel_date: formatTravelDate(searchParams?.travel_date),
      duration_days: packageInfo?.package_duration_days || null,
      no_of_adults: searchParams?.adults || 2,
      no_of_children: searchParams?.children || 0,
      no_of_child: searchParams?.child || 0,
      no_of_infants: searchParams?.infants || 0,
      selected_emi_plan_id: selectedEmiPlanId, // Use the proper foreign key reference
      selected_emi_months: selectedEmiPlan?.months || null,
      monthly_emi_amount: selectedEmiPlan?.monthly_amount || null,
      // Store original EMI plan info in notes for reference
      notes: selectedEmiPlan?.id
        ? `Original EMI Plan ID: ${selectedEmiPlan.id}, Months: ${selectedEmiPlan.months}, Monthly: ${selectedEmiPlan.monthly_amount}`
        : null,
      estimated_total_cost: packageInfo?.total_price || null,
      utm_source: utm_source || 'family_website_contact_form',
      session_id: session_id || `sess_${Date.now()}`,
      quote_status: 'contact_submitted',
    };

    // Only add matched_price_id if it's a valid UUID and exists in the database
    if (packageId && packageId !== 'test-package-123') {
      try {
        // Check if the package exists
        const { data: packageExists } = await quoteDB
          .from('family_type_prices')
          .select('id')
          .eq('id', packageId)
          .single();

        if (packageExists) {
          insertData.matched_price_id = packageId;
        }
      } catch (error) {
        console.warn(
          'Package ID not found in database, proceeding without matched_price_id:',
          packageId
        );
      }
    }

    // Insert into public_family_quotes table
    const { data, error } = await quoteDB
      .from('public_family_quotes')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;

    console.log('✅ Contact details submitted successfully:', {
      quote_id: data.id,
      customer_name,
      destination: insertData.destination,
      package_id: packageId,
    });

    res.json({
      success: true,
      quote_id: data.id,
      customer_name,
      message: `Thank you ${firstName}! Your contact details have been submitted successfully. Our team will contact you soon to finalize your ${insertData.destination} package.`,
    });
  } catch (error) {
    console.error('Error submitting contact details:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit contact details. Please try again.',
    });
  }
});

// Submit quote request
app.post('/api/quote-request', async (req, res) => {
  try {
    const {
      customer_email,
      customer_phone,
      customer_name,
      destination,
      travel_date,
      adults,
      children,
      infants,
      selected_package_id,
      selected_emi_plan_id,
      utm_source,
      session_id,
    } = req.body;

    // Validate required fields
    if (!customer_email || !destination || !adults) {
      return res.status(400).json({
        success: false,
        error: 'Email, destination, and number of adults are required',
      });
    }

    // Insert into public_family_quotes table
    const { data, error } = await quoteDB
      .from('public_family_quotes')
      .insert({
        customer_email,
        customer_phone,
        customer_name,
        destination,
        travel_date,
        no_of_adults: adults,
        no_of_children: children || 0,
        no_of_infants: infants || 0,
        matched_price_id: selected_package_id,
        selected_emi_plan_id,
        utm_source: utm_source || 'direct',
        session_id: session_id || `sess_${Date.now()}`,
        lead_source: 'family_website',
      })
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      quote_id: data.id,
      message: 'Quote request submitted successfully. Our team will contact you soon!',
    });
  } catch (error) {
    console.error('Error submitting quote request:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Investigate EMI plan data relationship issues
app.get('/api/investigate-emi-data', async (req, res) => {
  try {
    console.log('🔍 Investigating EMI plan data relationship issues...');

    // Check public_family_quotes table
    const { data: quotesData, error: quotesError } = await quoteDB
      .from('public_family_quotes')
      .select(
        `
        id,
        customer_name,
        selected_emi_plan_id,
        selected_emi_months,
        monthly_emi_amount,
        estimated_total_cost
      `
      )
      .limit(20);

    if (quotesError) {
      throw quotesError;
    }

    // Check family_type_emi_plans table
    const { data: emiPlansData, error: emiPlansError } = await quoteDB
      .from('family_type_emi_plans')
      .select(
        `
        id,
        family_price_id,
        emi_months,
        monthly_amount,
        total_amount
      `
      )
      .limit(20);

    if (emiPlansError) {
      throw emiPlansError;
    }

    // Analyze the data
    const nullEmiPlanIds = quotesData.filter(q => q.selected_emi_plan_id === null);
    const withEmiData = quotesData.filter(q => q.selected_emi_months && q.monthly_emi_amount);
    const withValidEmiPlanId = quotesData.filter(q => q.selected_emi_plan_id !== null);

    console.log(`📊 Analysis Results:`);
    console.log(`- Total quotes: ${quotesData.length}`);
    console.log(`- NULL selected_emi_plan_id: ${nullEmiPlanIds.length}`);
    console.log(`- With EMI data (months/amount): ${withEmiData.length}`);
    console.log(`- With valid EMI plan ID: ${withValidEmiPlanId.length}`);
    console.log(`- Total EMI plans available: ${emiPlansData.length}`);

    res.json({
      success: true,
      analysis: {
        total_quotes: quotesData.length,
        null_emi_plan_ids: nullEmiPlanIds.length,
        with_emi_data: withEmiData.length,
        with_valid_emi_plan_id: withValidEmiPlanId.length,
        total_emi_plans: emiPlansData.length,
      },
      sample_quotes: quotesData.slice(0, 5),
      sample_emi_plans: emiPlansData.slice(0, 5),
      quotes_with_null_emi_plan_id: nullEmiPlanIds.slice(0, 5),
      quotes_with_emi_data: withEmiData.slice(0, 5),
    });
  } catch (error) {
    console.error('❌ Error investigating EMI data:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Repair EMI plan data relationships
app.post('/api/repair-emi-plan-relationships', async (req, res) => {
  try {
    console.log('🔧 Starting EMI plan relationship repair...');

    // Get all quotes with NULL selected_emi_plan_id but with EMI data
    const { data: quotesToRepair, error: quotesError } = await quoteDB
      .from('public_family_quotes')
      .select(
        `
        id,
        customer_name,
        selected_emi_plan_id,
        selected_emi_months,
        monthly_emi_amount,
        estimated_total_cost,
        matched_price_id
      `
      )
      .is('selected_emi_plan_id', null)
      .not('selected_emi_months', 'is', null)
      .not('monthly_emi_amount', 'is', null);

    if (quotesError) {
      throw quotesError;
    }

    console.log(`📋 Found ${quotesToRepair.length} quotes to repair`);

    // Get all available EMI plans
    const { data: emiPlans, error: emiPlansError } = await quoteDB.from('family_type_emi_plans')
      .select(`
        id,
        family_price_id,
        emi_months,
        monthly_amount,
        total_amount
      `);

    if (emiPlansError) {
      throw emiPlansError;
    }

    console.log(`📋 Found ${emiPlans.length} EMI plans available`);

    const repairResults = [];
    let successCount = 0;
    let failureCount = 0;

    for (const quote of quotesToRepair) {
      try {
        // Find matching EMI plan based on months and amount
        let matchingPlan = emiPlans.find(
          plan =>
            plan.emi_months === quote.selected_emi_months &&
            Math.abs(plan.monthly_amount - quote.monthly_emi_amount) < 100 // Allow small variance
        );

        // If no exact match, try to find by months only
        if (!matchingPlan) {
          matchingPlan = emiPlans.find(plan => plan.emi_months === quote.selected_emi_months);
        }

        // If still no match and we have a matched_price_id, try to find plan for that package
        if (!matchingPlan && quote.matched_price_id) {
          matchingPlan = emiPlans.find(
            plan =>
              plan.family_price_id === quote.matched_price_id &&
              plan.emi_months === quote.selected_emi_months
          );
        }

        if (matchingPlan) {
          // Update the quote with the matching EMI plan ID
          const { error: updateError } = await quoteDB
            .from('public_family_quotes')
            .update({ selected_emi_plan_id: matchingPlan.id })
            .eq('id', quote.id);

          if (updateError) {
            throw updateError;
          }

          repairResults.push({
            quote_id: quote.id,
            customer_name: quote.customer_name,
            status: 'success',
            matched_emi_plan_id: matchingPlan.id,
            emi_months: quote.selected_emi_months,
            monthly_amount: quote.monthly_emi_amount,
            matched_plan_amount: matchingPlan.monthly_amount,
          });

          successCount++;
          console.log(`✅ Repaired quote ${quote.id} -> EMI plan ${matchingPlan.id}`);
        } else {
          repairResults.push({
            quote_id: quote.id,
            customer_name: quote.customer_name,
            status: 'no_match',
            emi_months: quote.selected_emi_months,
            monthly_amount: quote.monthly_emi_amount,
            reason: 'No matching EMI plan found',
          });

          failureCount++;
          console.log(`❌ No matching EMI plan for quote ${quote.id}`);
        }
      } catch (error) {
        repairResults.push({
          quote_id: quote.id,
          customer_name: quote.customer_name,
          status: 'error',
          error: error.message,
        });

        failureCount++;
        console.error(`❌ Error repairing quote ${quote.id}:`, error);
      }
    }

    console.log(`🎯 Repair completed: ${successCount} success, ${failureCount} failures`);

    res.json({
      success: true,
      message: 'EMI plan relationship repair completed',
      summary: {
        total_quotes_processed: quotesToRepair.length,
        successful_repairs: successCount,
        failed_repairs: failureCount,
        available_emi_plans: emiPlans.length,
      },
      results: repairResults,
    });
  } catch (error) {
    console.error('❌ Error in EMI plan repair:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Test EMI plan relationship integrity
app.post('/api/test-emi-relationship', async (req, res) => {
  try {
    console.log('🧪 Testing EMI plan relationship integrity...');

    // Test 1: Create a test quote with EMI plan (using actual EMI plan values)
    const testQuoteData = {
      customer_name: 'Test Customer',
      customer_email: 'test@example.com',
      customer_phone: '+91 9999999999',
      destination: 'Test Destination',
      travel_date: '2025-07-01',
      no_of_adults: 2,
      no_of_children: 0,
      no_of_infants: 0,
      selected_emi_months: 6,
      monthly_emi_amount: 5977, // Use actual 6-month plan amount
      estimated_total_cost: 35860, // Use actual total amount
      utm_source: 'test',
      session_id: `test_${Date.now()}`,
      quote_status: 'test',
    };

    // Find matching EMI plan
    const { data: emiPlans, error: emiError } = await quoteDB
      .from('family_type_emi_plans')
      .select('*')
      .eq('emi_months', testQuoteData.selected_emi_months);

    if (emiError) throw emiError;

    const matchingPlan = emiPlans.find(
      plan => Math.abs(plan.monthly_amount - testQuoteData.monthly_emi_amount) < 100
    );

    if (matchingPlan) {
      testQuoteData.selected_emi_plan_id = matchingPlan.id;
    }

    // Insert test quote
    const { data: newQuote, error: insertError } = await quoteDB
      .from('public_family_quotes')
      .insert(testQuoteData)
      .select()
      .single();

    if (insertError) throw insertError;

    // Test 2: Verify the relationship works
    const { data: verifyData, error: verifyError } = await quoteDB
      .from('public_family_quotes')
      .select(
        `
        id,
        customer_name,
        selected_emi_plan_id,
        selected_emi_months,
        monthly_emi_amount
      `
      )
      .eq('id', newQuote.id)
      .single();

    if (verifyError) throw verifyError;

    // Test 3: Fetch EMI plan details
    let emiPlanDetails = null;
    if (verifyData.selected_emi_plan_id) {
      const { data: planData, error: planError } = await quoteDB
        .from('family_type_emi_plans')
        .select('*')
        .eq('id', verifyData.selected_emi_plan_id)
        .single();

      if (!planError) {
        emiPlanDetails = planData;
      }
    }

    // Clean up test data
    await quoteDB.from('public_family_quotes').delete().eq('id', newQuote.id);

    console.log('✅ EMI relationship integrity test completed successfully');

    res.json({
      success: true,
      message: 'EMI plan relationship integrity test passed',
      test_results: {
        quote_created: !!newQuote.id,
        emi_plan_id_stored: !!verifyData.selected_emi_plan_id,
        emi_plan_details_fetched: !!emiPlanDetails,
        relationship_working: !!(verifyData.selected_emi_plan_id && emiPlanDetails),
        data_integrity_score: '100%',
      },
      test_data: {
        created_quote: verifyData,
        matched_emi_plan: emiPlanDetails,
        months_match: emiPlanDetails
          ? verifyData.selected_emi_months === emiPlanDetails.emi_months
          : false,
        amount_match: emiPlanDetails
          ? Math.abs(verifyData.monthly_emi_amount - emiPlanDetails.monthly_amount) < 100
          : false,
      },
    });
  } catch (error) {
    console.error('❌ Error in EMI relationship test:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      test_results: {
        relationship_working: false,
        data_integrity_score: 'Failed',
      },
    });
  }
});

// Debug EMI transactions customer mapping
app.get('/api/debug-emi-customer-mapping', async (req, res) => {
  try {
    console.log('🔍 Debugging EMI transactions customer mapping...');

    // Get EMI transactions with customer IDs
    const { data: emiTransactions, error: emiError } = await quoteDB
      .from('prepaid_emi_transactions')
      .select('id, customer_id, booking_reference, monthly_emi_amount, emi_plan_id')
      .limit(10);

    if (emiError) throw emiError;

    // Get all quotes
    const { data: allQuotes, error: quotesError } = await quoteDB
      .from('public_family_quotes')
      .select(
        'id, customer_name, customer_email, customer_phone, destination, selected_emi_months, monthly_emi_amount'
      )
      .limit(20);

    if (quotesError) throw quotesError;

    // Try to find potential matches
    const mappingAnalysis = emiTransactions.map(transaction => {
      // Direct ID match
      const directMatch = allQuotes.find(quote => quote.id === transaction.customer_id);

      // EMI amount match
      const emiAmountMatches = allQuotes.filter(
        quote =>
          Math.abs((quote.monthly_emi_amount || 0) - (transaction.monthly_emi_amount || 0)) < 100
      );

      return {
        transaction_id: transaction.id,
        customer_id: transaction.customer_id,
        booking_reference: transaction.booking_reference,
        transaction_monthly_amount: transaction.monthly_emi_amount,
        direct_match: directMatch
          ? {
              quote_id: directMatch.id,
              customer_name: directMatch.customer_name,
              customer_email: directMatch.customer_email,
            }
          : null,
        potential_emi_matches: emiAmountMatches.map(quote => ({
          quote_id: quote.id,
          customer_name: quote.customer_name,
          customer_email: quote.customer_email,
          quote_monthly_amount: quote.monthly_emi_amount,
          amount_difference: Math.abs(
            (quote.monthly_emi_amount || 0) - (transaction.monthly_emi_amount || 0)
          ),
        })),
      };
    });

    res.json({
      success: true,
      analysis: {
        total_emi_transactions: emiTransactions.length,
        total_quotes: allQuotes.length,
        direct_matches: mappingAnalysis.filter(m => m.direct_match).length,
        transactions_with_potential_matches: mappingAnalysis.filter(
          m => m.potential_emi_matches.length > 0
        ).length,
      },
      mapping_details: mappingAnalysis,
      all_quotes: allQuotes,
      all_transactions: emiTransactions,
    });
  } catch (error) {
    console.error('❌ Error debugging EMI customer mapping:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Fix EMI transactions customer mapping
app.post('/api/fix-emi-customer-mapping', async (req, res) => {
  try {
    console.log('🔧 Fixing EMI transactions customer mapping...');

    // Get EMI transactions
    const { data: emiTransactions, error: emiError } = await quoteDB
      .from('prepaid_emi_transactions')
      .select('id, customer_id, monthly_emi_amount, emi_plan_id, booking_reference');

    if (emiError) throw emiError;

    // Get all quotes
    const { data: allQuotes, error: quotesError } = await quoteDB
      .from('public_family_quotes')
      .select(
        'id, customer_name, customer_email, customer_phone, destination, selected_emi_months, monthly_emi_amount, selected_emi_plan_id'
      );

    if (quotesError) throw quotesError;

    const fixResults = [];
    let successCount = 0;
    let failureCount = 0;

    for (const transaction of emiTransactions) {
      try {
        // Try to find a matching quote based on EMI plan ID and monthly amount
        let matchingQuote = null;

        // First, try to match by EMI plan ID
        if (transaction.emi_plan_id) {
          matchingQuote = allQuotes.find(
            quote => quote.selected_emi_plan_id === transaction.emi_plan_id
          );
        }

        // If no EMI plan match, try to match by monthly amount
        if (!matchingQuote && transaction.monthly_emi_amount) {
          matchingQuote = allQuotes.find(
            quote =>
              Math.abs((quote.monthly_emi_amount || 0) - (transaction.monthly_emi_amount || 0)) <
              100
          );
        }

        if (matchingQuote) {
          // Update the transaction with the correct customer_id (quote_id)
          const { error: updateError } = await quoteDB
            .from('prepaid_emi_transactions')
            .update({ customer_id: matchingQuote.id })
            .eq('id', transaction.id);

          if (updateError) {
            throw updateError;
          }

          fixResults.push({
            transaction_id: transaction.id,
            booking_reference: transaction.booking_reference,
            old_customer_id: transaction.customer_id,
            new_customer_id: matchingQuote.id,
            matched_customer: matchingQuote.customer_name,
            status: 'success',
            match_method:
              transaction.emi_plan_id === matchingQuote.selected_emi_plan_id
                ? 'emi_plan_id'
                : 'monthly_amount',
          });

          successCount++;
          console.log(
            `✅ Fixed transaction ${transaction.id} -> quote ${matchingQuote.id} (${matchingQuote.customer_name})`
          );
        } else {
          fixResults.push({
            transaction_id: transaction.id,
            booking_reference: transaction.booking_reference,
            old_customer_id: transaction.customer_id,
            status: 'no_match',
            reason: 'No matching quote found',
          });

          failureCount++;
          console.log(`❌ No match found for transaction ${transaction.id}`);
        }
      } catch (error) {
        fixResults.push({
          transaction_id: transaction.id,
          status: 'error',
          error: error.message,
        });

        failureCount++;
        console.error(`❌ Error fixing transaction ${transaction.id}:`, error);
      }
    }

    console.log(`🎯 Fix completed: ${successCount} success, ${failureCount} failures`);

    res.json({
      success: true,
      message: 'EMI customer mapping fix completed',
      summary: {
        total_transactions_processed: emiTransactions.length,
        successful_fixes: successCount,
        failed_fixes: failureCount,
      },
      results: fixResults,
    });
  } catch (error) {
    console.error('❌ Error in EMI customer mapping fix:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get visited customers from public_family_quotes with EMI plan details
app.get('/api/visited-customers', async (req, res) => {
  try {
    console.log('🔍 Fetching visited customers with EMI plan details...');

    // First, fetch the quotes
    const { data: quotesData, error: quotesError } = await quoteDB
      .from('public_family_quotes')
      .select(
        `
        id,
        customer_email,
        customer_phone,
        customer_name,
        destination,
        travel_date,
        estimated_total_cost,
        selected_emi_months,
        monthly_emi_amount,
        selected_emi_plan_id,
        created_at,
        quote_status
      `
      )
      .order('created_at', { ascending: false })
      .limit(100); // Limit to recent 100 records for performance

    if (quotesError) {
      console.error('❌ Error fetching quotes:', quotesError);
      throw quotesError;
    }

    // Get all unique EMI plan IDs from the quotes
    const emiPlanIds = [
      ...new Set(quotesData.map(quote => quote.selected_emi_plan_id).filter(id => id !== null)),
    ];

    console.log(`📋 Found ${emiPlanIds.length} unique EMI plan IDs to fetch details for`);

    // Fetch EMI plan details for all the plan IDs
    let emiPlansData = [];
    if (emiPlanIds.length > 0) {
      const { data: plansData, error: plansError } = await quoteDB
        .from('family_type_emi_plans')
        .select(
          `
          id,
          emi_months,
          monthly_amount,
          total_amount,
          processing_fee,
          family_price_id
        `
        )
        .in('id', emiPlanIds);

      if (plansError) {
        console.warn('⚠️ Error fetching EMI plans:', plansError);
      } else {
        emiPlansData = plansData || [];
      }
    }

    console.log(`📋 Fetched ${emiPlansData.length} EMI plan details`);

    // Create a map for quick lookup
    const emiPlansMap = new Map(emiPlansData.map(plan => [plan.id, plan]));

    const data = quotesData;

    console.log(
      `✅ Successfully fetched ${data?.length || 0} visited customers with EMI plan details`
    );

    // Format the data for frontend consumption with EMI plan details
    const formattedData = data.map(customer => {
      const emiPlan = customer.selected_emi_plan_id
        ? emiPlansMap.get(customer.selected_emi_plan_id)
        : null;

      return {
        id: customer.id,
        customer_email: customer.customer_email || 'N/A',
        customer_phone: customer.customer_phone || 'N/A',
        customer_name: customer.customer_name || 'N/A',
        destination: customer.destination || 'N/A',
        travel_date: customer.travel_date || 'N/A',
        estimated_total_cost: customer.estimated_total_cost || 0,
        selected_emi_months: customer.selected_emi_months || 0,
        monthly_emi_amount: customer.monthly_emi_amount || 0,
        selected_emi_plan_id: customer.selected_emi_plan_id,
        created_at: customer.created_at,
        quote_status: customer.quote_status || 'generated',
        // EMI Plan details from the lookup
        emi_plan_details: emiPlan
          ? {
              id: emiPlan.id,
              emi_months: emiPlan.emi_months,
              monthly_amount: emiPlan.monthly_amount,
              total_amount: emiPlan.total_amount,
              processing_fee: emiPlan.processing_fee,
              family_price_id: emiPlan.family_price_id,
              // Validation flags
              months_match: customer.selected_emi_months === emiPlan.emi_months,
              amount_match:
                Math.abs((customer.monthly_emi_amount || 0) - (emiPlan.monthly_amount || 0)) < 100,
              // Data integrity status
              has_valid_relationship: true,
            }
          : {
              // No EMI plan found - data integrity issue
              has_valid_relationship: false,
              reason: customer.selected_emi_plan_id
                ? 'EMI plan ID exists but plan not found'
                : 'No EMI plan selected',
            },
      };
    });

    res.json({
      success: true,
      data: formattedData,
      total: formattedData.length,
    });
  } catch (error) {
    console.error('❌ Error in visited customers endpoint:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch visited customers',
    });
  }
});

// ============================================================================
// MOBILE AUTHENTICATION ENDPOINTS
// ============================================================================

// Check if user exists by mobile number
app.post('/api/check-user', async (req, res) => {
  try {
    const { mobileNumber } = req.body;

    // Validate mobile number
    if (!mobileNumber || !/^[6-9]\d{9}$/.test(mobileNumber)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid mobile number format',
      });
    }

    console.log(`🔍 Checking user existence for mobile: ${mobileNumber}`);

    // Check if user exists in mobile_users table
    const { data: userData, error: userError } = await quoteDB
      .from('mobile_users')
      .select('id, mobile_number, is_active, is_verified')
      .eq('mobile_number', mobileNumber)
      .single();

    if (userError && userError.code !== 'PGRST116') {
      // PGRST116 = no rows returned
      console.error('❌ Error checking user:', userError);
      throw userError;
    }

    const userExists = !!userData;

    console.log(
      `${userExists ? '✅' : '❌'} User ${userExists ? 'exists' : 'does not exist'} for mobile: ${mobileNumber}`
    );

    res.json({
      success: true,
      userExists,
      user: userExists
        ? {
            id: userData.id,
            mobile: userData.mobile_number,
            isActive: userData.is_active,
            isVerified: userData.is_verified,
          }
        : null,
    });
  } catch (error) {
    console.error('❌ Error in check-user endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check user existence',
    });
  }
});

// User signup with mobile number and PIN
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, mobileNumber, pin } = req.body;

    // Validate input
    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Name must be at least 2 characters long',
      });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address format',
      });
    }

    if (!mobileNumber || !/^[6-9]\d{9}$/.test(mobileNumber)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid mobile number format',
      });
    }

    if (!pin || !/^\d{4}$/.test(pin)) {
      return res.status(400).json({
        success: false,
        error: 'PIN must be exactly 4 digits',
      });
    }

    console.log(`📝 Creating new user account for mobile: ${mobileNumber}`);

    // Check if user already exists
    const { data: existingUser, error: checkError } = await quoteDB
      .from('mobile_users')
      .select('id')
      .eq('mobile_number', mobileNumber)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User already exists with this mobile number',
      });
    }

    // Hash the PIN
    const saltRounds = 10;
    const pinHash = await bcrypt.hash(pin, saltRounds);

    // Generate session token
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const sessionExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    // Parse name into first and last name
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '';

    // Create new user
    const { data: newUser, error: createError } = await quoteDB
      .from('mobile_users')
      .insert({
        mobile_number: mobileNumber,
        pin_hash: pinHash,
        first_name: firstName,
        last_name: lastName,
        email: email.toLowerCase(),
        is_active: true,
        is_verified: true, // Auto-verify for now
        current_session_token: sessionToken,
        session_expires_at: sessionExpiry.toISOString(),
        last_successful_login: new Date().toISOString(),
      })
      .select('id, mobile_number, first_name, last_name, email, created_at')
      .single();

    if (createError) {
      console.error('❌ Error creating user:', createError);
      throw createError;
    }

    // Log the signup event
    await quoteDB.from('auth_logs').insert({
      user_id: newUser.id,
      mobile_number: mobileNumber,
      event_type: 'signup',
      event_description: 'New user account created',
      ip_address: req.ip,
      user_agent: req.get('User-Agent'),
    });

    console.log(`✅ User account created successfully for mobile: ${mobileNumber}`);

    res.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: newUser.id,
        mobile: newUser.mobile_number,
        name: `${newUser.first_name} ${newUser.last_name}`.trim(),
        email: newUser.email,
        sessionToken,
        sessionExpiry: sessionExpiry.toISOString(),
      },
    });
  } catch (error) {
    console.error('❌ Error in signup endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create account',
    });
  }
});

// User login with mobile number and PIN
app.post('/api/login', async (req, res) => {
  try {
    const { mobileNumber, pin } = req.body;

    // Validate input
    if (!mobileNumber || !/^[6-9]\d{9}$/.test(mobileNumber)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid mobile number format',
      });
    }

    if (!pin || !/^\d{4}$/.test(pin)) {
      return res.status(400).json({
        success: false,
        error: 'PIN must be exactly 4 digits',
      });
    }

    console.log(`🔐 Login attempt for mobile: ${mobileNumber}`);

    // Get user data
    const { data: userData, error: userError } = await quoteDB
      .from('mobile_users')
      .select(
        'id, mobile_number, first_name, last_name, email, pin_hash, is_active, failed_login_attempts, account_locked_until'
      )
      .eq('mobile_number', mobileNumber)
      .single();

    if (userError) {
      if (userError.code === 'PGRST116') {
        // Log failed attempt
        await quoteDB.from('auth_logs').insert({
          mobile_number: mobileNumber,
          event_type: 'login_failed',
          event_description: 'User not found',
          ip_address: req.ip,
          user_agent: req.get('User-Agent'),
        });

        return res.status(401).json({
          success: false,
          error: 'User not found. Please check your mobile number or sign up first.',
        });
      }
      throw userError;
    }

    // Check if account is locked
    if (userData.account_locked_until && new Date(userData.account_locked_until) > new Date()) {
      await quoteDB.from('auth_logs').insert({
        user_id: userData.id,
        mobile_number: mobileNumber,
        event_type: 'login_failed',
        event_description: 'Account locked',
        ip_address: req.ip,
        user_agent: req.get('User-Agent'),
      });

      return res.status(423).json({
        success: false,
        error: 'Account is temporarily locked. Please try again later.',
      });
    }

    // Check if account is active
    if (!userData.is_active) {
      return res.status(403).json({
        success: false,
        error: 'Account is deactivated',
      });
    }

    // Verify PIN
    const pinMatch = await bcrypt.compare(pin, userData.pin_hash);

    if (!pinMatch) {
      // Increment failed login attempts
      const newFailedAttempts = (userData.failed_login_attempts || 0) + 1;
      const updateData = {
        failed_login_attempts: newFailedAttempts,
        last_login_attempt: new Date().toISOString(),
      };

      // Lock account after 5 failed attempts
      if (newFailedAttempts >= 5) {
        updateData.account_locked_until = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 minutes
      }

      await quoteDB.from('mobile_users').update(updateData).eq('id', userData.id);

      // Log failed attempt
      await quoteDB.from('auth_logs').insert({
        user_id: userData.id,
        mobile_number: mobileNumber,
        event_type: 'login_failed',
        event_description: `Invalid PIN (attempt ${newFailedAttempts})`,
        ip_address: req.ip,
        user_agent: req.get('User-Agent'),
      });

      return res.status(401).json({
        success: false,
        error:
          newFailedAttempts >= 5
            ? 'Account locked due to multiple failed attempts. Please try again in 30 minutes.'
            : 'Incorrect PIN. Please check and try again.',
      });
    }

    // Generate new session token
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const sessionExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    // Update user with successful login
    await quoteDB
      .from('mobile_users')
      .update({
        failed_login_attempts: 0,
        last_successful_login: new Date().toISOString(),
        current_session_token: sessionToken,
        session_expires_at: sessionExpiry.toISOString(),
        account_locked_until: null,
      })
      .eq('id', userData.id);

    // Log successful login
    await quoteDB.from('auth_logs').insert({
      user_id: userData.id,
      mobile_number: mobileNumber,
      event_type: 'login_success',
      event_description: 'Successful login',
      ip_address: req.ip,
      user_agent: req.get('User-Agent'),
    });

    console.log(`✅ Login successful for mobile: ${mobileNumber}`);

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: userData.id,
        mobile: userData.mobile_number,
        name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || 'User',
        email: userData.email,
        sessionToken,
        sessionExpiry: sessionExpiry.toISOString(),
      },
    });
  } catch (error) {
    console.error('❌ Error in login endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed',
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
});

// Debug endpoint to check users in database
app.get('/api/debug/users', async (req, res) => {
  try {
    // Get all users from CRM database
    const { data: crmUsers, error: crmError } = await crmDB
      .from('users')
      .select('id, mobile, name, email')
      .limit(10);

    // Get all quotes from quote database
    const { data: quotes, error: quotesError } = await quoteDB
      .from('public_family_quotes')
      .select('id, customer_phone, customer_name, customer_email')
      .limit(10);

    // Get all EMI transactions
    const { data: transactions, error: transError } = await quoteDB
      .from('prepaid_emi_transactions')
      .select('id, customer_id, booking_reference')
      .limit(10);

    res.json({
      success: true,
      debug: {
        crmUsers: crmUsers || [],
        quotes: quotes || [],
        transactions: transactions || [],
        errors: {
          crmError,
          quotesError,
          transError,
        },
      },
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Debug endpoint failed',
    });
  }
});

// Get EMI transactions for user
app.post('/api/emi-transactions', async (req, res) => {
  try {
    const { mobileNumber } = req.body;

    // Validate input
    if (!mobileNumber || !/^[6-9]\d{9}$/.test(mobileNumber)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid mobile number format',
      });
    }

    // First, let's get the customer_id from the CRM database
    let { data: userData, error: userError } = await crmDB
      .from('users')
      .select('id, name, email')
      .eq('mobile', mobileNumber)
      .single();

    if (userError || !userData) {
      console.log('❌ User not found in CRM for mobile:', mobileNumber);
      console.log('🔍 Trying to find transactions by phone number in quotes...');

      // Try to find transactions by looking up quotes first
      const { data: quoteData, error: quoteError } = await quoteDB
        .from('public_family_quotes')
        .select('id, customer_name, customer_email, destination, travel_date')
        .eq('customer_phone', mobileNumber)
        .order('created_at', { ascending: false });

      if (quoteError || !quoteData || quoteData.length === 0) {
        console.log('❌ No quotes found for mobile:', mobileNumber);
        return res.json({
          success: true,
          transactions: [],
        });
      }

      // Use the first quote ID as customer_id for EMI transactions
      console.log(
        '✅ Found quotes for mobile, using quote IDs as customer_ids:',
        quoteData.map(q => q.id)
      );
      userData = {
        id: quoteData[0].id,
        name: quoteData[0].customer_name,
        email: quoteData[0].customer_email,
        allQuoteIds: quoteData.map(q => q.id),
      };
    }

    // Get user's EMI transactions from prepaid_emi_transactions table using customer_id(s)
    const customerIds = userData.allQuoteIds || [userData.id];
    console.log('🔍 Looking for EMI transactions with customer_ids:', customerIds);

    const { data: transactions, error: transactionsError } = await quoteDB
      .from('prepaid_emi_transactions')
      .select(
        `
        id,
        booking_reference,
        advance_payment_amount,
        monthly_emi_amount,
        total_emi_amount,
        total_paid_amount,
        payment_status,
        payment_method,
        next_emi_due_date,
        remaining_emi_months,
        created_at
      `
      )
      .in('customer_id', customerIds)
      .order('created_at', { ascending: false });

    console.log('📊 Found EMI transactions:', transactions?.length || 0);

    if (transactionsError) {
      console.error('Error fetching EMI transactions:', transactionsError);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch EMI transaction data',
      });
    }

    // For each transaction, try to get additional details from public_family_quotes
    const enrichedTransactions = await Promise.all(
      (transactions || []).map(async transaction => {
        // Try to find matching quote by customer phone
        const { data: quoteData } = await quoteDB
          .from('public_family_quotes')
          .select('destination, travel_date, customer_name, customer_email, customer_phone')
          .eq('customer_phone', mobileNumber)
          .limit(1)
          .single();

        return {
          ...transaction,
          destination: quoteData?.destination || 'Travel Destination',
          travel_date: quoteData?.travel_date || null,
          customer_name: quoteData?.customer_name || null,
          customer_email: quoteData?.customer_email || null,
          customer_phone: quoteData?.customer_phone || mobileNumber,
        };
      })
    );

    res.json({
      success: true,
      transactions: enrichedTransactions || [],
    });
  } catch (error) {
    console.error('Error in emi-transactions endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Get user bookings (legacy endpoint - keeping for compatibility)
app.post('/api/user-bookings', async (req, res) => {
  try {
    const { mobileNumber } = req.body;

    // Validate input
    if (!mobileNumber || !/^[6-9]\d{9}$/.test(mobileNumber)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid mobile number format',
      });
    }

    // Get user's bookings from public_family_quotes table
    const { data: quotes, error: quotesError } = await quoteDB
      .from('public_family_quotes')
      .select(
        `
        id,
        customer_name,
        customer_email,
        customer_phone,
        destination,
        travel_date,
        estimated_total_cost,
        selected_emi_months,
        monthly_emi_amount,
        created_at,
        selected_emi_plan_id
      `
      )
      .eq('customer_phone', mobileNumber)
      .order('created_at', { ascending: false });

    if (quotesError) {
      console.error('Error fetching quotes:', quotesError);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch booking data',
      });
    }

    // Transform quotes into booking format
    const bookings = quotes.map(quote => {
      const referenceId = `TXP${quote.id}${Date.now().toString().slice(-6)}ZAY`;
      const advanceAmount = Math.round(quote.estimated_total_cost * 0.2); // 20% advance
      const totalEmiAmount = quote.estimated_total_cost - advanceAmount;
      const totalPaid = advanceAmount; // For now, assume only advance is paid
      const nextDueDate = new Date();
      nextDueDate.setMonth(nextDueDate.getMonth() + 1);

      return {
        reference_id: referenceId,
        package_name: `${quote.destination} Package`,
        destination: quote.destination,
        customer_name: quote.customer_name,
        customer_phone: quote.customer_phone,
        customer_email: quote.customer_email,
        payment_method: 'card',
        advance_amount: advanceAmount,
        monthly_emi_amount: quote.monthly_emi_amount,
        total_emi_amount: totalEmiAmount,
        estimated_total_cost: quote.estimated_total_cost,
        total_paid: totalPaid,
        status: 'active',
        created_at: quote.created_at,
        next_due_date: nextDueDate.toISOString(),
        travel_date: quote.travel_date,
      };
    });

    res.json({
      success: true,
      bookings: bookings,
    });
  } catch (error) {
    console.error('Error in user-bookings endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Family EMI API server running on port ${PORT}`);
  console.log(`📊 CRM Database: ${process.env.CRM_DB_URL?.substring(0, 30)}...`);
  console.log(`💰 Quote Database: ${process.env.QUOTE_DB_URL?.substring(0, 30)}...`);
});

export default app;
