import { useEffect, useState } from "react";
import SelectOption from "./SelectOption";
import TextInput from "./TextInput";
import { countryISO2, countryISO3 } from "../utils/countryCodes";
import { identificationType } from "../utils/identificationType";
import TextArea from "./TextArea";
import useContact from "../hooks/useContact";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const Step2 = ({ onNext }) => {
  // HOOK
  const { addGuardian, addRelationship, checkRegistration } = useContact();

  // Helper Functions and Variables
  const EnteredDate = new Date().toISOString().split("T")[0];
  const [guardianList, setGuardianList] = useState([]);
  const [guardian, setGuardian] = useState({
    relatedtypeid: "", // for contactrelate table
    name: "", // req
    sex: "F", // char(1)
    idno: "", // req
    dob: "", // req
    race: "", // req
    placeofbirth: "",
    nationality: "", // req
    identificationtype: "", // req
    address1: "", // req
    address2: "", // req
    address3: "",
    addresspostalcode: "",
    addresscountry: "", // req varchar(3)
    phonenumber: "",
    hpnumber: "", // req
    emailaddress: "",
    enteredby: "1234", // sysfo bigint
    entereddate: EnteredDate, // sysfo
    editedby: "", // sysfo on PUT
    editeddate: "", // sysfo on PUT
    active: 1, // sysfo
    highestqual: "",
    maritialstatus: "",
    householdincome: "",
    residencetype: "",
    emergencycontact: "",
  });
  const [formStep2IsValid, setFormStep2IsValid] = useState(true);
  const validateFormStep2 = () => {
    if (
      !guardian.name ||
      !guardian.idno ||
      !guardian.dob ||
      !guardian.race ||
      !guardian.nationality ||
      !guardian.identificationtype ||
      !guardian.address1 ||
      !guardian.address2 ||
      !guardian.addresscountry ||
      !guardian.hpnumber
    ) {
      alert("Please fill out all required fields.");
      setFormStep2IsValid(false);
      return false;
    }

    setFormStep2IsValid(true);
    return true;
  };
  const handleSaveFormStep2 = () => {
    handleAddContact2();
  };
  const handleAddContact2 = async () => {
    if (validateFormStep2()) {
      setGuardianList([...guardianList, guardian]);
      try {
        const guardianData = await addGuardian(guardian);
        console.log(guardianData);
        sessionStorage.setItem("guardianId", guardianData.contactid);
        const relationshipData = await addRelationship({
          contactid: sessionStorage.getItem("applicantId"),
          relatedtoid: guardianData.contactid,
          relatedtypeid: guardian.relatedtypeid,
        });
        setTimeout(() => {
          toast.success("Guardian or Parents successfully added!");
        }, 500);
        console.log(relationshipData);
      } catch (error) {
        console.error(error);
      }
    }
  };
  const handleDelete = (id) => {
    const updatedGuardian = guardianList.filter(
      (guardian) => guardian.hpnumber !== id
    );
    setGuardianList(updatedGuardian);
  };
  // checkRegistration
  const [isRegistered, setIsRegistered] = useState(false);
  const [errorMessages, setErrorMessages] = useState({
    name: "",
    idno: "",
    race: "",
    placeofbirth: "",
    nationality: "",
    address1: "",
    address2: "",
    phonenumber: "",
    hpnumber: "",
    emailaddress: "",
  });

  const handleReset = () => {
    setGuardian({
      relatedtypeid: "", // for contactrelate table
      name: "", // req
      sex: "F", // char(1)
      idno: "", // req
      dob: "", // req
      race: "", // req
      placeofbirth: "",
      nationality: "", // req
      identificationtype: "", // req
      address1: "", // req
      address2: "", // req
      address3: "",
      addresspostalcode: "",
      addresscountry: "", // req varchar(3)
      phonenumber: "",
      hpnumber: "", // req
      emailaddress: "",
      enteredby: "1234", // sysfo bigint
      entereddate: EnteredDate, // sysfo
      editedby: "", // sysfo on PUT
      editeddate: "", // sysfo on PUT
      active: 1, // sysfo
      highestqual: "",
      maritialstatus: "",
      householdincome: "",
      residencetype: "",
      emergencycontact: "",
    });
    setSameAddress(false);
  };

  //
  const student = useSelector((state) => state.student);
  const [sameAddress, setSameAddress] = useState(false);
  useEffect(() => {
    if (sameAddress) {
      setGuardian({
        ...guardian,
        address1: student.address1,
        address2: student.address2,
        address3: student.address3,
      });
    } else {
      setGuardian({
        ...guardian,
        address1: "",
        address2: "",
        address3: "",
      });
    }

    console.log(guardian);
  }, [sameAddress]);

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="p-4 border border-slate-300 rounded-lg">
          <SelectOption
            gridWidth="col-span-3"
            label="Relationship to Applicant"
            options={[
              { value: "F", label: "Father" },
              { value: "M", label: "Mother" },
              { value: "G", label: "Guardian" },
            ]}
            placeholder="Choose one!"
            onChange={(e) => {
              const selectedValue = e.target.value;
              let selectedSex = "";

              // Set the sex based on the selected relationship
              if (selectedValue === "F") {
                selectedSex = "M";
              } else if (selectedValue === "M") {
                selectedSex = "F";
              }

              setGuardian({
                ...guardian,
                relatedtypeid: selectedValue,
                sex: selectedSex, // Set the sex based on the selected relationship
              });
            }}
            required={true}
            inputClass={
              !formStep2IsValid && !guardian.relatedtypeid ? "input-error" : ""
            }
            value={guardian.relatedtypeid}
          />
        </div>
        <div className="p-4 border border-slate-300 rounded-lg">
          <div className="grid grid-cols-6 gap-4">
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
                  setGuardian({ ...guardian, idno: newId });
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
                !formStep2IsValid && !guardian.idno && isRegistered === false
                  ? "input-error"
                  : ""
              }
              // value={student.idno}
              value={guardian.idno}
              errorMessage={errorMessages.idno}
            />
            <TextInput
              gridWidth="col-span-6"
              label="Full Name"
              type="text"
              placeholder="Type here ..."
              onChange={(e) => {
                setGuardian({ ...guardian, name: e.target.value });
              }}
              required={true}
              inputClass={
                !formStep2IsValid && !guardian.name ? "input-error" : ""
              }
              value={guardian.name}
            />
            <SelectOption
              gridWidth="col-span-6"
              label="Sex"
              options={[
                { value: "M", label: "Male" },
                { value: "F", label: "Female" },
              ]}
              placeholder="Choose one!"
              onChange={(e) => {
                setGuardian({
                  ...guardian,
                  sex: e.target.value,
                });
              }}
              required={false}
              value={guardian.sex}
            />
            <TextInput
              gridWidth="col-span-3"
              label="Date of Birth"
              type="date"
              placeholder="Type here ..."
              onChange={(e) => {
                setGuardian({ ...guardian, dob: e.target.value });
              }}
              required={true}
              inputClass={
                !formStep2IsValid && !guardian.dob ? "input-error" : ""
              }
              value={guardian.dob}
            />
            <TextInput
              gridWidth="col-span-3"
              label="Race"
              type="text"
              placeholder="Type here ..."
              onChange={(e) => {
                setGuardian({ ...guardian, race: e.target.value });
              }}
              required={true}
              inputClass={
                !formStep2IsValid && !guardian.race ? "input-error" : ""
              }
              value={guardian.race}
            />
            <SelectOption
              gridWidth="col-span-3"
              label="Place of Birth"
              options={countryISO2}
              placeholder="Choose one!"
              onChange={(e) => {
                setGuardian({
                  ...guardian,
                  placeofbirth: e.target.value,
                });
              }}
              required={false}
              value={guardian.placeofbirth}
            />
            <TextInput
              gridWidth="col-span-3"
              label="Nationality"
              type="text"
              placeholder="Type here ..."
              onChange={(e) => {
                setGuardian({ ...guardian, nationality: e.target.value });
              }}
              required={true}
              inputClass={
                !formStep2IsValid && !guardian.nationality ? "input-error" : ""
              }
              value={guardian.nationality}
            />
            <SelectOption
              gridWidth="col-span-3"
              label="Identification Type"
              options={identificationType}
              placeholder="Choose one!"
              onChange={(e) => {
                setGuardian({
                  ...guardian,
                  identificationtype: e.target.value,
                });
              }}
              required={true}
              inputClass={
                !formStep2IsValid && !guardian.identificationtype
                  ? "select-error"
                  : ""
              }
              value={guardian.identificationtype}
            />
            <div className="col-span-6 flex items-center gap-2">
              <input
                type="checkbox"
                className="checkbox checkbox-sm"
                checked={sameAddress}
                onChange={() => setSameAddress(!sameAddress)}
              />
              <span className="label-text">
                Check if the address same with the Student
              </span>
            </div>
            <TextArea
              gridWidth="col-span-6"
              label="Address 1"
              placeholder="Type here ..."
              onChange={(e) => {
                setGuardian({ ...guardian, address1: e.target.value });
              }}
              required={true}
              inputClass={
                !formStep2IsValid && !guardian.address1 ? "textarea-error" : ""
              }
              value={guardian.address1}
              disabled={sameAddress}
            />
            <TextArea
              gridWidth="col-span-6"
              label="Address 2"
              placeholder="Type here ..."
              onChange={(e) => {
                setGuardian({ ...guardian, address2: e.target.value });
              }}
              required={true}
              inputClass={
                !formStep2IsValid && !guardian.address2 ? "textarea-error" : ""
              }
              value={guardian.address2}
              disabled={sameAddress}
            />
            <TextArea
              gridWidth="col-span-6"
              label="Address 3"
              placeholder="Type here ..."
              onChange={(e) => {
                setGuardian({ ...guardian, address3: e.target.value });
              }}
              required={false}
              value={guardian.address3}
              disabled={sameAddress}
            />
            <TextInput
              gridWidth="col-span-3"
              label="Postal Code"
              type="number"
              placeholder="Type here ..."
              onChange={(e) => {
                setGuardian({
                  ...guardian,
                  addresspostalcode: e.target.value,
                });
              }}
              required={false}
              value={guardian.addresspostalcode}
            />
            <SelectOption
              gridWidth="col-span-3"
              label="Country"
              options={countryISO3}
              placeholder="Choose one!"
              onChange={(e) => {
                setGuardian({
                  ...guardian,
                  addresscountry: e.target.value,
                });
              }}
              required={true}
              inputClass={
                !formStep2IsValid && !guardian.addresscountry
                  ? "select-error"
                  : ""
              }
              value={guardian.addresscountry}
            />
            <TextInput
              gridWidth="col-span-3"
              label="Phone Number"
              type="tel"
              placeholder="Type here ..."
              onChange={(e) => {
                setGuardian({ ...guardian, phonenumber: e.target.value });
              }}
              required={false}
              value={guardian.phonenumber}
            />
            <TextInput
              gridWidth="col-span-3"
              label="HP Number"
              type="tel"
              placeholder="Type here ..."
              onChange={(e) => {
                setGuardian({ ...guardian, hpnumber: e.target.value });
              }}
              required={true}
              inputClass={
                !formStep2IsValid && !guardian.hpnumber ? "input-error" : ""
              }
              value={guardian.hpnumber}
            />
            <TextInput
              gridWidth="col-span-6"
              label="Email Address"
              type="email"
              placeholder="Type here ..."
              onChange={(e) => {
                setGuardian({
                  ...guardian,
                  emailaddress: e.target.value,
                });
              }}
              required={false}
              value={guardian.emailaddress}
            />
            <SelectOption
              gridWidth="col-span-3"
              label="Highest Qualification"
              options={[
                { value: "1", label: "Primary & below" },
                { value: "2", label: "Secondary" },
                { value: "3", label: "A-Level/Diploma" },
                { value: "4", label: "Degree & Above" },
              ]}
              placeholder="Choose one!"
              onChange={(e) => {
                setGuardian({ ...guardian, highestqual: e.target.value });
              }}
              required={false}
              value={guardian.highestqual}
            />
            <SelectOption
              gridWidth="col-span-3"
              label="Marital Status"
              options={[
                { value: "1", label: "Single" },
                { value: "2", label: "Divorced/Separated" },
                { value: "3", label: "Married" },
                { value: "4", label: "Widowed" },
              ]}
              placeholder="Choose one!"
              onChange={(e) => {
                setGuardian({
                  ...guardian,
                  maritialstatus: e.target.value,
                });
              }}
              required={false}
              value={guardian.maritialstatus}
            />
            <SelectOption
              gridWidth="col-span-3"
              label="Household Income per Month"
              options={[
                { value: "1", label: "$1500 & Below" },
                { value: "2", label: "$1501 to $3000" },
                { value: "3", label: "$3001 to $5000" },
                { value: "4", label: "$5000 & Above" },
              ]}
              placeholder="Choose one!"
              onChange={(e) => {
                setGuardian({
                  ...guardian,
                  householdincome: e.target.value,
                });
              }}
              required={false}
              value={guardian.householdincome}
            />
            <SelectOption
              gridWidth="col-span-3"
              label="Residence Type"
              options={[
                { value: "1", label: "3-Room Flat" },
                { value: "2", label: "4-Room Flat" },
                { value: "3", label: "5-Room Flat" },
                { value: "4", label: "Executive Flat" },
                { value: "5", label: "Private Property" },
                { value: "6", label: "Other" },
              ]}
              placeholder="Choose one!"
              onChange={(e) => {
                setGuardian({
                  ...guardian,
                  residencetype: e.target.value,
                });
              }}
              required={false}
              value={guardian.residencetype}
            />
            <div className="col-span-6 flex justify-between">
              <button
                className="btn btn-sm"
                onClick={() => handleSaveFormStep2()}
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
        </div>
        <div className="p-4 border border-slate-300 rounded-lg">
          {guardianList.length > 0 &&
            guardianList.map((guardian, index) => (
              <div
                key={index}
                className="flex items-center justify-between mb-2 last:mb-0"
              >
                <div className="uppercase">
                  {guardian.name} - {guardian.relatedtypeid}
                </div>
                <button
                  onClick={() => handleDelete(guardian.hpnumber)}
                  className="btn btn-sm btn-circle"
                >
                  ✕
                </button>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default Step2;
