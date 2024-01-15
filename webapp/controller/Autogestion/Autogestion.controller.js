sap.ui.define([
	"simplot/portalsprd/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"simplot/portalsprd/utils/models",
    "simplot/portalsprd/utils/gateway",
	"sap/ui/core/BusyIndicator",
    "sap/viz/ui5/api/env/Format",
    "sap/ui/core/Fragment",
    "simplot/portalsprd/utils/DesktopMenu",
], function (Controller, JSONModel, models, gateway, BusyIndicator,  Format,Fragment, DesktopMenu) {
	"use strict";
	
	return Controller.extend("simplot.portalsprd.controller.Autogestion", {
		onInit: function() {
			console.log("init");
		},		
		
		i18nText: function(sId){
			return models.get("i18n").getProperty(sId);
		},
		
		onBeforeRendering: function(){
			console.log("onbefore");
		},
		
		onAfterRendering: function(){
			console.log("onafter");
			
			var oContext = this;
			models.load("Model_Main", {
				"rowsTab": [{Materiales: "", Cantidad: ""}],
				"rowsCount": 1,
				"MaterialInp": "",
				"MaestroProveedores": [{Titulo: "Empresa (3000)", Nombre1: "DEMO Proveedor", Nombre2: "Ltda.", PersJuridica: "SA (01)", Autor: "NSOUTO"}], 
				"DatosCli": {NombreEmpresa:{"Name": "Simplot"} },
				"CantidadInp": "",
				"MaterialesCollection": [{Name: "Garrafa 45", Code: "1", Price: "500", Tax: "87"}, 
					{Name:"Garrafa 10", Code: "2", Price: "300", Tax: "50"}, {Name:"Tanque", Code: "3", Price: "600", Tax: "90"}],
				"rowsDevTab": [{Materiales: "", Cantidad: ""}],
				"rowsDevCount": 1,
				"MaterialDevInp": "",
				"CantidadDevInp": "",
				"Total": "0",
				"rowsRecibo": [],
				"rowsResumen":[{Id: "Recibo 1", Material: "Garrafa 45", Cantidad: "2", MontoBase: "500", Impuestos: "87", Total: "587", Metodo:"Tarjeta de Credito"}],
				"rowsStock": [{Materiales: "Garrafa 10", StockIni: "15", Ventas: "-10", Ajuste:"-1", Devolucion: "", StockFin: "4"  },
					{Materiales: "Garrafa 45", StockIni: "10", Ventas: "-5", Ajuste:"", Devolucion: "", StockFin: "6"  },
					{Materiales: "Tanque", StockIni: "4", Ventas: "3", Ajuste:"", Devolucion: "", StockFin: "1"  }],
				"maxRowsStock": 3,
				"rowsValores": [{Ventas: "Cuenta Corriente", Ajuste: " $ 45.000,00 "}, {Ventas: "Efectivo", Ajuste: " $ 30.000,00 "},
					{Ventas: "Transferencia", Ajuste: " $ 10.000,00 "}, {Ventas: "Tarjeta de Credito", Ajuste: " $ 50.000,00 "},
					{Ventas: "Credito Cliente", Ajuste: " $ 15.000,00 "}, {Ventas: "", Ajuste: ""},
					{Ventas: "Saldo Financiero", Ajuste: " $"}],
				"maxRowsValores": 7,
				"visibleStockFin": false,
				"rowsStockFin": [{Ce: "4000", Alm: "4101", Denom: "Camion 1", Material:"300010", TextoBreve:"Garrafa 10kg", UMB:"c/u", Utilizacion:"4", Mon:"ARS", Valor:"3200"},
					{Ce: "4000", Alm: "4101", Denom: "Camion 1", Material:"300011", TextoBreve:"Garrafa 45kg", UMB:"c/u", Utilizacion:"6", Mon:"ARS", Valor:"6000"},
					{Ce: "4000", Alm: "4101", Denom: "Camion 1", Material:"300013", TextoBreve:"Tanque de 1/2 M3", UMB:"c/u", Utilizacion:"1", Mon:"ARS", Valor:"1500"}]
			});

			this.getView().setModel(models.get("Model_Main"));
			
		},
		
		onPressPDF: function(oEvent){
			if(models.get(mockup).getProperty(oEvent.getSource()._getBindingContext().sPath).File !== ""){
				var sFile = models.get(mockup).getProperty(oEvent.getSource()._getBindingContext().sPath).File;
				this.download(sFile, "", "File.pdf");
			}
			
		},
		download: function(base64code, contentType, docName) {
			try {
				this.saveData(this.btoBlob(atob(base64code), contentType), docName);
			} catch (ex) {
				console.log("Error al subir imagen");
			}
		},

		btoBlob: function(binary, contentType, sliceSize) {
			contentType = contentType || '';
			sliceSize = sliceSize || 512;
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

		saveData: function(blob, fileName) {
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
		}
		
		
		});
	}
);

