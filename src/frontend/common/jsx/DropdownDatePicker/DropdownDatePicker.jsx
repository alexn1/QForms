class DropdownDatePicker extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="DropdownDatePicker">
                <input readOnly/>
                <div className="close">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">
                        <line x1="2" y1="2" x2="8" y2="8" stroke="#aaa" strokeWidth="1.1" strokeLinecap="round"
                              strokeMiterlimit="10"></line>
                        <line x1="8" y1="2" x2="2" y2="8" stroke="#aaa" strokeWidth="1.1" strokeLinecap="round"
                              strokeMiterlimit="10"></line>
                    </svg>
                </div>
            </div>
        );
    }
}
