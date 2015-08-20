'use strict';

module.exports = KeyColumnEditorController;

var util = require('util');
var path = require('path');
var fs   = require('fs');
var _    = require('underscore');

var server = require('../../../../server');

var EditorController = require('../EditorController');

util.inherits(KeyColumnEditorController, EditorController);

////////////////////////////////////////////////////////////////////////////////////////////////////
function KeyColumnEditorController(appInfo) {
    KeyColumnEditorController.super_.call(this, appInfo);
    this.viewDirPath = path.join(
        server.get('public'),
        'editor/class/Controller/ModelController/KeyColumnController'
    );
};

////////////////////////////////////////////////////////////////////////////////////////////////////
KeyColumnEditorController.prototype._new = function(params, callback) {
    this.getApplicationEditor(function(appEditor) {
        if (params.page) {
            appEditor.getPageByFileName(params.page, function(pageEditor) {
                if (params.form) {
                    var formEditor = pageEditor.getForm(params.form);
                    var keyColumnData = formEditor.newDataSouceKeyColumn(params);
                    pageEditor.save(function() {
                        callback(keyColumnData);
                    });
                } else {
                    var dataSourceEditor = pageEditor.getDataSource(params.dataSource);
                    var keyColumnData = dataSourceEditor.newKeyColumn(params);
                    pageEditor.save(function() {
                        callback(keyColumnData);
                    });
                }
            });
        } else {
            var dataSourceEditor = appEditor.getDataSource(params.dataSource);
            var keyColumnData = dataSourceEditor.newKeyColumn(params);
            appEditor.appFile.save(function() {
                callback(keyColumnData);
            });
        }
    });
};

////////////////////////////////////////////////////////////////////////////////////////////////////
KeyColumnEditorController.prototype.save = function(params, callback) {
    this.getApplicationEditor(function(appEditor) {
        appEditor.getPageByFileName(params.pageFileName, function(pageEditor) {
            var formEditor = pageEditor.getForm(params.form);
            formEditor.setDataSourceKeyColumnAttr(params['dataSource'], params['keyColumn'], params['attr'], params['value']);
            pageEditor.save(function() {
                callback(null);
            });
        });
    });
};

////////////////////////////////////////////////////////////////////////////////////////////////////
KeyColumnEditorController.prototype.delete = function(params, callback) {
    this.getApplicationEditor(function(appEditor) {
        appEditor.getPageByFileName(params.page, function(pageEditor) {
            var formEditor = pageEditor.getForm(params['form']);
            pageEditor.pageFile.deleteFormDataSourceKeyColumn(params['dataSource'], params['keyColumn']);
            pageEditor.save(function() {
                callback(null);
            });
        });
    });
};