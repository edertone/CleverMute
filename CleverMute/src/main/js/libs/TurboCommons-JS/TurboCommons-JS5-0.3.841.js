/** TurboCommons-JS5 0.3.841 */
"use strict";

/**
 * TurboCommons is a general purpose and cross-language library that implements frequently used and generic software development tasks.
 *
 * Website : -> http://www.turbocommons.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2015 Edertone Advanded Solutions (08211 Castellar del Vallès, Barcelona). http://www.edertone.com
 */

/** @namespace */
var org_turbocommons_src_main_js_managers = org_turbocommons_src_main_js_managers || {};


/**
 * SINGLETON class that lets us interact with the current browser
 * 
 * <pre><code>
 * Usage example:
 * 
 * var b = org_turbocommons_src_main_js_managers.BrowserManager.getInstance();
 * 
 * b.reloadPage();
 * var l = b.getPreferredLanguage();
 * ...
 * </code></pre>
 * 
 * @class
 */
org_turbocommons_src_main_js_managers.BrowserManager = {

	_browserManager : null,

	/**
	 * Get the global singleton class instance
	 * 
	 * @memberOf org_turbocommons_src_main_js_managers.BrowserManager
	 * 
	 * @returns {org_turbocommons_src_main_js_managers.BrowserManager} The singleton instance
	 */
	getInstance : function(){

		if(!this._browserManager){

			this._browserManager = {

				/**
				 * Tells if the current html document is fully loaded or not.
				 * 
				 * @memberOf org_turbocommons_src_main_js_managers.BrowserManager.prototype
				 *  
				 * @returns {boolean} True if the current html document is fully loaded (including all frames, objects and images) or false otherwise. 
				 */
				isLoaded : function(){

					return (document.readyState === "complete");
				},


				/**
				 * Reloads the current url
				 * 
				 * @memberOf org_turbocommons_src_main_js_managers.BrowserManager.prototype
				 *  
				 * @returns void
				 */
				reloadPage : function(){

					location.reload();
				},


				/**
				 * Tries to detect the language that is set as preferred by the user on the current browser.
				 * NOTE: Getting browser language with JS is not accurate. It is always better to use server side language detection
				 * 
				 * @memberOf org_turbocommons_src_main_js_managers.BrowserManager.prototype
				 *  
				 * @returns {string} A two digits string containing the detected browser language. For example 'es', 'en', ...
				 */
				getPreferredLanguage : function(){

					var lan = window.navigator.userLanguage || window.navigator.language;

					lan = lan.split(',');

					lan = lan[0].trim().substr(0, 2).toLowerCase();

					return lan;
				},


				/**
				 * Opens the specified url on the browser's current tab or in a new one.
				 * 
				 * @memberOf org_turbocommons_src_main_js_managers.BrowserManager.prototype
				 * 
				 * @param {string} url The url that will be loaded
				 * @param {string} newWindow Setting it to true will open the url on a new browser tab. False by default
				 * @param {object} postData If we want to send POST data to the url, we can set this parameter to an object where each property will be translated to a POST variable name, and each property value to the POST variable value
				 * 
				 * @returns void
				 */
				goToUrl : function(url, newWindow, postData){

					// Init default vars values
					newWindow = (newWindow === undefined) ? false : newWindow;
					postData = (postData === undefined) ? null : postData;

					// Check if POST data needs to be sent
					if(postData == null){

						// Check if same or new window is required
						if(newWindow){

							window.open(url, '_blank');

						}else{

							window.location.href = url;
						}

					}else{

						// Create a dummy html form element to use it as the method to call the url with post data
						var formHtml = '<form action="' + url + '" method="POST" ' + (newWindow ? 'target="_blank"' : '') + ' style="display:none;">';

						// Convert the postData object to the different POST vars
						var props = Object.getOwnPropertyNames(postData);

						for(var i = 0; i < props.length; i++){

							formHtml += '<input type="hidden" name="' + props[i] + '" value="' + postData[props[i]] + '">';
						}

						formHtml += '</form>';

						var form = $(formHtml);

						$('body').append(form);

						form.submit();
					}
				},


				/**
				 * Totally disables the current page scrolling. Useful when creating popups or elements that have an internal scroll, 
				 * and we don't want it to interfere with the main document scroll.<br><br>
				 * Can be enabled again with enableScroll.<br><br>  
				 * Solution taken from : http://stackoverflow.com/questions/8701754/just-disable-scroll-not-hide-it
				 * 
				 * @memberOf org_turbocommons_src_main_js_managers.BrowserManager.prototype
				 * 
				 * @returns void
				 */
				disableScroll : function(){

					if($(document).height() > $(window).height()){

						var html = $('html');

						// Store the current css values to jquery data so we can restore them later
						html.data('HtmlUtils.disablePageScrolling.previous-position', html.css('position'));
						html.data('HtmlUtils.disablePageScrolling.previous-overflow-y', html.css('overflow-y'));

						// Calculate the scroll position
						var scrollTop = (html.scrollTop()) ? html.scrollTop() : $('body').scrollTop();

						// Set css values to lock the scroll on the main body
						html.css('position', 'fixed');
						html.css('overflow-y', 'scroll');
						html.css('width', '100%');
						html.css('top', -scrollTop);
					}
				},


				/**
				 * Restores main document scrolling if has been disabled with HtmlUtils.disableScroll<br><br>
				 * Solution taken from : http://stackoverflow.com/questions/8701754/just-disable-scroll-not-hide-it
				 * 
				 * @memberOf org_turbocommons_src_main_js_managers.BrowserManager.prototype
				 * 
				 * @returns void
				 */
				enableScroll : function(){

					// If the scroll is disabled, the previous css data will exist 
					if($('html').data('HtmlUtils.disablePageScrolling.previous-overflow-y')){

						var html = $('html');

						var scrollTop = parseInt(html.css('top'));

						// Restore the previous css data values
						html.css('position', html.data('HtmlUtils.disablePageScrolling.previous-position'));
						html.css('overflow-y', html.data('HtmlUtils.disablePageScrolling.previous-overflow-y'));

						// Width is a bit special, and to prevent problems when resizing the document again, we will reset it by setting it to "".
						// This is a fix for the original code found on stackoverflow
						html.css('width', "");

						$('html,body').scrollTop(-scrollTop);

						// Clear all the stored css data
						html.removeData('HtmlUtils.disablePageScrolling.previous-position');
						html.removeData('HtmlUtils.disablePageScrolling.previous-overflow-y');
					}
				},


				/**
				 * Gives the current position for the browser scroll
				 * 
				 * @memberOf org_turbocommons_src_main_js_managers.BrowserManager.prototype
				 * 
				 * @returns {array} The current x,y position based on the top left corner of the current document
				 */
				getScrollPosition : function(){

					return [$(document).scrollLeft(), $(document).scrollTop()];
				},


				/**
				 * Moves the browser scroll to the specified X-Y axis position.
				 * 
				 * @memberOf org_turbocommons_src_main_js_managers.BrowserManager.prototype
				 * 
				 * @param {int} x The horizontal position where the scroll will go. It is based on the left of the current page, so we can only specify positive values. Set it to null to avoid x scroll movement
				 * @param {int} y The vertical position where the scroll will go. It is based on the top of the current page, so we can only specify positive values. Set it to null to avoid y scroll movement
				 * @param {int} time The animation duration in miliseconds. Set it to 0 to perform a direct scroll change.
				 * @param {string} easingFunction The jquery easing function to use with the animation. By default jquery has only 'linear' and 'swing', but we may import other jQuery easing libraries if required
				 * 
				 * @returns {boolean} True if scroll position changed after the execution of this method or false if no scroll change happened.
				  */
				scrollTo : function(x, y, time, easingFunction){

					// Set default values if they are not defined
					time = time === undefined ? 1000 : time;
					easingFunction = easingFunction === undefined ? 'swing' : easingFunction;

					var validationManager = new org_turbocommons_src_main_js_managers.ValidationManager();

					if(x !== null && (!validationManager.isNumeric(x) || x < 0)){

						throw new Error("BrowserManager.scrollTo - x coordinate must be a positive number");
					}

					if(y !== null && (!validationManager.isNumeric(y) || y < 0)){

						throw new Error("BrowserManager.scrollTo - y coordinate must be a positive number");
					}

					// Perform scrolling
					var res = false;
					var animateObj = {};

					if(x !== null){

						res = true;
						animateObj.scrollLeft = x;
					}

					if(y !== null){

						res = true;
						animateObj.scrollTop = y;
					}

					if(res){

						$('html, body').stop().animate(animateObj, time, easingFunction);
					}

					return res;
				},


				/**
				 * Enables or disables a smooth scrolling animation when the user clicks on any internal page link.
				 * Example: &lt;a href="#contact"&gt; will scroll the page to the element that has id="contact". NOTE that ony one element with the 'contact' id is expected)
				 * 
				 * @memberOf org_turbocommons_src_main_js_managers.BrowserManager.prototype
				 * 
				 * @param {boolean} enabled True to enable the animated scroll, false to disable it. If disabled, all the rest arguments of this method are useless
				 * @param {int} time The animation duration in miliseconds
				 * @param {int} offSet The vertical offset where the scroll will end. We can specify positive or negative values. Use this to modify the final scrolling point.
				 * @param {string} easingFunction The jquery easing function to use with the animation. By default jquery has only 'linear' and 'swing', but we may import other jQuery easing libraries if required
				 * @param {string} selectedClass If a value is specified for this parameter, all the <a> elements pointing to the currently selected anchor will be set with the specified css class. Usefull to mark selected items with a special css class on a menu.
				 * 
				 * @returns void
				  */
				setAnimatedScroll : function(enabled, time, offSet, easingFunction, selectedClass){

					// Set default values if they are not defined
					time = time === undefined ? 1000 : time;
					easingFunction = easingFunction === undefined ? 'swing' : easingFunction;
					offSet = offSet === undefined ? 0 : offSet;
					selectedClass = selectedClass === undefined ? '' : selectedClass;

					// Alias namespaces
					var ns = org_turbocommons_src_main_js_managers;
					var eventsNs = 'org_turbocommons_src_main_js_managers.BrowserManager.setAnimatedScroll';

					// Validate method parameters
					var validationManager = new ns.ValidationManager();

					validationManager.isBoolean(enabled, "enabled parameter must be a boolean value");
					validationManager.isNumeric(time, "time parameter must be a numeric value");
					validationManager.isNumeric(offSet, "offSet parameter must be a numeric value");
					validationManager.isString(easingFunction, "easingFunction parameter must be a string value");
					validationManager.isString(selectedClass, "selectedClass parameter must be a string value");

					if(validationManager.validationStatus !== ns.ValidationManager.VALIDATION_OK){

						throw new Error("BrowserUtils.scrollTo - " + validationManager.lastMessage);
					}

					// Method that performs scroll animation to a clicked element
					function onElementMouseClick(event){

						// Detect that the click target is an anchor element with hash (a href = "#")
						if(event.target.nodeName.toLowerCase() === 'a'){

							if(event.target.hash != ''){

								// Perform the scroll animation to the element that is pointed by the link hash
								event.preventDefault();

								// Alias namespace
								var ut = org_turbocommons_src_main_js_utils;

								// Check for duplicate ids on the current document
								ut.HtmlUtils.findDuplicateIds();

								// Launch an error if the specified anchor link does not exist
								if(!$(event.target.hash).length){

									throw new Error("BrowserUtils.animateScrollToInternalLinks - Specified anchor link not found: " + event.target.hash);
								}

								$('html, body').stop().animate({
									'scrollTop' : $(event.target.hash).offset().top + offSet
								}, time, easingFunction);
							}
						}
					}

					// Method that racks the browser scroll movement and performs changes to the url hash or selected anchors if necessary
					function onBrowserScroll(){

						// Get an array with all the anchor elements that have set a hash value (href="#...")
						var anchors = $('a[href^="#"]').toArray();

						var elements = [];

						// For all the anchors, we must find the target element and its distance relative to the top of the page
						for(var i = 0; i < anchors.length; i++){

							var elementId = $(anchors[i]).attr('href').replace("#", "");

							// Note that non existent or non visible elements won't be taken into consideration
							if(elementId != ''){

								if($('#' + elementId).length){

									if($('#' + elementId).is(":visible")){

										elements.push({
											id : elementId,
											distance : Math.abs(window.pageYOffset - $('#' + elementId).offset().top)
										});
									}
								}
							}
						}

						// No elements found, nothing to do
						if(elements.length > 0){

							// Sort the elements ascending by distance. We are looking for the one that is closer to the top of the page (the lowest distance)
							var result = elements.sort(function(a, b){

								return (a.distance - b.distance);
							});

							// This is a tricky hack. To prevent the scroll from jumping when we change the url hash, we will locate the element that is 
							// tagged with this hash and temporarily remove its id, then change the url hash and restore the element id.
							var element = document.getElementById(result.shift().id);
							var tmpId = element.id;

							element.removeAttribute('id');
							window.location.hash = '#' + tmpId;
							element.setAttribute('id', tmpId);

							// Set the selected class to the first of the sorted elements
							if(selectedClass != ''){

								$('a[href^="#"]').removeClass(selectedClass);
								$('a[href^="' + window.location.hash + '"]').addClass(selectedClass);
							}
						}
					}

					// Function that contains all the code to initialize the animated scroll
					function initScrollListeners(){

						// Perform a scroll to the url hash on window load, to make sure the ofset is applied
						if(window.location.hash != ''){

							if($(window.location.hash).length){

								// Perform the scroll animation to the element that is pointed by the link hash
								$('html, body').stop().animate({
									'scrollTop' : $(window.location.hash).offset().top + offSet
								}, time, easingFunction);

							}else{

								window.location.hash = '';
							}
						}

						// Listen for the click event to launch the animation
						$(document).on('click.' + eventsNs, onElementMouseClick);

						// Listen for the main browser scroll event
						$(document).on('scroll.' + eventsNs, onBrowserScroll);
					}

					// Check if we need to enable or disable the scrolling animations
					if(enabled){

						// All the code must be executed after the full HTML document is loaded
						if(ns.BrowserManager.getInstance().isLoaded()){

							initScrollListeners();

						}else{

							$(window).one('load', initScrollListeners);
						}

					}else{

						// Remove any listeners that may have been created by this method
						$(document).off('click.' + eventsNs);
						$(document).off('scroll.' + eventsNs);
					}
				},
			};
		}

		return this._browserManager;
	}
};"use strict";

/**
 * TurboCommons is a general purpose and cross-language library that implements frequently used and generic software development tasks.
 *
 * Website : -> http://www.turbocommons.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2015 Edertone Advanded Solutions (08211 Castellar del Vallès, Barcelona). http://www.edertone.com
 */

/** @namespace */
var org_turbocommons_src_main_js_managers = org_turbocommons_src_main_js_managers || {};


/**
 * SINGLETON class that is used to manage the internationalization for our application texts.<br>
 * Main features in brief:<br><br>
 * - Loads resource bundles from one or more specified paths, by order of preference<br>
 * - Supports several resourcebundle formats<br>
 * - A list of locales can be specified so the class will load them by order of preference if any tag is missing.<br>
 * - Supports diferent folder structures for the resourcebundles organization.<br>
 * - Uses a lazy method to load only the requested bundles and tries to minimize path requests.
 * 
 * <pre><code>
 * Usage example:
 * 
 * TODO - add detailed usage example
 * ...
 * </code></pre>
 * 
 * @class
 */
