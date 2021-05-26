class FrontHostApp {
    constructor(data) {
        console.log('FrontHostApp.constructor', data);
        this.data = data;
        if (data) {
            FrontHostApp.env = data.env;
        }
        window.onerror = FrontHostApp.errorHandler;
        window.onunhandledrejection = (e) => {
            // console.log('window.onunhandledrejection', e.constructor.name);
            const err = e instanceof Error ? e : e.reason || e.detail.reason;
            console.error('unhandled rejection:', err);
            alert(err.message);
        };
        //window.onbeforeunload = FrontHostApp.exit;
    }
    init() {
        // console.log('FrontHostApp.init');
        const application = new Application(this.data);
        application.init();
        const root = document.querySelector(`.${application.getName()}-app__root`);
        const applicationController = ApplicationController.create(application);
        applicationController.init();
        applicationController.createView(root);
    }

    static exit(evt) {
        const message = 'After refreshing or closing of page, all opened pages and unsaved data will be lost.';
        if (typeof evt === 'undefined') {
            evt = window.event;
        }
        if (evt) {
            evt.returnValue = message;
        }
        return message;
    }

    static errorHandler(errorMsg) {
        console.error('FrontHostApp.errorHandler:', errorMsg);
        let msg;
        if (FrontHostApp.env === 'development') {
            msg = 'FrontHostApp Error Handler:\n' + errorMsg;
            if (arguments[4] !== undefined && arguments[4].stack !== undefined) {
                const stack = arguments[4].stack;
                msg += '\n\nstack:\n' + stack;
                console.error('stack:', stack);
            }
        } else {
            msg = errorMsg;
        }
        alert(msg);
    }

    static async doHttpRequest(data) {
        console.warn('FrontHostApp.doHttpRequest', 'POST', window.location.href, data);
        const result = await FrontHostApp.postJson(window.location.href, data);
        console.warn(`result ${data.page}.${data.form}.${data.ds || data.name}.${data.action}:`, result);
        return result;
    }

    static async postJson(url, data) {
        return await FrontHostApp.post(url, JSON.stringify(data), 'application/json;charset=utf-8');
    }

    static async post(url, body, contentType) {
        try {
            FrontHostApp.startWait();
            const res = await fetch(url, {
                method: 'POST',
                body  : body,
                ...(contentType ? {headers: {'Content-Type': contentType}} : {}),
            });
            if (res.ok) return await res.json();
            throw new Error(`${res.status} ${res.statusText}: ${await res.text()}`);
        } finally {
            FrontHostApp.stopWait();
        }
    }

    static startWait() {
        document.querySelector('html').classList.add('wait');
    }
    static stopWait() {
        document.querySelector('html').classList.remove('wait');
    }
    static insertNewNodeAt(parent, child, i) {
        if (i < 0 || i > parent.children.length) {
            throw new Error('invalid index i = ' + i + ', length = ' + parent.childNodes.length);
        } else if (i === parent.children.length) {
            parent.appendChild(child);
        } else {
            parent.insertBefore(child, parent.children[i]);
        }
    }

    /*static elementIndex(el) {
        const children = el.parentNode.childNodes;
        for (let i = 0; i < children.length; i++) if (children[i] === el) return i;
        return -1;
    }*/

    static moveNode(parent, child, oldIndex, newIndex) {
        if (oldIndex < 0 || oldIndex >= parent.children.length || newIndex < 0 || newIndex >= parent.children.length) {
            throw new Error('invalid index');
        } else {
            if (newIndex < oldIndex) {
                parent.insertBefore(child, parent.children[newIndex]);
            } else {
                parent.insertBefore(child, parent.children[newIndex+1]);
            }
        }
    }

    /*static moveArrayElement(arr, oldIndex, newIndex) {
        arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
        return arr;
    }*/

    /*static merge(o1, o2) {
        const oN = {};
        for (const name in o1) {
            oN[name] = o1[name];
        }
        for (const name in o2) {
            oN[name] = o2[name];
        }
        return oN;
    }*/

    /*static keyToParams(key, paramName = 'key') {
        if (typeof key !== 'string') throw new Error('key not string');
        const params = {};
        const arr = JSON.parse(key);
        if (arr.length === 1) {
            params[paramName] = arr[0];
        } else  if (arr.length > 1) {
            for (let i = 0; i < arr.length; i++) {
                params[`${paramName}${i + 1}`] = arr[i];
            }
        } else {
            throw new Error(`invalid key: ${key}`);
        }
        return params;
    }*/

    /*static now() {
      return new Date();
    }*/

    static render(view, data) {
        return new EJS({text: view}).render(data);
    }
}
