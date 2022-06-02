const knex = require('../db/connection.js');

function list(reservation_date){
    return knex("reservations")
    .select("*")
    .where({reservation_date})
    .orderBy("reservation_time");
}

function create(newReservation){
    return knex("reservations")
    .insert(newReservation)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

module.exports = {
    list,
    create,
}