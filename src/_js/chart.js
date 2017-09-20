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


            var array = _.map(data, function(d) {
                return d;
            });

            var new_data = _.flatten(array);

            console.log(new_data);

            var margin = {top: 5, right: 5, bottom: 25, left: 25};

            var width = 850,
                height = 850;

            var x = d3.scaleLinear().domain([1950,2017]).range([0, width]),
                y = d3.scaleLinear().domain([0,100]).range([height, 0]);

            var xAxis = d3.axisBottom(x)
                yAxis = d3.axisLeft(y);

            var svg = self.div.append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

            var focus = svg.append("g")
                .attr("class", "focus")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var dots = focus.append("g");
                dots.attr("clip-path", "url(#clip)");
                dots.selectAll("dot")
                    .data(new_data)
                    .enter().append("circle")
                    .attr('class', function(d) { return 'dot ' + d.artist; })
                    .attr("r",5)
                    .style("opacity", .5)
                    .attr("cx", function(d) { return x(d.peak_year); })
                    .attr("cy", function(d) { return y(d.norm_streams); })

            focus.append("g")
                  .attr("class", "axis axis--x")
                  .attr("transform", "translate(0," + height + ")")
                  .call(xAxis);

            focus.append("g")
                  .attr("class", "axis axis--y")
                  .call(yAxis);

        };

    }

module.exports = scatterChart;

}());
