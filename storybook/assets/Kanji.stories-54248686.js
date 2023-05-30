import{r as u}from"./index-8db94870.js";import"./_commonjsHelpers-042e6b4d.js";var y={exports:{}},l={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var V=u,j=Symbol.for("react.element"),G=Symbol.for("react.fragment"),k=Object.prototype.hasOwnProperty,O=V.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,w={key:!0,ref:!0,__self:!0,__source:!0};function x(t,e,n){var r,s={},a=null,o=null;n!==void 0&&(a=""+n),e.key!==void 0&&(a=""+e.key),e.ref!==void 0&&(o=e.ref);for(r in e)k.call(e,r)&&!w.hasOwnProperty(r)&&(s[r]=e[r]);if(t&&t.defaultProps)for(r in e=t.defaultProps,e)s[r]===void 0&&(s[r]=e[r]);return{$$typeof:j,type:t,key:a,ref:o,props:s,_owner:O.current}}l.Fragment=G;l.jsx=x;l.jsxs=x;y.exports=l;var b=y.exports;const L=async t=>{const e=t.charCodeAt(0).toString(16).toLowerCase().padStart(5,"0"),r=await(await fetch(`./kanjivg/${e}.svg`)).text(),o=new DOMParser().parseFromString(r,"image/svg+xml").querySelector("svg");return o.removeAttribute("height"),o.removeAttribute("width"),o},d=t=>{const{char:e,filterSVG:n,onKanjiLoad:r,...s}=t,[a,o]=u.useState();return u.useEffect(()=>{if(!e)return;const E=n??(p=>p);L(e).then(p=>{r==null||r();const m=E(p);m&&o(m.outerHTML)})},[e,n,r]),b.jsx("div",{dangerouslySetInnerHTML:a?{__html:a}:void 0,...s})};try{d.displayName="Kanji",d.__docgenInfo={description:"",displayName:"Kanji",props:{char:{defaultValue:null,description:"",name:"char",required:!0,type:{name:"string"}},filterSVG:{defaultValue:null,description:"",name:"filterSVG",required:!1,type:{name:"((svg: SVGElement) => SVGElement | null)"}},onKanjiLoad:{defaultValue:null,description:"",name:"onKanjiLoad",required:!1,type:{name:"(() => void)"}}}}}catch{}const N={title:"Kanji",component:d},c={args:{char:"神"}},i={args:{char:"神",filterSVG:t=>(t.querySelectorAll('[id^="kvg:StrokeNumbers_"]').forEach(e=>{e.remove()}),t)}};var f,_,v;c.parameters={...c.parameters,docs:{...(f=c.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    char: "神"
  }
}`,...(v=(_=c.parameters)==null?void 0:_.docs)==null?void 0:v.source}}};var S,g,h;i.parameters={...i.parameters,docs:{...(S=i.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    char: "神",
    filterSVG: svg => {
      svg.querySelectorAll('[id^="kvg:StrokeNumbers_"]').forEach(path => {
        path.remove();
      });
      return svg;
    }
  }
}`,...(h=(g=i.parameters)==null?void 0:g.docs)==null?void 0:h.source}}};const A=["Default","FilterSVG"];export{c as Default,i as FilterSVG,A as __namedExportsOrder,N as default};
//# sourceMappingURL=Kanji.stories-54248686.js.map
