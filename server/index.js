const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();

const networkData = require("./api/networkData");
const stationRunData = require("./api/stationRunData");
const sectionRunData = require("./api/sectionRunData");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use("/api/networkData", networkData);
app.use("/api/stationRunData", stationRunData);
app.use("/api/sectionRunData", sectionRunData);
app.listen(5000);
console.log("success listen at port:5000......");
