'use strict';

const utility = require("../models/utililty");

function battleStats(battles) {
    const objUtility = new utility();
    battleStats.prototype.fngetMostActiveStats = function () {
        let mostActiveStats = {
            "attacker_king": "",
            "defender_king": "",
            "region": "",
            "name": ""
        }

        let aking_stats = objUtility.fnSortandCount(battles, "attacker_king", "DESC");
        if (aking_stats != null && aking_stats.length > 0)
            mostActiveStats.attacker_king = aking_stats[0].source;


        let dking_stats = objUtility.fnSortandCount(battles, "defender_king", "DESC");
        if (dking_stats != null && dking_stats.length > 0)
            mostActiveStats.defender_king = dking_stats[0].source;


        let region_stats = objUtility.fnSortandCount(battles, "region", "DESC");
        if (region_stats != null && region_stats.length > 0)
            mostActiveStats.region = region_stats[0].source;

        return mostActiveStats;
    }

    battleStats.prototype.fngetBattleTypes = function () {
        let battle_types = objUtility.fnDistinct(battles, "battle_type");
        if (battle_types != null && battle_types.length > 0)
            return battle_types;

        return null;
    }

    battleStats.prototype.fngetDefenderSize = function () {

        let defendersize = battles.filter(obj => obj["defender_size"] != null).map(obj => obj["defender_size"]);
        let defendersizeStats = {
            "average": 0,
            "min": 0,
            "max": 0
        }

        if (defendersize != null && defendersize.length > 0) {
            defendersizeStats.min = Math.min(...defendersize);
            defendersizeStats.max = Math.max(...defendersize);
            defendersizeStats.average = Math.round(defendersize.reduce((p, c) => p + c) / defendersize.length);
        }

        return defendersizeStats;
    }

    battleStats.prototype.fngetAttackerOutcome = function () {

        let attackerOutcome = {
            "win": 0,
            "loss": 0
        }
        let attackertotalwins = battles.filter(obj => obj["attacker_outcome"] === "win");
        let attackertotalloss = battles.filter(obj => obj["attacker_outcome"] === "loss");

        if (attackertotalwins != null && attackertotalwins.length > 0) {
            attackerOutcome.win = attackertotalwins.length;
        }

        if (attackertotalloss != null && attackertotalloss.length > 0) {
            attackerOutcome.loss = attackertotalloss.length;
        }

        return attackerOutcome;
    }

}


module.exports = battleStats;