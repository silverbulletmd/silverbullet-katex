var mod=(()=>{var i=Object.defineProperty;var u=Object.getOwnPropertyDescriptor;var f=Object.getOwnPropertyNames;var h=Object.prototype.hasOwnProperty;var x=(t,e)=>{for(var r in e)i(t,r,{get:e[r],enumerable:!0})},b=(t,e,r,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of f(e))!h.call(t,n)&&n!==r&&i(t,n,{get:()=>e[n],enumerable:!(s=u(e,n))||s.enumerable});return t};var k=t=>b(i({},"__esModule",{value:!0}),t);var M={};x(M,{functionMapping:()=>g});function l(t){let e=atob(t),r=e.length,s=new Uint8Array(r);for(let n=0;n<r;n++)s[n]=e.charCodeAt(n);return s}function v(t,e){return syscall("sandboxFetch.fetch",t,e)}function m(){globalThis.fetch=async function(t,e){let r=await v(t,e&&{method:e.method,headers:e.headers,body:e.body});return new Response(r.base64Body?l(r.base64Body):null,{status:r.status,headers:r.headers})}}typeof Deno>"u"&&(self.Deno={args:[],build:{arch:"x86_64"},env:{get(){}}});var d=new Map,c=0;function a(t){self.postMessage(t)}self.syscall=async(t,...e)=>await new Promise((r,s)=>{c++,d.set(c,{resolve:r,reject:s}),a({type:"sys",id:c,name:t,args:e})});function p(t,e){self.addEventListener("message",r=>{(async()=>{let s=r.data;switch(s.type){case"inv":{let n=t[s.name];if(!n)throw new Error(`Function not loaded: ${s.name}`);try{let o=await Promise.resolve(n(...s.args||[]));a({type:"invr",id:s.id,result:o})}catch(o){console.error(o),a({type:"invr",id:s.id,error:o.message})}}break;case"sysr":{let n=s.id,o=d.get(n);if(!o)throw Error("Invalid request id");d.delete(n),s.error?o.reject(new Error(s.error)):o.resolve(s.result)}break}})().catch(console.error)}),a({type:"manifest",manifest:e})}m();function y(t){return{html:`
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.css" crossorigin="anonymous">
    <div id="katex"></div>
    <div id="formula" style="display: none;">${t.replaceAll("<","&lt;")}</div>`,script:`
    loadJsByUrl("https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.js").then(() => {
      katex.render(document.getElementById("formula").innerText, document.getElementById("katex"));
      updateHeight();
    });
    document.addEventListener("click", () => {
      api({type: "blur"});
    });
    `}}var g={katexWidget:y},w={name:"katex",functions:{katexWidget:{path:"./katex.ts:widget",codeWidget:"latex"}},assets:{}};p(g,w);return k(M);})();
