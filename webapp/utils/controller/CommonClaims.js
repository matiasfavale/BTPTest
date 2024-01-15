sap.ui.define([
    "simplot/portalsqas/utils/models",
    "simplot/portalsqas/utils/gateway"
    //helpers
], function (models, gateway) {
    "use strict";
    return {
        reasons: {},
        claims: {},
        getCommon: function () {
            var commonHelp = sap.ui.require("simplot/portalsqas/utils/Common");
            return commonHelp;
        },

        getServiceName: function () {
            return "claims"
        },

        getModelName: function () {
            return "Model_Claims";
        },

        getPriorities: function () {
            return [{
                id: "1",
                descripcion: this.getI18nText("claim.priority.low")
            }, {
                id: "2",
                descripcion: this.getI18nText("claim.priority.normal")
            }, {
                id: "3",
                descripcion: this.getI18nText("claim.priority.high")
            }]
        },

        getStatuses: function () {
            return [{
                id: "1",
                descripcion: this.getI18nText("claim.status.new")
            }, {
                id: "2",
                descripcion: this.getI18nText("claim.status.inProcess")
            }, {
                id: "3",
                descripcion: this.getI18nText("claim.status.closed")
            }]
        },

        setModelReasons: function (reasons) {
            this.getModelClaims().setProperty("/Reasons/Data", reasons);
            this.getModelClaims().setProperty("/Reasons/Count", Object.keys(reasons).length);
            this.getModelClaims().refresh();
            console.log(reasons);
        },

        getReasons: function (refresh = false) {
            let oPromise = null;
            if (refresh) {
                this.claims = {};
            }
            if (!Object.keys(this.reasons).length) {
                oPromise = this.loadReasons().then(reasons => {
                    this.setModelReasons(reasons);
                    return reasons;
                });
            } else {
                oPromise = Promise.resolve(this.reasons);
            }
            return oPromise;
        },

        loadReasons: function () {
            return gateway.read(this.getServiceName(), "/MotivosSet").then((oRecive) => {
                this.reasons = oRecive.results.reduce((x, data) => {
                    x[data.Motivo] = data;
                    return x;
                }, {});
                console.log(oRecive);
                return this.reasons;
            }).catch(function (oError) {
                console.log(oError);
            });
        },

        getI18nText: function (sId) {
            return models.get("i18n").getProperty(sId);
        },

        navToClaims: function (oTargets) {
            return this.getReasons().finally(() => {
                oTargets.display("claims");
            });
        },

        navToClaim: function (oTargets, sNrorec) {
            return this.loadClaim(sNrorec).then(() => {
                oTargets.display("claim", {
                    nrorec: sNrorec
                });
            });
        },

        setModelClaims: function (claims) {
            this.getModelClaims().setProperty("/Claims/Data", Object.values(claims));
            this.getModelClaims().setProperty("/Claims/Count", Object.keys(claims).length);
            this.getModelClaims().setProperty("/Claims/CountNew", Object.values(claims).filter(claim => claim.Estado === "1").length);
            this.getModelClaims().setProperty("/Claims/CountInProcess", Object.values(claims).filter(claim => claim.Estado === "2").length);
            this.getModelClaims().refresh();
            models.get("Model_ControllerMain").setProperty("/Reclamos/CountNew", Object.values(claims).filter(claim => claim.Estado === "1").length);
            models.get("Model_ControllerMain").setProperty("/Reclamos/CountInProcess", Object.values(claims).filter(claim => claim.Estado === "2").length);
            models.get("Model_ControllerMain").refresh();
            console.log(claims);
        },

        getClaimAttachment: function (claimNumber, fileName) {
            if (!claimNumber || !fileName) {
                return Promise.reject();
            }

            const sPath = "/" + models.get(this.getServiceName()).createKey("AdjuntoSet", {
                Nrorec: claimNumber,
                Archivo: fileName
            });

            return gateway.read(this.getServiceName(), sPath).then((oRecive) => {
                return oRecive;
            }).catch(function (oError) {
                console.log(oError);
            });
        },

        getClaims: function (filters, refresh = false) {
            let oPromise = null;
            if (refresh) {
                this.claims = {};
            }
            if (!Object.keys(this.claims).length) {
                oPromise = this.loadClaims();
            } else {
                oPromise = Promise.resolve(this.claims);
            }
            return oPromise.then((claims) => {
                this.setModelClaims(claims);
                return claims;
            });
        },

        loadClaims: function (filters) {
            filters = filters || [];
            return gateway.read(this.getServiceName(), "/ReclamoSet", { "filters": this.getDefaultFilters().concat(filters) }).then((oRecive) => {
                this.claims = oRecive.results.reduce((x, data) => {
                    x[data.Nrorec] = data;
                    return x;
                }, {});
                return this.claims;
            }).catch(function (oError) {
                console.log(oError);
            });
        },

        loadClaim: function (claimNumber) {
            return gateway.read(this.getServiceName(), `/ReclamoSet('${claimNumber}')`, { "urlParameters": { "$expand": "Posiciones,Adjuntos" } }).then((oRecive) => {
                return oRecive;
            }).catch(function (oError) {
                console.log(oError);
            });
        },

        getModelClaims: function () {
            if (!models.exists(this.getModelName())) {
                this.initModelClaims();
            }
            return models.get(this.getModelName());
        },

        initModelClaims: function () {
            models.load(this.getModelName(), {
                Claims: {
                    Data: {},
                    Count: 0,
                    CountNew: 0,
                    CountInProcess: 0
                },
                Reasons: {
                    Data: {},
                    Count: 0
                }
            });
        },

        getBpSap: function () {
            var oUserData = models.get("Model_User").getProperty("/DataUser");
            return this.zeroPad(oUserData.BpSap, 10);
        },

        getDefaultFilters: function () {
            return [new sap.ui.model.Filter("BpSap", "EQ", this.getBpSap())];
        },

        zeroPad: function (num, length) {
            const zero = length - num.toString().length + 1;
            return Array(+(zero > 0 && zero)).join("0") + num;
        }
    };
});