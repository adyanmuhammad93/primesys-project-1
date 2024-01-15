import { useState } from "react";
import TextInput from "../../components/TextInput";
import SelectOption from "../../components/SelectOption";
import { accountCodes } from "../../utils/accountCodes";
import { gstCodes } from "../../utils/gstCodes";
import { AiOutlineClose } from "react-icons/ai";
import { categoryCodes } from "../../utils/categoryCodes";
import axios from "axios";
import TextInputLookUpWithOTF from "../../components/TextInputLookUpWithOTF";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const InvoiceNew = () => {
  // HOOK

  // INVOICE HEADER
  const [invoiceHeader, setInvoiceHeader] = useState({
    to: "",
    issueDate: "",
    dueDate: "",
    invoiceNumber: "",
    reference: "",
  });
  const [invoiceHeaderIsValid, setInvoiceHeaderIsValid] = useState(true);
  const [invoiceHeaderErrorMessages, setInvoiceHeaderErrorMessages] = useState({
    to: "",
    issueDate: "",
    invoiceNumber: "",
  });

  const addContactId = (selectedItem) => {
    setInvoiceHeader({ ...invoiceHeader, to: selectedItem.contactid });
  };

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

  const deleteRow = (id) => {
    if (invoiceDetails.length > 1) {
      const newData = invoiceDetails.filter((item) => item.id !== id);
      setInvoiceDetails(newData);
    }
  };

  const addRow = () => {
    const newRow = {
      id: invoiceDetails.length + 1,
      accode: "", // required
      details: "", // required
      rcamount: 0, // required
      gst: 0,
      jobid: "",
      subTotal: 0,
    };
    setInvoiceDetails([...invoiceDetails, newRow]);
  };

  // SAVE
  const navigate = useNavigate();
  const handleSave = async () => {
    try {
      if (
        !invoiceHeader.to ||
        !invoiceHeader.issueDate ||
        !invoiceHeader.invoiceNumber
      ) {
        alert("Please fill in all required fields in the header.");
        setInvoiceHeaderIsValid(false);
        return;
      }

      const isDetailsValid = invoiceDetails.every(
        (detail) => detail.accode && detail.details && detail.invoiceAmount > 0
      );

      if (!isDetailsValid) {
        alert("Please fill in all required fields in the details section.");
        setInvoiceDetailsIsValid(false);
        return;
      }

      const dataToSave = {
        invoiceHeaderData: {
          to: invoiceHeader.to,
          issueDate: invoiceHeader.issueDate,
          invoiceNumber: invoiceHeader.invoiceNumber,
          reference: invoiceHeader.reference,
        },
        invoiceDetailsData: invoiceDetails,
      };

      const res = await axios.post(
        "http://localhost:5000/invoice/save",
        dataToSave
      );

      console.log(res);
      console.log(res.data);
      // console.log(res.data);

      if (res.status === 200) {
        console.log("Receipt saved successfully!");
        // alert("Receipt saved successfully!");
        toast.success(res.data.message);
        setTimeout(() => navigate("/invoice"), 2000);
      }
    } catch (error) {
      console.log(error);
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
              placeholder="search here ..."
              required={true}
              inputClass={
                !invoiceHeaderIsValid && !invoiceHeader.to ? "input-error" : ""
              }
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
                console.log(e.target.value);
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
                    !invoiceDetailsIsValid && !row.details ? "input-error" : ""
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
                    !invoiceDetailsIsValid && !row.accode ? "select-error" : ""
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
          <div className="flex justify-between">
            <button className="btn btn-sm bg-white" onClick={addRow}>
              New Row
            </button>
            <span className="flex gap-4 text-3xl">
              <span>Total:</span>
              {CurrencyFormatter(calculateTotal())}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button className="btn btn-sm">Reset</button>
              <button
                className="btn btn-sm btn-error text-white"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
            <div>
              <button className="btn btn-sm" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceNew;
