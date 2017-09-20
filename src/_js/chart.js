;(function() {

    var utils = require('./utils.js');
    var _ = require('underscore');
    var d3 = require('d3');

    function scatterChart() {

        var self = this;

        this.init = function(selector, data) {

            self.div = d3.select(selector);
            self.data = self.setupGraph(data);

        };

        this.setupGraph = function(data) {

            console.log(data[29]);
        };

    }

module.exports = scatterChart;

}());
