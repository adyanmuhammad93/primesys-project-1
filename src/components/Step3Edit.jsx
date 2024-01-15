import { useState } from "react";
import TextInput from "./TextInput";
import TextArea from "./TextArea";
import SelectOption from "./SelectOption";
import useContact from "../hooks/useContact";

const Step3Edit = ({ selectedRow, action }) => {
  const [initialState, setInitialState] = useState(selectedRow);
  const [other, setOther] = useState(selectedRow);

  const hasFormDataChanged = () => {
    return Object.keys(student).some((key) => other[key] !== initialState[key]);
  };

  const handleSaveFormStep3 = async () => {
    if (hasFormDataChanged()) {
      action(selectedRow.contactid, other);
      console.log(other);
    } else {
      alert("No changes were made!");
    }
  };
  return (
    <>
      <div className="p-4 grid grid-cols-6 gap-4">
        <TextInput
          gridWidth="col-span-6"
          label="Language Used at Home"
          type="text"
          placeholder="Type here ..."
          onChange={(e) => {
            setOther({
              ...other,
              langusedathome: e.target.value,
            });
          }}
          required={false}
          value={other && other.langusedathome}
        />
        <TextInput
          gridWidth="col-span-6"
          label="Name of School Attended"
          type="text"
          placeholder="Type here ..."
          onChange={(e) => {
            setOther({
              ...other,
              nameofschattended: e.target.value,
            });
          }}
          required={false}
          value={other && other.nameofschattended}
        />
        <TextInput
          gridWidth="col-span-6"
          label="Year of School Attended"
          type="text"
          placeholder="Type here ..."
          onChange={(e) => {
            setOther({
              ...other,
              dateofschattended: e.target.value,
            });
          }}
          required={false}
          value={other && other.dateofschattended}
        />
        <TextArea
          gridWidth="col-span-6"
          label="Types of Illness (If any)"
          placeholder="Type here ..."
          onChange={(e) => {
            setOther({ ...other, illness: e.target.value });
          }}
          required={false}
          value={other && other.illness}
        />
        <SelectOption
          gridWidth="col-span-6"
          label="Is the applicant under doctor's observation?"
          options={[
            { value: "1", label: "Yes" },
            { value: "2", label: "No" },
          ]}
          placeholder="Choose one!"
          onChange={(e) => {
            setOther({
              ...other,
              docobservation: e.target.value,
            });
          }}
          required={false}
          value={other && other.docobservation}
        />
        <SelectOption
          gridWidth="col-span-6"
          label="Does the applicant apply at other institution other than
                Madrasah Al-Ma'arif?"
          options={[
            { value: "1", label: "Yes" },
            { value: "2", label: "No" },
          ]}
          placeholder="Choose one!"
          onChange={(e) => {
            setOther({
              ...other,
              applotherinst: e.target.value,
            });
          }}
          required={false}
          value={other && other.applotherinst}
        />
        <div className="col-span-6 border border-slate-300 rounded-lg p-4">
          <div className="flex flex-col gap-4">
            <h3>Emergency Contact</h3>
            <TextInput
              gridWidth="col-span-6"
              label="Full Name"
              type="text"
              placeholder="Type here ..."
              onChange={(e) => {
                setOther({
                  ...other,
                  emergencycontacname: e.target.value,
                });
              }}
              required={false}
              value={other && other.emergencycontacname}
            />
            <TextInput
              gridWidth="col-span-6"
              label="Telephone Number (Office)"
              type="tel"
              placeholder="Type here ..."
              onChange={(e) => {
                setOther({
                  ...other,
                  emergencycontactoffice: e.target.value,
                });
              }}
              required={false}
              value={other && other.emergencycontactoffice}
            />
            <TextInput
              gridWidth="col-span-6"
              label="Telephone Number (Home)"
              type="tel"
              placeholder="Type here ..."
              onChange={(e) => {
                setOther({
                  ...other,
                  emergencycontacthome: e.target.value,
                });
              }}
              required={false}
              value={other && other.emergencycontacthome}
            />
            <TextInput
              gridWidth="col-span-6"
              label="Telephone Number (Mobile)"
              type="tel"
              placeholder="Type here ..."
              onChange={(e) => {
                setOther({
                  ...other,
                  emergencycontacthp: e.target.value,
                });
              }}
              required={false}
              value={other && other.emergencycontacthp}
            />
            <TextInput
              gridWidth="col-span-6"
              label="Relationship to Applicant"
              type="tel"
              placeholder="Type here ..."
              onChange={(e) => {
                setOther({
                  ...other,
                  emergencyrelation: e.target.value,
                });
              }}
              required={false}
              value={other && other.emergencyrelation}
            />
          </div>
        </div>
        <TextArea
          gridWidth="col-span-6"
          label="Notes"
          placeholder="Type here ..."
          onChange={(e) => {
            setOther({ ...other, notes: e.target.value });
          }}
          required={false}
          value={other && other.notes}
        />
        <div className="col-span-6 flex justify-between">
          <button className="btn btn-sm" onClick={() => handleSaveFormStep3()}>
            Update
          </button>
        </div>
      </div>
    </>
  );
};

export default Step3Edit;