org_turbocommons_src_main_js_managers.LocalesManager = {

	_localesManager : null,

	/**
	 * Get the global singleton class instance
	 * 
	 * @memberOf org_turbocommons_src_main_js_managers.LocalesManager
	 * 
	 * @returns {org_turbocommons_src_main_js_managers.LocalesManager} The singleton instance
	 */
	getInstance : function(){

		if(!this._localesManager){

			this._localesManager = {


				/**
				 * A list of languages that will be used by this class to translate the given keys, sorted by preference. When a key and bundle are requested for translation,
				 * the class will check on the first language of this list for a translated text. If missing, the next one will be used, and so.<br><br>
				 * For example: Setting this property to ['en_US', 'es_ES', 'fr_FR'] and calling
				 * LocalesManager::getInstance()->get('HELLO', 'Greetings') will try to locate the en_US value for the
				 * HELLO tag on the Greetings bundle. If the tag is not found for the specified locale and bundle, the same
				 * search will be performed for the es_ES locale, and so, till a value is found or no more locales are defined.
				 *
				 * @type {array}
				 */
				locales : [],


				/**
				 * Specifies the expected format for the loaded resourcebundle files on each of the specified paths.
				 *
				 * We can define a different format for each of the paths in the $paths property of this class, but is not mandatory.
				 * We can define a single format for all of the specified paths, or we can specify the first n. If there are more
				 * defined paths than formats, the last format will be used for all the subsequent paths on the $paths array.
				 *
				 * Possible values: LocalesManager::FORMAT_JAVA_PROPERTIES, LocalesManager::FORMAT_ANDROID_XML
				 *
				 * TODO: Add support for more internationalization formats
				 *
				 * @type {array}
				 */
				bundleFormat : [org_turbocommons_src_main_js_managers.LocalesManager.FORMAT_JAVA_PROPERTIES],


				/**
				 * List of filesystem paths (relative or absolute) where the roots of our resourcebundles are located.
				 * The class will try to load the data from the paths in order of preference. If a bundle name is duplicated on different paths, the bundle located on the first
				 * path of the list will be always used.<br><br>
				 * For example, if $paths = ['path1', 'path2'] and we have the same bundle named 'Customers' on both paths, the translation
				 * for a key called 'NAME' will be always retrieved from path1. In case path1 does not contain the key, path2 will NOT be used to find a bundle.
				 *
				 * Example: ['../locales', 'src/resources/shared/locales']
				 *
				 * @type {array}
				 */
				paths : [],


				/**
				 * List that defines the expected structure for each of the specified bundle root folders. Its main purpose is to allow us storing
				 * the bundles with any directory structure we want.
				 *
				 * Following format is expected: 'somefolder/somefolder/$locale/$bundle.extension', where $locale will be replaced by the
				 * current locale, and $bundle by the current bundle name.
				 *
				 * Note:  If there are less elements in $pathStructure than in $paths, the last element of the list
				 * list will be used for the rest of the paths that do no have an explicit path structure defined.
				 *
				 * Example: ['myFolder/$locale/$bundle.txt'] will resolve to 'myFolder/en_US/Customers.txt' when trying to load the Customers bundle for US english locale.
				 *
				 * @type {array}
				 */
				pathStructure : ['$locale/$bundle.properties'],


				/**
				 * Stores the locales data as it is read from disk
				 *
				 * @type {array}
				 */
				_loadedData : [],


				/** 
				 * Stores the latest resource bundle that's been used to read a localized value
				 * 
				 * @type {string}
				 */
				_lastBundle : '',


				/**
				 * Reads the value for the specified bundle, key and locale.
				 *
				 * @param {string} key The key we want to read from the specified resource bundle
				 * @param {string} bundle The name for the resource bundle file. If not specified, the value
				 * that was used on the inmediate previous call of this method will be used. This can save us lots of typing
				 * if we are reading multiple consecutive keys from the same bundle.
				 * @param {string} locale The locale we are requesting from the specified bundle and key. If not specified, the value
				 * that is defined on the locales attribute of this class will be used.
				 *
				 * @returns {string} The localized text
				 */
				get : function(key, bundle, locale){

					// Set default values if they are not defined
					bundle = bundle === undefined ? '' : bundle;
					locale = locale === undefined ? '' : locale;

					var localesManager = org_turbocommons_src_main_js_managers.LocalesManager.getInstance();
					var validationManager = new org_turbocommons_src_main_js_managers.ValidationManager();

					// We copy the locales array to prevent it from being altered by this method
					var localesArray = localesManager.locales;

					// Locales must be an array
					if(!validationManager.isArray(localesArray)){

						throw new Error("LocalesManager.get - locales property must be an array");
					}

					// Paths verifications
					if(!validationManager.isArray(localesManager.paths)){

						throw new Error("LocalesManager.get - paths property must be an array");
					}

					if(!validationManager.isArray(localesManager.pathStructure)){

						throw new Error("LocalesManager.get - pathStructure property must be an array");
					}

					if(localesManager.pathStructure.length > localesManager.paths.length){

						throw new Error("LocalesManager.get - pathStructure cannot have more elements than paths");
					}

					// Check if we need to load the last used bundle
					if(bundle == ''){

						bundle = localesManager._lastBundle;
					}

					if(bundle == ''){

						throw new Error("LocalesManager.get - No resource bundle specified");
					}

					// Store the specified bundle name as the last that's been used till now
					localesManager._lastBundle = bundle;

					// Add the specified locale at the start of the list of locales
					if(locale != ''){

						localesArray.unshift(locale);
					}

					// Loop all the locales to find the first one with a value for the specified key
					for(var i = 0; i < localesArray.length; i++){

						// Check if we need to load the bundle from disk
						// TODO - Javascript loads from a url
						//						if(!isset($this->_loadedData[$bundle][$locale])){
						//
						//							$this->_loadBundle($bundle, $locale);
						//						}

						//						if(isset($this->_loadedData[$bundle][$locale][$key])){
						//
						//							return $this->_loadedData[$bundle][$locale][$key];
						//						}
					}

					throw new Error('LocalesManager.get: Specified key <' + key + '> was not found on locales list: [' + localesArray.join(', ') + ']');
				},


				/**
				 * Read the specified bundle and locale from disk and store the values on memory
				 *
				 * @param {string} bundle The name for the bundle we want to load
				 * @param {string} locale The specific language we want to load
				 *
				 * @returns void
				 */
				_loadBundle : function(bundle, locale){

					// Alias namespaces
					var ut = org_turbocommons_src_main_js_utils;

					var localesManager = org_turbocommons_src_main_js_managers.LocalesManager.getInstance();
					var directorySeparator = ut.FileSystemUtils.getDirectorySeparator();

					var pathStructureArray = localesManager.pathStructure;

					for(var i = 0; i < localesManager.paths.length; i++){

						var pathStructure = '';

						// Process the path format string
						if(pathStructureArray.length > 0){

							pathStructure = pathStructureArray.shift().replace('$bundle', bundle).replace('$locale', locale);
						}

						var bundlePath = ut.StringUtils.formatPath(localesManager.paths[i] + directorySeparator + pathStructure);

						// TODO - js loads the bundles from urls
						//						if(ut.FileSystemUtils.isFile(bundlePath)){
						//
						//							var bundleData = ut.FileSystemUtils.readFile(bundlePath);
						//
						//							localesManager._loadedData[bundle][locale] = SerializationUtils::propertiesToArray($bundleData);
						//
						//							return;
						//						}						
					}

					throw new Error('LocalesManager._loadBundle: Could not load bundle <' + bundle + '> and locale <' + locale + '>');
				},
			};
		}

		return this._localesManager;
	}
};


/**
 * Defines the JAVA properties file format, which is the JAVA standard for text internationalization.
 *
 * JAVA properties format is a plain text format that stores KEY/VALUE pairs as 'Key=Value'.
 * The file is encoded as ISO-8859-1 by definition, so it is not recommended to use UTF-8 when creating a .properties file.
 * All special characters that are not ISO-8859-1 need to be escaped as unicode characters like \u0009, \u00F1 inside the file.
 * 
 * @constant {string}
 */
org_turbocommons_src_main_js_managers.LocalesManager.FORMAT_JAVA_PROPERTIES = '';


/**
 * TODO
 * 
 * @constant {string}
 */
org_turbocommons_src_main_js_managers.LocalesManager.FORMAT_ANDROID_XML = 'FORMAT_ANDROID_XML';"use strict";

/**
 * TurboCommons is a general purpose and cross-language library that implements frequently used and generic software development tasks.
 *
 * Website : -> http://www.turbocommons.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2015 Edertone Advanded Solutions (08211 Castellar del Vallès, Barcelona). http://www.edertone.com
 */

/** @namespace */
var org_turbocommons_src_main_js_managers = org_turbocommons_src_main_js_managers || {};


/**
 * SINGLETON General purpose popup management class
 * 
 * <pre><code>
 * Usage example:
 * 
 * var p = org_turbocommons_src_main_js_managers.PopUpManager.getInstance();
 * 
 * p.showBusyCursor();
 * p.removeBusyCursor();
 * ...
 * </code></pre>
 * 
 * @requires jQuery
 * @class
 */
