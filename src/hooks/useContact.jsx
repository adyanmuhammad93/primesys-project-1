import { useEffect, useState } from "react";
import axios from "axios";

const useContact = () => {
  const [contact, setContact] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContact();
  }, []);

  const fetchContact = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/contact`
      );
      setContact(response.data);
      setTimeout(() => setLoading(false), 2000); // Delay setting loading to false by 1 second
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const getContactById = async (id) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/contact/${id}`
      );
      console.log(response);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const addContact = async (contact) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/contact`,
        contact
      );
      setTimeout(() => setLoading(false), 2000); // Delay setting loading to false by 1 second
      console.log(response);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const addStudent = async (student) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/student`,
        student
      );
      fetchContact(); // Refresh the contact list after adding a student
      return response.data;
    } catch (error) {
      setError(error);
    }
  };

  const updateStudent = async (student) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/student`,
        student
      );
      setLoading(false);
      fetchContact(); // Refresh the contact list after adding a student
      return response.data;
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const addGuardian = async (guardian) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/guardian`,
        guardian
      );
      fetchContact(); // Refresh the contact list after adding a guardian
      return response.data;
    } catch (error) {
      setError(error);
    }
  };

  const addRelationship = async (relationship) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/add-relationship`,
        relationship
      );
      fetchContact(); // Refresh the contact list after adding a relationship
      return response.data;
    } catch (error) {
      setError(error);
    }
  };

  const getContactRelate = async (id) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/contactrelate/${id}`
      );
      console.log("response for contactrelate", response.data);
      return response.data;
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const updateOtherInfo = async (id, updatedOtherInfo) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/other-info/${id}`,
        updatedOtherInfo
      );
      fetchContact(); // Refresh the contact list after updating a contact
      return response.data;
    } catch (error) {
      setError(error);
    }
  };

  const checkRegistration = async (idToCheck) => {
    try {
      const response = await fetch("http://localhost:5000/checkRegistration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToCheck }),
      });

      const data = await response.json();
      return data.isRegistered;
    } catch (error) {
      console.error("Error checking registration:", error);
    }
  };

  const softDeleteContact = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/contact/${id}`);
      fetchContact(); // Fetch the contacts again to update the state
    } catch (error) {
      setError(error);
    }
  };

  return {
    contact,
    loading,
    error,
    getContactById,
    addStudent,
    addContact,
    updateStudent,
    addGuardian,
    addRelationship,
    getContactRelate,
    updateOtherInfo,
    checkRegistration,
    softDeleteContact,
  };
};

export default useContact;
