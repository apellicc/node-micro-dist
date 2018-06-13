declare const _default: ({
    method: string;
    path: string;
    handler(req: any, res: any): Promise<void>;
} | {
    method: string[];
    path: string;
    handler(req: any, res: any): Promise<void>;
} | {
    method: string;
    path: string;
    session: boolean;
    handler(req: any, res: any): void;
} | {
    method: string;
    path: string;
    session: {
        getToken: (req: any) => any;
    };
    handler(req: any, res: any): void;
} | {
    method: string;
    path: string;
    session: {
        type: string;
        getToken: (req: any) => any;
    };
    handler(req: any, res: any): void;
})[];
export default _default;
