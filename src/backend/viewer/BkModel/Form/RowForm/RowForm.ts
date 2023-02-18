import { BkForm } from '../Form';
import { Context } from '../../../../Context';

export class BkRowForm extends BkForm {
    // constructor(data, parent) {
    //     super(data, parent);
    //     // console.log('RowForm.constructor', this.getFullName());
    // }

    // async fill(context) {
    //     console.log('RowForm.fill', this.constructor.name, this.getFullName());
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
