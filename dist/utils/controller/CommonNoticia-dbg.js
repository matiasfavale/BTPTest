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
    var sService = "NOTICIAS";
    var sServiceAuto = "AUTOGESTION";
    var sModelMainPizarron = "Model_Pizarron";
    var sModelMain = "Model_ControllerMain";
    return {
        getCommon: function () {
            var commonHelp = sap.ui.require("simplot/portalsqas/utils/Common");
            return commonHelp;
        },

        getI18nText: function (sId) {
            return models.get("i18n").getProperty(sId);
        },

        navToPizarron: function (oTargets) {
            this.onLoadModelPizarron()
            oTargets.display("pizarron");
        },

        onLoadModelPizarron: function () {
            var aData = []
            if (models.exists(sModelMainPizarron)) {
            } else {
                models.load(sModelMainPizarron, {
                    "rowsPizarron": [],
                    "rowsPizarronCount": 0,
                    "rowsPizarronBack": [],
                    "MsgPopUpVisto": false
                });
            }
            models.get(sModelMainPizarron).refresh();
            this.onGetNoticias();
        },

        onViewCantidadNoticias: function (aData) {
            if (!models.exists(sModelMainPizarron)) {
                this.onLoadModelPizarron();
            }
            if (models.get(sModelMainPizarron).getProperty("/MsgPopUpVisto")) {
            } else {
                if (aData.length > 0) {
                    var oCommonHelp = this.getCommon();
                    models.get(sModelMainPizarron).setProperty("/MsgPopUpVisto", true);
                    models.get(sModelMainPizarron).refresh();
                    var sMessage = oCommonHelp.getI18nText("NewMsgsCount") + " " + aData.length;
                    var dialog = new Dialog({
                        title: oCommonHelp.getI18nText("Aviso"),
                        type: 'Message',
                        state: 'Warning',
                        content: new Text({
                            text: sMessage
                        }),
                        beginButton: new Button({
                            text: 'OK',
                            press: function () {
                                var oTargets = models.get(sModelMain).getProperty("/Targets");
                                oCommonHelp.navToPizarron(oTargets);
                                dialog.close();
                            }
                        }),
                        afterClose: function () {
                            dialog.destroy();
                        }
                    });
                    dialog.open();
                }
            }
        },

        onReadNoticia: function (sCode) {
            var oContext = this;
            var oUserData = models.get("Model_User").getProperty("/DataUser");
            var sEntity = "/MarcarVistoSet(IvBpSap='" + oUserData.BpSap + "',IvCodnot='" + sCode + "')";
            gateway.read(sService, sEntity, {/*"filters": [nFilter,nFilter2]*/ })
                .then(function (oRecive) {
                    console.log(oRecive);
                    if (oRecive.EvTipo === "E") {
                        //sap.m.MessageBox.error(oRecive.EvMensaje);
                        console.log(oRecive.EvMensaje);
                    } else {
                        oContext.onGetNoticias();
                        var sText = "Se marcó la noticia como leída.";
                        console.log(sText);
                        //sap.m.MessageBox.success(sText);
                    }

                })
                .catch(function (oError) {
                    console.log(oError);
                });
        },

        onGetNoticias: function (sType) {
            var oContext = this;
            var oCommonHelp = this.getCommon();
            var oUserData = models.get("Model_User").getProperty("/DataUser");
            var nFilter2 = new sap.ui.model.Filter("IvTipoBp", "EQ", oUserData.TipoBp);
            var nFilter = new sap.ui.model.Filter("IvBpSap", "EQ", oUserData.BpSap);
            var sEntity = "/ListaNoticiaBPSet";
            gateway.read(sService, sEntity, { "filters": [nFilter, nFilter2] })
                .then(function (oRecive) {
                    var aData = oRecive.results;
                    var aVistosData = aData.filter(nfilter => nfilter.Visto === false);
                    models.get(sModelMain).setProperty("/Pizarron/CountNoticias", aVistosData.length);
                    models.get(sModelMain).refresh();
                    if (sType === "Cantidad") {
                        oContext.onViewCantidadNoticias(aVistosData);
                    } else {
                        for (var i in aData) {
                            aData[i].FechaHora = aData[i].Fecha + "" + aData[i].Hora;
                            aData[i].Fecha = oCommonHelp.formatDate(aData[i].Fecha, "Main");
                            aData[i].Hora = oCommonHelp.formatDate(aData[i].Hora, "GetHour");
                            aData[i].isEnabledVisto = true;
                            aData[i].styleReadLabel = "Bold";
                            aData[i].styleReadBtn = "Emphasized";
                            if (aData[i].Visto) {
                                aData[i].styleReadLabel = "Standard";
                                aData[i].styleReadBtn = "Default";
                                aData[i].isEnabledVisto = false;
                            }
                        }
                        aData = aData.sort(oContext.sortGlobal);
                        models.get(sModelMainPizarron).setProperty("/rowsPizarron", aData);
                        models.get(sModelMainPizarron).setProperty("/rowsPizarronBack", aData);
                        models.get(sModelMainPizarron).setProperty("/rowsPizarronCount", aData.length);
                        models.get(sModelMainPizarron).refresh();
                        console.log(oRecive);
                    }

                })
                .catch(function (oError) {
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

        onGetCuerpoNoticia: function (sCode) {
            var oCommonHelp = this.getCommon();
            var sEntity = "/ObtenerCuerpoSet('" + sCode + "')";
            gateway.read(sService, sEntity, {/*"filters": [nFilter]*/ })
                .then(function (oRecive) {
                    //var aData = oRecive.results;
                    oRecive.Titulo = models.get(sModelMainPizarron).getProperty("/ViewNoticia").Titulo;
                    models.get(sModelMainPizarron).setProperty("/ViewNoticia", oRecive);
                    models.get(sModelMainPizarron).refresh();
                    oCommonHelp.onCloseBusy();
                    console.log(oRecive);
                })
                .catch(function (oError) {
                    console.log(oError);
                });
        },

        onViewNoticia: function (oNoticia) {
            var oCommonHelp = this.getCommon();

            var oController = models.get(sModelMain).getProperty("/ControllerMain");
            var oContext = this;

            //
            var oTableNoticia,
                oDeferred = new jQuery.Deferred();
            var objData = { EvCuerpo: "", Titulo: oNoticia.Titulo };
            models.get(sModelMainPizarron).setProperty("/ViewNoticia", objData);
            models.get(sModelMainPizarron).refresh();
            if (!oController._ControllerViewNoticia) {
                oController._ControllerViewNoticia = {
                    "deferred": null,
                    "onPressCancelNoticia": function (oEvent) {
                        oTableNoticia.close();
                    },
                    "onPressConfirmNoticia": function (oEvent) {
                        oTableNoticia.close();
                    }
                };
            }
            oController._ControllerViewNoticia.deferred = oDeferred;

            if (!oController._dialogViewNoticia) {
                oController._dialogViewNoticia = sap.ui.xmlfragment("simplot.portalsqas.view.fragment.ViewNoticia", oController._ControllerViewNoticia);
            }
            oTableNoticia = oController._dialogViewNoticia;
            oTableNoticia.setModel(models.get(sModelMainPizarron));
            oController.getView().addDependent(oTableNoticia);
            oTableNoticia.open();
            oCommonHelp.onShowBusy();
            oCommonHelp.onChangeTextBusy(oCommonHelp.getI18nText("NewMsgsCount"));
            setTimeout(function () {
                oContext.onGetCuerpoNoticia(oNoticia.Codnot);
                if (oNoticia.Visto) {
                } else {
                    oContext.onReadNoticia(oNoticia.Codnot);
                }
            }, 2000);
        }
    };
});