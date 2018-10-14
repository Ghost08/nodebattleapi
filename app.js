'use strict';

const express = require("express");
const bodyParser = require("body-Parser");
const mongoose = require("mongoose");
const cors = require("cors");


const app = express();

const config = require("./config");

//default params
const db = config.mongodbcs;
const port = config.port;

//routes
const battle = require("./routes/battle");
const user = require("./routes/user");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

//connect to mongo db
mongoose.connect(db, {
    useNewUrlParser: true
},
err => {
    if (err) {
        console.error(err);
    } else {
        console.log("connected to mongodb");
    }

});

//default route
app.get("/", (req, res) => {
    res.send("Hello from battle api");
});

//register routes
app.use("/api/user", user);
app.use("/api/battle", battle);


//start server
app.listen(process.env.PORT || port, () => {
    console.log(`server started`);
})