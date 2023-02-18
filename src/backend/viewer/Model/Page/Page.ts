import path from 'path';

import { BkModel } from '../Model';
import { BkDataSource } from '../BkDataSource/BkDataSource';
import { BkAction } from '../Action/Action';
import { BkApplication } from '../Application/Application';
import { BkForm } from '../Form/Form';
import { Context } from '../../../Context';
import { MyError } from '../../../MyError';

export class BkPage extends BkModel {
    dataSources: BkDataSource[] = [];
    actions: BkAction[] = [];
    forms: BkForm[] = [];

    async init(context: Context): Promise<void> {
        await this.createColItems('dataSources', context);
        await this.createColItems('actions', context);
        await this.createColItems('forms', context);
    }

    getDirPath(): string {
        return path.join(this.parent.getDirPath(), 'pages', this.getName());
    }

    fillAttributes(response: any): void {
        response.name = this.getAttr('name');
        response.caption = this.getAttr('caption');
        response.cssBlock = this.getAttr('cssBlock');
        response.viewClass = this.getAttr('viewClass');
        response.ctrlClass = this.getAttr('ctrlClass');
    }

    async fill(context: Context): Promise<any> {
        // console.log('Page.fill', this.constructor.name, this.getFullName());
        const response = await super.fill(context);
        await this.fillCollection(response, 'dataSources', context);
        await this.fillCollection(response, 'actions', context);
        await this.fillCollection(response, 'forms', context);
        response.newMode = !!context.getBody().newMode;
        return response;
    }

    async rpc(name: string, context: Context): Promise<any> {
        console.log('Page.rpc', name, context.getBody());
        if (this[name]) return await this[name](context);
        throw new MyError({
            message: `no rpc ${this.constructor.name}.${name}`,
            data: { method: `${this.constructor.name}.rpc` },
            context,
        });
    }

    getApp(): BkApplication {
        return this.parent;
    }

    getForm(name: string): BkForm | undefined {
        return this.forms.find((form) => form.getName() === name);
    }

    getDataSource(name: string): BkDataSource | undefined {
        return this.dataSources.find((dataSource) => dataSource.getName() === name);
    }
}
