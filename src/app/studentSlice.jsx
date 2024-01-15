// studentSlice.js
import { createSlice } from "@reduxjs/toolkit";

const enteredDate = new Date().toISOString().split("T")[0];

const initialState = {
  name: "",
  sex: "F",
  idno: "",
  dob: "",
  race: "",
  placeofbirth: "",
  nationality: "",
  identificationtype: "",
  address1: "",
  address2: "",
  address3: "",
  addresspostalcode: "",
  addresscountry: "",
  phonenumber: "",
  hpnumber: "",
  emailaddress: "",
  enteredby: 1234,
  entereddate: enteredDate,
  editedby: 1,
  editeddate: "",
  active: 1,
};

const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {
    updateStudentField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    resetStudent: (state) => {
      return initialState;
    },
    saveStudent: (state, action) => {
      return action.payload;
    },
  },
});

export const { updateStudentField, resetStudent, saveStudent } =
  studentSlice.actions;
export default studentSlice.reducer;
