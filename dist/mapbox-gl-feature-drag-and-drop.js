(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.MapboxFeatureDragNDrop = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";function Point(t,n){this.x=t,this.y=n}module.exports=Point,Point.prototype={clone:function(){return new Point(this.x,this.y)},add:function(t){return this.clone()._add(t)},sub:function(t){return this.clone()._sub(t)},multByPoint:function(t){return this.clone()._multByPoint(t)},divByPoint:function(t){return this.clone()._divByPoint(t)},mult:function(t){return this.clone()._mult(t)},div:function(t){return this.clone()._div(t)},rotate:function(t){return this.clone()._rotate(t)},rotateAround:function(t,n){return this.clone()._rotateAround(t,n)},matMult:function(t){return this.clone()._matMult(t)},unit:function(){return this.clone()._unit()},perp:function(){return this.clone()._perp()},round:function(){return this.clone()._round()},mag:function(){return Math.sqrt(this.x*this.x+this.y*this.y)},equals:function(t){return this.x===t.x&&this.y===t.y},dist:function(t){return Math.sqrt(this.distSqr(t))},distSqr:function(t){var n=t.x-this.x,i=t.y-this.y;return n*n+i*i},angle:function(){return Math.atan2(this.y,this.x)},angleTo:function(t){return Math.atan2(this.y-t.y,this.x-t.x)},angleWith:function(t){return this.angleWithSep(t.x,t.y)},angleWithSep:function(t,n){return Math.atan2(this.x*n-this.y*t,this.x*t+this.y*n)},_matMult:function(t){var n=t[0]*this.x+t[1]*this.y,i=t[2]*this.x+t[3]*this.y;return this.x=n,this.y=i,this},_add:function(t){return this.x+=t.x,this.y+=t.y,this},_sub:function(t){return this.x-=t.x,this.y-=t.y,this},_mult:function(t){return this.x*=t,this.y*=t,this},_div:function(t){return this.x/=t,this.y/=t,this},_multByPoint:function(t){return this.x*=t.x,this.y*=t.y,this},_divByPoint:function(t){return this.x/=t.x,this.y/=t.y,this},_unit:function(){return this._div(this.mag()),this},_perp:function(){var t=this.y;return this.y=this.x,this.x=-t,this},_rotate:function(t){var n=Math.cos(t),i=Math.sin(t),s=n*this.x-i*this.y,r=i*this.x+n*this.y;return this.x=s,this.y=r,this},_rotateAround:function(t,n){var i=Math.cos(t),s=Math.sin(t),r=n.x+i*(this.x-n.x)-s*(this.y-n.y),h=n.y+s*(this.x-n.x)+i*(this.y-n.y);return this.x=r,this.y=h,this},_round:function(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}},Point.convert=function(t){return t instanceof Point?t:Array.isArray(t)?new Point(t[0],t[1]):t};

},{}],2:[function(_dereq_,module,exports){
function UnitBezier(t,i,e,r){this.cx=3*t,this.bx=3*(e-t)-this.cx,this.ax=1-this.cx-this.bx,this.cy=3*i,this.by=3*(r-i)-this.cy,this.ay=1-this.cy-this.by,this.p1x=t,this.p1y=r,this.p2x=e,this.p2y=r}module.exports=UnitBezier,UnitBezier.prototype.sampleCurveX=function(t){return((this.ax*t+this.bx)*t+this.cx)*t},UnitBezier.prototype.sampleCurveY=function(t){return((this.ay*t+this.by)*t+this.cy)*t},UnitBezier.prototype.sampleCurveDerivativeX=function(t){return(3*this.ax*t+2*this.bx)*t+this.cx},UnitBezier.prototype.solveCurveX=function(t,i){void 0===i&&(i=1e-6);var e,r,s,h,n;for(s=t,n=0;n<8;n++){if(h=this.sampleCurveX(s)-t,Math.abs(h)<i)return s;var u=this.sampleCurveDerivativeX(s);if(Math.abs(u)<1e-6)break;s-=h/u}if(e=0,r=1,(s=t)<e)return e;if(s>r)return r;for(;e<r;){if(h=this.sampleCurveX(s),Math.abs(h-t)<i)return s;t>h?e=s:r=s,s=.5*(r-e)+e}return s},UnitBezier.prototype.solve=function(t,i){return this.sampleCurveY(this.solveCurveX(t,i))};

},{}],3:[function(_dereq_,module,exports){
"use strict";var Coordinate=function(o,t,n){this.column=o,this.row=t,this.zoom=n};Coordinate.prototype.clone=function(){return new Coordinate(this.column,this.row,this.zoom)},Coordinate.prototype.zoomTo=function(o){return this.clone()._zoomTo(o)},Coordinate.prototype.sub=function(o){return this.clone()._sub(o)},Coordinate.prototype._zoomTo=function(o){var t=Math.pow(2,o-this.zoom);return this.column*=t,this.row*=t,this.zoom=o,this},Coordinate.prototype._sub=function(o){return o=o.zoomTo(this.zoom),this.column-=o.column,this.row-=o.row,this},module.exports=Coordinate;

},{}],4:[function(_dereq_,module,exports){
"use strict";module.exports=self;

},{}],5:[function(_dereq_,module,exports){
"use strict";function testProp(e){for(var t=0;t<e.length;t++)if(e[t]in docStyle)return e[t];return e[0]}var Point=_dereq_("@mapbox/point-geometry"),window=_dereq_("./window");exports.create=function(e,t,o){var n=window.document.createElement(e);return t&&(n.className=t),o&&o.appendChild(n),n};var userSelect,docStyle=window.document.documentElement.style,selectProp=testProp(["userSelect","MozUserSelect","WebkitUserSelect","msUserSelect"]);exports.disableDrag=function(){selectProp&&(userSelect=docStyle[selectProp],docStyle[selectProp]="none")},exports.enableDrag=function(){selectProp&&(docStyle[selectProp]=userSelect)};var transformProp=testProp(["transform","WebkitTransform"]);exports.setTransform=function(e,t){e.style[transformProp]=t};var suppressClick=function(e){e.preventDefault(),e.stopPropagation(),window.removeEventListener("click",suppressClick,!0)};exports.suppressClick=function(){window.addEventListener("click",suppressClick,!0),window.setTimeout(function(){window.removeEventListener("click",suppressClick,!0)},0)},exports.mousePos=function(e,t){var o=e.getBoundingClientRect();return t=t.touches?t.touches[0]:t,new Point(t.clientX-o.left-e.clientLeft,t.clientY-o.top-e.clientTop)},exports.touchPos=function(e,t){for(var o=e.getBoundingClientRect(),n=[],r="touchend"===t.type?t.changedTouches:t.touches,s=0;s<r.length;s++)n.push(new Point(r[s].clientX-o.left-e.clientLeft,r[s].clientY-o.top-e.clientTop));return n},exports.remove=function(e){e.parentNode&&e.parentNode.removeChild(e)};

},{"./window":4,"@mapbox/point-geometry":1}],6:[function(_dereq_,module,exports){
"use strict";var UnitBezier=_dereq_("@mapbox/unitbezier"),Coordinate=_dereq_("../geo/coordinate"),Point=_dereq_("@mapbox/point-geometry");exports.easeCubicInOut=function(r){if(r<=0)return 0;if(r>=1)return 1;var e=r*r,t=e*r;return 4*(r<.5?t:3*(r-e)+t-.75)},exports.bezier=function(r,e,t,n){var o=new UnitBezier(r,e,t,n);return function(r){return o.solve(r)}},exports.ease=exports.bezier(.25,.1,.25,1),exports.clamp=function(r,e,t){return Math.min(t,Math.max(e,r))},exports.wrap=function(r,e,t){var n=t-e,o=((r-e)%n+n)%n+e;return o===e?t:o},exports.asyncAll=function(r,e,t){if(!r.length)return t(null,[]);var n=r.length,o=new Array(r.length),a=null;r.forEach(function(r,i){e(r,function(r,e){r&&(a=r),o[i]=e,0==--n&&t(a,o)})})},exports.values=function(r){var e=[];for(var t in r)e.push(r[t]);return e},exports.keysDifference=function(r,e){var t=[];for(var n in r)n in e||t.push(n);return t},exports.extend=function(r){for(var e=[],t=arguments.length-1;t-- >0;)e[t]=arguments[t+1];for(var n=0,o=e;n<o.length;n+=1){var a=o[n];for(var i in a)r[i]=a[i]}return r},exports.pick=function(r,e){for(var t={},n=0;n<e.length;n++){var o=e[n];o in r&&(t[o]=r[o])}return t};var id=1;exports.uniqueId=function(){return id++},exports.bindAll=function(r,e){r.forEach(function(r){e[r]&&(e[r]=e[r].bind(e))})},exports.getCoordinatesCenter=function(r){for(var e=1/0,t=1/0,n=-1/0,o=-1/0,a=0;a<r.length;a++)e=Math.min(e,r[a].column),t=Math.min(t,r[a].row),n=Math.max(n,r[a].column),o=Math.max(o,r[a].row);var i=n-e,u=o-t,s=Math.max(i,u),c=Math.max(0,Math.floor(-Math.log(s)/Math.LN2));return new Coordinate((e+n)/2,(t+o)/2,0).zoomTo(c)},exports.endsWith=function(r,e){return-1!==r.indexOf(e,r.length-e.length)},exports.mapObject=function(r,e,t){var n={};for(var o in r)n[o]=e.call(t||this,r[o],o,r);return n},exports.filterObject=function(r,e,t){var n={};for(var o in r)e.call(t||this,r[o],o,r)&&(n[o]=r[o]);return n},exports.deepEqual=function(r,e){if(Array.isArray(r)){if(!Array.isArray(e)||r.length!==e.length)return!1;for(var t=0;t<r.length;t++)if(!exports.deepEqual(r[t],e[t]))return!1;return!0}if("object"==typeof r&&null!==r&&null!==e){if("object"!=typeof e)return!1;if(Object.keys(r).length!==Object.keys(e).length)return!1;for(var n in r)if(!exports.deepEqual(r[n],e[n]))return!1;return!0}return r===e},exports.clone=function(r){return Array.isArray(r)?r.map(exports.clone):"object"==typeof r&&r?exports.mapObject(r,exports.clone):r},exports.arraysIntersect=function(r,e){for(var t=0;t<r.length;t++)if(e.indexOf(r[t])>=0)return!0;return!1};var warnOnceHistory={};exports.warnOnce=function(r){warnOnceHistory[r]||("undefined"!=typeof console&&console.warn(r),warnOnceHistory[r]=!0)},exports.isCounterClockwise=function(r,e,t){return(t.y-r.y)*(e.x-r.x)>(e.y-r.y)*(t.x-r.x)},exports.calculateSignedArea=function(r){for(var e=0,t=0,n=r.length,o=n-1,a=void 0,i=void 0;t<n;o=t++)a=r[t],e+=((i=r[o]).x-a.x)*(a.y+i.y);return e},exports.isClosedPolygon=function(r){if(r.length<4)return!1;var e=r[0],t=r[r.length-1];return!(Math.abs(e.x-t.x)>0||Math.abs(e.y-t.y)>0)&&Math.abs(exports.calculateSignedArea(r))>.01},exports.sphericalToCartesian=function(r){var e=r[0],t=r[1],n=r[2];return t+=90,t*=Math.PI/180,n*=Math.PI/180,[e*Math.cos(t)*Math.sin(n),e*Math.sin(t)*Math.sin(n),e*Math.cos(n)]},exports.parseCacheControl=function(r){var e={};if(r.replace(/(?:^|(?:\s*\,\s*))([^\x00-\x20\(\)<>@\,;\:\\"\/\[\]\?\=\{\}\x7F]+)(?:\=(?:([^\x00-\x20\(\)<>@\,;\:\\"\/\[\]\?\=\{\}\x7F]+)|(?:\"((?:[^"\\]|\\.)*)\")))?/g,function(r,t,n,o){var a=n||o;return e[t]=!a||a.toLowerCase(),""}),e["max-age"]){var t=parseInt(e["max-age"],10);isNaN(t)?delete e["max-age"]:e["max-age"]=t}return e};

},{"../geo/coordinate":3,"@mapbox/point-geometry":1,"@mapbox/unitbezier":2}],7:[function(_dereq_,module,exports){
const DOM=_dereq_("mapbox-gl/src/util/dom"),util=_dereq_("mapbox-gl/src/util/util"),window=_dereq_("mapbox-gl/src/util/window");class FeatureDragNDropHandler{constructor(e){this._map=e,this._el=e.getCanvasContainer(),this._enabled=!1,this._active=!1,this._startPos=null,this._pos=null,this._feature=null,util.bindAll(["_onDown","_onMove","_onUp","_onTouchEnd","_onMouseUp"],this)}isEnabled(){return!!this._enabled}isActive(){return!!this._active}enable(){this.isEnabled()||(this._el.addEventListener("mousedown",this._onDown),this._el.addEventListener("touchstart",this._onDown),this._enabled=!0)}disable(){this.isEnabled()&&(this._el.removeEventListener("mousedown",this._onDown),this._el.removeEventListener("touchstart",this._onDown),this._enabled=!1)}featureNotDraggable(){this._startPos=null,this._pos=null,this._feature=null}_ignoreEvent(e){const t=this._map;return!(!t.boxZoom||!t.boxZoom.isActive())||!(!t.dragPan||!t.dragPan.isActive())||!(!t.dragRotate||!t.dragRotate.isActive())||(e.touches?!!(e.touches.length>1):!!e.ctrlKey||"mousemove"!==e.type&&e.button&&0!==e.button)}_pointToArray(e){return e?[e.x,e.y]:null}_onDown(e){this._ignoreEvent(e)||this.isActive()||(this._startPos=this._pos=this._pointToArray(DOM.mousePos(this._el,e)),this._feature=this._map.queryRenderedFeatures(this._pos).shift(),this._fireEvent("feature-is-draggable",e),this._feature&&(e.touches?(window.document.addEventListener("touchmove",this._onMove),window.document.addEventListener("touchend",this._onTouchEnd)):(window.document.addEventListener("mousemove",this._onMove),window.document.addEventListener("mouseup",this._onMouseUp),window.addEventListener("blur",this._onMouseUp))))}_onMove(e){!this._ignoreEvent(e)&&this._feature&&(this._pos=this._pointToArray(DOM.mousePos(this._el,e)),this.isActive()||(this._active=!0,this._fireEvent("feature-dragstart",e)),this._fireEvent("feature-drag",e),e.preventDefault())}_onUp(e){this.isActive()&&(this._active=!1,this._pos=this._pointToArray(DOM.mousePos(this._el,e)),this._fireEvent("feature-dragend",e))}_onMouseUp(e){this._ignoreEvent(e)||(this._onUp(e),window.document.removeEventListener("mousemove",this._onMove),window.document.removeEventListener("mouseup",this._onMouseUp),window.removeEventListener("blur",this._onMouseUp))}_onTouchEnd(e){this._ignoreEvent(e)||(this._onUp(e),window.document.removeEventListener("touchmove",this._onMove),window.document.removeEventListener("touchend",this._onTouchEnd))}_fireEvent(e,t){return this._map.fire(e,{originalEvent:t,startPoint:this._startPos,point:this._pos,feature:this._feature,handler:this})}}module.exports=FeatureDragNDropHandler;

},{"mapbox-gl/src/util/dom":5,"mapbox-gl/src/util/util":6,"mapbox-gl/src/util/window":4}]},{},[7])(7)
});
//# sourceMappingURL=mapbox-gl-feature-drag-and-drop.js.map
