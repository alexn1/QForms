import JsonFile from './JsonFile';
import ApplicationEditor from './editor/Editor/ApplicationEditor/ApplicationEditor';
import BaseModel from './BaseModel';

class Convert {
    static async convert(appFilePath) {
        console.log('Convert.convert', appFilePath);
        const appFile = new JsonFile(appFilePath);
        await appFile.read();
        const appEditor = new ApplicationEditor(appFile);
        // console.log('data:', appEditor.data);

        const pageNames = appEditor.data.pageLinks.map(data => BaseModel.getName(data));
        // console.log('pageNames:', pageNames);
        const pageEditor = await appEditor.getPage(pageNames[0]);
        const formNames = pageEditor.data.forms.map(data => BaseModel.getName(data));
        // console.log('formNames:', formNames);
        const formEditor =  pageEditor.createFormEditor(formNames[0]);
        const fieldNames = formEditor.data.fields.map(data => BaseModel.getName(data));
        // console.log('fieldNames:', fieldNames);
        const fieldEditor = formEditor.createFieldEditor(fieldNames[0]);
        console.log('oldData:', fieldEditor.data);
        const newData = await fieldEditor.reformat();
        console.log('newData:', newData);

        await pageEditor.save();
    }
}

export = Convert;
