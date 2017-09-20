'use strict';

//
// app.js is the entry point for the entire client-side
// application. All of the top-level views should be
// instantiated here.

var utils = require('./utils.js');
var _ = require('underscore');
var d3 = require('d3');

//data and chart
var data = require("../_data/artists.json");
var scatterChart = require('./chart.js');

var scatterCharts = [],
    chart;

function drawScatterCharts() {
    var chart = new scatterChart();
    chart.init("#scatter-container", data);
    scatterCharts.push(chart);

    console.log('dont loop');
}

drawScatterCharts();

