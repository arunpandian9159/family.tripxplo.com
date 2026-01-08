import { PackageQuery, Stay } from "@/app/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: PackageQuery = {
  category: "",
  destination: "",
  date: "",
  stay: {
    room: 0,
    adult: 0,
    children: 0,
  },
};
const PackageQuerySlice = createSlice({
  name: "",
  initialState,
  reducers: {
    setCategoryState: (state, action: PayloadAction<string>) => {
      state.category = action.payload;
    },

    setDestinationState: (state, action: PayloadAction<string>) => {
      state.destination = action.payload;
    },
    setDateState: (state, action: PayloadAction<string>) => {
      state.date = action.payload;
    },
  },
});

const { setCategoryState, setDestinationState, setDateState } =
  PackageQuerySlice.actions;
export default PackageQuerySlice.actions;
