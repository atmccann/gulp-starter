;(function() {

    console.log('hello');

    var utils = require('./utils.js');
    var _ = require('underscore');
    var d3 = require('d3');

    function Chart() {

        var self = this;

        this.init = function(selector, data) {

            self.div = d3.select(selector);
        };

        this.init();
        return self;

    }

module.exports = Chart;

}());
