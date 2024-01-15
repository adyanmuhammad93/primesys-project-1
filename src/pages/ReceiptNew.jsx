import React, { useState, useEffect } from "react";
import TextInput from "../components/TextInput";
import TextInputLookUp from "../components/TextInputLookUp";
import SelectOption from "../components/SelectOption";
import { receiptType } from "../utils/receiptType";
import { accountCodes } from "../utils/accountCodes";
import { gstCodes } from "../utils/gstCodes";
import { AiOutlineClose } from "react-icons/ai";
import { Dialog, Transition } from "@headlessui/react";
import { categoryCodes } from "../utils/categoryCodes";
import useReceipt from "../hooks/useReceipt";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ReceiptNew = () => {
  const navigate = useNavigate();

  // HOOK
  const { fetchReceiptById, printReceipt } = useReceipt();

  // receiptHeader
  const [receiptHeader, setReceiptHeader] = useState({
    contactId: "",
    rctype: "",
    rcref: "",
    rcamt: "",
    rcdate: "",
  });

  // Callback function to update teacherId in the state
  const addContactId = (selectedItem) => {
    setReceiptHeader({ ...receiptHeader, contactId: selectedItem.contactid });
  };

  //
  const [paymentData, setPaymentData] = useState([]);
  const [salesInvoices, setSalesInvoices] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (receiptHeader.contactId !== "") {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/invoice/${receiptHeader.contactId}`
          );
          setSalesInvoices(response.data);
          console.log(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    // setSalesInvoices([]); // Note: I commented this line because it seems unnecessary
  }, [receiptHeader.contactId]);

  //

  // receiptDetails
  const [rcDetails, setRcDetails] = useState([
    {
      id: 1,
      accode: "", // required
      details: "", // required
      rcamount: 0, // required
      gst: 0,
      jobid: "",
      subTotal: 0,
    },
  ]);

  const calculateSubTotal = (amount, tax) => {
    return Number(amount) + Number(amount) * Number(tax);
  };

  const calculateTotal = () => {
    const total = rcDetails.reduce((acc, item) => acc + item.subTotal, 0);
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
    if (rcDetails.length > 1) {
      const newData = rcDetails.filter((item) => item.id !== id);
      setRcDetails(newData);
    }
  };

  const addRow = () => {
    const newRow = {
      id: rcDetails.length + 1,
      accode: "", // required
      details: "", // required
      rcamount: 0, // required
      gst: 0,
      jobid: "",
      subTotal: 0,
    };
    setRcDetails([...rcDetails, newRow]);
  };

  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [temporerRCID, setTemporerRCID] = useState(0);

  // Handler for saving the entire receipt
  const handleSaveReceipt = async () => {
    try {
      // Perform validation checks
      // if (
      //   !receiptHeader.contactId ||
      //   !receiptHeader.rcdate ||
      //   !receiptHeader.rctype ||
      //   !receiptHeader.rcref ||
      //   !receiptHeader.rcamt
      // ) {
      //   alert("Please fill in all required fields in the header.");
      //   return;
      // }

      const isDetailsValid = rcDetails.every(
        (detail) => detail.accode && detail.details && detail.rcamount > 0
      );

      if (!isDetailsValid) {
        alert("Please fill in all required fields in the details section.");
        return;
      }

      // Prepare data for saving
      const dataToSave = {
        receiptHeaderData: {
          contactId: receiptHeader.contactId,
          rcdate: receiptHeader.rcdate,
          rctype: receiptHeader.rctype,
          rcref: receiptHeader.rcref,
          rcamt: receiptHeader.rcamt,
        },
        receiptDetailsData: rcDetails,
        paymentData: paymentData,
      };

      console.log(dataToSave);

      // Make a POST request to the Express API endpoint
      const response = await fetch(`http://localhost:5000/receipt/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSave),
      });

      // setTemporerRCID(response.rcid);
      console.log(response.rcid);

      // Handle the response from the server
      if (response.ok) {
        console.log("Receipt saved successfully!");
        alert("Receipt saved successfully!");

        // Open the print modal after successful save
        setIsPrintModalOpen(true);
      } else {
        console.error("Error saving receipt:", await response.json());
        alert("Error saving receipt. Please try again later.");
      }
    } catch (error) {
      console.error("Error saving receipt:", error);
      alert("Error saving receipt. Please try again later.");
    }
  };

  // Handler for closing the print modal
  const closePrintModal = () => {
    setIsPrintModalOpen(false);
  };

  const [selectedRow, setSelectedRow] = useState({});
  const [shouldPrint, setShouldPrint] = useState(false);

  const handlePrint = async () => {
    setSelectedRow({
      rchd: {
        rcid: temporerRCID,
        rcdate: receiptHeader.rcdate,
        rctype: receiptHeader.rctype,
        rcref: receiptHeader.rcref,
        rcamt: receiptHeader.rcamt,
      },
    });
    try {
      const response = await fetchReceiptById(temporerRCID);
      setSelectedRow((prevState) => ({
        ...prevState,
        rcDetails: response.data,
      }));
      setShouldPrint(true); // Set this to true after data is fetched
    } catch (error) {
      console.error("Error fetching receipt:", error);
    } finally {
      // Reset the form after a successful save
      setReceiptHeader({
        // rcid: 899,
        contactId: "",
        rctype: "",
        rcref: "",
        rcamt: "",
        rcdate: "",
      });
      setRcDetails([
        {
          id: 1,
          // rcid: 899,
          accode: "",
          details: "",
          rcamount: 0,
          gst: 0,
          jobid: "",
          subTotal: 0,
        },
        // Add more default detail objects as needed
      ]);
    }
  };

  useEffect(() => {
    if (selectedRow && shouldPrint) {
      printReceipt(selectedRow);
      setShouldPrint(false); // Reset after printing
    }
  }, [selectedRow, shouldPrint]);

  const handleCancel = () => {
    if (
      window.confirm(
        "By canceling the operation you will lost all of changes, is it okay?"
      )
    ) {
      navigate("/receipt");
    }
  };

  return (
    <>
      <div className="mx-auto py-4 w-[90%] max-w-[1200px]">
        <div className="flex flex-col gap-4 min-h-[calc(100vh-104px)]">
          {/* receiptHeader */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 w-full">
            <TextInputLookUp
              label="Received From"
              apiURL={`${import.meta.env.VITE_API_URL}/contact`}
              onSelect={addContactId}
              placeholder="search here ..."
            />
            <SelectOption
              gridWidth="col-span-1"
              label="Type"
              options={receiptType}
              placeholder="Choose one!"
              onChange={(e) => {
                console.log(e.target.value);
                setReceiptHeader({ ...receiptHeader, rctype: e.target.value });
              }}
              required={true}
              value={receiptHeader.rctype}
            />
            <TextInput
              gridWidth="col-span-1"
              label="Reference"
              type="text"
              placeholder="type here ..."
              onChange={(e) =>
                setReceiptHeader({ ...receiptHeader, rcref: e.target.value })
              }
              required={true}
              value={receiptHeader.rcref}
            />
            <TextInput
              gridWidth="col-span-1"
              label="Amount"
              type="number"
              placeholder="minimum "
              onChange={(e) =>
                setReceiptHeader({ ...receiptHeader, rcamt: e.target.value })
              }
              required={true}
              value={receiptHeader.rcamt}
              min={1}
            />
            <TextInput
              gridWidth="col-span-1"
              label="Date"
              type="date"
              onChange={(e) => {
                setReceiptHeader({ ...receiptHeader, rcdate: e.target.value });
                console.log(e.target.value);
              }}
              required={true}
              value={receiptHeader.rcdate}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          {/* receiptDetails */}
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
            {rcDetails.map((row) => (
              <div
                className="grid grid-cols-6 gap-1 w-full min-w-[1100px]"
                key={row.id}
              >
                <TextInput
                  gridWidth="col-span-2"
                  type="text"
                  placeholder="add description here ..."
                  onChange={(e) => {
                    const updatedData = rcDetails.map((item) =>
                      item.id === row.id
                        ? { ...item, details: e.target.value }
                        : item
                    );
                    setRcDetails(updatedData);
                  }}
                  value={row.details}
                  required={true}
                />
                <SelectOption
                  gridWidth="col-span-1"
                  options={accountCodes}
                  placeholder="Choose one!"
                  onChange={(e) => {
                    const updatedData = rcDetails.map((item) =>
                      item.id === row.id
                        ? { ...item, accode: e.target.value }
                        : item
                    );
                    setRcDetails(updatedData);
                  }}
                  value={row.accode}
                  required={true}
                />
                <SelectOption
                  gridWidth="col-span-1"
                  options={gstCodes}
                  placeholder="Choose one!"
                  onChange={(e) => {
                    const updatedData = rcDetails.map((item) =>
                      item.id === row.id
                        ? {
                            ...item,
                            gst: e.target.value,
                            subTotal: calculateSubTotal(
                              item.rcamount,
                              e.target.value
                            ),
                          }
                        : item
                    );
                    setRcDetails(updatedData);
                  }}
                  value={row.gst}
                />
                <TextInput
                  gridWidth="col-span-1"
                  type="number"
                  placeholder="add amount"
                  onChange={(e) => {
                    const updatedData = rcDetails.map((item) =>
                      item.id === row.id
                        ? {
                            ...item,
                            rcamount: e.target.value,
                            subTotal: calculateSubTotal(
                              e.target.value,
                              item.gst
                            ),
                          }
                        : item
                    );
                    setRcDetails(updatedData);
                  }}
                  value={row.rcamount}
                  min={1}
                  required={true}
                />
                <div className="flex items-center justify-between gap-4">
                  <SelectOption
                    gridWidth="col-span-1"
                    options={categoryCodes}
                    placeholder="Choose one!"
                    onChange={(e) => {
                      const updatedData = rcDetails.map((item) =>
                        item.id === row.id
                          ? { ...item, jobid: e.target.value }
                          : item
                      );
                      setRcDetails(updatedData);
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

          {/* paymentData */}
          <div className="grow overflow-x-scroll flex flex-col gap-1 rounded-lg p-1">
            <div className="grid grid-cols-6 gap-1 w-full min-w-[1100px]">
              <span className="px-4 py-2 text-sm bg-slate-50 border border-white rounded-lg">
                Date
              </span>
              <span className="px-4 py-2 text-sm bg-slate-50 border border-white rounded-lg">
                Reference
              </span>
              <span className="px-4 py-2 text-sm bg-slate-50 border border-white rounded-lg">
                Amount Due
              </span>
              <span className="px-4 py-2 text-sm bg-slate-50 border border-white rounded-lg">
                Amount OS
              </span>
              <span className="px-4 py-2 text-sm bg-slate-50 border border-white rounded-lg">
                To Pay
              </span>
              <span className="px-4 py-2 text-sm bg-slate-50 border border-white rounded-lg">
                Actions
              </span>
            </div>

            {salesInvoices &&
              salesInvoices.map((row, index) => (
                <div className="grid grid-cols-6 gap-1 w-full" key={index}>
                  <span className="px-4 py-2 text-sm bg-white border border-white rounded-lg">
                    {new Date(row.salesinvdate).toISOString().split("T")[0]}
                  </span>
                  <span className="px-4 py-2 text-sm bg-white border border-white rounded-lg">
                    {row.salesinvref}
                  </span>
                  <span className="px-4 py-2 text-sm bg-white border border-white rounded-lg">
                    {row.amtdue}
                  </span>
                  <span className="px-4 py-2 text-sm bg-white border border-white rounded-lg">
                    {row.amtos}
                  </span>
                  <TextInput
                    gridWidth="col-span-1"
                    type="number"
                    placeholder="add amount"
                    onChange={(e) => {
                      const amtpaidValue = parseFloat(e.target.value);
                      const updatedData = salesInvoices.map((item) =>
                        item.salesinvid === row.salesinvid
                          ? {
                              ...item,
                              amtpaid: amtpaidValue,
                            }
                          : item
                      );
                      setSalesInvoices(updatedData);
                    }}
                    value={row.amtpaid}
                    min={1}
                    required={true}
                  />
                  <span className="px-4 py-2 text-sm bg-white border border-white rounded-lg">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        const amtpaidValue = row.amtpaid || 0;
                        const amtosValue = row.amtos || 0;
                        const isChecked =
                          e.target.checked &&
                          (amtpaidValue > 0 || amtpaidValue === row.amtdue) &&
                          (amtosValue <= 0 ||
                            (amtpaidValue < amtosValue &&
                              amtpaidValue <= row.amtdue));

                        if (isChecked) {
                          // If the checkbox is checked and conditions are met, add the row to the paymentData
                          setPaymentData((prev) => [
                            ...prev,
                            {
                              ...row,
                              transactionDate: new Date(row.amtdue)
                                .toISOString()
                                .split("T")[0],
                            },
                          ]);
                        } else {
                          // If the checkbox is unchecked or conditions are not met, remove the row from the paymentData
                          setPaymentData((prev) =>
                            prev.filter((item) => item !== row)
                          );
                        }
                      }}
                      disabled={row.amtpaid < 0 || row.amtpaid > row.amtdue}
                    />
                    Pay
                  </span>
                </div>
              ))}
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
              <button
                className="btn btn-sm btn-success text-white"
                onClick={handleSaveReceipt}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Print Modal */}
      <Transition show={isPrintModalOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closePrintModal}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
            </Transition.Child>

            {/* This is your modal container. You can customize it according to your design */}
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white border rounded-lg shadow-xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Do you want to print or email the receipt?
                </Dialog.Title>
                <div className="mt-4">
                  <button
                    className="btn btn-sm mr-2"
                    onClick={() => {
                      handlePrint();
                      setIsPrintModalOpen(false);
                    }}
                  >
                    Print
                  </button>
                  <button
                    className="btn btn-sm"
                    onClick={() => {
                      // handleEmailReceipt();
                      setIsPrintModalOpen(false);
                    }}
                  >
                    Email
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ReceiptNew;
