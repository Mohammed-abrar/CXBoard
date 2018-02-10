Morris.Line({
  element: 'voice-recordings',
  data: [
    { y: '2017-07-23', a: 25},
    { y: '2017-07-24', a: 50},
    { y: '2017-07-25', a: 40},
    { y: '2017-07-26', a: 55},
    { y: '2017-07-27', a: 50},
    { y: '2017-07-28', a: 75},
    { y: '2017-07-29', a: 90}
  ],
  xkey: 'y',
  ykeys: ['a'],
  lineColors: ['#0ec888'],
  labels: ['Recordings'],
  lineWidth : 7,
  xLabels: "Day"
});
var dt = new Date(); 
Morris.Area({
    element: 'NLUGraph',
    data: [{ y: dt.getTime(), sadness: 0.855074,
                joy: 0.551317,
                fear: 0.164747,
                disgust: 0.016603,
                anger: 0.077199},
     { y: dt.getTime()+1, sadness: 0.288074,
                joy: 0.551457,
                fear: 0.172747,
                disgust: 0.896603,
                anger: 0.12199},
     { y: dt.getTime()+2, sadness: 0.277129,
                joy: 0.455993,
                fear: 0.215546,
                disgust: 0.075451,
                anger: 0.032786},
     { y: dt.getTime()+3, sadness: 0.177129,
                joy: 0.355993,
                fear: 0.215546,
                disgust: 0.975451,
                anger: 0.232786},
     { y: dt.getTime()+4, sadness: 0.777129,
                joy: 0.055993,
                fear: 0.915546,
                disgust: 0.875451,
                anger: 0.232786},
     { y: dt.getTime()+5, sadness: 0.677129,
                joy: 0.155993,
                fear: 0.215546,
                disgust: 0.675451,
                anger: 0.132786}],
    xkey: 'y',
    ykeys: ['sadness', 'joy','fear','disgust','anger'],
  labels: ['Sadness', 'Joy', 'Fear','Disgust','Anger'],
    pointSize: 0,
    fillOpacity: 0.7,
    behaveLikeLine: true,
    gridLineColor: '#e0e0e0',
    lineWidth: 0,
    smooth: false,
    hideHover: 'auto',
    resize: true

});

$(".counter").counterUp({
    delay: 100,
    time: 1200
});
