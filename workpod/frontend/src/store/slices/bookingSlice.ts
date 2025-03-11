import { createSlice } from '@reduxjs/toolkit';

const bookingSlice = createSlice({
  name: 'booking',
  initialState: { currentBooking: null },
  reducers: {}
});

export default bookingSlice.reducer; 