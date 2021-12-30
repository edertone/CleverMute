"use strict";

/** @namespace */
var clevermute_src_main_js_model = clevermute_src_main_js_model || {};


/**
 * SINGLETON Main extension model
 * 
 * @class
 */
clevermute_src_main_js_model.Model = {

	_model : null,

	/**
	 * Get the global singleton class instance
	 * 
	 * @memberOf clevermute_src_main_js_model.Model
	 * 
	 * @returns {clevermute_src_main_js_model.Model} The singleton instance
	 */
	getInstance : function(){

		if(!this._model){

			this._model = {

				CLICK_TO_ENABLE_DISABLE_AUDIO : "Click to enable/disable website audio",

				TAB_IS_WHITELISTED_TEXT : "This tab audio is whitelisted.\n",

				TAB_IS_BLACKLISTED_TEXT : "This tab audio is blacklisted!\n",

				/** Contains the path to the icon that is currently being shown on the extension button */
				currentExtensionIcon : "",

				/** Lists manager class global instance */
				listsManager : clevermute_src_main_js_managers.ListsManager.getInstance(),

				/** Controller folder alias */
				ct : clevermute_src_main_js_controller,

				/** Utils folder alias */
				ut : org_turbocommons_src_main_js_utils,

				/** Managers folder alias */
				mg : clevermute_src_main_js_managers
			};
		}

		return this._model;
	}
};