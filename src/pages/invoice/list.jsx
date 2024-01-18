import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../components/Table";
import useInvoice from "../../hooks/useInvoice";
import { FiEdit, FiTrash } from "react-icons/fi";
import { useSelector } from "react-redux";

const InvoiceList = () => {
  // REDUX STATE
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // HOOK
  const { invoice, loading, error, softDeleteInvoice } = useInvoice();

  // COLUMNS
  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Invoice Ref",
        accessor: "salesinvref",
      },
      {
        Header: "Invoice Date",
        accessor: "salesinvdate",
        Cell: ({ row }) => {
          let newDate = new Date(row.original.salesinvdate)
            .toISOString()
            .split("T")[0];
          return newDate;
        },
      },
      {
        Header: "Amount",
        accessor: "salesamtincgst",
      },
      {
        Header: "Actions",
        Cell: ({ row }) => {
          const navigate = useNavigate();

          const handleEdit = (salesinvid) => {
            navigate(`/invoice/edit/${salesinvid}`);
          };

          const handleDelete = async (id) => {
            if (
              window.confirm("Are you sure you want to delete this contact?")
            ) {
              await softDeleteInvoice(id);
            }
          };

          return (
            <div className="flex gap-4">
              {isAuthenticated &&
                ["administrator", "invoiceSupervisor"].includes(
                  user.user.role
                ) && (
                  <button
                    className="btn btn-xs btn-square"
                    onClick={() => handleEdit(row.original.salesinvid)}
                  >
                    <FiEdit />
                  </button>
                )}

              {isAuthenticated &&
                ["administrator", "invoiceSupervisor"].includes(
                  user.user.role
                ) && (
                  <button
                    className="btn btn-xs btn-square"
                    onClick={() => handleDelete(row.original.salesinvid)}
                  >
                    <FiTrash />
                  </button>
                )}

              {isAuthenticated &&
                !["administrator", "invoiceSupervisor"].includes(
                  user.user.role
                ) && <p>No actions allowed.</p>}
            </div>
          );
        },
      },
    ],
    []
  );

  // REACT ROUTER DOM
  const navigate = useNavigate();

  // ACTIONS
  const handleAddButton = () => {
    navigate("/invoice/new");
  };
  return (
    <>
      <div className="p-4">
        <Table
          loading={loading}
          error={error}
          // 1
          title="Invoice List"
          shortDescription="List of Invoice Added"
          // 2
          // 3
          showArchive={false}
          // 4
          showAddButton={
            isAuthenticated &&
            ["administrator", "invoiceEntry", "invoiceSupervisor"].includes(
              user.user.role
            )
          }
          handleAddButton={handleAddButton}
          addButtonLabel="Add Invoice"
          // 5
          columns={columns}
          data={invoice}
          // 6
        />
      </div>
    </>
  );
};

export default InvoiceList;
