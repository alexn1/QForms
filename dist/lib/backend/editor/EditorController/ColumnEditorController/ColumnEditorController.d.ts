import { EditorController } from '../EditorController';
declare class ColumnEditorController extends EditorController {
    save(params: any): Promise<string>;
    _new(params: any): Promise<any>;
    delete(params: any): Promise<any>;
}
export = ColumnEditorController;
