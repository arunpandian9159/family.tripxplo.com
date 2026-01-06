/**
 * Family EMI API Service
 * Frontend service for communicating with the backend API
 */

class FamilyEMIApiService {
  constructor() {
    // Determine API base URL based on environment
    this.baseURL = this.getApiBaseUrl();
    this.sessionId = this.generateSessionId();

    console.log('🔗 API Service initialized with base URL:', this.baseURL);
  }

  getApiBaseUrl() {
    // Check if we're in production (family.tripxplo.com)
    if (window.location.hostname === 'family.tripxplo.com') {
      return 'https://family.tripxplo.com/api';
    }

    // Check if we're running locally with a backend server
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:3000/api';
    }

    // Default to relative API path
    return '/api';
  }

  generateSessionId() {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': this.sessionId,
      },
      ...options,
    };

    try {
      console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);

      const response = await fetch(url, defaultOptions);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      console.log(`✅ API Response: ${endpoint}`, data);
      return data;
    } catch (error) {
      console.error(`❌ API Error: ${endpoint}`, error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.makeRequest('/health');
  }

  // Get all family types
  async getFamilyTypes() {
    return this.makeRequest('/family-types');
  }

  // Get available destinations
  async getDestinations() {
    return this.makeRequest('/destinations');
  }

  // Search packages
  async searchPackages(searchParams) {
    return this.makeRequest('/search-packages', {
      method: 'POST',
      body: JSON.stringify({
        ...searchParams,
        session_id: this.sessionId,
        utm_source: this.getUtmSource(),
      }),
    });
  }

  // Get package details
  async getPackageDetails(packageId) {
    return this.makeRequest(`/packages/${packageId}`);
  }

  // Submit quote request
  async submitQuoteRequest(quoteData) {
    return this.makeRequest('/quote-request', {
      method: 'POST',
      body: JSON.stringify({
        ...quoteData,
        session_id: this.sessionId,
        utm_source: this.getUtmSource(),
      }),
    });
  }

  // Utility: Get UTM source from URL parameters
  getUtmSource() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('utm_source') || 'direct';
  }

  // Utility: Track page view (for analytics)
  trackPageView(page) {
    console.log(`📊 Page View: ${page}`);
    // Add analytics tracking here (Google Analytics, etc.)
  }

  // Utility: Track event (for analytics)
  trackEvent(event, data = {}) {
    console.log(`📊 Event: ${event}`, data);
    // Add analytics tracking here
  }
}

// Create global API service instance
const apiService = new FamilyEMIApiService();

// Enhanced error handling with user-friendly messages
class ApiError extends Error {
  constructor(message, originalError) {
    super(message);
    this.name = 'ApiError';
    this.originalError = originalError;
  }
}

// Utility function to handle API errors gracefully
function handleApiError(error, context = '') {
  console.error(`API Error in ${context}:`, error);

  let userMessage = 'Something went wrong. Please try again.';

  if (error.message.includes('fetch')) {
    userMessage = 'Unable to connect to server. Please check your internet connection.';
  } else if (error.message.includes('timeout')) {
    userMessage = 'Request timed out. Please try again.';
  } else if (error.message.includes('404')) {
    userMessage = 'The requested information was not found.';
  } else if (error.message.includes('500')) {
    userMessage = 'Server error. Please try again later.';
  }

  return new ApiError(userMessage, error);
}

// Loading state management
class LoadingManager {
  constructor() {
    this.loadingStates = new Set();
  }

  setLoading(key, isLoading) {
    if (isLoading) {
      this.loadingStates.add(key);
    } else {
      this.loadingStates.delete(key);
    }

    this.updateUI();
  }

  updateUI() {
    const isAnyLoading = this.loadingStates.size > 0;

    // Update search button
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
      searchBtn.disabled = isAnyLoading;
      if (isAnyLoading) {
        searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
      } else {
        searchBtn.innerHTML = '<i class="fas fa-sparkles"></i> Find My Trip';
      }
    }

    // Update cursor
    document.body.style.cursor = isAnyLoading ? 'wait' : 'default';
  }
}

