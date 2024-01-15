sap.ui.define(["simplot/portalsqas/utils/models","simplot/portalsqas/utils/gateway","simplot/portalsqas/utils/modelHelper","simplot/portalsqas/utils/FileDownHelp","simplot/portalsqas/utils/Common","sap/m/Button","sap/m/Dialog","sap/m/Text"],function(e,t,r,o,s,a,i,n){"use strict";var l="NOTICIAS";var d="ORDEN_COMPRA";var p="AUTOGESTION";var f="Model_Pizarron";var u="Model_ControllerMain";var m="Model_OC";return{getCommon:function(){var e=sap.ui.require("simplot/portalsqas/utils/Common");return e},getI18nText:function(t){return e.get("i18n").getProperty(t)},onLoadModelOC:function(t){if(e.exists(m)){}else{e.load(m,{rowsOrdenCompra:[],rowsOrdenCompraBack:[],tileFecha:(new Date).toLocaleDateString(),rowsHeaderOC:[],rowsItemsOC:[],rowsItemsOCMax:0,visibleDetail:false,isShowMode:true,iconExpand:"sap-icon://full-screen"})}this.onGetListOC(false,t)},onGetListOC:function(r,o){var s=this.getCommon();var a=this;var i="/OCListadoSet";var n=e.get("Model_User").getProperty("/DataUser/NrSap");var l=new sap.ui.model.Filter("IvLifnr","EQ",n);t.read(d,i,{filters:[l]}).then(function(t){var a=t.results;for(var i in a){a[i].Fecha=s.formatDate(a[i].Aedat,"Main");if(a[i].IdEstado==="1"){a[i].InfoStatus="Success"}else if(a[i].IdEstado==="2"){a[i].InfoStatus="Information"}else if(a[i].IdEstado==="3"){a[i].InfoStatus="Warning"}else if(a[i].IdEstado==="4"){a[i].InfoStatus="Error"}}if(r){e.get(u).setProperty("/OC/CountCumplida",a.filter(e=>e.IdEstado==="1").length);e.get(u).setProperty("/OC/CountRecepParcial",a.filter(e=>e.IdEstado==="3").length);e.get(u).setProperty("/OC/rowsOC",a);e.get(u).refresh()}else{e.get(m).setProperty("/rowsOrdenCompra",a);e.get(m).setProperty("/rowsOrdenCompraBack",a);e.get(m).refresh()}if(o!==null){e.get(m).setProperty("/rowsOrdenCompra",a.filter(e=>e.IdEstado===o));e.get(m).setProperty("/rowsOrdenCompraBack",a.filter(e=>e.IdEstado===o));e.get(m).refresh()}console.log(t)}).catch(function(e){console.log(e)})}}});