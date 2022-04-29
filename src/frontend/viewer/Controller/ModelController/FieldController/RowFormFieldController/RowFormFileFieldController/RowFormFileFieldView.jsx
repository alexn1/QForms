class RowFormFileFieldView extends RowFormFieldView {
    constructor(props) {
        super(props);
        this.image = React.createRef();
        this.div   = React.createRef();
    }
    getImage() {
        return this.image.current;
    }
    getDiv() {
        return this.div.current;
    }
    updateSize() {
        if (this.getImage()) {
            const ns = this.getImage().getNaturalSize();
            this.getDiv().innerText = `${ns[0]}×${ns[1]}`;
        }
    }
    onClearClick = e => {
        this.props.ctrl.onChange('');
    }
    onChange = async e => {
        const file = e.target.files[0];
        const widgetValue = await Helper.readFileAsDataURL(file);
        // console.log('widgetValue:', widgetValue);
        this.props.ctrl.onChange(widgetValue);
    }
    onImageClick = async e => {
        console.log('RowFormFileFieldView.onImageClick');
        const ctrl = this.props.ctrl;
        const app = ctrl.getApp();
        const src = ctrl.getValueForWidget();
        const imageDialogCtrl = new ImageDialogController({
            app,
            id: app.getNewId(),
            src,
            onClose: () => {
                console.log('onClose');
                this.getCtrl().getPage().getView().getElement().focus();
            }
        });
        await app.openModal(imageDialogCtrl);
    }
    render() {
        const ctrl = this.getCtrl();
        const row = ctrl.getRow();
        const value = ctrl.getValueForWidget();
        return <div className={this.getCssClassNames()} style={this.getStyle(row)}>
            {!!value &&
                <div className={`${this.getCssBlockName()}__image-block`}>
                    <Image classList={[`${this.getCssBlockName()}__image`]} ref={this.image} src={value} onClick={this.onImageClick}/>
                    <span className={`${this.getCssBlockName()}__size`} ref={this.div}></span>
                    <span className={`${this.getCssBlockName()}__length`}>{Helper.formatNumber(value.length)}</span>
                </div>
            }
            <input type="file" onChange={this.onChange} disabled={!ctrl.isEditable()}/>
            {!!value &&
                <Button onClick={this.onClearClick} enabled={ctrl.isEditable()}>Clear</Button>
            }
        </div>;
    }
    componentDidMount() {
        // console.log('RowFormFileFieldView.componentDidMount', this.props.ctrl.model.getFullName());
        setTimeout(() => this.updateSize(), 0);
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        // console.log('RowFormFileFieldView.componentDidUpdate', this.props.ctrl.model.getFullName(), snapshot);
        setTimeout(() => this.updateSize(), 0);
    }
}
window.QForms.RowFormFileFieldView = RowFormFileFieldView;
