import { JsonFile } from './JsonFile';
import { ApplicationEditor } from './editor/Editor/ApplicationEditor/ApplicationEditor';
import { BaseModel } from './BaseModel';
import { BkModelScheme } from './viewer/BkModelScheme/BkModelScheme';

export class Converter {
    static async reformat(appFilePath: string) {
        console.debug('Convert.reformat', appFilePath);
        const appFile = new JsonFile(appFilePath);
        await appFile.read();

        // app
        const appEditor = new ApplicationEditor(appFile);
        appEditor.reformat();
        await appEditor.save();

        // pages
        const pageNames = appEditor
            .getData()
            .pageLinks.map((data: BkModelScheme) => BaseModel.getName(data));
        // console.debug('pageNames:', pageNames);
        // const pageName = pageNames[0];
        for (const pageName of pageNames) {
            const pageEditor = await appEditor.getPage(pageName);
            pageEditor.reformat();
            await pageEditor.save();
        }
    }
}
