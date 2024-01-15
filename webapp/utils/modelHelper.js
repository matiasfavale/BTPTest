sap.ui.define([
	"simplot/portalsprd/utils/models",
	"simplot/portalsprd/utils/Common"
	//helpers
], function (models, Common) {
	"use strict";
	var sModelMain = "Model_Main";
    var sModelAlta = "Model_MainAltaForm";
    
	return {

        getCommon:function(){
            var commonHelp = sap.ui.require("simplot/portalsprd/utils/Common");
            return commonHelp;
        },
		
		
		getObjectJson: function(){
            
            var objBasico= {
                Nombre: {Texto:"", Validar:{Requerido:false,  Habilitado:false, IsModify:false}}, 
                Telefono: {Texto:"", Validar:{Requerido:false,  Habilitado:false, IsModify:false}}, 
                Mail: {Texto:"", Validar:{Requerido:false,  Habilitado:false, IsModify:false}}, 
                CUIT: {Texto:"", Validar:{Requerido:false,  Habilitado:false, IsModify:false}},
                //CatFiscal: {Texto:"",Validar:{Requerido:false,  Habilitado:false, IsModify:false}},
                InicioAct: {Texto:"", Validar:{Requerido:false,  Habilitado:false, IsModify:false}}
            };
			var objDireccion= {
                Calle: {Texto:"", Validar:{Requerido:false,  Habilitado:false, IsModify:false}},
                Ciudad: {Texto:"",  Validar:{Requerido:false,  Habilitado:false, IsModify:false}},
                CP: {Texto:"", Validar:{Requerido:false,  Habilitado:false, IsModify:false}}, 
                Pais: {Texto:"", Validar:{Requerido:false,  Habilitado:false, IsModify:false}}, 
                Idioma: {Texto:"", Validar:{Requerido:false,  Habilitado:false, IsModify:false}}, 
                Provincia: {Texto:"", Validar:{Requerido:false,  Habilitado:false, IsModify:false}}, 
                Nrocalle: {Texto:"", Validar:{Requerido:false,  Habilitado:false, IsModify:false}}
            };
			var objBanco = {
                Banco: {Texto:"", Validar:{Requerido:false,  Habilitado:false, IsModify:false}}, 
                CBU: {Texto:"", Validar:{Requerido:false,  Habilitado:false, IsModify:false}}, 
                CtaBancaria: {Texto:"", Validar:{Requerido:false,  Habilitado:false, IsModify:false}} 
				//PaisBanco: {Texto:"", Validar:{Requerido:false,  Habilitado:false, IsModify:false}}
            };
            var objImpuesto = {
                Iga: {Texto:"", Validar:{Requerido:false,  Habilitado:false, IsModify:false}}, 
                Iva: {Texto:"", Validar:{Requerido:false,  Habilitado:false, IsModify:false}}, 
                Iibb: {Texto:"", Validar:{Requerido:false,  Habilitado:false, IsModify:false}}
            };
			
			var objEstado = {
                Id: "",
                Descripcion: "", 
                State: "None"
            };
			var oJsonModel = {
				"Habilitado":true,
				"Estado": objEstado,
				"DatosBasicos": objBasico,
				"Direccion": objDireccion,  
				"DatosBanco":objBanco,
                "Impuesto":objImpuesto,
				"Archivos": [],
				"maxArchivos":0,
				
				"ReferenciaBankD":{
					"Banco": "",
					"Sucursal": "",
					"OfiCuenta": "",
					"CtaCte": "",
					"Telefono": "",
					"Fecha": ""
				},
				"CBU": {
					"Banco": "",
					"CBU": "",
					"TipoCuenta": ""
				},
				"Checks": [{"Value": "Constancia de inscrpcion AFIP", "FechaIni": "", "FechaFin": "" }, 
					{"Value": "Constancia de inscripcion IIBB", "FechaIni": "", "FechaFin": ""}, 
					{"Value": "CM05 Actualizado", "FechaIni": "", "FechaFin": ""}, 
					{"Value": "Certificado de no retencion/excension de impuestos (en caso de existir) ", "FechaIni": "", "FechaFin": ""},
					{"Value": "Inscripcion como agente de recaudacion IIBB (en caso de corresponder)", "FechaIni": "", "FechaFin": ""},
					{"Value": "Estatuto actualizado", "FechaIni": "", "FechaFin": ""},
					{"Value": "Ultimos 2 balances y/o ventas de los ultimos 2 años", "FechaIni": "", "FechaFin": ""},
					{"Value": "Actas de desingacion de autoridades y poderes de los firmantes", "FechaIni": "", "FechaFin": ""},
					{"Value": "Ultimos 2 formularios de cargas sociales pagas", "FechaIni": "", "FechaFin": ""}
				],
				
				"Cli1_RazonSocial": "",
				"Cli1_Contacto": "",
				"Cli1_Telefono": "",
				"Cli1_Email": "",
				"Cli2_RazonSocial": "",
				"Cli2_Contacto": "",
				"Cli2_Telefono": "",
				"Cli2_Email": "",
				"Cli3_RazonSocial": "",
				"Cli3_Contacto": "",
				"Cli3_Telefono": "",
				"Cli3_Email": "",
				"PersonaContacto": "",
				"Telefonocobro": "",
				"emailCobro": "",
				
				"Prestacion": "",
				
				"Prov1_RazonSocial": "",
				"Prov1_Contacto": "",
				"Prov1_Telefono": "",
				"Prov1_Email": "",
				"Prov2_RazonSocial": "",
				"Prov2_Contacto": "",
				"Prov2_Telefono": "",
				"Prov2_Email": "",
				"Prov3_RazonSocial": "",
				"Prov3_Contacto": "",
				"Prov3_Telefono": "",
				"Prov3_Email": ""				
			};			
			return oJsonModel;
		}
		
	};
});