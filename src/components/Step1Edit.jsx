import { useEffect, useState } from "react";
import TextInput from "./TextInput";
import SelectOption from "./SelectOption";
import TextArea from "./TextArea";
import { countryISO2, countryISO3 } from "../utils/countryCodes";
import { identificationType } from "../utils/identificationType";
import useContact from "../hooks/useContact";
import toast from "react-hot-toast";

const Step1Edit = ({ selectedRow, action }) => {
  // HOOK
  const { addStudent } = useContact();

  // Helper Functions and Variables
  const EnteredDate = new Date().toISOString().split("T")[0];

  //
  const [initialState, setInitialState] = useState(selectedRow);
  const [student, setStudent] = useState(selectedRow);
  const [errorMessages, setErrorMessages] = useState({
    name: "",
    idno: "",
    race: "",
    placeofbirth: "",
    nationality: "",
    address1: "",
    address2: "",
    address3: "",
    phonenumber: "",
    hpnumber: "",
    emailaddress: "",
  });
  const [formStep1IsValid, setFormStep1IsValid] = useState(true);
  useEffect(() => {
    if (selectedRow) {
      // Create a copy of selectedRow
      let updatedRow = { ...selectedRow };

      // Format the dob field
      if (updatedRow.dob) {
        updatedRow.dob = new Date(updatedRow.dob).toISOString().split("T")[0];
      }

      if (updatedRow.entereddate) {
        updatedRow.entereddate = new Date(updatedRow.entereddate)
          .toISOString()
          .split("T")[0];
      }

      setStudent(updatedRow);
      setInitialState(updatedRow);
    }
  }, [selectedRow]);
  const validateFormStep1 = () => {
    if (
      !student.name ||
      !student.idno ||
      !student.dob ||
      !student.race ||
      !student.nationality ||
      !student.identificationtype ||
      !student.address1 ||
      !student.address2 ||
      !student.addresscountry ||
      !student.hpnumber
    ) {
      alert("Please fill out all required fields.");
      setFormStep1IsValid(false);
      return false;
    }
    setFormStep1IsValid(true);
    return true;
  };
  const hasFormDataChanged = () => {
    return Object.keys(student).some(
      (key) => student[key] !== initialState[key]
    );
  };
  const handleSaveFormStep1 = () => {
    if (validateFormStep1()) {
      if (hasFormDataChanged()) {
        action(student);
        console.log(student);
      } else {
        toast.error("No changes were made!");
      }
    }
  };
  return (
    <>
      <div className="p-4 grid grid-cols-6 gap-4">
        <TextInput
          gridWidth="col-span-6"
          label="Full Name"
          type="text"
          placeholder="Type here ..."
          onChange={(e) => {
            setStudent({ ...student, name: e.target.value });
            if (e.target.value.length > 100) {
              setErrorMessages((prev) => ({
                ...prev,
                name: "Input should not exceed 100 characters",
              }));
            } else {
              setErrorMessages((prev) => ({ ...prev, name: "" }));
            }
          }}
          required={true}
          inputClass={!formStep1IsValid && !student.name ? "input-error" : ""}
          value={student && student.name}
          errorMessage={errorMessages.name}
        />
        <TextInput
          gridWidth="col-span-3"
          label="ID Card No"
          type="text"
          placeholder="Type here ..."
          onChange={(e) => {
            setStudent({ ...student, idno: e.target.value });
            if (e.target.value.length > 15) {
              setErrorMessages((prev) => ({
                ...prev,
                idno: "Input should not exceed 15 characters",
              }));
            } else {
              setErrorMessages((prev) => ({ ...prev, idno: "" }));
            }
          }}
          required={true}
          inputClass={!formStep1IsValid && !student.idno ? "input-error" : ""}
          value={student && student.idno}
          errorMessage={errorMessages.idno}
        />
        <TextInput
          gridWidth="col-span-3"
          label="Date of Birth"
          type="date"
          placeholder="Type here ..."
          onChange={(e) => {
            setStudent({ ...student, dob: e.target.value });
          }}
          required={true}
          inputClass={!formStep1IsValid && !student.dob ? "input-error" : ""}
          value={student && student.dob}
        />
        <TextInput
          gridWidth="col-span-3"
          label="Race"
          type="text"
          placeholder="Type here ..."
          onChange={(e) => {
            setStudent({ ...student, race: e.target.value });
            if (e.target.value.length > 15) {
              setErrorMessages((prev) => ({
                ...prev,
                race: "Input should not exceed 50 characters",
              }));
            } else {
              setErrorMessages((prev) => ({ ...prev, race: "" }));
            }
          }}
          required={true}
          inputClass={!formStep1IsValid && !student.race ? "input-error" : ""}
          value={student && student.race}
          errorMessage={errorMessages.race}
        />
        <SelectOption
          gridWidth="col-span-3"
          label="Place of Birth"
          options={countryISO2}
          placeholder="Choose one!"
          onChange={(e) => {
            setStudent({ ...student, placeofbirth: e.target.value });
          }}
          required={false}
          value={student && student.placeofbirth}
        />
        <TextInput
          gridWidth="col-span-3"
          label="Nationality"
          type="text"
          placeholder="Type here ..."
          onChange={(e) => {
            setStudent({ ...student, nationality: e.target.value });
            if (e.target.value.length > 15) {
              setErrorMessages((prev) => ({
                ...prev,
                nationality: "Input should not exceed 50 characters",
              }));
            } else {
              setErrorMessages((prev) => ({ ...prev, nationality: "" }));
            }
          }}
          required={true}
          inputClass={
            !formStep1IsValid && !student.nationality ? "input-error" : ""
          }
          value={student && student.nationality}
          errorMessage={errorMessages.nationality}
        />
        <SelectOption
          gridWidth="col-span-3"
          label="Identification Type"
          options={identificationType}
          placeholder="Choose one!"
          onChange={(e) => {
            setStudent({
              ...student,
              identificationtype: e.target.value,
            });
          }}
          required={true}
          inputClass={
            !formStep1IsValid && !student.identificationtype
              ? "select-error"
              : ""
          }
          value={student && student.identificationtype}
        />
        <TextArea
          gridWidth="col-span-6"
          label="Address 1"
          placeholder="Type here ..."
          onChange={(e) => {
            setStudent({ ...student, address1: e.target.value });
            if (e.target.value.length > 50) {
              setErrorMessages((prev) => ({
                ...prev,
                address1: "Input should not exceed 50 characters",
              }));
            } else {
              setErrorMessages((prev) => ({ ...prev, address1: "" }));
            }
          }}
          required={true}
          inputClass={
            !formStep1IsValid && !student.address1 ? "textarea-error" : ""
          }
          value={student && student.address1}
          errorMessage={errorMessages.address1}
        />
        <TextArea
          gridWidth="col-span-6"
          label="Address 2"
          placeholder="Type here ..."
          onChange={(e) => {
            setStudent({ ...student, address2: e.target.value });
            if (e.target.value.length > 50) {
              setErrorMessages((prev) => ({
                ...prev,
                address2: "Input should not exceed 50 characters",
              }));
            } else {
              setErrorMessages((prev) => ({ ...prev, address2: "" }));
            }
          }}
          required={true}
          inputClass={
            !formStep1IsValid && !student.address2 ? "textarea-error" : ""
          }
          value={student && student.address2}
          errorMessage={errorMessages.address2}
        />
        <TextArea
          gridWidth="col-span-6"
          label="Address 3"
          placeholder="Type here ..."
          onChange={(e) => {
            setStudent({ ...student, address3: e.target.value });
            if (e.target.value.length > 50) {
              setErrorMessages((prev) => ({
                ...prev,
                address3: "Input should not exceed 50 characters",
              }));
            } else {
              setErrorMessages((prev) => ({ ...prev, address3: "" }));
            }
          }}
          required={false}
          value={(student && student.address3) || ""}
          errorMessage={errorMessages.address3}
        />
        <TextInput
          gridWidth="col-span-3"
          label="Postal Code"
          type="number"
          placeholder="Type here ..."
          onChange={(e) => {
            if (e.target.value.length <= 6) {
              setStudent({
                ...student,
                addresspostalcode: e.target.value,
              });
            }
          }}
          required={true}
          inputClass={
            !formStep1IsValid && !student.nationality ? "input-error" : ""
          }
          value={student && student.addresspostalcode}
          maxLength={6}
        />
        <SelectOption
          gridWidth="col-span-3"
          label="Country"
          options={countryISO3}
          placeholder="Choose one!"
          onChange={(e) => {
            setStudent({ ...student, addresscountry: e.target.value });
          }}
          required={true}
          inputClass={
            !formStep1IsValid && !student.addresscountry ? "select-error" : ""
          }
          value={student && student.addresscountry}
        />
        <TextInput
          gridWidth="col-span-3"
          label="Phone Number"
          type="tel"
          placeholder="Type here ..."
          onChange={(e) => {
            setStudent({ ...student, phonenumber: e.target.value });
            if (e.target.value.length > 20) {
              setErrorMessages((prev) => ({
                ...prev,
                phonenumber: "Input should not exceed 20 characters",
              }));
            } else {
              setErrorMessages((prev) => ({ ...prev, phonenumber: "" }));
            }
          }}
          required={false}
          value={student && student.phonenumber}
          errorMessage={errorMessages.phonenumber}
        />
        <TextInput
          gridWidth="col-span-3"
          label="HP Number"
          type="tel"
          placeholder="Type here ..."
          onChange={(e) => {
            setStudent({ ...student, hpnumber: e.target.value });
            if (e.target.value.length > 20) {
              setErrorMessages((prev) => ({
                ...prev,
                hpnumber: "Input should not exceed 20 characters",
              }));
            } else {
              setErrorMessages((prev) => ({ ...prev, hpnumber: "" }));
            }
          }}
          required={true}
          inputClass={
            !formStep1IsValid && !student.hpnumber ? "input-error" : ""
          }
          value={student && student.hpnumber}
          errorMessage={errorMessages.hpnumber}
        />
        <TextInput
          gridWidth="col-span-6"
          label="Email Address"
          type="email"
          placeholder="Type here ..."
          onChange={(e) => {
            setStudent({ ...student, emailaddress: e.target.value });
            if (e.target.value.length > 255) {
              setErrorMessages((prev) => ({
                ...prev,
                emailaddress: "Input should not exceed 255 characters",
              }));
            } else {
              setErrorMessages((prev) => ({ ...prev, emailaddress: "" }));
            }
          }}
          required={true}
          value={student && student.emailaddress}
          errorMessage={errorMessages.emailaddress}
        />
        <div className="col-span-6 flex justify-between">
          <button className="btn btn-sm" onClick={() => handleSaveFormStep1()}>
            Update
          </button>
        </div>
      </div>
    </>
  );
};

export default Step1Edit;
