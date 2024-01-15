sap.ui.define(['sap/uxap/BlockBase'], function (BlockBase) {
	"use strict";

	var BlockEmpDetailPart1 = BlockBase.extend("simplot.portalsprd.view.Autogestion.SectionBlocks.employment.BlockEmpDetailPart1", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "simplot.portalsprd.view.Autogestion.SectionBlocks.employment.BlockEmpDetailPart1",
					type: "XML"
				},
				Expanded: {
					viewName: "simplot.portalsprd.view.Autogestion.SectionBlocks.employment.BlockEmpDetailPart1",
					type: "XML"
				}
			}
		}
	});
	return BlockEmpDetailPart1;
}, true);
