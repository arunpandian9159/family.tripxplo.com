import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  currentPackageId: "",
};

export const packageDetailsSlice = createSlice({
  name: "packageDetails",
  initialState,
  reducers: {
    setPackageId: (state, action: PayloadAction<string>) => {
      state.currentPackageId = action.payload;
    },
    removePackageId: (state) => {
      state.currentPackageId = "";
    },
  },
});

export const { setPackageId, removePackageId } = packageDetailsSlice.actions;
export default packageDetailsSlice.reducer;
