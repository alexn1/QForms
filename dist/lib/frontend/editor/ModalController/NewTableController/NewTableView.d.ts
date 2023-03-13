/// <reference types="react" />
import { ReactComponent } from '../../../common';
export declare class NewTableView extends ReactComponent {
    name: any;
    constructor(props: any);
    onCreate: (e?: any) => Promise<void>;
    onKeyDown: (e: any) => void;
    render(): JSX.Element;
}
