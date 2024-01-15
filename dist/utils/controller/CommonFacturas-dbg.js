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
    var sServiceAFIP = "AFIP";
	var sServiceAuto = "AUTOGESTION";
    var sServiceGeneral = "GENERAL";
    var sServiceOC = "ORDEN_COMPRA";
    var sModelMainFacturas = "Model_Facturas";
    var sModelMain = "Model_ControllerMain";
    var serviceOCRDev = "/comsapappsdocumentinformationextraction.businessservice/api";
    var serviceOCRLocal =  "/document-information-extraction/v1";
    var serviceOCR;
    var sModelMainOC = "Model_OC";
 
	return {
        onGetEnvironment:function(){
            serviceOCR = serviceOCRDev; // serviceOCRLocal; //serviceOCRDev
        },

        getCommon:function(){
            var commonHelp = sap.ui.require("simplot/portalsqas/utils/Common");
            return commonHelp;
        },

        getI18nText: function(sId){
			return models.get("i18n").getProperty(sId);
		},

        onLoadListOC:function(){
            var oCommonHelp = this.getCommon();
            var oContext = this;
            var sEntity = "/OCListadoSet";
            var sLifnr = models.get("Model_User").getProperty("/DataUser/NrSap");
            var nFilter =  new sap.ui.model.Filter("IvLifnr", "EQ", sLifnr);
            var nFilter2 =  new sap.ui.model.Filter("IvSaldos", "EQ", true);
            gateway.read(sServiceOC, sEntity, {"filters": [nFilter, nFilter2]})
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
                    aData[i].SaldoFact = oCommonHelp.onReturnFormatNumber(Number(aData[i].SaldoFact),2);
                    //Number(aData[i].SaldoFact).toFixed(2);
                    //aData[i].SaldoFact.replace(".", ",");
                }
                aData = aData.filter(nfilter=>nfilter.IdEstado !== "1");
                models.get(sModelMainFacturas).setProperty("/comboOrdenCompra/rowTemplate", aData);
                models.get(sModelMainFacturas).refresh();
                console.log(oRecive);
            })
            .catch(function(oError){
                console.log(oError);
            })
        },

        onLoadExenciones: function(){
            var sEntity = "/ExencionesSet";
            gateway.read(sService, sEntity, {}).then(function (oRecive) {
                console.log("/ExencionesSet");
                console.log(oRecive);
                var aData =  oRecive.results;
                /*
                aData = [{
                    Sociedad: "1061", TaxKey: "PercIbTucuman", Desde: "20220101", 
                    Hasta: "20221230", Tipo:"",  Numex: ""
                },{
                    Sociedad: "1061", TaxKey: "PercIbTierraFuego", Desde: "20220101", 
                    Hasta: "20221230", Tipo:"",  Numex: ""
                }];
                */
                models.get(sModelMainFacturas).setProperty("/ListaExenciones", aData);
            }).catch(function (oError) {
                console.log(oError);
            });
        },

        onLoadModelFacturas:function(){
            this.onGetEnvironment();            
            var aDataTemplate = [
                {name:"Limpiolux*", template:"aa962fe5-cb10-4068-ad14-204a3c4f7282"}, //VER FECHA
                {name:"Cartocor*", template:"42fce946-344f-4c5d-be7e-559de33117c4"}, //VER DUPLICADOS
                {name:"Bunge", template:"71b54fdc-9b71-4d99-8c45-1bf26ee02c89"},
                {name:"Plastiandino", template:"3c50d687-1c90-41a2-a3f5-ba90d20cd986"},
                {name:"AB_Logistica", template:"da98fd82-58bc-4dd2-87ba-8afde3701917"},
                {name:"LR_Ambiental", template:"dd0fb27b-0e4d-45cc-a216-935028e27fe1"},
                {name:"Mediterranea*", template:"eca5225c-9036-45f3-8321-1f825df36bef"}, //VER DUPLICADOS
                {name:"Verdenelli", template:"ff96d6ef-be59-4724-8803-1b4baf5c9e0f"},
                {name:"Petropack*", template:"f3fc7bf9-cc39-4322-9e55-c1a8a76d39ea"}, //VER IVA
                {name:"Astie", template:"7ec90d83-44d7-4ed6-8fa5-6799bb24a5ca"},
                {name:"Cordenonsi", template:"af93f566-4109-4a96-821e-45bf4f38ab49"},
                {name:"Terminal_Zarate", template:"7ca7ce13-7ff8-40dd-a054-0047de058dab"},
                {name:"Mecatronica_Montajes*", template:"962fc824-805d-4fbe-beb7-7d74d84ef4e5"}, //VER IVA0%/PtoVenta
                {name:"Pooling", template:"772c38e1-9068-4dd9-ab82-5e2ac63debae"}, 
                {name:"ExpoVerde*", template:"2538576f-21c8-454d-b9eb-e5952ff82c8d"}, //VER IVA Otros
                {name:"Smurfit_Kappa*", template:"db532eb1-16e7-43fb-9c98-4c6a2630e7dd"} //VER Fecha
            ];
            var oCommonHelp = this.getCommon();
            var aCombos = oCommonHelp.getCombosFacturas();
            
            if(models.exists(sModelMainFacturas)){
                this.onCleanModelFacturas(null);
            }else{
                models.load(sModelMainFacturas, {
                    "PDFViewer": aCombos.ObjectoSourcePDF,
                    "Combos": aCombos.AllCombos,  
                    "ComboTemplate": {"rowTemplate": aDataTemplate, "selectKey":""},
                    "comboOrdenCompra": {"rowTemplate": [], "selectKey":"", "required": false,
                        "habilitado": true},
                    "Expanded": false,
                    "File":"",
                    "headerFields": aCombos.Header,
                    "lineItems":[],
                    "lineItemsMax":0,
                    "iibbItems":[],
                    "iibbItemsMax":0,
                    "ivaItems":[],
                    "ivaItemsMax":0,
                    "ListaExenciones": [],
                    "TemplatesOCR":[],
                    "DataUsuarioFCs":""
                });
            }
            models.get(sModelMainFacturas).refresh();
            //this.onGetTemplate();
            this.onLoadListOC();
            this.onLoadExenciones();
            this.onGetSchemas();
            this.onGetSociedades();
            this.onGetTiposDoc();            
        },

        onGetObtenerBasico:function(aTemplates){
            debugger;
            //var aTemplates = models.get(sModelMainFacturas).getProperty("/TemplatesOCR");
            //const sKeyTipoFactura = models.get(sModelMainFacturas).getProperty("/Combos/comboTipoFactura/selectKey");
            var oUserData = models.get("Model_User").getProperty("/DataUser");
			var sEntity = "/ObtenerBasicoSet(IvBpPortal='" + oUserData.BpPortal + "',IvTipoBp='P')" ;
			gateway.read(sServiceAuto, sEntity, {/*"filters": [nFilter]*/})
			.then(function(oRecive) {
                var oReciveUser = oRecive;
                var sCuit = "123456";
                if(oReciveUser.Nif !== ""){
                    sCuit = oReciveUser.Nif;
                }
                const sTemplateName =  "_" + sCuit;
                var arrTemplate = aTemplates.results.filter(nfilter=>nfilter.name.match(sTemplateName));
                models.get(sModelMainFacturas).setProperty("/TemplatesOCR", arrTemplate);
                models.get(sModelMainFacturas).setProperty("/DataUsuarioFCs",oRecive);
                models.get(sModelMainFacturas).refresh();
            })
            .catch(function(oError){
                console.log(oError);
            });
        },

        onCleanModelFacturas: function(oContextFacturas){
            if(oContextFacturas === undefined || oContextFacturas === null){}else{
                oContextFacturas.getView().byId("myFileUploadFact").clear();
            }
            var oCommonHelp = this.getCommon();
            var aCombos = oCommonHelp.getCombosFacturas();
            models.get(sModelMainFacturas).setProperty("/PDFViewer",aCombos.ObjectoSourcePDF);
            models.get(sModelMainFacturas).setProperty("/Combos", aCombos.AllCombos);
            models.get(sModelMainFacturas).setProperty("/Expanded", false);
            models.get(sModelMainFacturas).setProperty("/ComboTemplate/selectKey", "");
            models.get(sModelMainFacturas).setProperty("/comboOrdenCompra/selectKey", "");
            models.get(sModelMainFacturas).setProperty("/comboOrdenCompra/required", false);
            models.get(sModelMainFacturas).setProperty("/comboOrdenCompra/habilitado", true);
            models.get(sModelMainFacturas).setProperty("/File", "");
            models.get(sModelMainFacturas).setProperty("/headerFields",aCombos.Header);
            models.get(sModelMainFacturas).setProperty("/lineItems", []);
            models.get(sModelMainFacturas).setProperty("/lineItemsMax", 0);
            models.get(sModelMainFacturas).setProperty("/iibbItems", []);
            models.get(sModelMainFacturas).setProperty("/iibbItemsMax", 0);
            models.get(sModelMainFacturas).setProperty("/ivaItems", []);
            models.get(sModelMainFacturas).setProperty("/ivaItemsMax", 0);
            debugger;
            
            models.get(sModelMainFacturas).refresh();
        },

        onGetTiposDoc: function(){
            debugger;
            var sEntity = "/TiposDocSet";
            gateway.read(sService, sEntity, {})
            .then(function(oRecive){                
                models.get(sModelMainFacturas).setProperty("/Combos/comboSubtipoFactura/rowTemplateBack", oRecive.results)
                models.get(sModelMainFacturas).refresh();
                console.log(oRecive);
            })
            .catch(function(error){
                console.log(error);
            });
        },

        onGetSociedades: function(){            
            var oUserData = models.get("Model_User").getProperty("/DataUser");
            var nFilter = new sap.ui.model.Filter("IvNrSap", "EQ", oUserData.NrSap);
            var nFilter2 = new sap.ui.model.Filter("IvTipoBp", "EQ", oUserData.TipoBp);
            debugger;
            var sEntity = "/SociedadBPSet";
            gateway.read(sServiceGeneral, sEntity, {"filters": [nFilter,nFilter2]})
            .then(function(oRecive){
                console.log(oRecive);
                models.get(sModelMainFacturas).setProperty("/Combos/comboSociedad/rowTemplate", oRecive.results)
                models.get(sModelMainFacturas).refresh();
            })
            .catch(function(error){
                console.log(error);
            });            
        },

        onGetSchemas:function(){
            var sEntityOCR = "/templates";
            var oContext = this;
            //sEntityOCR = "/schemas";
            //templates
            //var sEntity = ' /comsapappsdocumentinformationextraction.businessservice-0.0.1/api/clients?limit=50000&clientIdStartsWith=simplotId';
            var sEntity = serviceOCR + sEntityOCR + "?clientId=simplotId";
            $.ajax({
                url: sEntity,
                type: "GET",
                async: true,
                headers: {
                    accept: 'application/json',
                    contentType: 'application/json'
                },
                success: function(data) {
                    //models.get(sModelMainFacturas).setProperty("/TemplatesOCR", data);
                    //models.get(sModelMainFacturas).refresh();
                    oContext.onGetObtenerBasico(data);
                },
                error: function(oError) {
                    console.log(oError)
                }
            });
        },

        onChangeTipoDoc:function(){
            var sTipoDoc = models.get(sModelMainFacturas).getProperty("/Combos/comboTipoFactura/selectKey");
            var aSubtipo = models.get(sModelMainFacturas).getProperty("/Combos/comboSubtipoFactura/rowTemplateBack");
            var aRows = aSubtipo.filter(nfilter=>nfilter.TipoDoc === sTipoDoc);
            models.get(sModelMainFacturas).setProperty("/Combos/comboSubtipoFactura/rowTemplate", aRows);
            models.get(sModelMainFacturas).refresh();
        },

        onSendFile:function(oProperty){
            var oCommonHelp = this.getCommon();
            var sEntity = "/document/jobs";
            var oContext = this;
            var settings = {
                "url": serviceOCR + sEntity,
                "method": "POST",
                "headers": {
                    accept: 'application/json',
                    contentType: 'application/json'
                },
                "processData": false,
                "mimeType": 'application/json', // "multipart/form-data",
                "contentType": false,
                "data": oProperty
            };

            $.ajax(settings)
            .done(function (response) {
                oContext.onGetDataFileOCR(response.id);
                //JSON.parse(response).id;
                console.log(response);
            })
            .fail(function(error){
                console.log(error);
                oCommonHelp.onCloseBusy();
                
            });
        },

        onGetDataFileOCR: function(id){
            var oCommonHelp = this.getCommon();
            var oContext = this;
            var sEntity = "/document/jobs/" + id;
            $.ajax({
                url: serviceOCR + sEntity,
                type: "GET",
                async: true,
                headers: {
                    accept: 'application/json',
                    contentType: 'application/json'
                },
                success: function(response) {
                    if(response.status === "PENDING"){
                        oContext.onGetDataFileOCR(response.id);
                    }else{
                        debugger;
                        var sComboSubtipoSelect =  models.get(sModelMainFacturas).getData().Combos.comboSubtipoFactura.selectKey;
                        var aComboSubtipo = models.get(sModelMainFacturas).getData().Combos.comboSubtipoFactura.rowTemplateBack;
                        var sLetra = aComboSubtipo.filter(nfilter=>nfilter.SubtipoDoc === sComboSubtipoSelect)[0].LetraDoc;
                        var oHeader = models.get(sModelMainFacturas).getProperty("/headerFields");
                        var aIIBBFields = models.get(sModelMainFacturas).getProperty("/Combos/iibbItemsFields");
                        var aIVAFields = models.get(sModelMainFacturas).getProperty("/Combos/ivaItemsFields");
                        var aIIBBKeys = models.get(sModelMainFacturas).getProperty("/Combos/ComboIIBB");
                        var aIVAKeys = models.get(sModelMainFacturas).getProperty("/Combos/ComboIVA");
                        var aMonedaKeys = models.get(sModelMainFacturas).getProperty("/Combos/comboMoneda");
                        var aRespItems = response.extraction.lineItems;
                        var aRespHeader = response.extraction.headerFields;
                        
                        for(var i in aRespHeader){
                            var sPropName = aRespHeader[i].name;
                            oHeader[sPropName] = aRespHeader[i].value;
                        }

                        //Formato Nro Factura
                        if(oHeader.nroFactura.indexOf("-") > 0){
                            oHeader.nroFactura = oHeader.nroFactura.replace("-", sLetra);
                        }
                        oHeader.nroFactura = oHeader.nroFactura.trim();
                        oHeader.nroFactura = oHeader.nroFactura.replaceAll(" ", "")
                        debugger;
                        //Formato Importes
                        //Total
                        var boolDecimal = oCommonHelp.onCheckPointDecimal(oHeader.total); 
                        oHeader.total = oCommonHelp.onReturnNumberDecimal(oHeader.total, boolDecimal);
                        oHeader.total = oCommonHelp.onReturnFormatNumber(Number(oHeader.total),2);
                        //Subtotal
                        oHeader.subtotal = oCommonHelp.onReturnNumberDecimal(oHeader.subtotal, boolDecimal);
                        oHeader.subtotal = oCommonHelp.onReturnFormatNumber(Number(oHeader.subtotal),2);
                        //Tipo de Cambio
                        if(isNaN(oHeader.tipoCambio.substr(-1))){
                            oHeader.tipoCambio = oHeader.tipoCambio.substring(0, oHeader.tipoCambio.length - 1);
                        }
                        oHeader.tipoCambio =  oCommonHelp.onReturnNumberDecimal(oHeader.tipoCambio, boolDecimal);
                        if(oHeader.tipoCambio === "" || oHeader.tipoCambio === undefined){
                            oHeader.tipoCambio = oCommonHelp.onReturnFormatNumber(Number("1"),5);
                        }else{
                            oHeader.tipoCambio = oCommonHelp.onReturnFormatNumber(Number(oHeader.tipoCambio),5);
                        }

                        //Formato Fechas
                        oHeader.fechaVto = oHeader.fechaVto.replaceAll(".", "/").replaceAll("-", "/").replace(/[^0-9 /]/g, '');
                        if(oHeader.fechaVto.indexOf("/") < 0){
                            oHeader.fechaVto = "";
                        }
                        oHeader.fecha = oHeader.fecha.replaceAll(".", "/").replaceAll("-", "/").replace(/[^0-9 /]/g, '');
                        if(oHeader.fecha.indexOf("/") < 0){
                            oHeader.fecha = "";
                        }

                        //CAE
                        oHeader.cae = oHeader.cae.replace(/[^0-9]/g, '')

                        //Moneda
                        var aKeyMoneda = aMonedaKeys.rowTemplate.filter(nfilter=>nfilter.opciones.indexOf(oHeader.moneda) >= 0)
                        if(aKeyMoneda.length > 0){
                            models.get(sModelMainFacturas).setProperty("/Combos/comboMoneda/selectKey", aKeyMoneda[0].key);
                        }else{
                            models.get(sModelMainFacturas).setProperty("/Combos/comboMoneda/selectKey", aMonedaKeys[0].key);
                        }
                        
                        var aIIBBItems = [];
                        /*
                        var nIdxIIBB = 1;
                        for(var i in aIIBBFields){
                            var aItemClaveIIBB = aRespHeader.filter(nfilter=>nfilter.name === aIIBBFields[i].FieldClave);
                            var aItemValIIBB = aRespHeader.filter(nfilter=>nfilter.name === aIIBBFields[i].FieldVal);
                            if(aItemClaveIIBB.length > 0){
                                var aFilter = aIIBBKeys.filter(nfilter=>nfilter.opciones.toLocaleLowerCase().indexOf(aItemClaveIIBB[0].value.toLocaleLowerCase()) >= 0);
                                var sValue = "";
                                if(aFilter.length > 0){
                                    sValue = aFilter[0].key;
                                }
                                if(aItemValIIBB[0] === undefined){
                                }else{
                                    var objData = {ID: nIdxIIBB, Item:sValue, Valor: aItemValIIBB[0].value, key: sValue };
                                    nIdxIIBB = nIdxIIBB + 1;
                                    aIIBBItems.push(objData);
                                }
                                
                            }
                        }
                        */
                        var aIVAItems = [];
                        var iIdxIva = 1;
                        for(var i in aIVAFields){
                            var aItemClaveIVA = aRespHeader.filter(nfilter=>nfilter.name === aIVAFields[i].FieldClave);
                            var aItemValIVA = aRespHeader.filter(nfilter=>nfilter.name === aIVAFields[i].FieldVal);
                            if(aItemClaveIVA.length > 0){
                                var oFilter;
                                oFilter = aIVAKeys.filter(nfilter=>nfilter.opciones.indexOf(aItemClaveIVA[0].value) >= 0)[0];
                                /*
                                if(aItemClaveIVA[0].value.indexOf("5") === 0){
                                    oFilter = aIVAKeys[3];
                                }else{
                                    oFilter = aIVAKeys.filter(nfilter=>nfilter.opciones.indexOf(aItemClaveIVA[0].value) >= 0)[0];
                                }
                                */
                                var sKey = "";
                                var sValue = "";
                                if(oFilter !== undefined){
                                    if(oFilter.key === undefined){                                    
                                    }else{
                                        sKey = oFilter.key;
                                        sValue = oFilter.value;
                                    }
                                }
                                if(aItemValIVA[0] === undefined){
                                }else{
                                    var sImporte = oCommonHelp.onReturnNumberDecimal(aItemValIVA[0].value, boolDecimal);
                                    sImporte = oCommonHelp.onReturnFormatNumber(Number(sImporte),2);
                                    //var sImporte = aItemValIVA[0].value.replaceAll(".", "");
                                    var objData = {ID:iIdxIva, Item:sValue, Valor: sImporte, key: sKey };
                                    iIdxIva = iIdxIva + 1;
                                    aIVAItems.push(objData);
                                }                                
                            }
                        }

                        var aItems = [];
                        var nIdxItems = 1;
                        for(var i in aRespItems){
                            var objItems = {};
                            for(var j in aRespItems[i]){
                                var sPropeName = aRespItems[i][j].name;
                                objItems[sPropeName] = aRespItems[i][j].rawValue
                            }
                            objItems.page = aRespItems[i][j].page;
                            objItems.ID = nIdxItems;
                            aItems.push(objItems);
                            nIdxItems = nIdxItems + 1;
                        }

                        
                        models.get(sModelMainFacturas).setProperty("/headerFields", oHeader);
                        models.get(sModelMainFacturas).setProperty("/iibbItems", aIIBBItems);
                        models.get(sModelMainFacturas).setProperty("/iibbItemsMax", aIIBBItems.length);
                        models.get(sModelMainFacturas).setProperty("/ivaItems", aIVAItems);
                        models.get(sModelMainFacturas).setProperty("/ivaItemsMax", aIVAItems.length);
                        models.get(sModelMainFacturas).setProperty("/lineItems", aItems);
                        models.get(sModelMainFacturas).setProperty("/lineItemsMax", aItems.length);
                        models.get(sModelMainFacturas).refresh();
                        oCommonHelp.onCloseBusy();
                    }                    
                },
                error: function(oError) {
                    oCommonHelp.onCloseBusy();
                    console.log(oError)
                }
            });
        },

        onDeleteItems:function(oModel, sPath, rowProperty, countProperty){
			var oRowDelete = oModel.getProperty(sPath);
			var aData = oModel.getProperty(rowProperty);
			var indx = aData.findIndex(findind=>findind.ID === oRowDelete.ID);
			aData.splice(indx, 1);
			oModel.setProperty(rowProperty, aData);
			oModel.setProperty(countProperty, aData.length);			
			oModel.refresh();
		},

        onAddItems:function(oModel, aRows, oNewRow, rowProperty, countProperty){
			aRows.push(oNewRow);
			oModel.setProperty(rowProperty, aRows);
			oModel.setProperty(countProperty, aRows.length);
			oModel.refresh();
		},

        validTaxCharacter:function(sCatacter){
            var objData = {Key: "", Val:""};
            if(sCatacter.toString().length === 1){
                objData.Key = "TaxKey0" + sCatacter;
                objData.Val = "TaxVal0" + sCatacter;                
            }else{
                objData.Key = "TaxKey" + sCatacter;
                objData.Val = "TaxVal" + sCatacter;  
            }
            return objData;
        },

        onCheckExencion: function(oBoolExencion, sSociedad, sTaxKey, dDateFactura, oIIBBItems){
            var aListaExenciones  =  models.get(sModelMainFacturas).getProperty("/ListaExenciones");
            var oCommonHelp = this.getCommon(); 
            if(aListaExenciones.length > 0){
                var aFilterExencion = aListaExenciones.filter(nfilter=>nfilter.Sociedad === sSociedad && nfilter.TaxKey === sTaxKey);
                if(aFilterExencion.length > 0){
                    for(var k in aFilterExencion){
                        var dDateDesde = new Date(oCommonHelp.formatDate(aFilterExencion[k].Desde, "FormatYYYY/MM/DD"));
                        var dDateHasta = new Date(oCommonHelp.formatDate(aFilterExencion[k].Hasta, "FormatYYYY/MM/DD"));
                        if(dDateFactura > dDateDesde && dDateFactura < dDateHasta){
                            oBoolExencion.BoolContinue = false;
                            if(oBoolExencion.Mensaje === ""){
                                oBoolExencion.Mensaje = "Existe una exención para " + oIIBBItems.Item + ".";
                            }else{
                                oBoolExencion.Mensaje = oBoolExencion.Mensaje + "\n Existe una exención para " + oIIBBItems.Item + "."; 
                            }                            
                        }
                    }
                }
            }
            return oBoolExencion;
        },

        onValueHelpOCs: function(){            
            var oCommonHelp = this.getCommon();
            var oController = models.get(sModelMain).getProperty("/ControllerMain");
            var oContext = this;
            var oTableListOCs,
                oDeferred = new jQuery.Deferred();
            if (!oController._ControllerListOCs) {
                oController._ControllerListOCs = {
                    "deferred": null,
                    "onPressCancel": function (oEvent) {
                        oTableListOCs.close();
                    },
                    "onSelectionChange": function (oEvent) {
                        var sOrdenSelect = oEvent.getSource().getSelectedItem().getProperty("title")
                        oEvent.getSource().getModel().setProperty("/comboOrdenCompra/selectKey", sOrdenSelect)
                        oEvent.getSource().getModel().refresh();
                        oTableListOCs.close();
                    }
                };
            }
            oController._ControllerListOCs.deferred = oDeferred;

            if (!oController._dialoListOCs) {
                oController._dialoListOCs = sap.ui.xmlfragment("simplot.portalsqas.view.fragment.ListsOCs", oController._ControllerListOCs);
            }
            oTableListOCs = oController._dialoListOCs;
            oTableListOCs.setModel(models.get(sModelMainFacturas));
            oController.getView().addDependent(oTableListOCs);
            oTableListOCs.open();
        },


        onSendToSap: function(oContextFacturas, fechaDoc, fechaVto){
            var oCommonHelp = this.getCommon(); 
            var oContext = this;
			oCommonHelp.onShowBusy();
			oCommonHelp.onChangeTextBusy(this.getI18nText("RecuperandoDatos"));
            var oBoolExencion = {BoolContinue: true, Mensaje: ""};
            var nTaxIdx = 1;
            var oFile = models.get(sModelMainFacturas).getProperty("/File");
            var oUserData = models.get("Model_User").getProperty("/DataUser");
            var oHeader = models.get(sModelMainFacturas).getProperty("/headerFields");
            var sTipoDoc = models.get(sModelMainFacturas).getProperty("/Combos/comboTipoFactura/selectKey");
            var sSubtipoDoc = models.get(sModelMainFacturas).getProperty("/Combos/comboSubtipoFactura/selectKey");
            var sCircuito = models.get(sModelMainFacturas).getProperty("/Combos/comboCircuito/selectKey");
            var sMoneda = models.get(sModelMainFacturas).getProperty("/Combos/comboMoneda/selectKey");
            var sModo = models.get(sModelMainFacturas).getProperty("/Combos/comboModo/selectKey");
            var sSociedad = models.get(sModelMainFacturas).getProperty("/Combos/comboSociedad/selectKey");
            var sPuchaseOrder = models.get(sModelMainFacturas).getProperty("/comboOrdenCompra/selectKey");
            var aIvaItems = models.get(sModelMainFacturas).getProperty("/ivaItems");
            var aIIBBItems = models.get(sModelMainFacturas).getProperty("/iibbItems");
            var ComboIvaItems = models.get(sModelMainFacturas).getProperty("/Combos/ComboIVA");
            var ComboIIBBItems = models.get(sModelMainFacturas).getProperty("/Combos/ComboIIBB");
            //var sTotal =  oHeader.total.replace(",", ".");
            //sTotal = Number(sTotal).toFixed(2);            
            //var sSubTotal = oHeader.subtotal.replace(",", ".");
            //sSubTotal = Number(sSubTotal).toFixed(2);
            //var sTipoCambio = oHeader.tipoCambio.replace(",", ".");
            //sTipoCambio = Number(sTipoCambio).toFixed(2);
            var boolDecimal = oCommonHelp.onCheckPointDecimal(oHeader.total);
            var sTotal = oCommonHelp.onReturnFormatToSend(oHeader.total, boolDecimal);
            var sSubTotal = oCommonHelp.onReturnFormatToSend(oHeader.subtotal, boolDecimal);
            var sTipoCambio = oCommonHelp.onReturnFormatToSend(oHeader.tipoCambio, boolDecimal);

            if(Number(sTotal) === 0 || Number(sSubTotal) === 0 ){
                oBoolExencion.BoolContinue = false;
                oBoolExencion.Mensaje = "No puede enviar importes en 0."
            }

            if(sMoneda === "ARS"){ 
                sTipoCambio = "1";              
            }else{
                if(Number(sTipoCambio) === 0 ){
                    oBoolExencion.BoolContinue = false;
                    oBoolExencion.Mensaje = "No puede enviar importes en 0."
                }
            }

            var sFechaDoc = oHeader.fecha;
            var sFechaCaeVence = oHeader.fechaVto;
            if(sFechaDoc === ""){}else{
                //sFechaDoc = oCommonHelp.formatDate(sFechaDoc, "Update");
                sFechaDoc = oCommonHelp.formatDate(fechaDoc, "Update");
            }
            if(sFechaCaeVence === ""){}else{
                //sFechaCaeVence = oCommonHelp.formatDate(sFechaCaeVence, "Update");
                sFechaCaeVence = oCommonHelp.formatDate(fechaVto, "Update");
            }
            
            var sLifnr = oUserData.NrSap;
            var oProperty = {
                Lifnr: sLifnr, IdDoc: "", NumOc:  sPuchaseOrder /*oHeader.nroPedido*/, Cae: oHeader.cae,
                FechaDoc: sFechaDoc, CaeVenc: sFechaCaeVence,
                Moneda: sMoneda, TipoDoc: sTipoDoc,
                SubtipoDoc: sSubtipoDoc, ImpBruto: sTotal, ImpNeto: sSubTotal ,
                Circuito: sCircuito, TipoCambio: sTipoCambio, NotaProveedor: oHeader.NotaProveedor,
                Modo: sModo, Numero: oHeader.nroFactura, Sociedad: sSociedad
            };
            for(var i in aIvaItems){
                var oTaxKeyValue = oCommonHelp.validTaxCharacter(nTaxIdx);
                //var sImporte = aIvaItems[i].Valor.replace(",", ".");
                //sImporte = Number(sImporte).toFixed(2);
                var sImporte = oCommonHelp.onReturnFormatToSend(aIvaItems[i].Valor, boolDecimal);
                oProperty[oTaxKeyValue.Key] = ComboIvaItems.filter(nfilter=>nfilter.value === aIvaItems[i].Item)[0].key;
                oProperty[oTaxKeyValue.Val] = sImporte;
                nTaxIdx = nTaxIdx + 1;   
                if(Number(sImporte) === 0){
                    oBoolExencion.BoolContinue = false;
                    oBoolExencion.Mensaje = "No puede enviar importes en 0."
                }             
            }
            debugger;
            
            var dDateFactura = new Date(oCommonHelp.formatDate(sFechaDoc, "FormatYYYY/MM/DD"));
            var boolExencion = true;
            for(var i in aIIBBItems){
                var oTaxKeyValue = oCommonHelp.validTaxCharacter(nTaxIdx);
                //var sImporte = aIIBBItems[i].Valor.replace(",", ".");
                //sImporte = Number(sImporte).toFixed(2);
                var sImporte = oCommonHelp.onReturnFormatToSend(aIIBBItems[i].Valor, boolDecimal);
                oProperty[oTaxKeyValue.Key] = ComboIIBBItems.filter(nfilter=>nfilter.value === aIIBBItems[i].Item)[0].key;
                oProperty[oTaxKeyValue.Val] = sImporte;
                if(Number(sImporte) === 0){
                    oBoolExencion.BoolContinue = false;
                    oBoolExencion.Mensaje = "No puede enviar importes en 0."
                } 
                oBoolExencion = this.onCheckExencion(oBoolExencion, sSociedad, oProperty[oTaxKeyValue.Key], dDateFactura,aIIBBItems[i]);
                                
                nTaxIdx = nTaxIdx + 1;  
                              
            }
            //CaeVenc? Sociedad? IdDoc, Numero?
            debugger; 
            if(sPuchaseOrder !== ""){            
                var oFilterOC = models.get(sModelMainFacturas).getProperty("/comboOrdenCompra/rowTemplate").filter(nfilter=>nfilter.Ebeln === sPuchaseOrder)[0];
                if(oFilterOC.Bukrs !== sSociedad){
                    oBoolExencion.BoolContinue = false;
                    if(oBoolExencion.Mensaje === ""){
                        oBoolExencion.Mensaje = "La Sociedad cargada no coincide con la Orden de Compra elegida.";
                    }else{
                        oBoolExencion.Mensaje = oBoolExencion.Mensaje + "\n La Sociedad cargada no coincide con la Orden de Compra elegida."; 
                    }  
                }
                if(oFilterOC.Moneda !== sMoneda){
                    oBoolExencion.BoolContinue = false;
                if(oBoolExencion.Mensaje === ""){
                    oBoolExencion.Mensaje = "La Moneda cargada no coincide con la Orden de Compra elegida.";
                }else{
                    oBoolExencion.Mensaje = oBoolExencion.Mensaje + "\n La Moneda cargada no coincide con la Orden de Compra elegida."; 
                }  
                }else{
                    if(Number(sTotal) > Number(oFilterOC.TolFact)){
                        oBoolExencion.BoolContinue = false;
                        if(oBoolExencion.Mensaje === ""){
                            oBoolExencion.Mensaje = "El importe total excede el total de la Orden de Compra elegida.";
                        }else{
                            oBoolExencion.Mensaje = oBoolExencion.Mensaje + "\n El importe total excede el total de la Orden de Compra elegida.."; 
                        }  
                    }
                }
            }

            var oPropertyAFIP = {
                Lifnr: sLifnr, Sociedad: sSociedad, SubtipoDoc: sSubtipoDoc, Numero: oHeader.nroFactura, 
                FechaDoc: sFechaDoc, ImpTotal: sTotal, Modo: sModo, Cae:oHeader.cae
            };

            var sEntity = "/DocumentoSet";  
            var sEntityAFIP = "/ConstataCompSet";              
            //oBoolExencion.BoolContinue = false;
            if(oBoolExencion.BoolContinue){
                gateway.create(sServiceAFIP, sEntityAFIP , oPropertyAFIP)
                .then(function(oReciveAFIP) {
                    if(oReciveAFIP.EvTipo === "E"){
                        oCommonHelp.onCloseBusy();
                        sap.m.MessageBox.error(oReciveAFIP.EvMensaje);
                    }else{
                        gateway.create(sService, sEntity , oProperty)
                        .then(function(oRecive) {
                            console.log(oRecive);
                            if(oRecive.EvTipo === "E"){
                                oCommonHelp.onCloseBusy();
                                sap.m.MessageBox.error(oRecive.EvMensaje);
                            }else{
                                oFile=oFile;
                                var sEntityFile =  "/AdjuntoSet"
                                var oPropertyFile = {
                                    "Archivo": oFile.name,
                                    "Contenido": oFile.Contenido,
                                    "IdDoc": oRecive.IdDoc,
                                    "Lifnr": sLifnr
                                }
                                gateway.create(sService, sEntityFile , oPropertyFile)
                                .then(function(oRecive) {
                                    console.log(oRecive);
                                    oCommonHelp.onCloseBusy();
                                    sap.m.MessageBox.show("Se envio correctamente la factura.", {
                                        "icon": sap.m.MessageBox.Icon.SUCCESS,
                                        "title": "Factura Enviada",
                                        "actions": [
                                            sap.m.MessageBox.Action.OK
                                        ],
                                        "onClose": function (vAction) {
                                            oContext.onCleanModelFacturas(oContextFacturas);
                                            models.get(sModelMain).getData().Targets.display("TargetMain");
                                        }
                                    });
                                    //sap.m.MessageBox.success("Se envio correctamente la factura.");
                                    debugger;
                                })
                                .catch(function(oError){
                                    oCommonHelp.onCloseBusy();
                                    sap.m.MessageBox.error("Error al enviar la factura.");
                                    console.log(oError);
                                });
                            }
                            
                        })
                        .catch(function(oError){
                            oCommonHelp.onCloseBusy();
                            sap.m.MessageBox.error("Error al enviar la factura.");
                            console.log(oError);
                        }); 
                    }
                })
                .catch(function(oError){
                    oCommonHelp.onCloseBusy();
                    sap.m.MessageBox.error("Error al enviar la factura.");
                    console.log(oError);
                });
                
            }else{
                oCommonHelp.onCloseBusy();
                sap.m.MessageBox.error(oBoolExencion.Mensaje);
            }
            
        }
	};
});