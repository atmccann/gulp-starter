;(function() {

    var utils = require('./utils.js');
    var _ = require('underscore');
    var d3 = require('d3');

    function scatterChart() {

        var self = this;

        this.init = function(selector, data) {

            self.div = d3.select(selector);

            console.log('aaaand what about chart');
            console.log(selector);
            console.log(data);

        };

        this.init();
        return self;

    }

module.exports = scatterChart;

}());
