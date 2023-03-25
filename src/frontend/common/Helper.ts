import React from 'react';
import ReactDOM from 'react-dom';
import { JSONString } from '../../types';
import { ReactComponent } from './ReactComponent';

export class Helper {
    /*static currentDate() {
        const now = new Date();
        let dd = now.getDate();if (dd < 10) dd = '0' + dd;
        let mm = now.getMonth()+1;if (mm < 10) mm = '0' + mm;   /!*January is 0!*!/
        const yyyy = now.getFullYear();
        return [yyyy, mm, dd].join('-');
    }*/

    /*static currentDateTime() {
        return Helper.currentDate() + ' ' + Helper.currentTime();
    }*/

    /*static currentTime() {
        const now = new Date();
        let hh = now.getHours();if (hh < 10) hh = '0' + hh;
        let mm = now.getMinutes();if (mm < 10) mm = '0' + mm;
        let ss = now.getSeconds();if (ss < 10) ss = '0' + ss;
        return [hh, mm, ss].join(':');
    }*/

    static formatDate(date, format) {
        const YYYY = date.getFullYear();
        const M = date.getMonth() + 1;
        const D = date.getDate();
        const h = date.getHours();
        const m = date.getMinutes();
        const s = date.getSeconds();
        const MM = M < 10 ? `0${M}` : M;
        const DD = D < 10 ? `0${D}` : D;
        const hh = h < 10 ? `0${h}` : h;
        const mm = m < 10 ? `0${m}` : m;
        const ss = s < 10 ? `0${s}` : s;
        const values = { YYYY, M, D, h, m, s, MM, DD, hh, mm, ss };
        return format.replace(/\{([\w\.]+)\}/g, (text, name) =>
            values[name] ? values[name] : text,
        );
    }

    static formatNumber(value: number): string {
        return new Intl.NumberFormat('ru-RU').format(value);
    }

    static today() {
        const now = new Date();
        // return new Date(now.getFullYear(), now.getMonth(), now.getDate());
        return Helper.getStartOfDay(now);
    }

    static getStartOfDay(date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    static encodeObject(obj) {
        const eObj = {};
        for (const name in obj) {
            eObj[name] = Helper.encodeValue(obj[name]);
        }
        return eObj;
    }

    static encodeValue(value: any): JSONString {
        return JSON.stringify(value) as JSONString;
    }

    static decodeObject(eObj): any {
        if (!eObj) throw new Error('Helper.decodeObject: no object');
        const obj = {};
        for (const name in eObj) {
            obj[name] = Helper.decodeValue(eObj[name]);
        }
        return obj;
    }

    static decodeValue(raw: JSONString) {
        try {
            return JSON.parse(raw, Helper.dateTimeReviver);
        } catch (err) {
            // console.log('raw:', raw);
            throw err;
        }
    }

    static dateTimeReviver(key, value) {
        if (typeof value === 'string') {
            const a =
                /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d{3})?(Z|([+-])(\d{2}):(\d{2}))?$/.exec(
                    value,
                );
            if (a) return new Date(value);
        }
        return value;
    }

    static createReactComponent(rootElement: Element, type, props = {}, children?): ReactComponent {
        // console.log('Helper.createReactComponent', rootElement, type);
        let component: ReactComponent;
        const reactRootElement = React.createElement(React.StrictMode, {}, [
            React.createElement(
                type,
                {
                    ...props,
                    onCreate: (c: ReactComponent, name: string) => {
                        component = c;
                    },
                } as any,
                children,
            ),
        ]);
        ReactDOM.render(reactRootElement, rootElement);
        return component;
    }

    static createReactComponent2(
        rootElement: Element,
        type,
        props = {},
        children?,
    ): ReactComponent {
        // console.log('Helper.createReactComponent2', rootElement, type);
        let component: ReactComponent;
        const reactRootElement = React.createElement(React.StrictMode, {}, [
            React.createElement(
                type,
                {
                    ...props,
                    onCreate: (c: ReactComponent, name: string) => {
                        component = c;
                    },
                } as any,
                children,
            ),
        ]);
        // ReactDOM.render(reactRootElement, rootElement);
        ReactDOM.hydrate(reactRootElement, rootElement);
        return component;
    }

    static destroyReactComponent(root) {
        ReactDOM.unmountComponentAtNode(root);
    }

