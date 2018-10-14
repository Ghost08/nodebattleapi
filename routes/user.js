'use strict';

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const error = require("../models/error");
const User = require("../models/user");
const config = require("../config");
const response = require("../models/response");
const utililty = require("../models/utililty");
const logger = require("../logger");

//register user
router.post("/register", (req, res) => {

    logger.info("register user");

    let userData = req.body;

    //check if username already exists or not
    //if exists then send error
    //else register new user

    let objUtility = new utililty();

    if (!objUtility.isNullOrEmpty(userData.userName)) {
        let errorData = new error(400, "provide username");
        let apiresponse = new response("error", null, errorData);
        res.status(400).send(apiresponse);
    } else if (!objUtility.isNullOrEmpty(userData.password)) {
        let errorData = new error(400, "provide password");
        let apiresponse = new response("error", null, errorData);
        res.status(400).send(apiresponse);
    } else if (!objUtility.validateEmail(userData.email)) {
        let errorData = new error(400, "provide email id");
        let apiresponse = new response("error", null, errorData);
        res.status(400).send(apiresponse);
    } else {

        User.findOne({
            userName: userData.userName
        }, (err, existingUser) => {

            if (err) {
                logger.error(err);
                let errorData = new error(400, err.errmsg);
                let apiresponse = new response("error", null, errorData);
                res.status(400).send(apiresponse);
            } else {
                if (existingUser) {
                    let errorData = new error(400, "Username already taken");
                    let apiresponse = new response("error", null, errorData);
                    res.status(400).send(apiresponse);
                } else {
                    //parse input user info
                    let user = new User(userData);
                    user.active = true;
                    user.createdDate = new Date();

                    user.save((e, registeredUser) => {
                        if (e) {
                            logger.error(e);
                            let errorData = new error(400, "error in saving user details");
                            let apiresponse = new response("error", null, errorData);
                            res.status(400).send(apiresponse);
                        } else {

                            let payload = {
                                subject: registeredUser._id,
                                userName: registeredUser.userName
                            };
                            let token = jwt.sign(payload, config.secretkey);
                            let apiresponse = new response("success", {
                                token: token,
                                userName: registeredUser.userName
                            }, null);

                            res.status(200).send(apiresponse);
                        }
                    });
                }
            }
        });
    }
});


//user login
router.post("/login", (req, res) => {
logger.info("login");
    
    let userData = req.body;
    User.findOne({
        userName: userData.userName
    }, (err, user) => {

        if (err) {
            logger.error(err);
            let errorData = new error(400, err.errmsg);
            let apiresponse = new response("error", null, errorData);
            res.status(400).send(apiresponse);
        } else {

            if (!user) {
                let errorData = new error(401, "Invalid username");
                let apiresponse = new response("error", null, errorData);
                res.status(401).send(apiresponse);
            } else {
                if (user.password !== userData.password) {
                    let errorData = new error(401, "Invalid password");
                    let apiresponse = new response("error", null, errorData);
                    res.status(401).send(apiresponse);
                } else {
                    let payload = {
                        subject: user._id,
                        userName: user.userName
                    };
                    let token = jwt.sign(payload, config.secretkey);
                    let apiresponse = new response("success", {
                        token: token,
                        userName: user.userName
                    }, null);

                    res.status(200).send(apiresponse);
                }
            }
        }
    });
});

module.exports = router;