import { createSlice } from "@reduxjs/toolkit";

export interface Theme {
  theme: string;
  themeId: string;
}

// Family theme is the only theme in this project
// The interestId for Family is from the database
const FAMILY_INTEREST_ID = "f9416600-db43-4f32-91f2-659ef08e3509";

const initialState: Theme = {
  theme: "Family",
  themeId: FAMILY_INTEREST_ID,
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
