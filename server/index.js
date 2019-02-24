const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

let initData = require('./api/initData');
let stationRunData = require('./api/stationRunData');
let sectionRunData = require('./api/sectionRunData');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/api/initData', initData);
app.use('/api/stationRunData', stationRunData);
app.use('/api/sectionRunData', sectionRunData);
// 监听端口
app.listen(5000);
console.log('success listen at port:5000......');

