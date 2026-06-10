import { createSlice } from "@reduxjs/toolkit";

const githubSlice = createSlice({
  name: "github",
  initialState: {
    recentSearches: [],
  },
  reducers: {
    addRecentSearch: (state, action) => {
      const filtered = state.recentSearches.filter((s) => s !== action.payload);
      state.recentSearches = [action.payload, ...filtered].slice(0, 5);
    },
  },
});

export const { addRecentSearch } = githubSlice.actions;
export default githubSlice.reducer;