org_turbocommons_src_main_js_managers.PopUpManager = {

	_popUpManager : null,

	/**
	 * Get the global singleton class instance
	 * 
	 * @memberOf org_turbocommons_src_main_js_managers.PopUpManager
	 * 
	 * @returns {org_turbocommons_src_main_js_managers.PopUpManager} The singleton instance
	 */
	getInstance : function(){

		if(!this._popUpManager){

			this._popUpManager = {

				/**
				 * Method that generates all the behaviour for a given button and its related menu (normally some kind of floating / popup menu), so once button is clicked the menu is shown / hidden.
				 * Note1: The css property that is used to show and hide the menu element is "visibility"
				 * Note2: The menu positioning and layout is not modified by this method, so it must be defined via the respective css on the menu element.
				 * Note3: Rollover show / hide is also possible by setting the enableRollOver parameter to true
				 * 
				 * @memberOf org_turbocommons_src_main_js_managers.PopUpManager.prototype
				 * 
				 * @param button A JQuery object that represents the button that will control the related menu element
				 * @param menu A JQuery object that represents the menu that will be shown and hidden by the related button element. Visibility is the css property that is used to show or hide this menu. 
				 * @param buttonOnAplha The button opacity when menu is hidden. .8 by default
				 * @param buttonOffAlpha The button opacity when menu is shown. 1 by default
				 * @param isMenuInitiallyVisible Tells if the menu will be visible at the beginning or not. False by default
				 * @param closeIfClickOutside Menu will be hidden if the user click anywhere outside it. True by default
				 * @param enableRollOver Rollover the button will also show and hide the menu. False by default
				 * @param animationIn Type of animation to use when the menu is shown. None by default. (Requires animate.css library, see its docs for + info on animation types, but some values can be: fadeInDown, bounceIn, ...)
				 * @param animationInDuration The time (in miliseconds) it will take for the animation to perform when showing the menu. 1000 by default
				 * @param animationOut Type of animation to use when the menu is hidden. None by default. (Requires animate.css library, see its docs for + info on animation types, but some values can be: fadeOutDown, bounceOut, ...)
				 * @param animationOutDuration The time (in miliseconds) it will take for the animation to perform when hiding the menu. 1000 by default
				 * @param closeIfClickInside Menu will be hidden if the user clicks inside it. False by default, cause normally the menu will load a new url, so everything will be reloaded. If our app is single page, we may want to set this to true to make sure the menu is hidden once it is clicked, as page may not be reloaded.
				 */
				attachMenuToButton : function(button, menu, buttonOnAplha, buttonOffAlpha, isMenuInitiallyVisible, closeIfClickOutside, enableRollOver, animationIn, animationInDuration, animationOut, animationOutDuration, closeIfClickInside){

					// Set optional parameters default values
					buttonOnAplha = (buttonOnAplha === undefined) ? ".8" : buttonOnAplha;
					buttonOffAlpha = (buttonOffAlpha === undefined) ? "1" : buttonOffAlpha;
					isMenuInitiallyVisible = (isMenuInitiallyVisible === undefined) ? false : isMenuInitiallyVisible;
					closeIfClickOutside = (closeIfClickOutside === undefined) ? true : closeIfClickOutside;
					enableRollOver = (enableRollOver === undefined) ? false : enableRollOver;
					animationIn = (animationIn === undefined) ? "" : animationIn;
					animationInDuration = (animationInDuration === undefined) ? 1000 : animationInDuration;
					animationOut = (animationOut === undefined) ? "" : animationOut;
					animationOutDuration = (animationOutDuration === undefined) ? 1000 : animationOutDuration;
					closeIfClickInside = (closeIfClickInside === undefined) ? false : closeIfClickInside;

					// Set the initial state for the menu and button
					button.css("opacity", (isMenuInitiallyVisible) ? buttonOnAplha : buttonOffAlpha);
					button.data("PopUpManagerButtonState", (isMenuInitiallyVisible) ? "ON" : "OFF");
					menu.css("visibility", (isMenuInitiallyVisible) ? "visible" : "hidden");

					function showMenu(){

						button.css("opacity", buttonOnAplha);

						if(animationIn != ""){

							menu.addClass('animated ' + animationIn);
							menu.css("animation-duration", animationInDuration + "ms");

							menu.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){

								menu.removeClass(animationIn);
								menu.removeClass('animated');
								menu.css("animation-duration", "");
							});
						}

						menu.css("visibility", "visible");
					}

					function hideMenu(){

						button.css("opacity", buttonOffAlpha);

						// If an animation exists, we must wait till it ends
						if(animationIn != ""){

							menu.addClass('animated ' + animationOut);
							menu.css("animation-duration", animationOutDuration + "ms");

							menu.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){

								menu.removeClass(animationOut);
								menu.removeClass('animated');
								menu.css("animation-duration", "");
								menu.css("visibility", "hidden");
							});

						}else{

							menu.css("visibility", "hidden");
						}
					}

					// Attach the click listener to the button that will show and hide the related menu
					button.click(function(){

						// Detect if the menu is selected or not
						if(button.data("PopUpManagerButtonState") == "OFF"){

							button.data("PopUpManagerButtonState", "ON");
							showMenu();

						}else{

							button.data("PopUpManagerButtonState", "OFF");
							hideMenu();
						}
					});

					// Check if menu must be hidden when mouse clicks outside
					if(closeIfClickOutside || closeIfClickInside){

						$(document).mousedown(function(e){

							if(menu.css("visibility") == "visible"){

								var container = menu;

								if(closeIfClickOutside){

									// if the target of the click isn't the container, nor a descendant of the container,
									// nor the mobile menu button, nor a descendant of the mobile menu button,
									if(!container.is(e.target) && container.has(e.target).length === 0 && !$(e.target).is(button) && button.has(e.target).length === 0){

										if(button.data("PopUpManagerButtonState") == "ON"){

											button.data("PopUpManagerButtonState", "OFF");
										}

										hideMenu();
									}
								}

								if(closeIfClickInside){

									// if the target of the click is the container, or a descendant of the container
									if(container.is(e.target) || container.has(e.target).length !== 0){

										if(button.data("PopUpManagerButtonState") == "ON"){

											button.data("PopUpManagerButtonState", "OFF");
										}

										hideMenu();
									}

								}
							}

						});
					}

					// Check if mouse roll over must show and hide the menus
					if(!enableRollOver){

						return;
					}

					function checkTimeOut(){

						setTimeout(function(){

							if(!menu.is(':hover') && !button.is(':hover') && button.data("PopUpManagerButtonState") == "OFF"){

								hideMenu();

								setTimeout(function(){

									buttonMouseEnter();

								}, animationOutDuration + 50);

							}else{

								checkTimeOut();
							}

						}, 300);
					}

					function buttonMouseEnter(){

						if(button.is(':hover') && button.data("PopUpManagerButtonState") == "OFF"){

							showMenu();
						}
					}

					button.mouseenter(buttonMouseEnter);
					button.mouseleave(checkTimeOut);
				},


				/**
				 * TODO: Crear un menu tipus google play que es pugui obrir deslliçant el dit des de fora
				 */
				attachSwipeMenuToButton : function(button, menu){

					// TODO

				},


				/**
				 * Attaches the specified tooltip to the specified element.
				 * 
				 * @memberOf org_turbocommons_src_main_js_managers.PopUpManager.prototype
				 * 
				 * @param element A jquery object that will represent the element where the tooltip will be attached
				 * @param tooltip A jquery object that will represent the tooltip that will be attached to the specified element
				 * @param fadeInDelay 300ms by default, the time it will take for the tooltip to start appearing 
				 * @param fadeInDuration 300ms by default, the time it will take for the fade in effect to complete 
				 * @param fadeOutDelay 50ms by default, the time it will take for the tooltip to start disappearing
				 * @param fadeOutDuration 100ms by default, the time it will take for the fade out effect to complete
				 * @param layoutMode 'center topOut' by default, The centering mode for the tooltip. More information at: LayoutUtils.alignElementTo
				 * @param offsetX 0 by default, The horizontal centering offset for the tooltip. More information at: LayoutUtils.alignElementTo
				 * @param offsetY 5 by default, The vertical centering offset for the tooltip. More information at: LayoutUtils.alignElementTo
				 * @param keepIfMouseOver false by default. If set to true, when the mouse is over the tool tip, it won't disappear.
				 * @param showMode 0 by default. Defines the behaviour that will make the tool tip visible: 0 - on mouse over, 1 - when the user clicks on the element, 2 - on both
				 * 
				 * @see LayoutUtils.alignElementTo()
				 * 
				 * @returns void
				 */
				attachToolTipToElement : function(element, tooltip, fadeInDelay, fadeInDuration, fadeOutDelay, fadeOutDuration, layoutMode, offsetX, offsetY, keepIfMouseOver, showMode){

					// Set default values if they are not defined
					fadeInDelay = fadeInDelay === undefined ? 300 : fadeInDelay;
					fadeInDuration = fadeInDuration === undefined ? 300 : fadeInDuration;
					fadeOutDelay = fadeOutDelay === undefined ? 50 : fadeOutDelay;
					fadeOutDuration = fadeOutDuration === undefined ? 100 : fadeOutDuration;
					layoutMode = layoutMode === undefined ? 'center topOut' : layoutMode;
					offsetX = offsetX === undefined ? 0 : offsetX;
					offsetY = offsetY === undefined ? 5 : offsetY;
					keepIfMouseOver = keepIfMouseOver === undefined ? false : keepIfMouseOver;
					showMode = showMode === undefined ? 0 : showMode;

					// We must make sure that the tooltip is hidden by default
					tooltip.hide();

					// Define the timeout handlers
					var timeOutHandler = null;
					var fadeOutTimeOutHandler = null;

					// The method to handle the mose entering the element that will show the toolitp
					function onElementMouseEnter(){

						// Enable the timer
						timeOutHandler = setTimeout(function(){

							// If timer finishes, we will stop listening the click, mouse enter and leave events
							element.off('mouseenter', onElementMouseEnter);
							element.off('mouseleave', onElementMouseLeave);
							element.off('click', onElementMouseEnter);

							// Move the tooltip to front and center it
							LayoutUtils.moveToFront(tooltip);
							LayoutUtils.alignElementTo(tooltip, element, layoutMode, offsetX, offsetY);

							// Apply the specified animation to the tooltip
							tooltip.stop(true, true).fadeIn(fadeInDuration);

							// Listen to the mouse move event till the pointer is outside the element to remove the tooltip
							$(window).on('mousemove.attachToolTip' + tooltip.index(), function onToolTipMouseMove(e){

								if(LayoutUtils.isElementLocatedAt(element, e.pageX, e.pageY)){

									clearTimeout(fadeOutTimeOutHandler);
									fadeOutTimeOutHandler = null;
									return;
								}

								if(keepIfMouseOver){

									if(LayoutUtils.isElementLocatedAt(tooltip, e.pageX, e.pageY)){

										clearTimeout(fadeOutTimeOutHandler);
										fadeOutTimeOutHandler = null;
										return;
									}
								}

								if(fadeOutTimeOutHandler == null){

									fadeOutTimeOutHandler = setTimeout(function(){

										$(window).off('mousemove.attachToolTip' + tooltip.index(), onToolTipMouseMove);

										tooltip.fadeOut(fadeOutDuration, function(){

											if(showMode == 0 || showMode == 2){

												// Enable the mose enter / leave events again
												element.on('mouseenter', onElementMouseEnter);
												element.on('mouseleave', onElementMouseLeave);
											}

											if(showMode == 1 || showMode == 2){

												element.on('click', onElementMouseEnter);
											}
										});

									}, fadeOutDelay);
								}
							});

						}, fadeInDelay);
					}

					function onElementMouseLeave(){

						// Cancel the timer once mouse leaves the element
						clearTimeout(timeOutHandler);
					}

					if(showMode == 0 || showMode == 2){

						element.on('mouseenter', onElementMouseEnter);
						element.on('mouseleave', onElementMouseLeave);
					}

					if(showMode == 1 || showMode == 2){

						element.on('click', onElementMouseEnter);
					}
				},


				/**
				 * Opens the specified URL in a new standalone browser window that can have a custom defined size.
				 * Not recomended on multi device apps, cause it will have unexpected behaviours on mobile browsers.
				 * 
				 * @memberOf org_turbocommons_src_main_js_managers.PopUpManager.prototype
				 * 
				 * @param url the address that will be opened on the standalone browser window 
				 * @param title The title that will be displayed on the top of the browser window that will contain the specified url
				 * @param size full by default. The browser window dimensions. We can define a WidthxHeight value or set it to 'full'. for example: 250x100, 600x400, full, ...
				 * @param showCentered True by default. Tells if the window will be shown centered on screen or not
				 *
				 * @returns void
				 */
				openBrowserWindow : function(url, title, size, showCentered){

					// Set default values if they are not defined
					title = title === undefined ? '' : title;
					size = size === undefined ? 'full' : size;
					showCentered = showCentered === undefined ? true : showCentered;

					// Detect the window dimensions
					var winW = screen.width - 20;
					var winH = screen.height - 120;

					if(size == 'full'){

						if(parseInt(navigator.appVersion) > 3){

							if(navigator.appName == 'Netscape'){

								if(winW < window.innerWidth){

									winW = window.innerWidth;
								}

								if(winH < window.window.innerHeight){

									winH = window.innerHeight;
								}
							}

							if(navigator.appName.indexOf('Microsoft') != -1){

								if(winW < document.body.offsetWidth){

									winW = document.body.offsetWidth;
								}

								if(winH < document.body.offsetHeight){

									winH = document.body.offsetHeight;
								}
							}
						}

					}else{

						winW = size.split('x')[0];
						winH = size.split('x')[1];
					}

					windowFeatures = 'width=' + winW + ',height=' + winH + ',resizable=1,scrollbars=yes';

					// Center the window if necessary
					if(size != 'full' && showCentered){

						windowFeatures += ',top=' + (screen.height / 2 - winH / 2) + ',left=' + (screen.width / 2 - winW / 2);
					}

					newwin = window.open(url, title, windowFeatures);

					if(javascript_version > 1.0){

						setTimeout(function(){

							newwin.focus();

						}, 250);
					}
				},


				/**
				 * Darkens the current screen and adds a simple busy cursor to the pointer. Note that mobile devices won't show any cursor, only the darkened screen
				 * 
				 * @memberOf org_turbocommons_src_main_js_managers.PopUpManager.prototype
				 * 
				 * @param backgroundAlpha Default .4, defines the alpha for the darkened background that will be shown
				 * 
				 * @returns void
				 */
				showBusyCursor : function(backgroundAlpha){

					// Set default values if they are not defined
					backgroundAlpha = backgroundAlpha === undefined ? 0.4 : backgroundAlpha;

					// We will only add the busy cursor layer if not already present
					if($('#popUpManagerShowBusyCursorAddedCursor-kiUGft5367uh').length <= 0){

						// Define the busy cursor layer as a full screen div
						var cursor = $('<div id="popUpManagerShowBusyCursorAddedCursor-kiUGft5367uh" style="cursor:wait;position:fixed;top:0;left:0;right:0;bottom:0;opacity:' + backgroundAlpha + ';background-color:#000000"></div>');

						$("body").append(cursor);

						// Move the cursor to the front of the current document
						LayoutUtils.moveToFront(cursor);

						// Apply fade in effect			
						cursor.css("transition", "opacity " + 150 + "ms ease-out");
						cursor.css("opacity", backgroundAlpha);
					}
				},


				/**
				 * Removes a previously added busy cursor
				 * 
				 * @memberOf org_turbocommons_src_main_js_managers.PopUpManager.prototype
				 * 
				 * @returns void
				 */
				removeBusyCursor : function(){

					var cursor = $('#popUpManagerShowBusyCursorAddedCursor-kiUGft5367uh');

					if(cursor.length > 0){

						// Play cursor fadeout effects
						cursor.css("transition", "opacity 100ms ease-out");
						cursor.css("opacity", "0");

						// Wait till the fade effects finish to remove the cursor layer
						setTimeout(function(){

							cursor.remove();

							cursor = null;

						}, 100);
					}
				},


				/**
				 * Shows the provided jquery element as a modal popup. 
				 * 
				 * @memberOf org_turbocommons_src_main_js_managers.PopUpManager.prototype
				 * 
				 * @param element The jquery element we want to show as a modal popup. It is mandatory to set its css display value to "display: none" by default. 
				 * @param backgroundAlpha 0.8 bu default. The alpha for the background area below the popup element
				 * @param fadeInDuration 500 by default. The duration of the showing fade effect in miliseconds
				 * @param closeIfClickOutside True by default. The popup will be removed from screen if the user clicks anywhere outside it
				 * @param backgroundColor The color for the area below the popup element (that will be also affected by backgroundAlpha parameter) 
				 * @param layoutMode 'center center' by default, The centering mode for the popup. More information at: LayoutUtils.alignElementTo
				 * 
				 * @see LayoutUtils.alignElementTo()
				 * 
				 * @returns void
				 */
				showModalPopUp : function(element, backgroundAlpha, fadeInDuration, closeIfClickOutside, backgroundColor, layoutMode){

					// Set default values if they are not defined
					backgroundAlpha = backgroundAlpha === undefined ? 0.8 : backgroundAlpha;
					fadeInDuration = fadeInDuration === undefined ? 500 : fadeInDuration;
					closeIfClickOutside = closeIfClickOutside === undefined ? true : closeIfClickOutside;
					backgroundColor = backgroundColor === undefined ? '#000000' : backgroundColor;
					layoutMode = layoutMode === undefined ? 'center center' : layoutMode;

					// Alias namespaces
					var ut = org_turbocommons_src_main_js_utils;
					var mg = org_turbocommons_src_main_js_managers;

					mg.BrowserManager.getInstance().disableScroll();

					// Create the mask main container
					var maskId = ut.HtmlUtils.generateUniqueId('popupMask');

					var mask = $('<div id="' + maskId + '" style="position:fixed;top:0px;left:0px;right:0px;bottom:0px;"></div>');

					// Attach the main background and the popup element wrapper inside the mask container
					mask.append($('<div style="position:fixed;top:0;left:0;right:0;bottom:0;opacity:0;background-color:' + backgroundColor + '"></div>'));
					mask.append($('<div style="position:fixed;top:0;left:0;right:0;bottom:0;opacity:0"></div>'));

					// Attach the element to the popup wrapper 
					mask.children().eq(1).append(element);

					// Force position to fixed and display to inline. Element won't be visible yet cause it is inside the popup wrapper
					element.css("position", "fixed");
					element.css("display", "inline");

					$("body").append(mask);

					// Move the mask to the front of the current document
					ut.LayoutUtils.moveToFront(mask);

					// Define a function to layout the element on screen
					function calculatePopUpLayOut(){

						ut.LayoutUtils.centerElementTo(element, mask, layoutMode);
					}

					// TODO: queda pendent evitar que el focus es surti dels elements del popup cap altres parts de la app

					// Relocate the elements one first time
					calculatePopUpLayOut();

					// Listen for window resize events to relocate the elements
					$(window).on("resize." + maskId, calculatePopUpLayOut);

					// Apply fade in effects to the mask bg and the element wrapper					
					mask.children().eq(0).css("transition", "opacity " + fadeInDuration / 2 + "ms ease-out");
					mask.children().eq(0).css("opacity", backgroundAlpha);
					mask.children().eq(1).css("transition", "opacity " + fadeInDuration + "ms linear");
					mask.children().eq(1).css("opacity", "1");

					// Wait till the fade effects finish to start listening popup events
					setTimeout(function(){

						// Popup will be closed if the ESC key is pressed
						$(document).on('keyup.' + maskId, function(e){

							if(e.keyCode == 27){

								// The removeModalPopUp method will take care of removing all event handlers
								mg.PopUpManager.getInstance().removeModalPopUp(element);
							}
						});

						// Check if popup should be hidden when user clicks outside it
						if(closeIfClickOutside){

							$(document).on("mousedown." + maskId, function(e){

								if(!element.is(e.target) && element.has(e.target).length === 0){

									$(document).on("mouseup." + maskId, function(){

										mg.PopUpManager.getInstance().removeModalPopUp(element);
									});
								}
							});
						}

						// Check if history api is enabled
						if(window.history && window.history.pushState){

							// TODO: cal testejar el funcionament dels history states i tal, que encara té alguns flecos: probar en diferents navegadors, endavant, endarrera, etc...

							// Change the current browser url to the popup id
							window.history.pushState(null, "", maskId + ".html");

							// Close the popup when the back button is pressed
							$(window).on("popstate." + maskId, function(){

								mg.PopUpManager.getInstance().removeModalPopUp(element);
							});
						}

						element.focus();

					}, fadeInDuration);
				},


				/**
				 * Remove an existing modal popup from the screen.
				 * 
				 * @memberOf org_turbocommons_src_main_js_managers.PopUpManager.prototype
				 * 
				 * @param element A jquery element that is currently being shown as a modal popup. 
				 * @param destroy false by default. If true, once the popup element is removed it will be totally destroyed. If false it will be appended again to the root of the body, so it can be reused.
				 * 
				 * @returns void
				 */
				removeModalPopUp : function(element, destroy){

					// Set default values if they are not defined
					destroy = destroy === undefined ? false : destroy;

					var mask = element.parent().parent();

					// Make sure that the modal popup parent is a mask layer, to prevent big problems if the element is not a modal popup generated by this class
					if(mask.attr('id').indexOf('popupMask') < 0){

						return;
					}

					// Remove all possible event handlers
					$(window).off("resize." + mask.attr('id'));
					$(document).off("mousedown." + mask.attr('id'));
					$(document).off("mouseup." + mask.attr('id'));
					$(document).off('keyup.' + mask.attr('id'));
					$(window).off('popstate.' + mask.attr('id'));

					// If history api is avaliable, and the current url contains the mask id, we will force a back to revert the url to the previous value
					if(window.history && window.history.pushState && window.location.href.indexOf(mask.attr('id')) >= 0){

						window.history.back();
					}

					// Play popup fadeout effects
					mask.children().eq(0).css("transition", "opacity 300ms ease-out");
					mask.children().eq(0).css("opacity", "0");
					mask.children().eq(1).css("transition", "opacity 150ms ease-out");
					mask.children().eq(1).css("opacity", "0");

					// Wait till the fade effects finish to start listening popup events
					setTimeout(function(){

						// Add the element again to the main body and hide it or destroy it
						element.css("display", "none");

						if(destroy){

							element.remove();

							element = null;

						}else{

							$("body").append(element);
						}

						// Clear and destroy the mask
						mask.remove();
						mask = null;

						HtmlUtils.enableScrolling();

					}, 300);
				},


				/**
				 * Used to show an animated general purpose notification bar
				 * 
				 * @memberOf org_turbocommons_src_main_js_managers.PopUpManager.prototype
				 * 
				 * @param content  The information that will be shown on the notification bar. We can use html data or plain text.
				 * @param link '' by default. Url that will be opened by the bar once it is clicked. If we leave it empty, the bar will not respond to click event.
				 * @param newWindow True by default. Tells the bar to open its link in a new browser window. If no link is specified, this parameter will do nothing.
				 * @param cssClass '' by default. Defines the css class we want to assign to the notification bar.
				 * @param closeButton '' by default. A path to an image that will be used as a button to hide the bar, or an 'X' if we want to use a simple X close button. If not specified, the bar will only be closeable when a link is set and clicked.
				 * @param position 'top' by default. The region of the screen where the notification bar will appear: top or bottom
				 * @param animateTime 1000 by default. The time in ms that will take the show and hide bar animation.
				 * 
				 * @returns Object The created notification bar as a jquery object.
				 */
				showNotificationBar : function(content, link, newWindow, cssClass, closeButton, position, animateTime){

					// Set default values if they are not defined
					link = link === undefined ? '' : link;
					newWindow = newWindow === undefined ? true : newWindow;
					cssClass = cssClass === undefined ? '' : cssClass;
					closeButton = closeButton === undefined ? '' : closeButton;
					position = position === undefined ? 'top' : position;
					animateTime = animateTime === undefined ? 1000 : animateTime;

					// Generate the main notification bar container
					var notificationBar = $('<div style="position:fixed;overflow:hidden;left:0px;width:100%;z-index:' + (LayoutUtils.getMaxZIndex() + 1) + '"></div>');

					notificationBar.css(position, '-1000px');

					// Check if the notification bar must open a specific link
					if(link != ""){

						notificationBar.css('cursor', 'pointer');

						notificationBar.one("click", function(){

							window.open(link, newWindow ? '_blank' : '_self');

							PopUpManager.getInstance().removeNotificationBar(notificationBar);
						});
					}

					// Add the styles to the notification bar
					if(cssClass == ''){

						notificationBar.css('background-color', '#fffbac');
						notificationBar.css(position == 'bottom' ? 'border-top' : 'border-bottom', '1px solid #6d6d6d');

					}else{

						notificationBar.addClass(cssClass);
					}

					// Add the content to the notification bar
					if(content.indexOf("<") < 0){

						content = '<p ' + ((cssClass == '') ? 'style="text-align:center;margin:7px 20px 7px 20px;color:#6d6d6d"' : '') + '>' + content + '</p>';
					}

					notificationBar.append(content);

					// Add the close button if exists
					if(closeButton != ""){

						closeButton = (closeButton == 'x' || closeButton == 'X') ? $('<a>' + closeButton + '</a>') : $('<img src="' + closeButton + '">');

						closeButton.css('position', 'absolute');
						closeButton.css('cursor', 'pointer');
						closeButton.css('right', '5px');

						notificationBar.append(closeButton);

						// Vertically center the button after fading it the same time as the notification bar needs to be shown
						closeButton.fadeIn(animateTime, function(){

							closeButton.css("top", (notificationBar.height() / 2) - (closeButton.height() / 2) + "px");
						});

						// Attach the click event
						closeButton.one("click", function(event){

							event.stopPropagation();

							PopUpManager.getInstance().removeNotificationBar(notificationBar);
						});
					}

					notificationBar.appendTo("body");

					// Store the actual body css values so we can restore them later
					var bodyOriginalPosition = $('body').css('position');
					var bodyOriginalMargin = parseFloat($('body').css('margin-' + position));

					// Set the body position to relative, so all absolutely positioned elements get also displaced if the body does
					$('body').css('position', 'relative');

					// Get the list of fixed elements that must be displaced with the body
					var elementsToDisplace = $('*').filter(function(){

						if(!$(this).is($('body')) && !$(this).is(notificationBar) && $(this).css('position') === 'fixed'){

							$(this).data('showNotificationBar-originalPosition', parseFloat($(this).css(position)));

							return true;
						}

						return false;
					});

					// Define a function to perform body and fixed elements displacement to accomodate the notification bar height
					function displaceBodyElements(t){

						if(position == 'top'){

							$('body').animate({
								'margin-top' : notificationBar.outerHeight() + 'px'
							}, t);

							elementsToDisplace.each(function(){

								$(this).animate({
									top : $(this).data('showNotificationBar-originalPosition') + notificationBar.outerHeight() + 'px'
								}, t);
							});

						}else{

							$('body').css('margin-bottom', notificationBar.outerHeight() + 'px');
						}
					}

					// Once window is loaded, we will show the bar and displace the body and fixed elements
					$(window).one('load', function(){

						// Place the bar perfectly above the top of the window
						notificationBar.css(position, -notificationBar.outerHeight() + 'px');

						if(position == 'top'){

							notificationBar.animate({
								top : 0
							}, animateTime);

						}else{

							notificationBar.animate({
								bottom : 0
							}, animateTime);
						}

						displaceBodyElements(animateTime);
					});

					// Listen for window resize events to relocate the elements
					$(window).on("resize.showNotificationBar", function(){

						displaceBodyElements(0);
					});

					// Listen the remove event on the bar so we can restore the body and displaced elements original values
					notificationBar.one("remove", function(){

						$('body').css('margin-' + position, bodyOriginalMargin + 'px');
						$('body').css('position', bodyOriginalPosition);

						elementsToDisplace.each(function(){

							$(this).css(position, $(this).data('showNotificationBar-originalPosition'));

							$(this).removeData('showNotificationBar-originalPosition');
						});
					});

					return notificationBar;
				},


				/**
				 * Remove an existing notification bar
				 * 
				 * @memberOf org_turbocommons_src_main_js_managers.PopUpManager.prototype
				 * 
				 * @param notificationBar A notification bar jquery object, obtained from a previous call to the showNotificationBar method
				 * 
				 * @returns void
				 */
				removeNotificationBar : function(notificationBar){

					$(window).off("resize.showNotificationBar");

					notificationBar.trigger("remove");

					notificationBar.remove();

					notificationBar = null;
				},


				/**
				 * Used to show the legal cookies policy dialog. If the user accepts it, a cookie is used to prevent it from being shown again.
				 * 
				 * @memberOf org_turbocommons_src_main_js_managers.PopUpManager.prototype
				 * 
				 * @param text The legal informative text that will be shown on the dialog. Only plain text is allowed here. Note that you can use the predefined Locales on the LibEdertonePhp library: App::importLocaleBundle('Legal', '', ProjectPaths::LIBS_EDERTONE_PHP_LOCALE);	App::setVar('LOC_COOKIES_WARNING', LOC_COOKIES_WARNING);
				 * @param moreInfoLink '' by default. An url that will be opened when the more info link is clicked 
				 * @param moreInfoLinkLabel '' by default. The text that will be shown on the more info link button label
				 * @param cssClass '' by default. Defines the css class we want to assign to the notification bar.
				 * @param position 'bottom' by default. The region of the screen where the notification bar will appear: top or bottom
				 * @param animateTime 1500 by default. The time in ms that will take the show bar animation.
				 * 
				 * @returns Object The created notification bar as a jquery object, or null if it was already accepted
				 */
				showCookiesPolicyDialog : function(text, moreInfoLink, moreInfoLinkLabel, cssClass, position, animateTime){

					// Set default values if they are not defined
					moreInfoLink = moreInfoLink === undefined ? '' : moreInfoLink;
					moreInfoLinkLabel = moreInfoLinkLabel === undefined ? '' : moreInfoLinkLabel;
					cssClass = cssClass === undefined ? '' : cssClass;
					position = position === undefined ? 'bottom' : position;
					animateTime = animateTime === undefined ? 1400 : animateTime;

					if(CookiesUtils.getCookie("cookiesPolicyWarningAccepted") != 1){

						if(cssClass == ""){

							var style = ' style="text-align:center;margin:2px;color:#6d6d6d;font-size:13px;line-height:19px;" ';
						}

						// Define the legal text
						text = '<p ' + style + '>' + text;

						// Define the more info button
						if(moreInfoLink != '' && moreInfoLinkLabel != ''){

							if(cssClass == ""){

								style = 'style="cursor:pointer;margin-left:5px;margin-right:5px;color: #0000ff;font-weight:bold" ';
								style += 'onMouseOver="this.style.color=\'#f60000\'" onMouseOut="this.style.color=\'#0000ff\'" onClick="window.location.href = \'' + moreInfoLink + '\'"';
							}

							text += '<span ' + style + '>' + moreInfoLinkLabel + '</span>';
						}

						// Define the close button
						if(cssClass == ""){

							style = 'style="cursor:pointer;margin-left:10px;color: #000000;font-weight:bold" onMouseOver="this.style.color=\'#f60000\'" onMouseOut="this.style.color=\'#000000\'"';
						}

						text += '<a ' + style + '>X</a>';

						text += '</p>';

						var notificationBar = PopUpManager.getInstance().showNotificationBar(text, "", false, cssClass, "", position, animateTime);

						// Vertically center the button after fading it the same time as the notification bar needs to be shown
						var closeButton = $(notificationBar.find('a'));

						// Attach the click event
						closeButton.one("click", function(event){

							event.stopPropagation();

							CookiesUtils.setCookie('cookiesPolicyWarningAccepted', 1, 999);

							PopUpManager.getInstance().removeNotificationBar(notificationBar);
						});
					}

					return notificationBar;
				}
			};
		}

		return this._popUpManager;
	}
};"use strict";

