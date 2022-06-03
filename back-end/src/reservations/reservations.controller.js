const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

const hasRequiredProperties = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
);

const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
  "created_at",
  "updated_at",
  "status",
];

function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}

function validateReservation(req, res, next) {
  const { data = {} } = req.body;
  let temp_reservation_time =
    data["reservation_time"] && data["reservation_time"].replace(":", "");
  if (new Date(data["reservation_date"]).getDay() + 1 === 2) {
    next({
      status: 400,
      message: `We are closed on Tuesdays, please pick a day when we are open!`,
    });
  } else if (Date.parse(data["reservation_date"]) < Date.now()) {
    next({
      status: 400,
      message: `Reservation must be reserved for a date in the future.`,
    });
  } else if (temp_reservation_time < 1030) {
    next({
      status: 400,
      message: "Reservation cannot be before business hours!",
    });
  } else if (temp_reservation_time > 2130) {
    next({
      status: 400,
      message:
        "Reservation cannot be less than one hour before business closing!",
    });
  }
  next();
}

function validDate(req, res, next) {
  const { data = {} } = req.body;
  if (!data["reservation_date"].match(/\d{4}-\d{2}-\d{2}/)) {
    return next({
      status: 400,
      message: `reservation_date is invalid.`,
    });
  }
  next();
}

function validTime(req, res, next) {
  const { data = {} } = req.body;
  if (!data["reservation_time"].match(/[0-9]{2}:[0-9]{2}/)) {
    return next({
      status: 400,
      message: `reservation_time is invalid`,
    });
  }
  next();
}

function validPeople(req, res, next) {
  const { data = {} } = req.body;
  if (typeof data["people"] !== "number") {
    return next({
      status: 400,
      message: `people is invalid`,
    });
  }
  next();
}

async function reservationExists(req, res, next) {
  const { reservation_id } = req.params;
  const reservation = await service.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  } else {
    return next({
      status: 404,
      message: `Reservation ID ${reservation_id} does not exist.`,
    });
  }
}

function read(req, res) {
  const { reservation: data } = res.locals;
  res.json({ data });
}

async function list(req, res) {
  const data = await service.list(req.query.date);
  res.json({ data });
}

async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

function validStatus(req, res, next) {
  const reservation = res.locals.reservation;
  const { data = {} } = req.body;
  const status = data["status"];

  if (reservation.status === "finished") {
    return next({
      status: 400,
      message: "Reservation is already finished.",
    });
  }

  const validStatuses = ["booked", "seated", "finished", "cancelled"];
  if (validStatuses.includes(status)) {
    return next();
  }

  return next({
    status: 400,
    message: `Invalid or unknown status: ${status}`,
  });
}

function bookedCheck(req, res, next) {
  const { data = {} } = req.body;
  const status = data["status"];

  if (status === "booked" || status === undefined) {
    return next();
  }
  return next({
    status: 400,
    message: `Invalid or unknown status: ${status}`,
  });
}

async function updateStatus(req, res) {
  const reservation = res.locals.reservation;
  const { status } = req.body.data;
  const updatedReservation = {
    ...reservation,
    status,
  };
  const data = await service.updateStatus(updatedReservation);
  res.json({ data });
}

module.exports = {
  create: [
    hasOnlyValidProperties,
    hasRequiredProperties,
    validDate,
    validTime,
    validPeople,
    validateReservation,
    bookedCheck,
    asyncErrorBoundary(create),
  ],
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(reservationExists), read],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    validStatus,
    asyncErrorBoundary(updateStatus),
  ],
};
