sap.ui.define([
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "simplot/portalsprd/controller/BaseController",
    "simplot/portalsprd/model/Claim/formatter",
    "simplot/portalsprd/utils/controller/CommonClaims"
], function (Filter, FilterOperator, JSONModel, Controller, formatter, CommonClaims) {
    "use strict";
    return Controller.extend("simplot.portalsprd.controller.Claim.Claims", {
        CommonClaims: CommonClaims,
        formatter: formatter,
        /* =========================================================== */
        /* Lifecycle events                                            */
        /* =========================================================== */
        onInit: function () {
            this._oTable = this.getView().byId("claims-table");
            //this._onObjectMatched(); 
            this.setModel(new JSONModel({
                Statuses: CommonClaims.getStatuses()
            }), "matchcodes");
            this.setModel(CommonClaims.getModelClaims());
            //this.getView().setModel(this.getOwnerComponent().getModel(CommonClaims.getServiceName()));
            this.getRouter().getTarget("claims").attachDisplay(this._onClaimsMatched, this);
        },

        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */
        // onBeforeRebindTable: function (oEvent) {
        //     let binding = oEvent.getParameter("bindingParams");
        //     binding.filters = this._buildFilters();
        //     this._oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("claim.tableNoDataText"));
        // },

        // onAfterVariantInitialise: function () {
        //     this._oTable._oVariantManagement.setShowShare(false);
        // },

        onSearch: function (oEvent) {
            //this._oTable.rebindTable();
            this._oTable.getBinding("rows").filter(this._buildFilters(), sap.ui.model.FilterType.Application);
        },

        onNavBack: function (oEvent) {
            this.getOwnerComponent().getTargets().display("TargetMain");
        },

        onCreateClaimsPress: function () {
            this.saveSortingState();
            CommonClaims.navToClaim(this.getOwnerComponent().getTargets());
        },

        onViewClaimPress: function (oEvent) {
            this.saveSortingState();
            const oItem = oEvent.getSource();
            CommonClaims.navToClaim(this.getOwnerComponent().getTargets(), oItem.getBindingContext().getProperty("Nrorec"));
        },

        /* =========================================================== */
        /* Private Methods                                             */
        /* =========================================================== */
        _onClaimsMatched: function () {
            this._oTable.setBusy(true);
            this._initModels();
            this._loadClaimsData().then(() => {
                this._oTable.getBinding("rows").filter(this._buildFilters(), sap.ui.model.FilterType.Application);
                this.restoreSortingState();
                this.getModel("viewModel").setProperty("/tableTitle", this.getResourceBundle().getText("claim.title.count", [this.getModel().getProperty("/Claims/Count")]))
            }).finally(() => {
                this._oTable.setBusy(false);
            });
        },

        _setSortedColumn: function (oColumm, sOrder) {
            this._resetSortingState(); //No multi-column sorting
            oColumm.setSorted(true);
            oColumm.setSortOrder(sOrder);

        },

        _buildFilters: function () {
            const oFilters = $.extend(true, {}, this.getModel("filterModel").getObject("/filter"));
            return this._prepareFilters(oFilters);
        },

        _prepareFilters: function (oFilters) {
            return Object.keys(oFilters).filter(field => {
                return (oFilters[field] !== null && oFilters[field] !== undefined && (!Array.isArray(oFilters[field]) || oFilters[field].length));
            }).map(field => {
                let filter = null;
                if (Array.isArray(oFilters[field])) {
                    filter = new Filter(oFilters[field].map(value => new Filter(field, FilterOperator.EQ, value)), false);
                } else {
                    filter = new Filter(field, FilterOperator.Contains, oFilters[field]);
                }
                return filter;
            });
        },

        _initModels: function () {
            this._oViewModel = new JSONModel({
                tableTitle: this.getResourceBundle().getText("claim.title"),
                tableNoDataText: this.getResourceBundle().getText("claim.tableNoDataText"),
            });
            this.setModel(this._oViewModel, "viewModel");
            this.setModel(new JSONModel({
                filter: {
                    Titulo: null,
                    Estado: ["1", "2"]
                }
            }), "filterModel");
        },

        _loadClaimsData: function (filters = []) {
            return CommonClaims.getClaims(filters, true);
        },

        _resetSortingState: function () {
            var aColumns = this._oTable.getColumns();
            for (var i = 0; i < aColumns.length; i++) {
                aColumns[i].setSorted(false);
            }
        },

        restoreSortingState: function () {
            let sPath = "Nrorec",
                sSortOrder = sap.ui.table.SortOrder.Descending;

            if (this.sortingStateColumn) {
                sPath = this.sortingStateColumn.getSortProperty();
                sSortOrder = this.sortingStateColumn.getSortOrder();
                this._setSortedColumn(this.sortingStateColumn, sSortOrder)
            } else {
                this._setSortedColumn(this.byId("nrorecColumn"), sap.ui.table.SortOrder.Descending)
            }
            this._oTable.getBinding("rows").sort(new sap.ui.model.Sorter("Nrorec", sSortOrder === sap.ui.table.SortOrder.Descending));
        },

        saveSortingState: function () {
            const aColumns = this._oTable.getColumns(),
                oColumn = aColumns.find(oColumn => {
                    return oColumn.getSorted();
                });

            this.sortingStateColumn = null;
            if (oColumn) {
                this.sortingStateColumn = oColumn;
            }
        }
    });
});