/**
 * TurboCommons is a general purpose and cross-language library that implements frequently used and generic software development tasks.
 *
 * Website : -> http://www.turbocommons.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2015 Edertone Advanded Solutions (08211 Castellar del Vallès, Barcelona). http://www.edertone.com
 */

/** @namespace */
var org_turbocommons_src_main_js_managers = org_turbocommons_src_main_js_managers || {};


/**
 * Class that allows us to manage validation in an encapsulated way.
 * We can create as many instances as we want, and each instance will store the validation history and global validation state,
 * so we can use this class to validate complex forms or multiple elements globally
 * 
 * @class
 */
org_turbocommons_src_main_js_managers.ValidationManager = function(){


	/** Stores the current state for the applied validations (VALIDATION_OK / VALIDATION_WARNING / VALIDATION_ERROR) */
	this.validationStatus = 0;


	/** Stores the list of generated warning or error messages, in the same order as happened. */
	this.failedMessagesList = [];


	/** Stores the list of failure status codes, in the same order as happened. */
	this.failedStatusList = [];


	/** Stores the last error message generated by a validation error / warning or empty string if no validation errors happened */
	this.lastMessage = '';
};


/** 
 * Constant that defines the correct validation status
 * 
 * @constant {int}
 */
org_turbocommons_src_main_js_managers.ValidationManager.VALIDATION_OK = 0;


/** 
 * Constant that defines the warning validation status
 *
 * @constant {int}
 */
org_turbocommons_src_main_js_managers.ValidationManager.VALIDATION_WARNING = 1;


/** 
 * Constant that defines the error validation status
 * 
 * @constant {int}
 */
org_turbocommons_src_main_js_managers.ValidationManager.VALIDATION_ERROR = 2;


/**
 * Validation will fail if specified value is not a true boolean value
 *
 * @param {boolean} value A boolean expression to validate
 * @param {string} errorMessage The error message that will be generated if validation fails
 * @param {boolean} isWarning Tells if the validation fail will be processed as a validation error or a validation warning
 *
 * @returns {boolean} False in case the validation fails or true if validation succeeds.
 */
org_turbocommons_src_main_js_managers.ValidationManager.prototype.isTrue = function(value, errorMessage, isWarning){

	// Alias namespace
	var ns = org_turbocommons_src_main_js_utils;

	// Set optional parameters default values
	errorMessage = (ns.StringUtils.isEmpty(errorMessage)) ? 'value is not true' : errorMessage;
	isWarning = (isWarning === undefined) ? false : isWarning;

	var res = (value !== true) ? errorMessage : '';

	return this._updateValidationStatus(res, isWarning);
};


/**
 * Validation will fail if specified value is not a boolean type
 *
 * @param {boolean} value The bool to validate
 * @param {string} errorMessage The error message that will be generated if validation fails
 * @param {boolean} isWarning Tells if the validation fail will be processed as a validation error or a validation warning
 *
 * @returns {boolean} False in case the validation fails or true if validation succeeds.
 */
org_turbocommons_src_main_js_managers.ValidationManager.prototype.isBoolean = function(value, errorMessage, isWarning){

	// Alias namespace
	var ns = org_turbocommons_src_main_js_utils;

	// Set optional parameters default values
	errorMessage = (ns.StringUtils.isEmpty(errorMessage)) ? 'value is not a boolean' : errorMessage;
	isWarning = (isWarning === undefined) ? false : isWarning;

	var res = (typeof (value) !== "boolean") ? errorMessage : '';

	return this._updateValidationStatus(res, isWarning);
};


/**
 * Validation will fail if specified value is not numeric
 *
 * @param {Number} value The element to validate
 * @param {string} errorMessage The error message that will be generated if validation fails
 * @param {boolean} isWarning Tells if the validation fail will be processed as a validation error or a validation warning
 *
 * @returns {boolean} False in case the validation fails or true if validation succeeds.
 */
org_turbocommons_src_main_js_managers.ValidationManager.prototype.isNumeric = function(value, errorMessage, isWarning){

	// Alias namespace
	var ns = org_turbocommons_src_main_js_utils;

	// Set optional parameters default values
	errorMessage = (ns.StringUtils.isEmpty(errorMessage)) ? 'value is not a number' : errorMessage;
	isWarning = (isWarning === undefined) ? false : isWarning;

	var res = (!(!isNaN(parseFloat(value)) && isFinite(value))) ? errorMessage : '';

	return this._updateValidationStatus(res, isWarning);
};


/**
 * Validation will fail if specified value is not a string
 *
 * @param {string} value The element to validate
 * @param {string} errorMessage The error message that will be generated if validation fails
 * @param {boolean} isWarning Tells if the validation fail will be processed as a validation error or a validation warning
 *
 * @returns {boolean} False in case the validation fails or true if validation succeeds.
 */
org_turbocommons_src_main_js_managers.ValidationManager.prototype.isString = function(value, errorMessage, isWarning){

	// Alias namespace
	var ns = org_turbocommons_src_main_js_utils;

	// Set optional parameters default values
	errorMessage = (ns.StringUtils.isEmpty(errorMessage)) ? 'value is not a string' : errorMessage;
	isWarning = (isWarning === undefined) ? false : isWarning;

	var res = (!(typeof value === 'string' || value instanceof String)) ? errorMessage : '';

	return this._updateValidationStatus(res, isWarning);
};


/**
 * Validation will fail if specified value is not a correct internet url.
 * Note that correct urls always start with a scheme (http://, ftp://....)
 *
 * @param {string} value The element to validate
 * @param {string} errorMessage The error message that will be generated if validation fails
 * @param {boolean} isWarning Tells if the validation fail will be processed as a validation error or a validation warning
 *
 * @returns {boolean} False in case the validation fails or true if validation succeeds.
 */
org_turbocommons_src_main_js_managers.ValidationManager.prototype.isUrl = function(value, errorMessage, isWarning){

	// Alias namespace
	var ns = org_turbocommons_src_main_js_utils;

	// Set optional parameters default values
	errorMessage = (ns.StringUtils.isEmpty(errorMessage)) ? 'value is not an URL' : errorMessage;
	isWarning = (isWarning === undefined) ? false : isWarning;

	var res = errorMessage;

	var validationManager = new org_turbocommons_src_main_js_managers.ValidationManager();

	if(validationManager.isFilledIn(value) && validationManager.isString(value)){

		// This amazingly good solution's been found at http://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
		var urlRegex = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';

		res = !(value.length < 2083 && (new RegExp(urlRegex, 'i')).test(value)) ? errorMessage : '';
	}

	return this._updateValidationStatus(res, isWarning);
};


/**
 * Validation will fail if specified value is not an array
 *
 * @param {array} value The array to validate
 * @param {string} errorMessage The error message that will be generated if validation fails
 * @param {boolean} isWarning Tells if the validation fail will be processed as a validation error or a validation warning
 *
 * @returns {boolean} False in case the validation fails or true if validation succeeds.
 */
org_turbocommons_src_main_js_managers.ValidationManager.prototype.isArray = function(value, errorMessage, isWarning){

	// Alias namespace
	var ns = org_turbocommons_src_main_js_utils;

	// Set optional parameters default values
	errorMessage = (ns.StringUtils.isEmpty(errorMessage)) ? 'value is not an array' : errorMessage;
	isWarning = (isWarning === undefined) ? false : isWarning;

	var res = (Object.prototype.toString.call(value) !== '[object Array]') ? errorMessage : '';

	return this._updateValidationStatus(res, isWarning);
};


/**
 * Validation will fail if specified value is not an object
 *
 * @param {object} value The object to validate
 * @param {string} errorMessage The error message that will be generated if validation fails
 * @param {boolean} isWarning Tells if the validation fail will be processed as a validation error or a validation warning
 *
 * @returns {boolean} False in case the validation fails or true if validation succeeds.
 */
org_turbocommons_src_main_js_managers.ValidationManager.prototype.isObject = function(value, errorMessage, isWarning){

	// Alias namespace
	var ns = org_turbocommons_src_main_js_utils;

	// Set optional parameters default values
	errorMessage = (ns.StringUtils.isEmpty(errorMessage)) ? 'value is not an object' : errorMessage;
	isWarning = (isWarning === undefined) ? false : isWarning;

	var validationManager = new org_turbocommons_src_main_js_managers.ValidationManager();

	var res = (validationManager.isArray(value) || value === null || typeof value !== 'object') ? errorMessage : '';

	return this._updateValidationStatus(res, isWarning);
};


/**
 * Validation will fail if specified text is empty.<br>
 * See Stringutils.isEmpty to understand what is considered as an empty text
 * 
 * @see Stringutils.isEmpty
 *
 * @param {string} value A text that must not be empty.
 * @param {array} emptyChars Optional array containing a list of string values that will be considered as empty for the given string. This can be useful in some cases when we want to consider a string like 'NULL' as an empty string.	 
 * @param {string} errorMessage The error message that will be generated if validation fails
 * @param {boolean} isWarning Tells if the validation fail will be processed as a validation error or a validation warning
 *
 * @returns {boolean} False in case the validation fails or true if validation succeeds.
 */
org_turbocommons_src_main_js_managers.ValidationManager.prototype.isFilledIn = function(value, emptyChars, errorMessage, isWarning){

	// Alias namespace
	var ns = org_turbocommons_src_main_js_utils;

	// Set optional parameters default values
	emptyChars = (emptyChars === undefined) ? [] : emptyChars;
	errorMessage = (ns.StringUtils.isEmpty(errorMessage)) ? 'value is required' : errorMessage;
	isWarning = (isWarning === undefined) ? false : isWarning;

	var res = ns.StringUtils.isEmpty(value, emptyChars) ? errorMessage : '';

	return this._updateValidationStatus(res, isWarning);
};


/**
 * TODO
 */
org_turbocommons_src_main_js_managers.ValidationManager.prototype.isDate = function(value, required, inputFormat, errorMessage, isWarning){

	// TODO - review all of this method. May be necessary to change it all

	// Alias namespace
	var ns = org_turbocommons_src_main_js_utils;

	// Set optional parameters default values
	//	errorMessage = (ns.StringUtils.isEmpty(errorMessage)) ? 'value is not a date' : errorMessage;
	//	isWarning = (isWarning === undefined) ? false : isWarning;
	//	required = (required === undefined) ? true : required;
	//	inputFormat = (inputFormat === undefined) ? "dd/mm/yyyy" : inputFormat;
	//
	//	// Deferr required validation to the isRequired method
	//	if(required){
	//
	//		if(!this.isRequired(value, errorMessage, isWarning)){
	//
	//			return false;
	//		}
	//
	//	}else{
	//
	//		if(StringUtils.isEmpty(value)){
	//
	//			return true;
	//		}
	//	}
	//
	//	var res = '';
	//
	//	return res == '';
};


/**
 * Validation will fail if specified value is not a valid email
 *
 * @param text The text to validate
 * @param errorMessage The error message that will be generated if validation fails
 * @param isWarning Tells if the validation fail will be processed as a validation error or a validation warning
 * @param required True means the value is required
 *
 * @returns False in case the validation fails or true if validation succeeds.
 */
org_turbocommons_src_main_js_managers.ValidationManager.prototype.isMail = function(text, errorMessage, isWarning, required){

	// TODO - review

	// Alias namespace
	var ns = org_turbocommons_src_main_js_utils;

	// Set optional parameters default values
	errorMessage = (ns.StringUtils.isEmpty(errorMessage)) ? 'value is not an email' : errorMessage;
	isWarning = (isWarning === undefined) ? false : isWarning;
	required = (required === undefined) ? true : required;

	// Deferr required validation to the isRequired method
	if(required){

		if(!this.isRequired(text, errorMessage, isWarning)){

			return false;
		}

	}else{

		if(StringUtils.isEmpty(text)){

			return true;
		}
	}

	var res = '';

	// Test string for a valid email
	var testExp = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

	if(!testExp.test(text)){

		res = errorMessage;
	}

	return this._updateValidationStatus(res, isWarning);
};


/**
 * Validation will fail if specified elements are not identical. 
 *
 * @param  {object} value First of the two objects to compare. Almost any type can be provided: ints, strings, arrays...
 * @param {object} value2 Second of the two objects to compare. Almost any type can be provided: ints, strings, arrays...
 * @param {string} errorMessage The error message that will be generated if validation fails
 * @param {boolean} isWarning Tells if the validation fail will be processed as a validation error or a validation warning
 *
 * @returns {boolean} False in case the validation fails or true if validation succeeds.
 */
org_turbocommons_src_main_js_managers.ValidationManager.prototype.isEqualTo = function(value, value2, errorMessage, isWarning){

	// Alias namespace
	var ut = org_turbocommons_src_main_js_utils;

	// Set optional parameters default values
	errorMessage = (ut.StringUtils.isEmpty(errorMessage)) ? 'values are not equal' : errorMessage;
	isWarning = (isWarning === undefined) ? false : isWarning;

	var validationManager = new org_turbocommons_src_main_js_managers.ValidationManager();

	var res = errorMessage;

	// Compare elements depending on its type
	if(validationManager.isArray(value) && validationManager.isArray(value2)){

		res = ut.ArrayUtils.isEqualTo(value, value2) ? '' : res;

	}else{

		if(validationManager.isObject(value) && validationManager.isObject(value2)){

			res = ut.ObjectUtils.isEqualTo(value, value2) ? '' : res;

		}else{

			if(value === value2){

				res = '';
			}
		}
	}

	return this._updateValidationStatus(res, isWarning);
};


/**
 * Validation will fail if specified text does not contain a minimum of N words.
 *
 * @param text The text to validate
 * @param minWords The minimum number of words that must be present on the text to validate
 * @param errorMessage The error message that will be generated if validation fails
 * @param isWarning Tells if the validation fail will be processed as a validation error or a validation warning
 * @param required True means the value is required
 * @param wordSeparator The character that is considered as the words separator
 *
 * @returns False in case the validation fails or true if validation succeeds.
 */
org_turbocommons_src_main_js_managers.ValidationManager.prototype.isMinimumWords = function(text, minWords, errorMessage, isWarning, required, wordSeparator){

	// Alias namespace
	var ns = org_turbocommons_src_main_js_utils;

	// Set optional parameters default values
	errorMessage = (ns.StringUtils.isEmpty(errorMessage)) ? 'value does not have the minimum words' : errorMessage;
	isWarning = (isWarning === undefined) ? false : isWarning;
	required = (required === undefined) ? true : required;
	wordSeparator = (wordSeparator === undefined) ? ' ' : wordSeparator;

	// Deferr required validation to the isRequired method
	if(required){

		if(!this.isRequired(text, errorMessage, isWarning)){

			return false;
		}

	}else{

		if(StringUtils.isEmpty(text)){

			return true;
		}
	}

	var res = '';

	if(StringUtils.countWords(text, wordSeparator) < minWords){

		res = errorMessage;
	}

	return this._updateValidationStatus(res, isWarning);
};


/**
 * Validation will fail if specified text does not match with a valid Spanish identification fiscal number
 *
 * @param text The text to validate
 * @param errorMessage The error message that will be generated if validation fails
 * @param isWarning Tells if the validation fail will be processed as a validation error or a validation warning
 * @param required True means the value is required
 *
 * @returns False in case the validation fails or true if validation succeeds.
 */
