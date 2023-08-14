import { ApplicationController } from '../../frontend/viewer/Controller/ModelController/ApplicationController/ApplicationController';
import { Context } from '../Context';
import { BkApplication } from './BkModel/BkApplication/BkApplication';
import { ApplicationData } from '../../common/data';
export declare const home: (application: BkApplication, context: Context, applicationController: ApplicationController, qformsVersion: string, links: string, scripts: string, data: ApplicationData, appViewHtml: string) => string;
