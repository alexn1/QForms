class MonitorView extends ReactComponent{renderApplication(e){return React.createElement("li",{key:e.route},React.createElement("div",null,e.route," ",React.createElement("span",{style:{color:"gray"}},"version: ",e.version)),React.createElement("ul",null,React.createElement("li",null,React.createElement("div",null,"pages:"),React.createElement("ul",null,e.pages.map(e=>React.createElement("li",{key:e.name},e.name)))),React.createElement("li",null,React.createElement("div",null,"clients:"),React.createElement("ul",null,e.clients.map(e=>React.createElement("li",{key:e.uuid},e.uuid," ",e.userId))))))}render(){console.log("MonitorView.render",this.props.data);const e=this.props.data;return React.createElement("div",{className:"MonitorView"},React.createElement("div",null,"nodeEnv: ",e.nodeEnv),React.createElement("div",null,"uptime: ",Helper.formatNumber(e.uptime)," ms"),React.createElement("div",null,"applications:"),React.createElement("ul",null,e.applications.map(e=>this.renderApplication(e))))}}
//# sourceMappingURL=monitor-jsx.4a57895582b065341fa533d8f20a7c9f.js.map
