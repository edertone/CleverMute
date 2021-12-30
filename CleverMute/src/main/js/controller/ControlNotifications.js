"use strict";


/** @namespace */
var clevermute_src_main_js_controller = clevermute_src_main_js_controller || {};


/**
 * Operations related to the browser notifications to the user
 * 
 * @class
 */
clevermute_src_main_js_controller.ControlNotifications = {


    /**
     * Hide the specified notification
     */
    clearNotification : function(notificationId){

        chrome.notifications.clear(notificationId);
    },


    /**
     * Hide all notifications that may be currently visible to the user
     */
    clearAllNotifications : function(){

        chrome.notifications.getAll(function(notifications){

            for( var key in notifications){

                if(notifications.hasOwnProperty(key)){

                    chrome.notifications.clear(key);
                }
            }
        });
    },


    /**
     * Show the notification that tells the user that a domain's been manually unmuted, 
     * and request if it should be added to the white list forever
     */
    showAddToWhiteListNotification : function(tab){

        var domain = app.ut.StringUtils.getDomainFromUrl(tab.url);

        // Remove the url from blacklist
        app.listsManager.removeUrlFromPermanentBlackList(tab.url);

        chrome.notifications.create(tab.id.toString(), {
            type : 'basic',
            iconUrl : 'resources/shared/images/warning_icon_128.png',
            title : "ALLOWED AUDIO: " + domain.toUpperCase(),
            message : "The domain has been temporarily unmuted",
            contextMessage : "What should we do?",
            requireInteraction : false,
            isClickable : true,
            buttons : [{
                title : "NEVER MUTE"
            }]
        },

        function(){

            // Not required
        });
    },


    /**
     * Show the notification that lets the user unmute a currently muted site that wants to play audio
     */
    showMutedSiteNotification : function(tab){

        var domain = app.ut.StringUtils.getDomainFromUrl(tab.url);

        // Add the domain to black list, so if the user ignores the notification, it will not be asked again
        app.listsManager.addUrlToPermanentBlackList(tab.url);

        chrome.notifications.create(tab.id.toString(), {
            type : 'basic',
            iconUrl : 'resources/shared/images/warning_image_250.png',
            title : "AUDIO BLOCKED: " + domain.toUpperCase(),
            message : "The domain wants to play audio.",
            contextMessage : "What should we do?",
            requireInteraction : false,
            isClickable : true,
            buttons : [{
                title : "NEVER MUTE"
            }, {
                title : "ALLOW ONCE"
            }]
        },

        function(){

            // Not required
        });
    }
};