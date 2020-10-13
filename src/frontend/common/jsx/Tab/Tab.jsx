class Tab extends ReactComponent {
    constructor(props) {
        super(props);
        this.state = {
            active: 0
        };
    }
    onLiMouseDown = e => {
        // console.log('Tab.onLiMouseDown', e.currentTarget.dataset.i);
        const i = parseInt(e.currentTarget.dataset.i);
        this.selectTab(i);
    }
    selectTab(i) {
        const start = new Date().getTime();
        this.setState({active: i}, () => console.log('selectTab time:', new Date().getTime() - start));
    }
    getClassName() {
        return [
            'Tab',
            ...(this.props.classList ? this.props.classList : [])
        ].join(' ');
    }
    renderTitles() {
        return this.props.tabs.map((tab, i) =>
        <li
            key={tab.name}
            className={i === this.state.active ? 'active' : null}
            onMouseDown={this.onLiMouseDown}
            data-i={i}
        >
            <span>{tab.title}</span>
            {this.props.canClose && <span className='close'>&times;</span>}
        </li>);
    }
    renderContents() {
        return this.props.tabs.map((tab, i) =>
        <div key={tab.name} className={i === this.state.active ? 'active' : null}>
            {tab.content}
        </div>);
    }
    render() {
        return (
            <div className={this.getClassName()}>
                <ul>
                    {this.props.tabs && this.renderTitles()}
                </ul>
                <div>
                    {this.props.tabs && this.renderContents()}
                </div>
            </div>
        );
    }
}