org_turbocommons_src_main_js_managers.ValidationManager.prototype.isNIF = function(text, errorMessage, isWarning, required){

	// Alias namespace
	var ns = org_turbocommons_src_main_js_utils;

	// Set optional parameters default values
	errorMessage = (ns.StringUtils.isEmpty(errorMessage)) ? 'value is not a NIF' : errorMessage;
	isWarning = (isWarning === undefined) ? false : isWarning;
	required = (required === undefined) ? true : required;

	// Deferr required validation to the isRequired method
	if(required){

		if(!this.isRequired(text, errorMessage, isWarning)){

			return false;
		}

	}else{

		if(StringUtils.isEmpty(text)){

			return true;
		}
	}

	var res = '';

	var isNif = false;
	var number;
	var l;
	var letter;
	var regExp = /^[XYZ]?\d{5,8}[A-Z]$/;
	var nif = text.toUpperCase();

	if(regExp.test(nif) === true){

		number = nif.substr(0, nif.length - 1);
		number = number.replace('X', 0);
		number = number.replace('Y', 1);
		number = number.replace('Z', 2);

		l = nif.substr(nif.length - 1, 1);

		number = number % 23;

		letter = 'TRWAGMYFPDXBNJZSQVHLCKET';
		letter = letter.substring(number, number + 1);

		isNif = (letter == l);
	}

	if(!isNif){

		res = errorMessage;
	}

	return this._updateValidationStatus(res, isWarning);
};


/**
 * Validation will fail if specified text does not has a minimum length
 *
 * @param text The text to validate
 * @param minLen The minimum length for the specified text
 * @param errorMessage The error message that will be generated if validation fails
 * @param isWarning Tells if the validation fail will be processed as a validation error or a validation warning
 * @param required True means the value is required
 *
 * @returns False in case the validation fails or true if validation succeeds.
 */
org_turbocommons_src_main_js_managers.ValidationManager.prototype.isMinimumLength = function(text, minLen, errorMessage, isWarning, required){

	// Alias namespace
	var ns = org_turbocommons_src_main_js_utils;

	// Set optional parameters default values
	errorMessage = (ns.StringUtils.isEmpty(errorMessage)) ? 'value does not meet minimum length' : errorMessage;
	isWarning = (isWarning === undefined) ? false : isWarning;
	required = (required === undefined) ? true : required;

	// Deferr required validation to the isRequired method
	if(required){

		if(!this.isRequired(text, errorMessage, isWarning)){

			return false;
		}

	}else{

		if(StringUtils.isEmpty(text)){

			return true;
		}
	}

	var res = '';

	if(text.length < minLen){

		res = errorMessage;
	}

	return this._updateValidationStatus(res, isWarning);
};


/**
 * Validation will fail if specified text does not contain a valid postal code
 *
 * @param text The text to validate
 * @param errorMessage The error message that will be generated if validation fails
 * @param isWarning Tells if the validation fail will be processed as a validation error or a validation warning
 * @param required True means the value is required
 *
 * @returns False in case the validation fails or true if validation succeeds.
 */
org_turbocommons_src_main_js_managers.ValidationManager.prototype.isPostalCode = function(text, errorMessage, isWarning, required){

	// TODO: This is really tough
};


/**
 * Validation will fail if specified value is not a correct phone number
 *
 * @param text The text to validate
 * @param errorMessage The error message that will be generated if validation fails
 * @param isWarning Tells if the validation fail will be processed as a validation error or a validation warning
 * @param required True means the value is required
 *
 * @returns False in case the validation fails or true if validation succeeds.
 */
org_turbocommons_src_main_js_managers.ValidationManager.prototype.isPhone = function(text, errorMessage, isWarning, required){

	// Alias namespace
	var ns = org_turbocommons_src_main_js_utils;

	// Set optional parameters default values
	errorMessage = (ns.StringUtils.isEmpty(errorMessage)) ? 'value is not a phone' : errorMessage;
	isWarning = (isWarning === undefined) ? false : isWarning;
	required = (required === undefined) ? true : required;

	// Deferr required validation to the isRequired method
	if(required){

		if(!this.isRequired(text, errorMessage, isWarning)){

			return false;
		}

	}else{

		if(StringUtils.isEmpty(text)){

			return true;
		}
	}

	var res = '';

	var phoneValid = true;

	// Phone numeric digits must be 5 at least
	var digitsCount = text.replace(/[^0-9]/g, "").length;

	if(digitsCount < 6 || digitsCount > 15){

		phoneValid = false;
	}

	// Check that there are only allowed characters
	var allowedChars = "+- 1234567890()";

	for(var i = 0; i < text.length; i++){

		if(allowedChars.indexOf(text.charAt(i)) < 0){

			phoneValid = false;
		}
	}

	if(!phoneValid){

		res = errorMessage;
	}

	return this._updateValidationStatus(res, isWarning);
};


/**
 * Validates the specified form using the different parameters specified as "data-" attributes which can be placed on the form itself or any of the elements to validate. Note that attributes defined on the elements take precedence over the attributes defined on the form element.
 * Following attributes can be used:<br><br>
 * - data-validationType: Specifies the type of validation applied (multiple types can be specified sepparated with spaces). Possible values are:<br>
 * &emsp;&emsp;required: The value is mandatory<br>
 * &emsp;&emsp;mail: Value must be an email address<br>
 * &emsp;&emsp;equalTo-selector: Value must be equal to the element (or elements) defined by the jquery 'selector'<br>
 * &emsp;&emsp;minWords-n: Value must contain at least n words<br>
 * &emsp;&emsp;nif: Value must be a valid spanish fiscal number<br>
 * &emsp;&emsp;minLen-n: Value string length must be at least n characters<br> 
 * &emsp;&emsp;postalCode: Value must be a valid postal code<br>
 * &emsp;&emsp;phone: Value must be a valid phone number<br><br>
 * - data-validationError: The error that will be generated once a validation for the specified element fails. We can define custom errors for each validation type by adding -validationType to the attribute.
 * For example: data-validationError-required="error message .." will apply only to the required validation type.  
 * 
 * @param form A jquery object representing the form to validate. We can pass an htm form element, or also a div containing inputs, buttons, and so.
 * @param throwAlert True by default. If enabled, a javascript alert will be thrown with the validation error when any validation fails.
 * @param invalidElementClass '' by default. Css class that will be applied to the elements that fail validation, so we can style them the way we want.
 * 
 * @returns {array} Empty array if validation was OK or an array containing the list of the different objects that have generated a warning or error message, in the same order as they happened
 */
org_turbocommons_src_main_js_managers.ValidationManager.prototype.isHtmlFormValid = function(form, throwAlert, invalidElementClass){

	// TODO - This method must be tested intensively

	// Set optional parameters default values
	throwAlert = (throwAlert === undefined) ? true : throwAlert;
	invalidElementClass = (invalidElementClass === undefined) ? '' : invalidElementClass;

	var validationManager = this;

	// As this method performs multiple validations, this validation manager object is reset at the beginning.
	validationManager.reset();

	var res = true;
	var failedElementsList = [];

	var errorMessage = StringUtils.isEmpty(form.attr("data-validationError")) ? 'Invalid form' : form.attr("data-validationError");

	// Loop all the form elements
	form.find(':input,textarea').each(function(){

		var validationTypes = $(this).attr("data-validationType");

		if(!StringUtils.isEmpty(validationTypes)){

			// Get the validation error message if it exists
			var validationError = $(this).attr("data-validationError");

			if(StringUtils.isEmpty(validationError)){

				validationError = errorMessage;
			}

			// Split the validation type in case there's more than one specified
			validationTypes = validationTypes.split(' ');

			// Get the element value to validate
			var elementValue = $(this).val();

			if($(this).is(':checkbox')){

				elementValue = $(this).is(":checked") ? 'true' : '';
			}

			// Loop all the validation types specified for this element
			for(var i = 0; i < validationTypes.length; i++){

				if(invalidElementClass != ''){

					$(this).removeClass(invalidElementClass);
				}

				// Split the validation type as it may contain type-value for some of the types like 'equalto-id'
				var validationType = validationTypes[i].split('-');

				// Check if a custom error for this validation type is specified
				if(!StringUtils.isEmpty($(this).attr("data-validationError-" + validationType[0]))){

					validationError = $(this).attr("data-validationError-" + validationType[0]);
				}

				switch(validationType[0]){

					case 'required':
						res = validationManager.isRequired(elementValue, validationError);
						break;

					case 'mail':
						res = validationManager.isMail(elementValue, validationError, false, false);
						break;

					case 'equalTo':
						res = validationManager.isEqualToValue(elementValue, $(validationType[1]).val(), validationError, false, false);
						break;

					case 'minWords':
						res = validationManager.isMinimumWords(elementValue, validationType[1], validationError, false, false, ' ');
						break;

					case 'nif':
						res = validationManager.isNIF(elementValue, validationError, false, false);
						break;

					case 'minLen':
						res = validationManager.isMinimumLength(elementValue, validationType[1], validationError, false, false);
						break;

					case 'postalCode':
						res = validationManager.isPostalCode(elementValue, validationError, false, false);
						break;

					case 'phone':
						res = validationManager.isPhone(elementValue, validationError, false, false);
						break;

					default:
						throw new Error("ValidationManager.isHtmlFormValid - Unknown validation type: " + validationType[0]);
				}

				if(!res){

					if(invalidElementClass != ''){

						$(this).addClass(invalidElementClass);
					}

					if(throwAlert){

						alert(validationManager.lastMessage);
					}

					failedElementsList[failedElementsList.length - 1] = $(this);
				}
			}
		}
	});

	return failedElementsList;
};


/** 
 * Reinitialize the validation status for this class
 * 
 * @returns void
 */
org_turbocommons_src_main_js_managers.ValidationManager.prototype.reset = function(){

	// alias namespace
	var ns = org_turbocommons_src_main_js_managers;

	this.validationStatus = ns.ValidationManager.VALIDATION_OK;
	this.failedMessagesList = [];
	this.failedStatusList = [];
	this.lastMessage = '';
};


/**
 * Update the class validation Status depending on the provided error message.
 *
 * @param {string} errorMessage The error message that's been generated from a previously executed validation method
 * @param {boolean} isWarning Tells if the validation fail will be processed as a validation error or a validation warning
 *
 * @returns {boolean} True if received errorMessage was '' (validation passed) or false if some error message was received (validation failed)
 */
org_turbocommons_src_main_js_managers.ValidationManager.prototype._updateValidationStatus = function(errorMessage, isWarning){

	// alias namespace
	var ns = org_turbocommons_src_main_js_managers;

	// If we are currently in an error state, nothing to do
	if(this.validationStatus == ns.ValidationManager.VALIDATION_ERROR){

		return errorMessage == '';
	}

	// If the validation fails, we must change the validation status
	if(errorMessage != ""){

		this.failedMessagesList.push(errorMessage);

		if(isWarning){

			this.failedStatusList.push(ns.ValidationManager.VALIDATION_WARNING);
			this.lastMessage = errorMessage;

		}else{

			this.failedStatusList.push(ns.ValidationManager.VALIDATION_ERROR);
			this.lastMessage = errorMessage;
		}

		if(isWarning && this.validationStatus != ns.ValidationManager.VALIDATION_ERROR){

			this.validationStatus = ns.ValidationManager.VALIDATION_WARNING;

		}else{

			this.validationStatus = ns.ValidationManager.VALIDATION_ERROR;
		}
	}

	return errorMessage == '';
};"use strict";

/**
 * TurboCommons is a general purpose and cross-language library that implements frequently used and generic software development tasks.
 *
 * Website : -> http://www.turbocommons.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2015 Edertone Advanded Solutions (08211 Castellar del Vallès, Barcelona). http://www.edertone.com
 */

/** @namespace */
var org_turbocommons_src_main_js_utils = org_turbocommons_src_main_js_utils || {};


/**
 * Utilities to perform common array operations
 * 
 * @class
 */
org_turbocommons_src_main_js_utils.ArrayUtils = {


	/**
	 * Check if two provided arrays are identical
	 * 
	 * @static
	 * 
	 * @param {array} array1 First array to compare
	 * @param {array} array2 Second array to compare
	 *
	 * @returns boolean true if arrays are exactly the same, false if not
	 */
	isEqualTo : function(array1, array2){

		// Alias namespaces
		var ut = org_turbocommons_src_main_js_utils;

		var validationManager = new org_turbocommons_src_main_js_managers.ValidationManager();

		// Both provided values must be arrays or an exception will be launched
		if(!validationManager.isArray(array1) || !validationManager.isArray(array2)){

			throw new Error("ArrayUtils.isEqualTo: Provided parameters must be arrays");
		}

		// Compare lengths can save a lot of time 
		if(array1.length != array2.length){

			return false;
		}

		for(var i = 0, l = array1.length; i < l; i++){

			// Check if we have nested arrays
			if(validationManager.isArray(array1[i]) && validationManager.isArray(array2[i])){

				if(!this.isEqualTo(array1[i], array2[i])){

					return false;
				}

			}else{

				if(validationManager.isObject(array1[i]) && validationManager.isObject(array2[i])){

					if(!ut.ObjectUtils.isEqualTo(array1[i], array2[i])){

						return false;
					}

				}else if(array1[i] !== array2[i]){

					return false;
				}
			}
		}

		return true;
	},


	/**
	 * Remove the specified item from an array
	 * 
	 * @static
	 * 
	 * @param {array} array An array (it will not be modified by this method)
	 * @param {object} element The element that must be removed from the given array
	 *
	 * @returns {array} The provided array but without the specified element (if found). Note that originally received array is not modified by this method
	 */
	removeElement : function(array, element){

		var validationManager = new org_turbocommons_src_main_js_managers.ValidationManager();

		// Provided array must be an array
		if(!validationManager.isArray(array)){

			throw new Error("ArrayUtils.removeElement: Provided parameter must be an array");
		}

		var res = [];

		if(validationManager.isArray(element)){

			for(var i = 0; i < array.length; i++){

				if(!validationManager.isArray(array[i])){

					res.push(array[i]);

				}else{

					if(!this.isEqualTo(element, array[i])){

						res.push(array[i]);
					}
				}
			}

		}else{

			for(var j = 0; j < array.length; j++){

				if(element !== array[j]){

					res.push(array[j]);
				}
			}
		}

		return res;
	}
};"use strict";

/**
 * TurboCommons is a general purpose and cross-language library that implements frequently used and generic software development tasks.
 *
 * Website : -> http://www.turbocommons.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2015 Edertone Advanded Solutions (08211 Castellar del Vallès, Barcelona). http://www.edertone.com
 */

/** @namespace */
var org_turbocommons_src_main_js_utils = org_turbocommons_src_main_js_utils || {};


/**
 * The most common conversion utilities to convert the data from a simple type to another one.<br>
 * To convert complex classes or structures, use SerializationUtils class.
 * 
 * <pre><code> 
 * This is a static class, so no instance needs to be created.
 * Usage example:
 * 
 * var ns = org_turbocommons_src_main_js_utils;
 * 
 * var result1 = ns.ConversionUtils.stringToBase64('hello');
 * var result2 = ns.ConversionUtils.base64ToString('somebase64text');
 * ...
 * </code></pre>
 * 
 * @class
 */
