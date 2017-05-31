#!/usr/bin/env node

var tabletop = require('tabletop');
var fs = require('fs');
require('colors');

console.error(('spreadsheet.js').green.inverse);

tabletop.init({ 
  key: '1Fdsz9s0WQlyG72UtCLiSa8_LjtbRI7G8yRBetGhj_vo',
  callback: function(result, tabletop) {
    
    var googleRows = result.length;
    console.error(('Fetched ' + googleRows + ' rows from Google Doc').green);
    
    console.log(JSON.stringify(result, null, 2));
  },
  simpleSheet: true
});