export declare const jwt: {
    generateJWT: (session: any) => Promise<string>;
    loadSession: (req: any, getToken?: (req: any) => string) => Promise<void>;
};
export default function (options: any, app: any): void;
