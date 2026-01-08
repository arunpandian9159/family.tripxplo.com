import { searchPackage } from "@/app/types";
import { createSlice } from "@reduxjs/toolkit";
const dateNow = new Date();

const dateToString = dateNow.toISOString();
const searchPackageSlice = createSlice({
  name: "searchPackage",

  initialState: {
    date: dateToString,
    destination: "",
    destinationId: "",
  },

  reducers: {
    changeDestination: (state, action) => {
      state.destination = action.payload;
    },
    changeDestinationId: (state, action) => {
      state.destinationId = action.payload;
    },
    changeDate: (state, action) => {
      state.date = action.payload;
    },
  },
});

export const { changeDestination, changeDestinationId, changeDate } =
  searchPackageSlice.actions;
export default searchPackageSlice.reducer;
