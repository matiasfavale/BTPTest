sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "simplot/portalsprd/controller/BaseController",
    "simplot/portalsprd/utils/controller/CommonClaims"
], function (JSONModel, Controller, CommonClaims) {
    "use strict";
    return Controller.extend("simplot.portalsprd.controller.Claim.InformationBlock", {
        /* =========================================================== */
        /* Lifecycle events                                            */
        /* =========================================================== */
        onInit: function () {
            CommonClaims.getReasons().then(reasons => {
                this.setModel(new JSONModel({
                    Reasons: reasons
                }), "matchcodes");
            });
            //this._initRichTextEditor();
        },

        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */

        /* =========================================================== */
        /* Private Methods                                             */
        /* =========================================================== */
        _initRichTextEditor: function () {
            var that = this;
            sap.ui.require(["sap/ui/richtexteditor/RichTextEditor"], function (RTE) {
                that.oRichTextEditor = new RTE("myRTE", {
                    width: "100%",
                    customToolbar: false,
                    showGroupFont: false,
                    showGroupFontStyle: false,
                    showGroupLink: false,
                    showGroupInsert: false,
                    showGroupClipboard: false,
                    showGroupTextAlign: false,
                    showGroupStructure: false,
                    value: "{IvCuerpo}"
                });
                that.oRichTextEditor.addStyleClass("sapUiSmallMarginBeginEnd");

                that.getView().byId("informationVBox").addItem(that.oRichTextEditor);
            });
        }
    });
});