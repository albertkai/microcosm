//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
//                                                                      //
// If you are using Chrome, open the Developer Tools and click the gear //
// icon in its lower right corner. In the General Settings panel, turn  //
// on 'Enable source maps'.                                             //
//                                                                      //
// If you are using Firefox 23, go to `about:config` and set the        //
// `devtools.debugger.source-maps-enabled` preference to true.          //
// (The preference should be on by default in Firefox 24; versions      //
// older than 23 do not support source maps.)                           //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Accounts = Package['accounts-base'].Accounts;
var OAuth = Package.oauth.OAuth;
var Oauth = Package.oauth.Oauth;
var Random = Package.random.Random;
var ServiceConfiguration = Package['service-configuration'].ServiceConfiguration;
var Template = Package.templating.Template;
var UI = Package.ui.UI;
var Handlebars = Package.ui.Handlebars;
var HTML = Package.htmljs.HTML;
var Blaze = Package.blaze.Blaze;

/* Package-scope variables */
var VK;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/mrt:accounts-vk/lib/accounts_vk.js                                                             //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
Accounts.oauth.registerService('vk');                                                                      // 1
                                                                                                           // 2
if (Meteor.isClient) {                                                                                     // 3
    Meteor.loginWithVk = function(options, callback) {                                                     // 4
        // support a callback without options                                                              // 5
        if (! callback && typeof options === "function") {                                                 // 6
            callback = options;                                                                            // 7
            options = null;                                                                                // 8
        }                                                                                                  // 9
                                                                                                           // 10
        var credentialRequestCompleteCallback = Accounts.oauth.credentialRequestCompleteHandler(callback); // 11
        VK.requestCredential(options, credentialRequestCompleteCallback);                                  // 12
    };                                                                                                     // 13
} else {                                                                                                   // 14
    Accounts.addAutopublishFields({                                                                        // 15
        forLoggedInUser: ['services.vk'],                                                                  // 16
        forOtherUsers: [                                                                                   // 17
            'services.vk.id',                                                                              // 18
            'services.vk.nickname',                                                                        // 19
            'services.vk.gender'                                                                           // 20
        ]                                                                                                  // 21
    });                                                                                                    // 22
}                                                                                                          // 23
                                                                                                           // 24
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/mrt:accounts-vk/lib/vk_client.js                                                               //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
VK = {};                                                                                                   // 1
                                                                                                           // 2
VK.requestCredential = function (options, credentialRequestCompleteCallback) {                             // 3
                                                                                                           // 4
    if (!credentialRequestCompleteCallback && typeof options === 'function') {                             // 5
        credentialRequestCompleteCallback = options;                                                       // 6
        options = {};                                                                                      // 7
    }                                                                                                      // 8
                                                                                                           // 9
    var config = ServiceConfiguration.configurations.findOne({service: 'vk'});                             // 10
    if (!config) {                                                                                         // 11
        credentialRequestCompleteCallback && credentialRequestCompleteCallback(new ServiceConfiguration.ConfigError("Service not configured"));
        return;                                                                                            // 13
    }                                                                                                      // 14
                                                                                                           // 15
    var credentialToken = Random.id();                                                                     // 16
    var mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);                   // 17
    var display = mobile ? 'touch' : 'popup';                                                              // 18
    var scope = '';                                                                                        // 19
                                                                                                           // 20
    if (options && options.requestPermissions) {                                                           // 21
        scope = options.requestPermissions.join(',');                                                      // 22
    }                                                                                                      // 23
                                                                                                           // 24
    var loginUrl =                                                                                         // 25
        'https://oauth.vk.com/authorize' +                                                                 // 26
            '?client_id=' + config.appId +                                                                 // 27
            '&scope='     + scope +                                                                        // 28
            '&redirect_uri=' + Meteor.absoluteUrl('_oauth/vk?close=close', {replaceLocalhost: false}) +    // 29
            '&response_type=code' +                                                                        // 30
            '&display=' + display +                                                                        // 31
            '&state=' + credentialToken;                                                                   // 32
                                                                                                           // 33
    Oauth.initiateLogin(credentialToken, loginUrl, credentialRequestCompleteCallback);                     // 34
};                                                                                                         // 35
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/mrt:accounts-vk/lib/template.vk_configure.js                                                   //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
                                                                                                           // 1
Template.__define__("configureLoginServiceDialogForVk", (function() {                                      // 2
  var view = this;                                                                                         // 3
  return [ HTML.Raw("<p>\n        First, you'll need to register your client on VKontakte. Follow these steps:\n    </p>\n    "), HTML.OL("\n        ", HTML.Raw('<li>\n            Visit <a href="http://vk.com/editapp?act=create" target="_blank">http://vk.com/editapp?act=create</a>\n        </li>'), "\n        ", HTML.LI("\n            Set Callback URL to: ", HTML.SPAN({
    "class": "url"                                                                                         // 5
  }, Blaze.View(function() {                                                                               // 6
    return Spacebars.mustache(view.lookup("siteUrl"));                                                     // 7
  })), "\n        "), "\n    ") ];                                                                         // 8
}));                                                                                                       // 9
                                                                                                           // 10
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/mrt:accounts-vk/lib/vk_configure.js                                                            //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
Template.configureLoginServiceDialogForVk.siteUrl = function () {                                          // 1
    return Meteor.absoluteUrl({                                                                            // 2
        replaceLocalhost: true                                                                             // 3
    });                                                                                                    // 4
};                                                                                                         // 5
                                                                                                           // 6
Template.configureLoginServiceDialogForVk.fields = function () {                                           // 7
    return [                                                                                               // 8
        {property: 'appId',  label: 'App Id'},                                                             // 9
        {property: 'secret', label: 'App Secret'}                                                          // 10
    ];                                                                                                     // 11
};                                                                                                         // 12
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['mrt:accounts-vk'] = {
  VK: VK
};

})();

//# sourceMappingURL=31ec74e3d969b3638e717cc86496f5d370a94cd8.map
