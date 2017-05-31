'use strict';

var _ = require('underscore');
var moment = require('moment-timezone');

// Put your project specific utility functions here
module.exports = {

    getTitle: function(data) {

        var titles = _.values(data.title);

        return titles;
    },

    formatPublishTime: function (time) {
        return module.exports.formatTime(time, 'MMM D, YYYY', 'America/New_York')
    },

    sortByDate: function(data) {

        var latest = _.sortBy(data, function(d) {

            return d.pub_date;
            
        }).reverse();

        return latest;

    },

    countActive: function(data) {

        var active = data.filter(function(val) {

            return val.status == 'active';

        }).length;

        return active;

    },

    countArchived: function(data) {

        var archived = data.filter(function(val) {

            return val.status == 'archived';

        }).length;

        return archived;

    }

};