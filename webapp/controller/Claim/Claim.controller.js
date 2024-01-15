sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "simplot/portalsprd/controller/BaseController",
    "simplot/portalsprd/utils/controller/CommonClaims",
    "simplot/portalsprd/utils/FileReaderHelp"
], function (JSONModel, Controller, CommonClaims, FileReaderHelp) {
    "use strict";
    return Controller.extend("simplot.portalsprd.controller.Claim.Claim", {
        /* =========================================================== */
        /* Lifecycle events                                            */
        /* =========================================================== */
        onInit: function () {
            this._oTable = this.getView().byId("claims-table");
            CommonClaims.getReasons().then(reasons => {
                this.setModel(new JSONModel({
                    Reasons: reasons
                }), "matchcodes");
            });
            this.getView().setModel(this.getOwnerComponent().getModel(CommonClaims.getServiceName()));
            this.getRouter().getTarget("claim").attachDisplay(this._onObjectMatched, this);
        },

        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */
        onClaimSavePress: function () {
            this.getView().setBusy(true);
            if (this.getModel().hasPendingChanges() && (this.getView().getBindingContext().bCreated === undefined || !this.getView().getBindingContext().bCreated)) {
                this.getModel().setProperty(this.getView().getBindingContext().getPath() + "/AutorMod", "1");
                this.getModel().setProperty(this.getView().getBindingContext().getPath() + "/UsuarioMod", CommonClaims.getBpSap());
                this._saveClaim();
            } else {
                this._saveClaim().then(() => {
                    const oClaim = this.getView().getElementBinding().getBoundContext().getObject();
                    CommonClaims.navToClaim(this.getOwnerComponent().getTargets(), oClaim.Nrorec);
                });

            }
        },

        onClaimBackPress: function () {
            debugger;
            var sIdAttachment = this.byId("attachmentBlock").getId() + "-Collapsed";
            var aItems = sap.ui.getCore().byId(sIdAttachment + "--UploadSet").getItems();
            for(var i in aItems){
                if(aItems[i].getProperty("visibleEdit")){
                    sap.ui.getCore().byId(sIdAttachment + "--UploadSet").removeItem(aItems[i]);
                }
            }
            this.getModel().resetChanges(null, true);
            this.onNavBack();
        },

        onClaimClosePress: function () {
            const oClaim = this.getView().getBindingContext().getObject();
            sap.m.MessageBox.confirm(this.getResourceBundle().getText("claim.closeConfirm.message", [oClaim.Nrorec]), {
                onClose: this._onClaimCloseConfirmed.bind(this)
            });
        },

        onNavBack: function () {
            this.getOwnerComponent().getTargets().display("claims");
        },

        /* =========================================================== */
        /* Private Methods                                             */
        /* =========================================================== */
        _onObjectMatched: function (oEvent) {
            this.getModel().resetChanges(null, true);
            const data = oEvent.getParameter("data"),
                sEntryKey = this._getEntryKey(data);
            this._initModels();
            this._bindView(sEntryKey);
        },

        _initModels: function () {
            this.setModel(new JSONModel({
                Prioridades: CommonClaims.getPriorities()
            }), "matchcode");
            this.setModel(new JSONModel({
                isEditable: true,
                busy: false
            }), "viewModel");
        },

        _getEntryKey: function (data) {
            let sPath = null;
            if (data.nrorec) {
                // visualization
                sPath = "/" + this.getModel().createKey("ReclamoSet", {
                    Nrorec: data.nrorec
                });
            } else {
                // Creation
                const oEntry = this.getModel().createEntry("/ReclamoSet", { properties: { Nrorec: "0000000000", BpSap: CommonClaims.getBpSap(), Prioridad: "2" } });
                sPath = oEntry.getPath();
            }
            return sPath;
        },

        _onClaimCloseConfirmed: function (oAction) {
            if (oAction === sap.m.MessageBox.Action.OK) {
                this.getView().setBusy(true);
                const sPath = this.getView().getBindingContext().getPath();
                this.getModel().setProperty(sPath + "/Estado", "3");
                this.getModel().setProperty(sPath + "/AutorMod", "2");
                this.getModel().setProperty(sPath + "/UsuarioMod", CommonClaims.getBpSap());
                this._saveClaim();
            }
        },

        _uploadFiles: function (aFiles) {
            const claim = this.getView().getBindingContext().getObject();
            return Promise.all(aFiles.map((file, index) => {
                return FileReaderHelp.readBinaryStringPromise(file).then(binaryString => {
                    const oEntry = this.getModel().createEntry("/AdjuntoSet", { changeSetId: `changeSet-${index}`, properties: { Nrorec: claim.Nrorec, Contenido: binaryString, Archivo: file.name, Autor: "1" } });
                    return oEntry;
                });
            })).then((response) => {
                debugger;
                return this._submitChanges();
            }).catch((error) => {
                debugger;
                this.getMessageDialog().addResponse(error);
            }).finally(() => {
                this.getView().setBusy(false);
            });
        },

        _saveClaim: function () {
            debugger;
            var sIdAttachment = this.byId("attachmentBlock").getId() + "-Collapsed";
            var uploadSet = sap.ui.getCore().byId(sIdAttachment + "--UploadSet");
                var aItems = uploadSet.getItems();
                var aNewItems =  aItems.filter(nfilter=>nfilter.getProperty("visibleEdit") === true); //uploadSet.getIncompleteItems()
            return this._submitChanges().then((response) => {
                this.getMessageDialog().addResponse(response);
                
                debugger;
                return this._uploadFiles(aNewItems.map(item => item.getFileObject())).then(() => {
                    
                    for(var i in aNewItems){
                        sap.ui.getCore().byId(sIdAttachment + "--UploadSet").removeItem(aNewItems[i]);
                    }
                    //uploadSet.removeAllIncompleteItems();
                }).then(() => {
                    sap.m.MessageToast.show(this.getResourceBundle().getText("claim.message.crudSuccefully"));
                });
            }).catch((error) => {
                this.getMessageDialog().addResponse(error);
            }).finally(() => {
                this.getView().setBusy(false);
            });
        },

        _submitChanges: function () {
            return new Promise(function (resolve, reject) {
                this.getModel().submitChanges({
                    success: function (data, response) {
                        resolve(response);
                    },
                    error: reject
                });
            }.bind(this));
        },

        /**
         * Binds the view to the object path.
         * @function
         * @param {string} sObjectPath path to the object to be bound
         * @private
         */
        _bindView: function (sObjectPath) {
            var oViewModel = this.getModel("viewModel"),
                oDataModel = this.getModel();

            this.getView().bindElement({
                path: sObjectPath,
                parameters: {
                    expand: "Posiciones,Adjuntos"
                },
                events: {
                    change: this._onBindingChange.bind(this),
                    dataRequested: function () {
                        oDataModel.metadataLoaded().then(function () {
                            oViewModel.setProperty("/busy", true);
                        });
                    },
                    dataReceived: function () {
                        oViewModel.setProperty("/busy", false);
                    }.bind(this)
                }
            });
        },

        _onBindingChange: function () {
            var oView = this.getView(),
                oViewModel = this.getModel("viewModel"),
                oElementBinding = oView.getElementBinding();

            // No data for the binding
            if (!oElementBinding.getBoundContext()) {
                this.getRouter().getTargets().display("objectNotFound");
                return;
            }
            oViewModel.setProperty("/busy", false);
        }
    });
});