sap.ui.define([
	"simplot/portalsprd/utils/models",
	//"sap/ui/export/Spreadsheet",
	"simplot/portalsprd/utils/gateway",
	"simplot/portalsprd/utils/modelHelper",
	"simplot/portalsprd/utils/FileDownHelp",
	"simplot/portalsprd/utils/controller/CommonNoticia",
	"simplot/portalsprd/utils/controller/CommonOC",
	"simplot/portalsprd/utils/controller/CommonAltaForm",
	"simplot/portalsprd/utils/controller/CommonClaims",
	"simplot/portalsprd/utils/controller/CommonFacturas",
    "simplot/portalsprd/utils/controller/CommonFacturasView",
	"simplot/portalsprd/utils/controller/CommonCtaCte"
	//helpers
], function (models,/*Spreadsheet,*/ gateway, modelHelper, FileDownHelp, CommonNoticia, CommonOC, CommonAltaForm, CommonClaims, CommonFacturas, CommonFacturasView, CommonCtaCte) {
	"use strict";
	var sService = "ORDEN_COMPRA";
	var sServiceAuto = "AUTOGESTION";
	var sModelMainAlta = "Model_MainAltaForm";
	var sModelMainOC = "Model_OC";
	var sModelMain = "Model_ControllerMain";
	var sModelMainFacturas = "Model_Facturas";
	var sModelMainCtaCte = "Model_CtaCte";
	return {

		getI18nText: function (sId) {
			return models.get("i18n").getProperty(sId);
		},


		onDownloadFile: function (base64code, contentType, docName) {
			try {
				this.saveDataFile(this.btoBlob(atob(base64code), contentType), docName);
			} catch (ex) {
				console.log("Error al subir imagen");
			}
		},
		btoBlob: function (binary, contentType, sliceSize) {
			contentType = contentType || '';
			sliceSize = sliceSize || 2048;
			var byteCharacters = binary;
			var byteArrays = [];
			var blob;
			for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
				var slice = byteCharacters.slice(offset, offset + sliceSize);
				var byteNumbers = new Array(slice.length);
				for (var i = 0; i < slice.length; i++) {
					byteNumbers[i] = slice.charCodeAt(i);
				}
				var byteArray = new Uint8Array(byteNumbers);
				byteArrays.push(byteArray);
			}
			try {
				blob = new Blob(byteArrays, {
					type: contentType
				});
			} catch (e) {
				window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
				blob = new BlobBuilder();
				blob.append(byteArrays);
				blob = blob.getBlob();
			}
			return blob;
		},
		saveDataFile: function (blob, fileName) {
			if (navigator.msSaveBlob) {
				return navigator.msSaveBlob(blob, fileName);
			} else if (navigator.userAgent.indexOf("Chrome") != -1) {
				var a = document.createElement("a");
				document.body.appendChild(a);
				a.style = "display: none";
				url = window.URL.createObjectURL(blob);
				a.href = url;
				a.setAttribute("download", fileName);
				a.download = fileName;
				a.click();
				window.URL.revokeObjectURL(url);
			} else {
				var url = window.URL.createObjectURL(blob);
				window.location.href = url;
			}
		},

		navToAltaForm: function (oTargets) {
			CommonAltaForm.onLoadModelAlta()
			oTargets.display("altaform");
		},
		navToClaims: function (oTargets) {
			return CommonClaims.navToClaims(oTargets);
		},
		navToOC: function (oTargets, sState) {
			CommonOC.onLoadModelOC(sState);
			oTargets.display("ordenCompra");
		},
		navToPizarron: function (oTargets) {
			CommonNoticia.onLoadModelPizarron();
			oTargets.display("pizarron");
		},
		navToFacturas: function (oTargets) {
			CommonFacturas.onLoadModelFacturas();
			oTargets.display("facturas");
		},
        navToViewFacturas: function (oTargets) {
			CommonFacturasView.onLoadModelFacturas();
			oTargets.display("facturasview");
		},
		navToCtaCte: function (oTargets) {
			CommonCtaCte.onLoadModelCtaCte();
			oTargets.display("cuentacorriente");
		},

		onGetImpuestos: function () {
			var oContext = this;
			var objectImpuestos = {
				ResponsableInscripto: oContext.getI18nText("ResponsableInscripto"),
				Monotributo: oContext.getI18nText("Monotributo"),
				NoInscripto: oContext.getI18nText("NoInscripto"),
				Exento: oContext.getI18nText("Exento"),
				Contribuyente: oContext.getI18nText("Contribuyente"),
				Convenio: oContext.getI18nText("Convenio")
			};
			var aRowsIvaIga = [{ Codigo: "1", Texto: objectImpuestos.ResponsableInscripto },
			{ Codigo: "2", Texto: objectImpuestos.Monotributo },
			{ Codigo: "3", Texto: objectImpuestos.NoInscripto }, { Codigo: "4", Texto: objectImpuestos.Exento }];
			var aRowsIIBB = [{ Codigo: "1", Texto: objectImpuestos.Contribuyente },
			{ Codigo: "2", Texto: objectImpuestos.Convenio },
			{ Codigo: "3", Texto: objectImpuestos.Exento }];

			models.get(sModelMainAlta).setProperty("/rowsIVAIGA", aRowsIvaIga);
			models.get(sModelMainAlta).setProperty("/rowsIIBB", aRowsIIBB);
			models.get(sModelMainAlta).refresh();
		},

		onGetPaises: function () {
			var sEntity = "/ListaPaisSet";
			gateway.read(sServiceAuto, sEntity, {/*"filters": [nFilter]*/ })
				.then(function (oRecive) {
					var aData = oRecive.results;
					models.get(sModelMainAlta).setProperty("/Paises", aData);
					models.get(sModelMainAlta).setSizeLimit(10000);
					models.get(sModelMainAlta).refresh();
				})
				.catch(function (oError) {
					console.log(oError);
				});
		},

		onGetCatFiscal: function () {
			var sEntity = "/ListaCatFiscalSet";
			gateway.read(sServiceAuto, sEntity, {/*"filters": [nFilter]*/ })
				.then(function (oRecive) {
					var aData = oRecive.results;
					models.get(sModelMainAlta).setProperty("/CatFiscal", aData);
					models.get(sModelMainAlta).refresh();
				})
				.catch(function (oError) {
					console.log(oError);
				});
		},

		onGetPcia: function (sCode, sType) {
			var oContext = this;
			if (sCode === "") {
				if (sType === "X") {
					models.get(sModelMainAlta).setProperty("/HabilitaPcia", false);
					models.get(sModelMainAlta).refresh();
				} else {
					models.get(sModelMainAlta).setProperty("/HabilitaPcia", true);
					models.get(sModelMainAlta).refresh();
				}
			} else {
				var sEntity = "/ListaProvinciaSet";
				var nFilter = new sap.ui.model.Filter("IvPais", "EQ", sCode);
				gateway.read(sServiceAuto, sEntity, { "filters": [nFilter] })
					.then(function (oRecive) {
						var aData = oRecive.results;
						var obj = { Codigo: "", Texto: oContext.getI18nText("SeleccionarPcia") };
						//aData.unshift(obj);        
						models.get(sModelMainAlta).setProperty("/Provincias", aData);
						if (aData.length > 0) {
							models.get(sModelMainAlta).setProperty("/MaestroProveedores/Direccion/Provincia/Texto", aData[0].Codigo);
						} else {
							models.get(sModelMainAlta).setProperty("/MaestroProveedores/Direccion/Provincia/Texto", "");
						}
						if (sType === "X") {
						} else {
							models.get(sModelMainAlta).setProperty("/HabilitaPcia", true);
						}
						models.get(sModelMainAlta).refresh();
					})
					.catch(function (oError) {
						console.log(oError);
					});
			}
		},

		onDownloadArchivo: function (sEntity) {
			gateway.read(sServiceAuto, sEntity, {/*"filters": [nFilter]*/ })
				.then(function (oRecive) {
					console.log(oRecive);
					var b64Code = oRecive.EvContenido;
					var contentType = "";
					var fileName = oRecive.EvNombreArch;
					FileDownHelp.download(b64Code, contentType, fileName);
				})
				.catch(function (oError) {
					console.log(oError);
				});
		},

		onLoadModelUser: function (sUser) {
			var oContext = this;
			oContext.onShowBusy();
			oContext.onChangeTextBusy(oContext.getI18nText("RecuperandoDatos"));
			models.load("Model_User", {
				"DataUser": {}
			});
			//Solo TEST
			/*
			if (sUser === undefined) {
				sUser = 'matias.favale@hotmail.com.ar';
			}
			*/
			var sEntity = "/UsuarioPortalSet('" + sUser.toUpperCase() + "')";
			gateway.read(sServiceAuto, sEntity, {/*"filters": [nFilter]*/ })
				.then(function (oRecive) {
					models.get("Model_User").setProperty("/DataUser", oRecive);
					models.get("Model_User").refresh();
					if(oRecive.EvTipo === "E"){
						sap.m.MessageBox.error(oRecive.EvMensaje);
						models.get(sModelMain).setProperty("/UserEnabled", false);
						models.get(sModelMain).refresh();
					}else{
						models.get(sModelMain).setProperty("/UserEnabled", true);
						models.get(sModelMain).refresh();
						//Check permisos user
						var aDataAccessApps = oContext.onCheckUser();
						CommonAltaForm.onGetDataPartnerAdj("CountDocumentacion");
						//Datos OC                 
						var oAccessOC = aDataAccessApps.filter(nfilter => nfilter.App === "OC")[0];
						if (oAccessOC.canUseApp) {
							CommonOC.onGetListOC(true, null);
						}
						//Datos Pizarron
						var oAccessPizarron = aDataAccessApps.filter(nfilter => nfilter.App === "Pizarron")[0];
						if (oAccessPizarron.canUseApp) {
							CommonNoticia.onGetNoticias("Cantidad");
						}
						//Datos Reclamos
						var oAccessClaims = aDataAccessApps.filter(nfilter => nfilter.App === "Reclamos")[0];
						if (oAccessClaims.canUseApp) {
							CommonClaims.getClaims();
						}
					}
					oContext.onCloseBusy();
				})
				.catch(function (oError) {
					oContext.onCloseBusy();
					console.log(oError);
				});
		},

		onSearch: function (oProps) {
			var aList = oProps.Model.getProperty(oProps.ListBack);
			var sQuery = oProps.Value;
			var aNewList = [];
			if (sQuery === "") {
				oProps.Model.setProperty(oProps.List, aList);
				//models.get("Model_PropuestaPerfecc").setProperty("/rowsPropuestaCount", aList.length);
			} else {
				if (isNaN(sQuery)) {
					aNewList = aList.filter(nfilter => nfilter[oProps.StringSearch].toUpperCase().match(sQuery.toUpperCase()));
				} else {
					aNewList = aList.filter(nfilter => nfilter[oProps.NumberSearch].match(Number(sQuery)));
				}
				oProps.Model.setProperty(oProps.List, aNewList);
				//models.get("Model_PropuestaPerfecc").setProperty("/rowsPropuestaCount", aNewList.length);
				oProps.Model.refresh();
			}
		},

		onCheckUser: function () {
			var oUser = models.get("Model_User").getProperty("/DataUser");
			var aDataApps = models.get(sModelMain).getProperty("/Apps");
			for (var i in aDataApps) {
				if (aDataApps[i].App === "Pizarron") {
					if (oUser.BpSap === "" || oUser.NrSap === "") {
						aDataApps[i].canUseApp = false;
					} else {
						aDataApps[i].canUseApp = true;
					}
				} else if (aDataApps[i].App === "OC") {
					if (oUser.NrSap === "" || oUser.BpSap === "") {
						aDataApps[i].canUseApp = false;
					} else {
						aDataApps[i].canUseApp = true;
					}
				} else if (aDataApps[i].App === "Reclamos") {
					if (oUser.NrSap === "" || oUser.BpSap === "") {
						aDataApps[i].canUseApp = false;
					} else {
						aDataApps[i].canUseApp = true;
					}
				} else if (aDataApps[i].App === "CuentaCorriente") {
					if (oUser.NrSap === "" || oUser.BpSap === "") {
						aDataApps[i].canUseApp = false;
					} else {
						aDataApps[i].canUseApp = true;
					}
				}else if (aDataApps[i].App === "Facturas") {
					if (oUser.NrSap === "" || oUser.BpSap === "") {
						aDataApps[i].canUseApp = false;
					} else {
						aDataApps[i].canUseApp = true;
					}
				}else if (aDataApps[i].App === "FacturasView") {
					if (oUser.NrSap === "" || oUser.BpSap === "") {
						aDataApps[i].canUseApp = false;
					} else {
						aDataApps[i].canUseApp = true;
					}
				}
			}
			models.get(sModelMain).setProperty("/Apps", aDataApps);
			models.get(sModelMain).refresh();
			return aDataApps;
		},

		onSearchGlobal: function (objectData) {
			var aList = objectData.Model.getProperty(objectData.ListaDataBack);
			var aNewList = [];
			if (objectData.Query === "") {
				objectData.Model.setProperty(objectData.ListaData, aList);
				objectData.Model.setProperty(objectData.ListaDataCount, aList.length);
                objectData.Model.setProperty(objectData.ListaDataRealCount, aList.length);
				objectData.Model.refresh();
			} else {
				if (isNaN(objectData.Query)) {
					aNewList = aList.filter(nfilter => nfilter[objectData.Prop1].toUpperCase().match(objectData.Query.toUpperCase()));
				} else {
					aNewList = aList.filter(nfilter => nfilter[objectData.Prop2].match(Number(objectData.Query)));
				}
				objectData.Model.setProperty(objectData.ListaData, aNewList);
				objectData.Model.setProperty(objectData.ListaDataCount, aNewList.length);
				objectData.Model.refresh();
			}
		},
		onShowBusy: function () {
			var oContext = this;
			var oController = models.get("Model_ControllerMain").getProperty("/ControllerMain");
			models.load("Model_Busy", {
				"Title": oContext.getI18nText("MsgBusyTitle"), //
				"Text": oContext.getI18nText("CargaDatos") //
			});
			if (!oController._dialog) {
				oController._dialog = sap.ui.xmlfragment("simplot.portalsprd.view.fragment.BusyStatus", oController);
				oController.getView().addDependent(oController._dialog);
			}
			jQuery.sap.syncStyleClass("sapUiSizeCompact", oController.getView(), oController._dialog);
			oController._dialog.setModel(models.get("Model_Busy"));
			oController._dialog.open();
		},
		onChangeTextBusy: function (sText) {
			var oContext = this;
			var oController = models.get("Model_ControllerMain").getProperty("/ControllerMain");
			oController._dialog.getModel().setProperty("/Title", oContext.getI18nText("MsgBusyTitle")); //MsgBusyTitle
			oController._dialog.getModel().setProperty("/Text", sText);
			oController._dialog.getModel().refresh();
		},
		onCloseBusy: function () {
			var oController = models.get("Model_ControllerMain").getProperty("/ControllerMain");
			oController._dialog.close();
		},

		addOneDayDate: function (sDay, tDateValues) {
			var nDay = 1;
			if (sDay === "" || Number(sDay) === 0) {
				nDay = 1;
			} else {
				nDay = Number(sDay) - 1;
			}
			var fechDate = new Date();
			var dias = nDay;// 1; // Número de días a agregar
			fechDate.setDate(fechDate.getDate() + dias);
			return fechDate;
		},
		addOneHourDate: function (sDay, sHour, tDateValues) {
			var nHour = 1;
			if (sDay === "" || Number(sDay) === 0 || sHour === "" || Number(sHour) === 0) {
				nHour = 1;
			} else {
				if (Number(sDay) > Number(sHour)) {
					nHour = 1;
				} else {
					nHour = Number(Number(sHour) / Number(sDay).toFixed(0));
				}
			}
			var hsDate = new Date();
			var horas = nHour; //1; // Número de días a agregar
			hsDate.setHours(hsDate.getHours() + horas);
			return hsDate;
		},

		getMsgError: function (oError, oContext) {
			if (oContext._dialog !== undefined) {
				oContext.onCloseBusy();
			}
			var sText = oError.toString();// "Reintente nuevamente";
			if (oError.statusCode !== undefined) {
				if ((oError.statusCode.toString() === "400") || (oError.statusCode.toString() === "404")) {
					if (oError.responseText !== undefined) {
						sText = JSON.parse(oError.responseText).error.message.value;
					} else {
						sText = JSON.parse(oError.body).error.message.value;
					}

				} else if (oError.statusCode.toString() === "504") {
					sText = "Error en Tiempo de Respuesta" //ErrTimeOut
				}
			}
			return sText;
		},

		formatterNum: function (nNumber, sMoneda) {
			var sLang = sap.ui.getCore().getConfiguration().getLanguage();
			var oLocale = new sap.ui.core.Locale(sLang);
			var oFormatOptions = {
				minIntegerDigits: 1,
				maxIntegerDigits: 13,
				minFractionDigits: 2,
				maxFractionDigits: 2
			};
			if ((nNumber !== undefined) && (nNumber !== null)) {
				nNumber = nNumber.toString().replace(",", ".");
			}

			var oFloatFormat = sap.ui.core.format.NumberFormat.getFloatInstance(oFormatOptions, oLocale);
			if (sMoneda !== undefined) {
				return oFloatFormat.format(nNumber) + " " + sMoneda;
			} else {
				return oFloatFormat.format(nNumber);
			}
		},

        liveNumberDecimal: function (oSource) {

			var sValue = oSource.getValue();
            
            var	sNumber;// = this.onReturnNumberDecimal(sValue, true);
            
            if(Intl.NumberFormat().resolvedOptions().locale.indexOf("es") >= 0 || Intl.NumberFormat().resolvedOptions().locale.indexOf("pt") >= 0){
                if(sValue.lastIndexOf(",") !== sValue.indexOf(",")){
                    sValue = sValue.replace(",", "");
                }
                sNumber = this.onReturnNumberDecimal(sValue, true);
            }else{
                if(sValue.lastIndexOf(".") !== sValue.indexOf(".")){
                    sValue = sValue.replace(".", "");
                }
                sNumber = this.onReturnNumberDecimal(sValue, false);                
            }
			
                // sValue.replace(/\,/, '.'),
			var	nNumber = Number(sNumber);
            var oFocusInfo = oSource.getFocusInfo();
            console.log("lengthVal");
            console.log(oSource.getValue().length);
			//oSource.setValue(sNumber.replace(/\./, ','));
            if(sValue === ""){}else{
                oSource.setValue(this.onReturnFormatNumber(nNumber,2));
                console.log("lengthonReturnFormatNumber");
                console.log(oSource.getValue().length)
                oSource.applyFocusInfo(oFocusInfo);
                if(sNumber === ""){}else{
                    if (!sNumber || isNaN(nNumber)) {
                        var sInvalidValue = sValue;
        
                        if (!sNumber) {
                            sValue = "0";
                            sInvalidValue = "vacio";
                        }
        
                        if (sValue.match(/[\-]{1,}/)) {
                            sValue = sValue.charAt(0) + sValue.substring(1).replace(/\-/g, '');
                        }
        
                        oSource.setValue(sValue.replace(/[^0-9\,\.\-]{1,}/g, ''));
                        sap.m.MessageToast.show("Solo se permiten Valores Numericos, " + sInvalidValue + " no una entra valida.");
                    }
                }
            }
            
			
		},

		formatDate: function (sDate, sType) {
			if (sDate !== undefined) {
				if (sDate !== "") {
					var sNewDate;
					if (sType === "Main") {
						sNewDate = sDate.slice(6, 8) + "/" + sDate.slice(4, 6) + "/" + sDate.slice(0, 4);
					}else if (sType === "FormatYYYY/MM/DD") {
						sNewDate = sDate.slice(0, 4) + "/" + sDate.slice(4, 6) + "/" + sDate.slice(6, 8);
					} else if (sType === "Update") {
						sNewDate = sDate.split("/")[2] + sDate.split("/")[1] + sDate.split("/")[0];
					} else if (sType === "show") {
						sNewDate = sDate.split("/")[0] + "/" + sDate.split("/")[1] + "/" + sDate.split("/")[2];
					} else if (sType === "hhmmss") {
						//sNewDate = sDate.slice(0,2) + ":" + sDate.slice(2,4) + ":" + sDate.slice(4,6);
						sNewDate = new Date(new Date(new Date(new Date().setHours(sDate.slice(0, 2))).setMinutes(sDate.slice(2, 4))).setSeconds(sDate.slice(4, 6)))

					} else if (sType === "GetHour") {
						sNewDate = sDate.slice(0, 2) + ":" + sDate.slice(2, 4) + ":" + sDate.slice(4, 6);

					} else if (sType === "GetDay") {
						sNewDate = this.getDay(sDate);
					} else if (sType === "GetDate") {
						var sMonth = this.getMes(sDate.getMonth());
						sNewDate = this.validChar(sDate.getDate()) + "/" + this.validChar(sMonth) + "/" + sDate.getFullYear();
					}else if (sType === "GetDateDD/MM/YYYY") {
						var sMonth = this.getMes(sDate.getMonth());
						sNewDate = this.validChar(sDate.getDate()) + "/" + this.validChar(sMonth) + "/" + sDate.getFullYear();
					} else if (sType === "GetDayChange") {
						sDate = new Date(sDate.split("/")[2] + "/" + sDate.split("/")[1] + "/" + sDate.split("/")[0]);
						sNewDate = this.getDay(sDate.getDay());
					} else if (sType === "GetTimer") {
						sNewDate = this.validChar(sDate.getHours().toString()) + this.validChar(sDate.getMinutes().toString()) +
							this.validChar(sDate.getSeconds().toString());
					} else if (sType === "FormatAAAAmmDD") {
						sNewDate = sDate.split("/")[2] + "/" + sDate.split("/")[1] + "/" + sDate.split("/")[0]
					}
					return sNewDate;
				}
			} else {
				sDate = "";
				return sNewDate;
			}
		},

		validChar: function (sTime) {
			if (sTime.toString().length === 1) {
				sTime = "0" + sTime;
			}
			return sTime
		},

		getMes: function (sMes) {
			var sMonth = sMes + 1;
			return sMonth;
		},

		getDay: function (sDay) {
			var sDate = "";
			if (sDay === 0) {
				sDate = "Domingo";
			} else if (sDay === 1) {
				sDate = "Lunes";
			} else if (sDay === 2) {
				sDate = "Martes";
			} else if (sDay === 3) {
				sDate = "Miercoles";
			} else if (sDay === 4) {
				sDate = "Jueves";
			} else if (sDay === 5) {
				sDate = "Viernes";
			} else if (sDay === 6) {
				sDate = "Sabado";
			}
			return sDate;
		},

        getCombosFacturas: function(){
			var oContext = this;
            var aTipoFactura = [{key: "FC", value: oContext.getI18nText("Factura")}, 
                {key: "NC", value: oContext.getI18nText("NotaCredito")}, 
				{key: "ND", value: oContext.getI18nText("NotaDebito")},
                {key: "EX", value: oContext.getI18nText("DocumentoExterior")}
            ];
            var aCircuito = [{key: "1", value: "Compras"}, 
                {key: "2", value: "Gastos de Importacion"},
                {key: "3", value: "Póliza"}
            ];
            var aModo = [{key: "E", value: "CAE"}, {key: "I", value: "CAI"}, {key: "A", value: "CAEA"}];
            var aMoneda = [
                {key: "ARS", value: "Peso Argentino",opciones:"ARS||PES" }, 
                {key: "USD", value: "Dólar",opciones:"USD||DOL" },
                {key: "EUR", value: "Euro",opciones:"EUR" }, 
                {key: "CLP", value: "Peso Chileno",opciones:"CLP"  },
                {key: "BRL", value: "Real",opciones:"BRL"  }
            ];
                     
            var aKeysIIBB = [
                {key:"PercGanancias", value: "Percepción Ganancias", opciones:"Ganancias"},
                {key:"PercIVA", value: "Percepción IVA", opciones:"Percepcion IVA"},
                {key:"PercIbAduana", value: "Percepciones IIBB Aduana", opciones:"Aduana"},
                {key: "PercIbCABA", value: "Percepción IIBB CABA", opciones:"CABA||Capital||Capital Federal"},
                {key:"PercIbBsAs", value: "Percepción IIBB Bs As", opciones:"Buenos Aires||BS. AS.||Bs.As.||Bs As||II.BB.Buenos Aires||"},
                {key:"PercIbCatamarca", value: "Percepción IIBB Catama", opciones:"Catamarca||II.BB.Catamarca"},
                {key:"PercIbChaco", value: "Percepción IIBB Chaco", opciones:"Chaco"},
                {key:"PercIbChubut", value: "Percepción IIBB Chubut", opciones:"Chubut"},
                {key:"PercIbCordoba", value: "Percepción IIBB Cordoba", opciones:"Córdoba||Cba||Cordoba"},
                {key:"PercIbCorrientes", value: "Percepción IIBB Corrientes", opciones:"Corrientes"},
                {key:"PercIbEntreRios", value: "Percepción IIBB Entre Rios", opciones:"Entre Ríos||Entre Rios"},
                {key:"PercIbFormosa", value: "Percepción IIBB Formosa", opciones:"Formosa"},
                {key:"PercIbJujuy", value: "Percepción IIBB Jujuy", opciones:"Jujuy"},
                {key:"PercIbLaPampa", value: "Percepción IIBB La Pampa", opciones:"La Pampa"},
                {key:"PercIbLaRioja", value: "Percepción IIBB La Rioja", opciones:"La Rioja"},
                {key:"PercIbMendoza", value: "Percepción IIBB Mendoza", opciones:"Mendoza"},
                {key:"PercIbMisiones", value: "Percepción IIBB Misiones", opciones:"Misiones"},
                {key:"PercIbNeuquen", value: "Percepción IIBB Neuquen", opciones:"Neuquén||Neuquen"},
                {key:"PercIbRioNegro", value: "Percepción IIBB Rio de Negro", opciones:"Río Negro||Rio Negro"},
                {key:"PercIbSalta", value: "Percepción IIBB Salta", opciones:"Salta||II.BB.Salta"}, 
                {key:"PercIbSanJuan", value: "Percepción IIBB San Juan", opciones:"San Juan"},
                {key:"PercIbSanLuis", value: "Percepción IIBB San Luis", opciones:"San Luis"},
                {key:"PercIbSantaCruz", value: "Percepción IIBB Santa Cruz", opciones:"Santa Cruz||Sta Cruz||Sta.Cruz||Sta. Cruz"},
                {key:"PercIbSantaFe", value: "Percepción IIBB Santa Fe", opciones:"Santa Fe||Sta. Fe||Sta.Fe||Sta Fe"},
                {key:"PercIbSgoEstero", value: "Percepción IIBB Sgo. Del Estero", opciones:"Santiago del Estero"},
                {key:"PercIbTierraFuego", value: "Percepción IIBB Tierra del Fuego", opciones:"Tierra del Fuego"},
                {key:"PercIbTucuman", value: "Percepción IIBB Tucuman", opciones:"Tucumán||Tuc||Tucuman||II.BB.Tucuman||Tuc."},
                {key:"PercImpIntTasasContrib", value: "Impuestos Internos / Tasas y contrib.", opciones:"Percepcion IVA"}
            ];       
            var aKeysIva = [
                {key: "IVA21", value:"IVA 21%", opciones:"21,000%||21.0%||21%||21,0%||21.00%||(21,0)%||21,00%||21%:"},
                {key: "IVA105", value:"IVA 10,5%", opciones:"10,5%||10.5%||10.5%:"},
                {key: "IVA27", value:"IVA 27%", opciones:"27,000%||27.0%||27%||27,0%||27.00%||(27,0)%||27,00%||27%:"},
                {key: "IVA0", value:"IVA 0% Exento ", opciones:"0,000%||0.0%||0%||0,0%||0.00%||(0,0)%||0,00%||0%:"}
            ];
            /*
            {key: "5%", opciones:"5,000%||5.0%||5%||5,0%||5.00%||(5,0)%||5,00%||5%:"},
                {key: "2,5%", opciones:"2,5%||2.5%||2.5%:"}
            */
           var aState  = [
               {key: "1", value:"Pendiente"},
               {key: "2", value:"Exportado"},
               {key: "3", value:"Rechazado"}
           ];
           
           var aComboIIBBFields = [
                {"FieldClave": "claveIIBB1", "FieldVal": "valorIIBB1"}, 
                {"FieldClave": "claveIIBB2", "FieldVal": "valorIIBB2"},
                {"FieldClave": "claveIIBB3", "FieldVal": "valorIIBB3"},
                {"FieldClave": "claveIIBB4", "FieldVal": "valorIIBB4"},
                {"FieldClave": "claveIIBB5", "FieldVal": "valorIIBB5"},
                {"FieldClave": "claveIIBB6", "FieldVal": "valorIIBB6"},
                {"FieldClave": "claveIIBB7", "FieldVal": "valorIIBB7"},
                {"FieldClave": "claveIIBB8", "FieldVal": "valorIIBB7"},
                {"FieldClave": "claveIIBB9", "FieldVal": "valorIIBB9"},
                {"FieldClave": "claveIIBB10", "FieldVal": "valorIIBB10"},
                {"FieldClave": "claveIIBB11", "FieldVal": "valorIIBB11"},
                {"FieldClave": "claveIIBB12", "FieldVal": "valorIIBB12"},
                {"FieldClave": "claveIIBB13", "FieldVal": "valorIIBB13"},
                {"FieldClave": "claveIIBB14", "FieldVal": "valorIIBB14"},
                {"FieldClave": "claveIIBB15", "FieldVal": "valorIIBB15"},
                {"FieldClave": "claveIIBB16", "FieldVal": "valorIIBB16"},
                {"FieldClave": "claveIIBB17", "FieldVal": "valorIIBB17"},
                {"FieldClave": "claveIIBB18", "FieldVal": "valorIIBB18"},
                {"FieldClave": "claveIIBB19", "FieldVal": "valorIIBB19"},
                {"FieldClave": "claveIIBB20", "FieldVal": "valorIIBB20"},
                {"FieldClave": "claveIIBB21", "FieldVal": "valorIIBB21"},
                {"FieldClave": "claveIIBB22", "FieldVal": "valorIIBB22"},
                {"FieldClave": "claveIIBB23", "FieldVal": "valorIIBB23"},
                {"FieldClave": "claveIIBB24", "FieldVal": "valorIIBB24"}  
            ];

            var aComboIVAFields = [
                {"FieldClave": "claveIVA1", "FieldVal": "valorIVA1"}, 
                {"FieldClave": "claveIVA2", "FieldVal": "valorIVA2"},
                {"FieldClave": "claveIVA3", "FieldVal": "valorIVA3"},
                {"FieldClave": "claveIVA4", "FieldVal": "valorIVA4"},
                {"FieldClave": "claveIVA5", "FieldVal": "valorIVA5"}
            ];
            var objSourcePDF = {"SourcePDF": "", "isVisibile": false};
            var objHeader = {nroFactura: "",nroPedido: "",cae:"",cliente:"",
                subtotal: "", total: "", moneda: "",tipoCambio: "", 
                fecha: "",fechaVto: "", subtotal2:"", impuestoInterno:"", condicionPago:"",
                descuentos:"", percepcionIva: "", percepcionGanancias:"", NotaProveedor:""
            };
            var objAllCombos = {
                "comboTipoFactura": {"rowTemplate": aTipoFactura, "selectKey":""}, 
                "comboSubtipoFactura": {"rowTemplate": [], "rowTemplateBack": [], "selectKey":""}, 
                "comboCircuito": {"rowTemplate": aCircuito, "selectKey":""}, 
                "comboMoneda": {"rowTemplate": aMoneda, "selectKey":""}, 
                "comboModo": {"rowTemplate": aModo, "selectKey":""},
                "comboSociedad": {"rowTemplate": [], "selectKey":""},
                "iibbItemsFields": aComboIIBBFields,
                "ivaItemsFields": aComboIVAFields,
                "ComboIIBB":  aKeysIIBB,
                "ComboIVA": aKeysIva,     
            };
            var aCombos = {
                AllCombos: objAllCombos,
                Header: objHeader,
                TipoFactura: aTipoFactura,
                Circuito: aCircuito,
                Modo: aModo,
                Moneda: aMoneda,
                KeysIIBB: aKeysIIBB,
                KeysIva: aKeysIva,
                State: aState,
                ComboIIBBFields: aComboIIBBFields,
                ComboIVAFields: aComboIVAFields,
                ObjectoSourcePDF : objSourcePDF
            };
            return aCombos;
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

        onReturnFormatNumber: function(nNumber, nMinDecimal){
            if(nMinDecimal === null || nMinDecimal === undefined){
                nMinDecimal = 2;
            }
            var sLanguageRegion = Intl.NumberFormat().resolvedOptions().locale; //'en-EN';//  
            return nNumber.toLocaleString(sLanguageRegion, {minimumFractionDigits: nMinDecimal});
        },

        onReturnNumberDecimal: function(sNumber, isPoint){
            if(isPoint){
                sNumber= sNumber.replaceAll(".", "").replace(/[^0-9 . ,]/g, '').replace(",", ".");
            }else{
                sNumber= sNumber.replaceAll(",", "").replace(/[^0-9 . ,]/g, '');
            }
            return sNumber;            
        },

		liveNumberDecimal2: function (sValue/*oEvent*/) {
			var sNewValue;
			//var oSource = oEvent.getSource();
			//var sValue = oSource.getValue();
            
            var	sNumber;// = this.onReturnNumberDecimal(sValue, true);
            
            if(Intl.NumberFormat().resolvedOptions().locale.indexOf("es") >= 0 || Intl.NumberFormat().resolvedOptions().locale.indexOf("pt") >= 0){
                if(sValue.lastIndexOf(",") !== sValue.indexOf(",")){
                    sValue = sValue.replace(",", "");
                }
                sNumber = this.onReturnNumberDecimal(sValue, false);
            }else{
                if(sValue.lastIndexOf(".") !== sValue.indexOf(".")){
                    sValue = sValue.replace(".", "");
                }
                sNumber = this.onReturnNumberDecimal(sValue, true);                
            }
            
			var	nNumber = Number(sNumber);
            //var oFocusInfo = oSource.getFocusInfo();
            console.log("lengthVal");
            //console.log(oSource.getValue().length);
            
            if(sValue === ""){}else{
                //oSource.setValue(this.onReturnFormatNumber(nNumber,2));
                sNewValue = this.onReturnFormatNumber(nNumber,2);
                console.log("lengthonReturnFormatNumber");
                //console.log(oSource.getValue().length)
                //oSource.applyFocusInfo(oFocusInfo);
                if(sNumber === ""){}else{
                    if (!sNumber || isNaN(nNumber)) {
                        var sInvalidValue = sValue;
        
                        if (!sNumber) {
                            sValue = "0";
                            sInvalidValue = "vacio";
                        }
        
                        if (sValue.match(/[\-]{1,}/)) {
                            sValue = sValue.charAt(0) + sValue.substring(1).replace(/\-/g, '');
                        }
        
                        //oSource.setValue(sValue.replace(/[^0-9\,\.\-]{1,}/g, ''));
                        sNewValue = sValue.replace(/[^0-9\,\.\-]{1,}/g, '');
                        sap.m.MessageToast.show("Solo se permiten Valores Numericos, " + sInvalidValue + " no una entra valida.");
                    }
                }
            }
            return sNewValue;
		},

        onReturnFormatToSend: function(sNumber, isBoolPoint){
            if(isBoolPoint === undefined || isBoolPoint === null){
                isBoolPoint = true;
            }
            if(isBoolPoint){
                sNumber = sNumber.replaceAll(".", "").replace(",", ".");
                sNumber = Number(sNumber).toFixed(2);
            }else{
                sNumber = sNumber.replaceAll(",", "");
                sNumber = Number(sNumber).toFixed(2);
            }
            
            return sNumber;
        },

        onCheckPointDecimal:function(sValue){
            var boolDecimal = true;
            if(sValue.lastIndexOf(",") > sValue.lastIndexOf(".")){
                boolDecimal = true;
            }else{
                boolDecimal = false;
            }
            return boolDecimal;
        },

        f_Inputs: function (inputs) {
			var that = this;
			if (inputs == undefined)
				return true;

			jQuery.each(inputs, function (i, input) {
				input.setValueState("None");
			});
			jQuery.each(inputs, function (i, input) {
				// Hacer VALIDACION para _todo INPUT que esté HABILITADO
				if (input.getEnabled() == true) {
					var sType = input.getMetadata().getName();
					switch (sType) {
					case "sap.m.ComboBox":
					case "sap.m.Select":
						if (input.getSelectedKey() == "" || input.getSelectedKey() == "DUM") {
							input.setValueState("Error");
						}
						break;
					case "sap.m.Input":
						if (input.getType() == "Email") {
							// Validamos el Email.
							if (input.getValue() == "") {
								input.setValueState("Error");
							} else {
								var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
								if (!mailregex.test(input.getValue())) {
									that.f_showMessage("WARNING", oInicioController.getResourceBundle().getText("Invalid-Email"));
									input.setValueState("Error");
								} else input.setValueState("None");
							}
						} else if (input.getValue() == "")
							input.setValueState("Error");

						break;
					case "sap.m.RadioButtonGroup":
						if (input.getSelectedIndex() == -1) {
							input.setValueState("Error");
						}
						break;
					default:
						if (!input.getValue()) {
							input.setValueState("Error");
						}
						break;
					}
				}
			});
			// verificar estado de entradas
			var canContinue = true;
			jQuery.each(inputs, function (i, input) {
				if ("Error" === input.getValueState()) {
					canContinue = false;
				}
			});
			//resultados de salidas
			if (canContinue) {
				return true;
			} else {
				return false;
			}
		},

		f_FElements: function (elements) {
			var that = this;
			var result = false;
			var oInputs = [];
			var oRequired;
			// Valida el Atributo 'required': sólo aquellos controles cuyo campo de entrada es requerido
			for (var i = 0; i < elements.length; i++) {
				oRequired = elements[i].getLabelControl().getRequired();
				for (var j = 0; j < elements[i].getFields().length; j++) {
					if (elements[i].getFields()[j].getMetadata().getName() != "sap.m.Label") {
						if (elements[i].getFields()[j].getMetadata().getName() == "sap.m.FlexBox") {
							for (var k = 0; k < elements[i].getFields()[j].getItems().length; k++) {
								if (elements[i].getFields()[j].getItems()[k].getMetadata().getName() != "sap.m.Label" && elements[i].getFields()[j].getItems()[
										k].getMetadata().getName() != "sap.m.Text") {
									if (oRequired == true) oInputs.push(elements[i].getFields()[j].getItems()[k]);
								}
							}
						} else {
							if (oRequired == true) oInputs.push(elements[i].getFields()[j]);
						}

					}

				}

			}

			result = that.f_Inputs(oInputs);

			setTimeout(function () {
				that.f_setStateNoneInputs(oInputs);
			}, 6000);

			return result;
		},

		f_setStateNoneInputs: function (inputs) {
			var that = this;
			if (inputs == undefined)
				return true;

			jQuery.each(inputs, function (i, input) {
				if (input != undefined)
					input.setValueState("None");
			});
		}

	};
});