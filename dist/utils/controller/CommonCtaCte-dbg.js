sap.ui.define([
	"simplot/portalsqas/utils/models",
	"simplot/portalsqas/utils/gateway",
    "simplot/portalsqas/utils/modelHelper",
    "simplot/portalsqas/utils/FileDownHelp",
    "simplot/portalsqas/utils/Common",
    "sap/m/Button",
	"sap/m/Dialog",
	"sap/m/Text"
	//helpers
], function (models, gateway, modelHelper, FileDownHelp, Common, Button, Dialog, Text) {
	"use strict";
    var sModelMainCtaCte = "Model_CtaCte";
	var sServiceCtaCte  = "CUENTACTE";
    var sServiceCtaCte_ES  = "CUENTACTE_ES";
    
	var sService = "AUTOGESTION";
    var sModelMain = "Model_ControllerMain";
	return {
        getCommon:function(){
            var commonHelp = sap.ui.require("simplot/portalsqas/utils/Common");
            return commonHelp;
        },

        getI18nText: function(sId){
			return models.get("i18n").getProperty(sId);
		},
        
        navToCtaCte:function(oTargets){
            this.onLoadModelCtaCte()
            oTargets.display("cuentacorriente");
        },
        
        onLoadModelCtaCte:function(){
            var oCommonHelp = this.getCommon();
            
            var aRowsEstado = [{Id:"0", Name: oCommonHelp.getI18nText("Preliminar")},
                {Id:"1", Name:oCommonHelp.getI18nText("Abierto")},
                {Id:"2", Name:oCommonHelp.getI18nText("Compensada")}];
            var aRowsFactura = [{Id:"FC", Name:oCommonHelp.getI18nText("Factura")},
                {Id:"NC", Name:oCommonHelp.getI18nText("NotaCredito")},
                {Id:"ND", Name:oCommonHelp.getI18nText("NotaDebito")}];
            if(models.exists(sModelMainCtaCte)){
            }else{
                models.load(sModelMainCtaCte, {
                    "rowsCtaCte": [],
                    "rowsCtaCteBack": [],
                    "rowsCtaCteCount": 0,
                    "rowsCtaCteRealCount": 0,
                    "rowsCtaCteRel": [],
                    "rowsCtaCteRelBack": [],
                    "rowsCtaCteRelCount": 0,
                    "valueSearch":"",
                    "HeaderCtaCte":{},
                    "Filtros": {"rowsEstado":aRowsEstado, "selectEstado":[], 
                        "rowsComprobante": aRowsFactura, "selectComprobante":[],
                        "dateValueOne":  undefined, "dateValueTwo":  undefined
                    }
                });
            }
            models.get(sModelMainCtaCte).refresh();
            this.onCtasCtes();
        },

        onCtasCtes: function(sType){
            var oCommonHelp = this.getCommon();
            var oIconPreliminar = {Texo: oCommonHelp.getI18nText("Preliminar"), Icon:"sap-icon://status-critical", Color: "#ff5e00"}; //0
            var oIconAbierto = {Texo: oCommonHelp.getI18nText("Abierto"),Icon:"status-negative", Color: "red"}; //1
            var oIconCompensada = {Texo: oCommonHelp.getI18nText("Compensada"),Icon:"status-completed", Color: "green"}; //2
            var oContext = this;             
            
            debugger;
            var oUserData = models.get("Model_User").getProperty("/DataUser");
			var sEntity = "/ObtenerBasicoSet(IvBpPortal='" + oUserData.BpPortal + "',IvTipoBp='P')" ;
			gateway.read(sService, sEntity, {/*"filters": [nFilter]*/})
			.then(function(oRecive) {
                var oReciveUser = oRecive;
                oReciveUser.tileFecha = new Date().toLocaleDateString();
                var sEntity = "/PartidasSet";
                var nFilter = new sap.ui.model.Filter("IvLifnr", "EQ", oUserData.NrSap); 
                gateway.read(sServiceCtaCte, sEntity, {"filters": [nFilter]})
                .then(function(oRecive) {
                    var nMaxLenth = 8;                    
                    var aData = oRecive.results; 
                    for(var i in aData){
                        aData[i].FechaCont = oCommonHelp.formatDate(aData[i].FechaCont, "Main");
                        aData[i].FechaVenc = oCommonHelp.formatDate(aData[i].FechaVenc, "Main");
                        aData[i].FechaEmi = oCommonHelp.formatDate(aData[i].FechaEmi, "Main");
                        aData[i].Importe = Number(aData[i].Importe).toFixed(2);
                        if(aData[i].Estado.toString() === "0"){
                            aData[i].StatusIcon = oIconPreliminar.Icon;
                            aData[i].StatusColor = oIconPreliminar.Color;
                            aData[i].StatusText = oIconPreliminar.Texto;
                            aData[i].StatusVisible = true;
                        }else if(aData[i].Estado.toString() === "1"){
                            aData[i].StatusIcon = oIconAbierto.Icon;
                            aData[i].StatusColor = oIconAbierto.Color;
                            aData[i].StatusText = oIconAbierto.Texto;
                            aData[i].StatusVisible = true;
                        }else if(aData[i].Estado.toString() === "2"){
                            aData[i].StatusIcon = oIconCompensada.Icon;
                            aData[i].StatusColor = oIconCompensada.Color;
                            aData[i].StatusText = oIconCompensada.Texto;
                            aData[i].StatusVisible = true;
                        }else{
                            aData[i].StatusIcon = "sap-icon://status-completed";
                            aData[i].StatusColor = "#3bc13b";
                            aData[i].StatusText = "";
                            aData[i].StatusVisible = false;
                        }                 
                    }
                    models.get(sModelMainCtaCte).setProperty("/HeaderCtaCte", oReciveUser);
                    models.get(sModelMainCtaCte).setProperty("/rowsCtaCte", aData);
                    models.get(sModelMainCtaCte).setProperty("/rowsCtaCteBack", aData);
                    if(nMaxLenth > aData.length){
                        nMaxLenth=aData.length
                    }
                    models.get(sModelMainCtaCte).setProperty("/rowsCtaCteRealCount", aData.length);  
                    models.get(sModelMainCtaCte).setProperty("/rowsCtaCteCount", nMaxLenth);                    
                                       
                })
                .catch(function(oError){
                    console.log(oError);
                });
            })
            .catch(function(oError){
                console.log(oError);
            });
        },

        sortGlobal: function (x, y) {
            if (x["FechaHora"] > y["FechaHora"]) {
                return -1;
            }
            if (x["FechaHora"] < y["FechaHora"]) {
                return 1;
            }
            return 0;
        },

        onViewCtaCte: function(oCtaCte){
            var oContext = this;             
            var oCommonHelp = this.getCommon();
            var oIconPreliminar = {Texo: oCommonHelp.getI18nText("Preliminar"), Icon:"sap-icon://status-critical", Color: "#ff5e00"}; //0
            var oIconAbierto = {Texo:oCommonHelp.getI18nText("Abierto"), Icon:"status-negative", Color: "red"}; //1
            var oIconCompensada = {Texo: oCommonHelp.getI18nText("Compensada"), Icon:"status-completed", Color: "green"}; //2
            var nFilter = new sap.ui.model.Filter("IvBelnr", "EQ", oCtaCte.Belnr); 
            var nFilter2 = new sap.ui.model.Filter("IvBukrs", "EQ", oCtaCte.Bukrs);
            var nFilter3 = new sap.ui.model.Filter("IvBuzei", "EQ", oCtaCte.Buzei);
            var nFilter4 = new sap.ui.model.Filter("IvGjahr", "EQ", oCtaCte.Gjahr);
            var sEntity = "/PartidasRelSet";
            gateway.read(sServiceCtaCte, sEntity, {"filters": [nFilter,nFilter2,nFilter3,nFilter4]})
            .then(function(oRecive){
                var nMaxLenth = 8;                    
                var aData = oRecive.results; 
                for(var i in aData){
                    aData[i].FechaCont = oCommonHelp.formatDate(aData[i].FechaCont, "Main");
                    aData[i].FechaEmi = oCommonHelp.formatDate(aData[i].FechaEmi, "Main");
                    if(aData[i].CodDoc.toUpperCase() === "OP"){
                        aData[i].visBtnPDF = true;
                    }else{
                        aData[i].visBtnPDF = false;
                    }
                    if(Number(aData[i].Importe) === 0){
                        aData[i].Importe = "";
                    }else{
                        aData[i].Importe = Number(aData[i].Importe).toFixed(2);
                    }
                    if(aData[i].Estado.toString() === "0"){
                        aData[i].StatusIcon = oIconPreliminar.Icon;
                        aData[i].StatusColor = oIconPreliminar.Color;
                        aData[i].StatusText = oIconPreliminar.Texto;
                        aData[i].StatusVisible = true;
                    }else if(aData[i].Estado.toString() === "1"){
                        aData[i].StatusIcon = oIconAbierto.Icon;
                        aData[i].StatusColor = oIconAbierto.Color;
                        aData[i].StatusText = oIconAbierto.Texto;
                        aData[i].StatusVisible = true;
                    }else if(aData[i].Estado.toString() === "2"){
                        aData[i].StatusIcon = oIconCompensada.Icon;
                        aData[i].StatusColor = oIconCompensada.Color;
                        aData[i].StatusText = oIconCompensada.Texto;
                        aData[i].StatusVisible = true;
                    }else{
                        aData[i].StatusIcon = "sap-icon://status-completed";
                        aData[i].StatusColor = "#3bc13b";
                        aData[i].StatusText = "";
                        aData[i].StatusVisible = false;
                    }                 
                }
                models.get(sModelMainCtaCte).setProperty("/rowsCtaCteRel", aData);
                models.get(sModelMainCtaCte).setProperty("/rowsCtaCteRelBack", aData);
                if(nMaxLenth > aData.length){
                    nMaxLenth=aData.length
                }
                models.get(sModelMainCtaCte).setProperty("/rowsCtaCteRelCount", nMaxLenth);  
                models.get(sModelMainCtaCte).refresh();   
                oContext.onOpenCtaCtaRel();
            })
            .catch(function(oError){
                console.log(oError);
            });
        },

        onOpenCtaCtaRel:function(){
            var oCommonHelp = this.getCommon();
            var oTableCtaCte,
				oDeferred = new jQuery.Deferred();
            var oController = models.get(sModelMain).getProperty("/ControllerMain");
            if (!oController._ControllerViewCtaCte) {
				oController._ControllerViewCtaCte = {
					"deferred": null,
					"onPressConfirm": function (oEvent) {
                        oTableCtaCte.close();
					},  
                    "onPressPDF":function(oEvent){
                        debugger;
                        oCommonHelp.onShowBusy();
                        oCommonHelp.onChangeTextBusy(oCommonHelp.getI18nText("MsgFileDownload"));
                        var oOrdenPago = oEvent.getSource().getBindingContext().getObject();
                        var sBurks = oOrdenPago.Bukrs;
                        var sBelnr = oOrdenPago.Belnr;
                        var sGjahr = oOrdenPago.Gjahr;
                        var sNamePDF = "OP_" +  sBurks + "_" + sBelnr + "_" + sGjahr + ".pdf";
                        var sEntity = "/OrdenPagoPdfSet(IvBukrs='" + sBurks + "',IvBelnr='"+ sBelnr +"',IvGjahr='"+ sGjahr +"')" ;
			            gateway.read(sServiceCtaCte, sEntity, {/*"filters": [nFilter]*/})
			            .then(function(oRecive) {
                            var sFileString = oRecive.Contenido;
                            if(sFileString === ""){
                                sap.m.MessageBox.error(oCommonHelp.getI18nText("MsgNotFile"));
                            }else{
                                oCommonHelp.onDownloadFile(sFileString, "", sNamePDF);
                            }
                            oCommonHelp.onCloseBusy();                           
                        })
                        .catch(function(oError){
                            oCommonHelp.onCloseBusy();
                            sap.m.MessageBox.error(oCommonHelp.getI18nText("MsgErrorFile"));
                            console.log("error");
                        })
                    },
                    "onPressRetencionesPDF": function(oEvent){
                        oCommonHelp.onShowBusy();
                        oCommonHelp.onChangeTextBusy(oCommonHelp.getI18nText("MsgFileDownload"));
                        var oOrdenPago = oEvent.getSource().getBindingContext().getObject();
                        var sBurks = oOrdenPago.Bukrs;
                        var sBelnr = oOrdenPago.Belnr;
                        var sGjahr = oOrdenPago.Gjahr;
                        var sNamePDF = "Retencion_" +  sBurks + "_" + sBelnr + "_" + sGjahr + ".pdf";
                        var nFilter = new sap.ui.model.Filter("IvBelnr", "EQ", sBelnr);
                        var nFilter2 = new sap.ui.model.Filter("IvBukrs", "EQ", sBurks);
                        var nFilter3 = new sap.ui.model.Filter("IvGjahr", "EQ", sGjahr);
                        var sEntity = "/CertRetenPdfSet" ;
                        models.get(sServiceCtaCte_ES).aUrlParams[1] = "sap-language=es"
                        models.get(sServiceCtaCte_ES).mMetadataUrlParams['sap-language'] = "es"
			            gateway.read(sServiceCtaCte_ES, sEntity, {"filters": [nFilter, nFilter2, nFilter3]})
			            .then(function(oRecive) {
                            var aData = oRecive.results;
                            if(aData.length > 0){
                                for(var i in aData){
                                    if(aData[i].Contenido === ""){                                        
                                    }else{
                                        oCommonHelp.onDownloadFile(aData[i].Contenido, "", aData[i].Archivo);
                                    }
                                }
                            }else{
                                sap.m.MessageBox.error(oCommonHelp.getI18nText("MsgNotFile"));
                            }    
                            oCommonHelp.onCloseBusy();              
                        })
                        .catch(function(oError){
                            oCommonHelp.onCloseBusy();
                            sap.m.MessageBox.error(oCommonHelp.getI18nText("MsgErrorFile"));
                            console.log("error");
                        })
                    }
				};
			}
			oController._ControllerViewCtaCte.deferred = oDeferred;

			if (!oController._dialogViewCtaCte) {
				oController._dialogViewCtaCte = sap.ui.xmlfragment("simplot.portalsqas.view.fragment.ViewCtaCte", oController._ControllerViewCtaCte);
			}
			oTableCtaCte = oController._dialogViewCtaCte;
			oTableCtaCte.setModel(models.get(sModelMainCtaCte));
			oController.getView().addDependent(oTableCtaCte);
			oTableCtaCte.open();
        }

	};
});