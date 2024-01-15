sap.ui.define(["simplot/portalsprd/controller/BaseController","simplot/portalsprd/utils/models","simplot/portalsprd/utils/gateway","sap/ui/core/BusyIndicator","simplot/portalsprd/utils/modelHelper","simplot/portalsprd/utils/FileReaderHelp","simplot/portalsprd/utils/Common","simplot/portalsprd/utils/controller/CommonCtaCte"],function(t,e,r,o,a,s,n,l){"use strict";var i="AUTOGESTION";var C="Model_CtaCte";var p="CUENTACTE";return t.extend("simplot.portalsprd.controller.CtaCte.CuentaCorriente",{onInit:function(){},onAfterRendering:function(){this._onObjectMatched()},_onObjectMatched:function(){this.getView().setModel(e.get(C))},onLoadModelAlta:function(){e.load(C,{rowsCtaCte:[],rowsCtaCteBack:[],rowsCtaCteCount:0,valueSearch:"",HeaderCtaCte:{}})},onViewCtaCte:function(t){var e=t.getSource().getBindingContext().getObject();l.onViewCtaCte(e)},onSearch:function(){var t={Query:e.get(C).getProperty("/valueSearch"),Model:e.get(C),Prop1:"NroLegal",Prop2:"NroLegal",ListaData:"/rowsCtaCte",ListaDataBack:"/rowsCtaCteBack",ListaDataCount:"/rowsCtaCteCount",ListaDataRealCount:"/rowsCtaCteRealCount"};n.onSearchGlobal(t)},onPressFilter:function(){var t=8;var r=n.getI18nText("ValidDateRange");var o=e.get(C);var a=o.getProperty("/Filtros/dateValueOne");var s=o.getProperty("/Filtros/dateValueTwo");var l=o.getProperty("/Filtros/selectEstado");var i=o.getProperty("/Filtros/selectComprobante");var p=o.getProperty("/rowsCtaCteBack");var u=[];if(a===undefined||s===undefined){}else{for(var d in p){var g=new Date(n.formatDate(p[d].FechaEmi,"FormatAAAAmmDD"));if(g>=a&&g<=s){u.push(p[d])}}if(t>u.length){t=u.length}o.setProperty("/rowsCtaCte",u);o.setProperty("/rowsCtaCteRealCount",u.length);o.setProperty("/rowsCtaCteCount",t);o.refresh()}var f=[];if(l.length>0){for(var d in l){var c;if(u.length>0){c=u.filter(t=>t.Estado===l[d])}else{c=p.filter(t=>t.Estado===l[d])}for(var h in c){f.push(c[h])}}if(t>f.length){t=f.length}u=f;o.setProperty("/rowsCtaCte",u);o.setProperty("/rowsCtaCteRealCount",u.length);o.setProperty("/rowsCtaCteCount",t);o.refresh()}else{}var v=[];if(i.length>0){for(var d in i){var c;if(u.length>0){c=u.filter(t=>t.CodDoc===i[d])}else{c=p.filter(t=>t.CodDoc===i[d])}for(var h in c){v.push(c[h])}}if(t>v.length){t=v.length}u=v;o.setProperty("/rowsCtaCte",u);o.setProperty("/rowsCtaCteRealCount",u.length);o.setProperty("/rowsCtaCteCount",t);o.refresh()}else{}},onClearFilter:function(){var t=8;var r=e.get(C);r.setProperty("/Filtros/dateValueOne",undefined);r.setProperty("/Filtros/dateValueTwo",undefined);r.setProperty("/Filtros/selectEstado",[]);r.setProperty("/Filtros/selectComprobante",[]);var o=r.getProperty("/rowsCtaCteBack");if(t>o.length){t=o.length}r.setProperty("/rowsCtaCte",o);r.setProperty("/rowsCtaCteRealCount",o.length);r.setProperty("/rowsCtaCteCount",t);r.refresh()},onNavBack:function(t){this.getOwnerComponent().getTargets().display("TargetMain")}})});