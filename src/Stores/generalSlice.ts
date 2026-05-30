import { createSlice } from "@reduxjs/toolkit";




const initialState = {
  filter:{
    Price: {
      min: 0,
      max: 500000000,
    },
    Area: {
      min: 0,
      max: 50000,
    },
  }
};

const generalSlice = createSlice({
  name: "general",
  initialState,
  reducers: {
   updateFilter : (state,action) => {
    state.filter = action.payload;
   }
  },
});

export const { updateFilter } = generalSlice.actions;
export default generalSlice.reducer;
