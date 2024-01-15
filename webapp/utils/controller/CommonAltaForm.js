sap.ui.define([
    "simplot/portalsqas/utils/models",
    "simplot/portalsqas/utils/gateway",
    "simplot/portalsqas/utils/modelHelper",
    "simplot/portalsqas/utils/Common"
    //helpers
], function (models, gateway, modelHelper, Common) {
    "use strict";
    var sService = "NOTICIAS";
    var sServiceAuto = "AUTOGESTION";
    var sModelMainPizarron = "Model_Pizarron";
    var sModelMain = "Model_ControllerMain";
    var sModelMainOC = "Model_OC";
    var sModelAlta = "Model_MainAltaForm";
    return {
        getCommon: function () {
            var commonHelp = sap.ui.require("simplot/portalsqas/utils/Common");
            return commonHelp;
        },

        getI18nText: function (sId) {
            return models.get("i18n").getProperty(sId);
        },

        onLoadModelAlta: function () {
            var oCommonHelp = this.getCommon();
            if (models.exists(sModelAlta)) {
            } else {
                var oRow = modelHelper.getObjectJson();
                models.load(sModelAlta, {
                    "rowsIVAIGA": [],
                    "rowsIIBB": [],
                    "MaestroProveedores": oRow,
                    "Paises": [],
                    "Provincias": [],
                    "HabilitaPcia": false,
                    "CatFiscal": []
                });
            }
            oCommonHelp.onGetPaises();
            oCommonHelp.onGetImpuestos();
            //this.onGetCatFiscal();
            this.onGetDataPartner();
            this.onGetDataPartnerAdj("Load");
        },

        onGetDataPartner: function () {
            var oContext = this;
            var sBpPortal = models.get("Model_User").getProperty("/DataUser/BpPortal");
            var sEntity = "/ObtenerBasicoSet(IvBpPortal='" + sBpPortal + "',IvTipoBp='P')";
            gateway.read(sServiceAuto, sEntity, {/*"filters": [nFilter]*/ }).then(function (oRecive) {
                console.log("Obtener Basico");
                console.log(oRecive);
                var oResultsBasico = oRecive;
                var sSubtipo = models.get("Model_User").getProperty("/DataUser/GrupoBp");
                var sEntity = "/ObtenerBasConfSet(IvTipoBp='P',IvGrupoBp='" + sSubtipo + "')";
                gateway.read(sServiceAuto, sEntity, {/*"filters": [nFilter]*/ }).then(function (oRecive) {
                    var oResultsBasicoConf = oRecive;
                    var sEntity = "/ObtenerBasModSet(IvTipoBp='P',IvGrupoBp='" + sSubtipo + "')";
                    gateway.read(sServiceAuto, sEntity, {/*"filters": [nFilter]*/ }).then(function (oRecive) {
                        var oResultsBasicoMod = oRecive;
                        var oUserData = models.get("Model_User").getProperty("/DataUser");
                        var sPaisTxt = "";
                        if (oUserData.GrupoBp === "1") {
                            sPaisTxt = "AR";
                        }
                        if (oResultsBasico.Pais === "") {
                            oResultsBasico.Pais = sPaisTxt;
                        }
                        debugger;
                        if (oResultsBasico.EvTipo === "E") {
                            sap.m.MessageBox.error(oResultsBasico.EvMensaje);
                        } else {
                            oContext.onLoadDataAltaForm(oResultsBasico, oResultsBasicoConf, oResultsBasicoMod);
                        }
                    }).catch(function (oError) {
                        console.log(oError);
                    });
                }).catch(function (oError) {
                    console.log(oError);
                });
            });
        },

        onLoadCountDocumentacion: function (aDataAdjuntos, aDataAdjuntosBP) {
            var oCommonHelp = this.getCommon();
            var aNewDataAdjuntos = [];
            for (var i in aDataAdjuntos) {
                aNewDataAdjuntos.push(aDataAdjuntos[i]);
                for (var j in aDataAdjuntosBP) {
                    if (aDataAdjuntos[i].CodAdj === aDataAdjuntosBP[j].CodAdj) {
                        aNewDataAdjuntos[i].Carga = "S";
                        aNewDataAdjuntos[i].FechaCarga = aDataAdjuntosBP[j].Vencimiento;
                    }
                }
            }
            var aAdjObliga = aNewDataAdjuntos.filter(nfilter => nfilter.TipoAdj === "M");
            var aAdjPendientes = aAdjObliga.filter(nfilter => nfilter.Carga != "S");
            var aAdjVencidas = [];
            for (var k in aAdjObliga) {
                var dDate = new Date(oCommonHelp.formatDate(oCommonHelp.formatDate(aAdjObliga[k].FechaCarga, "Main"), "FormatAAAAmmDD"))
                if (new Date() >= new Date(dDate)) {
                    aAdjVencidas.push(aAdjObliga[k]);
                }
            }
            models.get(sModelMain).setProperty("/Documentacion/CountVencidas", aAdjVencidas.length);
            models.get(sModelMain).setProperty("/Documentacion/CountPendientes", aAdjPendientes.length);
            models.get(sModelMain).refresh();
        },

        onGetDataPartnerAdj: function (sType) {

            var oContext = this;
            var oUserData = models.get("Model_User").getProperty("/DataUser");
            var sEntity = "/ListaAdjConfSet";
            var nFilter2 = new sap.ui.model.Filter("IvGrupoBp", "EQ", oUserData.GrupoBp);
            var nFilter = new sap.ui.model.Filter("IvTipoBp", "EQ", oUserData.TipoBp);
            gateway.read(sServiceAuto, sEntity, { "filters": [nFilter, nFilter2] })
                .then(function (oRecive) {
                    var aDataAdjuntos = oRecive.results;
                    var nFilter = new sap.ui.model.Filter("IvBpPortal", "EQ", oUserData.BpPortal);
                    var nFilter2 = new sap.ui.model.Filter("IvTipoBp", "EQ", oUserData.TipoBp);
                    var sEntityBP = "/ListaAdjSet";
                    gateway.read(sServiceAuto, sEntityBP, { "filters": [nFilter, nFilter2] })
                        .then(function (oRecive) {
                            var aDataAdjuntosBP = oRecive.results;
                            if (sType === "Load") {
                                oContext.onLoadDataArchivo(aDataAdjuntos, aDataAdjuntosBP);
                            }
                            oContext.onLoadCountDocumentacion(aDataAdjuntos, aDataAdjuntosBP);


                        })
                        .catch(function (oError) {
                            console.log(oError);
                        });

                })
                .catch(function (oError) {
                    console.log(oError);
                });
        },

        isModify: function (sField) {
            var boolField = true;
            if (sField === "X") {
                boolField = true;
            } else {
                boolField = false;
            }
            return boolField;
        },

        isRequerido: function (sField, sState, sFieldMod, isProvincia) {
            var oRequired = { Requerido: true, Habilitado: true, IsModify: true };
            if (sField === "") {
                oRequired.Requerido = false;
                oRequired.Habilitado = false;
            } else if (sField === "1") {
                oRequired.Requerido = true;
                oRequired.Habilitado = true;
            } else if (sField === "2") {
                oRequired.Requerido = false;
                oRequired.Habilitado = true;
            }
            if (sState === "1" || sState === "2" || sState === "3") {
                oRequired.Habilitado = false;
            }
            if (sFieldMod === "X") {
                oRequired.IsModify = true;
            } else {
                oRequired.IsModify = false;
            }
            if (isProvincia === "X") {
                models.get(sModelAlta).setProperty("/HabilitaPcia", oRequired.Habilitado);
                models.get(sModelAlta).refresh();
            }
            return oRequired;
        },


        getState: function (sEstado) {
            //ToDo 
            var oCommonHelp = this.getCommon();
            var objEstado = { Descripcion: "", State: "" };
            if (sEstado === "0") {
                objEstado.State = "Warning";
                objEstado.Descripcion = oCommonHelp.getI18nText("Pendiente");
            } else if (sEstado === "1") {
                objEstado.State = "Warning";
                objEstado.Descripcion = oCommonHelp.getI18nText("Enviado");
            } else if (sEstado === "2") {
                objEstado.State = "Success";
                objEstado.Descripcion = oCommonHelp.getI18nText("EnProceso");
            } else if (sEstado === "3") {
                objEstado.State = "Success";
                objEstado.Descripcion = oCommonHelp.getI18nText("Completo");
            }
            return objEstado;
        },

        isValid: function (sEstado, sOperacion) {
            var oValid = { boolHabilitado: true, boolBtnModifica: true, boolBtnSave: true, boolBtnSend: true, boolBtnCancel: false };
            var boolHabilitado = true;
            if ((sEstado === "0") && (sOperacion === "A")) {
                oValid.boolHabilitado = true;
                oValid.boolBtnSave = true;
                oValid.boolBtnSend = true;
                oValid.boolBtnModifica = false;
                oValid.boolBtnCancel = false;
            } else if ((sEstado === "0") && (sOperacion === "M")) {
                oValid.boolHabilitado = false;
                oValid.boolBtnSave = false;
                oValid.boolBtnSend = true;
                oValid.boolBtnModifica = false;
                oValid.boolBtnCancel = false;
            } else if (sEstado === "1") {
                oValid.boolHabilitado = false;
                oValid.boolBtnSave = false;
                oValid.boolBtnSend = false;
                oValid.boolBtnModifica = false;
                oValid.boolBtnCancel = false;
            } else if (sEstado === "2") {
                oValid.boolHabilitado = false;
                oValid.boolBtnSave = false;
                oValid.boolBtnSend = false;
                oValid.boolBtnModifica = false;
                oValid.boolBtnCancel = false;
            } else if (sEstado === "3") {
                oValid.boolHabilitado = false;
                oValid.boolBtnSave = false;
                oValid.boolBtnSend = false;
                oValid.boolBtnModifica = true;
                oValid.boolBtnCancel = false;
            }
            return oValid;
        },

        onEnableFields: function (boolProp) {
            var objBasico = models.get(sModelAlta).getProperty("/MaestroProveedores/DatosBasicos");
            var objDireccion = models.get(sModelAlta).getProperty("/MaestroProveedores/Direccion");
            var objBanco = models.get(sModelAlta).getProperty("/MaestroProveedores/DatosBanco");
            var objImpuesto = models.get(sModelAlta).getProperty("/MaestroProveedores/Impuesto");
            /*
            var objBasico= {Nombre: "", Telefono: "", Mail: "", CUIT: "", CatFiscal: "", InicioAct: ""};
            var objDireccion= {Calle:"", Ciudad: "", CP: "", Pais: "", Idioma: "", Provincia: "", Nrocalle: ""};
            var objBanco = {Banco: "", CBU: "", CtaBancaria: "", PaisBanco: ""};
            */
            for (var propBasico in objBasico) {
                var sPathIni = "/MaestroProveedores/DatosBasicos/" + propBasico + "/Validar/Habilitado";
                var boolBasico = boolProp;
                if (boolProp) {
                    boolBasico = objBasico[propBasico].Validar.IsModify;
                } else {
                    boolBasico = false;
                }
                models.get(sModelAlta).setProperty(sPathIni, boolBasico);
            }
            for (var propDireccion in objDireccion) {
                var sPathIni = "/MaestroProveedores/Direccion/" + propDireccion + "/Validar/Habilitado";
                var boolDire = boolProp;
                if (boolProp) {
                    boolDire = objDireccion[propDireccion].Validar.IsModify;
                } else {
                    boolDire = false;
                }
                models.get(sModelAlta).setProperty(sPathIni, boolDire);
            }
            for (var propBanco in objBanco) {
                var sPathIni = "/MaestroProveedores/DatosBanco/" + propBanco + "/Validar/Habilitado";
                var boolBanco = boolProp;
                if (boolProp) {
                    boolBanco = objBanco[propBanco].Validar.IsModify;
                } else {
                    boolBanco = false;
                }
                models.get(sModelAlta).setProperty(sPathIni, boolBanco);
            }
            for (var propImpuesto in objImpuesto) {
                var sPathIni = "/MaestroProveedores/Impuesto/" + propImpuesto + "/Validar/Habilitado";
                var boolBanco = boolProp;
                if (boolProp) {
                    boolBanco = objImpuesto[propImpuesto].Validar.IsModify;
                } else {
                    boolBanco = false;
                }
                models.get(sModelAlta).setProperty(sPathIni, boolBanco);
            }
            models.get(sModelAlta).setProperty("/HabilitaPcia", boolProp);
            models.get(sModelAlta).setProperty("/MaestroProveedores/Habilitado/boolBtnCancel", boolProp);
            models.get(sModelAlta).refresh();
            models.get(sModelAlta).refresh();
        },


        onLoadDataAltaForm: function (objData, objDataConf, objDataMod) {
            var oContext = this;
            var oCommonHelp = this.getCommon();
            //Requerido  Habilitado IsModify
            var objBasico = {
                Nombre: { Texto: objData.Nombre, Validar: oContext.isRequerido(objDataConf.Nombre, objData.Estado, objDataMod.Nombre, "") },
                Telefono: { Texto: objData.Telefono, Validar: oContext.isRequerido(objDataConf.Telefono, objData.Estado, objDataMod.Telefono, "") },
                Mail: { Texto: objData.Mail, Validar: oContext.isRequerido(objDataConf.Mail, objData.Estado, objDataMod.Mail, "") },
                CUIT: { Texto: objData.Nif, Validar: oContext.isRequerido(objDataConf.Nif, objData.Estado, objDataMod.Nif, "") },
                //CatFiscal: {Texto:objData.Catfiscal,Validar:oContext.isRequerido(objDataConf.Catfiscal, objData.Estado, objDataMod.Catfiscal, "")},
                InicioAct: {
                    Texto: oCommonHelp.formatDate(objData.Fechainiact, "Main"),
                    Validar: oContext.isRequerido(objDataConf.Fechainiact, objData.Estado, objDataMod.Fechainiact, "")
                }
            };
            var objDireccion = {
                Calle: { Texto: objData.Calle, Validar: oContext.isRequerido(objDataConf.Calle, objData.Estado, objDataMod.Calle, "") },
                Ciudad: { Texto: objData.Ciudad, Validar: oContext.isRequerido(objDataConf.Ciudad, objData.Estado, objDataMod.Ciudad, "") },
                CP: { Texto: objData.Cp, Validar: oContext.isRequerido(objDataConf.Cp, objData.Estado, objDataMod.Cp, "") },
                Pais: { Texto: objData.Pais, Validar: oContext.isRequerido(objDataConf.Pais, objData.Estado, objDataMod.Pais, "") },
                Idioma: { Texto: objData.Idioma, Validar: oContext.isRequerido(objDataConf.Idioma, objData.Estado, objDataMod.Idioma, "") },
                Provincia: { Texto: objData.Provincia, Validar: oContext.isRequerido(objDataConf.Provincia, objData.Estado, objDataMod.Provincia, "X") },
                Nrocalle: { Texto: objData.Nrocalle, Validar: oContext.isRequerido(objDataConf.Nrocalle, objData.Estado, objDataMod.Nrocalle, "") }
            };
            var objBanco = {
                Banco: { Texto: objData.Banco, Validar: oContext.isRequerido(objDataConf.Banco, objData.Estado, objDataMod.Banco, "") },
                CBU: { Texto: objData.Cbu, Validar: oContext.isRequerido(objDataConf.Cbu, objData.Estado, objDataMod.Cbu, "") },
                CtaBancaria: { Texto: objData.Ctabancaria, Validar: oContext.isRequerido(objDataConf.Ctabancaria, objData.Estado, objDataMod.Ctabancaria, "") }
                //PaisBanco: {Texto:objData.Paisbanco, Validar:oContext.isRequerido(objDataConf.Paisbanco, objData.Estado, objDataMod.Paisbanco, "")}
            };
            var objImpuesto = {
                Iga: { Texto: objData.Iga, Validar: oContext.isRequerido(objDataConf.Iga, objData.Estado, objDataMod.Iga, "") },
                Iva: { Texto: objData.Iva, Validar: oContext.isRequerido(objDataConf.Iva, objData.Estado, objDataMod.Iva, "") },
                Iibb: { Texto: objData.Iibb, Validar: oContext.isRequerido(objDataConf.Iibb, objData.Estado, objDataMod.Iibb, "") }
            };

            var objEstado = {
                Id: objData.Estado,
                Descripcion: this.getState(objData.Estado).Descripcion,
                State: this.getState(objData.Estado).State
            };
            var objOperacion = {
                Id: objData.Operacion,
                Descripcion: objData.Operacion
            };
            var oValid = this.isValid(objData.Estado, objData.Operacion);
            if (objDireccion.Pais.Texto === "") {
            } else {
                oCommonHelp.onGetPcia(objDireccion.Pais.Texto, "X");
            }
            models.get(sModelAlta).setProperty("/MaestroProveedores/Habilitado", oValid);
            models.get(sModelAlta).setProperty("/MaestroProveedores/DatosBasicos", objBasico);
            models.get(sModelAlta).setProperty("/MaestroProveedores/Direccion", objDireccion);
            models.get(sModelAlta).setProperty("/MaestroProveedores/Impuesto", objImpuesto);
            models.get(sModelAlta).setProperty("/MaestroProveedores/DatosBanco", objBanco);
            models.get(sModelAlta).setProperty("/MaestroProveedores/Estado", objEstado);
            models.get(sModelAlta).setProperty("/MaestroProveedores/Operacion", objOperacion);
            models.get(sModelAlta).refresh();
        },

        onReturnDataAdjBP: function (sCodAdj, aDataBP) {
            var oCommonHelp = this.getCommon();
            var aNewDataBP = aDataBP.filter(nFilter => nFilter.CodAdj === sCodAdj);
            if (aNewDataBP.length > 0) {
                aNewDataBP[0].FechaVence = oCommonHelp.formatDate(aNewDataBP[0].Vencimiento, "Main")
                return aNewDataBP[0];
            } else {
                return null;
            }
        },

        onLoadDataArchivo: function (aData, aDataBP) {
            //aData = aData.filter(nFilter=>nFilter.TipoBp === "P");
            var aNewData = [];
            for (var i in aData) {
                var boolObliga = true;
                var objDataBP = this.onReturnDataAdjBP(aData[i].CodAdj, aDataBP);
                var sDate = "";
                var boolIsLoad = true;
                if (aData[i].TipoAdj === "M") {
                    boolObliga = true;
                } else {
                    boolObliga = false;
                }
                if (objDataBP !== null) {
                    sDate = objDataBP.FechaVence;
                    boolIsLoad = true;
                } else {
                    sDate = "";
                    boolIsLoad = false;
                }
                var objData = { Tipo: aData[i].DescAdj, FechaVence: sDate, Codigo: aData[i].CodAdj, Obliga: boolObliga, IsLoad: boolIsLoad };
                aNewData.push(objData);
            }
            models.get(sModelAlta).setProperty("/MaestroProveedores/Archivos", aNewData);
            models.get(sModelAlta).setProperty("/MaestroProveedores/maxArchivos", aNewData.length);
            models.get(sModelAlta).refresh();
        }

    };
});