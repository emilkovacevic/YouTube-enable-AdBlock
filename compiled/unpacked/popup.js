(()=>{"use strict";var e,n,t={593:(e,n,t)=>{t.d(n,{t:()=>r});var o=function(e,n,t,o){return new(t||(t=Promise))((function(r,c){function i(e){try{s(o.next(e))}catch(e){c(e)}}function a(e){try{s(o.throw(e))}catch(e){c(e)}}function s(e){var n;e.done?r(e.value):(n=e.value,n instanceof t?n:new t((function(e){e(n)}))).then(i,a)}s((o=o.apply(e,n||[])).next())}))};function r(){return o(this,void 0,void 0,(function*(){return(yield chrome.tabs.query({currentWindow:!0,active:!0}))[0]}))}}},o={};function r(e){var n=o[e];if(void 0!==n)return n.exports;var c=o[e]={exports:{}};return t[e](c,c.exports,r),c.exports}r.d=(e,n)=>{for(var t in n)r.o(n,t)&&!r.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:n[t]})},r.o=(e,n)=>Object.prototype.hasOwnProperty.call(e,n),e=r(593),n=function(e,n,t,o){return new(t||(t=Promise))((function(r,c){function i(e){try{s(o.next(e))}catch(e){c(e)}}function a(e){try{s(o.throw(e))}catch(e){c(e)}}function s(e){var n;e.done?r(e.value):(n=e.value,n instanceof t?n:new t((function(e){e(n)}))).then(i,a)}s((o=o.apply(e,n||[])).next())}))},document.addEventListener("DOMContentLoaded",(()=>n(void 0,void 0,void 0,(function*(){const n=yield(0,e.t)(),t=document.getElementById("toggle-extension"),o=document.getElementById("toggle-logs"),r=document.getElementById("console-log");let c=!1,i=!1,a=[];if(!t||!o||!r)throw new Error("Loading Error");function s(e,n){const t=e?"Enabled":"Disabled";n.innerText=t}function u(e){r.style.display=e?"block":"none"}function l(e){n&&n.id?chrome.tabs.sendMessage(n.id,{contentScriptMessage:e}):r.innerText="Failed to send message to content script"}chrome.runtime.onMessage.addListener(((e,n,t)=>{const o=e.log;a.push("Received log message:",o)})),t.addEventListener("click",(()=>{c=!c,chrome.storage.local.set({extensionEnabled:c},(()=>{s(c,t),l(c?"on":"off")}))})),o.addEventListener("click",(()=>{i=!i,chrome.storage.local.set({showLogs:i},(()=>{s(i,o),u(i),i&&function(e){if(e.length>0){let n=0;function t(){e.length===n&&(e=[]),n<e.length&&(r.innerText=e[n],n++,setTimeout(t,400))}t()}}(a)}))}));const d=setInterval((function(){(function(){try{if(n.active){if(c){const e=n.url.split("?")[1],t=new URLSearchParams(e).get("v");return n.url.includes("youtube.com/watch")&&t?(l("on"),clearInterval(d),!0):(r.innerText="Not a youtube watch video page",l("off"),clearInterval(d),!0)}return r.innerText="Disabled",l("off"),!1}return s(!1,t),s(!1,o),r.innerText="Not a youtube page",l("off"),!1}catch(e){return console.error("An error occurred:",e),!1}})()&&clearInterval(d)}),500);chrome.storage.local.get(["extensionEnabled","showLogs"],(e=>{c=!1!==e.extensionEnabled,i=!1!==e.showLogs,s(c,t),s(i,o),u(i)}))}))))})();