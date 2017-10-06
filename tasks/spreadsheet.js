#!/usr/bin/env node

var tabletop = require('tabletop');
var fs = require('fs');
require('colors');

console.error(('spreadsheet.js').green.inverse);

tabletop.init({ 
  key: 'https://docs.google.com/a/vice.com/spreadsheets/d/1Rg3pzuz_gyxIvYuyPXxitwbS_6f4Z3SPzI_u4DqlNMo/edit?usp=sharing',
  callback: function(result, tabletop) {
    
    var googleRows = result.length;
    console.error(('Fetched ' + googleRows + ' rows from Google Doc').green);
    
    console.log(JSON.stringify(result, null, 2));
  },
  simpleSheet: true
});