declare const _default: ({
    method: string;
    path: string;
    session: boolean;
    handler(req: any, res: any): void;
} | {
    method: string;
    path: string;
    session: {
        type: string;
    };
    handler(req: any, res: any): void;
})[];
export default _default;
