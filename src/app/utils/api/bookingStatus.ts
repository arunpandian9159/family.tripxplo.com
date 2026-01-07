import { bookingsApi } from '@/lib/api-client';

export const bookingStatus = async (id: string) => {
  try {
    const response = await bookingsApi.getById(id);
    
    if (response.success && response.data) {
      // Return in format expected by existing components
      return {
        data: {
          result: response.data,
        },
      };
    }
    
    // Return null instead of rejecting to allow retry logic
    return null;
  } catch (error) {
    console.error('Error fetching booking status:', error);
    return null;
  }
};
