'use strict';

const path    = require('path');
const Form   = require('../Form');

class TableForm extends Form {

    constructor(data, parent) {
        super(data, parent);
        this.viewFilePath = path.join(
            this.getApp().hostApp.publicDirPath,
            'viewer/class/Controller/ModelController/FormController/TableFormController/view',
            this.data['@class'] + 'View.ejs'
        );
    }

    static async create(data, parent) {
        return new TableForm(data, parent);
    }

    // async fill(context) {
    //     console.log('TableForm.fill', this.constructor.name, this.name);
    //     return super.fill(context);
    // }

}

module.exports = TableForm;
