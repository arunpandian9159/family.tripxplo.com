import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { TypedUseSelectorHook, useSelector } from 'react-redux';

import pkgCategorySlice from './features/pkgCategorySlice';
import filterCategorySlice from './features/filterCategorySlice';
import SearchPackageSlice from './features/searchPackageSlice';
import searchInterestSlice from './features/searchInterestSlice';
import selectThemeSlice from './features/selectThemeSlice';
import selectRoomSlice from './features/roomCapacitySlice';
import activitySlice from './features/activitySlice';
import packageSlice from './features/packageSlice';
import hotelChangeSlice from './features/hotelChangeSlice';
import authSlice from './features/authSlice';
import packageDetailsSlice from './features/packageDetailsSlice';
import userSlice from './features/userSlice';
import cabChangeSlice from './features/cabChangeSlice';
import wishlistSlice from './features/wishlistSlice';
const generatePersistConfig = (key: string) => ({
  key,
  storage,
});

const persistedPkgCategorySlice = persistReducer(
  generatePersistConfig('pkgCategory'),
  pkgCategorySlice
);
const persistedFilterCategorySlice = persistReducer(
  generatePersistConfig('filterCategory'),
  filterCategorySlice
);
const persistedThemeSelect = persistReducer(generatePersistConfig('themeSelect'), selectThemeSlice);
const persisitedPackageDetails = persistReducer(
  generatePersistConfig('packageDetails'),
  packageDetailsSlice
);

const persistedRoomSelect = persistReducer(generatePersistConfig('roomSelect'), selectRoomSlice);
const persistedAuthSlice = persistReducer(generatePersistConfig('authSlice'), authSlice);
const persistedSearchPackage = persistReducer(
  generatePersistConfig('searchPackage'),
  SearchPackageSlice
);
const persistedActivity = persistReducer(generatePersistConfig('activity'), activitySlice);
const persistedPackage = persistReducer(generatePersistConfig('package'), packageSlice);
const persistedHotelChange = persistReducer(generatePersistConfig('hotelChange'), hotelChangeSlice);
const persistedCabChange = persistReducer(generatePersistConfig('cabChange'), cabChangeSlice);
const persistedUserSlice = persistReducer(generatePersistConfig('userSlice'), userSlice);
const persistedWishlistSlice = persistReducer(generatePersistConfig('wishlist'), wishlistSlice);
export const store = configureStore({
  reducer: {
    authSlice: persistedAuthSlice,
    pkgCategory: persistedPkgCategorySlice,
    filterCategory: persistedFilterCategorySlice,
    searchPackage: persistedSearchPackage,
    searchInterest: searchInterestSlice,
    themeSelect: persistedThemeSelect,
    roomSelect: persistedRoomSelect,
    activity: persistedActivity,
    package: packageSlice,
    hotelChange: persistedHotelChange,
    cabChange: persistedCabChange,
    packageDetails: persisitedPackageDetails,
    userSlice: persistedUserSlice,
    wishlist: persistedWishlistSlice,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
