class TextBox extends ReactComponent {
    constructor(props) {
        // console.log('TextBox.constructor', props);
        super(props);
        this.el = React.createRef();
        this.state = {
            value: this.props.value || ''
        }
    }
    getValue() {
        return this.state.value;
    }
    _setValue(value) {
        this.state.value = value;
        // this.setState({value: this.state.value});   // rerender
        this.forceUpdate();
        if (this.props.onChange) {
            this.props.onChange(value);
        }
    }
    onChange = e => {
        // console.log('TextBox.onChange', e.target.value);
        this._setValue(e.target.value);
    }
    shouldComponentUpdate(nextProps, nextState) {
        // console.log('TextBox.shouldComponentUpdate', 'nextProps:', nextProps, 'nextState:', nextState);
        this.state.value = nextProps.value;
        return true;
    }
    render() {
        // console.log('TextBox.render');
        return (
            <input
                ref={this.el}
                className={this.getCssClassNames()}
                type={this.props.type || 'text'}
                id={this.props.id}
                name={this.props.name}
                readOnly={this.props.readOnly}
                disabled={this.isDisabled()}
                placeholder={this.props.placeholder}
                autoFocus={this.props.autoFocus}
                spellCheck={this.props.spellCheck}
                autoComplete={this.props.autocomplete}
                required={this.props.required}
                value={this.state.value}
                onFocus={this.props.onFocus}
                onBlur={this.props.onBlur}
                onChange={this.onChange}
            />
        );
    }
}

window.QForms.TextBox = TextBox;
