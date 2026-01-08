import { createSlice } from "@reduxjs/toolkit";
import { VehicleDetail } from "@/app/types/vehicle";
import { stat } from "fs";

interface CabChangeState {
  replaceCab: VehicleDetail | {};
  cabData: VehicleDetail | {};
  filterCabs: VehicleDetail[];
}

const initialState: CabChangeState = {
  replaceCab: {},
  cabData: {},
  filterCabs: [],
};

export const cabChangeSlice = createSlice({
  name: "cabChange",
  initialState,
  reducers: {
    setReplaceCab: (state, action) => {
      state.replaceCab = action.payload;
    },

    setCabData: (state, action) => {
      state.cabData = action.payload;
    },

    setFilterCabs: (state, action) => {
      state.filterCabs = action.payload;
    },
  },
});

export const { setReplaceCab, setCabData, setFilterCabs } =
  cabChangeSlice.actions;
export default cabChangeSlice.reducer;
