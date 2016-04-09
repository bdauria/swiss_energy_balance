var chart;
var map;
var chartData = [];
var data = loadCSV("data-prodcons.csv");

AmCharts.ready(function() {
  var chart = AmCharts.makeChart("chartdiv", {
    "type": "serial",
    "theme": "light",
    "legend": {
      "useGraphSettings": true
    },
    "dataProvider": chartData,
    "valueAxes": [{
      "id":"production",
      "axisColor": "#FF6600",
      "axisThickness": 2,
      "gridAlpha": 0,
      "axisAlpha": 1,
      "position": "left"
    }, {
      "id":"consumption",
      "axisColor": "#FCD202",
      "axisThickness": 2,
      "gridAlpha": 0,
      "axisAlpha": 1,
      "position": "right"
    }],
      "graphs": [{
        "valueAxis": "production",
        "lineColor": "#FF6600",
        "bullet": "round",
        "bulletBorderThickness": 1,
        "hideBulletsCount": 30,
        "title": "production",
        "valueField": "production",
        "fillAlphas": 0
      }, {
        "valueAxis": "consumption",
        "lineColor": "#FCD202",
        "bullet": "square",
        "bulletBorderThickness": 1,
        "hideBulletsCount": 30,
        "title": "consumption",
        "valueField": "consumption",
        "fillAlphas": 0
      }],
        "chartScrollbar": {},
        "chartCursor": {
          "cursorPosition": "mouse"
        },
        "categoryField": "date",
        "categoryAxis": {
          "labelFrequency": 20,
          //"parseDates": true,
          "axisColor": "#DADADA",
          "minorGridEnabled": true
        },
        "export": {
          "enabled": true,
          "position": "bottom-right"
        }
  });

  map = new AmCharts.AmMap();
  map.balloon.color = "#000000";

  var dataProvider = {
    mapVar: AmCharts.maps.switzerlandLow,
    getAreasFromMap:true
  };

  map.dataProvider = dataProvider;

  map.areasSettings = {
    "autoZoom": false,
    "selectedColor": "#CC0000",
    "selectable": true
  };

  map.smallMap = new AmCharts.SmallMap();

  map.write("mapdiv");
  map.areasSettings = {
    "autoZoom": false,
    "selectedColor": "#CC0000",
    "selectable": true
  };

  map.smallMap = new AmCharts.SmallMap();

  map.write("mapdiv");

  map.addListener("clickMapObject", function (event) {
    var mapObjectId = event.mapObject.id.replace('CH-', '');
    //map.selectObject(map.getObjectById('CH-JU'));
    //map.selectObject(event.mapObject);
    //map.selectedObject(
    //if (mapObjectId != undefined && chartData[mapObjectId] != undefined) {
    //chart.dataProvider = chartData[mapObjectId];
    //chart.dataProvider = generateChartData();
    var cantonData = getCantonChartData(mapObjectId);
    chart.dataProvider = plotCantonChart(cantonData);
    //chart.clearLabels();
    //chart.addLabel("0", "!20", event.mapObject.title, "center", 16);
    chart.validateData();
    //}
  });
});
function plotCantonChart(cantonData) {
  var chartData = [];
  for (var i = 0; i < cantonData.length; i++) {
    var column = cantonData[i].split(',');
    var momentDate = moment(column[0], 'DD-MM-YY HH:mm:ss');
    var production = column[2];
    var consumption = column[3];

    chartData.push({
      date: momentDate.format('LLL'),
      production: parseFloat(production),
      consumption: parseFloat(consumption)
    });

    //if (i == 100) 
      //break;
  }
  
  return chartData;
}
function generateChartData() {
  var chartData = [];
  var firstDate = new Date();
  firstDate.setDate(firstDate.getDate() - 100);

  for (var i = 0; i < 100; i++) {
    // we create date objects here. In your data, you can have date strings
    // and then set format of your dates using chart.dataDateFormat property,
    // however when possible, use date objects, as this will speed up chart rendering.
    var newDate = new Date(firstDate);
    newDate.setDate(newDate.getDate() + i);

    var visits = Math.round(Math.random() * 40) + 100;
    var hits = Math.round(Math.random() * 80) + 500;
    var views = Math.round(Math.random() * 6000);

    chartData.push({
      date: newDate,
      visits: visits,
      hits: hits,
      views: views
    });
  }
  return chartData;
}

function getCantonChartData(canton)
{
  var cantonData = data.filter(function(row) {
    return row.split(',')[1] == canton;
  });
  return cantonData;
}

function loadCSV(file) {
  var request;
  if (window.XMLHttpRequest) {
    // IE7+, Firefox, Chrome, Opera, Safari
    request = new XMLHttpRequest();
  } else {
    // code for IE6, IE5
    request = new ActiveXObject('Microsoft.XMLHTTP');
  }
  // load
  request.open('GET', file, false);
  request.send();
  return parseCSV(request.responseText);
}

function parseCSV(data){
  //replace UNIX new lines
  //data = data.replace (/\r\n/g, "\n");
  //replace MAC new lines
  //data = data.replace (/\r/g, "\n");
  //split into rows
  var rows = data.split("\n");

  return rows;
}
