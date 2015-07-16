'use strict';

QForms.inherit(RowForm, Form);

////////////////////////////////////////////////////////////////////////////////////////////////////
function RowForm(name, page, data) {
    Form.call(this, name, page, data);
    this.row = null;
};

////////////////////////////////////////////////////////////////////////////////////////////////////
RowForm.prototype.init = function() {
    Form.prototype.init.call(this);
    if (this.page.newMode) {
        var row = {};
        this.defaultValuesToRow(row);
        this.dataSource.newRow(row);
    } else {
        if (!this.dataSource.data.rows[0]) {
            throw new Error('[' + this.getFullName() + '] no row in RowForm');
        }
        this.row = this.dataSource.data.rows[0];
        // dump row values to page params
        this.fillParams(this.row);
    }
};

////////////////////////////////////////////////////////////////////////////////////////////////////
Form.prototype.fillParams = function(row) {
    for (var name in this.fields) {
        this.fields[name].valueToParams(row);
    }
};

////////////////////////////////////////////////////////////////////////////////////////////////////
RowForm.prototype.onDataSourceChanged = function(eventArgs) {
    Form.prototype.onDataSourceChanged.call(this, eventArgs);
    var dataSource = eventArgs.object;
    if (dataSource.name === 'default') {
        this.eventChanged.fire(new QForms.Event(this));
    }
};

////////////////////////////////////////////////////////////////////////////////////////////////////
RowForm.prototype.onDataSourceUpdated = function(eventArgs) {
    Form.prototype.onDataSourceUpdated.call(this, eventArgs);
    this.fillParams(this.row);
    this.eventUpdated.fire(new QForms.Event(this));
};

////////////////////////////////////////////////////////////////////////////////////////////////////
RowForm.prototype.getFullName = function() {
    return [this.page.name, this.name].join('.');
};

////////////////////////////////////////////////////////////////////////////////////////////////////
RowForm.prototype.getFieldValue = function(fieldName) {
    return this.fields[fieldName].getValue(this.row);
};