import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WishlistItem {
  packageId: string;
  name: string;
  images: string[];
  noOfDays: number;
  noOfNights: number;
  startFrom: number;
  perPerson: number;
  offer?: number;
  destinations: { id: string; noOfNights: number }[];
  hotelCount: number;
  vehicleCount: number;
  activityCount: number;
  planName?: string | null;
}

interface WishlistState {
  items: WishlistItem[];
  packageIds: string[];
  isLoading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  packageIds: [],
  isLoading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setWishlistLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setWishlistError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setWishlist: (state, action: PayloadAction<WishlistItem[]>) => {
      state.items = action.payload;
      state.packageIds = action.payload.map(item => item.packageId);
    },
    addToWishlist: (state, action: PayloadAction<string>) => {
      if (!state.packageIds.includes(action.payload)) {
        state.packageIds.push(action.payload);
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.packageIds = state.packageIds.filter(id => id !== action.payload);
      state.items = state.items.filter(item => item.packageId !== action.payload);
    },
    clearWishlist: state => {
      state.items = [];
      state.packageIds = [];
    },
  },
});

export const {
  setWishlistLoading,
  setWishlistError,
  setWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
