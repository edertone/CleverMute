"use strict";


/** @namespace */
var clevermute_src_main_js_controller = clevermute_src_main_js_controller || {};


/**
 * Operations related to the browser tabs
 * 
 * @class
 */
clevermute_src_main_js_controller.ControlTabs = {


	/**
	 * Refresh the mute state for all the tabs and the extension icon
	 */
	refreshExtensionIcon : function(){

		// Refresh the extension icon based on the currently active tab
		chrome.tabs.query({
			active : true,
			currentWindow : true
		},

		function(t){

			if(t[0] !== undefined){

				// Define the text to show as a tooltip when the user moves the mouse over the extension icon
				var toolTip = app.CLICK_TO_ENABLE_DISABLE_AUDIO;

				// Define the path to the extension icon 
				var extensionIcon = 'resources/shared/images/';

				if(app.listsManager.isOnPermanentBlackList(t[0].url)){

					toolTip = app.TAB_IS_BLACKLISTED_TEXT + toolTip;

					extensionIcon += 'muted_icon_blacklist_128.png';

				}else{

					if(app.listsManager.isAllowedToPlay(t[0].url)){

						if(app.listsManager.isOnPermanentWhiteList(t[0].url)){

							toolTip = app.TAB_IS_WHITELISTED_TEXT + toolTip;

							extensionIcon += 'icon_whitelist_128.png';

						}else{

							extensionIcon += 'icon_128.png';
						}

					}else{

						extensionIcon += 'muted_icon_128.png';
					}
				}

				// We set it only if changed cause the set icon operation is cpu intensive
				if(app.currentExtensionIcon !== extensionIcon){

					chrome.browserAction.setIcon({
						path : extensionIcon
					});

					chrome.browserAction.setTitle({
						title : toolTip
					});

					app.currentExtensionIcon = extensionIcon;
				}
			}
		});
	},


	/**
	 * Defines if the specified tab is muted or unmuted
	 */
	setTabMute : function(tabId, muted){

		chrome.tabs.update(tabId, {
			muted : muted
		});

		if(muted){

			// Add the tab to temporary black list
			chrome.tabs.get(tabId, function(tab){

				app.listsManager.addUrlToTempBlackList(tab.url);
			});

		}else{

			// Add tab url to temporary white list
			chrome.tabs.get(tabId, function(tab){

				app.listsManager.addUrlToTempWhiteList(tab.url);
			});
		}
	},
};