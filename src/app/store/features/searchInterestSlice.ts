import { createSlice } from '@reduxjs/toolkit';

const searchInterestSlice = createSlice({
  name: 'searchInterest',
  initialState: {
    searchInterest: 'Trending',
  },
  reducers: {
    changeSearchInterest: (state, action) => {
      state.searchInterest = action.payload;
    },
  },
});
export const { changeSearchInterest } = searchInterestSlice.actions;
export default searchInterestSlice.reducer;
