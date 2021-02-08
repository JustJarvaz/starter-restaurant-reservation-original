import React from "react";

function TablesList({ tables = [] }) {
  return tables.map((table) => {
    return (
      <tr key={table.table_id}>
        <td>{table.table_id}</td>
        <td>{table.table_name}</td>
        <td>{table.capacity}</td>
        <td>{table.reservation_id ? "Occupied" : "Free"}</td>
      </tr>
    );
  });
}

export default TablesList;
