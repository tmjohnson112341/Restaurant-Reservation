import React from "react";
import { Link } from "react-router-dom";

export default function Reservation({ reservation }) {
  return (
    <tr>
      <th scope="row">{reservation.reservation_id}</th>
      <td>
        {reservation.first_name}, {reservation.last_name}
      </td>
      <td>{reservation.mobile_number}</td>
      <td>{reservation.reservation_date}</td>
      <td>{reservation.reservation_time}</td>
      <td>{reservation.people}</td>
      <td>
        <Link to={`/reservations/${reservation.reservation_id}/seat`}>
          Seat
        </Link>
      </td>
    </tr>
  );
}