    static readFileAsDataURL(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(file);
        });
    }

    /*static readFileAsArrayBuffer(file) {
        return new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsArrayBuffer(file);
        });
    }*/

    /*static convertBufferToBase64string(buffer) {
        const array = new Uint8Array(buffer);
        const binaryString = String.fromCharCode.apply(null, array);
        return window.btoa(binaryString);
    }*/

    /*static createObjectUrl(buffer) {
        const blob = new Blob([new Uint8Array(buffer)]);
        return window.URL.createObjectURL(blob);
    }*/

    // append file as filed and all not file as json string
    /*static createFormData(body) {
        const formData = new FormData();
        const fields = {};
        for (const name in body) {
            if (body[name] instanceof File) {
                formData.append(name, body[name]);
            } else {
                fields[name] = body[name];
            }
        }
        formData.append('__json', JSON.stringify(fields));
        return formData;
    }*/

    /*static base64ToArrayBuffer(base64) {
        const binaryString = window.atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }*/

    static templateToJsString(value, params) {
        return value.replace(/\$\{([\w\.@]+)\}/g, (text, name) => {
            if (params.hasOwnProperty(name)) {
                return `Helper.decodeValue('${Helper.encodeValue(params[name])}')`;
            }
            return 'undefined';
        });
    }

    static moveArrItem(arr, item, offset) {
        const oldIndex = arr.indexOf(item);
        if (oldIndex === -1) throw new Error('cannot find element');
        const newIndex = oldIndex + offset;
        if (newIndex < 0) throw new Error('cannot up top element');
        if (newIndex > arr.length - 1) throw new Error('cannot down bottom element');
        arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
    }

    static formatTime(_sec) {
        // console.log('Helper.formatTime', sec);
        let sec = _sec;
        let sign = '';
        if (_sec < 0) {
            sec = -sec;
            sign = '-';
        }
        let h = Math.floor(sec / 3600);
        let m = Math.floor((sec - h * 3600) / 60);
        let s = Math.floor(sec - h * 3600 - m * 60);
        // @ts-ignore
        if (h < 10) h = '0' + h;
        // @ts-ignore
        if (m < 10) m = '0' + m;
        // @ts-ignore
        if (s < 10) s = '0' + s;
        if (Math.floor(sec / 3600) === 0) {
            return `${sign}${m}:${s}`;
        } else {
            return `${sign}${h}:${m}:${s}`;
        }
    }

    static formatTime2(_sec) {
        // console.log('Helper.formatTime', sec);
        let sec = _sec;
        let sign = '';
        if (_sec < 0) {
            sec = -sec;
            sign = '-';
        }
        let h = Math.floor(sec / 3600);
        let m = Math.floor((sec - h * 3600) / 60);
        let s = Math.floor(sec - h * 3600 - m * 60);
        // @ts-ignore
        if (h < 10) h = '0' + h;
        // @ts-ignore
        if (m < 10) m = '0' + m;
        // @ts-ignore
        if (s < 10) s = '0' + s;
        if (Math.floor(sec / 3600) === 0) {
            return `${sign}${m}m:${s}s`;
        } else {
            return `${sign}${h}h:${m}m:${s}s`;
        }
    }

    static SECOND() {
        return 1000;
    }

    static MINUTE() {
        return 60 * Helper.SECOND();
    }

    static HOUR() {
        return 60 * Helper.MINUTE();
    }

    static DAY() {
        return 24 * Helper.HOUR();
    }

    static WEEK() {
        return 7 * Helper.DAY();
    }

    static fallbackCopyTextToClipboard(text) {
        // console.log('Helper.fallbackCopyTextToClipboard', text);
        const activeElement = document.activeElement;
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.top = '0'; // Avoid scrolling to bottom
        textArea.style.left = '0';
        textArea.style.position = 'fixed';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        // @ts-ignore
        activeElement.focus();
    }

    static async copyTextToClipboard(text) {
        console.log('Helper.copyTextToClipboard', text);
        if (!navigator.clipboard) {
            Helper.fallbackCopyTextToClipboard(text);
            return;
        }
        await navigator.clipboard.writeText(text);
    }

    static addMinutes(date, minutes) {
        // console.log('Helper.addMinutes', date, minutes);
        date.setMinutes(date.getMinutes() + minutes);
    }

    static removeTimezoneOffset(date: Date) {
        Helper.addMinutes(date, -date.getTimezoneOffset());
    }

    static addTimezoneOffset(date) {
        Helper.addMinutes(date, date.getTimezoneOffset());
    }

    static cloneDate(date: Date) {
        return new Date(date.getTime());
    }

    static fillArray(n: number) {
        return Array.from(Array(n).keys());
    }

    // static inIframe(): boolean {
    //     return false;
    //     /* try {
    //         return window.self !== window.top;
    //     } catch (e) {
    //         return false;
    //     } */
    // }

    static setCookie(name: string, value: string | number | boolean, time: number) {
        var expires = '';
        if (time) {
            var date = new Date(time);
            // date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = '; expires=' + date.toUTCString();
        }
        document.cookie = name + '=' + (encodeURIComponent(value) || '') + expires + '; path=/';
    }

    static getCookie(name: string): string | undefined {
        var nameEQ = name + '=';
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0)
                return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
        return undefined;
    }

    static eraseCookie(name: string) {
        document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    static delay(ms = 1000) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    static registerGlobalClass(Class) {
        // console.log('Helper.registerGlobalClass', Class.name);
        if (typeof window === 'object') {
            if (window[Class.name]) throw new Error(`window.${Class.name} already used`);
            window[Class.name] = Class;
        } else {
            if (global[Class.name]) throw new Error(`global.${Class.name} already used`);
            global[Class.name] = Class;
        }
    }

    static getGlobalClass(className: string): any {
        // console.log('Helper.getGlobalClass', className);
        return typeof window === 'object' ? window[className] : global[className];
    }

    static addClassToDocumentElement(className) {
        if (typeof document === 'object') {
            document.documentElement.classList.add(className);
        }
    }
}

Helper.registerGlobalClass(Helper);
