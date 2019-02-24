let express = require('express');
let router = express.Router();
router.get('/sections', (req, res) => {
  let mongodb = require('mongodb').MongoClient;
  let path = 'mongodb://localhost:27017/BusData';
  mongodb.connect(path, (err, db) => {
    sectionData(db, result => {
      res.send(result);
      db.close();
    })
  });
  let sectionData = function (db, callback) {
    let section = db.collection('section');
    section.find({}, {'_id': 0}).toArray((err, sectionResult) => {
      if (err) {
        console.log('Error:' + err);
        return false;
      } else {
        callback(sectionResult);
      }
    });
  };
});
router.get('/stations', (req, res) => {
  let mongodb = require('mongodb').MongoClient;
  let path = 'mongodb://localhost:27017/BusData';
  mongodb.connect(path, (err, db) => {
    stationData(db, result => {
      res.send(result);
      db.close();
    })
  });
  let stationData = function (db, callback) {
    let station = db.collection('station');
    station.find({}, {'_id': 0, 'id': 0}).toArray((err, stationResult) => {
      if (err) {
        console.log('Error:' + err);
        return false;
      } else {
        callback(stationResult);
      }
    });
  };
});
router.get('/routes', (req, res) => {
  let mongodb = require('mongodb').MongoClient;
  let path = 'mongodb://localhost:27017/BusData';
  mongodb.connect(path, (err, db) => {
    routeData(db, result => {
      res.send(result);
      db.close();
    })
  });
  let routeData = function (db, callback) {
    let allRoutes = db.collection('all_routes');
    allRoutes.find({}, {'_id': 0, 'id': 0}).toArray((err, routeResult) => {
      if (err) {
        console.log('Error:' + err);
        return false;
      } else {
        callback(routeResult);
      }
    });
  };
});
router.get('/sign', (req, res) => {
  let mongodb = require('mongodb').MongoClient;
  let path = 'mongodb://localhost:27017/BusData';
  mongodb.connect(path, (err, db) => {
    initData(db, result => {
      res.send(result);
      db.close();
    })
  });
  let initData = function (db, callback) {
    let stationSign = db.collection('station_sign');
    stationSign.find({}, {'_id': 0}).toArray((err, signResult) => {
      if (err) {
        console.log('Error:' + err);
        return false;
      } else {
        callback(signResult);
      }
    });
  };
});
module.exports = router;
