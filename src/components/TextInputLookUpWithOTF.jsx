import React, { useEffect, useState } from "react";
import TextInput from "./TextInput";
import useContact from "../hooks/useContact";
import toast, { Toaster } from "react-hot-toast";

const TextInputLookUpWithOTF = ({
  label,
  apiURL,
  onSelect,
  value,
  placeholder,
  required,
  inputClass,
}) => {
  // HOOK
  const { loading, addContact } = useContact();

  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showAddNew, setShowAddNew] = useState(false);
  const [place, setPlace] = useState("");

  const handleSearch = (text) => {
    setPlace(text);
    setSearchText(text);
    setShowAddNew(false);
    // Fetch data from the API
    fetch(apiURL)
      .then((response) => response.json())
      .then((data) => {
        // Filter the data based on the search text
        const filteredData = data.filter(
          (item) =>
            (item.name &&
              item.name.toLowerCase().includes(text.toLowerCase())) ||
            (item.hpnumber &&
              item.hpnumber.toLowerCase().includes(text.toLowerCase())) ||
            (item.phonenumber &&
              item.phonenumber.toLowerCase().includes(text.toLowerCase()))
        );

        // Limit the suggestions to 10
        const limitedData = filteredData.slice(0, 10);
        // Update the suggestions
        setSuggestions(limitedData);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    // No initial suggestions
    setSuggestions([]);
  }, []);

  const handleSelect = (selectedItem) => {
    console.log(selectedItem.contactid);
    setPlace(selectedItem.name);
    setSearchText(selectedItem.name);
    setSuggestions([]);
    // Call the onSelect callback with the selected item
    onSelect(selectedItem);
    setSearchText("");
    setShowAddNew(false);
  };

  const handleAddNew = () => {
    setShowAddNew(true);
  };

  const handleClose = () => {
    setSearchText("");
    setSuggestions([]);
    setShowAddNew(false);
  };

  const [contact, setContact] = useState({
    idno: "",
    name: "",
    dob: "",
    nationality: "",
    hpnumber: "",
    address1: "",
  });

  const resetContact = () => {
    setContact({
      idno: "",
      name: "",
      dob: "",
      nationality: "",
      hpnumber: "",
      address1: "",
    });
  };

  const saveContact = async () => {
    try {
      await addContact(contact);
      toast.success("Contact successfully added!");
      setTimeout(() => {
        handleClose();
        resetContact();
      }, 2000);
    } catch (error) {
      toast.error("Failed to save contact!");
    }
  };

  return (
    <>
      <TextInput
        label={label}
        type="text"
        placeholder={placeholder}
        onChange={(e) => handleSearch(e.target.value)}
        required={required}
        value={place || searchText || value}
        inputClass={inputClass}
      />
      <div className="suggestion-box border border-gray-300 rounded-xl bg-white absolute top-44 top w-[320px] z-10 overflow-hidden shadow-xl">
        {suggestions.length > 0 && searchText.length > 0 && (
          <ul>
            {suggestions.map((item, index) => (
              <li
                key={index}
                className="cursor-pointer px-4 py-2 hover:bg-gray-100 text-sm"
                onClick={() => handleSelect(item)}
              >
                {item.name}
                <br />
                {item.hpnumber} - {item.phonenumber}
              </li>
            ))}
          </ul>
        )}
        {suggestions.length === 0 && searchText.length > 0 && !showAddNew && (
          <>
            <div className="p-4 flex items-center justify-between gap-2">
              <span>no contact found ...</span>
              <button onClick={handleAddNew} className="btn btn-sm">
                + new contact
              </button>
            </div>
          </>
        )}
        {showAddNew && (
          <>
            <div className="p-4 grid grid-cols-2 gap-2 relative">
              <Toaster />
              <TextInput
                gridWidth="col-span-2"
                type="text"
                placeholder="ID Number"
                inputClass="input-sm"
                onChange={(e) => {
                  setContact({ ...contact, idno: e.target.value });
                }}
                value={contact.idno}
                disabled={loading}
              />
              <TextInput
                gridWidth="col-span-2"
                type="text"
                placeholder="Name"
                inputClass="input-sm"
                onChange={(e) => {
                  setContact({ ...contact, name: e.target.value });
                }}
                value={contact.name}
                disabled={loading}
              />
              <TextInput
                gridWidth="col-span-2"
                type="date"
                placeholder="Date of Birth"
                inputClass="input-sm"
                onChange={(e) => {
                  setContact({ ...contact, dob: e.target.value });
                }}
                value={contact.dob}
                disabled={loading}
              />
              <TextInput
                gridWidth="col-span-2"
                type="text"
                inputClass="input-sm"
                placeholder="Nationality"
                onChange={(e) => {
                  setContact({ ...contact, nationality: e.target.value });
                }}
                value={contact.nationality}
                disabled={loading}
              />
              <TextInput
                gridWidth="col-span-2"
                type="text"
                inputClass="input-sm"
                placeholder="Phone Number"
                onChange={(e) => {
                  setContact({ ...contact, hpnumber: e.target.value });
                }}
                value={contact.hpnumber}
                disabled={loading}
              />
              <TextInput
                gridWidth="col-span-2"
                type="text"
                inputClass="input-sm"
                placeholder="Address"
                onChange={(e) => {
                  setContact({ ...contact, address1: e.target.value });
                }}
                value={contact.address1}
                disabled={loading}
              />
              <button
                className="btn btn-sm"
                onClick={saveContact}
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Save"
                )}
              </button>
              <button
                className="btn btn-sm"
                onClick={handleClose}
                disabled={loading}
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default TextInputLookUpWithOTF;
