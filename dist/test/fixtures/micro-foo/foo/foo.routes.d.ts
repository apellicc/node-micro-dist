declare const _default: ({
    method: string;
    path: string;
    handler: (req: any, res: any) => Promise<void>;
    documentation: {
        description: string;
        response: {
            fake: boolean;
        };
    };
} | {
    version: string;
    method: string;
    path: string;
    handler: (req: any, res: any) => Promise<void>;
} | {
    method: string;
} | {
    path: string;
} | {
    method: string;
    path: string;
})[];
export default _default;
