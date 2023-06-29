import { ModelController } from '../ModelController';
import { Helper } from '../../../../common/Helper';
import { FrontHostApp } from '../../../../common/FrontHostApp';
import { FormController } from '../FormController/FormController';
import { DataSource } from '../../../Model/DataSource/DataSource';
import { RowFormController } from '../FormController/RowFormController/RowFormController';
import { PageView } from './PageView';
import {
    ApplicationController,
    OpenPageOptions,
} from '../ApplicationController/ApplicationController';
import { Page, PageOptions } from '../../../Model/Page/Page';

export class PageController<
    TApplicationController extends ApplicationController = ApplicationController,
> extends ModelController<Page> {
    id: string;
    forms: FormController[] = [];

    constructor(model: Page, parent: ApplicationController, id: string) {
        super(model, parent);
        if (typeof window === 'object') {
            console.log(`${this.constructor.name}.constructor`, model, id);
        }

        if (!id) {
            throw new Error('no id');
        }
        this.id = id;
    }

    static create(
        model: Page,
        parent: ApplicationController,
        id: string,
        options: PageOptions | null = null,
    ): PageController {
        // console.log('PageController.create', model.getName());
        const { ctrlClass } = model.getData();
        if (ctrlClass) {
            const CustomClass = Helper.getGlobalClass(ctrlClass);
            if (!CustomClass) throw new Error(`no class ${ctrlClass}`);
            return new CustomClass(model, parent, id, options);
        }
        // @ts-ignore
        return new PageController(model, parent, id, options);
    }

    init() {
        for (const form of this.model.forms) {
            const ctrl = FormController.create(form, this);
            ctrl.init();
            this.forms.push(ctrl);
        }
    }

    deinit() {
        console.log('PageController.deinit: ' + this.model.getFullName());
        for (const form of this.forms) {
            form.deinit();
        }
        super.deinit();
    }

    onSaveAndCloseClick = async () => {
        console.log('PageController.onSaveAndCloseClick');
        this.validate();
        if (this.isValid()) {
            try {
                this.getApp().getView().disableRerender();
                await this.getModel().update();
                console.log('page model updated', this.getModel().getFullName());
            } finally {
                this.getApp().getView().enableRerender();
            }
            await this.getApp().closePage(this);
            if (this.getModel().getOptions().onClose) {
                this.getModel().getOptions().onClose();
            }
        } else {
            await this.rerender();
        }
    };

    onClosePageClick = async (e) => {
        console.log('PageController.onClosePageClick', this.getModel().getFullName());
        await this.close();
    };

    onOpenPageClick = async (e) => {
        const name = this.getModel().getName();
        const key = this.getModel().getKey();
        const link = this.createOpenInNewLink(name, key!);
        // console.log('link', link);
        window.open(link, '_blank');
    };

    createOpenInNewLink(pageName: string, key: string) {
        return this.getApp()
            .getHostApp()
            .createLink({
                page: pageName,
                ...DataSource.keyToParams(key),
            });
    }

    async close(): Promise<void> {
        // console.log('PageController.close', this.model.getFullName());
        const changed = this.isChanged();
        // console.log('changed:', changed);
        // const valid = this.isValid();
        // console.log('valid:', valid);
        if (this.model.hasRowFormWithDefaultSqlDataSource() && changed) {
            const result = await this.getApp().confirm({
                message: this.model.getApp().getText().form.areYouSure,
            });
            if (!result) return;
        }
        await this.getApp().closePage(this);
        if (this.getModel().getOptions().onClose) {
            this.getModel().getOptions().onClose();
        }
    }

    validate(): void {
        for (const form of this.forms) {
            if (form instanceof RowFormController) {
                form.validate();
            }
        }
    }

    isValid(): boolean {
        // console.log('PageController.isValid', this.model.getFullName());
        for (const form of this.forms) {
            if (!form.isValid()) {
                return false;
            }
        }
        return true;
    }

    async onFormChange(e): Promise<void> {
        // console.log('PageController.onFormChange', this.model.getFullName());
        this.rerender();
    }

    onFormDiscard(formController: FormController): void {
        console.log('PageController.onFormDiscard', this.model.getFullName());
        this.rerender();
    }

    onFormUpdate(e): void {
        console.log('PageController.onFormUpdate:', this.model.getFullName(), e);
        this.rerender();
    }

    onFormInsert(e): void {
        console.log('PageController.onFormInsert:', this.model.getFullName());
        // console.log('hasNew:', this.model.hasNew());
        for (const form of this.forms) {
            form.invalidate();
        }
        this.rerender();
    }

    async openPage(options: OpenPageOptions) {
        if (!options.params) {
            options.params = {};
        }
        const params = this.getModel().getParams();
        for (const name in params) {
            if (!options.params[name]) {
                options.params[name] = params[name];
            }
        }
        return await this.getApp().openPage(options);
    }

    isChanged(): boolean {
        // console.log('PageController.isChanged', this.model.getFullName());
        for (const form of this.forms) {
            if (form.isChanged()) {
                // console.log(`FORM CHANGED: ${form.model.getFullName()}`);
                return true;
            }
        }
        return false;
    }

    getApp(): TApplicationController {
        return this.parent;
    }

    getViewClass(): typeof PageView {
        return super.getViewClass() || PageView;
    }

    getForm<TFormController extends FormController = FormController>(
        name: string,
    ): TFormController {
        return this.forms.find((form) => form.model.getName() === name) as TFormController;
    }

    async onActionClick(name: string): Promise<any> {
        console.log('PageController.onActionClick', name);
    }

    onKeyDown = async (e) => {
        // console.log('PageController.onKeyDown', this.getModel().getFullName(), e);
        if (e.key === 'Escape') {
            if (this.isModal()) {
                await this.close();
            }
        }
    };

    getTitle(): string {
        const model = this.getModel();
        const key = model.getKey();
        let keyPart: string | null = null;
        if (key) {
            const arr = JSON.parse(key);
            if (arr.length === 1 && typeof arr[0] === 'number') {
                keyPart = `#${arr[0]}`;
            } else {
                keyPart = `${key}`;
            }
        }
        return [
            model.getCaption(),
            ...(this.getApp().getHostApp().isDebugMode() ? [`(${this.getId()})`] : []),
            ...(keyPart ? [keyPart] : []),
        ].join(' ');
    }

    getSelectedRowKey() {
        for (const form of this.forms) {
            const selectedRowKey = form.getSelectedRowKey();
            if (selectedRowKey) return selectedRowKey;
        }
        return null;
    }

    onSelectClick = async (e) => {
        console.log('PageController.onSelectClick');
        await this.selectRow(this.getSelectedRowKey());
    };

    onResetClick = async (e) => {
        console.log('PageController.onResetClick');
        await this.selectRow(null);
    };

    async selectRow(key) {
        console.log('PageController.selectRow', key);
        await this.close();
        await this.getModel().getOptions().onSelect(key);
    }

    invalidate() {
        this.forms.forEach((form) => form.invalidate());
    }

    getId(): string {
        return this.id;
    }

    isModal(): boolean {
        return this.getModel().isModal();
    }

    isAutoFocus(): boolean {
        for (const form of this.forms) {
            if (form.isAutoFocus()) {
                return true;
            }
        }
        return false;
    }
}
