@userDataBuffer = {
  location: {}
  birthCity: {}
}

Session.set('regInitialized', false)
Session.set('testingClicked', false)
Session.set('clickFifties', 0)

Deps.autorun ->
  if Session.get('clickFifties') is 10

    MainCtrl.notify 'Вы не перемещали слайдер 10 раз подряд:(', 'Возожно вы не очень внимательно заполняете тест? Помните, он очень важен!'

  else if Session.get('clickFifties') is 15

    MainCtrl.notify 'Вы не перемещали слайдер 15 раз подряд:(', 'Такое конечно бывает, но это большая редкость! Пожалуйста, будьте внимательнее..'

  else if Session.get('clickFifties') is 30

    MainCtrl.notify 'Печаль:(', 'К сожалению, мы не можем принять ваши результаты:(', 'error'
    Meteor.users.update Meteor.user()._id, {$set: {'profile.registration.step': 0}}
    Meteor.logout()

Template.registration.rendered = ->
  log 'reg template rendered'
  MainCtrl['loader'] = new CanvasLoader('main-loader')
  MainCtrl['loader'].setColor('#ffffff')
  MainCtrl['loader'].setDiameter(56)
  MainCtrl['loader'].setDensity(66)
  MainCtrl['loader'].setRange(1)
  MainCtrl['loader'].setFPS(51)
  status = Meteor.user().profile.registration.status
  step = Meteor.user().profile.registration.step
  if status is "justRegistered"
    log 'rendering info template from action registration rendered callback'
    UI.insert UI.render(Template.info), $('#info-insert').get(0)
  else if status is "testing"
    log 'rendering testing template from registration rendered callback'
    $('.reg-step').find('>div').removeClass '_active'
    $('.reg-step').find('>div').eq(1).addClass '_active'
    marginTop = 0 - $(window).height()
    $('.registration').find('.info').addClass 'notransition'
    $('.registration').find('.info').css('margin-top', marginTop + 'px')
    setTimeout ->
      $('.registration').find('.info').removeClass 'notransition'
    , 200
    UI.insert UI.render(Template.testing_cont), $('#testing-insert').get(0)
  else if status is "johari"
    log 'rendering testing template from registration rendered callback'
    $('.reg-step').find('>div').removeClass '_active'
    $('.reg-step').find('>div').eq(2).addClass '_active'
    marginTop = 0 - ($(window).height() * 2)
    $('.registration').find('.info').addClass 'notransition'
    $('.registration').find('.info').css('margin-top', marginTop + 'px')
    setTimeout ->
      $('.registration').find('.info').removeClass 'notransition'
    , 200
    regCtrl.johariIntro()
  $(window).resize ->
    $('.registration').find('.info').addClass 'notransition'
    index = $('.reg-step').find('>div._active').index()
    $('.registration').find('.info').css('margin-top', $(window).height() * index * -1 + 'px')
    debouncedFunc = _.debounce ->
      log 'debounced'
      $('.registration').find('.info').removeClass 'notransition'
    , 500
    debouncedFunc()


Template.registration.events {

  'click .breaks .further': ->

    regCtrl.breakDone()

  'click .breaks.finish .finish-test': ->

    regCtrl.goToJohari()

  'click .johari .johari-start': ->

    regCtrl.johariStart()

  'click .logout a': (e)->

    e.preventDefault()

    MainCtrl.logout()
}



Template.beforeHook.rendered = ->
  log 'beforeHook rendered'
  Meteor.setTimeout =>
    $(@.find('h3')).addClass '_visible'
  , 1500
  Meteor.setTimeout =>
    $(@.find('p')).first().addClass '_visible'
  , 2500
  Meteor.setTimeout =>
    $(@.find('img')).addClass '_visible'
  , 5000
  Meteor.setTimeout =>
    $(@.find('p')).first().next().addClass '_visible'
  , 5000
  Meteor.setTimeout =>
    $(@.find('p')).first().next().next().addClass '_visible'
  , 8000
  Meteor.setTimeout =>
    $(@.find('p')).first().next().next().next().addClass '_visible'
  , 11000
  Meteor.setTimeout =>
    $(@.find('button')).addClass '_visible'
  , 13000



Template.beforeHook.events {

  'click button': (e)->

    currentUserId = Meteor.user()._id
    Meteor.users.update currentUserId, {
      $set: {'profile.registration.step': 1}
    }
    $(e.currentTarget).closest('div').find('*').removeClass '_visible'
    Meteor.setTimeout ->
      $(e.currentTarget).closest('div').empty()
      $('#tests-container').addClass 'flip'
      log 'endering testing template from beforeHook::events'
#      $('#testing-insert').empty()
#      UI.insert UI.render(Template.testing_cont), $('#testing-insert').get(0)
      $('#tests-container').find('.verso').find('.slide').empty()
      step = Meteor.user().profile.registration.step
      testData =  {
        id: step
        size: _.keys(Meteor.i18nMessages.registration.questions).length
        question: __('registration.questions.' + step)
        low: __('registration.grades.low')
        semilow: __('registration.grades.semilow')
        mid: __('registration.grades.mid')
        semihigh: __('registration.grades.semihigh')
        high: __('registration.grades.high')
      }
      UI.insert UI.renderWithData(Template.testing, testData), $('#tests-container').find('.verso').find('.slide').first().get(0)
    , 800

}


Template.testing_cont.rendered = ->

  log 'testing rendered'

  log 'Session val:' +  Session.get('regInitialized')

  if Session.get('regInitialized') is false

    regCtrl.flipSlidesInit()
    regStep = Meteor.user().profile.registration.step

    if regStep is 0
      $('#tests-container').find('.recto').find('.flip-cont').empty()
      UI.insert UI.render(Template.beforeHook), $('#tests-container').find('.recto').find('.flip-cont').get(0)
      Meteor.setTimeout ->
        $('#tests-container').addClass '_ready'
      , 600

    else
      $('#tests-container').find('.verso').find('.slide').empty()
      step = Meteor.user().profile.registration.step
      testData =  {
          id: step
          size: _.keys(Meteor.i18nMessages.registration.questions).length
          question: __('registration.questions.' + step)
          low: __('registration.grades.low')
          semilow: __('registration.grades.semilow')
          mid: __('registration.grades.mid')
          semihigh: __('registration.grades.semihigh')
          high: __('registration.grades.high')
        }
      UI.insert UI.renderWithData(Template.testing, testData), $('#tests-container').find('.verso').find('.slide').first().get(0)
      $('#tests-container').addClass 'flip'



