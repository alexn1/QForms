import { BkForm } from '../BkForm';
import { Context } from '../../../../Context';
import { BkRowFormScheme } from '../../../BkModelScheme/BkFormScheme/BkRowFormScheme/BkRowFormScheme';

export class BkRowForm extends BkForm<BkRowFormScheme> {
    // constructor(data, parent) {
    //     super(data, parent);
    //     // console.debug('RowForm.constructor', this.getFullName());
    // }

    // async fill(context) {
    //     console.debug('RowForm.fill', this.constructor.name, this.getFullName());
    //     return super.fill(context);
    // }

    isNewMode(context: Context): boolean {
        if (this.isAttr('newMode')) {
            const newMode = this.getAttr('newMode');
            if (newMode === 'true') return true;
            if (newMode === 'false') return false;
        }
        return super.isNewMode(context);
    }

    fillAttributes(response: any): void {
        super.fillAttributes(response);
        response.newMode = this.getAttr('newMode');
        response.refreshButton = this.getAttr('refreshButton');
    }
}
