'use strict';

////////////////////////////////////////////////////////////////////////////////////////////////////
function Control(data, parent) {
    this.name   = data.name;
    this.form   = parent;
    this.data   = data;
    this.parent = parent;
};

////////////////////////////////////////////////////////////////////////////////////////////////////
Control.prototype.init = function() {
};