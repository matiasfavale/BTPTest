sap.ui.define([
	"simplot/portalsprd/controller/BaseController",
	"simplot/portalsprd/utils/models",
	"simplot/portalsprd/utils/gateway",
	"sap/ui/core/BusyIndicator",
    "simplot/portalsprd/utils/modelHelper",
    "simplot/portalsprd/utils/FileReaderHelp",
    "simplot/portalsprd/utils/Common",
    "simplot/portalsprd/utils/controller/CommonCtaCte"
], function (Controller,  models, gateway, BusyIndicator,  modelHelper, FileReaderHelp,  Common, CommonCtaCte) {
	"use strict";
	var sServiceAuto = "AUTOGESTION";
	var sModelMainCtaCte = "Model_CtaCte";
    var sService = "CUENTACTE";
	return Controller.extend("simplot.portalsprd.controller.CtaCte.CuentaCorriente", {
		onInit: function() {
		},	
		
        onAfterRendering: function(){          
            this._onObjectMatched(); 			
		},

        _onObjectMatched: function() {
            //this.onLoadModelAlta();
            this.getView().setModel(models.get(sModelMainCtaCte));            
        },

        onLoadModelAlta:function(){
            //var oRow = modelHelper.getObjectJson();
            models.load(sModelMainCtaCte, {
				"rowsCtaCte": [],
                "rowsCtaCteBack": [],
                "rowsCtaCteCount": 0,
                "valueSearch":"",
                "HeaderCtaCte":{}
			});
        },

        onViewCtaCte:function(oEvent){
            var oCtaCte = oEvent.getSource().getBindingContext().getObject();
            CommonCtaCte.onViewCtaCte(oCtaCte);
        },

        onSearch:function(){
            var objectData = {
                Query: models.get(sModelMainCtaCte).getProperty("/valueSearch"),
                Model: models.get(sModelMainCtaCte), 
                Prop1: "NroLegal", Prop2: "NroLegal",
                ListaData: "/rowsCtaCte", ListaDataBack: "/rowsCtaCteBack", 
                ListaDataCount: "/rowsCtaCteCount", ListaDataRealCount: "/rowsCtaCteRealCount"
            };
            Common.onSearchGlobal(objectData);
        },

        onPressFilter:function(){
            var nMaxLenth = 8;
            var sText = Common.getI18nText("ValidDateRange");
            var oModel = models.get(sModelMainCtaCte);
            var sBegin = oModel.getProperty("/Filtros/dateValueOne");
            var sEnd = oModel.getProperty("/Filtros/dateValueTwo");
            var aEstado = oModel.getProperty("/Filtros/selectEstado");
            var aComprobante = oModel.getProperty("/Filtros/selectComprobante");
            var aRowCtaCte = oModel.getProperty("/rowsCtaCteBack"); 
            var aCtaCte = [];
            if(sBegin === undefined || sEnd === undefined){
                //sap.m.MessageBox.error(sText);
            }else{                               
                for(var i in aRowCtaCte){                    
                    var dateCtaCte = new Date(Common.formatDate(aRowCtaCte[i].FechaEmi, "FormatAAAAmmDD"));
                    if(dateCtaCte >= sBegin && dateCtaCte <= sEnd){
                        aCtaCte.push(aRowCtaCte[i])
                    }
                }
                if(nMaxLenth > aCtaCte.length){
                    nMaxLenth=aCtaCte.length
                }
                oModel.setProperty("/rowsCtaCte", aCtaCte);
                oModel.setProperty("/rowsCtaCteRealCount", aCtaCte.length);
                oModel.setProperty("/rowsCtaCteCount", nMaxLenth);
                oModel.refresh();
            }
            var aNewCtaCte = [];
            if(aEstado.length > 0){
                for(var i in aEstado){
                    var arrCtaCte;
                    if(aCtaCte.length > 0){
                        arrCtaCte = aCtaCte.filter(nfilter=>nfilter.Estado === aEstado[i]);
                    }else{
                        arrCtaCte  = aRowCtaCte.filter(nfilter=>nfilter.Estado === aEstado[i]);
                    }
                    for(var j in arrCtaCte){
                        aNewCtaCte.push(arrCtaCte[j]);
                    }
                }   
                if(nMaxLenth > aNewCtaCte.length){
                    nMaxLenth=aNewCtaCte.length
                }
                aCtaCte = aNewCtaCte;
                oModel.setProperty("/rowsCtaCte", aCtaCte);
                oModel.setProperty("/rowsCtaCteRealCount", aCtaCte.length);
                oModel.setProperty("/rowsCtaCteCount", nMaxLenth);
                oModel.refresh();             
            }else{

            }

            var aNewCtaCteComp = [];
            if(aComprobante.length > 0){
                for(var i in aComprobante){
                    var arrCtaCte;
                    if(aCtaCte.length > 0){
                        arrCtaCte = aCtaCte.filter(nfilter=>nfilter.CodDoc === aComprobante[i]);
                    }else{
                        arrCtaCte  = aRowCtaCte.filter(nfilter=>nfilter.CodDoc === aComprobante[i]);
                    }
                    for(var j in arrCtaCte){
                        aNewCtaCteComp.push(arrCtaCte[j]);
                    }                                     
                }   
                if(nMaxLenth > aNewCtaCteComp.length){
                    nMaxLenth=aNewCtaCteComp.length
                }   
                aCtaCte = aNewCtaCteComp;
                oModel.setProperty("/rowsCtaCte", aCtaCte);
                oModel.setProperty("/rowsCtaCteRealCount", aCtaCte.length);
                oModel.setProperty("/rowsCtaCteCount", nMaxLenth);
                oModel.refresh();             
            }else{

            }
        },

        onClearFilter:function(){
            var nMaxLenth = 8;          
            var oModel = models.get(sModelMainCtaCte);
            oModel.setProperty("/Filtros/dateValueOne", undefined);
            oModel.setProperty("/Filtros/dateValueTwo", undefined);
            oModel.setProperty("/Filtros/selectEstado", []);
            oModel.setProperty("/Filtros/selectComprobante", []);
            var aRowCtaCteBack = oModel.getProperty("/rowsCtaCteBack");
            if(nMaxLenth > aRowCtaCteBack.length){
                nMaxLenth=aRowCtaCteBack.length
            }
            oModel.setProperty("/rowsCtaCte", aRowCtaCteBack);
            oModel.setProperty("/rowsCtaCteRealCount", aRowCtaCteBack.length);
            oModel.setProperty("/rowsCtaCteCount", nMaxLenth);
            oModel.refresh();
        },
        
        onNavBack: function (oEvent) {
            //this.getRouter().navTo("main", {}, true);
			this.getOwnerComponent().getTargets().display("TargetMain");
		}
	});
});