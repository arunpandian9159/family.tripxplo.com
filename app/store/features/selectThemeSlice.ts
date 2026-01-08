import { Interest } from "@/app/(user-area)/components/home/package-theme/PackageThemes";
import { getInterest } from "@/app/actions/get-interest";
import { createSlice } from "@reduxjs/toolkit";

export interface Theme {
  theme: string;
  themeId: string;
}

const initialState: Theme = {
  theme: "Couple",
  themeId: "",
};
const themeSlice = createSlice({
  name: "themeSlice",
  initialState: initialState,
  reducers: {
    selectTheme(state, action) {
      const { selectedTheme } = action.payload;
      state.theme = selectedTheme;
    },
    selectThemeId(state, action) {
      const { selectedThemeId } = action.payload;
      state.themeId = selectedThemeId;
    },
  },
});
export const { selectTheme, selectThemeId } = themeSlice.actions;
export default themeSlice.reducer;
