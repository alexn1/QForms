'use strict';

module.exports = DataSource;

var util = require('util');
var _    = require('underscore');

var Model       = require('../Model');
var Application = require('../Application/Application');
var Page        = require('../Page/Page');
var Form        = require('../Form/Form');
var RowForm     = require('../Form/RowForm/RowForm');

util.inherits(DataSource, Model);

////////////////////////////////////////////////////////////////////////////////////////////////////
function DataSource(data, parent) {
    DataSource.super_.call(this, data, parent);
    this.application      = parent instanceof Application ? parent : null;
    this.page             = parent instanceof Page        ? parent : null;
    this.form             = parent instanceof Form        ? parent : null;
    this.keyColumns       = [];
    this.parentKeyColumns = [];
    this.dataAdapter      = null;
};

////////////////////////////////////////////////////////////////////////////////////////////////////
DataSource.create = function(data, parent, callback) {
    callback(new DataSource(data, parent));
};

////////////////////////////////////////////////////////////////////////////////////////////////////
DataSource.prototype.init = function(callback) {
    var self = this;
    DataSource.super_.prototype.init.call(this, function() {
        if (self.data.keyColumns === undefined || Object.keys(self.data.keyColumns).length === 0) {
            throw new Error('[' + self.getFullName() + ']: Data Source must have at least one key column.');
        }
        self.keyColumns = Object.keys(self.data.keyColumns);
        if (self.data.parentKeyColumns) {
            self.parentKeyColumns = Object.keys(self.data.parentKeyColumns);
        }
        callback();
    });
};

////////////////////////////////////////////////////////////////////////////////////////////////////
DataSource.prototype.fill = function(args, callback) {
    var self = this;
    DataSource.super_.prototype.fill.call(this, args, function(response) {
        response.keyColumns = self.keyColumns;
        if (self.parentKeyColumns.length > 0) {
            response.parentKeyColumns = self.parentKeyColumns;
        }
        if (args.newMode) {
            response.rows = [];
            callback(response);
        } else {
            var params = {};
            _.extend(params, args.params);
            _.extend(params, args.queryTime.params);
            self.dataAdapter.select(params, function(rows) {
                response.rows = rows;
                if (self.form && self.form instanceof RowForm && rows[0]) {
                    self.form.dumpRowToParams(rows[0], args.queryTime.params);
                }
                callback(response);
            });
        }
    });
};

////////////////////////////////////////////////////////////////////////////////////////////////////
DataSource.prototype.refill = function(params, callback) {
    this.dataAdapter.select(params, function(rows) {
        callback({
            rows:rows
        });
    });
};

////////////////////////////////////////////////////////////////////////////////////////////////////
DataSource.prototype.update = function(row, callback) {
    this.dataAdapter.update(row, callback);
};

////////////////////////////////////////////////////////////////////////////////////////////////////
DataSource.prototype.insert = function(row, callback) {
    this.dataAdapter.insert(row, function(key) {
        callback(key);
    });
};

////////////////////////////////////////////////////////////////////////////////////////////////////
DataSource.prototype.delete = function(row, callback) {
    this.dataAdapter.delete(row, callback);
};

////////////////////////////////////////////////////////////////////////////////////////////////////
DataSource.prototype.getApp = function() {
    if (this.parent instanceof Application) {
        return this.parent;
    } else if (this.parent instanceof Page) {
        return this.parent.parent;
    } else if (this.parent instanceof Form) {
        return this.parent.parent.parent;
    } else {
        throw new Error('wrong parent');
    }
};

////////////////////////////////////////////////////////////////////////////////////////////////////
DataSource.prototype.getPool = function() {
    return this.getApp().getPool(this.data['@attributes'].database);
};

////////////////////////////////////////////////////////////////////////////////////////////////////
DataSource.prototype.getRowKeyValues = function(row) {
    var values = {};
    this.keyColumns.forEach(function(column) {
        values[column] = row[column];
    });
    return values;
};

////////////////////////////////////////////////////////////////////////////////////////////////////
DataSource.prototype.getRowNonKeyValues = function(row) {
    var values = {};
    for (var column in row) {
        if (this.keyColumns.indexOf(column) === -1) {
            values[column] = row[column];
        }
    }
    return values;
};

////////////////////////////////////////////////////////////////////////////////////////////////////
DataSource.prototype.getFullName = function() {
    if (this.form) {
        return [this.form.page.name, this.form.name, this.name].join('.');
    } else if (this.page) {
        return [this.page.name, this.name].join('.');
    } else {
        return this.name;
    }
};

////////////////////////////////////////////////////////////////////////////////////////////////////
DataSource.prototype.getQuery = function(params) {
    return this.replaceThis(this.data['@attributes'].query);
};

////////////////////////////////////////////////////////////////////////////////////////////////////
DataSource.prototype.replaceThis = function(query) {
    // for form data sources only
    if (this.form) {
        var self = this;
        return query.replace(/\{([\w\.]+)\}/g, function (text, name) {
            var arr = name.split('.');
            if (arr[0] === 'this') {
                arr[0] = self.form.page.name;
            }
            return '{' + arr.join('.') + '}';
        });
    } else {
        return query;
    }
};