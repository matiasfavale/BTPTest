sap.ui.define([
	"simplot/portalsprd/controller/BaseController",
	"simplot/portalsprd/utils/models",
	"simplot/portalsprd/utils/gateway",
	"sap/ui/core/BusyIndicator",
    "simplot/portalsprd/utils/modelHelper",
    "simplot/portalsprd/utils/FileReaderHelp",
    "simplot/portalsprd/utils/Common",
    "simplot/portalsprd/utils/controller/CommonAltaForm"
], function (Controller,  models, gateway, BusyIndicator,  modelHelper, FileReaderHelp,  Common,CommonAltaForm) {
	"use strict";
	var sService = "AUTOGESTION";
	var sModelMain = "Model_MainAltaForm";
	return Controller.extend("simplot.portalsprd.controller.AltaForm.AltaFormulario", {
		
		 onInit: function(){		
		},

        onAfterRendering: function(){
            this._onObjectMatched(); 			
		},

        _onObjectMatched: function() {
            this.getView().setModel(models.get(sModelMain));            
        },
		
		/******************* File Upload ****************/
        onFileUpload: function (oEvent) {
            var oFile = oEvent.getParameter("files")[0];
            var oContext = this;
            if (oFile) {
                var file = oFile;
                FileReaderHelp.readBinaryString(file, jQuery.proxy(this.onFileLoadedRecursive, this, oFile));
            }
        },
		onFileLoadedRecursive: function (oFile, binaryString) {
            var sName = oFile.name;
            var oDataFile = {
                id: 1,
                SupplierCode: sName,
                B64File: binaryString
            };
        },

        onValidFieldRequired:function(oProps,oPropsValid, aArchivos){
            var oBoolValid = {Required: true, Mensaje: ""};
            var sMsg = "";
            var sMsgField = Common.getI18nText("CamposObligatorios");
            var sMsgArch = Common.getI18nText("ArchivosObligatorios");
            for(var k in oProps){
                if(oProps[k] === "" && oPropsValid[k].Requerido === true){
                    oBoolValid.Required = false;
                    sMsg= sMsgField;   
                    break;
                }
            }
            for(var j in aArchivos){
                if(aArchivos[j].IsLoad === false && aArchivos[j].Obliga === true){
                    oBoolValid.Required = false;
                    if(sMsg === ""){
                        sMsg = sMsgArch;
                    }else{
                        sMsg = sMsg + "\n" + sMsgArch;
                    }
                    break
                }
            }
            oBoolValid.Mensaje = sMsg;
            return oBoolValid;
        },

        onSave:function(){
            this.onSendDatosBasicos("Grabar");
        },
        onRequest:function(){
            this.onSendDatosBasicos("Enviar");
        },
		
		onSendDatosBasicos: function(sEvento){
            var sIvOperacion = "A";
            var sBpPortal = models.get("Model_User").getProperty("/DataUser/BpPortal");
			var sEstadoBP = models.get(sModelMain).getProperty("/MaestroProveedores/Estado/Id");
            var sOperacionBP = models.get(sModelMain).getProperty("/MaestroProveedores/Operacion/Id");
			var sPendiente = "X";
			var sMsgText = "";
			if(sEvento === "Grabar"){
				sPendiente = "X";
				sMsgText = Common.getI18nText("InfoSave");
			}else{
                if(sEstadoBP === "3"){
                    sIvOperacion = "M";
                }
                if((sEstadoBP === "0") && (sOperacionBP === "M")){
                    sIvOperacion = "M";
                }
				sPendiente = "";
				sMsgText = Common.getI18nText("InfoSend");
			}
			
			var oDatosGral  = models.get(sModelMain).getProperty("/MaestroProveedores/DatosBasicos");
			var oDireccion  = models.get(sModelMain).getProperty("/MaestroProveedores/Direccion");
			var oDatosBank  = models.get(sModelMain).getProperty("/MaestroProveedores/DatosBanco");
            var oDatosImpuesto  = models.get(sModelMain).getProperty("/MaestroProveedores/Impuesto");
            var aDataArchivo = models.get(sModelMain).getProperty("/MaestroProveedores/Archivos");
			
            /*
                Paisbanco:oDatosBank.PaisBanco.Texto,
                Catfiscal: oDatosGral.CatFiscal.Texto,
            */
			var oProperty = {Nombre: oDatosGral.Nombre.Texto, Telefono: oDatosGral.Telefono.Texto, 
                Nif: oDatosGral.CUIT.Texto, Mail: oDatosGral.Mail.Texto, 
                Fechainiact: Common.formatDate(oDatosGral.InicioAct.Texto, "Update"),
				Calle: oDireccion.Calle.Texto, Nrocalle: oDireccion.Nrocalle.Texto, 
                Cp: oDireccion.CP.Texto, Ciudad: oDireccion.Ciudad.Texto, 
                Provincia: oDireccion.Provincia.Texto, Pais: oDireccion.Pais.Texto, 
				Ctabancaria: oDatosBank.CtaBancaria.Texto, Cbu: oDatosBank.CBU.Texto, 
                Banco: oDatosBank.Banco.Texto,  
                Iva: oDatosImpuesto.Iva.Texto, Iga: oDatosImpuesto.Iga.Texto, Iibb: oDatosImpuesto.Iibb.Texto,
				IvBpPortal:sBpPortal, IvOperacion: sIvOperacion, IvPendiente: sPendiente, IvTipoBp: "P",
				Idioma: "S"
			};

            /*
                Paisbanco:oDatosBank.PaisBanco.Validar,
                Catfiscal: oDatosGral.CatFiscal.Validar,
            */
            var oPropertyReqs = {Nombre: oDatosGral.Nombre.Validar, Telefono: oDatosGral.Telefono.Validar, 
                Nif: oDatosGral.CUIT.Validar, Mail: oDatosGral.Mail.Validar, 
                Fechainiact: oDatosGral.InicioAct.Validar,
				Calle: oDireccion.Calle.Validar, Nrocalle: oDireccion.Nrocalle.Validar, 
                Cp: oDireccion.CP.Validar, Ciudad: oDireccion.Ciudad.Validar, 
                Provincia: oDireccion.Provincia.Validar, Pais: oDireccion.Pais.Validar, 
				Ctabancaria: oDatosBank.CtaBancaria.Validar, Cbu: oDatosBank.CBU.Validar, 
                Banco: oDatosBank.Banco.Validar,  	 
                Iva: oDatosImpuesto.Iva.Validar, Iga: oDatosImpuesto.Iga.Validar, Iibb: oDatosImpuesto.Iibb.Validar,
				IvBpPortal:true, IvOperacion: true, IvPendiente: true, IvTipoBp: true,
				Idioma: true
			};
            if(sEvento === "Enviar"){
                var oBoolValid = this.onValidFieldRequired(oProperty, oPropertyReqs, aDataArchivo);
                if(oBoolValid.Required){
                    this.onSaveGral(oProperty, sMsgText);
                }else{
                    sap.m.MessageBox.error(oBoolValid.Mensaje);
                }
            }else{
                this.onSaveGral(oProperty, sMsgText);
            }
		},

        onSaveGral:function(oProperty, sMsgText){
            var oContext = this;
			var sEntity = "/CargaBasicoSet";
            gateway.create(sService, sEntity , oProperty)
            .then(function(oRecive) {
                console.log(oRecive);
                if(oRecive.EvTipo === "E"){
                    sap.m.MessageBox.error(oRecive.EvMensaje);
                }else{
                    CommonAltaForm.onGetDataPartner();
                    oContext.onShowMessage(sMsgText)
                    //sap.m.MessageBox.success(sMsgText);
                }
            })
            .catch(function(oError){
                console.log(oError);
            });
        },

        onShowMessage: function (sText) {
            var oContext = this;
			sap.m.MessageBox.show(sText, {
				"icon": sap.m.MessageBox.Icon.SUCCESS,
				"title": Common.getI18nText("Exito"),
				"actions": [
					sap.m.MessageBox.Action.OK
				],
				"onClose": function (vAction) {
					if (vAction === sap.m.MessageBox.Action.OK) {
                        oContext.onNavBack();
					} else {}
				}
			});
		},

        onPressEditAlta:function(oEvent){
            var oValid = {boolHabilitado:true, boolBtnSave:false, boolBtnSend:true,boolBtnModifica:true, boolBtnCancel:false};
            models.get(sModelMain).setProperty("/MaestroProveedores/Habilitado", oValid);
            CommonAltaForm.onEnableFields(true);
            models.get(sModelMain).refresh();
        },
        onPressCancelAlta:function(oEvent){
            var oValid = {boolHabilitado:false, boolBtnSave:false, boolBtnSend:false,boolBtnModifica:true, boolBtnCancel:false};
            models.get(sModelMain).setProperty("/MaestroProveedores/Habilitado", oValid);
            CommonAltaForm.onEnableFields(false);
            models.get(sModelMain).refresh();
        },

        onNavBack: function (oEvent) {
            //this.getRouter().navTo("main", {}, true);
			this.getOwnerComponent().getTargets().display("TargetMain");
		}
	});
});

