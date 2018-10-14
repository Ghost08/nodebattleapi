'use strict';

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const error = require("../models/error");
const battle = require("../models/battle");
const response = require("../models/response");
const battleStats = require("../models/battleStats");
const user = require("../models//user");
const config = require("../config");
const logger = require("../logger");

//verify jwt token 
function verifyToken(req, res, next){
    logger.info("verifyToken");    
    if (!req.headers.authorization) {
        let errorData = new error(401, "unauthorized request");
        let apiresponse = new response("error", null, errorData);
        return res.status(401).send(apiresponse);
    }

    //extract token from header
    let token = req.headers.authorization.split(' ')[1];
    if (token === 'null') {
        let errorData = new error(401, "unauthorized request");
        let apiresponse = new response("error", null, errorData);
        return res.status(401).send(apiresponse);
    }

    let payload = jwt.verify(token, config.secretkey);
    if (!payload) {
        let errorData = new error(401, "unauthorized request");
        let apiresponse = new response("error", null, errorData);
        return res.status(401).send(apiresponse);
    } else {

        user.findOne({
            _id: payload.subject
        }, (err, existinguser) => {
            if (err) {
                logger.error(err);
                let errorData = new error(401, err.errmsg);
                let apiresponse = new response("error", null, errorData);
                res.status(400).send(apiresponse);
            } else {

                if (existinguser == null) {
                    let errorData = new error(401, "user not found");
                    let apiresponse = new response("error", null, errorData);
                    return res.status(404).send(apiresponse);
                }
            }
        });
    }

    req.userId = payload.subject;
    next();
}

//get list of distinct battle locations
router.get("/list", verifyToken, (req, res) => {
    logger.info("get battle locations");
    
    battle.distinct("location", {
            "location": {
                $nin: ["", null]
            }
        },
        (err, locations) => {
            if (err) {
                logger.error(err);
                let errorData = new error(401, err.errmsg);
                let apiresponse = new response("error", null, errorData);
                res.status(400).send(apiresponse);
            } else {
                let apiresponse = new response("success", {
                    locations
                }, null);
                res.status(200).send(apiresponse);
            }
        });
});

//get total number of battles
router.get("/count", verifyToken, (req, res) => {
    logger.info("get battle count");
    
    battle.aggregate([{
            $group: {
                "_id": {},
                "count(battle_number)": {
                    $sum: 1
                }
            }
        },
        {
            $project: {
                "_id": 0,
                "battle_count": "$count(battle_number)"
            }
        }
    ], (err, battles) => {
        if (err) {
            logger.error(err);
            let errorData = new error(401, err.errmsg);
            let apiresponse = new response("error", null, errorData);
            res.status(400).send(apiresponse);
        } else {
            let apiresponse = new response("success",
                battles[0], null);
            res.status(200).send(apiresponse);
        }
    });
});

//get all battle stats
router.get("/stats", verifyToken, (req, res) => {
    logger.info("get all stats");
    
    battle.find({}, (err, battles) => {
        let objbattleStats = new battleStats(battles);

        if (err) {
            logger.error(err);
            let errorData = new error(401, err.errmsg);
            let apiresponse = new response("error", null, errorData);
            res.status(400).send(apiresponse);
        } else {           
            let battle_stats = {
                "most_active": objbattleStats.fngetMostActiveStats(),
                "attcker_outcome": objbattleStats.fngetAttackerOutcome(),
                "battle_types": objbattleStats.fngetBattleTypes(),
                "defender_size": objbattleStats.fngetDefenderSize()
            }

            let apiresponse = new response("success",
                battle_stats, null);
            res.status(200).json(apiresponse);
        }
    })
});


// search battle api
// search by king or location or type
router.get("/search", verifyToken, (req, res) => {
    
    let king = req.query.king;
    let location = req.query.location;
    let type = req.query.type;
    let query = {
        "$or": [{
                "$or": [{
                        "attacker_king": king == undefined ? "NA" : king
                    },
                    {
                        "defender_king": king == undefined ? "NA" : king
                    }
                ]
            },
            {
                "location": location == undefined ? "NA" : location
            },
            {
                "type": type == undefined ? "NA" : type
            }
        ]
    };

    battle.find(query, (err, battles) => {
        if (err) {            
            logger.error(err);
            let errorData = new error(401, err.errmsg);
            let apiresponse = new response("error", null, errorData);

            res.status(400).send(apiresponse);
        } else {
            let apiresponse = new response("success",
                battles, null);
            res.status(200).send(apiresponse);
        }
    });
});

module.exports = router;