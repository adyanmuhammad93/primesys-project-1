import { useEffect, useState } from "react";
import axios from "axios";

const useInvoice = () => {
  const [invoice, setInvoice] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInvoice();
  }, []);

  const fetchInvoice = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/invoice`
      );
      setInvoice(response.data);
      setTimeout(() => setLoading(false), 1000); // Delay setting loading to false by 1 second
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const fetchInvoiceById = async (id) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/invoice/${id}`
      );
      return response;
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const fetchInvoiceHeader = async (id) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/invoice/${id}/invoice-header`
      );
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const fetchInvoiceDetails = async (id) => {
    setLoading(true);
    try {
      setTimeout(() => setLoading(false), 1000); // Delay setting loading to false by 1 second
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/invoice/${id}/invoice-details`
      );
      return response;
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const softDeleteInvoice = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/invoice/delete/${id}`
      );
      fetchInvoice();
    } catch (error) {
      console.error("Error soft deleting Invoice!", error);
    }
  };

  const softDeleteInvoiceDetail = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/invoice/delete/detail/${id}`
      );
    } catch (error) {
      console.error("Error soft deleting Invoice!", error);
    }
  };

  const updateInvoice = async (id, invoiceHeaderData, invoiceDetailsData) => {
    const headerValues = [
      invoiceHeaderData.to,
      invoiceHeaderData.issueDate,
      invoiceHeaderData.invoiceNumber,
      invoiceHeaderData.reference || null,
      invoiceHeaderData.salesinvid,
    ];

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/invoice/update/${id}`,
        {
          invoiceHeaderData,
          invoiceDetailsData,
        }
      );
      return response;
    } catch (error) {
      console.error("Error updating Invoice!", error);
    }
  };

  return {
    invoice,
    loading,
    error,
    fetchInvoiceById,
    fetchInvoiceHeader,
    fetchInvoiceDetails,
    softDeleteInvoice,
    softDeleteInvoiceDetail,
    updateInvoice,
  };
};

export default useInvoice;
