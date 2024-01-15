sap.ui.define(["simplot/portalsqas/utils/models","simplot/portalsqas/utils/gateway","simplot/portalsqas/utils/FileDownHelp","simplot/portalsqas/utils/Common","sap/m/Button","sap/m/Dialog","sap/m/Text"],function(e,o,t,r,a,i,n){"use strict";var s="FACTURA";var l="AUTOGESTION";var c="GENERAL";var u="Model_FacturasView";var p="Model_ControllerMain";var d="/comsapappsdocumentinformationextraction.businessservice/api";var m="/document-information-extraction/v1";var g;return{onGetEnvironment:function(){g=m},getCommon:function(){var e=sap.ui.require("simplot/portalsqas/utils/Common");return e},getI18nText:function(o){return e.get("i18n").getProperty(o)},onLoadExenciones:function(){var t="/ExencionesSet";o.read(s,t,{}).then(function(o){console.log("/ExencionesSet");console.log(o);e.get(u).setProperty("/ListaExenciones",o.results)}).catch(function(e){console.log(e)})},onLoadModelFacturas:function(){var o=this;debugger;var t=this.getCommon();t.onShowBusy();t.onChangeTextBusy(this.getI18nText("RecuperandoDatos"));if(e.exists(u)){e.get(u).setProperty("/rowsFacturasViewCount",0);e.get(u).setProperty("/rowsFacturasView",[]);e.get(u).setProperty("/rowsFacturasViewBack",[]);e.get(u).setProperty("/DetailFactura",{Factura:{},PDFViewerDetail:{isVisibile:false,SourcePDF:""}})}else{e.load(u,{rowsFacturasViewCount:0,rowsFacturasView:[],rowsFacturasViewBack:[],DetailFactura:{Factura:{},PDFViewerDetail:{isVisibile:false,SourcePDF:""}},ComboSubtipo:[],ComboSociedad:[],ListaExenciones:[]})}e.get(u).refresh();this.onLoadExenciones();this.onGetTiposDoc()},onGetTiposDoc:function(){var t="/TiposDocSet";var r=e.get("Model_User").getProperty("/DataUser");var a=this;var i=false;if(i){a.onGetFacturas()}else{o.read(s,t,{}).then(function(t){e.get(u).setProperty("/ComboSubtipo",t.results);e.get(u).refresh();var i=new sap.ui.model.Filter("IvNrSap","EQ",r.NrSap);var n=new sap.ui.model.Filter("IvTipoBp","EQ",r.TipoBp);var s="/SociedadBPSet";o.read(c,s,{filters:[i,n]}).then(function(o){e.get(u).setProperty("/ComboSociedad",o.results);e.get(u).refresh();a.onGetFacturas()}).catch(function(e){console.log(e);oCommonHelp.onCloseBusy()})}).catch(function(e){console.log(e);oCommonHelp.onCloseBusy()})}},onGetDescripcionCombo:function(e,o){var t="";var r=e.filter(e=>e.key===o);if(r.length>0){t=r[0].value}return t},validZerosLifnr:function(e){e=e.toString();if(e.length===6){e="0000"+e}return e},onGetFacturas:function(){var t=this.getCommon();var r=t.getCombosFacturas();var a=e.get(u).getProperty("/ComboSubtipo");var i=e.get(u).getProperty("/ComboSociedad");var n=e.get("Model_User").getProperty("/DataUser");var l=n.NrSap;if(isNaN(l)){l=l}else{l=this.validZerosLifnr(l)}var c=new sap.ui.model.Filter("Lifnr","EQ",n.NrSap);var p=new sap.ui.model.Filter("FechaCarga","BT","20220728","20220802");var d=this;var m="/DocumentoSet";o.read(s,m,{filters:[c]}).then(function(o){console.log(o);debugger;i=i;var n=o.results;for(var s in n){n[s].visibleCommentReject=false;if(n[s].Estado==="3"){n[s].visibleCommentReject=true}n[s].ImpNeto=t.onReturnFormatNumber(Number(n[s].ImpNeto),2);n[s].ImpBruto=t.onReturnFormatNumber(Number(n[s].ImpBruto),2);n[s].TipoCambio=t.onReturnFormatNumber(Number(n[s].TipoCambio),5);n[s].FechaDoc=t.formatDate(n[s].FechaDoc,"Main");n[s].CaeVenc=t.formatDate(n[s].CaeVenc,"Main");n[s].FechaCarga=t.formatDate(n[s].FechaCarga,"Main");n[s].ModoValue=d.onGetDescripcionCombo(r.Modo,n[s].Modo);n[s].TipoDocValue=d.onGetDescripcionCombo(r.TipoFactura,n[s].TipoDoc);n[s].CircuitoValue=d.onGetDescripcionCombo(r.Circuito,n[s].Circuito);n[s].StateValue=d.onGetDescripcionCombo(r.State,n[s].Estado);n[s].SubtipoDocValue=a.filter(e=>e.SubtipoDoc===n[s].SubtipoDoc)[0].Texto;if(n[s].Sociedad===""){n[s].SociedadValue=""}else{n[s].SociedadValue=i.filter(e=>e.Codigo===n[s].Sociedad)[0].Texto}n[s].IvaTable=[];n[s].PercepcionesTable=[];for(var l=1,c=20;l<=c;l++){var p=t.validTaxCharacter(l);if(n[s][p.Key]===""){}else{if(n[s][p.Key].indexOf("Perc")>=0){var m=t.onReturnFormatNumber(Number(n[s][p.Val]),2);var g={key:n[s][p.Key],item:d.onGetDescripcionCombo(r.KeysIIBB,n[s][p.Key]),value:m};n[s].PercepcionesTable.push(g)}else{var m=t.onReturnFormatNumber(Number(n[s][p.Val]),2);var g={key:n[s][p.Key],item:d.onGetDescripcionCombo(r.KeysIva,n[s][p.Key]),value:m};n[s].IvaTable.push(g)}}}n[s].IvaTableMax=n[s].IvaTable.length;n[s].PercepcionesTableMax=n[s].PercepcionesTable.length}e.get(u).setProperty("/rowsFacturasView",n);e.get(u).setProperty("/rowsFacturasViewBack",n);e.get(u).setProperty("/rowsFacturasViewCount",n.length);e.get(u).refresh();t.onCloseBusy()}).catch(function(e){t.onCloseBusy();console.log(e)})},toBlob:function(e){var o=atob(e.replace(/\s/g,""));var t=o.length;var r=new ArrayBuffer(t);var a=new Uint8Array(r);for(var i=0;i<t;i++){a[i]=o.charCodeAt(i)}var n=new Blob([a],{type:"application/pdf"});var s=URL.createObjectURL(n);return n},onDetailFactura:function(t){var r=this.getCommon();r.onShowBusy();r.onChangeTextBusy(this.getI18nText("RecuperandoDatos"));e.get(u).setProperty("/DetailFactura/Factura",t);e.get(u).refresh();var a=this;var i="/AdjuntoSet(Lifnr='"+t.Lifnr+"',IdDoc='"+t.IdDoc+"')";o.read(s,i,{}).then(function(o){console.log(o);if(o.Contenido===""){e.get(u).setProperty("/DetailFactura/PDFViewerDetail",{isVisibile:false,Contenido:"",SourcePDF:""})}else{var t=a.toBlob(o.Contenido);jQuery.sap.addUrlWhitelist("blob");e.get(u).setProperty("/DetailFactura/PDFViewerDetail",{isVisibile:true,SourcePDF:URL.createObjectURL(t),Contenido:o.Contenido})}e.get(u).refresh();a.onDetailViewFactura()}).catch(function(e){r.onCloseBusy();console.log(e)})},onDetailViewFactura:function(o){var t=this.getCommon();var r=e.get(p).getProperty("/ControllerMain");var a=this;var i,n=new jQuery.Deferred;if(!r._ControllerDetailFactura){r._ControllerDetailFactura={deferred:null,onPressCancel:function(e){i.close()}}}r._ControllerDetailFactura.deferred=n;if(!r._dialogDetailFactura){r._dialogDetailFactura=sap.ui.xmlfragment("simplot.portalsqas.view.fragment.DetailFacturas",r._ControllerDetailFactura)}i=r._dialogDetailFactura;i.setModel(e.get(u));r.getView().addDependent(i);t.onCloseBusy();i.open()},onViewNotaFactura:function(o){var t=this.getCommon();var r=e.get(p).getProperty("/ControllerMain");var a=this;var i,n=new jQuery.Deferred;e.get(u).setProperty("/Nota",o);e.get(u).refresh();if(!r._ControllerViewNotaProveedor){r._ControllerViewNotaProveedor={deferred:null,onClose:function(e){i.close()}}}r._ControllerViewNotaProveedor.deferred=n;if(!r._dialogViewNotaProveedor){r._dialogViewNotaProveedor=sap.ui.xmlfragment("simplot.portalsqas.view.fragment.ViewNotaProveedor",r._ControllerViewNotaProveedor)}i=r._dialogViewNotaProveedor;i.setModel(e.get(u));r.getView().addDependent(i);i.open()}}});