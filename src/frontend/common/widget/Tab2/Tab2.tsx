import {ReactComponent} from '../../ReactComponent';

export class Tab2 extends ReactComponent {
    constructor(props) {
        super(props);
        this.state = {
            active: 0
        };
    }
    getActive() {
        if (this.props.getActive) return this.props.getActive();
        return this.state.active;
    }
    onLiMouseDown = e => {
        // console.log('Tab.onLiMouseDown', e.target);
        if (e.target.classList.contains('close')) return;
        const i = parseInt(e.currentTarget.dataset.i);
        if (this.props.getActive) {
            if (this.props.onTabMouseDown) this.props.onTabMouseDown(i);
        } else {
            if (i !== this.getActive()) {
                this.selectTab(i);
            }
        }
    }
    onLiClick = e => {
        // console.log('Tab.onLiClick', e.target);
        if (e.target.classList.contains('close')) {
            const i = parseInt(e.currentTarget.dataset.i);
            // console.log('close tab:', i);
            if (this.props.onTabClose) this.props.onTabClose(i);
        }
    }
    selectTab(i) {
        if (i === this.getActive()) return;
        const start = Date.now();
        this.setState({active: i}, () => console.log('selectTab time:', Date.now() - start));
    }

    renderTitles() {
        return this.props.tabs.map((tab, i) =>
            <li
                key={tab.name}
                className={`${this.getCssBlockName()}__button ${i === this.getActive() ? 'active' : ''}`}
                onMouseDown={this.onLiMouseDown}
                onClick={this.onLiClick}
                data-i={i}
            >
                <span>{tab.title}</span>
                {this.props.canClose &&
                    <span className="close">&times;</span>
                }
            </li>);
    }
    renderContents() {
        return this.props.tabs.map((tab, i) =>
            <div key={tab.name} className={`${this.getCssBlockName()}__page ${i === this.getActive() ? 'active' : ''}`}>
                {tab.content}
            </div>
        );
    }
    render() {
        return (
            <div className={this.getCssClassNames()}>
                <ul className={`${this.getCssBlockName()}__buttons`}>
                    {this.props.tabs && this.renderTitles()}
                </ul>
                <div className={`${this.getCssBlockName()}__pages`}>
                    {this.props.tabs && this.renderContents()}
                </div>
            </div>
        );
    }
}

// @ts-ignore
window.Tab = Tab;