Template.testing.events {
  'click #test-back': ->
    regCtrl.testBack()
  'click #test-further': ->
    regCtrl.testFurther(true)
}


Template.info.rendered = ->
  bgReady = utils.bgImageLoaded $('#info-block').find('.background'), ->
    regCtrl.infoIntro()
  regCtrl.infoSlidesInit()
  $('#birthTime').clockpicker {
    autoclose: true
  }
  $(window).resize ->
    width = $('.info-cont-wrap').find('.verso').width()
    $('.info-cont-wrap').find('.verso').find('.slide').width(width)
  if Session.get('mapLoaded') is false
    script = document.createElement("script")
    script.type = "text/javascript"
    script.src = "http://maps.google.com/maps/api/js?sensor=false&libraries=places&callback=initializeAutocomplete"
    document.body.appendChild(script)
    Session.set('mapLoaded', true)

  Meteor.setTimeout ->
    $('input#nickName').trigger('input')
  , 1000

  $('select').select2({
    minimumResultsForSearch: -1
  })

  Deps.autorun ->

    if Meteor.user() and Meteor.user().profile.services.facebook
      if $('.lang-cont').find('.add-lang').find('.tag').length is 0
        locale = Meteor.user().profile.services.facebook.locale
        locale = do ->
          if locale.split('_')[1].length > 0
            locale.split('_')[0]
          else
            locale
        userLang = '<div class="tag pro" data-level="pro" data-value="'  + locale + '"><p>' + isoLangs[locale].nativeName.charAt(0).toUpperCase() + isoLangs[locale].nativeName.slice(1) + '</p><div class="remove"><i class="fa fa-times"></i></div></div>'
        $('.lang-cont').find('.add-lang').before userLang

Template.info.events {
  'click .slide-further': (e)->
    regCtrl.validateInfo($('.info-cont-wrap').find('.slide._active'))

  'click .slide-back': (e)->
    index = $('.info-cont-wrap').find('.slide._active').index() - 1
    regCtrl.infoSlideChange(index)
  'click .pins-cont .pin': (e)->
    if $('.info-cont-wrap').find('.slide').eq($(e.currentTarget).index()).hasClass '_viewed'
      regCtrl.infoSlideChange $(e.currentTarget).index()
  'click button.disabled': (e)->
    e.preventDefault()
  'focus input': (e)->
    $tltp = $(e.currentTarget).siblings('.tltp')
    if $tltp.length > 0
      $tltp.addClass('_visible')
      Meteor.setTimeout ->
        $tltp.removeClass('_visible')
      , 3000

  'input input.required._checked, change input.required._checked': (e)->
    regCtrl.validateRequired $(e.currentTarget)

  'change #bdayYear': ->
    regCtrl.validateBdaySelect()

  'input #nickName': (e)->
    target = $('#choose-nic')
    if $(e.currentTarget).val().length >= 2
      do _.debounce ->
        log 'keydown triggered'
        Meteor.call 'nickCheck', $(e.target).val(), (err, res)->
          if err
            log err
          else
            if res
              target.addClass('_valid')
              target.removeClass('_invalid')
            else
              target.removeClass('_valid')
              target.addClass('_invalid')
      , 100
    else
      target.addClass('_invalid')
      target.removeClass('_valid')

  'mouseenter .add-lang': (e)->
    $(e.currentTarget).find('ul').addClass '_hover'

  'mouseleave .add-lang': (e)->
    $(e.currentTarget).find('ul').removeClass '_hover'

  'mouseenter .add-lang > ul li': (e)->
    $(e.currentTarget).append '<div class="choose-level"><div data-level="low" class="lang-level"></div><div data-level="lower-int" class="lang-level"></div><div data-level="int" class="lang-level"></div><div data-level="upper-int" class="lang-level"></div><div data-level="pro" class="lang-level"></div></div>'
    Meteor.defer ->
      $(e.currentTarget).find('.choose-level').addClass '_hover'

  'mouseleave .add-lang > ul li': (e)->
    $(e.currentTarget).find('.choose-level').removeClass '_hover'
    Meteor.setTimeout ->
      $(e.currentTarget).find('.choose-level').remove()
    , 400

  'click .add-lang button': (e)->
    e.preventDefault()

  'click .add-lang ul li .lang-level': (e)->
    value = $(e.currentTarget).closest('li').data('value')
    name = $(e.currentTarget).closest('li').text()
    level = $(e.currentTarget).data('level')
    $('.add-lang').before '<div class="tag ' + level + '" data-level="' + level + '" data-value="' + value + '"><p>' + name + '</p><div class="remove"><i class="fa fa-times"></i></div></div>'
    $('.add-lang').find('ul').removeClass '_hover'

  'click .lang-cont .remove': (e)->
    $(e.currentTarget).closest('.tag').remove()

}


Template.testing.rendered = ->

  step = Meteor.user().profile.registration.step
  if step is 1
    setTimeout =>
      $(@.find('.tltp')).addClass '_visible'
      setTimeout =>
        $(@.find('.tltp')).removeClass '_visible'
      , 4000
    , 2000
  $slider = $(@.find('.range-slider'))
  $(@.find('.range-slider')).slider({

    max: 100

    change: (e, ui)->
      text = regCtrl.getTextGradeAndColor(ui.handle, ui.value)
      $slider.siblings('.grade').find('ul li').removeClass('_active')
      $slider.siblings('.grade').find('.' + text).addClass('_active')

    slide: (e, ui)->
      text = regCtrl.getTextGradeAndColor(ui.handle, ui.value)
      $slider.siblings('.grade').find('ul li').removeClass('_active')
      $slider.siblings('.grade').find('.' + text).addClass('_active')

  })

  id = Meteor.user().profile.registration.step
  if id <= _.keys(Meteor.i18nMessages.registration.questions).length
    console.log 'sameShit'
    if Meteor.user().profile.tests.bigFive.answers[id]
      log Meteor.user().profile.tests.bigFive.answers[id]
      $(@.find('.range-slider')).slider 'value', Meteor.user().profile.tests.bigFive.answers[id]
    else
      $(@.find('.range-slider')).slider 'value', 50

  $('.flip-cont-wrap').removeClass '_ready'


