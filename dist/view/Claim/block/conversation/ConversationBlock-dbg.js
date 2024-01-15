sap.ui.define(["sap/ui/core/library", "sap/uxap/BlockBase"], function (coreLibrary, BlockBase) {
	"use strict";

	let ViewType = coreLibrary.mvc.ViewType;

	let ConversationBlock = BlockBase.extend("simplot.portalsprd.view.Claim.block.conversation.ConversationBlock", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "simplot.portalsprd.view.Claim.block.conversation.ConversationBlock",
					type: ViewType.XML
				},
				Expanded: {
					viewName: "simplot.portalsprd.view.Claim.block.conversation.ConversationBlock",
					type: ViewType.XML
				}
			}
		}
	});
	return ConversationBlock;
}, true);
