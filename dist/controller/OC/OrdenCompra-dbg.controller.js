sap.ui.define([
	"simplot/portalsprd/controller/BaseController",
    "simplot/portalsprd/utils/models",
    "simplot/portalsprd/utils/gateway",
    "simplot/portalsprd/utils/Common",
    "sap/ui/core/BusyIndicator"
], function (Controller, models, gateway, Common,  BusyIndicatorBusyIndicator) {
	"use strict";
    var sService = "ORDEN_COMPRA"; 
    var sModelMain = "Model_OC";
	return Controller.extend("simplot.portalsprd.controller.OC.OrdenCompra", {
		onInit: function () {
            console.log("onInit V20220131");
            //this.getRouter().getRoute("ordenCompra").attachPatternMatched(this._onObjectMatched, this);
            this._onObjectMatched();
		},
        formatter: Common,
        _onObjectMatched: function() {
            this.getView().setModel(models.get(sModelMain));
        },

        onAfterRendering:function(){
            console.log("onAfter")
        },

        onLoadModelOC: function(){
            models.load(sModelMain, {
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
            this.getView().setModel(models.get(sModelMain));
        },

        onHideMaster:function(oEvent){
            var oModel = models.get(sModelMain);
            if(oModel.getProperty("/isShowMode")){
                this.byId("idAppControl").setMode("HideMode");
                oModel.setProperty("/isShowMode", false);
                oModel.setProperty("/iconExpand", "sap-icon://exit-full-screen");
            }else{
                this.byId("idAppControl").setMode("ShowHideMode");
                oModel.setProperty("/isShowMode", true);
                oModel.setProperty("/iconExpand", "sap-icon://full-screen");
            }
            oModel.refresh();
        },
        onHideOnSelect:function(){
            var oModel = models.get(sModelMain);
            this.byId("idAppControl").setMode("ShowHideMode");
			oModel.setProperty("/isShowMode", false);
			oModel.setProperty("/iconExpand", "sap-icon://exit-full-screen");
            oModel.refresh();
            this.byId("idAppControl").setMode("HideMode");
		},

        onGetListOC:function(){
            var sEntity = "/OCListadoSet";
            var sLifnr = models.get("Model_User").getProperty("/DataUser/NrSap");
            var nFilter =  new sap.ui.model.Filter("IvLifnr", "EQ", sLifnr);
            gateway.read(sService, sEntity, {"filters": [nFilter]})
            .then(function(oRecive){
                var aData = oRecive.results;
                for(var i in aData){
                    aData[i].Fecha = Common.formatDate(aData[i].Aedat, "Main");
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
                models.get(sModelMain).setProperty("/rowsOrdenCompra", aData);
                models.get(sModelMain).setProperty("/rowsOrdenCompraBack", aData);
                models.get(sModelMain).refresh();
                console.log(oRecive);
            })
            .catch(function(oError){
                console.log(oError);
            })
        },

        onSelectionOCChange:function(oEvent){            
            var sSelect = oEvent.getParameter("listItem").getBindingContext().getProperty("Ebeln");
            this.onLoadModelHeadItem(sSelect);
            this.onHideOnSelect();
            console.log("select");
        },

        onLoadModelHeadItem:function(sEbeln){
            var sEntity = "/OCCabeceraSet";
            var nFilter =  new sap.ui.model.Filter("IvEbeln", "EQ", sEbeln);
            gateway.read(sService, sEntity, {"filters": [nFilter]})
            .then(function(oRecive){
                var aData = oRecive.results;
                for(var i in aData){
                    aData[i].Fecha = Common.formatDate(aData[i].Aedat, "Main");
                }
                models.get(sModelMain).setProperty("/rowsHeaderOC", aData);
                models.get(sModelMain).setProperty("/visibleDetail", true);   
                models.get(sModelMain).refresh();
                console.log(oRecive);
                //Detalle
                var sEntity = "/OCItemSet";
                var nFilter =  new sap.ui.model.Filter("IvEbeln", "EQ", sEbeln);
                gateway.read(sService, sEntity, {"filters": [nFilter]})
                .then(function(oRecive){
                    var aData = oRecive.results;
                    for(var i in aData){
                        aData[i].FechaEM = Common.formatDate(aData[i].Lewed, "Main");
                    }
                    models.get(sModelMain).setProperty("/rowsItemsOC", aData);
                    models.get(sModelMain).setProperty("/rowsItemsOCMax", aData.length); 
                    models.get(sModelMain).refresh();
                    console.log(oRecive);
                })
                .catch(function(oError){
                    console.log(oError);
                });
            })
            .catch(function(oError){
                console.log(oError);
            })
        },

        onSearch:function(oEvent){
            var oProperties = { ListBack: "/rowsOrdenCompraBack", Value: oEvent.getSource().getValue(),
                Model: models.get(sModelMain), List: "/rowsOrdenCompra", 
                StringSearch: "Ebeln", NumberSearch: "Ebeln" };
            Common.onSearch(oProperties);			
		},

        onNavBack: function (oEvent) {
            //this.getRouter().navTo("main", {}, true);
			this.getOwnerComponent().getTargets().display("TargetMain");
		},

        onPressFilterCumpl:function(){
            this.onPressFilter("1", "");
        },
        onPressFilterFcPend:function(){
            this.onPressFilter("3", "");
        },
        onPressFilterParcial:function(){            
            this.onPressFilter("2", "");
        },
        onPressFilterRecePend:function(){
            this.onPressFilter("4", "");
        },
        onCancelFilter: function(){
            this.onPressFilter("", "");
        },
        onPressFilter:function(sState1, sState2){
            var aNewOCs;
            var arrOCs = models.get(sModelMain).getProperty("/rowsOrdenCompraBack");
            if(sState1 === ""){
                aNewOCs = arrOCs;
            }else{
                if(sState2 === ""){
                    aNewOCs = arrOCs.filter(nfilter=>nfilter.IdEstado === sState1);
                }else{
                    aNewOCs = arrOCs.filter(nfilter=>nfilter.IdEstado === sState1 || nfilter.IdEstado === sState2);
                }	
            }            		
			models.get(sModelMain).setProperty("/rowsOrdenCompra", aNewOCs);
            models.get(sModelMain).refresh();
        },

        onPressPDFOC:function(oEvent){            
            var aHeader = oEvent.getSource().getModel().getData().rowsHeaderOC;            
            if(aHeader.length > 0){
                BusyIndicatorBusyIndicator.show();
                var sEbeln = aHeader[0].Ebeln;
                var sNamePDF = "OC_" + sEbeln + ".pdf";
                var sEntity = "/OCPdfSet('" + sEbeln + "')";
                gateway.read(sService, sEntity, {/*"filters": [nFilter]*/})
                .then(function(oRecive){
                    if(oRecive.EvTipo === "S"){
                        Common.onDownloadFile(oRecive.EvPdf, "", sNamePDF);
                    }else{
                        sap.m.MessageBox.error(oRecive.EvMensaje);
                    }
                    BusyIndicatorBusyIndicator.hide();
                })
                .catch(function(oError){
                    console.log("errr");
                    BusyIndicatorBusyIndicator.hide();
                })
            }
        }
	});
});