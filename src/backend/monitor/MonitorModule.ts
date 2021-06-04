import BackHostApp from '../BackHostApp';

class MonitorModule {
    backHostApp: BackHostApp;
    constructor(backHostApp: BackHostApp) {
        this.backHostApp = backHostApp;
    }
    fill() {
        return {
            uptime: Date.now() - this.backHostApp.startTime.getTime(),
            applications: Object.keys(this.backHostApp.applications).map(route => {
                const app = this.backHostApp.applications[route];
                return {
                    route: route,
                    pages: Object.keys(app.pages).map(name => {
                        return {
                            name: name
                        };
                    })
                };
            })
        };
    }
}
export = MonitorModule;
