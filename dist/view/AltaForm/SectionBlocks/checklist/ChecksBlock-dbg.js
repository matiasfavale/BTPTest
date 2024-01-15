sap.ui.define(["sap/ui/core/library", 'sap/uxap/BlockBase'], function (coreLibrary, BlockBase) {
	"use strict";

	var ViewType = coreLibrary.mvc.ViewType;

	var GoalsBlock = BlockBase.extend("simplot.portalsprd.view.AltaForm.SectionBlocks.checklist.ChecksBlock", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "simplot.portalsprd.view.AltaForm.SectionBlocks.checklist.ChecksBlock",
					type: ViewType.XML
				},
				Expanded: {
					viewName: "simplot.portalsprd.view.AltaForm.SectionBlocks.checklist.ChecksBlock",
					type: ViewType.XML
				}
			}
		}
	});
	return GoalsBlock;
}, true);