const loadingManager = new LoadingManager();

// Notification system
class NotificationManager {
  show(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-${this.getIcon(type)}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;

    // Add styles if not already present
    if (!document.querySelector('#notification-styles')) {
      const styles = document.createElement('style');
      styles.id = 'notification-styles';
      styles.textContent = `
        .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 10000;
          max-width: 400px;
          padding: 1rem;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          animation: slideIn 0.3s ease-out;
        }
        .notification-info { background: #3B82F6; color: white; }
        .notification-success { background: #10B981; color: white; }
        .notification-error { background: #EF4444; color: white; }
        .notification-warning { background: #F59E0B; color: white; }
        .notification-content {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .notification-close {
          background: none;
          border: none;
          color: inherit;
          cursor: pointer;
          margin-left: auto;
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `;
      document.head.appendChild(styles);
    }

    document.body.appendChild(notification);

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, duration);
    }
  }

  getIcon(type) {
    const icons = {
      info: 'info-circle',
      success: 'check-circle',
      error: 'exclamation-circle',
      warning: 'exclamation-triangle',
    };
    return icons[type] || 'info-circle';
  }
}

const notificationManager = new NotificationManager();

// Cache management for better performance
class CacheManager {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  get(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;

    // Check if cache is expired
    if (Date.now() - cached.timestamp > this.cacheTimeout) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  clear() {
    this.cache.clear();
  }
}

const cacheManager = new CacheManager();

// Enhanced API service with caching and error handling
const enhancedApiService = {
  async getFamilyTypes() {
    const cacheKey = 'family-types';
    const cached = cacheManager.get(cacheKey);
    if (cached) return cached;

    try {
      loadingManager.setLoading('family-types', true);
      const result = await apiService.getFamilyTypes();
      cacheManager.set(cacheKey, result);
      return result;
    } catch (error) {
      throw handleApiError(error, 'getFamilyTypes');
    } finally {
      loadingManager.setLoading('family-types', false);
    }
  },

  async getDestinations() {
    const cacheKey = 'destinations';
    const cached = cacheManager.get(cacheKey);
    if (cached) return cached;

    try {
      loadingManager.setLoading('destinations', true);
      const result = await apiService.getDestinations();
      cacheManager.set(cacheKey, result);
      return result;
    } catch (error) {
      throw handleApiError(error, 'getDestinations');
    } finally {
      loadingManager.setLoading('destinations', false);
    }
  },

  async searchPackages(searchParams) {
    try {
      loadingManager.setLoading('search', true);
      apiService.trackEvent('package_search', searchParams);
      const result = await apiService.searchPackages(searchParams);
      return result;
    } catch (error) {
      throw handleApiError(error, 'searchPackages');
    } finally {
      loadingManager.setLoading('search', false);
    }
  },

  async getPackageDetails(packageId) {
    const cacheKey = `package-${packageId}`;
    const cached = cacheManager.get(cacheKey);
    if (cached) return cached;

    try {
      loadingManager.setLoading('package-details', true);
      const result = await apiService.getPackageDetails(packageId);
      cacheManager.set(cacheKey, result);
      return result;
    } catch (error) {
      throw handleApiError(error, 'getPackageDetails');
    } finally {
      loadingManager.setLoading('package-details', false);
    }
  },

  async submitQuoteRequest(quoteData) {
    try {
      loadingManager.setLoading('quote-request', true);
      apiService.trackEvent('quote_request', { destination: quoteData.destination });
      const result = await apiService.submitQuoteRequest(quoteData);
      notificationManager.show(result.message, 'success');
      return result;
    } catch (error) {
      const apiError = handleApiError(error, 'submitQuoteRequest');
      notificationManager.show(apiError.message, 'error');
      throw apiError;
    } finally {
      loadingManager.setLoading('quote-request', false);
    }
  },
};

// Export for use in other scripts
window.familyEMIApi = enhancedApiService;
window.notificationManager = notificationManager;

console.log('🚀 Family EMI API Service loaded successfully');
