import React from "react";

function TablesList({ onFinish, tables = [] }) {
  function finishHandler({
    target: { dataset: { tableIdFinish, reservationIdFinish } } = {},
  }) {
    if (
      tableIdFinish &&
      window.confirm(
        "Is this table ready to seat new guests?\n\nThis cannot be undone."
      )
    ) {
      onFinish(tableIdFinish, reservationIdFinish);
    }
  }

  return tables.map((table) => {
    return (
      <tr key={table.table_id}>
        <td>{table.table_id}</td>
        <td>{table.table_name}</td>
        <td>{table.capacity}</td>
        <td data-table-id-status={table.table_id}>
          {table.reservation_id ? "Occupied" : "Free"}
        </td>
        <td>
          {table.reservation_id ? (
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              data-table-id-finish={table.table_id}
              data-reservation-id-finish={table.reservation_id}
              onClick={finishHandler}
            >
              Finish
            </button>
          ) : (
            ""
          )}
        </td>
      </tr>
    );
  });
}

export default TablesList;
