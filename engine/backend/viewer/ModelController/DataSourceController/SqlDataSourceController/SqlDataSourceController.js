'use strict';

module.exports = SqlDataSourceController;

var util   = require('util');
var path   = require('path');
var sqlish = require('sqlish');
var mysql  = require('mysql');
var _      = require('underscore');

var helper               = require('../../../../common/helper');
var DataSourceController = require('../DataSourceController');
var FormController       = require('../../FormController/FormController');

util.inherits(SqlDataSourceController, DataSourceController);

////////////////////////////////////////////////////////////////////////////////////////////////////
function SqlDataSourceController(data, parent) {
    SqlDataSourceController.super_.call(this, data, parent);
    this.desc        = null;
    this.aiFieldName = null;
    this.database    = this.getApp().databases[this.data['@attributes'].database];
};

////////////////////////////////////////////////////////////////////////////////////////////////////
SqlDataSourceController.create = function(data, parent, callback) {
    if (parent instanceof FormController) {
        var form = parent;
        var customClassFilePath = path.join(
            form.page.application.dirPath,
            'pages',
            form.page.name,
            'forms',
            form.name,
            'dataSources',
            data['@attributes'].name,
            data['@attributes'].name + '.backend.js'
        );
        helper.getFileContent(customClassFilePath, function(content) {
            if (content) {
                var customClass = eval(content);
                callback(new customClass(data, parent));
            } else {
                callback(new SqlDataSourceController(data, parent));
            }
        });
    } else {
        callback(new SqlDataSourceController(data, parent));
    }
};

////////////////////////////////////////////////////////////////////////////////////////////////////
SqlDataSourceController.prototype.query = function(context, query, params, callback, select) {
    console.log({dsName: this.name, query: query, params: params});
    this.database.query(context, query, params, callback, select);
};

////////////////////////////////////////////////////////////////////////////////////////////////////
SqlDataSourceController.prototype._desc = function(context, callback) {
    var self = this;
    this.desc = {};
    var query = 'desc `{table}`'.replace('{table}',this.data['@attributes'].table);
    this.query(context, query, null, function(rows) {
        rows.forEach(function(info) {
            self.desc[info.Field] = info;
            if (info.Extra === 'auto_increment') {
                self.aiFieldName = info.Field;
            }
        });
        callback();
    }, true);
};

////////////////////////////////////////////////////////////////////////////////////////////////////
SqlDataSourceController.prototype.select = function(context, callback) {
    var access = this.getAccessToken(context);
    if (access.select === false) {
        throw new Error('[{fullName}]: access denied.'.template({
            fullName: this.getFullName()
        }));
    }
    var query  = this.replaceThis(context, this.data['@attributes'].query);
    var params = this.getParams(context);
    this.query(context, query, params, function(rows) {
        callback(rows);
    }, true);
};

////////////////////////////////////////////////////////////////////////////////////////////////////
SqlDataSourceController.prototype.selectCount = function(context, callback) {
    var access = this.getAccessToken(context);
    if (access.select === false) {
        throw new Error('[{fullName}]: access denied.'.template({
            fullName: this.getFullName()
        }));
    }
    var query  = this.replaceThis(context, this.data['@attributes'].countQuery);
    var params = this.getParams(context);
    this.query(context, query, params, function(rows) {
        var row = rows[0];
        var count = row[Object.keys(row)[0]];
        callback(count);
    }, true);
};

////////////////////////////////////////////////////////////////////////////////////////////////////
SqlDataSourceController.prototype.update = function(context, callback) {
    var access = this.getAccessToken(context);
    if (access.update === false) {
        throw new Error('[{fullName}]: access denied.'.template({
            fullName: this.getFullName()
        }));
    }
    var row = context.row;
    var self = this;
    var updateRow = function() {
        var values = {};
        for (var column in row) {
            // if exists in table and not key column
            if (self.desc[column] !== undefined && self.keyColumns.indexOf(column)) {
                values[column] = row[column];
            }
        }
        var query = new sqlish.Sqlish()
            .update(self.data['@attributes'].table)
            .set(values)
            .where(self.getRowKeyValues(row))
            .toString();
        self.query(context, query, null, callback, false);
    };
    if (!this.desc) {
        this._desc(context, updateRow);
    } else {
        updateRow();
    }
};

////////////////////////////////////////////////////////////////////////////////////////////////////
SqlDataSourceController.prototype.insert = function(context, callback) {
    var access = this.getAccessToken(context);
    if (access.insert === false) {
        throw new Error('[{fullName}]: access denied.'.template({
            fullName: this.getFullName()
        }));
    }
    var row = context.row;
    var self = this;
    var insertRow = function() {
        // removing auto increment field
        for (var column in row) {
            if (column === self.aiFieldName) {
                delete row[column];
                break;
            }
        }
        var query = new sqlish.Sqlish()
            .insert(self.data['@attributes'].table, row)
            .toString();
        self.query(context, query,  null, function(result) {
            var key = JSON.stringify([result.insertId]);
            callback(key);
        }, false);
    };
    if (!this.desc) {
        this._desc(context, insertRow);
    } else {
        insertRow();
    }
};

////////////////////////////////////////////////////////////////////////////////////////////////////
SqlDataSourceController.prototype.delete = function(context, callback) {
    var access = this.getAccessToken(context);
    if (access.delete === false) {
        throw new Error('[{fullName}]: access denied.'.template({
            fullName: this.getFullName()
        }));
    }
    var row = context.row;
    var query = new sqlish.Sqlish()
        .deleteFrom(this.data['@attributes'].table)
        .where(this.getRowKeyValues(row))
        .toString();
    this.query(context, query, null, callback, false);
};