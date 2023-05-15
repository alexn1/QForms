import React from 'react';
import { TableFormFieldView } from '../TableFormFieldView';
import { TableFormDateFieldController } from './TableFormDateFieldController';

import './TableFormDateFieldView.less';

export class TableFormDateFieldView extends TableFormFieldView<TableFormDateFieldController> {
    span: React.RefObject<any>;

    render() {
        const row = this.props.row;
        const ctrl = this.getCtrl();
        return (
            <div className={`${this.getCssClassNames()} ellipsis`} style={this.getStyle(row)}>
                <span ref={this.span}>{ctrl.getValueForWidget(row)}</span>
            </div>
        );
    }
}
