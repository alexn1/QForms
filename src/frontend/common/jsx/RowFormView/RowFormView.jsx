class RowFormView extends ReactComponent {
    renderToolbar() {
        // console.log('Toolbar.renderToolbar');
        const ctrl = this.props.ctrl;
        const width = '90px';
        return (
            <div className="Toolbar">
                {ctrl.model.getDataSource().getClassName() === 'SqlDataSource' &&
                [
                    <Button
                        key="edit"
                        title="Edit"
                        onClick={ctrl.onEditClick}
                        visible={ctrl.state.mode === 'view'}
                        width={width}
                    />,
                    <Button
                        key="save"
                        title="Save"
                        enabled={(ctrl.state.changed || ctrl.state.hasNew) && ctrl.state.valid}
                        onClick={ctrl.onSaveClick.bind(ctrl)}
                        visible={ctrl.state.mode === 'edit'}
                        width={width}
                    />,
                    <Button
                        key="cancel"
                        title="Cancel"
                        visible={ctrl.state.mode === 'edit' && !ctrl.state.changed && ctrl.state.valid}
                        onClick={ctrl.onCancelClick}
                        width={width}
                    />,
                    <Button
                        key="discard"
                        title="Discard"
                        enabled={ctrl.state.changed || !ctrl.isValid()}
                        onClick={ctrl.onDiscardClick.bind(ctrl)}
                        visible={ctrl.state.mode === 'edit' && (ctrl.state.changed || !ctrl.state.valid)}
                        width={width}
                    />,
                    <Button
                        key="refresh"
                        title="Refresh"
                        enabled={!ctrl.state.changed && !ctrl.state.hasNew}
                        onClick={ctrl.onRefresh.bind(ctrl)}
                        visible={ctrl.state.mode === 'view'}
                        width={width}
                    />
                ]
                }
                {Object.keys(ctrl.model.data.actions).length > 0 &&
                <DropdownButton actions={ctrl.getActions()} onClick={ctrl.onActionsClick}/>
                }
            </div>
        );
    }
    renderFieldLabel(model) {
        return (
            <div key={`label.${model.getName()}`} className={`label ${model.getName()}`}>
                {model.data.caption}:
                {model.isNotNull() && <span style={{color: 'red'}}>*</span>}
            </div>
        );
    }
    renderFieldTooltip(model, ctrl) {
        // console.log('renderFieldTooltip:', ctrl.state);
        return (
            <div key={`tooltip.${model.getName()}`} className={`tooltip ${model.getName()}`}>
                <Tooltip position="left" type="alert" hidden={ctrl.state.error === null} tip={ctrl.state.error}/>
            </div>
        );
    }
    renderFormGrid() {
        // console.log('FormGrid.render');
        const ctrl = this.props.ctrl;
        const model = ctrl.model;
        // console.log('model:', model);
        return (
            <div className="FormGrid">
                {Object.keys(model.fields).map(name => {
                    const fieldModel = model.fields[name];
                    const fieldCtrl  = ctrl.fields[name];
                    // console.log('fieldModel:', fieldModel);
                    return [
                        this.renderFieldLabel(fieldModel),
                        <RowFormFieldView key={`field.${fieldModel.getName()}`} ctrl={fieldCtrl}/>,
                        this.renderFieldTooltip(fieldModel, fieldCtrl)
                    ];
                })}
            </div>
        );
    }
    render() {
        console.log('RowFormView.render', this.props.ctrl.model.getFullName());
        const ctrl = this.props.ctrl;
        const model = ctrl.model;
        return (
            <div className={`RowFormView ${model.getName()}`}>
                {this.renderToolbar()}
                {this.renderFormGrid()}
            </div>
        );
    }
}
