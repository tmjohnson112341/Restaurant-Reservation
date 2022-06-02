import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "./../../utils/api";
import ReservationForm from "./ReservationForms";

export default function CreateReservation() {
  const history = useHistory();

  const initialFormData = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
  };

  const [formData, setFormData] = useState({ ...initialFormData });

  const handleChange = (e) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleCancel = (e) => {
    e.preventDefault();
    history.go(-1);
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    const ac = new AbortController();
    formData.people = parseInt(formData.people);
    await createReservation(formData, ac.signal);
    history.push(`/dashboard?date=${formData.reservation_date}`)
    return () => ac.abort();
  };

  return (
    <>
      <ReservationForm
        handleChange={handleChange}
        handleCancel={handleCancel}
        submitHandler={submitHandler}
        formData={formData}
      />
    </>
  );
}