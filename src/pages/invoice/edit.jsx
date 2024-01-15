import { useEffect, useState } from "react";
import TextInput from "../../components/TextInput";
import SelectOption from "../../components/SelectOption";
import { accountCodes } from "../../utils/accountCodes";
import { gstCodes } from "../../utils/gstCodes";
import { AiOutlineClose } from "react-icons/ai";
import { categoryCodes } from "../../utils/categoryCodes";
import axios from "axios";
import TextInputLookUpWithOTF from "../../components/TextInputLookUpWithOTF";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import useInvoice from "../../hooks/useInvoice";

const InvoiceEdit = () => {
  // REACT ROUTER DOM
  const { id } = useParams();

  // HOOK
  const {
    loading,
    fetchInvoiceHeader,
    fetchInvoiceDetails,
    softDeleteInvoiceDetail,
    updateInvoice,
  } = useInvoice();

  // Original values when loading the invoice details
  const [originalInvoiceHeader, setOriginalInvoiceHeader] = useState({});
  const [originalInvoiceDetails, setOriginalInvoiceDetails] = useState([]);

  const [invoiceDetailsChanged, setInvoiceDetailsChanged] = useState(false);

  // Latest
  const [salesinvlineids, setSalesinvlineids] = useState([]);

  useEffect(() => {
    const fetchData = async (id) => {
      try {
        const resHeader = await fetchInvoiceHeader(id);
        const resDetails = await fetchInvoiceDetails(id);

        setInvoiceHeader({
          to: resHeader.data[0].contactid,
          name: resHeader.data[0].name,
          issueDate: dateFormatter(resHeader.data[0].salesinvdate),
          dueDate: "",
          invoiceNumber: resHeader.data[0].salesinvref,
          reference: resHeader.data[0].salesinvmemo,
          salesinvid: resHeader.data[0].salesinvid,
        });

        setOriginalInvoiceHeader({
          to: resHeader.data[0].contactid,
          name: resHeader.data[0].name,
          issueDate: dateFormatter(resHeader.data[0].salesinvdate),
          dueDate: "",
          invoiceNumber: resHeader.data[0].salesinvref,
          reference: resHeader.data[0].salesinvmemo,
          salesinvid: resHeader.data[0].salesinvid,
        });

        // Create a new array that matches the structure of invoiceDetails
        const newInvoiceDetails = resDetails.data.map((detail) => ({
          id: detail.salesinvlineid,
          accode: detail.accode,
          details: detail.itemdetails,
          invoiceAmount: detail.price,
          gst: detail.taxcode,
          jobid: detail.jobid,
          subTotal: detail.amtinctax,
        }));

        // Create salesinvlineids array
        const newSalesinvlineids = resDetails.data.map(
          (detail) => detail.salesinvlineid
        );
        setSalesinvlineids(newSalesinvlineids); // Update the state

        setInvoiceDetails(newInvoiceDetails);
        setOriginalInvoiceDetails(newInvoiceDetails);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData(id);
  }, []);

  // INVOICE HEADER
  const [invoiceHeader, setInvoiceHeader] = useState({
    to: "",
    issueDate: "",
    dueDate: "",
    invoiceNumber: "",
    reference: "",
  });
  // const [invoiceHeaderIsValid, setInvoiceHeaderIsValid] = useState(true);

  const addContactId = (selectedItem) => {
    setInvoiceHeader({ ...invoiceHeader, to: selectedItem.contactid });
  };

  function dateFormatter(dateString) {
    let date = new Date(dateString);
    let formattedDate = date.toISOString().slice(0, 10);
    return formattedDate;
  }

  // INVOICE DETAILS
  const [invoiceDetails, setInvoiceDetails] = useState([
    {
      id: 1,
      accode: "", // required
      details: "", // required
      invoiceAmount: 0, // required
      gst: 0,
      jobid: "",
      subTotal: 0,
    },
  ]);
  const [invoiceDetailsIsValid, setInvoiceDetailsIsValid] = useState(true);

  const calculateSubTotal = (amount, tax) => {
    return Number(amount) + Number(amount) * Number(tax);
  };

  const calculateTotal = () => {
    const total = invoiceDetails.reduce((acc, item) => acc + item.subTotal, 0);
    return total;
  };

  function CurrencyFormatter(amount) {
    const formattedAmount = new Intl.NumberFormat("en-SG", {
      style: "currency",
      currency: "SGD",
    }).format(amount);

    return formattedAmount;
  }

  // const deleteRow = (id) => {
  //   const newData = invoiceDetails.filter((item) => item.id !== id);
  //   setInvoiceDetails(newData);
  // };

  const deleteRow = (id) => {
    const newData = invoiceDetails.filter((item) => item.id !== id);
    setInvoiceDetails(newData);

    // Check if the deleted row is the last one
    if (newData.length === 0 || id === newData[newData.length - 1].id) {
      addRow();
    }
  };

  const addRow = () => {
    const newRow = {
      id: invoiceDetails.length + 1,
      accode: "", // required
      details: "", // required
      invoiceAmount: 0, // required
      gst: 0,
      jobid: "",
      subTotal: 0,
    };
    setInvoiceDetails([...invoiceDetails, newRow]);
  };

  const navigate = useNavigate();

  // Validation states
  const [isDetailsValid, setIsDetailsValid] = useState(true);
  const [invoiceHeaderIsValid, setInvoiceHeaderIsValid] = useState(false);

  // Validation functions
  const validateDetails = () => {
    const isValid = invoiceDetails.every(
      (item) =>
        item.details &&
        item.accode &&
        (item.invoiceAmount || item.invoiceAmount === 0)
    );

    setIsDetailsValid(isValid);
  };

  const validateHeader = () => {
    const isValid =
      invoiceHeader.to &&
      invoiceHeader.issueDate &&
      invoiceHeader.invoiceNumber;

    setInvoiceHeaderIsValid(isValid);
  };

  // SAVE
  const validateInvoiceHeader = () => {
    return (
      invoiceHeader.to && invoiceHeader.issueDate && invoiceHeader.invoiceNumber
    );
  };

  const validateInvoiceDetails = () => {
    return (
      invoiceDetails &&
      invoiceDetails.every(
        (item) => item.details && item.accode && item.invoiceAmount
      )
    );
  };

  const handleSave = async () => {
    if (!validateInvoiceHeader()) {
      toast.error("Please fill in all details for each line.");
      return;
    }

    if (!validateInvoiceDetails()) {
      toast.error("Please fill in all details for each line.");
      return;
    }

    // validateDetails();
    // validateHeader();

    if (!isDetailsValid || !invoiceHeaderIsValid) {
      toast.error("Please fill in all required fields before saving.");
      return;
    }

    try {
      const dataToUpdate = {
        id: invoiceHeader.salesinvid,
        invoiceHeaderData: {
          to: invoiceHeader.to,
          issueDate: invoiceHeader.issueDate,
          invoiceNumber: invoiceHeader.invoiceNumber,
          reference: invoiceHeader.reference,
          salesinvid: invoiceHeader.salesinvid,
        },
        invoiceDetailsData: invoiceDetails,
        salesinvlineids,
      };

      console.log("API Request Payload:", dataToUpdate);

      const res1 = await axios.put(
        `${import.meta.env.VITE_API_URL}/invoice/update/${
          invoiceHeader.salesinvid
        }`,
        dataToUpdate
      );

      console.log(res1);
      navigate("/invoice");
    } catch (error) {
      console.log("API Request Error:", error.request);
      console.log("API Response Error:", error.response);
      console.log("Other Error:", error);
    }
  };

  // CANCEL
  const handleCancel = () => {
    if (
      window.confirm(
        "By canceling the operation you will lost all of changes, is it okay?"
      )
    ) {
      navigate("/invoice");
    }
  };

  return (
    <>
      <Toaster />
      <div className="p-4">
        <div className="flex flex-col gap-4 min-h-[calc(100vh-104px)]">
          {/* INVOICE HEADER */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 w-full">
            <TextInputLookUpWithOTF
              label="To"
              apiURL={`${import.meta.env.VITE_API_URL}/contact`}
              onSelect={addContactId}
              placeholder={
                (invoiceHeader && invoiceHeader.name) || "search here ..."
              }
              required={true}
              inputClass={
                !invoiceHeaderIsValid && !invoiceHeader.to ? "input-error" : ""
              }
              // value={invoiceHeader[0] && invoiceHeader[0]?.contactid}
            />
            <TextInput
              gridWidth="col-span-1"
              label="Issue Date"
              type="date"
              onChange={(e) => {
                setInvoiceHeader({
                  ...invoiceHeader,
                  issueDate: e.target.value,
                });
                console.log(e.target.value);
              }}
              required={true}
              value={invoiceHeader.issueDate}
              inputClass={
                !invoiceHeaderIsValid && !invoiceHeader.issueDate
                  ? "input-error"
                  : ""
              }
            />
            <TextInput
              gridWidth="col-span-1"
              label="Due Date"
              type="date"
              onChange={(e) => {
                setInvoiceHeader({
                  ...invoiceHeader,
                  dueDate: e.target.value,
                });
                console.log(e.target.value);
              }}
              required={false}
              value={invoiceHeader.dueDate}
            />
            <TextInput
              gridWidth="col-span-1"
              label="Invoice Number"
              type="text"
              placeholder="type here ..."
              onChange={(e) => {
                setInvoiceHeader({
                  ...invoiceHeader,
                  invoiceNumber: e.target.value,
                });
              }}
              required={true}
              value={invoiceHeader.invoiceNumber}
              inputClass={
                !invoiceHeaderIsValid && !invoiceHeader.invoiceNumber
                  ? "input-error"
                  : ""
              }
            />
            <TextInput
              gridWidth="col-span-1"
              label="Reference"
              type="text"
              placeholder="type here ..."
              onChange={(e) => {
                setInvoiceHeader({
                  ...invoiceHeader,
                  reference: e.target.value,
                });
                console.log(e.target.value);
              }}
              required={false}
              value={invoiceHeader.reference}
            />
          </div>

          {/* INVOICE DETAILS */}
          {loading === true ? (
            <span className="loading loading-spinner loading-md"></span>
          ) : invoiceDetails.length === 0 ? (
            "No Data"
          ) : (
            <div className="grow overflow-x-scroll flex flex-col gap-1 rounded-lg p-1">
              <div className="grid grid-cols-6 gap-1 w-full min-w-[1100px]">
                <span className="col-span-2 px-4 py-2 text-sm bg-slate-50 border border-white rounded-lg">
                  Description *
                </span>
                <span className="px-4 py-2 text-sm bg-slate-50 border border-white rounded-lg">
                  Account *
                </span>
                <span className="px-4 py-2 text-sm bg-slate-50 border border-white rounded-lg">
                  GST Code
                </span>
                <span className="px-4 py-2 text-sm bg-slate-50 border border-white rounded-lg">
                  Amount *
                </span>
                <span className="px-4 py-2 text-sm bg-slate-50 border border-white rounded-lg">
                  Category
                </span>
              </div>
              {invoiceDetails.map((row) => (
                <div
                  className="grid grid-cols-6 gap-1 w-full min-w-[1100px]"
                  key={row.id}
                >
                  <TextInput
                    gridWidth="col-span-2"
                    type="text"
                    placeholder="add description here ..."
                    onChange={(e) => {
                      const updatedData = invoiceDetails.map((item) =>
                        item.id === row.id
                          ? { ...item, details: e.target.value }
                          : item
                      );
                      setInvoiceDetails(updatedData);
                    }}
                    value={row.details}
                    required={true}
                    inputClass={
                      !invoiceDetailsIsValid && !row.details
                        ? "input-error"
                        : ""
                    }
                  />
                  <SelectOption
                    gridWidth="col-span-1"
                    options={accountCodes}
                    placeholder="Choose one!"
                    onChange={(e) => {
                      const updatedData = invoiceDetails.map((item) =>
                        item.id === row.id
                          ? { ...item, accode: e.target.value }
                          : item
                      );
                      setInvoiceDetails(updatedData);
                    }}
                    value={row.accode}
                    required={true}
                    inputClass={
                      !invoiceDetailsIsValid && !row.accode
                        ? "select-error"
                        : ""
                    }
                  />
                  <SelectOption
                    gridWidth="col-span-1"
                    options={gstCodes}
                    placeholder="Choose one!"
                    onChange={(e) => {
                      const updatedData = invoiceDetails.map((item) =>
                        item.id === row.id
                          ? {
                              ...item,
                              gst: e.target.value,
                              subTotal: calculateSubTotal(
                                item.invoiceAmount,
                                e.target.value
                              ),
                            }
                          : item
                      );
                      setInvoiceDetails(updatedData);
                    }}
                    value={row.gst}
                  />
                  <TextInput
                    gridWidth="col-span-1"
                    type="number"
                    placeholder="add amount"
                    onChange={(e) => {
                      const updatedData = invoiceDetails.map((item) =>
                        item.id === row.id
                          ? {
                              ...item,
                              invoiceAmount: e.target.value,
                              subTotal: calculateSubTotal(
                                e.target.value,
                                item.gst
                              ),
                            }
                          : item
                      );
                      setInvoiceDetails(updatedData);
                    }}
                    value={row.invoiceAmount}
                    min={1}
                    required={true}
                    inputClass={
                      !invoiceDetailsIsValid && !row.invoiceAmount
                        ? "input-error"
                        : ""
                    }
                  />
                  <div className="flex items-center justify-between gap-4">
                    <SelectOption
                      gridWidth="col-span-1"
                      options={categoryCodes}
                      placeholder="Choose one!"
                      onChange={(e) => {
                        const updatedData = invoiceDetails.map((item) =>
                          item.id === row.id
                            ? { ...item, jobid: e.target.value }
                            : item
                        );
                        setInvoiceDetails(updatedData);
                      }}
                      value={row.jobid}
                    />
                    <button
                      className="btn btn-xs btn-error btn-square"
                      onClick={() => deleteRow(row.id)}
                    >
                      <AiOutlineClose className="text-white" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <button
                className="btn btn-sm bg-white"
                onClick={() => addRow(id)}
              >
                New Row <br />
              </button>
              <span className="text-xs text-red-500">
                {invoiceDetailsChanged &&
                  `Please click "Save Changes" first before add new row!`}
              </span>
            </div>
            <span className="flex gap-4 text-3xl">
              <span>Total:</span>
              {CurrencyFormatter(calculateTotal())}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <button
                className="btn btn-sm btn-error text-white"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
            <div>
              <button
                className="btn btn-sm bg-success text-white"
                onClick={handleSave}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceEdit;
