import { ReactComponent } from '../../ReactComponent';
import { Helper } from '../../Helper';
import { LeftIcon } from '../../icon/LeftIcon';
import { RightIcon } from '../../icon/RightIcon';
import './DatePicker.less';

// props
//  visible boolean true
//  selectedDate array [2021, 0, 1]
//  minDate array [2021, 0, 1]
//  onMouseDown function
//  onDateSelected function
//  getDateStyle function
//  selectToday boolean false
//  highlightedDate array [2021, 0, 1]
export class DatePicker extends ReactComponent {
    MONTH: string[];

    constructor(props) {
        // console.debug('DatePicker.constructor', props);
        super(props);
        if (this.props.minDate && !(this.props.minDate instanceof Array))
            throw new Error('minDate must be array');
        this.state = { selectedMonth: this.calcSelectedMonth() };
        this.MONTH = [
            'Январь',
            'Февраль',
            'Март',
            'Апрель',
            'Май',
            'Июнь',
            'Июль',
            'Август',
            'Сентябрь',
            'Октябрь',
            'Ноябрь',
            'Декабрь',
        ];
    }

    static createDateFromArr(arr) {
        return new Date(arr[0], arr[1], arr[2]);
    }

    isVisible() {
        if (this.props.visible === false) return false;
        return true;
    }

    calcSelectedMonth() {
        // console.debug('DatePicker.calcSelectedMonth', this.props.selectedDate);
        if (this.props.selectedDate) {
            return [this.props.selectedDate[0], this.props.selectedDate[1]];
        } else if (this.props.highlightedDate) {
            return [this.props.highlightedDate[0], this.props.highlightedDate[1]];
        } else {
            const dates = [Helper.today().getTime()];
            if (this.props.minDate)
                dates.push(DatePicker.createDateFromArr(this.props.minDate).getTime());
            // if (this.props.selectedDate) dates.push(DatePicker.createDateFromArr(this.props.selectedDate).getTime());
            // if (this.props.selectedMonth) dates.push(new Date(this.props.selectedMonth[0], this.props.selectedMonth[1], 1).getTime());
            const date = new Date(Math.min(...dates));
            // console.debug('date:', date);
            return [date.getFullYear(), date.getMonth()];
        }
    }

    static getTodayArr() {
        return DatePicker.dateToArray(new Date());
    }

    static dateToArray(date) {
        return [date.getFullYear(), date.getMonth(), date.getDate()];
    }

    static getDay(date) {
        let day = date.getDay() - 1;
        if (day === -1) day = 6;
        if (day === 0) day = 7;
        return day;
    }

    createSelectedDate() {
        if (!this.isDateSelected()) throw new Error('date not selected');
        // @ts-ignore
        return new Date(...this.props.selectedDate);
    }

    isDateSelected() {
        return !!this.props.selectedDate;
    }

    getFirstDateOfTable() {
        const date = new Date(this.state.selectedMonth[0], this.state.selectedMonth[1], 1); // first day of month
        date.setDate(date.getDate() - DatePicker.getDay(date)); // first day of table
        return date;
    }

    createMinDate() {
        if (!this.props.minDate) throw new Error('no min date');
        return new Date(this.props.minDate[0], this.props.minDate[1], this.props.minDate[2]);
    }

    isMinDate() {
        return !!this.props.minDate;
    }

    isPrevAllowed() {
        const prev = new Date(this.state.selectedMonth[0], this.state.selectedMonth[1]);
        prev.setMonth(prev.getMonth() - 1);
        return this.isMonthAllowed(prev);
    }

    isMonthAllowed(month) {
        if (this.isMinDate()) {
            const minMonth = new Date(this.props.minDate[0], this.props.minDate[1]);
            return month.getTime() >= minMonth.getTime();
        }
        return true;
    }

    onClick = (e) => {
        console.debug('DatePicker.onClick', e.target);
        if (e.target.nodeName === 'TD' && e.target.classList.contains('selectable')) {
            return this.onDateClick(e.target);
        }
    };

    onMouseDown = (e) => {
        // console.debug('DatePicker.onMouseDown');
        if (this.props.onMouseDown) {
            return this.props.onMouseDown(e);
        }
    };

    onDateClick(target) {
        // console.debug('DatePicker.onDateClick', target.dataset.date);
        if (this.props.onDateSelected) {
            this.props.onDateSelected(JSON.parse(target.dataset.date));
        }
    }

