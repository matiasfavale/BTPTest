sap.ui.define([
	"simplot/portalsprd/controller/BaseController",
	"simplot/portalsprd/utils/models",
	"simplot/portalsprd/utils/gateway",
	"sap/ui/core/BusyIndicator",
    "simplot/portalsprd/utils/modelHelper",
    "simplot/portalsprd/utils/FileReaderHelp",
    "simplot/portalsprd/utils/Common",
    "simplot/portalsprd/utils/controller/CommonFacturas"
], function (Controller,  models, gateway, BusyIndicator,  modelHelper, FileReaderHelp,  Common, CommonFacturas) {
	"use strict";
	var sService = "AUTOGESTION";
	var sModelMainFacturas = "Model_Facturas";
	return Controller.extend("simplot.portalsprd.controller.Facturas.Facturas", {
		onInit: function() {
            //this._onObjectMatched(); 
		},	
		
        onAfterRendering: function(){
            //this.getRouter().getRoute("altaform").attachPatternMatched(this._onObjectMatched, this);     
            let oInputFieldsTot = this.getView().byId("inpFieldsTotal");
            let oInputFieldsSuTot = this.getView().byId("inpFieldsSubTotal");
            let oInputFieldsTC = this.getView().byId("inpFieldsTC");
			oInputFieldsTot.attachBrowserEvent("focusout", function(oEvent){
				var sValueIn = oEvent.target.value; //oCore.getModel("mFilters").getProperty("/inpejemplo");
				var valRet = Common.liveNumberDecimal2(sValueIn);
				console.log("valin " + sValueIn);
				console.log("valRet " + valRet);
                models.get(sModelMainFacturas).setProperty("/headerFields/total",valRet);
				models.get(sModelMainFacturas).refresh();
				oEvent.stopPropagation();			
			});  
            oInputFieldsSuTot.attachBrowserEvent("focusout", function(oEvent){
				var sValueIn = oEvent.target.value; //oCore.getModel("mFilters").getProperty("/inpejemplo");
				var valRet = Common.liveNumberDecimal2(sValueIn);
				console.log("valin " + sValueIn);
				console.log("valRet " + valRet);
				models.get(sModelMainFacturas).setProperty("/headerFields/subtotal",valRet);
				models.get(sModelMainFacturas).refresh();
				oEvent.stopPropagation();			
			});  
            oInputFieldsTC.attachBrowserEvent("focusout", function(oEvent){
				var sValueIn = oEvent.target.value; //oCore.getModel("mFilters").getProperty("/inpejemplo");
				var valRet = Common.liveNumberDecimal2(sValueIn);
				console.log("valin " + sValueIn);
				console.log("valRet " + valRet);
				models.get(sModelMainFacturas).setProperty("/headerFields/tipoCambio",valRet);
				models.get(sModelMainFacturas).refresh();
				oEvent.stopPropagation();			
			});        
            this._onObjectMatched(); 			
		},

        _onObjectMatched: function() {
            this.getView().setModel(models.get(sModelMainFacturas));            
        },

        onFileUpload: function (oEvent) {
            var fileReaderHelp = sap.ui.require("simplot/portalsprd/utils/FileReaderHelp");
            var oFile = oEvent.getParameter("files")[0];
            models.get(sModelMainFacturas).setProperty("/File", oFile);
            models.get(sModelMainFacturas).refresh();
            if (oFile) {
                var file = oFile;
                fileReaderHelp.readBinaryString(file, jQuery.proxy(this.onFileLoadedRecursive, this, oFile));
            }
        },
        onFileLoadedRecursive: function (oFile, binaryString) {
            debugger;
            models.get(sModelMainFacturas).setProperty("/File/Contenido", binaryString);
            var sName = oFile.name;
            jQuery.sap.addUrlWhitelist("blob");
            debugger;
            models.get(sModelMainFacturas).setProperty("/PDFViewer/isVisibile", false);
            models.get(sModelMainFacturas).setProperty("/PDFViewer/SourcePDF", URL.createObjectURL(oFile));
            models.get(sModelMainFacturas).refresh();
            /*
            models.get(sModelMainFacturas).setProperty("/File", binaryString);
            models.get(sModelMainFacturas).refresh();
            */
        },

        onChangeComboMoneda: function(oEvent){
            debugger;
            if(oEvent.getSource().getProperty("selectedKey") === "ARS"){
                models.get(sModelMainFacturas).setProperty("/headerFields/tipoCambio", "1");
                models.get(sModelMainFacturas).refresh();
            }else{
                models.get(sModelMainFacturas).setProperty("/headerFields/tipoCambio", "");
                models.get(sModelMainFacturas).refresh();
            }
        },

        onSendToSap: function(){
            debugger;
            var oFormRequired;
            //idFormHeader
            var oFormDocs = this.getView().byId("idFormDocs").getFormContainers()[0].getFormElements();
            var oContext = this;
            var oFormHeaderElem1 = this.getView().byId("idFormHeader").getFormContainers()[0].getFormElements();
            var oFormHeaderElem2 = this.getView().byId("idFormHeader").getFormContainers()[1].getFormElements();
            oFormRequired  = oFormDocs;
            oFormRequired = oFormRequired.concat(oFormHeaderElem1);
            oFormRequired = oFormRequired.concat(oFormHeaderElem2);
            var fechaVto  = document.getElementById(this.getView().byId("fechaVto").sId + "-inner").value;
            var fechaDoc  = document.getElementById(this.getView().byId("fechaDoc").sId + "-inner").value;
            if(Common.f_FElements(oFormRequired)){
                sap.m.MessageBox.show("Desea enviar la factura?", {
                    "icon": sap.m.MessageBox.Icon.WARNING,
                    "title": "Info",
                    "actions": [
                        sap.m.MessageBox.Action.YES,
                        sap.m.MessageBox.Action.NO
                    ],
                    "onClose": function (vAction) {                    
                        if (vAction === sap.m.MessageBox.Action.YES) {
                            CommonFacturas.onSendToSap(oContext, fechaDoc, fechaVto);
                        } else {}
                    }
                }); 
            }else{
                sap.m.MessageBox.error("Existen campos obligatorios no cargados.");
            }
                       
        },

        onChangeTipoDoc:function(){
            CommonFacturas.onChangeTipoDoc();
        },

        liveNumberDecimal: function(oEvent){
            Common.liveNumberDecimal(oEvent.getSource());
        },

        onSendFile: function(){
            var oFormRequired;
            var oFormDocs = this.getView().byId("idFormDocs").getFormContainers()[0].getFormElements();            
            var oFormDocs1 = this.getView().byId("idFormDocs").getFormContainers()[1].getFormElements();
            oFormRequired  = oFormDocs;
            oFormRequired = oFormRequired.concat(oFormDocs1);
            if(Common.f_FElements(oFormRequired)){
                Common.onShowBusy();
                models.get(sModelMainFacturas).setProperty("/PDFViewer/isVisibile", true);
                models.get(sModelMainFacturas).setProperty("/Expanded", true);
                models.get(sModelMainFacturas).refresh();
                Common.onChangeTextBusy(Common.getI18nText("MsgDataInvoice"));
                var oFile = models.get(sModelMainFacturas).getProperty("/File");            
                /*
                var oOptions = {"clientId":"simplotId","documentType":"invoice","enrichment":{},"schemaId":"7a9e1713-f23e-4d8a-9303-67abbd0f9b9f","templateId":"2d86cc00-b058-490b-a7bf-7c983856b14e"}
                var oProps = {file:models.get(sModelMainFacturas).getProperty("/File"),
                    options:oOptions
                };
                */
                var form = new FormData();
                form.append("file", oFile, oFile.name);
                var sSchemaId = "7a9e1713-f23e-4d8a-9303-67abbd0f9b9f";
                var sTemplateId = models.get(sModelMainFacturas).getProperty("/ComboTemplate/selectKey");
                debugger;
                const sKeyTipoFactura = models.get(sModelMainFacturas).getProperty("/Combos/comboTipoFactura/selectKey");
                var aTemplates = models.get(sModelMainFacturas).getProperty("/TemplatesOCR");
                var arrTemplate;
                var sNewTemplate;
                if(aTemplates.length > 0){
                    arrTemplate = aTemplates.filter(nfilter=>nfilter.name.match(sKeyTipoFactura));                    
                    if(arrTemplate !== undefined){
                        sNewTemplate = arrTemplate[0].id;
                    }else{
                        sNewTemplate = aTemplates[0].id;
                    }
                }else{
                    console.log("sin template.");
                }              

                form.append("options", "{\"clientId\":\"simplotId\",\"documentType\":\"invoice\",\"enrichment\":{},\"schemaId\":\"" + sSchemaId + "\",\"templateId\":\"" +  sTemplateId + "\"}");
                CommonFacturas.onSendFile(form);
                
                //api/document/jobs
            }else{
                sap.m.MessageBox.error("Existen campos obligatorios no cargados.");
            }            
        },

        onDeleteIva:function(oEvent){
            var sPath = oEvent.getSource().getBindingContext().sPath;
			CommonFacturas.onDeleteItems(oEvent.getSource().getModel(), sPath, "/ivaItems", "/ivaItemsMax");
        },

        onAddIva:function(oEvent){
            var nCount = models.get(sModelMainFacturas).getProperty("/ivaItemsMax");
            var aRows = models.get(sModelMainFacturas).getProperty("/ivaItems");
            var aTaxRows = models.get(sModelMainFacturas).getProperty("/taxItems");
            
			var oNewRow = {ID: nCount + 1, Item: "", Valor: "", key:"" };
			CommonFacturas.onAddItems(oEvent.getSource().getModel(), aRows, oNewRow, "ivaItems", "/ivaItemsMax");
		},

        onDeleteIibb:function(oEvent){
            var sPath = oEvent.getSource().getBindingContext().sPath;
			CommonFacturas.onDeleteItems(oEvent.getSource().getModel(), sPath, "/iibbItems", "/iibbItemsMax");
        },

        onAddIibb:function(oEvent){
            var nCount = models.get(sModelMainFacturas).getProperty("/iibbItemsMax");
            var aRows = models.get(sModelMainFacturas).getProperty("/iibbItems");
			var oNewRow = {ID: nCount + 1, Item: "", Valor: "" , key:""};
			CommonFacturas.onAddItems(oEvent.getSource().getModel(), aRows, oNewRow, "iibbItems", "/iibbItemsMax");
		},

        onDeleteItemsDetail:function(oEvent){
            var sPath = oEvent.getSource().getBindingContext().sPath;
			CommonFacturas.onDeleteItems(oEvent.getSource().getModel(), sPath, "/lineItems", "/lineItemsMax");
        },

        onAddItemsDetail: function(oEvent){
            var nCount = models.get(sModelMainFacturas).getProperty("/lineItemsMax");
            var aRows = models.get(sModelMainFacturas).getProperty("/lineItems");
			var oNewRow = {ID: nCount + 1, descripcion: "", cantidad: "0", precioUnit: "0", precioTotal: "0", page: "" };
			CommonFacturas.onAddItems(oEvent.getSource().getModel(), aRows, oNewRow, "lineItems", "/lineItemsMax");
		},

        onRefreshComboOC: function(boolRequired, boolHabilitado){
            models.get(sModelMainFacturas).setProperty("/comboOrdenCompra/required", boolRequired);
            models.get(sModelMainFacturas).setProperty("/comboOrdenCompra/habilitado", boolHabilitado);
            models.get(sModelMainFacturas).setProperty("/comboOrdenCompra/selectKey", "");
            models.get(sModelMainFacturas).refresh();
            return true; 
        },
        
        onChangeCircuito:function(oEvent){
            var sKey = oEvent.getSource().getSelectedKey();
            if(sKey === "1"){
                this.onRefreshComboOC(true, true);           
            }else if(sKey === "2"){
                this.onRefreshComboOC(false, false);
            }else if(sKey === "3"){
                this.onRefreshComboOC(false, true);
            }            
        },

        onValueHelpOCs: function(){
            CommonFacturas.onValueHelpOCs();
        },
        
        onNavBack: function (oEvent) {
            //this.getRouter().navTo("main", {}, true);
            CommonFacturas.onCleanModelFacturas();
			this.getOwnerComponent().getTargets().display("TargetMain");
		}
	});
});