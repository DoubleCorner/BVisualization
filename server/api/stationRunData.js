let express = require('express');
let router = express.Router();
router.get('/', (req, res) => {
  let condition = {
    'stationId': req.query.stationId
  };
  let mongodb = require('mongodb').MongoClient;
  let path = 'mongodb://localhost:27017/BusData';
  mongodb.connect(path, (err, db) => {
    stationRunData(db, (result) => {
      res.send(result);
      db.close();
    })
  });
  let stationRunData = function (db, callback) {
    let stationRun = db.collection("stationRunData");
    let whereStr = {
      'station_id': condition.stationId,
      'stay_time': {'$lt': 120}
    };
    stationRun.find(whereStr, {
      'route_id': 1,
      'end_date_time': 1,
      'stay_time': 1,
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