Template.testing.helpers {

  backDisabled: ->
    if Meteor.user().profile.registration.step <= 1
      return true
    else
      return false

  furtherDisabled: ->
    if Meteor.user().profile.registration.step >= _.keys(Meteor.i18nMessages.registration.questions).length + 1
      return true
    else
      return false
}


@initializeAutocomplete = ->

  $('#maps-loader').css('display', 'none')
  @autocompleteCity = new google.maps.places.Autocomplete document.getElementById('localCity'), {types: ['(cities)']}
  @autocompleteBirthCity = new google.maps.places.Autocomplete document.getElementById('birthCity'), {types: ['(cities)']}
  google.maps.event.addListener autocompleteCity, 'place_changed', ->
    regCtrl.fillInLocalCity()
    $('input#localCity').trigger('input')

  google.maps.event.addListener autocompleteBirthCity, 'place_changed', ->
    regCtrl.fillInBirthCity()



@regCtrl = {

  infoIntro: ->
    Meteor.defer ->
      $('#info-block').find('.background').addClass('_visible')
    Meteor.setTimeout ->
      $('.info-cont-wrap').addClass '_ready'
    , 800
    Meteor.setTimeout ->
      $('.info-cont-wrap').find('.recto').find('h1').addClass '_visible'
    , 2000
    Meteor.setTimeout ->
      $('.info-cont-wrap').find('.recto').find('h3').addClass '_visible'
    , 4000
    Meteor.setTimeout ->
      $('.info-cont-wrap').find('.recto').find('p').addClass '_visible'
    , 7000
    Meteor.setTimeout ->
      $('.info-cont-wrap').find('.recto').find('*').removeClass '_visible'
    , 9500
    Meteor.setTimeout ->
      $('.info-cont-wrap').addClass 'flip'
    , 10000

  flipSlidesInit: ->

    $('.flip-cont-wrap').find('.verso').find('.slide').first().addClass('_visible')

  validateInfo: (slide)->

    if slide.index() is 0

      slide.find('input.required').each ->
        regCtrl.validateRequired $(this)
        $(this).addClass '_checked'

      regCtrl.validateBdaySelect()


      if $('#name').hasClass('valid') and
      $('#secondName').hasClass('valid') and
      $('#localCity').hasClass('valid') and
      $('#choose-nic').hasClass('_valid') and
      $('#bdayYear').val() isnt '2014'

        index = $('.info-cont-wrap').find('.slide._active').index() + 1
        if index < 3
          slide.addClass '_validated'
          regCtrl.infoSlideChange(index)
        else
          slide.addClass '_validated'
          Router.go 'registration/hello'
      else

        MainCtrl.notify 'Печаль:(', 'Форма заполнена некорректно, обратите внимание на подсвеченные красным поля!', 'error'

    else if slide.index() is 1

      index = $('.info-cont-wrap').find('.slide._active').index() + 1
      if index < 3
        slide.addClass '_validated'
        regCtrl.infoSlideChange(index)
      else
        slide.addClass '_validated'
        Router.go 'registration/hello'

    else if slide.index() is 2

      slide.find('input.required').each ->
        regCtrl.validateRequired $(this)
        $(this).addClass '_checked'

      if $('#birthCity').hasClass('valid')


        index = $('.info-cont-wrap').find('.slide._active').index() + 1
        if index < 3
          slide.addClass '_validated'
          regCtrl.infoSlideChange(index)
        else
          slide.addClass('_validated')
          regCtrl.saveInfoData()
          Router.go 'registration/hello'





  validateRequired: ($el)->
    if $el.val() isnt "" and $el.val().length > 1 and $el.val().length < 200
      $el.removeClass('error')
      $el.addClass('valid')
    else
      $el.removeClass('valid')
      $el.addClass('error')

  validateBdaySelect: ->

    $('#s2id_bdayMonth').addClass '_valid'
    $('#s2id_bdayDay').addClass '_valid'

    if $('#bdayYear').val() is '2014'
      $('#s2id_bdayYear').addClass '_invalid'
      $('#s2id_bdayYear').removeClass '_valid'
    else
      $('#s2id_bdayYear').addClass '_valid'
      $('#s2id_bdayYear').removeClass '_invalid'

  changeBackground: ($elem, newImage, callback)->

    MainCtrl.showLoader()
    url = 'http://d1jfn2lab933y3.cloudfront.net/' + newImage
    $('<img>').attr('src', url).load ->
      log 'bg image loaded'
      newBg = $('<div class="background _new"></div>').css('background-image', 'url(' + url + ')')
      $elem.find('.background').after newBg
      MainCtrl.hideLoader()
      Meteor.setTimeout ->
        $elem.find('.background').first().next().addClass '_visible'
      , 50
      Meteor.setTimeout ->
        $elem.find('.background').first().remove()
        if callback
          callback()
      , 1000


  showBreakFirst: ->

    $('.testing').find('.flip-cont-wrap').removeClass 'flip'
    $('.testing').find('.break-one').addClass '_visible'
    $('.testing').find('.break-one').find('h3').addClass '_visible'
    setTimeout ->
      $('.testing').find('.break-one').find('h4').addClass '_visible'
    , 1600
    setTimeout ->
      $('.testing').find('.break-one').find('.circle').addClass '_visible'
    , 4000
    setTimeout ->
      $('.testing').find('.break-one').find('button').addClass '_visible'
    , 8000
    log 'break activated'
    id = Meteor.user()._id
    Meteor.users.update id, {$set: {'profile.registration.breakOne': false}}

  showBreakSecond: ->

    $('.testing').find('.flip-cont-wrap').removeClass 'flip'
    $('.testing').find('.break-two').addClass '_visible'
    $('.testing').find('.break-two').find('h3').addClass '_visible'
    setTimeout ->
      $('.testing').find('.break-two').find('h4').addClass '_visible'
    , 1200
    setTimeout ->
      $('.testing').find('.break-two').find('.circle').first().addClass '_visible'
    , 4000
    setTimeout ->
      $('.testing').find('.break-two').find('.circle').first().next().addClass '_visible'
    , 8000
    setTimeout ->
      $('.testing').find('.break-two').find('button').addClass '_visible'
    , 12000
    log 'break activated'
    id = Meteor.user()._id
    Meteor.users.update id, {$set: {'profile.registration.breakTwo': false}}

  breakDone: ->

    $('.breaks').removeClass '_visible'
    $('.breaks').find('._visible').removeClass '_visible'
    step = Meteor.user().profile.registration.step
    pic = do ->
      if step > 0 and step < 30
        'images/test_part_2.jpg'
      else if step > 30 and step < 60
        'images/test_part_3.jpg'
    @changeBackground $('.testing'), pic, ->
      $('.testing').find('.flip-cont-wrap').addClass 'flip'
      regCtrl.testFurther(false)

  finishTest: ->

    $('.testing').find('.finish').addClass '_visible'
    $('.testing').find('.finish').find('h3').addClass '_visible'
    setTimeout ->
      $('.testing').find('.finish').find('h4').addClass '_visible'
    , 1600
    setTimeout ->
      $('.testing').find('.finish').find('.circle').addClass '_visible'
    , 4000
    setTimeout ->
      $('.testing').find('.finish').find('button').addClass '_visible'
    , 8000


  infoSlidesInit: ->

    $('.info-cont-wrap').find('.verso').find('.slide').first().addClass('_active').addClass('_viewed')
    width = $('.info-cont-wrap').find('.verso').width()
    $('.info-cont-wrap').find('.verso').find('.slide').width(width)
    $('.info-cont-wrap').find('.slide-back').attr('disabled', true)


  infoSlideChange: (index)->
    left = $('.info-cont-wrap').find('.slide').width() * (index)
    $('.info-cont-wrap').find('.slider-wrap').css('left', 0 - left + 'px')
    $('.info-cont-wrap').find('.pins-cont').find('.stripe').css('left', (index) * 120 + 'px')
    $('.info-cont-wrap').find('.slide').removeClass '_active'
    $('.info-cont-wrap').find('.slide').eq(index).addClass('_active').addClass('_viewed')
    if index is 0
      $('.info-cont-wrap').find('.slide-back').attr('disabled', true)
    else
      $('.info-cont-wrap').find('.slide-back').attr('disabled', false)

  flipSlideChange: (elem, dir)->
    $cont = elem

    $cont.find('.slide').removeClass '_visible'
    newSlide = $('<div class="slide"></div>')
    $cont.find('.slider-wrap').append newSlide
    Meteor.setTimeout ->
      $cont.find('.slider-wrap').find('.slide').first().remove()
      $cont.find('.slider-wrap').find('.slide').first().addClass('_visible')
    , 500


  fillInLocalCity: ->

    place = autocompleteCity.getPlace()
    userDataBuffer['location']['name'] = place.vicinity
    userDataBuffer['location']['lat'] = place.geometry.location.lat()
    userDataBuffer['location']['lng'] = place.geometry.location.lng()


  fillInBirthCity: ->

    place = autocompleteBirthCity.getPlace()
    $.getJSON "http://api.timezonedb.com/?lat=" + place.geometry.location.lat() + "&lng=" + place.geometry.location.lng() + "&format=json&key=4O11NU9QFV4H&callback=?", (data)->
      userDataBuffer['birthCity']['timezone'] = data.gmtOffset / 3600
      log userDataBuffer.birthCity.timezone
    userDataBuffer['birthCity']['name'] = place.vicinity
    userDataBuffer['birthCity']['lat'] = place.geometry.location.lat()
    userDataBuffer['birthCity']['lng'] = place.geometry.location.lng()

  saveInfoData: ->

    log userDataBuffer

    userId = Meteor.user()._id
    bYear = parseInt($('#bdayYear').val(), 10)
    bMonth = parseInt($('#bdayMonth').val(), 10) - 1
    bDay = parseInt($('#bdayDay').val(), 10)
    bHour = do ->
      if $('#birthTime').val() isnt ''
        parseInt($('#birthTime').val().split(':')[0])
      else
        ''
    birthday = new Date bYear, bMonth, bDay
    languages = do ->
      arr = []
      $('.lang-cont').find('.tag').each ->
        arr.push {
          code: $(this).data('value')
          name: $(this).find('p').text()
          level: $(this).data('level')
        }
      arr

    Meteor.users.update userId,  {$set: {
      'profile.firstName': $('#name').val()
      'profile.secondName': $('#secondName').val()
      'profile.birthday': birthday
      'profile.username': $('#nickName').val()
      'profile.inter.firstName': $('#intName').val()
      'profile.inter.secondName': $('#intSecondName').val()
      'profile.inter.languages': languages
      'profile.birthTime': $('#birthTime').val()
      'profile.birthCity.timezone': userDataBuffer['birthCity']['timezone']
      'profile.birthCity.name': userDataBuffer['birthCity']['name']
      'profile.birthCity.lat': userDataBuffer['birthCity']['lat']
      'profile.birthCity.lng': userDataBuffer['birthCity']['lng']
      'profile.location.name': userDataBuffer['location']['name']
      'profile.location.lat': userDataBuffer['location']['lat']
      'profile.location.lng': userDataBuffer['location']['lng']
      'profile.registration.status': 'testing'
      'profile.registration.step': 0
      'profile.tests.bigFive.answers': {}
    }}

    @getAndCreateAstroData bYear, bMonth, bDay, bHour, userDataBuffer['birthCity']['timezone'], userDataBuffer['birthCity']['lat'], userDataBuffer['location']['lng'], ->

      log 'saved astro data and changing registration pane to testing!'
      $('.reg-step').find('>div').removeClass '_active'
      $('.reg-step').find('>div').eq(1).addClass '_active'
      marginTop = 0 - $(window).height()
      $('.registration').find('.info').css('margin-top', marginTop + 'px')
      $('#testing-insert').empty()
      UI.insert UI.render(Template.testing_cont), $('#testing-insert').get(0)


  getAndCreateAstroData: (year, month, day, hour, timezone, lat, lng, callback)->
    date = {}
    date['year'] = 1989
    date['month'] = 1
    date['day'] = 4
    date['hour'] = 0
    date['timezone'] = 7
    lat = 53
    lng = 83
    Meteor.call 'getAstroData', date, lat, lng, (err, data)->
      if err
        console.log err
      else
        userId = Meteor.user()._id
        Meteor.users.update userId, {$set: {'profile.tests.astro.data': data}}, ->
          console.log 'astro data saved'
          if callback
            callback()


  getTextGradeAndColor: (handle, val)->


    target = $(handle)
    if val < 21
      target.css('box-shadow': '0 0 7px #ff7676')
      'low'
    else if val > 20 and val < 41
      target.css('box-shadow': '0 0 7px #ffb93e')
      'semilow'
    else if val > 40 and val < 61
      target.css('box-shadow': '0 0 7px #e8e006')
      'mid'
    else if val > 60 and val < 81
      target.css('box-shadow': '0 0 7px #b0e806')
      'semihigh'
    else if val > 80
      target.css('box-shadow': '0 0 7px #4ae40d')
      'high'


  testBack: ->
    if Session.get('testingClicked') is false
      Session.set('testingClicked', true)
      id = Meteor.user().profile.registration.step
      userId = Meteor.user()._id
      answer = {}
      answer['profile.tests.bigFive.answers.' + id] = $('.range-slider').slider('value')
      Meteor.users.update userId, {$set: answer}
      if id > 1
        Meteor.users.update userId, {$set: {'profile.registration.step': id - 1}}
        step = Meteor.user().profile.registration.step
        testData =  {
          id: step
          size: _.keys(Meteor.i18nMessages.registration.questions).length
          question: __('registration.questions.' + step)
          low: __('registration.grades.low')
          semilow: __('registration.grades.semilow')
          mid: __('registration.grades.mid')
          semihigh: __('registration.grades.semihigh')
          high: __('registration.grades.high')
        }
        UI.insert UI.renderWithData(Template.testing, testData), $('#tests-container').find('.verso').find('.slide').get(1)

        regCtrl.flipSlideChange($('#tests-container'))
        Meteor.setTimeout ->
          Session.set('testingClicked', false)
        , 1000


  testFurther: (incrementStep)->
    Session.set('regInitialized', true)
    if Session.get('regInitialized')
      log 'stage 1'
      if Session.get('testingClicked') is false
        log 'stage 2'
        Session.set('testingClicked', true)
        id = Meteor.user().profile.registration.step
        userId = Meteor.user()._id
        answer = {}
        val = $('.range-slider').slider('value')
        answer['profile.tests.bigFive.answers.' + id] = val
        if val is 50
          clickedFifties = Session.get('clickFifties') + 1
          Session.set('clickFifties', clickedFifties)
        else
          Session.set 'clickFifties', 0
        log $('.range-slider').slider('value')
        Meteor.users.update userId, {$set: answer}
        if id < _.keys(Meteor.i18nMessages.registration.questions).length
          log 'stage 3'
          regStep = Meteor.user().profile.registration.step
          log 'trying'
          if incrementStep
            Meteor.users.update userId, {$set: {'profile.registration.step': regStep + 1}}
          Meteor.setTimeout ->
            Session.set('testingClicked', false)
          , 1000
          if regStep is 0
            UI.insert UI.render(Template.beforeHook), $('#tests-container').find('.recto').find('.flip-cont').get(0)
            Meteor.setTimeout ->
              $('#tests-container').addClass '_ready'
            , 600
          else if regStep is 25 and Meteor.user().profile.registration.breakOne
            $('#tests-container').removeClass 'flip'
            Meteor.setTimeout ->
              regCtrl.changeBackground $('.testing'), 'images/test_break_one.jpg', ->
                regCtrl.showBreakFirst()
            , 500
          else if regStep is 50 and Meteor.user().profile.registration.breakTwo
            $('#tests-container').removeClass 'flip'
            Meteor.setTimeout ->
              regCtrl.changeBackground $('.testing'), 'images/test_break_two.jpg', ->
                regCtrl.showBreakSecond()
            , 500
#          else if regStep is 75
#            $('#tests-container').removeClass 'flip'
#            Meteor.setTimeout ->
#              regCtrl.changeBackground $('.testing'), 'images/test_finish.jpg', ->
#                regCtrl.finishTest()
#            , 500
          else
            log 'stage 4'
            step = Meteor.user().profile.registration.step
            testData =  {
              id: step
              size: _.keys(Meteor.i18nMessages.registration.questions).length
              question: __('registration.questions.' + step)
              low: __('registration.grades.low')
              semilow: __('registration.grades.semilow')
              mid: __('registration.grades.mid')
              semihigh: __('registration.grades.semihigh')
              high: __('registration.grades.high')
            }
            UI.insert UI.renderWithData(Template.testing, testData), $('#tests-container').find('.verso').find('.slide').get(1)
            regCtrl.flipSlideChange($('#tests-container'))

        else
          bigFive.calc()
          $('#tests-container').removeClass 'flip'
          Meteor.setTimeout ->
            regCtrl.changeBackground $('.testing'), 'images/test_finish.jpg', ->
              regCtrl.finishTest()
          , 500


  goToJohari: ->

    log 'saved bigFive data and changing registration pane to johari!'
    Meteor.users.update Meteor.user()._id, {$set: {'profile.registration.status': 'johari'}}
    $('.reg-step').find('>div').removeClass '_active'
    $('.reg-step').find('>div').eq(2).addClass '_active'
    marginTop = 0 - ($(window).height() * 2)
    $('.registration').find('.info').css('margin-top', marginTop + 'px')
    setTimeout ->
      regCtrl.johariIntro()
    , 1000

  johariIntro: ->

    $cont = $('.johari').find('.start')
    $cont.addClass '_visible'
    $cont.find('h3').addClass '_visible'
    setTimeout ->
      $cont.find('h4').addClass '_visible'
    , 1200
    setTimeout ->
      $cont.find('.circle').first().addClass '_visible'
    , 4000
    setTimeout ->
      $cont.find('.circle').first().next().addClass '_visible'
    , 8000
    setTimeout ->
      $cont.find('button').addClass '_visible'
    , 12000
    log 'johari intro initialized'
#    @johariStart()

  johariStart: ->

    log 'starting johary'
    $('.johari').find('.start').find('*').removeClass '_visible'
    setTimeout ->
      $('.johari').find('.start').removeClass '_visible'
      UI.insert UI.render(Template.johari), $('#johari-insert').get(0)
    , 1000



}


