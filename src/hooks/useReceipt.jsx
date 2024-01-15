import { useEffect, useState } from "react";
import axios from "axios";

const useReceipt = () => {
  const [receipt, setReceipt] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/receipt`
        );
        setReceipt(response.data);
        setTimeout(() => setLoading(false), 1000); // Delay setting loading to false by 1 second
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchReceipt();
  }, []);

  const fetchReceiptById = async (id) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/receipt/${id}`
      );
      return response;
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const printReceipt = async (receiptData) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/receipt/print`,
        { receiptData }
      );

      console.log(response.data);

      // Assuming the response contains the path to the saved file
      const filePath = response.data;

      // Remove the absolute path and keep only the path relative to the public directory
      const relativePath = filePath.replace("E:\\crud\\", "");

      // Open the file in a new window
      const win = window.open(
        `${window.location.origin}/${relativePath}`,
        "_blank"
      );

      // Print the file when the new window has loaded
      win.onload = function () {
        this.print();
        setLoading(false);
      };
    } catch (error) {
      console.error("Error printing receipt:", error);
      setLoading(false);
    }
  };

  function formatDateTime(isoString) {
    // Parse the ISO 8601 string into a Date object
    const date = new Date(isoString);

    // Get the day, month, and year
    const day = date.getUTCDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getUTCFullYear();

    // Get the time in HH:MM format
    const time =
      date.getUTCHours() + ":" + ("0" + date.getUTCMinutes()).slice(-2);

    // Combine the date and time into a string
    const dateTime = `${day} ${month} ${year} at ${time}`;

    return dateTime;
  }

  return {
    receipt,
    loading,
    error,
    fetchReceiptById,
    printReceipt,
    formatDateTime,
  };
};

export default useReceipt;
