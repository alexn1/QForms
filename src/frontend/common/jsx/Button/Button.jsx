class Button extends ReactComponent {
    constructor(props) {
        // console.log('Button.constructor', props);
        super(props);
        this.state = {disabled: false};
    }
    isDisabled() {
        if (this.props.enabled !== undefined) return !this.props.enabled;
        // if (this.props.isDisabled) return this.props.isDisabled(this.props.name);
        return this.state.disabled;
    }
    /*shouldComponentUpdate(nextProps, nextState) {
        if (this.props.enabled !== undefined) {
            return this.props.enabled !== nextProps.enabled;
        }
        return this.state.disabled !== nextState.disabled;
    }*/
    /*disable() {
        // console.log('Button.disable');
        return new Promise(resolve => this.setState({disabled: true}, resolve));
    }*/
    /*enable() {
        // console.log('Button.enable');
        return new Promise(resolve => this.setState({disabled: false}, resolve));
    }*/
    /*setDisabled(value) {
        if (typeof value !== 'boolean') throw new Error('value must be boolean');
        return new Promise(resolve => {
            if (this.state.disabled === value) {
                resolve();
            } else {
                this.setState({disabled: value}, resolve)
            }
        });
    }*/
    /*setEnabled(value) {
        if (typeof value !== 'boolean') throw new Error('value must be boolean');
        return new Promise(resolve => {
            if (this.state.disabled === !value) {
                resolve();
            } else {
                this.setState({disabled: !value}, resolve)
            }
        });
    }*/
    onClick = e => {
        // console.log('Button.onClick', e);
        if (this.props.onClick) this.props.onClick(e);
    }
    isVisible() {
        return this.props.visible;
    }
    render() {
        // console.log('Button.render', this.props.title, this.props);
        return (
            <button
                name={this.props.name}
                disabled={this.isDisabled()}
                onClick={this.onClick}
                style={{
                    display: this.isVisible() === false ? 'none' : 'inline-block',
                    width: this.props.width
                }}
            >{this.props.title || this.props.children}</button>
        );
    }
}
