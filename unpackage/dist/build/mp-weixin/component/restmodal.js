(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["component/restmodal"],{"10c4":function(t,n,e){"use strict";var a;e.d(n,"b",(function(){return o})),e.d(n,"c",(function(){return u})),e.d(n,"a",(function(){return a}));var o=function(){var t=this,n=t.$createElement;t._self._c},u=[]},1256:function(t,n,e){"use strict";e.r(n);var a=e("d6b9"),o=e.n(a);for(var u in a)"default"!==u&&function(t){e.d(n,t,(function(){return a[t]}))}(u);n["default"]=o.a},3016:function(t,n,e){},"37c4":function(t,n,e){"use strict";e.r(n);var a=e("ec30"),o=e.n(a);for(var u in a)"default"!==u&&function(t){e.d(n,t,(function(){return a[t]}))}(u);n["default"]=o.a},4461:function(t,n,e){"use strict";e.r(n);var a=e("37c4");for(var o in a)"default"!==o&&function(t){e.d(n,t,(function(){return a[t]}))}(o);e("f91c");var u,i,r,c,l=e("f0c5"),f=Object(l["a"])(a["default"],u,i,!1,null,null,null,!1,r,c);n["default"]=f.exports},"4d2e":function(t,n,e){"use strict";var a=e("3016"),o=e.n(a);o.a},c9d2:function(t,n,e){"use strict";e.r(n);var a=e("10c4"),o=e("1256");for(var u in o)"default"!==u&&function(t){e.d(n,t,(function(){return o[t]}))}(u);e("4d2e");var i,r=e("f0c5"),c=Object(r["a"])(o["default"],a["b"],a["c"],!1,null,"81eeeec0",null,!1,a["a"],i);n["default"]=c.exports},d6b9:function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var a=o(e("4461"));function o(t){return t&&t.__esModule?t:{default:t}}var u={data:function(){return{timer:null,isShowModal:!1}},created:function(){var t=this;this.timer=setInterval((function(){a.default.globalData.minutes>=900?t.isShowModal=!0:t.isShowModal=!1}),1e3)},methods:{closeHandle:function(){this.isShowModal=!1,a.default.globalData.minutes=0},hideHandle:function(){this.isShowModal=!1,clearInterval(this.timer)}}};n.default=u},ec30:function(t,n,e){"use strict";(function(t){Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var a=o(e("a34a"));function o(t){return t&&t.__esModule?t:{default:t}}function u(t,n,e,a,o,u,i){try{var r=t[u](i),c=r.value}catch(l){return void e(l)}r.done?n(c):Promise.resolve(c).then(a,o)}function i(t){return function(){var n=this,e=arguments;return new Promise((function(a,o){var i=t.apply(n,e);function r(t){u(i,a,o,r,c,"next",t)}function c(t){u(i,a,o,r,c,"throw",t)}r(void 0)}))}}var r={globalData:{statusBarHeight:"",isIPhoneX:!1,timer:null,minutes:0},onLaunch:function(){var n=i(a.default.mark((function n(){var e;return a.default.wrap((function(n){while(1)switch(n.prev=n.next){case 0:console.log("App Launch"),e=this,t.getSystemInfo({success:function(t){e.globalData.statusBarHeight=t.statusBarHeight,-1==t.model.indexOf("iPhone X")&&-1==t.model.indexOf("iPhone XR")&&-1==t.model.indexOf("iPhone XS Max")||(e.globalData.isIPhoneX=!0)}}),this.globalData.timer=setInterval((function(){e.globalData.minutes=e.globalData.minutes+1}),1e3),t.setInnerAudioOption({mixWithOther:!0,obeyMuteSwitch:!1});case 5:case"end":return n.stop()}}),n,this)})));function e(){return n.apply(this,arguments)}return e}(),onShow:function(){console.log("App Show")},onHide:function(){console.log("App Hide"),clearInterval(this.globalData.timer)}};n.default=r}).call(this,e("543d")["default"])},f91c:function(t,n,e){"use strict";var a=e("fd7f"),o=e.n(a);o.a},fd7f:function(t,n,e){}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'component/restmodal-create-component',
    {
        'component/restmodal-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("c9d2"))
        })
    },
    [['component/restmodal-create-component']]
]);
