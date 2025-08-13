import { createSlice } from '@reduxjs/toolkit';

const typingSlice = createSlice({
  name: 'typing',
  initialState: { isTyping: false },
  reducers: {
    setTyping(state, action) {
      state.isTyping = action.payload;
    },
  },
});

export const { setTyping } = typingSlice.actions;
export default typingSlice.reducer;
