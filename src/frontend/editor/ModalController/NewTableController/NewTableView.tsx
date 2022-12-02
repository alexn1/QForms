import {ReactComponent, TextBox} from '../../../common';

export class NewTableView extends ReactComponent {
    name: any;
    constructor(props) {
        super(props);
        this.name = null;
    }
    onCreate = async e => {
        // console.log('NewParamView.onCreate');
        await this.props.ctrl.onCreate({
            name: this.name.getValue()
        });
    }
    render() {
        const ctrl = this.props.ctrl;
        return <div className={`${this.getCssClassNames()} NewModelView`}>
            <div className={'NewModelView__header'}>
                <div className={'NewModelView__title'}>New Table</div>
                <button type="button" className="close" onClick={ctrl.onClose}><span>&times;</span></button>
            </div>
            <div className={'NewModelView__body'}>
                <div>
                    <label htmlFor="tableName">Name</label>
                    <TextBox id="tableName" onCreate={c => this.name = c}/>
                </div>
            </div>
            <div className={'NewModelView__footer'}>
                <button type="button" onClick={ctrl.onClose}>Close</button>
                <button name="create" type="button" onClick={this.onCreate}>Create</button>
            </div>
        </div>;
    }
}
