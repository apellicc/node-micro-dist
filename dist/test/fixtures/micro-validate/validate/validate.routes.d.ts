import * as Joi from 'joi';
declare const _default: ({
    method: string;
    path: string;
    validate: {
        body: Joi.ObjectSchema;
    };
    handler(req: any, res: any): void;
} | {
    method: string;
    path: string;
    validate: {
        options: {
            allowUnknownBody: boolean;
        };
        body: Joi.ObjectSchema;
    };
    handler(req: any, res: any): void;
})[];
export default _default;
