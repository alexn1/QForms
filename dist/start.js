(()=>{"use strict";var e={420:(e,o)=>{Object.defineProperty(o,"__esModule",{value:!0}),o.pConsole=o.getLogLevelName=o.LogLevels=o.LogLevel=void 0;var r;function n(){return"object"==typeof window?window.QFORMS_LOG_LEVEL||"debug":"object"==typeof global?process.env.QFORMS_LOG_LEVEL||("dev"===process.env.NODE_ENV?"debug":"log"):"debug"}!function(e){e.debug="debug",e.log="log",e.warn="warn",e.error="error"}(r=o.LogLevel||(o.LogLevel={})),o.LogLevels=[r.debug,r.log,r.warn,r.error],o.getLogLevelName=n,o.pConsole=new Proxy(console,{get:function(e,r,t){return"function"==typeof e[r]?function(...s){if(o.LogLevels.indexOf(r)>=o.LogLevels.indexOf(n())){if("undefined"==typeof jest)return e[r].apply(t,s);"error"===r?process.stderr.write(`${s.join(" ")}\n`):process.stdout.write(`${s.join(" ")}\n`)}}:e[r]}})},956:e=>{e.exports=require("./index")}},o={};function r(n){var t=o[n];if(void 0!==t)return t.exports;var s=o[n]={exports:{}};return e[n](s,s.exports,r),s.exports}(()=>{const e=r(956),o=r(420),n={username:"admin",password:"123qwe"};(async function(...r){o.pConsole.debug("start");try{const o=new e.BackHostApp(Object.assign(Object.assign({},e.BkHelper.argvAsKeyValue(r)),{monitor:n}));await o.init(),await o.run()}catch(e){return console.error(e.message),1}})(...process.argv).then((e=>{e&&process.exit(e)}))})()})();