sap.ui.define(["sap/ui/core/library", 'sap/uxap/BlockBase'], function (coreLibrary, BlockBase) {
	"use strict";

	var ViewType = coreLibrary.mvc.ViewType;

	var GoalsBlock = BlockBase.extend("simplot.portalsprd.view.Autogestion.SectionBlocks.adjuntos.AdjuntosBlock", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "simplot.portalsprd.view.Autogestion.SectionBlocks.adjuntos.AdjuntosBlock",
					type: ViewType.XML
				},
				Expanded: {
					viewName: "simplot.portalsprd.view.Autogestion.SectionBlocks.adjuntos.AdjuntosBlock",
					type: ViewType.XML
				}
			}
		}
	});
	return GoalsBlock;
}, true);
