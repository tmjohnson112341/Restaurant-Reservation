import React from 'react';

export default function Table({table}){
    return (
        <tr>
          <th scope="row">{table.table_id}</th>
          <td>{table.table_name}</td>
          <td>{table.capacity}</td>
          <td>{table.reservation_id}</td>
          <td>{table.reservation_id ? "Occupied" : "Open"}</td>
        </tr>
      );
} 