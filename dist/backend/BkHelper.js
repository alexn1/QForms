"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BkHelper = void 0;
const fs_1 = __importDefault(require("fs"));
const glob_1 = __importDefault(require("glob"));
const path_1 = __importDefault(require("path"));
const slash_1 = __importDefault(require("slash"));
const safe_1 = __importDefault(require("colors/safe"));
const node_fetch_1 = __importDefault(require("node-fetch"));
function _getFilePathsSync(dirPath, ext) {
    const filePaths = glob_1.default.sync(path_1.default.join(dirPath, '*.' + ext));
    glob_1.default.sync(path_1.default.join(dirPath, '*/')).forEach((subDirPath) => {
        _getFilePathsSync(subDirPath, ext).forEach((fileName) => {
            filePaths.push(fileName);
        });
    });
    return filePaths;
}
async function _getFilePaths2(dirPath, ext, filePaths) {
    // console.debug('_getFilePaths2', dirPath);
    // all files from directory
    const files = await BkHelper._glob(path_1.default.join(dirPath, '*.' + ext));
    // pushing files to output array
    files.forEach((item) => {
        filePaths.push(item);
    });
    // all directories from directory
    const dirs = await BkHelper._glob(path_1.default.join(dirPath, '*/'));
    // for each dir push files to output array
    for (let i = 0; i < dirs.length; i++) {
        const subDirPath = dirs[i];
        await _getFilePaths2(subDirPath, ext, filePaths);
    }
}
class BkHelper {
    static getRandomString(length) {
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            const index = getRandomInt(0, chars.length - 1);
            result += chars.substr(index, 1);
        }
        return result;
    }
    static getFilePathsSync(publicDirPath, subDirPath, ext) {
        return _getFilePathsSync(path_1.default.join(publicDirPath, subDirPath), ext).map((filePath) => {
            return (0, slash_1.default)(path_1.default.relative(publicDirPath, filePath));
        });
    }
    static _glob(path) {
        return new Promise((resolve, reject) => {
            (0, glob_1.default)(path, (err, items) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(items);
                }
            });
        });
    }
    static async getFilePaths(dirPath, ext) {
        // console.debug('BkHelper.getFilePaths');
        const filePaths = [];
        await _getFilePaths2(dirPath, ext, filePaths);
        const relativeFilePaths = filePaths.map((filePath) => {
            return (0, slash_1.default)(path_1.default.relative(dirPath, filePath));
        });
        return relativeFilePaths;
    }
    static currentTime() {
        const now = new Date();
        const arrN = [now.getHours(), now.getMinutes(), now.getSeconds()];
        const arrS = arrN.map((n) => n.toString());
        for (let i = 0; i < arrN.length; i++) {
            if (arrN[i] < 10) {
                arrS[i] = '0' + arrS[i];
            }
        }
        /*
        let hh = now.getHours();
        let mm = now.getMinutes();
        let ss = now.getSeconds();

        let _hh = hh.toString();
        let _mm = mm.toString();
        let _ss = ss.toString();

        if (hh < 10) _hh = '0' + _hh;
        if (mm < 10) _mm = '0' + mm;
        if (ss < 10) _ss = '0' + ss;


        return [_hh, _mm, _ss].join(':');*/
        return arrS.join(':');
    }
    /* static currentDate() {
        const now = new Date();
        let dd   = now.getDate();      if (dd < 10) dd = '0' + dd;
        let mm   = now.getMonth() + 1; if (mm < 10) mm = '0' + mm;   /!*January is 0!*!/
        const yyyy = now.getFullYear();
        return [yyyy, mm, dd].join('-');
    } */
    /* static currentDateTime() {
        return BkHelper.currentDate() + ' ' + BkHelper.currentTime();
    } */
    static templateToJsString(value, params) {
        return value.replace(/\$\{([\w.@]+)\}/g, (text, name) => {
            if (Object.prototype.hasOwnProperty.call(params, name)) {
                return `BkHelper.decodeValue('${BkHelper.encodeValue(params[name])}')`;
            }
            return 'undefined';
        });
    }
    /* static replaceKey(obj, key1, key2) {
        const keys   = Object.keys(obj);
        const values = _.filter(obj, () => {return true;});
        const index  = keys.indexOf(key1);
        if (index !== -1) {
            keys[index] = key2;
            obj = _.object(keys, values);
        }
        return obj;
    } */
    static readTextFile(path) {
        // console.debug(colors.blue('BkHelper.readTextFile'), path);
        return new Promise((resolve, reject) => {
            fs_1.default.readFile(path, 'utf8', (err, content) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(content);
                }
            });
        });
    }
    static async getFileContent(filePath) {
        if (await BkHelper.exists(filePath)) {
            return BkHelper.readTextFile(filePath);
        }
        return null;
    }
    static getFileContentSync(filePath) {
        // console.debug(colors.blue('BkHelper.getFileContentSync'), filePath);
        if (!fs_1.default.existsSync(filePath)) {
            return null;
        }
        return fs_1.default.readFileSync(filePath, 'utf8');
    }
    static readBinaryFile(filePath) {
        console.debug(safe_1.default.blue('BkHelper.readBinaryFile'), filePath);
        return new Promise((resolve, reject) => {
            fs_1.default.readFile(filePath, (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data);
                }
            });
        });
    }
    static createPath(arr) {
        if (arr.length === 0)
            throw new Error('no path elements');
        if (arr.length === 1)
            return '/';
        return arr.join('/');
    }
    static getDirPath(filePath) {
        const arr = filePath.split('/');
        return BkHelper.createPath(arr.slice(0, arr.length - 1));
    }
    static async createDirIfNotExists2(originalDirPath) {
        // console.debug('BkHelper.createDirIfNotExists2', originalDirPath);
        const arr = originalDirPath.split('/');
        for (let i = 1; i <= arr.length; i++) {
            const dirPath = BkHelper.createPath(arr.slice(0, i));
            const exists = await BkHelper.exists(dirPath);
            // console.debug('dirPath', i, dirPath, exists);
            if (!exists) {
                await BkHelper.createDirIfNotExists(dirPath);
            }
        }
    }
    static createDirIfNotExists(dirPath) {
        console.debug(safe_1.default.blue('BkHelper.createDirIfNotExists'), dirPath);
        return new Promise((resolve, reject) => {
            fs_1.default.exists(dirPath, (exists) => {
                if (exists) {
                    resolve();
                }
                else {
                    fs_1.default.mkdir(dirPath, (err) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve();
                        }
                    });
                }
            });
        });
    }
    static createDirIfNotExistsSync(dirPath) {
        // console.debug(colors.blue('BkHelper.createDirIfNotExistsSync'), dirPath);
        if (!fs_1.default.existsSync(dirPath)) {
            fs_1.default.mkdirSync(dirPath);
        }
    }
    /* static moveObjProp(obj, prop, offset) {
        const keys     = _.keys(obj);
        const values   = _.values(obj);
        const oldIndex = keys.indexOf(prop);
        if (oldIndex === -1) {
            throw new Error('cannot find element');
        }
        const newIndex = oldIndex + offset;
        if (newIndex < 0) {
            throw new Error('cannot up top element');
        }
        if (newIndex > values.length - 1) {
            throw new Error('cannot down bottom element');
        }
        keys.splice(newIndex, 0,   keys.splice(oldIndex, 1)[0]);
        values.splice(newIndex, 0, values.splice(oldIndex, 1)[0]);
        return _.object(keys, values);
    } */
    static moveArrItem(arr, item, offset) {
        const oldIndex = arr.indexOf(item);
        if (oldIndex === -1)
            throw new Error('cannot find element');
        const newIndex = oldIndex + offset;
        if (newIndex < 0)
            throw new Error('cannot up top element');
        if (newIndex > arr.length - 1)
            throw new Error('cannot down bottom element');
        arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
    }
    /* static getTempSubDirPath3(tempDirPath) {
        return new Promise((resolve, reject) => {
            const subDirName = BkHelper.getRandomString(8);
            const tempSubSirPath = path.join(tempDirPath, subDirName);
            fs.exists(tempSubSirPath, exists => {
                if (!exists) {
                    fs.mkdir(tempSubSirPath, err => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(tempSubSirPath);
                        }
                    });
                } else {
                    BkHelper.getTempSubDirPath(tempDirPath, () => {
                        resolve();
                    });
                }
            });
        });
    } */
    static copyFile3(source, target) {
        return new Promise((resolve, reject) => {
            const rd = fs_1.default.createReadStream(source);
            rd.on('error', (err) => {
                reject(err);
            });
            const wr = fs_1.default.createWriteStream(target);
            wr.on('error', (err) => {
                reject(err);
            });
            wr.on('close', () => {
                resolve();
            });
            rd.pipe(wr);
        });
    }
    static exists(path) {
        // console.debug(colors.blue('BkHelper.exists'), path);
        return new Promise((resolve) => {
            fs_1.default.exists(path, (exists) => {
                resolve(exists);
            });
        });
    }
    static writeFile(filePath, content) {
        console.debug(safe_1.default.blue('BkHelper.writeFile'), filePath);
        return new Promise((resolve, reject) => {
            fs_1.default.writeFile(filePath, content, 'utf8', (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    static writeFileSync(filePath, content) {
        console.debug(safe_1.default.blue('BkHelper.writeFileSync'), filePath /* , content */);
        return fs_1.default.writeFileSync(filePath, content, 'utf8');
    }
    static async writeFile2(filePath, content) {
        const dirPath = BkHelper.getDirPath(filePath);
        await BkHelper.createDirIfNotExists2(dirPath);
        return await BkHelper.writeFile(filePath, content);
    }
    static mapObject(object, cb) {
        return Object.keys(object).reduce((obj, key) => {
            const [newKey, newVal] = cb(key, object[key]);
            obj[newKey] = newVal;
            return obj;
        }, {});
    }
    static fsUnlink(filePath) {
        return new Promise((resolve, reject) => {
            fs_1.default.unlink(filePath, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    // timeOffset number in minutes
    static today(timeOffset) {
        // console.debug('BkHelper.today', timeOffset);
        let ts = Date.now();
        if (timeOffset !== undefined && timeOffset !== null) {
            ts += BkHelper.MINUTE() * timeOffset;
        }
        const date = new Date(ts);
        ts = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
        if (timeOffset !== undefined && timeOffset !== null) {
            ts -= BkHelper.MINUTE() * timeOffset;
        }
        return new Date(ts);
    }
    static dateTimeReviver(key, value) {
        if (typeof value === 'string') {
            const a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d{3})?(Z|([+-])(\d{2}):(\d{2}))?$/.exec(value);
            if (a)
                return new Date(value);
        }
        return value;
    }
    static decodeValue(rawValue) {
        if (rawValue === undefined)
            throw new Error('decodeValue undefined');
        if (rawValue === null)
            throw new Error('decodeValue null');
        try {
            return JSON.parse(rawValue, BkHelper.dateTimeReviver);
        }
        catch (err) {
            throw new Error(`decodeValue failed: ${rawValue}`);
        }
    }
    static encodeValue(value) {
        return JSON.stringify(value);
    }
    static decodeObject(obj) {
        const dObj = {};
        for (const name in obj) {
            if (typeof obj[name] !== 'string')
                throw new Error(`cannot decode: ${name}, type: ${typeof obj[name]}`);
            dObj[name] = BkHelper.decodeValue(obj[name]);
        }
        return dObj;
    }
    static SECOND() {
        return 1000;
    }
    static MINUTE() {
        return 60 * BkHelper.SECOND();
    }
    static HOUR() {
        return 60 * BkHelper.MINUTE();
    }
    static DAY() {
        return 24 * BkHelper.HOUR();
    }
    static WEEK() {
        return 7 * BkHelper.DAY();
    }
    static Session_save(session) {
        return new Promise((resolve, reject) => {
            session.save((err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    static addMinutes(date, minutes) {
        // console.debug('BkHelper.addMinutes', date, minutes);
        date.setMinutes(date.getMinutes() + minutes);
    }
    static removeTimezoneOffset(date) {
        BkHelper.addMinutes(date, -date.getTimezoneOffset());
    }
    static addTimezoneOffset(date) {
        BkHelper.addMinutes(date, date.getTimezoneOffset());
    }
    static cloneDate(date) {
        return new Date(date.getTime());
    }
    static fillArray(n) {
        return Array.from(Array(n).keys());
    }
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
        return format.replace(/\{([\w.]+)\}/g, (text, name) => values[name] ? values[name] : text);
    }
    static getFirstField(object) {
        const [key] = Object.keys(object);
        if (!key)
            throw new Error('getFirstField: no fields');
        return object[key];
    }
    static getCommandLineParams() {
        return process.argv
            .map((arg) => arg.split('='))
            .reduce((acc, [name, value]) => {
            acc[name] = value;
            return acc;
        }, {});
    }
    static getWebSocketIP(webSocket) {
        return webSocket.upgradeReq.headers['x-real-ip']
            ? webSocket.upgradeReq.headers['x-real-ip']
            : webSocket.upgradeReq.socket.remoteAddress;
    }
    static getWebSocketPort(webSocket) {
        return webSocket.upgradeReq.headers['x-real-port']
            ? webSocket.upgradeReq.headers['x-real-port']
            : webSocket.upgradeReq.socket.remotePort;
    }
    static templateArray(arr) {
        return arr.map((item) => {
            const type = typeof item;
            if (type === 'number' || type === 'boolean') {
                return item;
            }
            if (type === 'string') {
                return `'${item}'`;
            }
            throw new Error(`wrong type for array item: ${type}`);
        });
    }
    /* static createEmptyPromise<T = any>(): EmptyPromise<T> {
        let _resolve, _reject;
        const promise = new EmptyPromise<T>(function (resolve, reject) {
            _resolve = resolve;
            _reject = reject;
        });
        promise.resolve = _resolve;
        promise.reject = _reject;
        return promise;
    } */
    static test() {
        console.debug('BkHelper.test');
    }
    static formatNumber(value) {
        return new Intl.NumberFormat('ru-RU').format(value);
    }
    static formatTime2(_sec) {
        // console.debug('BkHelper.formatTime', sec);
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
        if (h < 10)
            h = '0' + h;
        // @ts-ignore
        if (m < 10)
            m = '0' + m;
        // @ts-ignore
        if (s < 10)
            s = '0' + s;
        if (Math.floor(sec / 3600) === 0) {
            return `${sign}${m}m:${s}s`;
        }
        else {
            return `${sign}${h}h:${m}m:${s}s`;
        }
    }
    static registerGlobalClass(Class) {
        // console.debug('BkHelper.registerGlobalClass', Class.name);
        if (global[Class.name])
            throw new Error(`global.${Class.name} already used`);
        global[Class.name] = Class;
    }
    static getContentFromDataUrl(value) {
        const [type, data] = value.split(';');
        const contentType = type.split(':')[1];
        const base64string = data.split(',')[1];
        // console.debug('base64string:', base64string);
        const buffer = Buffer.from(base64string, 'base64');
        return [contentType, buffer];
    }
    static async post(url, data) {
        const response = await (0, node_fetch_1.default)(url, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (response.ok)
            return await response.json();
        throw new Error(`${response.status} ${response.statusText}: ${await response.text()}`);
    }
}
exports.BkHelper = BkHelper;
// @ts-ignore
global.BkHelper = BkHelper;
