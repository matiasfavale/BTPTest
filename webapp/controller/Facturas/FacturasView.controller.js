sap.ui.define([
	"simplot/portalsprd/controller/BaseController",
	"simplot/portalsprd/utils/models",
	"simplot/portalsprd/utils/gateway",
	"sap/ui/core/BusyIndicator",
    "simplot/portalsprd/utils/modelHelper",
    "simplot/portalsprd/utils/FileReaderHelp",
    "simplot/portalsprd/utils/Common",
    "simplot/portalsprd/utils/controller/CommonFacturasView"
], function (Controller,  models, gateway, BusyIndicator,  modelHelper, FileReaderHelp,  Common, CommonFacturasView) {
	"use strict";
	var sService = "AUTOGESTION";
	var sModelMainFacturasView = "Model_FacturasView";
	return Controller.extend("simplot.portalsprd.controller.Facturas.FacturasView", {
		onInit: function() {
            //this._onObjectMatched(); 
		},	
		
        onAfterRendering: function(){
            //this.getRouter().getRoute("altaform").attachPatternMatched(this._onObjectMatched, this);             
            this._onObjectMatched(); 			
		},

        _onObjectMatched: function() {
            this.getView().setModel(models.get(sModelMainFacturasView));            
        },

        onRejectDocument:function(oEvent){
            var oFactura = oEvent.getSource().getBindingContext().getObject();
            CommonFacturasView.onViewNotaFactura( oFactura.NotaEmpresa);
        },

        onViewNotaFactura:function(oEvent){
            var oFactura = oEvent.getSource().getBindingContext().getObject();
            CommonFacturasView.onViewNotaFactura( oFactura.NotaProveedor);
        },

        onDetailFactura: function(oEvent){
            var oFactura = oEvent.getSource().getBindingContext().getObject();
            CommonFacturasView.onDetailFactura(oFactura);
        },

        onSearch:function(){
            var objectData = {
                Query: models.get(sModelMainFacturasView).getProperty("/valueSearch"),
                Model: models.get(sModelMainFacturasView), 
                Prop1: "Numero", Prop2: "Numero",
                ListaData: "/rowsFacturasView", ListaDataBack: "/rowsFacturasViewBack", 
                ListaDataCount: "/rowsFacturasViewCount", ListaDataRealCount: "/rowsFacturasViewCount"
            };
            Common.onSearchGlobal(objectData);
        },
        
        onNavBack: function (oEvent) {
            //this.getRouter().navTo("main", {}, true);
			this.getOwnerComponent().getTargets().display("TargetMain");
		}
	});
});