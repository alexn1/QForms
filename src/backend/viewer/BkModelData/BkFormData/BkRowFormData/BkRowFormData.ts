import { BkFormData } from '../BkFormData';

export interface BkRowFormData extends BkFormData {
    '@attributes': {
        name: string;
        caption: string;
        visible: string;
        cssBlock: string;
        viewClass: string;
        ctrlClass: string;
        modelClass: string;
        newMode: string;
        backOnly: string;
        refreshButton: string;
    };
}
