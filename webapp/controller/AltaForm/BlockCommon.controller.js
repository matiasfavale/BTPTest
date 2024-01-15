sap.ui.define([
	"simplot/portalsprd/utils/FileReaderHelp",
	"simplot/portalsprd/utils/models",
	"simplot/portalsprd/utils/gateway"
], function (FileReaderHelp, models, gateway) {
	'use strict';
	var sModelMainAlta = "Model_MainAltaForm";
	//var sBpPortal = "0000000002";
	var sService = "AUTOGESTION";// "AUTOGESTION"; "TESTODATA"; 
	var modelsHelp = sap.ui.require("simplot/portalsprd/utils/models");
	var gatewayHelp = sap.ui.require("simplot/portalsprd/utils/gateway");
	var fileDownloadHelp = sap.ui.require("simplot/portalsprd/utils/FileDownHelp");
	var commonHelp = sap.ui.require("simplot/portalsprd/utils/Common");
	var commonHelpAuto = sap.ui.require("simplot/portalsprd/utils/controller/CommonAltaForm");
	jQuery.sap.declare({ modName: "simplot.portalsprd.controller.AltaForm.BlockCommon", "type": "controller" });

	sap.ui.core.mvc.Controller.extend("simplot.portalsprd.controller.AltaForm.BlockCommon", {
		handlePress: function () {
			var sNewMode = this.oParentBlock.getMode() == sap.uxap.ObjectPageSubSectionMode.Collapsed ? sap.uxap.ObjectPageSubSectionMode.Expanded : sap.uxap.ObjectPageSubSectionMode.Collapsed;
			this.oParentBlock.setMode(sNewMode);
		},

		onPressDownFile: function (oEvent) {
			var sBpPortal = modelsHelp.get("Model_User").getProperty("/DataUser/BpPortal");
			var sPath = oEvent.getSource().getBindingContext().sPath;
			var rowSelect = oEvent.getSource().getModel().getProperty(sPath);
			var sCode = rowSelect.Codigo;
			var sEntity = "/ObtenerAdjSet(IvBpPortal='" + sBpPortal + "',IvCodAdj='" + sCode + "',IvTipoBp='P')";
			/*var oProperty = {IvBpPortal: sBpPortal, IvCodAdj: rowSelect.Codigo,IvTipoBp: "P"};
			gatewayHelp.create(sService, sEntity , oProperty)
			.then(function(oRecive, oStats) {
			*/
			commonHelp.onDownloadArchivo(sEntity);
		},

		onPressUpFile: function (oEvent) {
			var sPath = oEvent.getSource().getBindingContext().sPath;
			var rowSelect = oEvent.getSource().getModel().getProperty(sPath);
			var sBpPortal = modelsHelp.get("Model_User").getProperty("/DataUser/BpPortal");
			modelsHelp.load("Model_SendFile", {
				"File": {},
				"Vence": "",
				"SelectData": rowSelect
			});
			var oSendFileDialog,
				oDeferred = new jQuery.Deferred();

			var oContext = this;
			if (!this._ControllerSendFile) {
				this._ControllerSendFile = {
					"deferred": null,
					"onSendFile": function (oEvent) {
						var oProperty = oEvent.getSource().getModel().getProperty("/File");
						var sDate = oEvent.getSource().getModel().getProperty("/Vence");
						if (sDate === "") {
							sap.m.MessageBox.error(commonHelp.getI18nText("FechaValid"));
						} else if (oProperty.IvContenido === undefined) {
							sap.m.MessageBox.error(commonHelp.getI18nText("ArchivoValid"));
						} else {

							sDate = commonHelp.formatDate(sDate, "Update");
							oProperty.IvVencimiento = sDate;
							var sEntity = "/GuardarAdjSet";

							gatewayHelp.create(sService, sEntity, oProperty)
								.then(function (oRecive, oStats) {
									console.log(oRecive);
									if (oRecive.EvTipo === "E") {
										sap.m.MessageBox.error(oRecive.EvMensaje);
									} else {
										sap.ui.getCore().byId("myFileUpload").clear();
										commonHelpAuto.onGetDataPartnerAdj("Load");
										sap.m.MessageBox.success(oRecive.EvMensaje);
									}

								})
								.catch(function (oError) {
									sap.m.MessageBox.error(commonHelp.getI18nText("ErrorAdjunto"));
									sap.ui.getCore().byId("myFileUpload").clear();
									console.log(oError);
								});
							oSendFileDialog.close();
						}
					},

					"onFileUpload": function (oEvent) {
						var fileReaderHelp = sap.ui.require("simplot/portalsprd/utils/FileReaderHelp");
						var oFile = oEvent.getParameter("files")[0];
						if (oFile) {
							var file = oFile;
							fileReaderHelp.readBinaryString(file, jQuery.proxy(this.onFileLoadedRecursive, this, oFile));
						}
					},
					"onFileLoadedRecursive": function (oFile, binaryString) {
						var sName = oFile.name;
						var sCodAdj = modelsHelp.get("Model_SendFile").getProperty("/SelectData").Codigo;
						var oProperty = {
							IvBpPortal: sBpPortal, IvCodAdj: sCodAdj, IvContenido: binaryString, IvNombreArch: sName,
							IvTipoBp: "P", IvVencimiento: "20220101"
						};
						modelsHelp.get("Model_SendFile").setProperty("/File", oProperty);
					},

					"onPressCancel": function () {
						sap.ui.getCore().byId("myFileUpload").clear();
						oSendFileDialog.close();
					}
				};
			}
			this._ControllerSendFile.deferred = oDeferred;

			if (!this._DialogSendFile) {
				this._DialogSendFile = sap.ui.xmlfragment("simplot.portalsprd.view.fragment.SendFile", this._ControllerSendFile);
				if (this.getView()) this.getView().addAssociation(this._DialogSendFile);
			}
			oSendFileDialog = this._DialogSendFile;
			oSendFileDialog.setModel(modelsHelp.get("Model_SendFile"));
			this.getView().addDependent(oSendFileDialog);
			oSendFileDialog.open();
		},


		onUploadComplete: function (oEvent) {
			var oFileUploader = this.getView().byId("fileUploader");
			oFileUploader.clear();
		},

		handleUploadComplete: function (oEvent) {
			console.log("lala");

		},

		onChangePais: function (oEvent) {
			console.log("lalachangecommonblock");
			var sCode = oEvent.getSource().getModel().getProperty("/MaestroProveedores/Direccion/Pais/Texto");
			commonHelp.onGetPcia(sCode, "");
		}

	});
}());