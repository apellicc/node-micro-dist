/// <reference types="express" />
/// <reference types="node" />
export { jwt } from './jwt';
import { N9Log } from '@neo9/n9-node-log';
import { Server } from 'http';
import { Express } from 'express';
export declare namespace N9Micro {
    interface BodyParserOptions {
        json?: any;
        urlencoded?: any;
    }
    interface HttpOptions {
        logLevel?: string | false;
        port?: number | string;
        bodyParser?: BodyParserOptions;
        preventListen?: boolean;
    }
    interface JWTOptions {
        headerKey?: string;
        secret?: string;
        expiresIn?: number | string;
    }
    interface Options {
        hasProxy?: boolean;
        path?: string;
        log?: N9Log;
        http?: HttpOptions;
        jwt?: JWTOptions;
    }
    interface HttpContext {
        app: Express;
        server: Server;
        listen: () => Promise<{}>;
    }
}
export default function (options?: N9Micro.Options): Promise<{
    app: Express;
    server: Server;
}>;
