/**
 * Configuration for Family EMI Website
 * Database connections and API keys
 */

const CONFIG = {
  // Database URLs
  CRM_DB_URL: 'https://tlfwcnikdlwoliqzavxj.supabase.co',
  QUOTE_DB_URL: 'https://lkqbrlrmrsnbtkoryazq.supabase.co',

  // Supabase Anon Keys (From your existing environment)
  VITE_SUPABASE_ANON_KEY_QUOTE: import.meta.env.VITE_SUPABASE_ANON_KEY_QUOTE,
  VITE_SUPABASE_ANON_KEY_CRM: import.meta.env.VITE_SUPABASE_ANON_KEY_CRM,

  // API Configuration
  API_TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,

  // Cache Configuration
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes

  // UI Configuration
  NOTIFICATION_DURATION: 5000, // 5 seconds
  SEARCH_DEBOUNCE: 300, // 300ms

  // Analytics
  GOOGLE_ANALYTICS_ID: 'GA-XXXXXXXXX', // Replace with your GA ID

  // Environment Detection
  IS_PRODUCTION: window.location.hostname === 'family.tripxplo.com',
  IS_DEVELOPMENT:
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',

  // Feature Flags
  FEATURES: {
    LIVE_DATABASE: true,
    ANALYTICS: true,
    ERROR_REPORTING: true,
    CACHING: true,
  },
};

// Export configuration
window.CONFIG = CONFIG;

console.log('⚙️ Configuration loaded:', {
  environment: CONFIG.IS_PRODUCTION ? 'production' : 'development',
  features: CONFIG.FEATURES,
});
