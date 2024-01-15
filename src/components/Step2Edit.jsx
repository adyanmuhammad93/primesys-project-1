import React, { useEffect, useState } from "react";
import useContact from "../hooks/useContact";
import axios from "axios";

const Step2Edit = ({ selectedRow }) => {
  // HOOK
  const { getContactRelate } = useContact();

  //
  const [initialState, setInitialState] = useState(selectedRow);
  const [student, setStudent] = useState(selectedRow);

  const [relatedToIds, setRelatedToIds] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [relatedContacts, setRelatedContacts] = useState([]);

  useEffect(() => {
    const fetchRelatedContacts = async () => {
      const response = await getContactRelate(student.contactid);
      if (response.status === 500) {
        setError(response.message);
      } else {
        console.log(response);
        const relatedToIds = response.map((item) => item.relatedtoid);
        console.log(relatedToIds);
        for (const id of relatedToIds) {
          try {
            const res = await axios.get(
              `${import.meta.env.VITE_API_URL}/contact/${id}`
            );
            console.log(res);
            if (
              !relatedContacts.find(
                (contact) => contact.contactid === res.data.contactid
              )
            ) {
              setRelatedContacts((prevState) => [...prevState, res.data]);
            }
          } catch (err) {
            console.error(err); // handle the error as needed
          }
        }
      }
      setLoading(false);
    };

    fetchRelatedContacts();
  }, []);

  useEffect(() => {
    const getContactStatus = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/contact/${student.contactid}`
        );
        setData(res.data);
        console.log(res.data.relatedContacts);
      } catch (error) {
        console.log(error);
      }
    };
    getContactStatus();
  }, []);

  console.log(relatedContacts);

  // Assuming you're in a functional component
  const uniqueContacts = Array.from(
    new Set(relatedContacts.map((contact) => contact[0].contactid))
  ).map((contactid) => {
    return relatedContacts.find(
      (contact) => contact[0].contactid === contactid
    );
  });

  return (
    <>
      <div className="p-4 flex flex-col gap-4">
        {data && <span>This contact is {data.role}</span>}
        {data && data.relatedContacts
          ? data.relatedContacts.map((data, index) => (
              <div key={index} className="">
                {data.name}
              </div>
            ))
          : "There are no related contact."}
      </div>
      {/* <div>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : uniqueContacts.length > 0 ? (
          <div className="flex flex-col gap-4">
            {uniqueContacts.map((contact, index) => (
              <div key={index} className="collapse bg-base-200">
                <input type="radio" name="my-accordion-1" checked="checked" />
                <div className="collapse-title text-xl font-medium">
                  {contact[0].name} -{" "}
                  {contact[0].sex === "M" ? "Father" : "Mother"}
                </div>
                <div className="collapse-content">
                  <p>hello</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          "No contact related to this student."
        )}
      </div> */}
    </>
  );
};

export default Step2Edit;
