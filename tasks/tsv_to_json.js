#!/usr/bin/env node

var _ = require('underscore');

var convert = function(tsv_data) {

  var lines = tsv_data.split(/\n|\r/);
  var keys = lines.shift().split('\t');

  var result = [];

  // ignore empty lines
  lines = _.reject(lines, function(line) {
    return line.length == 0;
  });

  _.each(lines, function(line) {
    var values = line.split('\t');

    values = values.map(function(value) {
      if (value === '') {
        return '';
      }
      else if (+value == value) {
        return +value;
      }
      else {
        return value;
      }
    });

    result.push(_.object(keys, values));
  });

  return result;
};

if (require.main === module) {
  // code run only if this file is called
  // directly from the command line
  var stdin = require('get-stdin');
  stdin(function(data) {
    var newData = convert(data);
    console.log(JSON.stringify(newData,null,2));
  });
}
else {
  // expose functions if this file has been
  // required from elsewhere
  module.exports = convert;
}
