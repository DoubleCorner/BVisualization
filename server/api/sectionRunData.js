let express = require('express');
let router = express.Router();
router.get('/noRoute', (req, res) => {
  let condition = {
    'sectionId': req.query.sectionId,
    'startTime': parseInt(req.query.startTime),
    'endTime': parseInt(req.query.endTime)
  };
  let start = new Date(condition.startTime);
  let end = new Date(condition.endTime);
  let mongodb = require('mongodb').MongoClient;
  let path = 'mongodb://localhost:27017/BusData';
  mongodb.connect(path, (err, db) => {
    sectionRunData(db, result => {
      res.send(result);
      db.close();
    })
  });
  let sectionRunData = function (db, callback) {
    let sectionRun = db.collection("section_run_data");
    let aveSpeed = -1;
    let whereStr = {
      'section_id': parseInt(condition.sectionId),
      'end_date_time': {'$gte': start, '$lte': end},
      'speed': {'$lte': 60}
    };
    sectionRun.find(whereStr, {
      'speed': 1,
      '_id': 0
    }).toArray((err, result) => {
      if (err) {
        console.log('Error:' + err);
        return false;
      } else {
        let len = result.length;
        if (len) {
          aveSpeed = 0;
          for (let i = 0; i !== len; ++i) {
            aveSpeed += result[i].speed;
          }
          aveSpeed = (aveSpeed / len).toFixed(2);
        }
        callback(aveSpeed.toString());//如果-1，没有该路段数据
      }
    });
  }
});
router.get('/withRoute', function (req, res) {
  let condition = {
    'subRouteId': req.query.subRouteId,
    'sectionId': req.query.sectionId,
    'startTime': parseInt(req.query.startTime),
    'endTime': parseInt(req.query.endTime)
  };
  let start = new Date(condition.startTime);
  let end = new Date(condition.endTime);
  let mongodb = require('mongodb').MongoClient;
  let path = 'mongodb://localhost:27017/BusData';
  mongodb.connect(path, (err, db) => {
    sectionRunData(db, result => {
      res.send(result);
      db.close();
    })
  });
  let sectionRunData = function (db, callback) {
    let sectionRun = db.collection("section_run_data");
    let aveSpeed = -1;
    let whereStr = {
      'sub_route_id': condition.subRouteId,
      'section_id': parseInt(condition.sectionId),
      'end_date_time': {'$gte': start, '$lte': end},
      'speed': {'$lte': 60}
    };
    sectionRun.find(whereStr, {
      'speed': 1,
      '_id': 0
    }).toArray(function (err, result) {
      if (err) {
        console.log('Error:' + err);
        return false;
      } else {
        let len = result.length;
        if (len) {
          aveSpeed = 0;
          for (let i = 0; i !== len; ++i) {
            aveSpeed += result[i].speed;
          }
          aveSpeed = (aveSpeed / len).toFixed(2);
        }
        callback(aveSpeed.toString());//如果-1，没有该路段数据
      }
    });
  }
});
router.get('/oneSection', function (req, res) {
  let condition = {
    'sectionId': req.query.sectionId
  };
  let mongodb = require('mongodb').MongoClient;
  let path = 'mongodb://localhost:27017/BusData';
  mongodb.connect(path, (err, db) => {
    sectionRunData(db, result => {
      res.send(result);
      db.close();
    })
  });
  let sectionRunData = function (db, callback) {
    let sectionRun = db.collection("section_run_data");
    let whereStr = {
      'section_id': parseInt(condition.sectionId),
      'speed': {'$lte': 60}
    };
    sectionRun.find(whereStr, {
      'speed': 1,
      'end_date_time': 1,
      '_id': 0
    }).sort({'end_date_time': 1}).toArray((err, result) => {
      if (err) {
        console.log('Error:' + err);
        return false;
      } else {
        callback(result);
      }
    });
  }
});
module.exports = router;