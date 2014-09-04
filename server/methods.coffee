
Meteor.methods {

  getLocale: ->

    i18n.getLocale()


  getAstroData: (date, lat, lng)->

    flag = swisseph.SEFLG_SPEED

    swisseph.swe_set_ephe_path(path.__dirname + '/../ephe')

    getEph = Async.runSync (done)->

      resultObj = {}

      swisseph.swe_utc_time_zone date.year, date.month, date.day, date.hour, 0, 0, date.timezone, (result)->
        swisseph.swe_julday result.year, result.month, result.day, result.hour, swisseph.SE_GREG_CAL, (julday_ut) ->
          console.log('Julian UT day for date:', julday_ut)
          swisseph.swe_calc_ut julday_ut, swisseph.SE_SUN, flag, (body)->
            resultObj['sun'] = body
          swisseph.swe_calc_ut julday_ut, swisseph.SE_MOON, flag, (body)->
            resultObj['moon'] = body
          swisseph.swe_houses julday_ut, lat, lng, 'P', (body)->
            resultObj['houses'] = body

      done(null, resultObj)

    getEph.result

  nickCheck: (string)->

    if Meteor.users.find({'nickname': string}).count() > 0
      false
    else
      true
}

