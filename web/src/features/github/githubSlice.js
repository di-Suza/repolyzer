import { createSlice } from "@reduxjs/toolkit";

const githubSlice = createSlice({
  name: "github",
  initialState: {
    // Hydrate recent searches once so the dropdown is useful immediately after refresh.
    recentSearches:  JSON.parse(localStorage.getItem('recentSearches') || '[]'),
  },
  reducers: {
    addRecentSearch: (state, action) => {
      // Move an existing search to the top instead of storing duplicates, then keep the list compact.
      const filtered = state.recentSearches.filter((s) => s !== action.payload);
      state.recentSearches = [action.payload, ...filtered].slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(state.recentSearches));
    },
  },
});

export const { addRecentSearch } = githubSlice.actions;
export default githubSlice.reducer;
