'use strict';

class PageController extends ModelController {

    static create(model, view, parent) {
        // console.log('PageController.create', model.getName());
        if (model.data.js) {
            const CustomClass = eval(model.data.js);
            if (!CustomClass) throw new Error(`custom class of "${model.getFullName()}" form does not return type`);
            return new CustomClass(model, view, parent);
        }
        return eval(`new ${model.data.class}Controller(model, view, parent)`);
    }

    constructor(model, view, parent) {
        //console.log('PageController.constructor', model);
        super(model);
        this.view       = view;
        this.parent     = parent;
        this.captionEls = null;
        this.forms      = {};
        this.tab        = null;
    }

    init() {
        const self = this;
        self.captionEls = self.parent.view.querySelectorAll('.{pageId}_caption'.replace('{pageId}', self.model.id));
        $(self.view).find('#{pageId}_TabWidget'.replace('{pageId}', self.model.id)).each(function() {
            new TabWidget(this).init();
        });

        // disable buttons
        $(self.view).find('button.saveAndClose').prop('disabled', !this.model.isNewMode());

        // button click
        $(self.view).find('button.saveAndClose').click(function() {
            self.onSaveAndCloseClick(this);
        });
        $(self.view).find('button.closePage').click(function() {
            self.onClosePageClick(this);
        });

        // forms
        for (const name in self.model.forms) {
            const form = self.model.forms[name];
            const viewId = `#${self.model.id}_${name}`;
            const view = $(self.view).find(viewId).get(0);
            self.forms[name] = FormController.create(form, view, self);
            self.forms[name].init();
        }
    }

    deinit() {
        console.log('PageController.deinit: ' + this.model.getName());
        for (const name in this.forms) {
            this.forms[name].deinit();
        }
    }

    fill() {
        for (const name in this.forms) {
            this.forms[name].fill();
        }
        this.setCaption(this.getCaption());
    }

    async onSaveAndCloseClick(el) {
        console.log('PageController.onSaveAndCloseClick');
        if (this.isValid()) {
            await this.model.update();
            console.log('page model updated');
            this.getApplicationController().onPageClosed({source: this, pageController: this});
        } else {
            for (const name in this.forms) {
                const form = this.forms[name];
                if (form.model.getClassName() === 'RowForm') {
                    form.updateErrorClasses();
                }
            }
        }
    }

    onClosePageClick(e) {
        console.log('PageController.onClosePageClick');
        this.close();
    }

    enableSave() {
        $(this.view).find('button.saveAndClose').prop('disabled', false);
    }

    disableSave() {
        $(this.view).find('button.saveAndClose').prop('disabled', true);
    }

    setCaption(caption) {
        for (let i = 0; i < this.captionEls.length; i++) {
            this.captionEls[i].innerHTML = caption;
        }
        TabWidget.setTabCaption(this.tab, caption);
    }

    getCaption() {
        // console.log('PageController.getCaption', this.model.getName());
        const key = this.model.getKey();
        let caption;
        if (key) {
            caption = this.model.data.caption + ' ' + key;
        } else {
            caption = this.model.data.caption;
        }
        if (this.isChanged()) {
            caption += ' *';
        }
        return caption;
    }

    isValid() {
        let isValid = true;
        for (const name in this.forms) {
            if (!this.forms[name].isValid()) {
                isValid = false;
            }
        }
        return isValid;
    }

    onFormChange(e) {
        console.log('PageController.onFormChange');
        this.setCaption(this.getCaption());
        if (this.isChanged()) {
            if (this.isValid()) {
                this.enableSave();
            } else {
                this.disableSave();
            }
        } else {
            this.disableSave();
        }
    }

    onFormDiscard(formController) {
        console.log('PageController.onFormDiscard', this.model.getName());
        this.setCaption(this.getCaption());
        if (this.isChanged()) {
            this.enableSave();
        } else {
            this.disableSave();
        }
    }

    onFormUpdate(e) {
        console.log('PageController.onFormUpdate');
        this.setCaption(this.getCaption());
        this.disableSave();
    }

    close() {
        console.log('PageController.close');
        if (this.isChanged() && !confirm(this.model.getApp().data.text.form.areYouSure)) return;
        this.getApplicationController().closePage(this);
    }

    async openPage(args) {
        args.parentPage = this.model;
        return await this.parent.openPage(args);
    }

    isChanged() {
        for (const name in this.forms) {
            const form = this.forms[name];
            if (form.isChanged()) {
                console.log(`FORM CHANGED: ${form.model.getFullName()}`);
                return true;
            }
        }
        return false;
    }

    getApplicationController() {
        return this.parent;
    }
}
