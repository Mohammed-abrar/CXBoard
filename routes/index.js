var express = require('express');
var router = express.Router();
var DiscoveryV1 = require('watson-developer-cloud/discovery/v1');
require('dotenv').config();
var discovery = new DiscoveryV1({
  username: process.env.DISCOVERYUSERNAME,
  password: process.env.DISCOVERYPASSWORD,
  version_date: '2017-11-07'
});
/* GET home page. */



router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/themesbytime', function (req, res, next) {
  discovery.query({
    environment_id: 'a14383db-b897-4442-8232-948f70cfc5f4', collection_id: 'ee26da60-88a6-495b-be7c-50e79991fa85', query: '',
    aggregation: 'timeslice(time,1month,anomaly:true).nested(enriched_text.entities).filter(enriched_text.entities:(type:(ORGANIZATION|PRODUCT|PRICE|ORDER|PAYMENT|DELIVERY|SERVICE|EMPLOYEE),count:(1))).term(enriched_text.entities.type).[average(enriched_text.entities.sentiment.score),term(enriched_text.entities.sentiment.label)]'
  },
    function (error, data) {
      res.send(JSON.stringify(data, null, 2));
    })
});
router.get('/themesbygroup', function (req, res, next) {
  discovery.query({
    environment_id: 'a14383db-b897-4442-8232-948f70cfc5f4', collection_id: 'ee26da60-88a6-495b-be7c-50e79991fa85', query: '',
    aggregation: 'term(group).nested(enriched_text.entities).filter(enriched_text.entities:(type:(ORGANIZATION|PRODUCT|PRICE|SERVICE|EMPLOYEE),count:(1))).term(enriched_text.entities.type).[average(enriched_text.entities.sentiment.score),term(enriched_text.entities.sentiment.label)]'
  },
    function (error, data) {
      res.send(JSON.stringify(data, null, 2));
    })
});
router.get('/ ', function (req, res, next) {
  discovery.query({
    environment_id: 'a14383db-b897-4442-8232-948f70cfc5f4', collection_id: 'ee26da60-88a6-495b-be7c-50e79991fa85', query: '',
    aggregation: 'term(enriched_text.entities.type).average(nps_rating)'
  },
    function (error, data) {
      res.send(JSON.stringify(data, null, 2));
    })
});

router.get('/themesbyNpsApi2', function (req, res, next) {
  discovery.query({
    environment_id: 'a14383db-b897-4442-8232-948f70cfc5f4', collection_id: 'ee26da60-88a6-495b-be7c-50e79991fa85', query: '',
    aggregation: 'timeslice(time,1month,anomaly:true).term(enriched_text.entities.type).average(nps_rating)'
  },
    function (error, data) {
      res.send(JSON.stringify(data, null, 2));
    })
});



module.exports = router;