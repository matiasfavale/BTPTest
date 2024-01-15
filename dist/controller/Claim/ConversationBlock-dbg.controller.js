sap.ui.define([
    "simplot/portalsprd/controller/BaseController",
    "simplot/portalsprd/model/Claim/formatter"
], function (Controller, formatter) {
    "use strict";
    return Controller.extend("simplot.portalsprd.controller.Claim.ConversationBlock", {
        formatter: formatter,
        /* =========================================================== */
        /* Lifecycle events                                            */
        /* =========================================================== */
        onInit: function () {
        }

        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */

        /* =========================================================== */
        /* Private Methods                                             */
        /* =========================================================== */
    });
});