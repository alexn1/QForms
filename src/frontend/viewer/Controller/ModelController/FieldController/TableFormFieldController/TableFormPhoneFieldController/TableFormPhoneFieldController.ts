import { TableFormFieldController } from '../TableFormFieldController';
import { TableFormPhoneFieldView } from './TableFormPhoneFieldView';
import { PhoneField } from '../../../../../Model/Field/PhoneField/PhoneField';

export class TableFormPhoneFieldController extends TableFormFieldController<PhoneField> {
    getViewClass() {
        return super.getViewClass() || TableFormPhoneFieldView;
    }
}

// @ts-ignore
window.TableFormPhoneFieldController = TableFormPhoneFieldController;
