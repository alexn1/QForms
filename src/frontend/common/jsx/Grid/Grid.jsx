class Grid extends ReactComponent {
    constructor(props) {
        super(props);
        this.state = {
            column: 1,
            row: 0
        };
    }
    isRowActive(i) {
        return i === this.state.row;
    }
    isCellActive(i, j) {
        return i === this.state.row && j === this.state.column;
    }
    onCellMouseDown = e => {
        // console.log('Grid.onCellMouseDown', e.currentTarget.dataset);
        const [i, j] = JSON.parse(e.currentTarget.dataset.rc);
        this.setState({row: i, column: j});
    }
    onCellDoubleClick = e => {
        // console.log('Grid.onCellDoubleClick');
        const [i, j] = JSON.parse(e.currentTarget.dataset.rc);
        const row = this.props.rows[i];
        console.log('row:', row);
    }
    onRowMouseDown = e => {
        // console.log('Grid.onRowMouseDown', e.currentTarget.dataset);
        const i = parseInt(e.currentTarget.dataset.r);
        this.setState({row: i});
    }
    onRowDoubleClick = e => {
        // console.log('Grid.onRowDoubleClick');
        const i = parseInt(e.currentTarget.dataset.r);
        const row = this.props.rows[i];
        console.log('row:', row);
    }
    renderColumns() {
        return this.props.columns.map((column, i) => <td key={column.name} style={{width: `${column.width}px`}}>
            <div>{column.title}</div>
            <span className="resize"></span>
        </td>);
    }
    renderRow(row, i) {
        return (
            <tr
                key={row[this.props.options.keyColumn].toString()}
                className={`${this.isRowActive(i) ? 'active' : ''}`}
            >
                {this.props.columns.map((column, j) =>
                    <td
                        key={column.name}
                        style={{width: `${column.width}px`}}
                        className={`${this.isCellActive(i, j) ? 'active' : ''}`}
                        data-rc={`[${i},${j}]`}
                        onMouseDown={this.onCellMouseDown}
                        onDoubleClick={this.onCellDoubleClick}
                    >
                        <div className="TableFormTextBoxFieldView">
                            <span>{row[column.name]}</span>
                        </div>
                    </td>)}
                <td
                    data-r={i}
                    onMouseDown={this.onRowMouseDown}
                    onDoubleClick={this.onRowDoubleClick}

                />
            </tr>
        );
    }
    render() {
        return (
            <div className="Grid">
                <div className="head">
                    <table>
                        <tbody>
                            <tr>
                                {this.renderColumns()}
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="block"/>
                <div className="body">
                    <table>
                        <tbody>
                            {this.props.rows.map((row, i) => this.renderRow(row, i))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}
