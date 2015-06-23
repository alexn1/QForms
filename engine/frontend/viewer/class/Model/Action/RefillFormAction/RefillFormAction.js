'use strict';

QForms.inherit(RefillFormAction,Action);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
function RefillFormAction(parent,data) {
    Action.call(this,parent,data);
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
RefillFormAction.prototype.exec = function(args,context) {
    context.form.page.forms[this.data.formName].refill();
};