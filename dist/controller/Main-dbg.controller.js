sap.ui.define([
    "simplot/portalsprd/controller/BaseController",
    "simplot/portalsprd/utils/models",
    "simplot/portalsprd/utils/gateway",
    "simplot/portalsprd/utils/Common"
],

    function (Controller, models, gateway, Common) {
        "use strict";
        var sModelMain = "Model_ControllerMain";


        return Controller.extend("simplot.portalsprd.controller.Main", {
            onInit: function () {
                //this.fetchTokenNew();
                console.log("V20230929");
                models.load(sModelMain, {
                    "UserEnabled": false,
                    "Targets": this.getOwnerComponent().getTargets(),
                    "ControllerMain": this,
                    "Apps": [
                        { "App": "Pizarron", "canUseApp": false },
                        { "App": "OC", "canUseApp": false },
                        { "App": "Reclamos", "canUseApp": false },
                        { "App": "CuentaCorriente", "canUseApp": false },
                        { "App": "Facturas", "canUseApp": false },
                        { "App": "FacturasView", "canUseApp": false }
                    ],
                    "OC": {
                        "CountCumplida": 0, "CountRecepParcial": 0, "DescCumplida": "",
                        "DescRecepParcial": "", "canUseApp": false, "rowsOC":[]
                    },
                    "Pizarron": { "CountNoticias": 0, "canUseApp": false },
                    "Reclamos": { "CountNew": 0, "CountInProcess": 0, "canUseApp": false },
                    "Documentacion": { "CountVencidas": 0, "CountPendientes": 0 }
                });
                var oUser = sap.ushell.Container.getUser();
                console.log(oUser.getEmail());
                Common.onLoadModelUser(oUser.getEmail());
                this.getView().setModel(models.get(sModelMain));
            },

            getToken: function () {
                return new Promise(function (resolve, reject) {
                    $.ajax({
                        type: "GET",
                        url: $.appModulePath,
                        headers: {
                            "X-CSRF-Token": "Fetch"
                        },
                        success: function (data, statusText, xhr) {
                            resolve(xhr.getResponseHeader("X-CSRF-Token"));
                        },
                        error: function (errMsg) {
                            resolve(errMsg.getResponseHeader("X-CSRF-Token"));
                        },
                        contentType: "application/json"
                    });
    
                });
            },
    
            fetchTokenNew: function () {
                this.getToken().then(function (oToken) {
                    var  settings = {
                        "url": $.appModulePath + "/sap/opu/odata/sap/ZBP_AFIP_SRV/ListaCatFiscalSet",
                        "method": "GET",
                        "headers": {
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                            "X-CSRF-Token": oToken
                        }
                    };
                    
                    $.ajax(settings)
                        .done(function (response) {
                            console.log("ressuccess");
                            console.log(response);
                        })
                        .fail(function (error) {
                            console.log("resfailed");
                            console.log(error);
                        });
                })
    
            },

            onPressOCCumplida: function () {
                this.onPressOC("1");
            },
            onPressOCRecepParcial: function () {
                this.onPressOC("3");
            },
            onPressOC: function (sState) {
                var oAppOC = models.get(sModelMain).getProperty("/Apps").filter(nfilter => nfilter.App === "OC")[0];
                if (oAppOC.canUseApp) {
                    var oTargets = models.get(sModelMain).getProperty("/Targets");
                    if (sState === "1" || sState === "3") {
                        Common.navToOC(oTargets, sState);
                    } else {
                        Common.navToOC(oTargets, null);
                    }
                } else {
                    sap.m.MessageBox.error(Common.getI18nText("NotNroSap"));
                }
            },

            onPressAltaForm: function () {
                var oTargets = models.get(sModelMain).getProperty("/Targets");
                Common.navToAltaForm(oTargets);
            },

            onPressReclamos: function (oEvent) {
                const oSource = oEvent.getSource();
                oSource.setBusy(true);
                var oTargets = models.get(sModelMain).getProperty("/Targets");
                Common.navToClaims(oTargets).finally(() => {
                    oSource.setBusy(false);
                });
            },

            onPressPizarron: function () {
                var oAppPizarron = models.get(sModelMain).getProperty("/Apps").filter(nfilter => nfilter.App === "Pizarron")[0];
                if (oAppPizarron.canUseApp) {
                    var oTargets = models.get(sModelMain).getProperty("/Targets");
                    Common.navToPizarron(oTargets);
                } else {
                    sap.m.MessageBox.error(Common.getI18nText("NotBpSap"));
                }
            },

            onPressFacturas: function () {
                var oAppFacturas = models.get(sModelMain).getProperty("/Apps").filter(nfilter => nfilter.App === "Facturas")[0];
                if (oAppFacturas.canUseApp) {
                    var oTargets = models.get(sModelMain).getProperty("/Targets");
                    Common.navToFacturas(oTargets);
                } else {
                    sap.m.MessageBox.error(Common.getI18nText("NotBpSap"));
                }
            },

            onPressViewFacturas: function () {
                var oAppFacturasView = models.get(sModelMain).getProperty("/Apps").filter(nfilter => nfilter.App === "FacturasView")[0];
                if (oAppFacturasView.canUseApp) {
                    var oTargets = models.get(sModelMain).getProperty("/Targets");
                    Common.navToViewFacturas(oTargets);
                } else {
                    sap.m.MessageBox.error(Common.getI18nText("NotBpSap"));
                }
            },

            onPressCtaCte: function () {
                var oAppCtaCte = models.get(sModelMain).getProperty("/Apps").filter(nfilter => nfilter.App === "CuentaCorriente")[0];
                if (oAppCtaCte.canUseApp) {
                    var oTargets = models.get(sModelMain).getProperty("/Targets");
                    Common.navToCtaCte(oTargets);
                } else {
                    sap.m.MessageBox.error(Common.getI18nText("NotBpSap"));
                }
            }
        });
    });