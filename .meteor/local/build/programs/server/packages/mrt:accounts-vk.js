(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Accounts = Package['accounts-base'].Accounts;
var OAuth = Package.oauth.OAuth;
var Oauth = Package.oauth.Oauth;
var HTTP = Package.http.HTTP;
var _ = Package.underscore._;
var ServiceConfiguration = Package['service-configuration'].ServiceConfiguration;

/* Package-scope variables */
var VK;

(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/mrt:accounts-vk/lib/accounts_vk.js                                                                    //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
Accounts.oauth.registerService('vk');                                                                             // 1
                                                                                                                  // 2
if (Meteor.isClient) {                                                                                            // 3
    Meteor.loginWithVk = function(options, callback) {                                                            // 4
        // support a callback without options                                                                     // 5
        if (! callback && typeof options === "function") {                                                        // 6
            callback = options;                                                                                   // 7
            options = null;                                                                                       // 8
        }                                                                                                         // 9
                                                                                                                  // 10
        var credentialRequestCompleteCallback = Accounts.oauth.credentialRequestCompleteHandler(callback);        // 11
        VK.requestCredential(options, credentialRequestCompleteCallback);                                         // 12
    };                                                                                                            // 13
} else {                                                                                                          // 14
    Accounts.addAutopublishFields({                                                                               // 15
        forLoggedInUser: ['services.vk'],                                                                         // 16
        forOtherUsers: [                                                                                          // 17
            'services.vk.id',                                                                                     // 18
            'services.vk.nickname',                                                                               // 19
            'services.vk.gender'                                                                                  // 20
        ]                                                                                                         // 21
    });                                                                                                           // 22
}                                                                                                                 // 23
                                                                                                                  // 24
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/mrt:accounts-vk/lib/vk_server.js                                                                      //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
VK = {};                                                                                                          // 1
                                                                                                                  // 2
Oauth.registerService('vk', 2, null, function(query) {                                                            // 3
                                                                                                                  // 4
    var response    = getTokenResponse(query);                                                                    // 5
    var accessToken = response.accessToken;                                                                       // 6
    var identity    = getIdentity(accessToken);                                                                   // 7
                                                                                                                  // 8
    var serviceData = {                                                                                           // 9
        accessToken: accessToken,                                                                                 // 10
        expiresAt: (+new Date) + (1000 * response.expiresIn)                                                      // 11
    };                                                                                                            // 12
                                                                                                                  // 13
    var whitelisted = ['uid', 'nickname', 'first_name', 'last_name', 'sex', 'bdate', 'timezone', 'photo', 'photo_big', 'city', 'country'];
                                                                                                                  // 15
    var fields = _.pick(identity, whitelisted);                                                                   // 16
    _.extend(serviceData, fields);                                                                                // 17
                                                                                                                  // 18
    serviceData.id = serviceData.uid;                                                                             // 19
    delete serviceData.uid;                                                                                       // 20
                                                                                                                  // 21
    return {                                                                                                      // 22
        serviceData: serviceData,                                                                                 // 23
        options: {                                                                                                // 24
            profile: {                                                                                            // 25
                name: identity.nickname || (identity.first_name + ' ' + identity.last_name)                       // 26
            }                                                                                                     // 27
        }                                                                                                         // 28
    };                                                                                                            // 29
});                                                                                                               // 30
                                                                                                                  // 31
// returns an object containing:                                                                                  // 32
// - accessToken                                                                                                  // 33
// - expiresIn: lifetime of token in seconds                                                                      // 34
var getTokenResponse = function (query) {                                                                         // 35
    var config = ServiceConfiguration.configurations.findOne({service: 'vk'});                                    // 36
    if (!config) {                                                                                                // 37
        throw new ServiceConfiguration.ConfigError("Service not configured");                                     // 38
    }                                                                                                             // 39
                                                                                                                  // 40
    var responseContent;                                                                                          // 41
                                                                                                                  // 42
    try {                                                                                                         // 43
        // Request an access token                                                                                // 44
        responseContent = HTTP.post(                                                                              // 45
            "https://api.vk.com/oauth/access_token", {                                                            // 46
                params: {                                                                                         // 47
                    client_id:     config.appId,                                                                  // 48
                    client_secret: config.secret,                                                                 // 49
                    code:          query.code,                                                                    // 50
                    redirect_uri: Meteor.absoluteUrl("_oauth/vk?close=close")                                     // 51
                }                                                                                                 // 52
            }).content;                                                                                           // 53
                                                                                                                  // 54
    } catch (err) {                                                                                               // 55
        throw _.extend(new Error("Failed to complete OAuth handshake with vkontakte. " + err.message),            // 56
            {response: err.response});                                                                            // 57
    }                                                                                                             // 58
    // Success!  Extract the vkontakte access token and expiration                                                // 59
    // time from the response                                                                                     // 60
    var parsedResponse = JSON.parse(responseContent);                                                             // 61
                                                                                                                  // 62
    var fbAccessToken = parsedResponse.access_token;                                                              // 63
    var fbExpires = parsedResponse.expires_in;                                                                    // 64
                                                                                                                  // 65
    if (!fbAccessToken) {                                                                                         // 66
        throw new Error("Failed to complete OAuth handshake with vkontakte " +                                    // 67
            "-- can't find access token in HTTP response. " + responseContent);                                   // 68
    }                                                                                                             // 69
    return {                                                                                                      // 70
        accessToken: fbAccessToken,                                                                               // 71
        expiresIn: fbExpires                                                                                      // 72
    };                                                                                                            // 73
};                                                                                                                // 74
                                                                                                                  // 75
var getIdentity = function (accessToken) {                                                                        // 76
                                                                                                                  // 77
    var result = HTTP.get(                                                                                        // 78
        "https://api.vk.com/method/users.get", {params: {                                                         // 79
            access_token: accessToken,                                                                            // 80
            fields: 'uid, nickname, first_name, last_name, sex, bdate, timezone, photo, photo_big, city, country' // 81
        }});                                                                                                      // 82
                                                                                                                  // 83
    if (result.error) // if the http response was an error                                                        // 84
        throw result.error;                                                                                       // 85
                                                                                                                  // 86
    return result.data.response[0];                                                                               // 87
};                                                                                                                // 88
                                                                                                                  // 89
VK.retrieveCredential = function(credentialToken) {                                                               // 90
    return Oauth.retrieveCredential(credentialToken);                                                             // 91
};                                                                                                                // 92
                                                                                                                  // 93
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['mrt:accounts-vk'] = {
  VK: VK
};

})();

//# sourceMappingURL=mrt:accounts-vk.js.map
