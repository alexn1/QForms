import { Database } from '../Database';
import { Context } from '../../../../Context';
export declare class MongoDbDatabase extends Database {
    connect(context: Context): Promise<void>;
}
