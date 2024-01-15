sap.ui.define([
	"simplot/portalsqas/utils/models",
	"simplot/portalsqas/utils/gateway",
    "simplot/portalsqas/utils/FileDownHelp",
    "simplot/portalsqas/utils/Common",
    "sap/m/Button",
	"sap/m/Dialog",
	"sap/m/Text"
	//helpers
], function (models, gateway,  FileDownHelp, Common, Button, Dialog, Text) {
	"use strict";
	var sService = "FACTURA";
	var sServiceAuto = "AUTOGESTION";
    var sServiceGeneral = "GENERAL";
    var sModelMainFacturasView = "Model_FacturasView";
    var sModelMain = "Model_ControllerMain";
    var serviceOCRDev = "/comsapappsdocumentinformationextraction.businessservice/api";
    var serviceOCRLocal =  "/document-information-extraction/v1";
    var serviceOCR;
 
	return {
        onGetEnvironment:function(){
            serviceOCR = serviceOCRLocal; // serviceOCRLocal; //serviceOCRDev
        },

        getCommon:function(){
            var commonHelp = sap.ui.require("simplot/portalsqas/utils/Common");
            return commonHelp;
        },

        getI18nText: function(sId){
			return models.get("i18n").getProperty(sId);
		},

        onLoadExenciones: function(){
            var sEntity = "/ExencionesSet";
            gateway.read(sService, sEntity, {}).then(function (oRecive) {
                console.log("/ExencionesSet");
                console.log(oRecive);
                models.get(sModelMainFacturasView).setProperty("/ListaExenciones", oRecive.results);
            }).catch(function (oError) {
                console.log(oError);
            });
        },

        onLoadModelFacturas:function(){
            var oContext = this;
            debugger;
            var oCommonHelp = this.getCommon(); 
			oCommonHelp.onShowBusy();
			oCommonHelp.onChangeTextBusy(this.getI18nText("RecuperandoDatos"));
            
            if(models.exists(sModelMainFacturasView)){
                models.get(sModelMainFacturasView).setProperty("/rowsFacturasViewCount",0);
                models.get(sModelMainFacturasView).setProperty("/rowsFacturasView",[]);
                models.get(sModelMainFacturasView).setProperty("/rowsFacturasViewBack",[]);
                models.get(sModelMainFacturasView).setProperty("/DetailFactura",{"Factura":{},
                    "PDFViewerDetail": {"isVisibile": false, "SourcePDF":""}});
            }else{
                models.load(sModelMainFacturasView, {
                    "rowsFacturasViewCount":0,
                    "rowsFacturasView":[],
                    "rowsFacturasViewBack":[],
                    "DetailFactura":{"Factura":{},
                        "PDFViewerDetail": {"isVisibile": false, "SourcePDF":""}},
                    "ComboSubtipo": [],
                    "ComboSociedad":[],
                    "ListaExenciones": []
                });
            }
            models.get(sModelMainFacturasView).refresh();
            this.onLoadExenciones();
            this.onGetTiposDoc();
            //this.onGetFacturas();
        },

        onGetTiposDoc: function(){
            var sEntity = "/TiposDocSet";
            var oUserData = models.get("Model_User").getProperty("/DataUser");
            var oContext = this;
            //if models.get(sModelMainFacturasView).getProperty("/ComboSubtipo").length > 0
            var boolTest = false;
            if(boolTest){
                oContext.onGetFacturas();
            }else{
                gateway.read(sService, sEntity, {})
                .then(function(oRecive){                
                    models.get(sModelMainFacturasView).setProperty("/ComboSubtipo", oRecive.results)
                    models.get(sModelMainFacturasView).refresh();
                    
                    var nFilter = new sap.ui.model.Filter("IvNrSap", "EQ", oUserData.NrSap);
                    var nFilter2 = new sap.ui.model.Filter("IvTipoBp", "EQ", oUserData.TipoBp);
                    var sEntity = "/SociedadBPSet";
                    gateway.read(sServiceGeneral, sEntity, {"filters": [nFilter,nFilter2]})
                    .then(function(oRecive){
                        models.get(sModelMainFacturasView).setProperty("/ComboSociedad", oRecive.results)
                        models.get(sModelMainFacturasView).refresh();
                        oContext.onGetFacturas();
                    })
                    .catch(function(error){
                        console.log(error);
                        oCommonHelp.onCloseBusy();
                    }); 
                })
                .catch(function(error){
                    console.log(error);
                    oCommonHelp.onCloseBusy();
                });
            }
        },

        onGetDescripcionCombo: function(arrCombo, sKey){
            var sValue = "";
            var aNewObjetc = arrCombo.filter(nfilter=>nfilter.key === sKey);
            if(aNewObjetc.length > 0){
                sValue = aNewObjetc[0].value;
            }
            return sValue;
        },

        validZerosLifnr: function(sLifnr){
            sLifnr = sLifnr.toString();
            if(sLifnr.length === 6){
                sLifnr = "0000" + sLifnr;
            }
            return sLifnr;
        },

        onGetFacturas: function(){       
            var oCommonHelp = this.getCommon(); 
            var aCombos = oCommonHelp.getCombosFacturas();    
            var aComboSubtipo = models.get(sModelMainFacturasView).getProperty("/ComboSubtipo");
            var aComboSociedad = models.get(sModelMainFacturasView).getProperty("/ComboSociedad");
            var oUserData = models.get("Model_User").getProperty("/DataUser");
            // oUserData.NrSap
            //ToDo si lifnr es numerico completar con 0 hasta 10 digitos
            var sLifnr = oUserData.NrSap;
            if(isNaN(sLifnr)){
                sLifnr = sLifnr
            }else{
                sLifnr = this.validZerosLifnr(sLifnr);
            }
            var nFilter = new sap.ui.model.Filter("Lifnr", "EQ", oUserData.NrSap);
            var nFilter2 = new sap.ui.model.Filter("FechaCarga", "BT", "20220728", "20220802");
            var oContext = this;
            var sEntity = "/DocumentoSet";
            
            gateway.read(sService, sEntity, {"filters": [nFilter]})
            .then(function(oRecive){
                console.log(oRecive);
                debugger;
                aComboSociedad=aComboSociedad;
                var aData = oRecive.results;
                for(var i in aData){
                    aData[i].visibleCommentReject = false;
                    if(aData[i].Estado === "3"){
                        aData[i].visibleCommentReject = true;
                    }
                    //aData[i].ImpNeto = Number(aData[i].ImpNeto).toFixed(2).replace(".", ",");
                    //aData[i].ImpBruto = Number(aData[i].ImpBruto).toFixed(2).replace(".", ",");
                    //aData[i].TipoCambio = Number(aData[i].TipoCambio).toFixed(5).replace(".", ",");
                    aData[i].ImpNeto = oCommonHelp.onReturnFormatNumber(Number(aData[i].ImpNeto),2);
                    aData[i].ImpBruto = oCommonHelp.onReturnFormatNumber(Number(aData[i].ImpBruto),2);
                    aData[i].TipoCambio = oCommonHelp.onReturnFormatNumber(Number(aData[i].TipoCambio),5);
                    aData[i].FechaDoc = oCommonHelp.formatDate(aData[i].FechaDoc, "Main");
                    aData[i].CaeVenc = oCommonHelp.formatDate(aData[i].CaeVenc, "Main");
                    aData[i].FechaCarga = oCommonHelp.formatDate(aData[i].FechaCarga, "Main");
                    aData[i].ModoValue = oContext.onGetDescripcionCombo(aCombos.Modo, aData[i].Modo);
                    aData[i].TipoDocValue = oContext.onGetDescripcionCombo(aCombos.TipoFactura, aData[i].TipoDoc);
                    aData[i].CircuitoValue = oContext.onGetDescripcionCombo(aCombos.Circuito, aData[i].Circuito);
                    aData[i].StateValue = oContext.onGetDescripcionCombo(aCombos.State, aData[i].Estado);
                    aData[i].SubtipoDocValue = aComboSubtipo.filter(nfilter=>nfilter.SubtipoDoc === aData[i].SubtipoDoc)[0].Texto;
                    if(aData[i].Sociedad === ""){
                        aData[i].SociedadValue = "";
                    }else{
                        aData[i].SociedadValue = aComboSociedad.filter(nfilter=>nfilter.Codigo === aData[i].Sociedad)[0].Texto;
                    }
                    
                    
                    aData[i].IvaTable = [];
                    aData[i].PercepcionesTable = [];
                    for(var k=1, x=20; k<=x; k++){
                        var oTaxKeyValue = oCommonHelp.validTaxCharacter(k);
                        if(aData[i][oTaxKeyValue.Key] === ""){}else{
                            if(aData[i][oTaxKeyValue.Key].indexOf("Perc") >= 0){
                                var sValueImporte = oCommonHelp.onReturnFormatNumber(Number(aData[i][oTaxKeyValue.Val]),2);
                                var obj={
                                    key: aData[i][oTaxKeyValue.Key],
                                    item: oContext.onGetDescripcionCombo(aCombos.KeysIIBB, aData[i][oTaxKeyValue.Key]),
                                    value: sValueImporte
                                    //value: Number(aData[i][oTaxKeyValue.Val]).toFixed(2).replace(".", ",")
                                }
                                aData[i].PercepcionesTable.push(obj);
                            }else{
                                var sValueImporte = oCommonHelp.onReturnFormatNumber(Number(aData[i][oTaxKeyValue.Val]),2);
                                var obj={
                                    key: aData[i][oTaxKeyValue.Key],
                                    item: oContext.onGetDescripcionCombo(aCombos.KeysIva, aData[i][oTaxKeyValue.Key]),
                                    value: sValueImporte
                                    //value: Number(aData[i][oTaxKeyValue.Val]).toFixed(2).replace(".", ",")
                                }
                                aData[i].IvaTable.push(obj);
                            }
                        }
                    }
                    aData[i].IvaTableMax = aData[i].IvaTable.length;
                    aData[i].PercepcionesTableMax = aData[i].PercepcionesTable.length;
                }
                models.get(sModelMainFacturasView).setProperty("/rowsFacturasView", aData);
                models.get(sModelMainFacturasView).setProperty("/rowsFacturasViewBack", aData);
                models.get(sModelMainFacturasView).setProperty("/rowsFacturasViewCount", aData.length);
                models.get(sModelMainFacturasView).refresh();
                oCommonHelp.onCloseBusy();
            })
            .catch(function(error){
                oCommonHelp.onCloseBusy();
                console.log(error);
            });            
        },

        toBlob: function(base64str){
            var binary = atob(base64str.replace(/\s/g, ''));
            var len = binary.length;
            var buffer = new ArrayBuffer(len);
            var view = new Uint8Array(buffer);
            for (var i = 0; i < len; i++) {
                view[i] = binary.charCodeAt(i);
            }
            
            // create the blob object with content-type "application/pdf"               
            var blob = new Blob( [view], { type: "application/pdf" });
            var url = URL.createObjectURL(blob);
            return blob;
        },

        onDetailFactura: function(oFactura){
            var oCommonHelp = this.getCommon();
            oCommonHelp.onShowBusy();
			oCommonHelp.onChangeTextBusy(this.getI18nText("RecuperandoDatos"));
            models.get(sModelMainFacturasView).setProperty("/DetailFactura/Factura", oFactura);
            models.get(sModelMainFacturasView).refresh();
            var oContext = this;
            var sEntity = "/AdjuntoSet(Lifnr='" + oFactura.Lifnr + "',IdDoc='" + oFactura.IdDoc + "')";
            gateway.read(sService, sEntity, {})
            .then(function(oRecive){
                console.log(oRecive);
                if(oRecive.Contenido === ""){
                    models.get(sModelMainFacturasView).setProperty("/DetailFactura/PDFViewerDetail", 
                        {"isVisibile": false, "Contenido":"", "SourcePDF":""});
                }else{
                    var oBlob = oContext.toBlob(oRecive.Contenido);
                    jQuery.sap.addUrlWhitelist("blob");
                    models.get(sModelMainFacturasView).setProperty("/DetailFactura/PDFViewerDetail", 
                        {"isVisibile": true, "SourcePDF":URL.createObjectURL(oBlob),"Contenido":oRecive.Contenido});
                }
                models.get(sModelMainFacturasView).refresh();
                oContext.onDetailViewFactura();
            })
            .catch(function(oError){
                oCommonHelp.onCloseBusy();
                console.log(oError);
            })
        },

        onDetailViewFactura: function (oFactura) {
            var oCommonHelp = this.getCommon();
            var oController = models.get(sModelMain).getProperty("/ControllerMain");
            var oContext = this;
            var oDialog,
                oDeferred = new jQuery.Deferred();
            if (!oController._ControllerDetailFactura) {
                oController._ControllerDetailFactura = {
                    "deferred": null,
                    "onPressCancel": function (oEvent) {
                        oDialog.close();
                    }
                };
            }
            oController._ControllerDetailFactura.deferred = oDeferred;
            if (!oController._dialogDetailFactura) {
                oController._dialogDetailFactura = sap.ui.xmlfragment("simplot.portalsqas.view.fragment.DetailFacturas", oController._ControllerDetailFactura);
            }
            oDialog = oController._dialogDetailFactura;
            oDialog.setModel(models.get(sModelMainFacturasView));
            oController.getView().addDependent(oDialog);
            oCommonHelp.onCloseBusy();
            oDialog.open();
        },

        onViewNotaFactura: function (sNota) {
            var oCommonHelp = this.getCommon();

            var oController = models.get(sModelMain).getProperty("/ControllerMain");
            var oContext = this;
            var oNotaProveedor,
                oDeferred = new jQuery.Deferred();
            models.get(sModelMainFacturasView).setProperty("/Nota", sNota);
            models.get(sModelMainFacturasView).refresh();
            if (!oController._ControllerViewNotaProveedor) {
                oController._ControllerViewNotaProveedor = {
                    "deferred": null,
                    "onClose": function (oEvent) {
                        oNotaProveedor.close();
                    }
                };
            }
            oController._ControllerViewNotaProveedor.deferred = oDeferred;

            if (!oController._dialogViewNotaProveedor) {
                oController._dialogViewNotaProveedor = sap.ui.xmlfragment("simplot.portalsqas.view.fragment.ViewNotaProveedor", oController._ControllerViewNotaProveedor);
            }
            oNotaProveedor = oController._dialogViewNotaProveedor;
            oNotaProveedor.setModel(models.get(sModelMainFacturasView));
            oController.getView().addDependent(oNotaProveedor);
            oNotaProveedor.open();
        }
	};
});