class IndexView extends ReactComponent{renderModals(){const t=this.props.ctrl;return React.createElement("div",null,t.modals.map(e=>React.createElement(Modal,{key:e.id.toString()},React.createElement("div",{className:"modal-dialog modal-sm"},React.createElement("div",{className:"modal-content"},React.createElement("div",{className:"modal-header"},React.createElement(Button,{classList:["close"],onClick:t.closeModal},React.createElement("span",null,"×")),React.createElement("h4",{className:"modal-title"},"New Application")),React.createElement("div",{className:"modal-body"},React.createElement("div",null,React.createElement("label",{htmlFor:"folderName"},"Folder Name"),React.createElement(TextBox,{id:"folderName",onCreate:t.onFolderNameCreate,onChange:t.onFolderNameChange})),React.createElement("div",null,React.createElement("label",{htmlFor:"appName"},"Application Name"),React.createElement(TextBox,{id:"appName",onChange:t.onAppNameChange}))),React.createElement("div",{className:"modal-footer"},React.createElement(Button,{name:"create",classList:["btn","btn-primary"],onClick:t.onCreateClick},"Create"),React.createElement(Button,{classList:["btn","btn-default"],onClick:t.closeModal},"Close")))))))}render(){console.log("IndexView.render");const e=this.props.ctrl;return React.createElement("div",{className:"IndexView"},React.createElement("div",{className:"container",style:{backgroundColor:"#eee"}},React.createElement("div",{className:"row",style:{margin:"50px 0"}},React.createElement("div",null,React.createElement(ComboBox,{value:e.currentAppFullName,items:e.getAppItems(),size:15,style:{width:"100%"},onDoubleClick:e.run,onChange:e.onAppChange})),React.createElement("div",null,React.createElement("div",null,React.createElement(ComboBox,{value:e.currentAppEnv,items:e.getEnvItems(),onChange:e.onEnvChange})),React.createElement(Button,{classList:["btn","btn-primary","btn-block"],onClick:e.run},"Run"),"development"===e.data.nodeEnv&&React.createElement(Button,{classList:["btn","btn-default","btn-block"],onClick:e.edit},"Edit"),"development"===e.data.nodeEnv&&React.createElement(Button,{classList:["btn","btn-default","btn-block"],onClick:e.btnCreate_Click},"New...")))),this.renderModals())}}
//# sourceMappingURL=index-jsx.5e10c7a9419aa65937ec51e56f773530.js.map
