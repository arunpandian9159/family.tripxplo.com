import { PayloadAction, createSlice } from "@reduxjs/toolkit";
interface pkgCategoryState {
  pkgCategory: string;
}

const initialState: pkgCategoryState = {
  pkgCategory: "",
};

const pkgCategorySlice = createSlice({
  name: "pkgCategory",
  initialState,
  reducers: {
    setPkgCategory: (state, action: PayloadAction<string>) => {
      state.pkgCategory = action.payload;
    },
  },
});

export const { setPkgCategory } = pkgCategorySlice.actions;
export default pkgCategorySlice.reducer;
