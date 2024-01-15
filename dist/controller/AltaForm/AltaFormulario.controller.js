sap.ui.define(["simplot/portalsprd/controller/BaseController","simplot/portalsprd/utils/models","simplot/portalsprd/utils/gateway","sap/ui/core/BusyIndicator","simplot/portalsprd/utils/modelHelper","simplot/portalsprd/utils/FileReaderHelp","simplot/portalsprd/utils/Common","simplot/portalsprd/utils/controller/CommonAltaForm"],function(e,a,o,r,t,i,n,s){"use strict";var l="AUTOGESTION";var d="Model_MainAltaForm";return e.extend("simplot.portalsprd.controller.AltaForm.AltaFormulario",{onInit:function(){},onAfterRendering:function(){this._onObjectMatched()},_onObjectMatched:function(){this.getView().setModel(a.get(d))},onFileUpload:function(e){var a=e.getParameter("files")[0];var o=this;if(a){var r=a;i.readBinaryString(r,jQuery.proxy(this.onFileLoadedRecursive,this,a))}},onFileLoadedRecursive:function(e,a){var o=e.name;var r={id:1,SupplierCode:o,B64File:a}},onValidFieldRequired:function(e,a,o){var r={Required:true,Mensaje:""};var t="";var i=n.getI18nText("CamposObligatorios");var s=n.getI18nText("ArchivosObligatorios");for(var l in e){if(e[l]===""&&a[l].Requerido===true){r.Required=false;t=i;break}}for(var d in o){if(o[d].IsLoad===false&&o[d].Obliga===true){r.Required=false;if(t===""){t=s}else{t=t+"\n"+s}break}}r.Mensaje=t;return r},onSave:function(){this.onSendDatosBasicos("Grabar")},onRequest:function(){this.onSendDatosBasicos("Enviar")},onSendDatosBasicos:function(e){var o="A";var r=a.get("Model_User").getProperty("/DataUser/BpPortal");var t=a.get(d).getProperty("/MaestroProveedores/Estado/Id");var i=a.get(d).getProperty("/MaestroProveedores/Operacion/Id");var s="X";var l="";if(e==="Grabar"){s="X";l=n.getI18nText("InfoSave")}else{if(t==="3"){o="M"}if(t==="0"&&i==="M"){o="M"}s="";l=n.getI18nText("InfoSend")}var c=a.get(d).getProperty("/MaestroProveedores/DatosBasicos");var v=a.get(d).getProperty("/MaestroProveedores/Direccion");var p=a.get(d).getProperty("/MaestroProveedores/DatosBanco");var u=a.get(d).getProperty("/MaestroProveedores/Impuesto");var f=a.get(d).getProperty("/MaestroProveedores/Archivos");var g={Nombre:c.Nombre.Texto,Telefono:c.Telefono.Texto,Nif:c.CUIT.Texto,Mail:c.Mail.Texto,Fechainiact:n.formatDate(c.InicioAct.Texto,"Update"),Calle:v.Calle.Texto,Nrocalle:v.Nrocalle.Texto,Cp:v.CP.Texto,Ciudad:v.Ciudad.Texto,Provincia:v.Provincia.Texto,Pais:v.Pais.Texto,Ctabancaria:p.CtaBancaria.Texto,Cbu:p.CBU.Texto,Banco:p.Banco.Texto,Iva:u.Iva.Texto,Iga:u.Iga.Texto,Iibb:u.Iibb.Texto,IvBpPortal:r,IvOperacion:o,IvPendiente:s,IvTipoBp:"P",Idioma:"S"};var b={Nombre:c.Nombre.Validar,Telefono:c.Telefono.Validar,Nif:c.CUIT.Validar,Mail:c.Mail.Validar,Fechainiact:c.InicioAct.Validar,Calle:v.Calle.Validar,Nrocalle:v.Nrocalle.Validar,Cp:v.CP.Validar,Ciudad:v.Ciudad.Validar,Provincia:v.Provincia.Validar,Pais:v.Pais.Validar,Ctabancaria:p.CtaBancaria.Validar,Cbu:p.CBU.Validar,Banco:p.Banco.Validar,Iva:u.Iva.Validar,Iga:u.Iga.Validar,Iibb:u.Iibb.Validar,IvBpPortal:true,IvOperacion:true,IvPendiente:true,IvTipoBp:true,Idioma:true};if(e==="Enviar"){var I=this.onValidFieldRequired(g,b,f);if(I.Required){this.onSaveGral(g,l)}else{sap.m.MessageBox.error(I.Mensaje)}}else{this.onSaveGral(g,l)}},onSaveGral:function(e,a){var r=this;var t="/CargaBasicoSet";o.create(l,t,e).then(function(e){console.log(e);if(e.EvTipo==="E"){sap.m.MessageBox.error(e.EvMensaje)}else{s.onGetDataPartner();r.onShowMessage(a)}}).catch(function(e){console.log(e)})},onShowMessage:function(e){var a=this;sap.m.MessageBox.show(e,{icon:sap.m.MessageBox.Icon.SUCCESS,title:n.getI18nText("Exito"),actions:[sap.m.MessageBox.Action.OK],onClose:function(e){if(e===sap.m.MessageBox.Action.OK){a.onNavBack()}else{}}})},onPressEditAlta:function(e){var o={boolHabilitado:true,boolBtnSave:false,boolBtnSend:true,boolBtnModifica:true,boolBtnCancel:false};a.get(d).setProperty("/MaestroProveedores/Habilitado",o);s.onEnableFields(true);a.get(d).refresh()},onPressCancelAlta:function(e){var o={boolHabilitado:false,boolBtnSave:false,boolBtnSend:false,boolBtnModifica:true,boolBtnCancel:false};a.get(d).setProperty("/MaestroProveedores/Habilitado",o);s.onEnableFields(false);a.get(d).refresh()},onNavBack:function(e){this.getOwnerComponent().getTargets().display("TargetMain")}})});