isoLangs = {
  "ab":{
    "name":"Abkhaz",
    "nativeName":"аҧсуа"
  },
  "aa":{
    "name":"Afar",
    "nativeName":"Afaraf"
  },
  "af":{
    "name":"Afrikaans",
    "nativeName":"Afrikaans"
  },
  "ak":{
    "name":"Akan",
    "nativeName":"Akan"
  },
  "sq":{
    "name":"Albanian",
    "nativeName":"Shqip"
  },
  "am":{
    "name":"Amharic",
    "nativeName":"አማርኛ"
  },
  "ar":{
    "name":"Arabic",
    "nativeName":"العربية"
  },
  "an":{
    "name":"Aragonese",
    "nativeName":"Aragonés"
  },
  "hy":{
    "name":"Armenian",
    "nativeName":"Հայերեն"
  },
  "as":{
    "name":"Assamese",
    "nativeName":"অসমীয়া"
  },
  "av":{
    "name":"Avaric",
    "nativeName":"авар мацӀ, магӀарул мацӀ"
  },
  "ae":{
    "name":"Avestan",
    "nativeName":"avesta"
  },
  "ay":{
    "name":"Aymara",
    "nativeName":"aymar aru"
  },
  "az":{
    "name":"Azerbaijani",
    "nativeName":"azərbaycan dili"
  },
  "bm":{
    "name":"Bambara",
    "nativeName":"bamanankan"
  },
  "ba":{
    "name":"Bashkir",
    "nativeName":"башҡорт теле"
  },
  "eu":{
    "name":"Basque",
    "nativeName":"euskara, euskera"
  },
  "be":{
    "name":"Belarusian",
    "nativeName":"Беларуская"
  },
  "bn":{
    "name":"Bengali",
    "nativeName":"বাংলা"
  },
  "bh":{
    "name":"Bihari",
    "nativeName":"भोजपुरी"
  },
  "bi":{
    "name":"Bislama",
    "nativeName":"Bislama"
  },
  "bs":{
    "name":"Bosnian",
    "nativeName":"bosanski jezik"
  },
  "br":{
    "name":"Breton",
    "nativeName":"brezhoneg"
  },
  "bg":{
    "name":"Bulgarian",
    "nativeName":"български език"
  },
  "my":{
    "name":"Burmese",
    "nativeName":"ဗမာစာ"
  },
  "ca":{
    "name":"Catalan; Valencian",
    "nativeName":"Català"
  },
  "ch":{
    "name":"Chamorro",
    "nativeName":"Chamoru"
  },
  "ce":{
    "name":"Chechen",
    "nativeName":"нохчийн мотт"
  },
  "ny":{
    "name":"Chichewa; Chewa; Nyanja",
    "nativeName":"chiCheŵa, chinyanja"
  },
  "zh":{
    "name":"Chinese",
    "nativeName":"中文 (Zhōngwén), 汉语, 漢語"
  },
  "cv":{
    "name":"Chuvash",
    "nativeName":"чӑваш чӗлхи"
  },
  "kw":{
    "name":"Cornish",
    "nativeName":"Kernewek"
  },
  "co":{
    "name":"Corsican",
    "nativeName":"corsu, lingua corsa"
  },
  "cr":{
    "name":"Cree",
    "nativeName":"ᓀᐦᐃᔭᐍᐏᐣ"
  },
  "hr":{
    "name":"Croatian",
    "nativeName":"hrvatski"
  },
  "cs":{
    "name":"Czech",
    "nativeName":"česky, čeština"
  },
  "da":{
    "name":"Danish",
    "nativeName":"dansk"
  },
  "dv":{
    "name":"Divehi; Dhivehi; Maldivian;",
    "nativeName":"ދިވެހި"
  },
  "nl":{
    "name":"Dutch",
    "nativeName":"Nederlands, Vlaams"
  },
  "en":{
    "name":"English",
    "nativeName":"English"
  },
  "eo":{
    "name":"Esperanto",
    "nativeName":"Esperanto"
  },
  "et":{
    "name":"Estonian",
    "nativeName":"eesti, eesti keel"
  },
  "ee":{
    "name":"Ewe",
    "nativeName":"Eʋegbe"
  },
  "fo":{
    "name":"Faroese",
    "nativeName":"føroyskt"
  },
  "fj":{
    "name":"Fijian",
    "nativeName":"vosa Vakaviti"
  },
  "fi":{
    "name":"Finnish",
    "nativeName":"suomi, suomen kieli"
  },
  "fr":{
    "name":"French",
    "nativeName":"français, langue française"
  },
  "ff":{
    "name":"Fula; Fulah; Pulaar; Pular",
    "nativeName":"Fulfulde, Pulaar, Pular"
  },
  "gl":{
    "name":"Galician",
    "nativeName":"Galego"
  },
  "ka":{
    "name":"Georgian",
    "nativeName":"ქართული"
  },
  "de":{
    "name":"German",
    "nativeName":"Deutsch"
  },
  "el":{
    "name":"Greek, Modern",
    "nativeName":"Ελληνικά"
  },
  "gn":{
    "name":"Guaraní",
    "nativeName":"Avañeẽ"
  },
  "gu":{
    "name":"Gujarati",
    "nativeName":"ગુજરાતી"
  },
  "ht":{
    "name":"Haitian; Haitian Creole",
    "nativeName":"Kreyòl ayisyen"
  },
  "ha":{
    "name":"Hausa",
    "nativeName":"Hausa, هَوُسَ"
  },
  "he":{
    "name":"Hebrew (modern)",
    "nativeName":"עברית"
  },
  "hz":{
    "name":"Herero",
    "nativeName":"Otjiherero"
  },
  "hi":{
    "name":"Hindi",
    "nativeName":"हिन्दी, हिंदी"
  },
  "ho":{
    "name":"Hiri Motu",
    "nativeName":"Hiri Motu"
  },
  "hu":{
    "name":"Hungarian",
    "nativeName":"Magyar"
  },
  "ia":{
    "name":"Interlingua",
    "nativeName":"Interlingua"
  },
  "id":{
    "name":"Indonesian",
    "nativeName":"Bahasa Indonesia"
  },
  "ie":{
    "name":"Interlingue",
    "nativeName":"Originally called Occidental; then Interlingue after WWII"
  },
  "ga":{
    "name":"Irish",
    "nativeName":"Gaeilge"
  },
  "ig":{
    "name":"Igbo",
    "nativeName":"Asụsụ Igbo"
  },
  "ik":{
    "name":"Inupiaq",
    "nativeName":"Iñupiaq, Iñupiatun"
  },
  "io":{
    "name":"Ido",
    "nativeName":"Ido"
  },
  "is":{
    "name":"Icelandic",
    "nativeName":"Íslenska"
  },
  "it":{
    "name":"Italian",
    "nativeName":"Italiano"
  },
  "iu":{
    "name":"Inuktitut",
    "nativeName":"ᐃᓄᒃᑎᑐᑦ"
  },
  "ja":{
    "name":"Japanese",
    "nativeName":"日本語 (にほんご／にっぽんご)"
  },
  "jv":{
    "name":"Javanese",
    "nativeName":"basa Jawa"
  },
  "kl":{
    "name":"Kalaallisut, Greenlandic",
    "nativeName":"kalaallisut, kalaallit oqaasii"
  },
  "kn":{
    "name":"Kannada",
    "nativeName":"ಕನ್ನಡ"
  },
  "kr":{
    "name":"Kanuri",
    "nativeName":"Kanuri"
  },
  "ks":{
    "name":"Kashmiri",
    "nativeName":"कश्मीरी, كشميري‎"
  },
  "kk":{
    "name":"Kazakh",
    "nativeName":"Қазақ тілі"
  },
  "km":{
    "name":"Khmer",
    "nativeName":"ភាសាខ្មែរ"
  },
  "ki":{
    "name":"Kikuyu, Gikuyu",
    "nativeName":"Gĩkũyũ"
  },
  "rw":{
    "name":"Kinyarwanda",
    "nativeName":"Ikinyarwanda"
  },
  "ky":{
    "name":"Kirghiz, Kyrgyz",
    "nativeName":"кыргыз тили"
  },
  "kv":{
    "name":"Komi",
    "nativeName":"коми кыв"
  },
  "kg":{
    "name":"Kongo",
    "nativeName":"KiKongo"
  },
  "ko":{
    "name":"Korean",
    "nativeName":"한국어 (韓國語), 조선말 (朝鮮語)"
  },
  "ku":{
    "name":"Kurdish",
    "nativeName":"Kurdî, كوردی‎"
  },
  "kj":{
    "name":"Kwanyama, Kuanyama",
    "nativeName":"Kuanyama"
  },
  "la":{
    "name":"Latin",
    "nativeName":"latine, lingua latina"
  },
  "lb":{
    "name":"Luxembourgish, Letzeburgesch",
    "nativeName":"Lëtzebuergesch"
  },
  "lg":{
    "name":"Luganda",
    "nativeName":"Luganda"
  },
  "li":{
    "name":"Limburgish, Limburgan, Limburger",
    "nativeName":"Limburgs"
  },
  "ln":{
    "name":"Lingala",
    "nativeName":"Lingála"
  },
  "lo":{
    "name":"Lao",
    "nativeName":"ພາສາລາວ"
  },
  "lt":{
    "name":"Lithuanian",
    "nativeName":"lietuvių kalba"
  },
  "lu":{
    "name":"Luba-Katanga",
    "nativeName":""
  },
  "lv":{
    "name":"Latvian",
    "nativeName":"latviešu valoda"
  },
  "gv":{
    "name":"Manx",
    "nativeName":"Gaelg, Gailck"
  },
  "mk":{
    "name":"Macedonian",
    "nativeName":"македонски јазик"
  },
  "mg":{
    "name":"Malagasy",
    "nativeName":"Malagasy fiteny"
  },
  "ms":{
    "name":"Malay",
    "nativeName":"bahasa Melayu, بهاس ملايو‎"
  },
  "ml":{
    "name":"Malayalam",
    "nativeName":"മലയാളം"
  },
  "mt":{
    "name":"Maltese",
    "nativeName":"Malti"
  },
  "mi":{
    "name":"Māori",
    "nativeName":"te reo Māori"
  },
  "mr":{
    "name":"Marathi (Marāṭhī)",
    "nativeName":"मराठी"
  },
  "mh":{
    "name":"Marshallese",
    "nativeName":"Kajin M̧ajeļ"
  },
  "mn":{
    "name":"Mongolian",
    "nativeName":"монгол"
  },
  "na":{
    "name":"Nauru",
    "nativeName":"Ekakairũ Naoero"
  },
  "nv":{
    "name":"Navajo, Navaho",
    "nativeName":"Diné bizaad, Dinékʼehǰí"
  },
  "nb":{
    "name":"Norwegian Bokmål",
    "nativeName":"Norsk bokmål"
  },
  "nd":{
    "name":"North Ndebele",
    "nativeName":"isiNdebele"
  },
  "ne":{
    "name":"Nepali",
    "nativeName":"नेपाली"
  },
  "ng":{
    "name":"Ndonga",
    "nativeName":"Owambo"
  },
  "nn":{
    "name":"Norwegian Nynorsk",
    "nativeName":"Norsk nynorsk"
  },
  "no":{
    "name":"Norwegian",
    "nativeName":"Norsk"
  },
  "ii":{
    "name":"Nuosu",
    "nativeName":"ꆈꌠ꒿ Nuosuhxop"
  },
  "nr":{
    "name":"South Ndebele",
    "nativeName":"isiNdebele"
  },
  "oc":{
    "name":"Occitan",
    "nativeName":"Occitan"
  },
  "oj":{
    "name":"Ojibwe, Ojibwa",
    "nativeName":"ᐊᓂᔑᓈᐯᒧᐎᓐ"
  },
  "cu":{
    "name":"Old Church Slavonic, Church Slavic, Church Slavonic, Old Bulgarian, Old Slavonic",
    "nativeName":"ѩзыкъ словѣньскъ"
  },
  "om":{
    "name":"Oromo",
    "nativeName":"Afaan Oromoo"
  },
  "or":{
    "name":"Oriya",
    "nativeName":"ଓଡ଼ିଆ"
  },
  "os":{
    "name":"Ossetian, Ossetic",
    "nativeName":"ирон æвзаг"
  },
  "pa":{
    "name":"Panjabi, Punjabi",
    "nativeName":"ਪੰਜਾਬੀ, پنجابی‎"
  },
  "pi":{
    "name":"Pāli",
    "nativeName":"पाऴि"
  },
  "fa":{
    "name":"Persian",
    "nativeName":"فارسی"
  },
  "pl":{
    "name":"Polish",
    "nativeName":"polski"
  },
  "ps":{
    "name":"Pashto, Pushto",
    "nativeName":"پښتو"
  },
  "pt":{
    "name":"Portuguese",
    "nativeName":"Português"
  },
  "qu":{
    "name":"Quechua",
    "nativeName":"Runa Simi, Kichwa"
  },
  "rm":{
    "name":"Romansh",
    "nativeName":"rumantsch grischun"
  },
  "rn":{
    "name":"Kirundi",
    "nativeName":"kiRundi"
  },
  "ro":{
    "name":"Romanian, Moldavian, Moldovan",
    "nativeName":"română"
  },
  "ru":{
    "name":"Russian",
    "nativeName":"русский"
  },
  "sa":{
    "name":"Sanskrit (Saṁskṛta)",
    "nativeName":"संस्कृतम्"
  },
  "sc":{
    "name":"Sardinian",
    "nativeName":"sardu"
  },
  "sd":{
    "name":"Sindhi",
    "nativeName":"सिन्धी, سنڌي، سندھی‎"
  },
  "se":{
    "name":"Northern Sami",
    "nativeName":"Davvisámegiella"
  },
  "sm":{
    "name":"Samoan",
    "nativeName":"gagana faa Samoa"
  },
  "sg":{
    "name":"Sango",
    "nativeName":"yângâ tî sängö"
  },
  "sr":{
    "name":"Serbian",
    "nativeName":"српски језик"
  },
  "gd":{
    "name":"Scottish Gaelic; Gaelic",
    "nativeName":"Gàidhlig"
  },
  "sn":{
    "name":"Shona",
    "nativeName":"chiShona"
  },
  "si":{
    "name":"Sinhala, Sinhalese",
    "nativeName":"සිංහල"
  },
  "sk":{
    "name":"Slovak",
    "nativeName":"slovenčina"
  },
  "sl":{
    "name":"Slovene",
    "nativeName":"slovenščina"
  },
  "so":{
    "name":"Somali",
    "nativeName":"Soomaaliga, af Soomaali"
  },
  "st":{
    "name":"Southern Sotho",
    "nativeName":"Sesotho"
  },
  "es":{
    "name":"Spanish; Castilian",
    "nativeName":"español, castellano"
  },
  "su":{
    "name":"Sundanese",
    "nativeName":"Basa Sunda"
  },
  "sw":{
    "name":"Swahili",
    "nativeName":"Kiswahili"
  },
  "ss":{
    "name":"Swati",
    "nativeName":"SiSwati"
  },
  "sv":{
    "name":"Swedish",
    "nativeName":"svenska"
  },
  "ta":{
    "name":"Tamil",
    "nativeName":"தமிழ்"
  },
  "te":{
    "name":"Telugu",
    "nativeName":"తెలుగు"
  },
  "tg":{
    "name":"Tajik",
    "nativeName":"тоҷикӣ, toğikī, تاجیکی‎"
  },
  "th":{
    "name":"Thai",
    "nativeName":"ไทย"
  },
  "ti":{
    "name":"Tigrinya",
    "nativeName":"ትግርኛ"
  },
  "bo":{
    "name":"Tibetan Standard, Tibetan, Central",
    "nativeName":"བོད་ཡིག"
  },
  "tk":{
    "name":"Turkmen",
    "nativeName":"Türkmen, Түркмен"
  },
  "tl":{
    "name":"Tagalog",
    "nativeName":"Wikang Tagalog, ᜏᜒᜃᜅ᜔ ᜆᜄᜎᜓᜄ᜔"
  },
  "tn":{
    "name":"Tswana",
    "nativeName":"Setswana"
  },
  "to":{
    "name":"Tonga (Tonga Islands)",
    "nativeName":"faka Tonga"
  },
  "tr":{
    "name":"Turkish",
    "nativeName":"Türkçe"
  },
  "ts":{
    "name":"Tsonga",
    "nativeName":"Xitsonga"
  },
  "tt":{
    "name":"Tatar",
    "nativeName":"татарча, tatarça, تاتارچا‎"
  },
  "tw":{
    "name":"Twi",
    "nativeName":"Twi"
  },
  "ty":{
    "name":"Tahitian",
    "nativeName":"Reo Tahiti"
  },
  "ug":{
    "name":"Uighur, Uyghur",
    "nativeName":"Uyƣurqə, ئۇيغۇرچە‎"
  },
  "uk":{
    "name":"Ukrainian",
    "nativeName":"українська"
  },
  "ur":{
    "name":"Urdu",
    "nativeName":"اردو"
  },
  "uz":{
    "name":"Uzbek",
    "nativeName":"zbek, Ўзбек, أۇزبېك‎"
  },
  "ve":{
    "name":"Venda",
    "nativeName":"Tshivenḓa"
  },
  "vi":{
    "name":"Vietnamese",
    "nativeName":"Tiếng Việt"
  },
  "vo":{
    "name":"Volapük",
    "nativeName":"Volapük"
  },
  "wa":{
    "name":"Walloon",
    "nativeName":"Walon"
  },
  "cy":{
    "name":"Welsh",
    "nativeName":"Cymraeg"
  },
  "wo":{
    "name":"Wolof",
    "nativeName":"Wollof"
  },
  "fy":{
    "name":"Western Frisian",
    "nativeName":"Frysk"
  },
  "xh":{
    "name":"Xhosa",
    "nativeName":"isiXhosa"
  },
  "yi":{
    "name":"Yiddish",
    "nativeName":"ייִדיש"
  },
  "yo":{
    "name":"Yoruba",
    "nativeName":"Yorùbá"
  },
  "za":{
    "name":"Zhuang, Chuang",
    "nativeName":"Saɯ cueŋƅ, Saw cuengh"
  }
}


