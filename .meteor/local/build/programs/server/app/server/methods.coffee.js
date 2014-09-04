(function(){__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({
  getLocale: function() {
    return i18n.getLocale();
  },
  getAstroData: function(date, lat, lng) {
    var flag, getEph;
    flag = swisseph.SEFLG_SPEED;
    swisseph.swe_set_ephe_path(path.__dirname + '/../ephe');
    getEph = Async.runSync(function(done) {
      var resultObj;
      resultObj = {};
      swisseph.swe_utc_time_zone(date.year, date.month, date.day, date.hour, 0, 0, date.timezone, function(result) {
        return swisseph.swe_julday(result.year, result.month, result.day, result.hour, swisseph.SE_GREG_CAL, function(julday_ut) {
          console.log('Julian UT day for date:', julday_ut);
          swisseph.swe_calc_ut(julday_ut, swisseph.SE_SUN, flag, function(body) {
            return resultObj['sun'] = body;
          });
          swisseph.swe_calc_ut(julday_ut, swisseph.SE_MOON, flag, function(body) {
            return resultObj['moon'] = body;
          });
          return swisseph.swe_houses(julday_ut, lat, lng, 'P', function(body) {
            return resultObj['houses'] = body;
          });
        });
      });
      return done(null, resultObj);
    });
    return getEph.result;
  },
  nickCheck: function(string) {
    if (Meteor.users.find({
      'nickname': string
    }).count() > 0) {
      return false;
    } else {
      return true;
    }
  }
});

})();

//# sourceMappingURL=methods.coffee.js.map
