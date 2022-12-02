import {FormView} from '../FormView';

export class RowFormView extends FormView {
    renderToolbar() {
        // console.log('RowFormView.renderToolbar');
        const ctrl = this.props.ctrl;
        const text = ctrl.getModel().getApp().getText();
        return (
            <div className={`${this.getCssBlockName()}__toolbar flex grid-gap-5`}>
                {ctrl.model.hasDefaultSqlDataSource() &&
                    <Button
                        key="edit"
                        classList={['toolbar-button']}
                        onClick={ctrl.onEditClick}
                        visible={ctrl.getMode() === 'view'}
                    >
                        {/*<EditIcon/>*/}
                        <div>{text.form.edit}</div>
                    </Button>
                }
                {ctrl.model.hasDefaultSqlDataSource() &&
                    <Button
                        key="save"
                        classList={['toolbar-button']}
                        enabled={(ctrl.state.changed || ctrl.state.hasNew) && ctrl.state.valid}
                        onClick={ctrl.onSaveClick}
                        visible={ctrl.getMode() === 'edit'}
                    >
                        {/*<SaveIcon/>*/}
                        <div>{text.form.save}</div>
                    </Button>
                }
                {ctrl.model.hasDefaultSqlDataSource() && ctrl.model.getKey() &&
                    <Button
                        key="cancel"
                        classList={['toolbar-button']}
                        visible={ctrl.getMode() === 'edit' && !ctrl.state.changed && ctrl.state.valid}
                        onClick={ctrl.onCancelClick}
                    >
                        {/*<CancelIcon/>*/}
                        <div>{text.form.cancel}</div>
                    </Button>
                }
                {ctrl.model.hasDefaultSqlDataSource() && ctrl.model.getKey() &&
                    <Button
                        key="discard"
                        classList={['toolbar-button']}
                        enabled={ctrl.state.changed || !ctrl.isValid()}
                        onClick={ctrl.onDiscardClick}
                        visible={ctrl.getMode() === 'edit' && (ctrl.state.changed || !ctrl.state.valid)}
                    >
                        {/*<CloseIcon2/>*/}
                        <div>{text.form.discard}</div>
                    </Button>
                }
                {ctrl.model.hasDefaultSqlDataSource() && ctrl.getModel().getAttr('refreshButton') === 'true' &&
                    <Button
                        key="refresh"
                        classList={['toolbar-button']}
                        enabled={!ctrl.state.changed && !ctrl.state.hasNew}
                        onClick={ctrl.onRefreshClick}
                        visible={ctrl.getMode() === 'view'}
                    >
                        {/*<RefreshIcon/>*/}
                        <div>{text.form.refresh}</div>
                    </Button>
                }
                {this.isActionsVisible() && ctrl.model.hasActions() &&
                    <DropdownButton
                        classList={['toolbar-dropdown-button']}
                        actions={this.getActionsForDropdownButton()}
                        onClick={this.onActionsClick}
                        enabled={this.isActionsEnabled()}
                    >
                        <MoreVertIcon/>
                    </DropdownButton>
                }
            </div>
        );
    }
    isActionsEnabled() {
        // return this.getCtrl().state.mode === 'view';
        return true;
    }
    isActionsVisible() {
        if (this.getCtrl().getModel().hasDefaultSqlDataSource()) {
            return !!this.getCtrl().getModel().getKey();
        }
        return true;
    }
    renderLabel(fieldCtrl) {
        const model = fieldCtrl.getModel();
        const name = model.getName();
        return <div key={`label.${name}`} className={`${this.getCssBlockName()}__label`}>
            {model.getCaption()}:
            {model.isNotNull() && <span style={{color: 'red'}}>*</span>}
        </div>;
    }
    renderField(fieldCtrl) {
        // console.log('RowFormView.renderField', fieldCtrl.model.getClassName());
        const name = fieldCtrl.getModel().getName();
        return <div key={`field.${name}`} className={`${this.getCssBlockName()}__field`}>
            {this.renderFieldView(fieldCtrl)}
        </div>;
    }
    renderFieldView(fieldCtrl) {
        return RowFormView.renderFieldView(fieldCtrl);
    }
    static renderFieldView(fieldCtrl) {
        /*return React.createElement(fieldCtrl.getViewClass(), {
            onCreate: fieldCtrl.onViewCreate,
            ctrl: fieldCtrl,
        });*/
        return fieldCtrl.renderView();
    }
    renderError(fieldCtrl) {
        // console.log('RowFormView.renderError:', fieldCtrl.state);
        const name = fieldCtrl.getModel().getName();
        return <div key={`tooltip.${name}`} className={`${this.getCssBlockName()}__error`}>
            <Tooltip position="left" type="alert" hidden={fieldCtrl.getErrorMessage() === null} tip={fieldCtrl.getErrorMessage()}/>
        </div>;
    }
    renderGroup(fieldCtrl) {
        return [
            this.renderLabel(fieldCtrl),
            this.renderField(fieldCtrl),
            this.renderError(fieldCtrl)
        ];
        /*return <div key={fieldCtrl.getModel().getName()} className={`${this.getCssClassNames()}__group`}>
            {this.renderLabel(fieldCtrl)}
            {this.renderField(fieldCtrl)}
            {this.renderError(fieldCtrl)}
        </div>;*/
    }
    renderGroups() {
        // console.log('RowFormView.renderGroups');
        const ctrl = this.getCtrl();
        return <div className={`${this.getCssBlockName()}__groups`}>
            {Object.keys(ctrl.fields).filter(name => ctrl.getField(name).isVisible()).map(name => {
                return this.renderGroup(ctrl.getField(name));
            })}
        </div>;
    }
    render() {
        console.log('RowFormView.render', this.getCtrl().getModel().getFullName());
        return <div className={`${this.getCssClassNames()} flex-column grid-gap-5`} style={this.getStyle()}>
            {(this.getCtrl().getModel().hasDefaultSqlDataSource() || this.getCtrl().getModel().hasActions()) && this.renderToolbar()}
            {this.renderGroups()}
        </div>;
    }
    /*renderActionIcon() {
        return <CancelIcon/>;
    }*/
}

window.RowFormView = RowFormView;
