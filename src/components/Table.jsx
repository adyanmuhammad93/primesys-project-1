import React, { useState } from "react";
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";
import {
  FiChevronLeft,
  FiChevronsLeft,
  FiChevronRight,
  FiChevronsRight,
} from "react-icons/fi";
import TextInput from "./TextInput";

const Table = ({
  loading,
  error,
  //
  title,
  shortDescription,
  //
  showSearch = true,
  //
  showArchive = true,
  handleShowArchive,
  //
  showAddButton = true,
  handleAddButton,
  addButtonLabel,
  //
  columns,
  data,
  //
  showPagination = true,
}) => {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state: { globalFilter },
    setGlobalFilter,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const GlobalFilter = ({ globalFilter, setGlobalFilter }) => {
    const [value, setValue] = useState(globalFilter);

    const handleGlobalFilterChange = () => {
      setGlobalFilter(value || undefined);
    };

    return (
      <div className="flex items-center justify-center gap-4">
        <TextInput
          type="search"
          value={value || ""}
          onChange={(e) => setValue(e.target.value)}
          inputClass="input-sm input-bordered"
        />
        <button
          className="btn btn-sm btn-primary"
          onClick={handleGlobalFilterChange}
        >
          Search
        </button>
      </div>
    );
  };

  if (loading)
    return (
      <>
        <span className="loading loading-spinner"></span>
      </>
    );

  if (error) return <>Error: {error.message}</>;

  return (
    <>
      <div className="flex flex-col gap-4 min-h-[85vh]">
        {/* 1 */}
        <div className="flex flex-col gap-px">
          <h2 className="font-bold text-xl">{title}</h2>
          <p>{shortDescription}</p>
        </div>

        <div className="flex items-center justify-between">
          {/* 2 */}
          {showSearch && (
            <GlobalFilter
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
          )}
          <div className="flex items-center gap-4">
            {/* 3 */}
            {showArchive && (
              <div className="form-control">
                <label className="cursor-pointer label flex gap-4">
                  <span className="label-text">Show Archived Data</span>
                  {/* Use the state variable and event handler */}
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={showArchive}
                    onChange={handleShowArchive}
                  />
                </label>
              </div>
            )}
            {/* 4 */}
            {showAddButton && (
              <button
                className="btn btn-sm btn-primary"
                onClick={handleAddButton}
              >
                {addButtonLabel}
              </button>
            )}
          </div>
        </div>

        <div className="grow overflow-x-scroll">
          <table {...getTableProps()} className="table drop-shadow bg-white">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps()}
                      {...column.getSortByToggleProps()}
                    >
                      {column.render("Header")}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? " 🔽"
                            : " 🔼"
                          : ""}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row, i) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 6 */}
        {showPagination && (
          <div className="flex items-center justify-between">
            <div className="join">
              <button
                className="join-item btn btn-sm btn-primary"
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
              >
                <FiChevronsLeft />
              </button>
              <button
                className="join-item btn btn-sm btn-primary"
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                <FiChevronLeft />
              </button>
              <button
                className="join-item btn btn-sm btn-primary"
                onClick={() => nextPage()}
                disabled={!canNextPage}
              >
                <FiChevronRight />
              </button>
              <button
                className="join-item btn btn-sm btn-primary"
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
              >
                <FiChevronsRight />
              </button>
            </div>
            <span className="text-sm">
              {pageIndex + 1} of {pageOptions.length}
            </span>
            <select
              className="select select-sm select-primary"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
              }}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </>
  );
};

export default Table;
