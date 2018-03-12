var express = require('express');
var _ = require('underscore');
var router = express.Router();
var DiscoveryV1 = require('watson-developer-cloud/discovery/v1');
require('dotenv').config();
var discovery = new DiscoveryV1({
  username: process.env.DISCOVERYUSERNAME,
  password: process.env.DISCOVERYPASSWORD,
  version_date: '2017-11-07'
});
/* GET home page. */

function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp);
  //var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
//  var month = months[a.getMonth()];
var month = a.getMonth();
  var time = month + year ;
  return month;
}

function rdata(res1, res2, res3) {
  var sda1 = [];
  var sda2 = [];
  var sda3 = [];
  var final = [];
  var res = res1;
  for (var i = 0; i < res.length; i++) {
    for (var j = 0; j < res[i].val[0].length; j++) {
        if (!sda1[res[i].val[0][j].name])
        sda1[res[i].val[0][j].name] = [];
        sda1[res[i].val[0][j].name][sda1[res[i].val[0][j].name].length] = [res[i].key, res[i].val[0][j].value];
    }
}
  
  res = res2;
  for (var i = 0; i < res.length; i++) {
      for (var j = 0; j < res[i].val.length; j++) {
          if (!sda2[res[i].val[j].name])
              sda2[res[i].val[j].name] = [];
          sda2[res[i].val[j].name][sda2[res[i].val[j].name].length] = [res[i].key, res[i].val[j].value];
      }
  }

  for (var i = 0; i < res3.length; i++) {
    for (var j = 0; j < res3[i].val[0].length; j++) {
        if (!sda3[res3[i].val[0][j].name])
        sda3[res3[i].val[0][j].name] = [];
        sda3[res3[i].val[0][j].name][sda3[res3[i].val[0][j].name].length] = [res3[i].key, res3[i].val[0][j].value];
    }
}
  for (var i = 0; i < res[0].val.length; i++) {
      final.push({ name: res[0].val[i].name, lifeExpectancy: sda2[res[0].val[i].name], population: sda1[res[0].val[i].name], income: sda3[res[0].val[i].name] })
  }
  return(final);

}

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
      aggregation: 'timeslice(time,1month,anomaly:true).term(enriched_text.entities.type,count:50).average(nps_rating)'
    },
      function (error, d1) {
        
        if(!error)
        {
          discovery.query({
            environment_id: 'a14383db-b897-4442-8232-948f70cfc5f4', collection_id: 'ee26da60-88a6-495b-be7c-50e79991fa85', query: '',
            aggregation: 'timeslice(time,1month,anomaly:true).nested(enriched_text.entities).filter(enriched_text.entities:(type:(PROMOTION|ORGANIZATION|PRODUCT|PRICE|ORDER|PAYMENT|DELIVERY|SERVICE|EMPLOYEE|REFUND|RETURN|BONUS),count:(1))).term(enriched_text.entities.type).average(enriched_text.entities.sentiment.score)'
          },
            function (error2, d2) {
              if(!error2)
              {
                  var sda1 = d1.aggregations[0].results;      
                  var sda2 = d2.aggregations[0].results;
                  /* returns timestamp
                  var dat1 = _.map(sda1, function(a){ return {key: a.key , val: _.map(a.aggregations, function(c) {return _.map(c.results, function(d) {return { name: d.key, value: d.matching_results}})})}});
                  var dat2 = _.map(sda2, function(a){ return {key: a.key , val: _.map(a.aggregations, function(c) {return _.map(c.aggregations, function(e) {return _.map(e.aggregations, function(b) {return _.map(b.results, function(d) {return { name: d.key, value: _.map(d.aggregations, function(f) {return f.value})[0]}})})[0]})[0]})[0]}});
                  var dat3 = _.map(sda1, function(a){ return {key: a.key , val: _.map(a.aggregations, function(c) {return _.map(c.results, function(d) {return { name: d.key, value: _.map(d.aggregations, function(z) { return z.value})}})})}});
                  */
                  //Returns month
                  var dat1 = _.map(sda1, function(a){ return {key: timeConverter(a.key) , val: _.map(a.aggregations, function(c) {return _.map(c.results, function(d) {return { name: d.key, value: d.matching_results}})})}});
                  var dat2 = _.map(sda2, function(a){ return {key: timeConverter(a.key) , val: _.map(a.aggregations, function(c) {return _.map(c.aggregations, function(e) {return _.map(e.aggregations, function(b) {return _.map(b.results, function(d) {return { name: d.key, value: _.map(d.aggregations, function(f) {return f.value})[0]}})})[0]})[0]})[0]}});
                  var dat3 = _.map(sda1, function(a){ return {key: timeConverter(a.key) , val: _.map(a.aggregations, function(c) {return _.map(c.results, function(d) {return { name: d.key, value: _.map(d.aggregations, function(z) { return z.value})}})})}});

                  res.send(JSON.stringify(rdata(dat1,dat2,dat3), null, 2));
              }
            });
        }
      });    
});



module.exports = router;