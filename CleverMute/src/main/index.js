"use strict";


/** Create a reference to the main app global singleton model */
var app = clevermute_src_main_js_model.Model.getInstance();


/** 
 * Detect when a new tab is created
 */
chrome.tabs.onCreated.addListener(function(){

	app.ct.ControlTabs.refreshExtensionIcon();
});


/** 
 * When the user clicks on the extension icon, we will mute or unmute the current tab 
 */
chrome.browserAction.onClicked.addListener(function(tab){

	app.ct.ControlTabs.setTabMute(tab.id, !tab.mutedInfo.muted);

	if(!app.listsManager.isOnPermanentWhiteList(tab.url)){

		app.ct.ControlNotifications.showAddToWhiteListNotification(tab);
	}

	app.ct.ControlTabs.refreshExtensionIcon();
});


/** 
 * Detect when the currently selected tab changes
 */
chrome.tabs.onActivated.addListener(function(){

	app.ct.ControlTabs.refreshExtensionIcon();
});


/** 
 * Detecth when the window focus changes 
 */
chrome.windows.onFocusChanged.addListener(function(){

	app.ct.ControlTabs.refreshExtensionIcon();
});


/** 
 * Detect changes on the active tab
 */
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){

	// If user modifies the tab mute state we must update our extension model
	if(changeInfo && changeInfo.mutedInfo && changeInfo.mutedInfo.reason === 'user'){

		app.ct.ControlTabs.setTabMute(tab.id, tab.mutedInfo.muted);
	}

	// If we detect that any tab is trying to play audio we will check if it must be muted or not
	if(changeInfo && changeInfo.audible){

		var isAllowedToPlay = app.listsManager.isAllowedToPlay(tab.url);

		chrome.tabs.update(tab.id, {
			muted : !isAllowedToPlay
		});

		if(tab.active && !isAllowedToPlay && !app.listsManager.isOnPermanentBlackList(tab.url)){

			app.ct.ControlNotifications.showMutedSiteNotification(tab);
		}
	}

	app.ct.ControlTabs.refreshExtensionIcon();
});


/** Detect if user clicks on a notification button */
chrome.notifications.onButtonClicked.addListener(function(notificationId, buttonIndex){

	switch(buttonIndex){

		case 0:

			// WhiteList the tab url
			chrome.tabs.get(parseInt(notificationId), function(tab){

				app.listsManager.addUrlToPermanentWhiteList(tab.url);
			});

			app.ct.ControlTabs.setTabMute(parseInt(notificationId), false);
			break;

		case 1:

			// Un mute the tab just now but do not place it on white list
			chrome.tabs.get(parseInt(notificationId), function(tab){

				app.listsManager.removeUrlFromPermanentBlackList(tab.url);

				app.listsManager.addUrlToTempWhiteList(tab.url);
			});

			app.ct.ControlTabs.setTabMute(parseInt(notificationId), false);
			break;

		default:
			break;
	}

	app.ct.ControlNotifications.clearNotification(notificationId);
	app.ct.ControlTabs.refreshExtensionIcon();
});


/** Once extension is loaded, the lists are retrieved from disk */
app.listsManager.loadListsFromStorage();
