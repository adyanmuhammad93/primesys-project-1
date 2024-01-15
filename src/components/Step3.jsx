import { useState } from "react";
import TextInput from "./TextInput";
import TextArea from "./TextArea";
import SelectOption from "./SelectOption";
import useContact from "../hooks/useContact";
import toast from "react-hot-toast";

const Step3 = () => {
  // HOOK
  const { updateOtherInfo } = useContact();

  const [other, setOther] = useState({
    langusedathome: "",
    nameofschattended: "",
    dateofschattended: "",
    illness: "",
    docobservation: "",
    applotherinst: "",
    emergencycontacname: "",
    emergencycontactoffice: "",
    emergencycontacthp: "",
    emergencycontacthome: "",
    emergencyrelation: "",
    notes: "",
  });

  const handleSaveFormStep3 = async () => {
    console.log(other);
    let id = sessionStorage.getItem("applicantId");
    try {
      const data = await updateOtherInfo(id, other);
      setTimeout(() => {
        toast.success("Student Info successfully added!");
      }, 500);
      console.log(data);
    } catch (error) {
      console.error(error);
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
          value={other.langusedathome}
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
          value={other.nameofschattended}
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
          value={other.dateofschattended}
        />
        <TextArea
          gridWidth="col-span-6"
          label="Types of Illness (If any)"
          placeholder="Type here ..."
          onChange={(e) => {
            setOther({ ...other, illness: e.target.value });
          }}
          required={false}
          value={other.illness}
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
          value={other.docobservation}
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
          value={other.applotherinst}
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
              value={other.emergencycontacname}
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
              value={other.emergencycontactoffice}
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
              value={other.emergencycontacthome}
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
              value={other.emergencycontacthp}
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
              value={other.emergencyrelation}
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
          value={other.notes}
        />
        <div className="col-span-6 flex justify-between">
          <button className="btn btn-sm" onClick={() => handleSaveFormStep3()}>
            Save
          </button>
          <button className="btn btn-sm">Reset</button>
        </div>
      </div>
    </>
  );
};

export default Step3;