org_turbocommons_src_main_js_utils.ConversionUtils = {


	/**
	 * Encode a string to base64<br><br> 
	 * Found at: http://www.webtoolkit.info/<br>
	 * 			 http://www.webtoolkit.info/javascript-base64.html#.VO3gzjSG9AY
	 * 
	 * @static
	 *  
	 * @param {string} string The input string to be converted
	 * @returns {string} The input string as base 64 
	 */
	stringToBase64 : function(string){

		if(string === null || string === undefined){

			return '';
		}

		var validationManager = new org_turbocommons_src_main_js_managers.ValidationManager();

		if(!validationManager.isString(string)){

			throw new Error("ConversionUtils.stringToBase64: value is not a string");
		}

		var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;

		// Auxiliary method to encode a string as utf 8
		function utf8Encode(string){

			var utftext = "";
			string = string.replace(/\r\n/g, "\n");

			for(var n = 0; n < string.length; n++){

				var c = string.charCodeAt(n);

				if(c < 128){

					utftext += String.fromCharCode(c);

				}else if((c > 127) && (c < 2048)){

					utftext += String.fromCharCode((c >> 6) | 192);
					utftext += String.fromCharCode((c & 63) | 128);

				}else{
					utftext += String.fromCharCode((c >> 12) | 224);
					utftext += String.fromCharCode(((c >> 6) & 63) | 128);
					utftext += String.fromCharCode((c & 63) | 128);
				}
			}

			return utftext;
		}

		string = utf8Encode(string);

		while(i < string.length){

			chr1 = string.charCodeAt(i++);
			chr2 = string.charCodeAt(i++);
			chr3 = string.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if(isNaN(chr2)){

				enc3 = enc4 = 64;

			}else if(isNaN(chr3)){

				enc4 = 64;
			}

			output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
		}

		return output;
	},


	/**
	 * Decode a string from base64<br><br> 
	 * Found at: http://www.webtoolkit.info/<br>
	 * 			 http://www.webtoolkit.info/javascript-base64.html#.VO3gzjSG9AY
	 *
	 * @static
	 *  
	 * @param {string} string a base64 string
	 * 
	 * @returns {string} The base64 decoded as its original string
	 */
	base64ToString : function(string){

		if(string === null || string === undefined){

			return '';
		}

		var validationManager = new org_turbocommons_src_main_js_managers.ValidationManager();

		if(!validationManager.isString(string)){

			throw new Error("ConversionUtils.stringToBase64: value is not a string");
		}

		var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;

		string = string.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		while(i < string.length){

			enc1 = keyStr.indexOf(string.charAt(i++));
			enc2 = keyStr.indexOf(string.charAt(i++));
			enc3 = keyStr.indexOf(string.charAt(i++));
			enc4 = keyStr.indexOf(string.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if(enc3 != 64){

				output = output + String.fromCharCode(chr2);
			}

			if(enc4 != 64){

				output = output + String.fromCharCode(chr3);
			}
		}

		// Auxiliary method for utf8 decoding
		function utf8Decode(utftext){

			var string = "";
			var i = 0;
			var c = 0;
			var c2 = 0;

			while(i < utftext.length){

				c = utftext.charCodeAt(i);

				if(c < 128){

					string += String.fromCharCode(c);
					i++;

				}else if((c > 191) && (c < 224)){

					c2 = utftext.charCodeAt(i + 1);
					string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
					i += 2;

				}else{

					c2 = utftext.charCodeAt(i + 1);
					c3 = utftext.charCodeAt(i + 2);
					string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
					i += 3;
				}
			}

			return string;
		}

		output = utf8Decode(output);

		return output;
	}
};"use strict";

/**
 * TurboCommons is a general purpose and cross-language library that implements frequently used and generic software development tasks.
 *
 * Website : -> http://www.turbocommons.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2015 Edertone Advanded Solutions (08211 Castellar del Vallès, Barcelona). http://www.edertone.com
 */

/** @namespace */
var org_turbocommons_src_main_js_utils = org_turbocommons_src_main_js_utils || {};


/**
 * Utilities related with saving, reading and operating with cookies
 * 
 * <pre><code> 
 * This is a static class, so no instance needs to be created.
 * Usage example:
 * 
 * var ns = org_turbocommons_src_main_js_utils;
 * 
 * var cookie = ns.CookiesUtils.getCookie('key');
 * ...
 * </code></pre>
 * 
 * @class
 */
org_turbocommons_src_main_js_utils.CookiesUtils = {


	/**
	 * Check if the specified cookie exists
	 * 
	 * @static
	 * 
	 * @param {string} key the name for the cookie we want to find
	 * 
	 * @returns {boolean} True if cookie with specified name exists, false otherwise
	 */
	isCookie : function(key){

		return (this.getCookie(key) !== undefined);
	},


	/**
	 * Set the value for a cookie or create it if not exist
	 * 
	 * Adapted from the jquery.cookie plugin by Klaus Hartl: https://github.com/carhartl/jquery-cookie
	 * 
	 * @static
	 * 
	 * @param {string} key the name for the cookie we want to create
	 * @param {string} value the value we want to set to the new cookie.
	 * @param {string} expires The lifetime of the cookie. Value can be a `Number` which will be interpreted as days from time of creation or a `Date` object. If omitted or '' string, the cookie becomes a session cookie.
	 * @param {string} path Define the path where the cookie is valid. By default it is the whole domain: '/'. A specific path can be passed (/ca/Home/) or a '' string to set it as the current site http path.
	 * @param {string} domain Define the domain where the cookie is valid. Default: domain of page where the cookie was created.
	 * @param {boolean} secure If true, the cookie transmission requires a secure protocol (https). Default: false.
	 * 
	 * @returns {boolean} True if cookie was created, false otherwise. An exception may be thrown if invalid parameters are specified
	 */
	setCookie : function(key, value, expires, path, domain, secure){

		// Set optional parameters default values
		expires = (expires === undefined || expires === null) ? '' : expires;
		path = (path === undefined) ? "/" : path;
		domain = (domain === undefined) ? "" : domain;
		secure = (secure === undefined) ? false : secure;

		// TODO: Should be interesting to detect if we are going to exceed the total available space for 
		// cookies storage before storing the data, to prevent it from silently failing 	

		var validationManager = new org_turbocommons_src_main_js_managers.ValidationManager();

		// Empty key means an exception
		if(!validationManager.isString(key) || !validationManager.isFilledIn(key)){

			throw new Error("CookiesUtils.setCookie: key must be defined");
		}

		// Empty values mean cookie will be created empty
		if(value === undefined || value === null){

			value = '';
		}

		// Reaching here, non string value means an exception
		if(!validationManager.isString(value)){

			throw new Error("CookiesUtils.setCookie: value must be a string");
		}

		// If the expires parameter is numeric, we will generate the correct date value
		if(validationManager.isNumeric(expires)){

			var days = expires;

			expires = new Date();
			expires.setDate(expires.getDate() + days);
		}

		// Generate the cookie value
		var res = encodeURIComponent(key) + '=' + encodeURIComponent(value);
		res += expires ? '; expires=' + expires.toUTCString() : '';
		res += path ? '; path=' + path : '';
		res += domain ? '; domain=' + domain : '';
		res += secure ? '; secure' : '';

		document.cookie = res;

		return true;
	},


	/**
	 * Get the value for an existing cookie.
	 * 
	 * @static
	 * 
	 * Adapted from the jquery.cookie plugin by Klaus Hartl: https://github.com/carhartl/jquery-cookie
	 * 
	 * @param {string} key the name of the cookie we want to get
	 * 
	 * @returns {string} Cookie value or undefined if cookie does not exist
	 */
	getCookie : function(key){

		var validationManager = new org_turbocommons_src_main_js_managers.ValidationManager();

		// Empty key means an exception
		if(!validationManager.isString(key) || !validationManager.isFilledIn(key)){

			throw new Error("CookiesUtils.getCookie: key must be defined");
		}

		// Get an array with all the page cookies
		var cookies = document.cookie.split('; ');

		var pluses = /\+/g;

		for(var i = 0, l = cookies.length; i < l; i++){

			var parts = cookies[i].split('=');

			if(decodeURIComponent(parts.shift().replace(pluses, ' ')) === key){

				return decodeURIComponent(parts.join('=').replace(pluses, ' '));
			}
		}

		return undefined;
	},


	/**
	 * Deletes the specified cookie from browser. Note that the cookie will only be deleted if belongs to the same path as specified.
	 * 
	 * @static
	 * 
	 * @param {string} key The name of the cookie we want to delete
	 * @param {string} path Define the path where the cookie is set. By default it is the whole domain: '/'. If the cookie is not set on this path, we must pass the cookie domain or the delete will fail.
	 * 
	 * @returns {boolean} True if cookie was deleted or false if cookie could not be deleted or was not found.
	 */
	deleteCookie : function(key, path){

		var validationManager = new org_turbocommons_src_main_js_managers.ValidationManager();

		// Empty key means an exception
		if(!validationManager.isString(key) || !validationManager.isFilledIn(key)){

			throw new Error("CookiesUtils.deleteCookie: key must be defined");
		}

		if(this.getCookie(key) !== undefined){

			this.setCookie(key, '', -1, path);

			return true;
		}

		return false;
	}
};"use strict";

/**
 * TurboCommons is a general purpose and cross-language library that implements frequently used and generic software development tasks.
 *
 * Website : -> http://www.turbocommons.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2015 Edertone Advanded Solutions (08211 Castellar del Vallès, Barcelona). http://www.edertone.com
 */

/** @namespace */
var org_turbocommons_src_main_js_utils = org_turbocommons_src_main_js_utils || {};


/**
 * Class that helps with the most common file system operations
 * 
 * @class
 */
org_turbocommons_src_main_js_utils.FileSystemUtils = {


	/**
	 * Gives us the current OS directory separator character, so we can build cross platform file paths
	 * 
	 * @static
	 * 
	 * @returns string The current OS directory separator character
	 */
	getDirectorySeparator : function(){

		// NOTE: Js is not able to know the OS directory separator character,
		// so we return a universally valid one. This may be improved by detecting the
		// current OS and returning its related separator...
		return '/';
	}
};"use strict";

/**
 * TurboCommons is a general purpose and cross-language library that implements frequently used and generic software development tasks.
 *
 * Website : -> http://www.turbocommons.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2015 Edertone Advanded Solutions (08211 Castellar del Vallès, Barcelona). http://www.edertone.com
 */

/** @namespace */
var org_turbocommons_src_main_js_utils = org_turbocommons_src_main_js_utils || {};


/**
 * Utilities related with manipulating HTML elements
 * 
 * <pre><code> 
 * This is a static class, so no instance needs to be created.
 * Usage example:
 * 
 * var ns = org_turbocommons_src_main_js_utils;
 * 
 * var ids = ns.HtmlUtils.findDuplicateIds();
 * 
 * var id = ns.HtmlUtils.generateUniqueId(element);
 * ...
 * </code></pre>
 * 
 * @requires jQuery
 * @class
 */
org_turbocommons_src_main_js_utils.HtmlUtils = {


	/**
	 * Check if the specified id exists on the current document.  
	 * 
	 * @static
	 * 
	 * @param {string} html identifier we want to find on the current document
	 * 
	 * @returns {boolean} true if the specified id already exists on the current page or false if not. 
	 */
	idExists : function(id){

		return $("#" + id).length > 0;
	},


	/**
	 * Looks on the current html document to check if any duplicate element exists. In case any duplicate id is found, an error will be raised  
	 * 
	 * @static
	 * 
	 * @returns {boolean} False if no duplicate ids where found on the current page. If a duplicate id is found, an exception will be thrown showing the duplicated id name
	 */
	findDuplicateIds : function(){

		$('[id]').each(function(){

			var ids = $('[id="' + this.id + '"]');

			if(ids.length > 1 && ids[0] == this){

				throw new Error("HtmlUtils.findDuplicateIds - Duplicate id found on Html document: " + this.id);
			}

		});

		return false;
	},


	/**
	 * Creates a unique id value that can be used on an HTML element, totally colision safe. This means no other html element on the current document will have the same id as the generated one. 
	 * 
	 * @static
	 * 
	 * @param {string} prefix If we want to give a meaningful prefix to the generated id, so it is easier to identify it on the source code, we can set it here. The result will be something like `prefix-XXXXXXXXXX'
	 *
	 * @returns {boolean} A generated id in the form id-XXXXX (if no prefix specified) or prefix-XXXXXX that is verified to not exist on any other part of the document.
	 */
	generateUniqueId : function(prefix){

		// Set default values if they are not defined
		prefix = prefix === undefined ? 'id' : prefix;

		// Generate the random id and verify that it does not exist
		do{

			var id = prefix + '-' + Math.random().toString(36).substr(2, 16);

		}while($("#" + id).length > 0);

		return id;
	},


	/**
	 * Replace all the occurences of a string with the given text, directly inside the contents of the specified page element.
	 * 
	 * @static
	 *  
	 * @param {string} search The text we are searching to be replaced
	 * @param {string} replace The text that will replace the search text if found
	 * @param {object} element $("body") by default. A jquery object representing the page element where replacement will be performed. If not specified replacement will be performed on all the current html document.
	 *
	 * @returns void
	 */
	replaceTextOnElement : function(search, replace, element){

		if(search === undefined){

			throw new Error("HtmlUtils.replaceTextOnElement - Text to be replaced is undefined");
		}

		if(replace === undefined){

			throw new Error("HtmlUtils.replaceTextOnElement - Replacement text is undefined");
		}

		// Set optional parameters default values
		element = (element === undefined) ? $("body") : element;

		element.html(element.html().replace(search, replace));
	},


	/**
	 * Totally disables a form and all of its elements
	 * 
	 * @static
	 * 
	 * @param {object} form A jquery object representing the form to disable. We can pass an htm form element, or also a div containing inputs, buttons, and so.
	 *
	 * @returns void
	 */
	disableForm : function(form){

		// Apply a little alpha
		form.css('opacity', 0.7);

		// Disable all the form elements
		form.find(":input").attr('disabled', true);
		form.find(":submit").attr('disabled', true);
	},


	/**
	 * Re enable a form previously disabled with disableForm method
	 * 
	 * @static
	 * 
	 * @param {object} form A jquery object representing the form to enable. We can pass an htm form element, or also a div containing inputs, buttons, and so.
	 * 
	 * @returns void
	 */
	enableForm : function(form){

		// Restore form opacity
		form.css('opacity', '');

		// Enable all the form elements again
		form.find(":input").attr('disabled', false);
		form.find(":submit").attr('disabled', false);
	},


	/**
	 * Clears all the inputs, textareas, etc, on the specified form.
	 * 
	 * @static
	 * 
	 * @param {object} form A jquery object representing the form to clear. We can pass an htm form element, or also a div containing inputs, buttons, and so.
	 * 
	 * @returns void
	 */
	clearForm : function(form){

		form.find(":text").each(function(){

			$(this).val("");

		});

		form.find(":password").each(function(){

			$(this).val("");

		});
	},


	/**
	 * Send the data contained on the specified form to the specified remote url. This method is normally used on the action="" attribute on an html form, but we can use it with any html container that includes form elements like inputs and so.<br>
	 * This is the usual definition for a form that uses this method:<br><br>
	 * 
	 *  &lt;form id="form"<br>
			method="POST"<br>
			data-validationError="&lt;?php echo LOC_VALIDATION_PLEASE_REVIEW_FORM ?&gt;"<br>
			data-formSentMessage="&lt;?php echo LOC_VALIDATION_THANKS_FOR_CONTACTING ?&gt;"<br>
			data-formSendErrorMessage="&lt;?php echo LOC_VALIDATION_ERROR_SENDING_FORM_TRY_AGAIN ?&gt;"<br>
			onsubmit="return (new ValidationManager()).isHtmlFormValid($('#form'))"<br>
			action="javascript:HtmlUtils.submitForm($('#form'), '&lt;?php App::echoUrl('php/http/ContactFormSend.php') ?&gt;')"&gt;<br><br>

			&lt;p&gt;&lt;?php echo LOC_FORMS_NAME_SURNAMES ?&gt;:&lt;/p&gt;<br>
			&lt;input id="name" type="text" data-validationType="required minLen-3" /&gt;<br><br>

			&lt;p&gt;&lt;?php echo LOC_FORMS_MAIL ?&gt;:&lt;/p&gt;<br>
			&lt;input id="mail" type="text" data-validationType="required mail" /&gt;<br><br>

			&lt;p&gt;&lt;?php echo LOC_FORMS_PHONE ?&gt;:&lt;/p&gt;<br>
			&lt;input id="phone" type="text" data-validationType="required phone" /&gt;<br><br>

			&lt;p&gt;&lt;?php echo LOC_FORMS_MESSAGE ?&gt;:&lt;/p&gt;<br>
			&lt;textarea id="message" data-validationType="required minLen-5"&gt;&lt;/textarea&gt;<br><br>

			&lt;input id="submit" type="submit" value="&lt;?php echo LOC_FORMS_SEND ?&gt;" /&gt;<br>

	 *	&lt;/form&gt;
	 * 
	 * @static
	 * 
	 * @param {object} form A jquery object representing the html form to submit, or any other html container with form elements inside it
	 * @param {string} url The url that will process the form sending. Response for this url must use the standard server result structure, where state == '0' means sending was ok.
	 * @param {string} sentAction Tells what operation must be done after sending is ok. Can have one of the following values:<br>
	 * &emsp;&emsp;'' means we will look for the data-formSentMessage attribute on the form element. If attribute contains text, an alert will be shown with its contents. Otherwise, a generic text will be shown<br>
	 * &emsp;&emsp;'Some text' value will be shown as an alert<br>
	 * &emsp;&emsp;'A function' will be called after successful sending. Url response data will be passed to this method as an object
	 * @param {string} errorAction The action to execute when the form sending or http request failed. Format is exactly the same as sentAction (using data-formSendErrorMessage attribute on the form element)
	 * @param {boolean} reset True by default. If enabled, the form will be reset after being correctly sent.
	 * 
	 * @returns void
	 */
	submitForm : function(form, url, sentAction, errorAction, reset){

		// Set optional parameters default values
		sentAction = (sentAction === undefined) ? form.attr("data-formSentMessage") : sentAction;
		errorAction = (errorAction === undefined) ? form.attr("data-formSendErrorMessage") : errorAction;
		reset = (reset === undefined) ? true : reset;

		// Set the action default texts if nothing could be retrieved
		if(sentAction == '' || sentAction === undefined){

			sentAction = 'Form ok';
		}

		if(errorAction == '' || errorAction === undefined){

			errorAction = 'Form Error';
		}

		// Set a wait cursor for the body
		var bodyCursor = $("body").css('cursor');

		$("body").css('cursor', 'wait');

		// Disable all the form elements
		HtmlUtils.disableForm(form);

		// If the specified element is an HTML form, we will use its defined method. Otherwise we will use post.
		var method = (form.is("form")) ? form.attr('method') : 'POST';

		// Perform the http request to the destination url
		$.ajax({
			type : method,
			url : url,
			data : SerializationUtils.formToObject(form),
			success : function(data){

				// Restore the body cursor state
				$("body").css('cursor', bodyCursor);

				data = SerializationUtils.xmlToObject(data);

				var action = errorAction;

				if(data.state == '0'){

					action = sentAction;

					if(reset){

						if((form.is("form"))){

							form[0].reset();

						}else{

							HtmlUtils.clearForm(form);
						}
					}
				}

				// Execute the sent action depending on if it's a string or a method
				if(typeof action == 'string' || action instanceof String){

					alert(action);
				}

				if(typeof action == "function"){

					action.apply(data);
				}

				HtmlUtils.enableForm(form);
			},
			error : function(data){

				// Restore the body cursor state
				$("body").css('cursor', bodyCursor);

				// Execute the error action depending on if it's a string or a method
				if(typeof errorAction == 'string' || errorAction instanceof String){

					alert(errorAction);
				}

				if(typeof errorAction == "function"){

					errorAction.apply(SerializationUtils.xmlToObject(data));
				}

				HtmlUtils.enableForm(form);
			}
		});
	},
};"use strict";

/**
 * TurboCommons is a general purpose and cross-language library that implements frequently used and generic software development tasks.
 *
 * Website : -> http://www.turbocommons.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2015 Edertone Advanded Solutions (08211 Castellar del Vallès, Barcelona). http://www.edertone.com
 */

/** @namespace */
var org_turbocommons_src_main_js_utils = org_turbocommons_src_main_js_utils || {};


/**
 * Utilities related with screen layout and positioning elements on the page or view
 * 
 * <pre><code> 
 * This is a static class, so no instance needs to be created.
 * Usage example:
 * 
 * var ns = org_turbocommons_src_main_js_utils;
 * 
 * var maxIndex = ns.LayoutUtils.getMaxZIndex();
 * 
 * ns.LayoutUtils.moveToFront(element);
 * ...
 * </code></pre>
 * 
 * @requires jQuery
 * @class
 */
org_turbocommons_src_main_js_utils.LayoutUtils = {


	/**
	 * Calculates the maximum z-index value for the elements specified by the selector parameter. 
	 * If no selector specified, the maximum z-index will be calculated for all the elements on the current page.
	 * IMPORTANT: this method may be a bit heavy, as it loops on a lot of elements, so use it carefully
	 * NOTE: Only elements that have a position != static are taken into consideration.<br><br>
	 * Soultion taken from http://stackoverflow.com/questions/1118198/how-can-you-figure-out-the-highest-z-index-in-your-document
	 * 
	 * @static
	 * 
	 * @param {string} selector '*' by default, a jquery selector string that will be used to select the elements for which the maximum z-index will be calculated. 
	 * 
	 * @returns {int} The maximum z-index value found. 
	 */
	getMaxZIndex : function(selector){

		// Set default values if they are not defined
		selector = selector === undefined ? '*' : selector;

		var highest = Math.max.apply(null, $.map($(selector), function(e){

			if($(e).css('position') != 'static'){

				return parseInt($(e).css('z-index')) || 1;
			}
		}));

		return highest;
	},


	/**
	 * Moves the specified element to the front by updating its z-index if necessary. Note that z-index only works with "position:absolute", "position:relative" and "position:fixed"
	 * IMPORTANT: this method may be a bit heavy, as it loops on a lot of elements, so use it carefully
	 * 
	 * @static
	 * 
	 * @param {object} element A jquery object representing the element that must be moved to the front.
	 * 
	 * @returns {int} The element z-index after being moved to the front
	 */
	moveToFront : function(element){

		var zIndex = this.getMaxZIndex() + 1;

		element.css("z-index", zIndex);

		return zIndex;
	},


	/**
	 * Check if the specified global coordinates fall inside the specified element
	 * 
	 * @static
	 * 
	 * @param {object} element A jquery element that will be used to check if the specified coordinates fall inside it, for its current position
	 * @param {int} x The global X coordinate relative to the left corner of the browser window
	 * @param {int} y The global Y coordinate relative to the top corner of the browser window
	 * 
	 * @returns {Boolean} True if the global x and y coordinates specified fall inside the specified element or false otherwise
	 */
	isElementLocatedAt : function(element, x, y){

		// Get the element size
		var elementWidth = element.outerWidth();
		var elementHeight = element.outerHeight();

		// Get the element left and top coordinates
		var elementLeft = element.offset().left;
		var elementTop = element.offset().top;

		if(x >= elementLeft && x <= elementLeft + elementWidth){

			if(y >= elementTop && y <= elementTop + elementHeight){

				return true;
			}
		}

		return false;
	},


	/**
	 * Sets the width for the specified element relatively to the specified reference.
	 * 
	 * @static
	 * 
	 * @param {object} element A jquery object that represents the element that we want resize (in width)
	 * @param {object} reference A jquery object that will be measured to resize the width of the specified element (Note that full width will be calculated, including paddings).
	 * @param {int} percent 100 by default. A value that will represent the percentual value relative to the reference element. By default the same as the reference (100)  		
	 *
	 * @return void
	 */
	setWidthRelativeTo : function(element, reference, percent){

		// Set default values if they are not defined
		percent = percent === undefined ? 100 : percent;

		element.width(percent * reference.outerWidth() / 100);
	},


	/**
	 * Sets the height for the specified element relatively to the specified reference.
	 * 
	 * @static
	 * 
	 * @param {object} element A jquery object that represents the element that we want resize (in height)
	 * @param {object} reference A jquery object that will be measured to resize the height of the specified element (Note that full height will be calculated, including paddings).
	 * @param {int} percent 100 by default. A value that will represent the percentual value relative to the reference element. By default the same as the reference (100)  		
	 *
	 * @return void
	 */
	setHeightRelativeTo : function(element, reference, percent){

		// Set default values if they are not defined
		percent = percent === undefined ? 100 : percent;

		element.height(percent * reference.outerHeight() / 100);
	},


	/**
	 * Centers the given element based on the specified settings: Referred to the window, to another element, to a coordinate, etc... 
	 * Multiple settings can be used to define how the element must be centered 
	 * 
	 * @static
	 * 
	 * @param {object} element A jquery object that represents the element that we want to center. Note that its position value must be "absolute" or "fixed"
	 * @param {object} reference '' by default. The given element will be centered differently, depending on this value:<br>
	 * 		&emsp;- Empty '' value: The element will be centered relative to the main browser window<br>
	 * 		&emsp;- Jquery object: The element will be centered relative to the specified jquery object<br>
	 * 		&emsp;- Array with 4 values: The element will be centered relative to an imaginary object with coordinates and size: [x, y, width, height]
	 * @param {string} mode 'center center' by default. A string 'N M' with the following possible values:<br>
	 * 		&emsp;- N: Defines the centering on the X axis, and must have one of the following values:<br>
	 * 		&emsp;&emsp;none: To avoid modifying the horizontal layout of the element<br>
	 * 		&emsp;&emsp;leftOut: To layout the element outside the left border of the reference<br>
	 * 		&emsp;&emsp;left: To layout the element attached to the left border of the reference, but from the inside<br>
	 * 		&emsp;&emsp;center: To layout the element at the horizontal center of the reference<br>
	 * 		&emsp;&emsp;right: To layout the element attached to the right border of the reference, but from the inside<br>
	 * 		&emsp;&emsp;rightOut: To layout the element outside the right border of the reference<br>
	 * 		&emsp;- M: Defines the centering on the Y axis, and must have one of the following values:<br>
	 * 		&emsp;&emsp;none: To avoid modifying the vertical layout of the element<br>
	 * 		&emsp;&emsp;topOut: To layout the element above the top border of the reference<br>
	 * 		&emsp;&emsp;top: To layout the element attached to the top border of the reference, but from the inside<br>
	 * 		&emsp;&emsp;center: To layout the element at the vertical center of the reference<br>
	 * 		&emsp;&emsp;bottom: To layout the element attached to the lower border of the reference, but from the inside<br>
	 * 		&emsp;&emsp;bottomOut: To layout the element below the lower border of the reference<br>
	 * 		Examples: 'left top' 'center center' 'rightOut bottom' ...
	 * @param {int} offsetX 0 by default Used to displace the horizontal center by the specified amount
	 * @param {int} offsetY 0 by default. Used to displace the vertical center by the specified amount
	 * @param {boolean} keepInsideViewPort True by default. Is used to force the element inside the main browser window area in case the centering process makes it partially invisible outside the browser window.
	 * 
	 * @return void
	 */
	centerElementTo : function(element, reference, mode, offsetX, offsetY, keepInsideViewPort){

		// Set default values if they are not defined
		reference = (reference instanceof jQuery || $.isArray(reference)) ? reference : undefined;
		mode = mode === undefined ? 'center center' : mode;
		offsetX = offsetX === undefined ? 0 : offsetX;
		offsetY = offsetY === undefined ? 0 : offsetY;
		keepInsideViewPort = keepInsideViewPort === undefined ? true : keepInsideViewPort;

		// Check if the element to be centered exists.
		if(element.length != 1){

			throw new Error("LayoutUtils.centerElement - Element to center does not exist or is not a unique object");
		}

		// Element to center must be absolte or fixed positioned, otherwise centering it is nonsense
		if(element.css('position') != 'absolute' && element.css('position') != 'fixed'){

			throw new Error("LayoutUtils.centerElement - Element to center must have absolute or fixed value for css position property, but is " + element.css('position') + ". Element contents: " + element.html());
		}

		// Check if the reference element exists.
		if(reference instanceof jQuery){

			if(reference.length != 1){

				throw new Error("LayoutUtils.centerElement - Reference element does not exist or is not a unique object");
			}
		}

		// Margins must be removed on the element to center
		element.css("margin", 0);

		// Get the element size
		var elementWidth = element.outerWidth();
		var elementHeight = element.outerHeight();

		// If the element position is fixed, window references are simply 0
		var windowLeftForFixed = (element.css('position') == 'fixed') ? 0 : $(window).scrollLeft();
		var windowTopForFixed = (element.css('position') == 'fixed') ? 0 : $(window).scrollTop();

		// Get the reference element size (or the main window if no reference element specified)
		var referenceWidth = $.isArray(reference) ? reference[2] : (reference === undefined) ? $(window).width() : reference.outerWidth();
		var referenceHeight = $.isArray(reference) ? reference[3] : (reference === undefined) ? $(window).height() : reference.outerHeight();

		// Get the reference element coordinates (or the main window ones)
		var referenceLeft = $.isArray(reference) ? reference[0] : (reference === undefined) ? windowLeftForFixed : reference.offset().left;
		var referenceTop = $.isArray(reference) ? reference[1] : (reference === undefined) ? windowTopForFixed : reference.offset().top;

		// These variables will store the final calculated element coordiantes
		var elementLeft = 0;
		var elementTop = 0;

		// Perform the horizontal centering of the element
		switch(mode.split(' ')[0]){

			case 'none':
				elementLeft = 'none';
				break;

			case 'leftOut':
				elementLeft = offsetX + referenceLeft - elementWidth;
				break;

			case 'left':
				elementLeft = offsetX + referenceLeft;
				break;

			case 'center':
				elementLeft = offsetX + referenceLeft + (referenceWidth - elementWidth) / 2;
				break;

			case 'right':
				elementLeft = offsetX + referenceLeft + referenceWidth - elementWidth;
				break;

			case 'rightOut':
				elementLeft = offsetX + referenceLeft + referenceWidth;
				break;

			default:
				throw new Error("LayoutUtils.centerElement - mode parameter value is wrong");
		}

		// Perform the vertical centering of the element
		switch(mode.split(' ')[1]){

			case 'none':
				elementTop = 'none';
				break;

			case 'topOut':
				elementTop = offsetY + referenceTop - elementHeight;
				break;

			case 'top':
				elementTop = offsetY + referenceTop;
				break;

			case 'center':
				elementTop = offsetY + referenceTop + (referenceHeight - elementHeight) / 2;
				break;

			case 'bottom':
				elementTop = offsetY + referenceTop + referenceHeight - elementHeight;
				break;

			case 'bottomOut':
				elementTop = offsetY + referenceTop + referenceHeight;
				break;

			default:
				throw new Error("LayoutUtils.centerElement - mode parameter value is wrong");
		}

		// Check that the element does not fall outside the screen
		if(keepInsideViewPort){

			if(elementLeft < windowLeftForFixed){

				elementLeft = windowLeftForFixed;
			}

			if(elementLeft + elementWidth > windowLeftForFixed + $(window).width()){

				elementLeft = windowLeftForFixed + $(window).width() - elementWidth;
			}

			if(elementTop < windowTopForFixed){

				elementTop = windowTopForFixed;
			}

			if(elementTop + elementHeight > windowTopForFixed + $(window).height()){

				elementTop = windowTopForFixed + $(window).height() - elementHeight;
			}
		}

		// Position the element where it's been calculated
		if(elementLeft !== 'none'){

			element.css("left", elementLeft + "px");
		}

		if(elementTop !== 'none'){

			element.css("top", elementTop + "px");
		}
	}
};"use strict";

/**
 * TurboCommons is a general purpose and cross-language library that implements frequently used and generic software development tasks.
 *
 * Website : -> http://www.turbocommons.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2015 Edertone Advanded Solutions (08211 Castellar del Vallès, Barcelona). http://www.edertone.com
 */

/** @namespace */
var org_turbocommons_src_main_js_utils = org_turbocommons_src_main_js_utils || {};


/**
 * Utilities to perform common object operations
 * 
 * @class
 */
org_turbocommons_src_main_js_utils.ObjectUtils = {


	/**
	 * Get the list of literals for a given object. Note that only 1rst depth keys are providen
	 * 
	 * @static
	 * 
	 * @param {object} object A valid object
	 *
	 * @returns {array} List of strings with the first level object key names in the same order as defined on the object instance
	 */
	getKeys : function(object){

		var res = [];
		var validationManager = new org_turbocommons_src_main_js_managers.ValidationManager();

		if(!validationManager.isObject(object)){

			throw new Error("ObjectUtils.getKeys: Provided parameter must be an object");
		}

		for( var key in object){

			res.push(key);
		}

		return res;
	},


	/**
	 * Check if two provided objects are identical
	 * 
	 * @static
	 * 
	 * @param {object} object1 First object to compare
	 * @param {object} object2 Second object to compare
	 *
	 * @returns {boolean} true if objects are exactly the same, false if not
	 */
	isEqualTo : function(object1, object2){

		// Alias namespaces
		var ut = org_turbocommons_src_main_js_utils;

		var validationManager = new org_turbocommons_src_main_js_managers.ValidationManager();

		// Both provided values must be objects or an exception will be launched
		if(!validationManager.isObject(object1) || !validationManager.isObject(object2)){

			throw new Error("ObjectUtils.isEqualTo: Provided parameters must be objects");
		}

		var keys1 = this.getKeys(object1);
		var keys2 = this.getKeys(object2);

		// Compare keys can save a lot of time 
		if(!ut.ArrayUtils.isEqualTo(keys1, keys2)){

			return false;
		}

		// Loop all the keys and verify values are identical
		for(var i = 0; i < keys1.length; i++){

			if(!validationManager.isEqualTo(object1[keys1[i]], object2[keys2[i]])){

				return false;
			}
		}

		return true;
	}
};"use strict";

/**
 * TurboCommons is a general purpose and cross-language library that implements frequently used and generic software development tasks.
 *
 * Website : -> http://www.turbocommons.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2015 Edertone Advanded Solutions (08211 Castellar del Vallès, Barcelona). http://www.edertone.com
 */

/** @namespace */
var org_turbocommons_src_main_js_utils = org_turbocommons_src_main_js_utils || {};


/**
 * Contains methods that allow us to convert data from one data format or type to another data format or type
 * 
 * <pre><code> 
 * This is a static class, so no instance needs to be created.
 * Usage example:
 * 
 * var ns = org_turbocommons_src_main_js_utils;
 * 
 * var result1 = ns.SerializationUtils.hashMapToClass(someObject);
 * var result2 = ns.SerializationUtils.classToXml(someClass);
 * ...
 * </code></pre>
 * 
 * @class
 */
org_turbocommons_src_main_js_utils.SerializationUtils = {


	hashMapToClass : function(hashMap, classInstance){

		// TODO - copy from php
	},


	javaPropertiesToObject : function(){

		// TODO - copy from php
	},


	stringToXml : function(){

		// TODO - copy from php
	},


	xmlToString : function(){

		// TODO - copy from php
	},

};"use strict";

/**
 * TurboCommons is a general purpose and cross-language library that implements frequently used and generic software development tasks.
 *
 * Website : -> http://www.turbocommons.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2015 Edertone Advanded Solutions (08211 Castellar del Vallès, Barcelona). http://www.edertone.com
 */

/** @namespace */
var org_turbocommons_src_main_js_utils = org_turbocommons_src_main_js_utils || {};


/**
 * The most common string processing and modification utilities.
 * 
 * <pre><code> 
 * This is a static class, so no instance needs to be created.
 * Usage example:
 * 
 * var ns = org_turbocommons_src_main_js_utils;
 * 
 * var result1 = ns.StringUtils.isEmpty('   ');
 * var result2 = ns.StringUtils.countWords('hello');
 * ...
 * </code></pre>
 * 
 * @class
 */
org_turbocommons_src_main_js_utils.StringUtils = {


	/**
	 * Tells if a specified string is empty. The string may contain empty spaces, and new line characters but have some lenght, and therefore be EMPTY.
	 * This method checks all these different conditions that can tell us that a string is empty.
	 * 
	 * @static
	 * 
	 * @param {string} string String to check
	 * @param {array} emptyChars List of strings that will be also considered as empty characters. For example, if we also want to define 'NULL' and '_' as empty string values, we can set this to ['NULL', '_']
	 *
	 * @returns {boolean} false if the string is not empty, true if the string contains only spaces, newlines or any other characters defined as "empty" values
	 */
	isEmpty : function(string, emptyChars){

		// Set optional parameters default values
		emptyChars = (emptyChars === undefined || emptyChars === null) ? [] : emptyChars;

		var aux = '';

		// Note that we are checking emptyness every time we do a replace to improve speed, avoiding unnecessary replacements.
		if(string == null || string == ""){

			return true;
		}

		// Throw exception if non string value was received
		var validationManager = new org_turbocommons_src_main_js_managers.ValidationManager();

		if(!validationManager.isString(string)){

			throw new Error("StringUtils.isEmpty: value is not a string");
		}

		// Replace all empty spaces
		if((aux = string.replace(/ /g, '')) == ''){

			return true;
		}

		// Replace all new line characters
		if((aux = aux.replace(/\n/g, '')) == ''){

			return true;
		}

		if((aux = aux.replace(/\r/g, '')) == ''){

			return true;
		}

		if((aux = aux.replace(/\t/g, '')) == ''){

			return true;
		}

		// Replace all extra empty characters
		for(var i = 0; i < emptyChars.length; i++){

			if((aux = aux.replace(new RegExp(emptyChars[i], 'g'), '')) == ''){

				return true;
			}
		}

		return false;
	},


	isCamelCase : function(){

		// TODO - translate from php
	},


	isSnakeCase : function(){

		// TODO - translate from php
	},


	countStringOccurences : function(){

		// TODO - translate from php
	},


	countCapitalLetters : function(){

		// TODO - translate from php
	},


	/**
	 * Count the number of words that exist on the given string
	 *
	 * @static
	 * 
	 * @param string The string which words will be counted
	 * @param wordSeparator ' ' by default. The character that is considered as the word sepparator
	 *
	 * @returns int The number of words (elements divided by the wordSeparator value) that are present on the string
	 */
	countWords : function(string, wordSeparator){

		// Set optional parameters default values
		wordSeparator = (wordSeparator === undefined) ? ' ' : wordSeparator;

		var count = 0;
		var lines = this.getLines(string);

		for(var i = 0; i < lines.length; i++){

			var words = lines[i].split(wordSeparator);

			for(var j = 0; j < words.length; j++){

				if(!this.isEmpty(words[j])){

					count++;
				}
			}
		}

		return count;
	},


	/**
	 * Method that limits the lenght of a string and optionally appends informative characters like ' ...'
	 * to inform that the original string was longer.
	 * 
	 * @static
	 * 
	 * @param string String to limit
	 * @param limit Max number of characters
	 * @param limiterString If the specified text exceeds the specified limit, the value of this parameter will be added to the end of the result. The value is ' ...' by default.
	 *
	 * @returns string The specified string but limited in length if necessary. Final result will never exceed the specified limit, also with the limiterString appended.
	 */
	limitLen : function(string, limit, limiterString){

		// Set optional parameters default values
		limit = (limit === undefined) ? 100 : limit;
		limiterString = (limiterString === undefined) ? ' ...' : limiterString;

		var validationManager = new org_turbocommons_src_main_js_managers.ValidationManager();

		if(!validationManager.isNumeric(limit)){

			throw new Error("StringUtils.limitLen: limit must be a numeric value");
		}

		if(!validationManager.isString(string)){

			return '';
		}

		if(string.length <= limit){

			return string;
		}

		if(limiterString.length > limit){

			return limiterString.substring(0, limit);

		}else{

			return string.substring(0, limit - limiterString.length) + limiterString;
		}
	},


	/**
	 * Extracts the domain name from a given url (excluding subdomain). 
	 * For example: http://subdomain.google.com/test/ will result in 'google.com'
	 * 
	 * @static
	 * 
	 * @param {string} url A string containing an URL
	 * 
	 * @returns {string} The domain from the given string (excluding the subdomain if exists)
	 */
	getDomainFromUrl : function(url){

		var hostName = this.getHostNameFromUrl(url);

		hostName = hostName.split('.');

		if(hostName.length > 2){

			hostName.shift();
		}

		return hostName.join('.');
	},


	/**
	 * Extracts the hostname (domain + subdomain) from a given url.
	 * For example: http://subdomain.google.com/test/ will result in 'subdomain.google.com'
	 * 
	 * @static
	 * 
	 * @param {string} url A string containing an URL
	 * 
	 * @returns {string} The domain and subdomain from the given string (subdomain.domain.com)
	 */
	getHostNameFromUrl : function(url){

		var validationManager = new org_turbocommons_src_main_js_managers.ValidationManager();

		if(!validationManager.isFilledIn(url) || !validationManager.isUrl(url)){

			return '';
		}

		var tmp = document.createElement('a');

		tmp.href = url;

		// Validate domain contains a valid number of dots
		var dotsCount = (tmp.host.match(/\./g) || []).length;

		if(dotsCount <= 0 || dotsCount > 2){

			return '';
		}

		return tmp.host;
	},


	/**
	 * Extracts all the lines from the given string and outputs an array with each line as an element.
	 * It does not matter which line separator's been used (\n, \r, Windows, linux...). All source lines will be correctly extracted.
	 * 
	 * @static
	 * 
	 * @param {string} string Text containing one or more lines that will be converted to an array with each line on a different element.
	 * @param {array} filters One or more regular expressions that will be used to filter unwanted lines. Lines that match any of the
	 *  filters will be excluded from the result. By default, all empty lines are ignored (those containing only newline, blank, tabulators, etc..).
	 *
	 * @returns {array} A list with all the string lines sepparated as different array elements.
	 */
	getLines : function(string, filters){

		// Set optional parameters default values
		filters = (filters === undefined) ? [/\s+/g] : filters;

		var validationManager = new org_turbocommons_src_main_js_managers.ValidationManager();

		var res = [];

		// Validate we are receiving a string
		if(!validationManager.isString(string)){

			return res;
		}

		var tmp = string.split(/\r?\n/);

		for(var i = 0; i < tmp.length; i++){

			// Apply specified filters
			if(validationManager.isString(tmp[i])){

				// TODO: this is not exactly the same behaviour as the php version.
				// In the php version, we can define an array of filters and if any of the filters matches the current line,
				// it will not be added to the result. This version only accepts the first element of the filters array, it must be fixed!
				if(tmp[i].replace(filters[0], '') != ''){

					res.push(tmp[i]);
				}
			}
		}

		return res;
	},


	/**
	 * Generates an array with a list of common words from the specified text.
	 * The list will be sorted so the words that appear more times on the string are placed first.
	 * 
	 * @static
	 * 
	 * @param {string} string Piece of text that contains the keywords we want to extract
	 * @param {int} max The maxium number of keywords that will appear on the result. If set to null, all unique words on the given text will be returned
	 * @param {int} longerThan The minimum number of chars for the keywords to find. This is useful to filter some irrelevant words like: the, it, me, ...
	 * @param {int} shorterThan The maximum number of chars for the keywords to find
	 * @param {boolean} ignoreNumericWords Tells the method to skip words that represent numeric values on the result. False by default
	 *
	 * @returns {array} The list of keywords that have been extracted from the given text
	 */
	getKeyWords : function(string, max, longerThan, shorterThan, ignoreNumericWords){

		// Set optional parameters default values
		max = (max === undefined) ? 25 : max;
		longerThan = (longerThan === undefined) ? 3 : longerThan;
		shorterThan = (shorterThan === undefined) ? 15 : shorterThan;
		ignoreNumericWords = (ignoreNumericWords) ? false : ignoreNumericWords;

		// TODO: translate from php
	},


	/**
	 * Given a filesystem path which contains some file, this method extracts the filename plus its extension.
	 * Example: "//folder/folder2/folder3/file.txt" -> results in "file.txt"
	 * 
	 * @static
	 * 
	 * @param {string} path An OS system path containing some file
	 *
	 * @returns {string} The extracted filename and extension, like: finemane.txt
	 */
	getFileNameWithExtension : function(path){

		var osSeparator = org_turbocommons_src_main_js_utils.FileSystemUtils.getDirectorySeparator();

		if(this.isEmpty(path)){

			return '';
		}

		path = this.formatPath(path);

		if(path.indexOf(osSeparator) >= 0){

			path = path.substr(path.lastIndexOf(osSeparator) + 1);
		}

		return path;
	},


	/**
	 * Given a filesystem path which contains some file, this method extracts the filename WITHOUT its extension.
	 * Example: "//folder/folder2/folder3/file.txt" -> results in "file"
	 *
	 * @static
	 * 
	 * @param {string} path An OS system path containing some file
	 *
	 * @returns {string} The extracted filename WITHOUT extension, like: finemane
	 */
	getFileNameWithoutExtension : function(path){

		if(this.isEmpty(path)){

			return '';
		}

		path = this.getFileNameWithExtension(path);

		if(path.indexOf('.') >= 0){

			path = path.substr(0, path.lastIndexOf('.'));
		}

		return path;
	},


	/**
	 * Given a filesystem path which contains some file, this method extracts only the file extension
	 * Example: "//folder/folder2/folder3/file.txt" -> results in "txt"
	 * 
	 * @static
	 * 
	 * @param {string} path An OS system path containing some file
	 *
	 * @returns {string} The file extension WITHOUT the dot character. For example: jpg, png, js, exe ...
	 */
	getFileExtension : function(path){

		if(this.isEmpty(path)){

			return '';
		}

		// Find the extension by getting the last position of the dot character
		return path.substr(path.lastIndexOf('.') + 1);
	},


	/**
	 * Given an internet URL, this method extracts only the scheme part.
	 * Example: "http://google.com" -> results in "http"
	 * 
	 * @static
	 * 
	 * @see StringUtils.formatUrl, ValidationManager.isUrl
	 * 
	 * @param {string} url A valid internet url
	 *
	 * @returns {string} ('ftp', 'http', ...) if the url is valid or '' if the url is invalid
	 */
	getSchemeFromUrl : function(url){

		var validationManager = new org_turbocommons_src_main_js_managers.ValidationManager();

		if(url == null || url == undefined){

			return '';
		}

		if(!validationManager.isString(url)){

			throw new Error("StringUtils.getSchemeFromUrl: Specified value must be a string");
		}

		if(!validationManager.isUrl(url)){

			return '';
		}

		var res = url.split('://');

		return (res.length === 2) ? res[0] : '';
	},


	formatCase : function(){

		// TODO - translate from php
	},


	/**
	 * Given a raw string containing a file system path, this method will process it to obtain a path that
	 * is 100% format valid for the current operating system.
	 * Directory separators will be converted to the OS valid ones, no directory separator will be present
	 * at the end and duplicate separators will be removed.
	 * This method basically standarizes the given path so it does not fail for the current OS.
	 * 
	 * NOTE: This method will not check if the path is a real path on the current file system; it will only fix formatting problems
	 * 
	 * @static
	 * 
	 * @param path The path that must be formatted
	 *
	 * @returns string The correctly formatted path without any trailing directory separator
	 */
	formatPath : function(path){

		var validationManager = new org_turbocommons_src_main_js_managers.ValidationManager();

		var osSeparator = org_turbocommons_src_main_js_utils.FileSystemUtils.getDirectorySeparator();

		if(path == null || path == undefined){

			return '';
		}

		if(!validationManager.isString(path)){

			throw new Error("StringUtils.formatPath: Specified path must be a string");
		}

		// Replace all slashes on the path with the os default
		path = path.replace(/\//g, osSeparator);
		path = path.replace(/\\/g, osSeparator);

		// Remove duplicate path separator characters
		while(path.indexOf(osSeparator + osSeparator) >= 0){

			path = path.replace(osSeparator + osSeparator, osSeparator);
		}

		// Remove the last slash only if it exists, to prevent duplicate directory separator
		if(path.substr(path.length - 1) == osSeparator){

			path = path.substr(0, path.length - 1);
		}

		return path;
	},


	/**
	 * Given a raw string containing an internet URL, this method will process it to obtain a URL that is 100% format valid.
	 * 
	 * A Uniform Resource Locator (URL), commonly informally termed a web address is a reference to a web resource that specifies 
	 * its location on a computer network and a mechanism for retrieving it. URLs occur most commonly to reference web pages (http), 
	 * but are also used for file transfer (ftp), email (mailto), database access (JDBC), and many other applications.
	 * 
	 * Every HTTP URL conforms to the syntax of a generic URI. A generic URI is of the form: scheme:[//[user:password@]host[:port]][/]path[?query][#fragment]
	 * 
	 * @see https://en.wikipedia.org/wiki/Uniform_Resource_Locator#Syntax
	 * 
	 * @static
	 *
	 * @returns {string} The formated url string or the original string if it was not a valid url
	 */
	formatUrl : function(url){

		var validationManager = new org_turbocommons_src_main_js_managers.ValidationManager();

		if(url == null || url == undefined || url == ''){

			return '';
		}

		if(!validationManager.isString(url)){

			throw new Error("StringUtils.formatUrl: Specified value must be a string");
		}

		if(!validationManager.isFilledIn(url)){

			return url;
		}

		// Trim and replace all slashes on the url with the correct url slash
		url = url.trim();
		url = url.replace(/\//g, '/');
		url = url.replace(/\\/g, '/');

		// get the url scheme
		var scheme = this.getSchemeFromUrl(url);

		if(scheme === ''){

			if(validationManager.isUrl('http://' + url)){

				return 'http://' + url;
			}
		}

		return url;
	},


	/**
	 * TODO
	 * 
	 * @static
	 * 
	 */
	formatForFullTextSearch : function(string, wordSeparator){

		// TODO: Translate from PHP method
	},


	/**
	 * TODO
	 * 
	 * @static
	 * 
	 */
	generateRandomPassword : function(lenght, useuppercase){

		// TODO: Translate from PHP method
	},


	/**
	 * Converts all accent characters to ASCII characters on a given string.<br>
	 * This method is based on a stack overflow implementation called removeDiacritics
	 *
	 * @see http://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
	 * 
	 * @static
	 * 
	 * @param {string} string Text from which accents must be cleaned
	 *
	 * @returns {string} The given string with all accent and diacritics replaced by the respective ASCII characters.
	 */
	removeAccents : function(string){

		if(string == null){

			return '';
		}

		var defaultDiacriticsRemovalMap = [{
			'base' : 'A',
			'letters' : '\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F'
		}, {
			'base' : 'AA',
			'letters' : '\uA732'
		}, {
			'base' : 'AE',
			'letters' : '\u00C6\u01FC\u01E2'
		}, {
			'base' : 'AO',
			'letters' : '\uA734'
		}, {
			'base' : 'AU',
			'letters' : '\uA736'
		}, {
			'base' : 'AV',
			'letters' : '\uA738\uA73A'
		}, {
			'base' : 'AY',
			'letters' : '\uA73C'
		}, {
			'base' : 'B',
			'letters' : '\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181'
		}, {
			'base' : 'C',
			'letters' : '\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E'
		}, {
			'base' : 'D',
			'letters' : '\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779'
		}, {
			'base' : 'DZ',
			'letters' : '\u01F1\u01C4'
		}, {
			'base' : 'Dz',
			'letters' : '\u01F2\u01C5'
		}, {
			'base' : 'E',
			'letters' : '\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E'
		}, {
			'base' : 'F',
			'letters' : '\u0046\u24BB\uFF26\u1E1E\u0191\uA77B'
		}, {
			'base' : 'G',
			'letters' : '\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E'
		}, {
			'base' : 'H',
			'letters' : '\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D'
		}, {
			'base' : 'I',
			'letters' : '\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197'
		}, {
			'base' : 'J',
			'letters' : '\u004A\u24BF\uFF2A\u0134\u0248'
		}, {
			'base' : 'K',
			'letters' : '\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2'
		}, {
			'base' : 'L',
			'letters' : '\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780'
		}, {
			'base' : 'LJ',
			'letters' : '\u01C7'
		}, {
			'base' : 'Lj',
			'letters' : '\u01C8'
		}, {
			'base' : 'M',
			'letters' : '\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C'
		}, {
			'base' : 'N',
			'letters' : '\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4'
		}, {
			'base' : 'NJ',
			'letters' : '\u01CA'
		}, {
			'base' : 'Nj',
			'letters' : '\u01CB'
		}, {
			'base' : 'O',
			'letters' : '\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C'
		}, {
			'base' : 'OI',
			'letters' : '\u01A2'
		}, {
			'base' : 'OO',
			'letters' : '\uA74E'
		}, {
			'base' : 'OU',
			'letters' : '\u0222'
		}, {
			'base' : 'OE',
			'letters' : '\u008C\u0152'
		}, {
			'base' : 'oe',
			'letters' : '\u009C\u0153'
		}, {
			'base' : 'P',
			'letters' : '\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754'
		}, {
			'base' : 'Q',
			'letters' : '\u0051\u24C6\uFF31\uA756\uA758\u024A'
		}, {
			'base' : 'R',
			'letters' : '\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782'
		}, {
			'base' : 'S',
			'letters' : '\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784'
		}, {
			'base' : 'T',
			'letters' : '\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786'
		}, {
			'base' : 'TZ',
			'letters' : '\uA728'
		}, {
			'base' : 'U',
			'letters' : '\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244'
		}, {
			'base' : 'V',
			'letters' : '\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245'
		}, {
			'base' : 'VY',
			'letters' : '\uA760'
		}, {
			'base' : 'W',
			'letters' : '\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72'
		}, {
			'base' : 'X',
			'letters' : '\u0058\u24CD\uFF38\u1E8A\u1E8C'
		}, {
			'base' : 'Y',
			'letters' : '\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE'
		}, {
			'base' : 'Z',
			'letters' : '\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762'
		}, {
			'base' : 'a',
			'letters' : '\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250'
		}, {
			'base' : 'aa',
			'letters' : '\uA733'
		}, {
			'base' : 'ae',
			'letters' : '\u00E6\u01FD\u01E3'
		}, {
			'base' : 'ao',
			'letters' : '\uA735'
		}, {
			'base' : 'au',
			'letters' : '\uA737'
		}, {
			'base' : 'av',
			'letters' : '\uA739\uA73B'
		}, {
			'base' : 'ay',
			'letters' : '\uA73D'
		}, {
			'base' : 'b',
			'letters' : '\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253'
		}, {
			'base' : 'c',
			'letters' : '\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184'
		}, {
			'base' : 'd',
			'letters' : '\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A'
		}, {
			'base' : 'dz',
			'letters' : '\u01F3\u01C6'
		}, {
			'base' : 'e',
			'letters' : '\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD'
		}, {
			'base' : 'f',
			'letters' : '\u0066\u24D5\uFF46\u1E1F\u0192\uA77C'
		}, {
			'base' : 'g',
			'letters' : '\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F'
		}, {
			'base' : 'h',
			'letters' : '\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265'
		}, {
			'base' : 'hv',
			'letters' : '\u0195'
		}, {
			'base' : 'i',
			'letters' : '\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131'
		}, {
			'base' : 'j',
			'letters' : '\u006A\u24D9\uFF4A\u0135\u01F0\u0249'
		}, {
			'base' : 'k',
			'letters' : '\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3'
		}, {
			'base' : 'l',
			'letters' : '\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747'
		}, {
			'base' : 'lj',
			'letters' : '\u01C9'
		}, {
			'base' : 'm',
			'letters' : '\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F'
		}, {
			'base' : 'n',
			'letters' : '\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5'
		}, {
			'base' : 'nj',
			'letters' : '\u01CC'
		}, {
			'base' : 'o',
			'letters' : '\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275'
		}, {
			'base' : 'oi',
			'letters' : '\u01A3'
		}, {
			'base' : 'ou',
			'letters' : '\u0223'
		}, {
			'base' : 'oo',
			'letters' : '\uA74F'
		}, {
			'base' : 'p',
			'letters' : '\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755'
		}, {
			'base' : 'q',
			'letters' : '\u0071\u24E0\uFF51\u024B\uA757\uA759'
		}, {
			'base' : 'r',
			'letters' : '\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783'
		}, {
			'base' : 's',
			'letters' : '\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B'
		}, {
			'base' : 't',
			'letters' : '\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787'
		}, {
			'base' : 'tz',
			'letters' : '\uA729'
		}, {
			'base' : 'u',
			'letters' : '\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289'
		}, {
			'base' : 'v',
			'letters' : '\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C'
		}, {
			'base' : 'vy',
			'letters' : '\uA761'
		}, {
			'base' : 'w',
			'letters' : '\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73'
		}, {
			'base' : 'x',
			'letters' : '\u0078\u24E7\uFF58\u1E8B\u1E8D'
		}, {
			'base' : 'y',
			'letters' : '\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF'
		}, {
			'base' : 'z',
			'letters' : '\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763'
		}];

		var diacriticsMap = {};

		for(var i = 0; i < defaultDiacriticsRemovalMap.length; i++){

			var letters = defaultDiacriticsRemovalMap[i].letters;

			for(var j = 0; j < letters.length; j++){

				diacriticsMap[letters[j]] = defaultDiacriticsRemovalMap[i].base;
			}
		}

		return string.replace(/[^\u0000-\u007E]/g, function(a){

			return diacriticsMap[a] || a;
		});
	},
};