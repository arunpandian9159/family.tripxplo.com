import { PayloadAction, createSlice } from "@reduxjs/toolkit"
interface filterCategoryState {
    filterCategory: string,
    selectedFilters: string[]
}
const initialState: filterCategoryState = {
    filterCategory: 'All Packages',
    selectedFilters: []
}
const filterCategorySlice = createSlice({
    name: 'filterCategory',
    initialState,
    reducers: {

        setFilterCategory: (state, action: PayloadAction<string>) => {
            state.filterCategory = action.payload;
        }
    }
})

export const { setFilterCategory } = filterCategorySlice.actions;
export default filterCategorySlice.reducer;