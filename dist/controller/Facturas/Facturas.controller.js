sap.ui.define(["simplot/portalsprd/controller/BaseController","simplot/portalsprd/utils/models","simplot/portalsprd/utils/gateway","sap/ui/core/BusyIndicator","simplot/portalsprd/utils/modelHelper","simplot/portalsprd/utils/FileReaderHelp","simplot/portalsprd/utils/Common","simplot/portalsprd/utils/controller/CommonFacturas"],function(e,t,o,r,a,i,s,n){"use strict";var l="AUTOGESTION";var g="Model_Facturas";return e.extend("simplot.portalsprd.controller.Facturas.Facturas",{onInit:function(){},onAfterRendering:function(){let e=this.getView().byId("inpFieldsTotal");let o=this.getView().byId("inpFieldsSubTotal");let r=this.getView().byId("inpFieldsTC");e.attachBrowserEvent("focusout",function(e){var o=e.target.value;var r=s.liveNumberDecimal2(o);console.log("valin "+o);console.log("valRet "+r);t.get(g).setProperty("/headerFields/total",r);t.get(g).refresh();e.stopPropagation()});o.attachBrowserEvent("focusout",function(e){var o=e.target.value;var r=s.liveNumberDecimal2(o);console.log("valin "+o);console.log("valRet "+r);t.get(g).setProperty("/headerFields/subtotal",r);t.get(g).refresh();e.stopPropagation()});r.attachBrowserEvent("focusout",function(e){var o=e.target.value;var r=s.liveNumberDecimal2(o);console.log("valin "+o);console.log("valRet "+r);t.get(g).setProperty("/headerFields/tipoCambio",r);t.get(g).refresh();e.stopPropagation()});this._onObjectMatched()},_onObjectMatched:function(){this.getView().setModel(t.get(g))},onFileUpload:function(e){var o=sap.ui.require("simplot/portalsprd/utils/FileReaderHelp");var r=e.getParameter("files")[0];t.get(g).setProperty("/File",r);t.get(g).refresh();if(r){var a=r;o.readBinaryString(a,jQuery.proxy(this.onFileLoadedRecursive,this,r))}},onFileLoadedRecursive:function(e,o){debugger;t.get(g).setProperty("/File/Contenido",o);var r=e.name;jQuery.sap.addUrlWhitelist("blob");debugger;t.get(g).setProperty("/PDFViewer/isVisibile",false);t.get(g).setProperty("/PDFViewer/SourcePDF",URL.createObjectURL(e));t.get(g).refresh()},onChangeComboMoneda:function(e){debugger;if(e.getSource().getProperty("selectedKey")==="ARS"){t.get(g).setProperty("/headerFields/tipoCambio","1");t.get(g).refresh()}else{t.get(g).setProperty("/headerFields/tipoCambio","");t.get(g).refresh()}},onSendToSap:function(){debugger;var e;var t=this.getView().byId("idFormDocs").getFormContainers()[0].getFormElements();var o=this;var r=this.getView().byId("idFormHeader").getFormContainers()[0].getFormElements();var a=this.getView().byId("idFormHeader").getFormContainers()[1].getFormElements();e=t;e=e.concat(r);e=e.concat(a);var i=document.getElementById(this.getView().byId("fechaVto").sId+"-inner").value;var l=document.getElementById(this.getView().byId("fechaDoc").sId+"-inner").value;if(s.f_FElements(e)){sap.m.MessageBox.show("Desea enviar la factura?",{icon:sap.m.MessageBox.Icon.WARNING,title:"Info",actions:[sap.m.MessageBox.Action.YES,sap.m.MessageBox.Action.NO],onClose:function(e){if(e===sap.m.MessageBox.Action.YES){n.onSendToSap(o,l,i)}else{}}})}else{sap.m.MessageBox.error("Existen campos obligatorios no cargados.")}},onChangeTipoDoc:function(){n.onChangeTipoDoc()},liveNumberDecimal:function(e){s.liveNumberDecimal(e.getSource())},onSendFile:function(){var e;var o=this.getView().byId("idFormDocs").getFormContainers()[0].getFormElements();var r=this.getView().byId("idFormDocs").getFormContainers()[1].getFormElements();e=o;e=e.concat(r);if(s.f_FElements(e)){s.onShowBusy();t.get(g).setProperty("/PDFViewer/isVisibile",true);t.get(g).setProperty("/Expanded",true);t.get(g).refresh();s.onChangeTextBusy(s.getI18nText("MsgDataInvoice"));var a=t.get(g).getProperty("/File");var i=new FormData;i.append("file",a,a.name);var l="7a9e1713-f23e-4d8a-9303-67abbd0f9b9f";var c=t.get(g).getProperty("/ComboTemplate/selectKey");debugger;const e=t.get(g).getProperty("/Combos/comboTipoFactura/selectKey");var d=t.get(g).getProperty("/TemplatesOCR");var m;var p;if(d.length>0){m=d.filter(t=>t.name.match(e));if(m!==undefined){p=m[0].id}else{p=d[0].id}}else{console.log("sin template.")}i.append("options",'{"clientId":"simplotId","documentType":"invoice","enrichment":{},"schemaId":"'+l+'","templateId":"'+c+'"}');n.onSendFile(i)}else{sap.m.MessageBox.error("Existen campos obligatorios no cargados.")}},onDeleteIva:function(e){var t=e.getSource().getBindingContext().sPath;n.onDeleteItems(e.getSource().getModel(),t,"/ivaItems","/ivaItemsMax")},onAddIva:function(e){var o=t.get(g).getProperty("/ivaItemsMax");var r=t.get(g).getProperty("/ivaItems");var a=t.get(g).getProperty("/taxItems");var i={ID:o+1,Item:"",Valor:"",key:""};n.onAddItems(e.getSource().getModel(),r,i,"ivaItems","/ivaItemsMax")},onDeleteIibb:function(e){var t=e.getSource().getBindingContext().sPath;n.onDeleteItems(e.getSource().getModel(),t,"/iibbItems","/iibbItemsMax")},onAddIibb:function(e){var o=t.get(g).getProperty("/iibbItemsMax");var r=t.get(g).getProperty("/iibbItems");var a={ID:o+1,Item:"",Valor:"",key:""};n.onAddItems(e.getSource().getModel(),r,a,"iibbItems","/iibbItemsMax")},onDeleteItemsDetail:function(e){var t=e.getSource().getBindingContext().sPath;n.onDeleteItems(e.getSource().getModel(),t,"/lineItems","/lineItemsMax")},onAddItemsDetail:function(e){var o=t.get(g).getProperty("/lineItemsMax");var r=t.get(g).getProperty("/lineItems");var a={ID:o+1,descripcion:"",cantidad:"0",precioUnit:"0",precioTotal:"0",page:""};n.onAddItems(e.getSource().getModel(),r,a,"lineItems","/lineItemsMax")},onRefreshComboOC:function(e,o){t.get(g).setProperty("/comboOrdenCompra/required",e);t.get(g).setProperty("/comboOrdenCompra/habilitado",o);t.get(g).setProperty("/comboOrdenCompra/selectKey","");t.get(g).refresh();return true},onChangeCircuito:function(e){var t=e.getSource().getSelectedKey();if(t==="1"){this.onRefreshComboOC(true,true)}else if(t==="2"){this.onRefreshComboOC(false,false)}else if(t==="3"){this.onRefreshComboOC(false,true)}},onValueHelpOCs:function(){n.onValueHelpOCs()},onNavBack:function(e){n.onCleanModelFacturas();this.getOwnerComponent().getTargets().display("TargetMain")}})});