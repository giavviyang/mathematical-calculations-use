(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/login/agreement"],{"4cf9":function(t,n,e){"use strict";var r;e.d(n,"b",(function(){return u})),e.d(n,"c",(function(){return o})),e.d(n,"a",(function(){return r}));var u=function(){var t=this,n=t.$createElement;t._self._c},o=[]},"722a":function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var r=u(e("a34a"));function u(t){return t&&t.__esModule?t:{default:t}}function o(t,n,e,r,u,o,a){try{var c=t[o](a),f=c.value}catch(i){return void e(i)}c.done?n(f):Promise.resolve(f).then(r,u)}function a(t){return function(){var n=this,e=arguments;return new Promise((function(r,u){var a=t.apply(n,e);function c(t){o(a,r,u,c,f,"next",t)}function f(t){o(a,r,u,c,f,"throw",t)}c(void 0)}))}}var c={data:function(){return{content:""}},onLoad:function(){this.getContent()},methods:{getContent:function(){var t=this;return a(r.default.mark((function n(){var e;return r.default.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return n.next=2,t.$http.post("/applet/queryUserAgreement",{});case 2:e=n.sent,console.log(e),t.content=e.data;case 5:case"end":return n.stop()}}),n)})))()}}};n.default=c},7592:function(t,n,e){"use strict";(function(t){e("ce6b");r(e("66fd"));var n=r(e("9b0f"));function r(t){return t&&t.__esModule?t:{default:t}}wx.__webpack_require_UNI_MP_PLUGIN__=e,t(n.default)}).call(this,e("543d")["createPage"])},"9b0f":function(t,n,e){"use strict";e.r(n);var r=e("4cf9"),u=e("d201");for(var o in u)"default"!==o&&function(t){e.d(n,t,(function(){return u[t]}))}(o);e("dd8f");var a,c=e("f0c5"),f=Object(c["a"])(u["default"],r["b"],r["c"],!1,null,"6e542052",null,!1,r["a"],a);n["default"]=f.exports},d201:function(t,n,e){"use strict";e.r(n);var r=e("722a"),u=e.n(r);for(var o in r)"default"!==o&&function(t){e.d(n,t,(function(){return r[t]}))}(o);n["default"]=u.a},dd8f:function(t,n,e){"use strict";var r=e("f22c"),u=e.n(r);u.a},f22c:function(t,n,e){}},[["7592","common/runtime","common/vendor"]]]);