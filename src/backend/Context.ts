class Context {
    options: any;
    query: any;
    params: any;
    files: any;
    connections: any;
    querytime: any;

    constructor(options) {
        // console.log('Context', options);
        this.options = options;
        if (!options.domain) throw new Error('no domain');

        // query
        this.query  = {
            ...(this.getReq() && this.getReq().query ? this.getReq().query : {})
        };

        // params
        this.params = {
            ...(this.getReq() && this.getReq().body.params ? this.getReq().body.params : {})
        };

        // files
        this.files = {};
        if (this.getReq() && this.getReq().files) {
            for (const name in this.getReq().files) {
                this.files[name] = this.getReq().files[name].buffer;
            }
        }

        // connections
        this.connections = {};

        // querytime
        this.querytime = {params: {}};
    }
    getRoute(): string {
        return `${this.getDomain()}/${this.getAppDirName()}/${this.getAppFileName()}/${this.getEnv()}`;
    }
    getUser(): any {
        const route = this.getRoute();
        if (this.getReq().session.user && this.getReq().session.user[route]) {
            return this.getReq().session.user[route];
        }
        return null;
    }
    getVirtualPath(): string {
        return `/${this.getModule()}/${this.getAppDirName()}/${this.getAppFileName()}/${this.getEnv()}`;
    }
    getClientTimezoneOffset(): number {
        if (this.getReq().session.tzOffset !== undefined && this.getReq().session.tzOffset !== null) {
            return this.getReq().session.tzOffset;
        }
        return null;
    }
    getTimeOffset(): number {
        const clientTimezoneOffset = this.getClientTimezoneOffset();
        if (clientTimezoneOffset !== null) {
            return new Date().getTimezoneOffset() - clientTimezoneOffset;
        }
        return null;
    }
    getCookies() {
        return {
            ...(this.getReq() && this.getReq().cookies ? this.getReq().cookies : {})
        };
    }
    getQuery() {
        return {
        ...(this.getReq() && this.getReq().query ? this.getReq().query : {})
        };
    }
    getParams(): any {
        // console.log('Context.getParams:');
        const user = this.getUser();
        const timeOffset = this.getTimeOffset();
        return {
            ...this.getCookies(),
            ...this.query,
            ...this.params,
            ...(this.querytime ? this.querytime.params : {}),
            ...(user ? {userId: user.id, userName: user.name} : {}),
            ...(timeOffset !== null ? {timeOffset} : {})
        };
    }
    getReq() {
        return this.options.req;
    }
    getRes() {
        return this.options.res;
    }
    getDomain() {
        return this.options.domain;
    }
    getBody(): any {
        return this.getReq().body;
    }
    getModule(): string {
        if (this.options.module) {
            return this.options.module;
        }
        return this.getReq().params.module;
    }
    getAppDirName(): string {
        if (this.options.appDirName) {
            return this.options.appDirName;
        }
        return this.getReq().params.appDirName;
    }
    getAppFileName(): string {
        if (this.options.appFileName) {
            return this.options.appFileName;
        }
        return this.getReq().params.appFileName;
    }
    getEnv(): string {
        if (this.options.env) {
            return this.options.env;
        }
        return this.getReq().params.env;
    }
    getUri(): string {
        return this.getReq().params['0'];
    }
    getIp(): string {
        return this.getReq().headers['x-forwarded-for'] || this.getReq().connection.remoteAddress;
    }
    getHost() {
        return this.getReq().headers.host;
    }
    getProtocol() {
        return this.getReq().headers['x-forwarded-proto'] || 'http';
    }
    setVersionHeaders(platformVersion, appVersion) {
        this.getRes().setHeader('qforms-platform-version', platformVersion);
        this.getRes().setHeader('qforms-app-version'     , appVersion);
    }
    destroy() {
    }
}

export = Context;
