"use strict";

/** @namespace */
var clevermute_src_main_js_managers = clevermute_src_main_js_managers || {};


/**
 * Manages the application white and black lists.
 * Each one contains the list of domains that have been temporarily permanently allowed or denied to play audio.
 * There are two kinds of white and black lists: Temporary (will persist only while the current browser instance 
 * is open) and permanent (will be stored to local storage). 
 *
 * @class
 */
clevermute_src_main_js_managers.ListsManager = {

	_listsManager : null,

	getInstance : function(){

		if(!this._listsManager){

			this._listsManager = {


				/** Contains the list of websites that are always enabled to play sounds. This list survives even if browser is closed, cause it is stored to local storage */
				_permanentWhiteList : [],


				/** Contains the list of websites that are always muted and user will never be asked to unmute them. This list survives even if browser is closed, cause it is stored to local storage */
				_permanentBlackList : [],


				/** This white list is only stored on memory, so it will be lost when the browser is closed. Used to store non permanently unmuted sites */
				_tempWhiteList : [],


				/** This black list is only stored on memory, so it will be lost when the browser is closed. Used to store non permanently muted sites */
				_tempBlackList : [],


				/**
				 * Loads the white and black lists from disk to memory
				 */
				loadListsFromStorage : function(){

					chrome.storage.local.get(null, function(items){

						if(items.whiteList !== undefined){

							app.listsManager._permanentWhiteList = items.whiteList;
						}

						if(items.blackList !== undefined){

							app.listsManager._permanentBlackList = items.blackList;
						}
					});
				},


				/**
				 * Saves the specified url to the storage white list
				 */
				addUrlToPermanentWhiteList : function(url){

					if(app.ut.StringUtils.isEmpty(url)){

						return;
					}

					url = url.toLowerCase();

					if(!app.listsManager.isOnPermanentWhiteList(url)){

						// Remove the url from all black lists (if it's there)
						app.listsManager.removeUrlFromTempBlackList(url);
						app.listsManager.removeUrlFromPermanentBlackList(url);

						app.listsManager._permanentWhiteList.push(app.ut.StringUtils.getDomainFromUrl(url));

						app.listsManager._saveListsToStorage();
					}
				},


				/**
				 * Saves the specified url to the memory temp whitelist.
				 */
				addUrlToTempWhiteList : function(url){

					if(app.ut.StringUtils.isEmpty(url)){

						return;
					}

					url = url.toLowerCase();

					if(!app.listsManager.isOnTempWhiteList(url)){

						// Remove the url from temp black list (if it's there)
						app.listsManager.removeUrlFromTempBlackList(url);

						app.listsManager._tempWhiteList.push(app.ut.StringUtils.getDomainFromUrl(url));
					}
				},


				/**
				 * Saves the specified url to the storage black list
				 */
				addUrlToPermanentBlackList : function(url){

					if(app.ut.StringUtils.isEmpty(url)){

						return;
					}

					url = url.toLowerCase();

					if(!app.listsManager.isOnPermanentBlackList(url)){

						// Remove the url from all white lists (if it's there)
						app.listsManager.removeUrlFromTempWhiteList(url);
						app.listsManager.removeUrlFromPermanentWhiteList(url);

						app.listsManager._permanentBlackList.push(app.ut.StringUtils.getDomainFromUrl(url));

						app.listsManager._saveListsToStorage();
					}
				},


				/**
				 * Saves the specified url to the memory temp blacklist.
				 */
				addUrlToTempBlackList : function(url){

					if(app.ut.StringUtils.isEmpty(url)){

						return;
					}

					url = url.toLowerCase();

					if(!app.listsManager.isOnTempBlackList(url)){

						// Remove the url from temp white lists (if it's there)
						app.listsManager.removeUrlFromTempWhiteList(url);
						app.listsManager.removeUrlFromPermanentWhiteList(url);

						app.listsManager._tempBlackList.push(app.ut.StringUtils.getDomainFromUrl(url));
					}
				},


				/**
				 * Removes the specified url from the white list
				 */
				removeUrlFromPermanentWhiteList : function(url){

					if(!app.listsManager.isOnPermanentWhiteList(url)){

						return;
					}

					// Remove the url from white lists
					var domain = app.ut.StringUtils.getDomainFromUrl(url);

					app.listsManager._permanentWhiteList = app.ut.ArrayUtils.removeElement(app.listsManager._permanentWhiteList, domain);

					// Store the whitelist to storage
					app.listsManager._saveListsToStorage();
				},


				/**
				 * Removes the specified url from the temp white list
				 */
				removeUrlFromTempWhiteList : function(url){

					if(!app.listsManager.isOnTempWhiteList(url)){

						return;
					}

					// Remove the url from temp white list
					var domain = app.ut.StringUtils.getDomainFromUrl(url);

					app.listsManager._tempWhiteList = app.ut.ArrayUtils.removeElement(app.listsManager._tempWhiteList, domain);
				},


				/**
				 * Removes the specified url from the black list
				 */
				removeUrlFromPermanentBlackList : function(url){

					if(!app.listsManager.isOnPermanentBlackList(url)){

						return;
					}

					// Remove the url from black list
					app.listsManager.removeUrlFromTempBlackList(url);

					var domain = app.ut.StringUtils.getDomainFromUrl(url);

					app.listsManager._permanentBlackList = app.ut.ArrayUtils.removeElement(app.listsManager._permanentBlackList, domain);

					// Store the blacklist to storage
					app.listsManager._saveListsToStorage();
				},


				/**
				 * Removes the specified url from the temp black list
				 */
				removeUrlFromTempBlackList : function(url){

					if(!app.listsManager.isOnTempBlackList(url)){

						return;
					}

					// Remove the url from temp white list
					var domain = app.ut.StringUtils.getDomainFromUrl(url);

					app.listsManager._tempBlackList = app.ut.ArrayUtils.removeElement(app.listsManager._tempBlackList, domain);
				},


				/**
				 * Checks if the specified url is found on the storage white list
				 */
				isOnPermanentWhiteList : function(url){

					url = url.toLowerCase();

					for(var i = 0; i < app.listsManager._permanentWhiteList.length; i++){

						var item = app.listsManager._permanentWhiteList[i];

						if(!app.ut.StringUtils.isEmpty(item) && url.indexOf(item) >= 0){

							return true;
						}
					}

					return false;
				},


				/**
				 * Checks if the specified url is found on the temporary white list
				 */
				isOnTempWhiteList : function(url){

					url = url.toLowerCase();

					for(var i = 0; i < app.listsManager._tempWhiteList.length; i++){

						var item = app.listsManager._tempWhiteList[i];

						if(!app.ut.StringUtils.isEmpty(item) && url.indexOf(item) >= 0){

							return true;
						}
					}

					return false;
				},


				/**
				 * Checks if the specified url is found on the storage black list
				 */
				isOnPermanentBlackList : function(url){

					url = url.toLowerCase();

					for(var i = 0; i < app.listsManager._permanentBlackList.length; i++){

						var item = app.listsManager._permanentBlackList[i];

						if(!app.ut.StringUtils.isEmpty(item) && url.indexOf(item) >= 0){

							return true;
						}
					}

					return false;
				},


				/**
				 * Checks if the specified url is found on the temporary black list
				 */
				isOnTempBlackList : function(url){

					url = url.toLowerCase();

					for(var i = 0; i < app.listsManager._tempBlackList.length; i++){

						var item = app.listsManager._tempBlackList[i];

						if(!app.ut.StringUtils.isEmpty(item) && url.indexOf(item) >= 0){

							return true;
						}
					}

					return false;
				},


				/**
				 * Checks if the specified url is allowed to play sounds or not, based on the current white and black lists state
				 */
				isAllowedToPlay : function(url){

					if(app.listsManager.isOnPermanentWhiteList(url) || app.listsManager.isOnTempWhiteList(url)){

						return true;
					}

					return false;
				},


				/**
				 * Saves the white and black lists from memory to disk
				 *
				 * @private
				 */
				_saveListsToStorage : function(){

					chrome.storage.local.clear();

					chrome.storage.local.set({

						whiteList : app.listsManager._permanentWhiteList,
						blackList : app.listsManager._permanentBlackList

					}, function(){

						if(chrome.runtime.lastError){

							console.log(chrome.runtime.lastError.message);
						}
					});
				}
			};
		}

		return this._listsManager;
	}
};