    onNextClick = (e) => {
        // console.debug('DatePicker.next');
        this.setState((prevState) => {
            const next = new Date(prevState.selectedMonth[0], prevState.selectedMonth[1]);
            next.setMonth(next.getMonth() + 1);
            return {
                selectedMonth: [next.getFullYear(), next.getMonth()],
            };
        });
    };

    onPrevClick = (e) => {
        // console.debug('DatePicker.prev');
        this.setState((prevState) => {
            const prev = new Date(prevState.selectedMonth[0], prevState.selectedMonth[1]);
            prev.setMonth(prev.getMonth() - 1);
            return {
                selectedMonth: [prev.getFullYear(), prev.getMonth()],
            };
        });
    };

    render() {
        // console.debug('DatePicker.render', this.props, this.state);
        const date = this.getFirstDateOfTable();
        const today = Helper.today();
        const minDate = this.isMinDate() ? this.createMinDate() : null;
        const selectedDate = this.isDateSelected() ? this.createSelectedDate() : null;
        // @ts-ignore
        const highlightedDate = this.props.highlightedDate
            ? // @ts-ignore
              new Date(...this.props.highlightedDate)
            : null;
        return (
            <table
                className={`${this.getCssClassNames()} ${this.isVisible() ? 'visible' : ''}`}
                onClick={this.onClick}
                onMouseDown={this.onMouseDown}>
                <caption className={`${this.getCssBlockName()}__caption`}>
                    <div className={`${this.getCssBlockName()}__caption-content`}>
                        <div
                            className={`${this.getCssBlockName()}__caption-link ${
                                this.isPrevAllowed() ? 'enabled' : ''
                            }`}
                            onClick={this.onPrevClick}>
                            <LeftIcon size={18} />
                        </div>
                        <span className={`${this.getCssBlockName()}__caption-title`}>{`${
                            this.MONTH[this.state.selectedMonth[1]]
                        }, ${this.state.selectedMonth[0]}`}</span>
                        <div
                            className={`${this.getCssBlockName()}__caption-link enabled`}
                            onClick={this.onNextClick}>
                            <RightIcon size={18} />
                        </div>
                    </div>
                </caption>
                <thead>
                    <tr>
                        <th className={`${this.getCssBlockName()}__th`}>Пн</th>
                        <th className={`${this.getCssBlockName()}__th`}>Вт</th>
                        <th className={`${this.getCssBlockName()}__th`}>Ср</th>
                        <th className={`${this.getCssBlockName()}__th`}>Чт</th>
                        <th className={`${this.getCssBlockName()}__th`}>Пт</th>
                        <th className={`${this.getCssBlockName()}__th weekend`}>Сб</th>
                        <th className={`${this.getCssBlockName()}__th weekend`}>Вс</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from(Array(6).keys()).map((i) => (
                        <tr key={i}>
                            {Array.from(Array(7).keys()).map((j) => {
                                const classList: string[] = [];
                                if (j === 5 || j === 6) classList.push('weekend');
                                if (this.isSelectToday() && date.getTime() === today.getTime())
                                    classList.push('today');
                                if (date.getMonth() !== this.state.selectedMonth[1])
                                    classList.push('out');
                                if (!minDate) classList.push('selectable');
                                else if (date.getTime() >= minDate.getTime())
                                    classList.push('selectable');
                                if (selectedDate && date.getTime() === selectedDate.getTime())
                                    classList.push('selected');
                                if (highlightedDate && highlightedDate.getTime() === date.getTime())
                                    classList.push('highlight');
                                const text = date.getDate().toString();
                                const dataDate = JSON.stringify(DatePicker.dateToArray(date));
                                const style = this.props.getDateStyle
                                    ? this.props.getDateStyle(date)
                                    : null;
                                date.setDate(date.getDate() + 1);
                                return (
                                    <td
                                        key={text}
                                        className={`${this.getCssBlockName()}__td  ${classList.join(
                                            ' ',
                                        )}`}
                                        style={style}
                                        data-date={dataDate}>
                                        {text}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

    isSelectToday() {
        if (this.props.selectToday === false) return false;
        return true;
    }
}

if (typeof window === 'object') {
    // @ts-ignore
    window.DatePicker = DatePicker;
}
