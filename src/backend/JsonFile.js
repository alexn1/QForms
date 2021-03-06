const Helper = require('./Helper');
const BaseModel = require('./BaseModel');

class JsonFile {
    constructor(filePath, data) {
        this.filePath = filePath;
        this.content  = null;
        this.data     = data || null;
    }

    async create() {
        const exists = await Helper.exists(this.filePath);
        if (exists) throw new Error(`File ${this.filePath} already exists`);
        if (this.data) {
        } else if (this.content) {
            this.data = JSON.parse(this.content);
        } else {
            this.data = {};
        }
        this.content = JSON.stringify(this.data, null, 4);
        await Helper.writeFile2(this.filePath, this.content);
    }

    async read() {
        const content = await Helper.readTextFile(this.filePath);
        this.content = content;
        this.data = JSON.parse(content);
    }

    async save() {
        console.log('JsonFile.save');
        this.content = JSON.stringify(this.data, null, 4);
        await Helper.writeFile2(this.filePath, this.content);
    }

    getAttr(name) {
        const value = BaseModel.getAttr(this.data, name);
        if (value === undefined) throw new Error(`no attribute '${name}'`);
        return value;
    }
}

module.exports = JsonFile;
