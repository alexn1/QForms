declare class Context {
    options: any;
    query: any;
    params: any;
    files: any;
    connections: any;
    querytime: any;
    constructor(options: any);
    getRoute(): string;
    getUser(): any;
    getVirtualPath(): string;
    getClientTimezoneOffset(): number;
    getTimeOffset(): number;
    getParams(): any;
    getReq(): any;
    getRes(): any;
    getDomain(): any;
    getBody(): any;
    getModule(): string;
    getAppDirName(): string;
    getAppFileName(): string;
    getEnv(): string;
    getUri(): string;
    getIp(): string;
    getHost(): any;
    getProtocol(): any;
    destroy(): void;
}
export = Context;
