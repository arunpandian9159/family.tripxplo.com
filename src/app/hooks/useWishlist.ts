'use client';

import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/app/store/store';
import {
  setWishlist,
  setWishlistLoading,
  setWishlistError,
  addToWishlist,
  removeFromWishlist,
} from '@/app/store/features/wishlistSlice';
import { userApi } from '@/lib/api-client';
import toast from 'react-hot-toast';

// Helper to check if user is logged in
const checkIsLoggedIn = (): boolean => {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem('accessToken');
  return !!token;
};

export function useWishlist() {
  const dispatch = useDispatch();
  const { items, packageIds, isLoading, error } = useAppSelector(state => state.wishlist);
  const { userId } = useAppSelector(state => state.userSlice);

  // Check both Redux userId AND localStorage token
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Update isLoggedIn on mount and when userId changes
  useEffect(() => {
    const hasToken = checkIsLoggedIn();
    const hasUserId = !!userId;
    setIsLoggedIn(hasToken || hasUserId);
  }, [userId]);

  // Fetch wishlist from API
  const fetchWishlist = useCallback(async () => {
    if (!checkIsLoggedIn()) return;

    dispatch(setWishlistLoading(true));
    dispatch(setWishlistError(null));

    try {
      const response = await userApi.getWishlist();

      if (response.success && response.data) {
        const data = response.data as { wishlist: any[] };
        dispatch(setWishlist(data.wishlist || []));
      } else {
        dispatch(setWishlistError(response.message || 'Failed to fetch wishlist'));
      }
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      dispatch(setWishlistError('Failed to fetch wishlist'));
    } finally {
      dispatch(setWishlistLoading(false));
    }
  }, [dispatch]);

  // Check if a package is in wishlist
  const isInWishlist = useCallback(
    (packageId: string) => {
      return packageIds.includes(packageId);
    },
    [packageIds]
  );

  // Add package to wishlist
  const addPackageToWishlist = useCallback(
    async (packageId: string) => {
      if (!checkIsLoggedIn()) {
        return false;
      }

      // Optimistic update
      dispatch(addToWishlist(packageId));

      try {
        const response = await userApi.addToWishlist(packageId);

        if (response.success) {
          toast.success('Added to wishlist!');
          return true;
        } else {
          // Revert optimistic update
          dispatch(removeFromWishlist(packageId));
          toast.error(response.message || 'Failed to add to wishlist');
          return false;
        }
      } catch (err) {
        // Revert optimistic update
        dispatch(removeFromWishlist(packageId));
        console.error('Error adding to wishlist:', err);
        toast.error('Failed to add to wishlist');
        return false;
      }
    },
    [dispatch]
  );

  // Remove package from wishlist
  const removePackageFromWishlist = useCallback(
    async (packageId: string) => {
      if (!checkIsLoggedIn()) {
        return false;
      }

      // Optimistic update
      dispatch(removeFromWishlist(packageId));

      try {
        const response = await userApi.removeFromWishlist(packageId);

        if (response.success) {
          toast.success('Removed from wishlist');
          return true;
        } else {
          // Revert optimistic update
          dispatch(addToWishlist(packageId));
          toast.error(response.message || 'Failed to remove from wishlist');
          return false;
        }
      } catch (err) {
        // Revert optimistic update
        dispatch(addToWishlist(packageId));
        console.error('Error removing from wishlist:', err);
        toast.error('Failed to remove from wishlist');
        return false;
      }
    },
    [dispatch]
  );

  // Toggle wishlist status
  const toggleWishlist = useCallback(
    async (packageId: string) => {
      if (isInWishlist(packageId)) {
        return removePackageFromWishlist(packageId);
      } else {
        return addPackageToWishlist(packageId);
      }
    },
    [isInWishlist, addPackageToWishlist, removePackageFromWishlist]
  );

  // Fetch wishlist on mount if logged in
  useEffect(() => {
    if (isLoggedIn && packageIds.length === 0) {
      fetchWishlist();
    }
  }, [isLoggedIn, fetchWishlist, packageIds.length]);

  return {
    items,
    packageIds,
    isLoading,
    error,
    isLoggedIn,
    isInWishlist,
    fetchWishlist,
    addPackageToWishlist,
    removePackageFromWishlist,
    toggleWishlist,
  };
}
