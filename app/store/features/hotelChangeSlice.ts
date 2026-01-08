import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  replaceHotel: {},
  hotelData: {},
  filterRoomsMeals: [],
};

export const hotelChangeSlice = createSlice({
  name: "hotelChange",
  initialState,
  reducers: {
    setReplaceHotel: (state, action) => {
      state.replaceHotel = action.payload;
    },

    setHotelData: (state, action) => {
      state.hotelData = action.payload;
    },
  },
});

export const { setReplaceHotel, setHotelData } = hotelChangeSlice.actions;
export default hotelChangeSlice.reducer;
