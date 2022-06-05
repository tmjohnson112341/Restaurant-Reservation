import React from "react";

export default function TableForm({
  title,
  handleSubmit,
  tableData,
  handleChange,
  handleCancel,
}) {
  return (
    <div>
      <h1>{title} Table</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="table_name">
          Table Name:
          <input
            id="table_name"
            name="table_name"
            type="text"
            required
            placeholder="Bar #1"
            onChange={handleChange}
            value={tableData.table_name}
          />
        </label>
        <label htmlFor="capacity">
          Capacity:
          <input
            id="capacity"
            name="capacity"
            type="number"
            required
            min={1}
            onChange={handleChange}
            value={tableData.capacity}
          />
        </label>
        <div>
          <button className="btn btn-primary mr-2" type="submit">
            Submit
          </button>
          <button
            className="btn btn-secondary"
            type="button"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}