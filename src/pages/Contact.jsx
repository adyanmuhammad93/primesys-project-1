import { useEffect, useMemo, useState } from "react";
import useContact from "../hooks/useContact";
import Table from "../components/Table";
import { FiEdit, FiTrash } from "react-icons/fi";
import Modal from "../components/Modal";
import Stepper from "../components/Stepper";
import StepperEdit from "../components/StepperEdit";
import { useDispatch, useSelector } from "react-redux";
import { fetchContacts } from "../app/contactSlice";

const Contact = () => {
  // REDUX STATE
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // HOOK
  const {
    contact,
    loading,
    error,
    updateStudent,
    updateOtherInfo,
    softDeleteContact,
  } = useContact();

  // COLUMNS
  const columns = useMemo(
    () => [
      {
        Header: "No",
        Cell: ({ row }) => row.index + 1,
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Phone Number",
        accessor: "phonenumber",
      },
      {
        Header: "Date of Birth",
        accessor: "dob",
        Cell: ({ value }) => {
          // Format the date for Singapore (SG) locale
          return new Date(value).toLocaleDateString("en-SG");
        },
      },
      {
        Header: "Nationality",
        accessor: "nationality",
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="flex gap-4">
            {isAuthenticated &&
              ["contactEntry", "contactSupervisor"].includes(
                user.user.role
              ) && (
                <button
                  className="btn btn-xs btn-square"
                  onClick={() => handleEdit(row.original)}
                >
                  <FiEdit />
                </button>
              )}

            {isAuthenticated &&
              ["contactEntry", "contactSupervisor"].includes(
                user.user.role
              ) && (
                <button
                  className="btn btn-xs btn-square"
                  onClick={() => handleDelete(row.original.contactid)}
                >
                  <FiTrash />
                </button>
              )}

            {isAuthenticated &&
              !["contactEntry", "contactSupervisor"].includes(
                user.user.role
              ) && <p>No actions allowed.</p>}
          </div>
        ),
      },
    ],
    []
  );

  // ACTIONS
  const [selectedRow, setSelectedRow] = useState(null);

  const handleEdit = (row) => {
    setSelectedRow(row);
    // setIsEditModalOpen(true);
    document.getElementById("editContact").showModal();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      await softDeleteContact(id);
    }
  };

  return (
    <>
      <div className="p-4">
        <Table
          loading={loading}
          error={error}
          // 1
          title="Contact List"
          shortDescription="List of Contact Added"
          // 2
          // 3
          showArchive={false}
          // 4
          showAddButton={
            isAuthenticated &&
            ["contactEntry", "contactSupervisor"].includes(user.user.role)
          }
          handleAddButton={() =>
            document.getElementById("addContact").showModal()
          }
          addButtonLabel="Add Contact"
          // 5
          columns={columns}
          data={contact}
          // 6
        />
        <Modal id="addContact" initialStep={1}>
          <Stepper />
        </Modal>

        <Modal id="editContact">
          <StepperEdit
            selectedRow={selectedRow}
            updateStudent={updateStudent}
            updateOther={updateOtherInfo}
          />
        </Modal>
      </div>
    </>
  );
};

export default Contact;
