import { RowFormFieldView } from '../RowFormFieldView';
import { TextArea } from '../../../../../../common';
import { RowFormTextAreaFieldController } from './RowFormTextAreaFieldController';
import './RowFormTextAreaFieldView.less';

export class RowFormTextAreaFieldView extends RowFormFieldView<RowFormTextAreaFieldController> {
    constructor(props) {
        super(props);
        this.state = {
            classList: [],
        };
    }
    onFocus = async e => {
        // console.log('RowFormTextAreaFieldView.onFocus');
        this.addCssClass('focus');
        await this.rerender();
    };
    onBlur = async e => {
        // console.log('RowFormTextAreaFieldView.onBlur');
        this.removeCssClass('focus');
        await this.rerender();
    };
    render() {
        // console.log('RowFormTextAreaFieldView.render', this.state);
        const ctrl = this.props.ctrl;
        return (
            <div className={this.getCssClassNames()}>
                <TextArea
                    classList={[`${this.getCssBlockName()}__textarea`]}
                    onCreate={this.onWidgetCreate}
                    value={ctrl.getValueForWidget()}
                    readOnly={!ctrl.isEditable()}
                    disabled={!ctrl.isEditable()}
                    onChange={ctrl.onChange}
                    placeholder={ctrl.getPlaceholder()}
                    rows={ctrl.model.getRows()}
                    cols={ctrl.model.getCols()}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                />
            </div>
        );
    }
}

// @ts-ignore
window.RowFormTextAreaFieldView = RowFormTextAreaFieldView;
