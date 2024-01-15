import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async action to fetch data
export const fetchContacts = createAsyncThunk(
  "contact/fetchContacts",
  async () => {
    const response = await fetch("http://localhost:5000/contact");
    const data = await response.json();
    return data;
  }
);

const contactSlice = createSlice({
  name: "contact",
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchContacts.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export default contactSlice.reducer;
