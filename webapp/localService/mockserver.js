sap.ui.define([
    "sap/ui/core/util/MockServer",
    "sap/ui/model/json/JSONModel",
    "sap/base/util/UriParameters",
    "sap/base/Log"
], function (MockServer, JSONModel, UriParameters, Log) {
    "use strict";

    var _sAppPath = "simplot/portals/",
        _sJsonFilesPath = _sAppPath + "localService/mockdata";

    var oMockServerInterface = {

        mockServers: {},

        /**
         * Initializes the mock server asynchronously.
         * You can configure the delay with the URL parameter "serverDelay".
         * The local mock data in this folder is returned instead of the real data for testing.
         * @protected
         * @param {object} [oOptionsParameter] init parameters for the mockserver
         * @returns{Promise} a promise that is resolved when the mock server has been started
         */
        init: function (oOptionsParameter) {
            var oOptions = oOptionsParameter || {};

            return new Promise(function (fnResolve, fnReject) {
                var sManifestUrl = sap.ui.require.toUrl(_sAppPath + "manifest.json"),
                    oManifestModel = new JSONModel(sManifestUrl);

                oManifestModel.attachRequestCompleted(function () {
                    var oDataSource = oManifestModel.getProperty("/sap.app/dataSources");
                    this.startAllMockServer(oDataSource, oOptions);
                    fnResolve();
                }.bind(this));

                oManifestModel.attachRequestFailed(function () {
                    var sError = "Failed to load application manifest";

                    Log.error(sError);
                    fnReject(new Error(sError));
                });
            }.bind(this));
        },

        startAllMockServer: function (oDataSources, oOptions) {
            this.mockServers = Object.keys(oDataSources).forEach(dataSourceName => {
                this.startMockServer(dataSourceName, oDataSources[dataSourceName], oOptions);
            });
        },

        startMockServer: function (sDataSourceName, oDataSource, oOptions) {
            let oUriParameters = new UriParameters(window.location.href),
                // parse manifest for local metatadata URI
                sMetadataUrl = sap.ui.require.toUrl(_sAppPath + oDataSource.settings.localUri),
                sJsonFilesUrl = sap.ui.require.toUrl(_sJsonFilesPath + "/" + sDataSourceName),
                // ensure there is a trailing slash
                sMockServerUrl = oDataSource.uri && new URI(oDataSource.uri).absoluteTo(sap.ui.require.toUrl(_sAppPath)).toString();

            // create a mock server instance or stop the existing one to reinitialize
            if (!this.mockServers[sDataSourceName]) {
                this.mockServers[sDataSourceName] = new MockServer({
                    rootUri: sMockServerUrl
                });
            } else {
                this.mockServers[sDataSourceName].stop();
            }

            // configure mock server with the given options or a default delay of 0.5s
            MockServer.config({
                autoRespond: true,
                autoRespondAfter: (oOptions.delay || oUriParameters.get("serverDelay") || 500)
            });

            // simulate all requests using mock data
            this.mockServers[sDataSourceName].simulate(sMetadataUrl, {
                sMockdataBaseUrl: sJsonFilesUrl,
                bGenerateMissingMockData: true
            });

            var aRequests = this.mockServers[sDataSourceName].getRequests();

            // compose an error response for each request
            var fnResponse = function (iErrCode, sMessage, aRequest) {
                aRequest.response = function (oXhr) {
                    oXhr.respond(iErrCode, { "Content-Type": "text/plain;charset=utf-8" }, sMessage);
                };
            };

            // simulate metadata errors
            if (oOptions.metadataError || oUriParameters.get("metadataError")) {
                aRequests.forEach(function (aEntry) {
                    if (aEntry.path.toString().indexOf("$metadata") > -1) {
                        fnResponse(500, "metadata Error", aEntry);
                    }
                });
            }

            // simulate request errors
            var sErrorParam = oOptions.errorType || oUriParameters.get("errorType"),
                iErrorCode = sErrorParam === "badRequest" ? 400 : 500;
            if (sErrorParam) {
                aRequests.forEach(function (aEntry) {
                    fnResponse(iErrorCode, sErrorParam, aEntry);
                });
            }

            // custom mock behaviour may be added here

            // set requests and start the server
            this.mockServers[sDataSourceName].setRequests(aRequests);
            this.mockServers[sDataSourceName].start();

            Log.info("Running the app with mock data");
        },

        /**
         * @public returns the mockserver of the app, should be used in integration tests
         * @returns {sap.ui.core.util.MockServer} the mockserver instance
         */
        getMockServer: function (sDataSourceName) {
            return this.mockServers[sDataSourceName];
        }
    };

    return oMockServerInterface;
});