'use strict';

const mongoose = require("mongoose");

const schema = mongoose.Schema;

const battleSchema = new schema({
    attacker_1: String,
    attacker_2: String,
    attacker_3: String,
    attacker_4: String,
    attacker_commander: String,
    attacker_king: String,
    attacker_outcome: String,
    attacker_size: Number,
    battle_number: Number,
    battle_type: String,
    defender_1: String,
    defender_2: String,
    defender_3: String,
    defender_4: String,
    defender_commander: String,
    defender_king: String,
    defender_size: Number,
    location: String,
    major_capture: String,
    major_death: String,
    name: String,
    note: String,
    region: String,
    summer: String,
    year: Number
});

module.exports = mongoose.model("battle", battleSchema, "battles");