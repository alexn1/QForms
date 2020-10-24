'use strict';

class RowFormController extends FormController {
    constructor(model, parent) {
        super(model, parent);
        this.state = {
            updated: Date.now(),
            mode   : 'edit',
            hasNew : false,
            changed: false,
            valid  : true
        };
    }

    init() {
        super.init();
        this.model.on('refresh', this.listeners.refresh = this.onModelRefresh);
        this.model.on('insert' , this.listeners.insert  = this.onModelInsert);
        this.model.on('update' , this.listeners.update  = this.onModelUpdate);
        if (this.model.getDataSource().getClassName() === 'SqlDataSource') this.state.mode = 'view';
        this.calcState();
    }

    deinit() {
        // console.log('RowFormController.deinit', this.model.getFullName());
        this.model.off('refresh', this.listeners.refresh);
        this.model.off('insert' , this.listeners.insert);
        this.model.off('update' , this.listeners.update);
        super.deinit();
    }

    onActionsClick = async li => {
        // console.log('Toolbar.onActionsClick:', li);
        const action = this.model.data.actions[li.dataset.action];
        const result = await this.onActionClick(action, this.model.getRow());
        if (!result) alert(`no handler for ${action.name}`);
    }

    calcState() {
        this.state.hasNew  = this.model.hasNew();
        this.state.changed = this.isChanged();
        this.state.valid   = this.isValid();
        if (this.state.hasNew) {
            this.state.mode = 'edit';
        }
        // console.log('changed:', changed);
        // console.log('hasNew:', hasNew);
    }

    getActions() {
        return Object.keys(this.model.data.actions).map(name => {
            const action = this.model.data.actions[name];
            return {
                name : action.name,
                title: action.caption
            };
        });
    }

    refill() {
        console.log('RowFormController.refill', this.model.getFullName());
        for (const name in this.fields) {
            this.fields[name].refill();
        }
    }

    onModelRefresh = e => {
        console.log('RowFormController.onModelRefresh', this.model.getFullName());
        this.refill();
        this.invalidate();
        this.rerender();
    }

    onModelInsert = e => {
        console.log('RowFormController.onModelInsert', this.model.getFullName());
        this.refill();
        this.invalidate();
        this.calcState();
        this.parent.onFormInsert(e);
    }

    onModelUpdate = e => {
        console.log('RowFormController.onModelUpdate', this.model.getFullName());
        this.refill();
        this.invalidate();
        this.calcState();
        this.parent.onFormUpdate(e);
    }

    isValid() {
        // console.log('RowFormController.isValid', this.model.getFullName());
        for (const name in this.fields) {
            const field = this.fields[name];
            if (!field.isValid()) return false;
        }
        return true;
    }

    onSaveClick = async () => {
        console.log('RowFormController.onSaveClick');
        for (const name in this.fields) {
            this.fields[name].validate();
        }
        if (this.isValid()) {
            await this.model.update();
        } else {
            console.error(`cannot update invalid row form: ${this.model.getFullName()}`);
            this.rerender();
        }
    }

    onDiscardClick = () => {
        console.log('RowFormController.onDiscardClick', this.model.getFullName());
        const changedFields = [];
        const row = this.model.getRow();
        for (const name in this.fields) {
            const field = this.fields[name];
            if (field.isChanged(row) || !field.isValid()) {
                changedFields.push(field);
            }
        }

        if (this.model.getDataSource().isChanged()) {
            this.model.getDataSource().discard();
        }

        // refill changed fields
        changedFields.forEach(field => {
            field.refill();
        });

        // ui
        this.calcState();
        this.rerender();

        // event
        this.parent.onFormDiscard(this);
    }

    onRefreshClick = async () => {
        // console.log('RowFormController.onRefreshClick', this.model.getFullName());
        await this.model.getDataSource().refresh();
    }

    isChanged() {
        // console.log('RowFormController.isChanged', this.model.getFullName());
        if (this.model.isChanged()) return true;
        const row = this.model.getRow();
        for (const name in this.fields) {
            const field = this.fields[name];
            if (field.isChanged(row)) return true;
        }
        return false;
    }

    onFieldChange(e) {
        console.log('RowFormController.onFieldChange', this.model.getFullName());
        this.calcState();
        this.invalidate();
        super.onFieldChange(e);
    }

    async onActionClick(action, row) {
        console.log('RowFormController.onActionClick', action, row);
    }

    onEditClick = e => {
        // console.log('RowFormController.onEditClick', this);
        this.state.mode = 'edit';
        this.rerender();
    }
    onCancelClick = e => {
        // console.log('RowFormController.onCancelClick', this);
        this.state.mode = 'view';
        this.rerender();
    }
}

