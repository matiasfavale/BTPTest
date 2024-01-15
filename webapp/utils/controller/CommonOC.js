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
	var sServiceNoticias = "NOTICIAS";
    var sService = "ORDEN_COMPRA";
	var sServiceAuto = "AUTOGESTION";
    var sModelMainPizarron = "Model_Pizarron";
    var sModelMain = "Model_ControllerMain";
    var sModelMainOC = "Model_OC";
	return {
        getCommon:function(){
            var commonHelp = sap.ui.require("simplot/portalsqas/utils/Common");
            return commonHelp;
        },

        getI18nText: function(sId){
			return models.get("i18n").getProperty(sId);
		},
        
        onLoadModelOC: function(sState){
            if(models.exists(sModelMainOC)){
            }else{
                models.load(sModelMainOC, {
                    "rowsOrdenCompra": [],
                    "rowsOrdenCompraBack": [],
                    "tileFecha": new Date().toLocaleDateString(),
                    "rowsHeaderOC": [],
                    "rowsItemsOC":[],
                    "rowsItemsOCMax": 0,
                    "visibleDetail": false,
                    "isShowMode":true,
                    "iconExpand": "sap-icon://full-screen"
                });
            }            
            this.onGetListOC(false, sState);
        },

        onGetListOC:function(isScore, sState){
            var oCommonHelp = this.getCommon();
            var oContext = this;
            var sEntity = "/OCListadoSet";
            var sLifnr = models.get("Model_User").getProperty("/DataUser/NrSap");
            var nFilter =  new sap.ui.model.Filter("IvLifnr", "EQ", sLifnr);
            gateway.read(sService, sEntity, {"filters": [nFilter]})
            .then(function(oRecive){
                var aData = oRecive.results;
                for(var i in aData){
                    aData[i].Fecha = oCommonHelp.formatDate(aData[i].Aedat, "Main");
                    if(aData[i].IdEstado === "1"){
                        aData[i].InfoStatus = "Success";
                    }else if(aData[i].IdEstado === "2"){
                        aData[i].InfoStatus = "Information";
                    }else if(aData[i].IdEstado === "3"){
                        aData[i].InfoStatus = "Warning";
                    }else if(aData[i].IdEstado === "4"){
                        aData[i].InfoStatus = "Error";
                    }
                }
                if(isScore){
                    models.get(sModelMain).setProperty("/OC/CountCumplida", aData.filter(nfilter=>nfilter.IdEstado === "1").length);
                    models.get(sModelMain).setProperty("/OC/CountRecepParcial", aData.filter(nfilter=>nfilter.IdEstado === "3").length);
                    models.get(sModelMain).setProperty("/OC/rowsOC", aData);
                    models.get(sModelMain).refresh();
                }else{
                    models.get(sModelMainOC).setProperty("/rowsOrdenCompra", aData);
                    models.get(sModelMainOC).setProperty("/rowsOrdenCompraBack", aData);
                    models.get(sModelMainOC).refresh();
                }
                if(sState !== null){
                    
                    models.get(sModelMainOC).setProperty("/rowsOrdenCompra", aData.filter(nfilter=>nfilter.IdEstado === sState));
                    models.get(sModelMainOC).setProperty("/rowsOrdenCompraBack", aData.filter(nfilter=>nfilter.IdEstado === sState));
                    models.get(sModelMainOC).refresh();
                }       
                
                console.log(oRecive);
            })
            .catch(function(oError){
                console.log(oError);
            })
        }
        
	};
});