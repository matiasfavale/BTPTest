sap.ui.define(["jquery.sap.global","sap/ui/Device","simplot/portalsprd/utils/models","simplot/portalsprd/model/makeHelper"],function(e,t,i,s){"use strict";var n="device",r=n,o=true;return s(n,r,o,function(i){var s={};s.events={};s.events.resize=[];i.setData(t);function n(){s.events.resize.map(function(e){e(t.resize.width,t.resize.height)})}t.resize.attachHandler(n);e.each({isCombi:"combi",isDesktop:"desktop",isPhone:"phone",isTablet:"tablet"},function(e,s){i[e]=function(){return t.system[s]}});i.extend({resize:function(e){s.events.resize.push(e)},fixedResize:n,removeAllEvents:function(){sap.ui.Device.resize.detachHandler(n)}});return i})});