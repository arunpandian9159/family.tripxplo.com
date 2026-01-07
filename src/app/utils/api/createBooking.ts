import { bookingsApi, paymentApi } from '@/lib/api-client';
import { BookingPayloadType } from '@/app/types/BookingPayload';

interface BookingResponse {
  booking: {
    id: string;
    bookingNumber: string;
    packageId: string;
    packageName: string;
    totalAmount: number;
    status: string;
  };
}

// Helper to check if user is authenticated
const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem('accessToken');
  return !!token;
};

export const createBooking = async (body: BookingPayloadType) => {
  try {
    console.log('Creating booking with payload:', {
      packageId: body.packageId,
      travelDate: body.startDate,
      adults: body.noAdult,
      children: body.noChild,
      paymentType: body.paymentType,
    });

    // Check authentication first
    if (!isAuthenticated()) {
      throw new Error('Please login to continue with booking');
    }

    // Validate required fields
    if (!body.packageId) {
      throw new Error('Package ID is required');
    }
    if (!body.startDate) {
      throw new Error('Travel date is required');
    }

    // Step 1: Create booking with all price details
    const bookingResponse = await bookingsApi.create({
      packageId: body.packageId,
      travelDate: body.startDate,
      adults: body.noAdult || 1,
      children: body.noChild || 0,
      // Pass price fields to ensure consistency
      finalPackagePrice: body.finalPackagePrice,
      totalPackagePrice: body.totalPackagePrice,
      gstPrice: body.gstPrice,
      gstPer: body.gstPer,
      couponDiscount: body.couponDiscount,
      couponCode: body.couponCode,
      redeemCoin: body.redeemCoin,
    });

    console.log('Booking API response:', bookingResponse);

    if (!bookingResponse.success) {
      const errorMsg =
        bookingResponse.message || bookingResponse.error || 'Failed to create booking';
      console.error('Booking creation failed:', errorMsg, bookingResponse);

      // Check for specific error codes
      if (bookingResponse.code === 'UNAUTHORIZED' || bookingResponse.code === 'AUTH_REQUIRED') {
        throw new Error('Please login to continue with booking');
      }
      if (bookingResponse.code === 'PACKAGE_NOT_FOUND') {
        throw new Error('Package not found. Please try again.');
      }
      if (bookingResponse.code === 'VALIDATION_ERROR') {
        throw new Error(errorMsg);
      }

      throw new Error(errorMsg);
    }

    if (!bookingResponse.data) {
      throw new Error('No booking data returned from server');
    }

    const bookingData = bookingResponse.data as BookingResponse;
    const booking = bookingData.booking;

    if (!booking || !booking.id) {
      throw new Error('Invalid booking response from server');
    }

    console.log('Booking created:', booking);

    // Step 2: Initialize payment
    // Use the finalPackagePrice from the frontend (which includes discounts)
    // This ensures the payment page shows the same amount as the booking overview
    const paymentAmount =
      body.paymentType === 'advance' ? 1 : body.finalPackagePrice || booking.totalAmount || 10000;

    console.log('Initializing payment:', {
      amount: paymentAmount,
      orderId: booking.id,
      fromPayload: body.finalPackagePrice,
      fromBooking: booking.totalAmount,
    });

    const paymentResponse = await paymentApi.initialize({
      amount: paymentAmount,
      orderId: booking.id,
      currency: 'INR',
    });

    console.log('Payment API response:', paymentResponse);

    if (!paymentResponse.success || !paymentResponse.data) {
      console.error('Payment initialization failed:', paymentResponse.message);
      // Return booking info even if payment init fails, with a fallback URL
      return {
        data: {
          result: {
            booking,
            paymentLink: {
              data: {
                instrumentResponse: {
                  redirectInfo: {
                    url: `/payment/${booking.id}`,
                  },
                },
              },
            },
          },
        },
      };
    }

    const paymentData = paymentResponse.data as {
      paymentId: string;
      paymentUrl: string;
      orderId: string;
      amount: number;
    };

    // Return response in the format expected by booking-overview page
    return {
      data: {
        result: {
          booking,
          paymentLink: {
            data: {
              instrumentResponse: {
                redirectInfo: {
                  url: paymentData.paymentUrl,
                },
              },
            },
          },
        },
      },
    };
  } catch (error: unknown) {
    console.error('Create booking error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create booking';
    return Promise.reject(new Error(errorMessage));
  }
};
