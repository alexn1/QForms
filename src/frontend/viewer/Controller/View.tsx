import { ReactComponent } from '../../common';

export abstract class View extends ReactComponent {
    constructor(props) {
        super(props);
        if (!props.ctrl) throw new Error(`${this.constructor.name}: no ctrl`);
        if (!props.onCreate) throw new Error(`${this.constructor.name}: no onCreate`);
    }
    getCtrl() {
        return this.props.ctrl;
    }
}
