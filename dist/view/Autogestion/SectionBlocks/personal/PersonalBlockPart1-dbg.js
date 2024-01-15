sap.ui.define(['sap/uxap/BlockBase'], function (BlockBase) {
	"use strict";

	var PersonalBlockPart1 = BlockBase.extend("simplot.portalsprd.view.Autogestion.SectionBlocks.personal.PersonalBlockPart1", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "simplot.portalsprd.view.Autogestion.SectionBlocks.personal.PersonalBlockPart1",
					type: "XML"
				},
				Expanded: {
					viewName: "simplot.portalsprd.view.Autogestion.SectionBlocks.personal.PersonalBlockPart1",
					type: "XML"
				}
			}
		}
	});

	return PersonalBlockPart1;
});
