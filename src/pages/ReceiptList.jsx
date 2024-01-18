import { useEffect, useMemo, useState } from "react";
import useReceipt from "../hooks/useReceipt";
import Table from "../components/Table";
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ReceiptList = () => {
  // REDUX STATE
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // HOOK
  const {
    receipt,
    loading,
    error,
    fetchReceiptById,
    printReceipt,
    formatDateTime,
  } = useReceipt();

  // VIEW
  const [selectedRow, setSelectedRow] = useState({});
  const [shouldPrint, setShouldPrint] = useState(false);

  useEffect(() => {
    if (selectedRow && shouldPrint) {
      console.log(selectedRow);
      printReceipt(selectedRow);
      setShouldPrint(false); // Reset after printing
    }
  }, [selectedRow, shouldPrint]);

  const handleView = (row) => {
    setSelectedRow({ rchd: row });
    document.getElementById("viewDetails").showModal();
    fetchReceiptById(row.rcid).then((response) => {
      setSelectedRow((prevState) => ({
        ...prevState,
        rcDetails: response.data,
      }));
    });
  };

  const handlePrint = async (row) => {
    setSelectedRow({ rchd: row });
    try {
      const response = await fetchReceiptById(row.rcid);
      setSelectedRow((prevState) => ({
        ...prevState,
        rcDetails: response.data,
      }));
      setShouldPrint(true); // Set this to true after data is fetched
    } catch (error) {
      console.error("Error fetching receipt:", error);
    }
  };

  // COLUMNS
  const columns = useMemo(
    () => [
      {
        Header: "No",
        Cell: ({ row }) => row.index + 1,
      },
      {
        Header: "Receipt ID",
        accessor: "rcid",
      },
      {
        Header: "Receipt Date",
        accessor: "rcdate",
        Cell: ({ row }) => {
          let newDate = new Date(row.original.rcdate)
            .toISOString()
            .split("T")[0];
          return newDate;
        },
      },
      {
        Header: "Receipt From",
        accessor: "name",
      },
      {
        Header: "Type",
        accessor: "rctype",
        Cell: ({ row }) => (
          <span className="uppercase">{row.original.rctype}</span>
        ),
      },
      {
        Header: "Amount",
        accessor: "rcamt",
        Cell: ({ row }) => {
          const formattedAmount = new Intl.NumberFormat("en-SG", {
            style: "currency",
            currency: "SGD",
          }).format(row.original.rcamt);

          return formattedAmount;
        },
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="flex gap-4">
            {isAuthenticated &&
              ["administrator", "receiptEntry", "receiptSupervisor"].includes(
                user.user.role
              ) && (
                <button
                  className="btn btn-xs"
                  onClick={() => handleView(row.original)}
                >
                  View
                </button>
              )}

            {isAuthenticated &&
              ["administrator", "receiptEntry", "receiptSupervisor"].includes(
                user.user.role
              ) && (
                <button
                  className="btn btn-xs"
                  onClick={() => handlePrint(row.original)}
                >
                  Print
                </button>
              )}

            {isAuthenticated &&
              !["administrator", "receiptEntry", "receiptSupervisor"].includes(
                user.user.role
              ) && <p>No actions allowed.</p>}
          </div>
        ),
      },
    ],
    []
  );

  // REACT ROUTER DOM
  const navigate = useNavigate();

  // ACTIONS
  const handleAddButton = () => {
    navigate("/receipt/new");
  };
  return (
    <>
      <div className="p-4">
        <Table
          loading={loading}
          error={error}
          // 1
          title="Receipt List"
          shortDescription="List of Receipt Added"
          // 2
          // 3
          showArchive={false}
          // 4
          showAddButton={
            isAuthenticated &&
            ["administrator", "receiptEntry", "receiptSupervisor"].includes(
              user.user.role
            )
          }
          handleAddButton={handleAddButton}
          addButtonLabel="Add Receipt"
          // 5
          columns={columns}
          data={receipt}
          // 6
        />
      </div>
      <Modal id="viewDetails">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-px">
            <h3 className="font-bold text-xl">Madrasah Al-Ma'arif Al-Islami</h3>
            <p>No. 3 Lorong 39 Geylang Singapore 387865</p>
            <a
              href="https://alma'arif.edu.sg"
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              alma'arif.edu.sg
            </a>
          </div>
          <div className="flex flex-col gap-px">
            <h3 className="font-bold text-lg">Official Receipt</h3>
            <p className="flex justify-between">
              <span>Receipt From:</span>
              <span className="font-bold">
                {selectedRow && selectedRow.rchd && selectedRow.rchd.name}
              </span>
            </p>
            <p className="flex justify-between">
              <span>Receipt Number:</span>
              {selectedRow && selectedRow.rchd && selectedRow.rchd.rcid}
            </p>
            <p className="flex justify-between">
              <span>Receipt Date:</span>
              {selectedRow &&
                selectedRow.rchd &&
                formatDateTime(selectedRow.rchd.rcdate)}
            </p>
            <p className="flex justify-between">
              Payment Mode:
              <span className="capitalize">
                {selectedRow && selectedRow.rchd && selectedRow.rchd.rctype}
              </span>
            </p>
            <p className="flex justify-between">
              <span>Received By:</span>
              <span>Administrator</span>
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ReceiptList;
