import { TableFormFieldController } from '../TableFormFieldController';
import { TableFormTimeFieldView } from './TableFormTimeFieldView';
import { TimeBox } from '../../../../../../common';
import { TimeField } from '../../../../../Model/Field/TimeField/TimeField';
import { Helper } from '../../../../../../common/Helper';

export class TableFormTimeFieldController extends TableFormFieldController<TimeField> {
    getViewClass() {
        return super.getViewClass() || TableFormTimeFieldView;
    }

    getValueForWidget(row) {
        const value = this.model.getValue(row);
        return TimeBox.getStringValue(value);
    }
}

Helper.registerGlobalClass(TableFormTimeFieldController);
