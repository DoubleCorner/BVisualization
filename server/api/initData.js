let express = require('express');
let router = express.Router();
router.get('/', (req, res) => {
  let mongodb = require('mongodb').MongoClient;
  let path = 'mongodb://localhost:27017/BusData';
  mongodb.connect(path, (err, db) => {
    initData(db, result => {
      res.send(result);
      db.close();
    })
  });
  let initData = function (db, callback) {
    let section = db.collection('section');
    let sectionList, stationList, routeList, signList;
    let whereStr = {};
    section.find(whereStr, {'_id': 0}).toArray((err, sectionResult) => {
      if (err) {
        console.log('Error:' + err);
        return false;
      } else {
        sectionList = sectionResult;
        let station = db.collection('station');
        station.find(whereStr, {'_id': 0, 'id': 0}).toArray((err, stationResult) => {
          if (err) {
            console.log('Error:' + err);
            return false;
          } else {
            stationList = stationResult;
            let allRoutes = db.collection('allRoutes');
            allRoutes.find(whereStr, {'_id': 0, 'id': 0}).toArray((err, routeResult) => {
              if (err) {
                console.log('Error:' + err);
                return false;
              } else {
                routeList = routeResult;
                let stationSign = db.collection('stationSign');
                stationSign.find(whereStr, {'_id': 0}).toArray((err, signResult) => {
                  if (err) {
                    console.log('Error:' + err);
                    return false;
                  } else {
                    signList = signResult;
                    let dataList = {
                      'station': stationList,
                      'section': sectionList,
                      'route': routeList,
                      'sign': signList
                    };
                    callback(dataList);
                  }
                });
              }
            });
          }
        });
      }
    });
  };
});
module.exports = router;
