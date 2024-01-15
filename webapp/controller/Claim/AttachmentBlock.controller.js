sap.ui.define([
    "sap/m/library",
    "simplot/portalsprd/controller/BaseController",
    "simplot/portalsprd/model/Claim/formatter",
    "simplot/portalsprd/utils/FileDownHelp",
    "simplot/portalsprd/utils/controller/CommonClaims"
], function (MobileLibrary, Controller, formatter, FileDownHelp, CommonClaims) {
    "use strict";
    return Controller.extend("simplot.portalsprd.controller.Claim.AttachmentBlock", {
        formatter: formatter,

        /* =========================================================== */
        /* Lifecycle events                                            */
        /* =========================================================== */
        onInit: function () {
            this._oUploadSet = this.byId("UploadSet");
            this._oUploadSet.getList().setMode(MobileLibrary.ListMode.MultiSelect);
        },

        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */
        onDownloadAttachmentPress: function () {
            this._oUploadSet.getItems().forEach(function (oItem) {
                if (oItem.getListItem().getSelected()) {
                    let oObject = oItem.getBindingContext().getObject();
                    CommonClaims.getClaimAttachment(oObject.Nrorec, oObject.Archivo).then((data) => {
                        FileDownHelp.download(data.Contenido, "", data.Archivo);
                    });
                }
            });
        }
        /* =========================================================== */
        /* Private Methods                                             */
        /* =========================================================== */
    });
});