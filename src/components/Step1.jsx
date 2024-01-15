import { useState } from "react";
import TextInput from "./TextInput";
import SelectOption from "./SelectOption";
import TextArea from "./TextArea";
import { countryISO2, countryISO3 } from "../utils/countryCodes";
import { identificationType } from "../utils/identificationType";
import useContact from "../hooks/useContact";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  updateStudentField,
  resetStudent,
  saveStudent,
} from "../app/studentSlice";

const Step1 = ({ onNext }) => {
  // HOOK
  const { addStudent, checkRegistration } = useContact();

  // Helper Functions and Variables
  const EnteredDate = new Date().toISOString().split("T")[0];

  const [student, setStudent] = useState({
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
    enteredby: 1234, // sysfo bigint
    entereddate: EnteredDate, // sysfo
    editedby: 1, // sysfo on PUT
    editeddate: "", // sysfo on PUT
    active: 1, // sysfo
  });
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

  const handleSaveFormStep1 = async () => {
    if (validateFormStep1()) {
      dispatch(saveStudent(student));
      try {
        const data = await addStudent(student);
        setTimeout(() => {
          toast.success("Student successfully added!");
        }, 500);
        setTimeout(() => {
          console.log(data);
        }, 500);
        setTimeout(() => {
          onNext();
        }, 500);
        sessionStorage.setItem("applicantId", data.contactid);
      } catch (error) {
        toast.error("Student failed added!");
        console.error(error);
      }
    }
  };

  // checkRegistration
  const [isRegistered, setIsRegistered] = useState(false);

  //
  const dispatch = useDispatch();
  const studentAlt = useSelector((state) => state.student);

  // const handleChange = (field, value) => {
  //   dispatch(updateStudentField({ field, value }));
  // };

  // const handleReset = () => {
  //   dispatch(resetStudent());
  // };

  const handleReset = () => {
    setStudent({
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
      enteredby: 1234, // sysfo bigint
      entereddate: EnteredDate, // sysfo
      editedby: 1, // sysfo on PUT
      editeddate: "", // sysfo on PUT
      active: 1, // sysfo
    });
  };

  return (
    <>
      <div className="p-4 grid grid-cols-6 gap-4">
        {/* <TextInput
          gridWidth="col-span-6"
          label="Full Name"
          type="text"
          placeholder="Type here ..."
          onChange={(e) => handleChange("name", e.target.value)}
          required={true}
          // inputClass={!formStep1IsValid && !student.name ? "input-error" : ""}
          value={studentAlt.name}
          // errorMessage={errorMessages.name}
        /> */}
        <TextInput
          gridWidth="col-span-6"
          label="ID Card No"
          type="text"
          placeholder="Type here ..."
          onChange={async (e) => {
            const newId = e.target.value;
            try {
              // Use await to get the registration status
              const isRegisteredStatus = await checkRegistration(newId);
              setIsRegistered(isRegisteredStatus);
              setStudent({ ...student, idno: newId });
              if (!isRegisteredStatus) {
                if (newId.length > 15) {
                  setErrorMessages((prev) => ({
                    ...prev,
                    idno: "Input should not exceed 15 characters",
                  }));
                } else {
                  setErrorMessages((prev) => ({ ...prev, idno: "" }));
                }
              } else {
                setErrorMessages((prev) => ({
                  ...prev,
                  idno: "Id already registered!",
                }));
              }
            } catch (error) {
              console.error("Error in onChange:", error);
            }
          }}
          required={true}
          inputClass={
            !formStep1IsValid && !student.idno && isRegistered === false
              ? "input-error"
              : ""
          }
          value={studentAlt.idno || student.idno}
          errorMessage={errorMessages.idno}
        />
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
          value={studentAlt.name || student.name}
          errorMessage={errorMessages.name}
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
          value={studentAlt.dob || student.dob}
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
          value={studentAlt.race || student.race}
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
          value={studentAlt.placeofbirth || student.placeofbirth}
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
          value={studentAlt.nationality || student.nationality}
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
          value={studentAlt.identificationtype || student.identificationtype}
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
          value={studentAlt.address1 || student.address1}
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
          value={studentAlt.address2 || student.address2}
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
          value={studentAlt.address3 || student.address3}
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
          value={studentAlt.addresspostalcode || student.addresspostalcode}
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
          value={studentAlt.addresscountry || student.addresscountry}
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
          value={studentAlt.phonenumber || student.phonenumber}
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
          value={studentAlt.hpnumber || student.hpnumber}
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
          value={studentAlt.emailaddress || student.emailaddress}
          errorMessage={errorMessages.emailaddress}
        />
        <div className="col-span-6 flex justify-between">
          <button
            className="btn btn-sm"
            onClick={() => handleSaveFormStep1()}
            disabled={isRegistered}
          >
            Save
          </button>
          <button className="btn btn-sm" onClick={handleReset}>
            Reset
          </button>
        </div>
        {isRegistered && (
          <div className="col-span-6">
            <span className="text-sm text-red-500">
              Please make sure all field is filled correctly!
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export default Step1;
