import React, { useEffect, useState } from "react";
import TextInput from "./TextInput";

const TextInputLookUp = ({ label, apiURL, onSelect, value, placeholder }) => {
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const handleSearch = (text) => {
    setSearchText(text);
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
    setSearchText(selectedItem.name);
    setSuggestions([]);
    // Call the onSelect callback with the selected item
    onSelect(selectedItem);
  };
  return (
    <>
      <TextInput
        label={label}
        type="text"
        placeholder={placeholder}
        onChange={(e) => handleSearch(e.target.value)}
        required={false}
        value={searchText || value}
      />
      {suggestions.length > 0 && searchText.length > 0 && (
        <ul className="border border-gray-300 rounded-xl bg-white absolute top-44 top w-[227px] z-10 overflow-hidden shadow-xl">
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
    </>
  );
};

export default TextInputLookUp;
