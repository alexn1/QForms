"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageLinkEditor = void 0;
const Editor = require('../Editor');
class PageLinkEditor extends Editor {
    static createData(params) {
        return {
            '@class': 'PageLink',
            '@attributes': {
                name: params.name,
                fileName: params.fileName || `pages/${params.name}/${params.name}.json`,
                menu: params.menu || (params.startup === 'true' ? 'Menu' : ''),
                startup: params.startup || 'false'
            }
        };
    }
    getColName() {
        return 'pageLinks';
    }
}
exports.PageLinkEditor = PageLinkEditor;
